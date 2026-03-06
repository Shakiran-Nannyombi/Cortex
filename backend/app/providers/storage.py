"""Storage provider abstraction."""
import os
import shutil
from abc import ABC, abstractmethod


class StorageProvider(ABC):
    """Abstract base class for storage providers."""

    @abstractmethod
    def upload(self, local_path: str, remote_path: str) -> str:
        """Upload a file and return the storage URL."""
        pass

    @abstractmethod
    def download(self, remote_path: str, local_path: str) -> None:
        """Download a file from storage."""
        pass

    @abstractmethod
    def delete(self, remote_path: str) -> None:
        """Delete a file from storage."""
        pass


class LocalStorage(StorageProvider):
    """Local filesystem storage provider."""

    def __init__(self):
        self.base_path = os.environ.get("UPLOAD_FOLDER", "/tmp/cortex/uploads")
        os.makedirs(self.base_path, exist_ok=True)

    def upload(self, local_path: str, remote_path: str) -> str:
        dest = os.path.join(self.base_path, remote_path)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copy2(local_path, dest)
        return dest

    def download(self, remote_path: str, local_path: str) -> None:
        src = os.path.join(self.base_path, remote_path)
        shutil.copy2(src, local_path)

    def delete(self, remote_path: str) -> None:
        path = os.path.join(self.base_path, remote_path)
        if os.path.exists(path):
            os.remove(path)


class GCSStorage(StorageProvider):
    """Google Cloud Storage provider."""

    def __init__(self):
        from google.cloud import storage

        self.client = storage.Client()
        self.bucket_name = os.environ.get("STORAGE_BUCKET", "")
        self.bucket = self.client.bucket(self.bucket_name)

    def upload(self, local_path: str, remote_path: str) -> str:
        blob = self.bucket.blob(remote_path)
        blob.upload_from_filename(local_path)
        return f"gs://{self.bucket_name}/{remote_path}"

    def download(self, remote_path: str, local_path: str) -> None:
        blob = self.bucket.blob(remote_path)
        blob.download_to_filename(local_path)

    def delete(self, remote_path: str) -> None:
        blob = self.bucket.blob(remote_path)
        blob.delete()


class S3Storage(StorageProvider):
    """AWS S3 storage provider."""

    def __init__(self):
        import boto3

        self.client = boto3.client("s3")
        self.bucket_name = os.environ.get("STORAGE_BUCKET", "")

    def upload(self, local_path: str, remote_path: str) -> str:
        self.client.upload_file(local_path, self.bucket_name, remote_path)
        return f"s3://{self.bucket_name}/{remote_path}"

    def download(self, remote_path: str, local_path: str) -> None:
        self.client.download_file(self.bucket_name, remote_path, local_path)

    def delete(self, remote_path: str) -> None:
        self.client.delete_object(Bucket=self.bucket_name, Key=remote_path)


class AzureBlobStorage(StorageProvider):
    """Azure Blob Storage provider."""

    def __init__(self):
        from azure.storage.blob import BlobServiceClient

        conn_str = os.environ.get("AZURE_STORAGE_CONNECTION_STRING", "")
        self.client = BlobServiceClient.from_connection_string(conn_str)
        self.container_name = os.environ.get("STORAGE_BUCKET", "")
        self.container = self.client.get_container_client(self.container_name)

    def upload(self, local_path: str, remote_path: str) -> str:
        with open(local_path, "rb") as f:
            self.container.upload_blob(remote_path, f, overwrite=True)
        return f"azure://{self.container_name}/{remote_path}"

    def download(self, remote_path: str, local_path: str) -> None:
        blob = self.container.get_blob_client(remote_path)
        with open(local_path, "wb") as f:
            data = blob.download_blob()
            data.readinto(f)

    def delete(self, remote_path: str) -> None:
        blob = self.container.get_blob_client(remote_path)
        blob.delete_blob()


def get_storage_provider() -> StorageProvider:
    """Get the configured storage provider."""
    provider = os.environ.get("STORAGE_PROVIDER", "local").lower()

    providers = {
        "local": LocalStorage,
        "gcs": GCSStorage,
        "s3": S3Storage,
        "azure_blob": AzureBlobStorage,
    }

    provider_class = providers.get(provider, LocalStorage)
    return provider_class()
