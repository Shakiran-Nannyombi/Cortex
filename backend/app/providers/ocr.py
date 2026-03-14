"""OCR provider abstraction."""
import os
from abc import ABC, abstractmethod


class OCRProvider(ABC):
    """Abstract base class for OCR providers."""

    @abstractmethod
    def extract_text(self, file_path: str) -> str:
        """Extract text from an image file."""
        pass


class TesseractOCR(OCRProvider):
    """Tesseract OCR provider (local/default)."""

    def extract_text(self, file_path: str) -> str:
        """Extract text using Tesseract."""
        try:
            import pytesseract
            from PIL import Image

            image = Image.open(file_path)
            return pytesseract.image_to_string(image)
        except Exception as e:
            raise RuntimeError(f"Tesseract OCR failed: {e}")


class GCPVisionOCR(OCRProvider):
    """Google Cloud Vision OCR provider."""

    def extract_text(self, file_path: str) -> str:
        """Extract text using Google Cloud Vision."""
        try:
            import json
            import base64
            from google.cloud import vision
            from google.oauth2 import service_account

            # Try to get credentials from environment
            creds_json = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS_JSON')
            if creds_json:
                # Decode base64-encoded credentials
                creds_dict = json.loads(base64.b64decode(creds_json))
                credentials = service_account.Credentials.from_service_account_info(creds_dict)
                client = vision.ImageAnnotatorClient(credentials=credentials)
            else:
                # Use default credentials (GOOGLE_APPLICATION_CREDENTIALS file or ADC)
                client = vision.ImageAnnotatorClient()

            with open(file_path, "rb") as f:
                content = f.read()
            image = vision.Image(content=content)
            response = client.text_detection(image=image)
            texts = response.text_annotations
            return texts[0].description if texts else ""
        except Exception as e:
            raise RuntimeError(f"GCP Vision OCR failed: {e}")


class AWSTextractOCR(OCRProvider):
    """AWS Textract OCR provider."""

    def extract_text(self, file_path: str) -> str:
        """Extract text using AWS Textract."""
        try:
            import boto3

            client = boto3.client("textract")
            with open(file_path, "rb") as f:
                content = f.read()
            response = client.detect_document_text(
                Document={"Bytes": content}
            )
            blocks = response.get("Blocks", [])
            lines = [
                b["Text"]
                for b in blocks
                if b["BlockType"] == "LINE"
            ]
            return "\n".join(lines)
        except Exception as e:
            raise RuntimeError(f"AWS Textract OCR failed: {e}")


class AzureComputerVisionOCR(OCRProvider):
    """Azure Computer Vision OCR provider."""

    def extract_text(self, file_path: str) -> str:
        """Extract text using Azure Computer Vision."""
        try:
            from azure.cognitiveservices.vision.computervision import (
                ComputerVisionClient,
            )
            from msrest.authentication import CognitiveServicesCredentials

            endpoint = os.environ.get("AZURE_CV_ENDPOINT", "")
            key = os.environ.get("AZURE_CV_KEY", "")
            client = ComputerVisionClient(
                endpoint, CognitiveServicesCredentials(key)
            )

            with open(file_path, "rb") as f:
                result = client.read_in_stream(f, raw=True)

            operation_id = result.headers["Operation-Location"].split("/")[-1]

            import time

            while True:
                read_result = client.get_read_result(operation_id)
                if read_result.status.lower() not in ["notstarted", "running"]:
                    break
                time.sleep(1)

            lines = []
            if read_result.status.lower() == "succeeded":
                for page in read_result.analyze_result.read_results:
                    for line in page.lines:
                        lines.append(line.text)
            return "\n".join(lines)
        except Exception as e:
            raise RuntimeError(f"Azure Computer Vision OCR failed: {e}")


def get_ocr_provider() -> OCRProvider:
    """Get the configured OCR provider."""
    provider = os.environ.get("OCR_PROVIDER", "tesseract").lower()

    providers = {
        "tesseract": TesseractOCR,
        "gcp": GCPVisionOCR,
        "aws": AWSTextractOCR,
        "azure": AzureComputerVisionOCR,
    }

    provider_class = providers.get(provider, TesseractOCR)
    return provider_class()
