"""Tests for document endpoints."""
import io
import pytest


class TestDocuments:
    """Document endpoint tests."""

    def test_upload_document(self, client, auth_headers, upload_dir):
        """Test uploading a document."""
        data = {
            "file": (io.BytesIO(b"Hello World"), "test.txt"),
            "title": "Test Document",
        }
        response = client.post(
            "/api/documents",
            data=data,
            content_type="multipart/form-data",
            headers=auth_headers,
        )
        assert response.status_code == 201
        result = response.get_json()
        assert result["document"]["title"] == "Test Document"
        assert result["document"]["filename"] == "test.txt"

    def test_upload_no_file(self, client, auth_headers):
        """Test upload without file."""
        response = client.post(
            "/api/documents",
            data={},
            content_type="multipart/form-data",
            headers=auth_headers,
        )
        assert response.status_code == 400

    def test_upload_invalid_extension(self, client, auth_headers, upload_dir):
        """Test upload with invalid file extension."""
        data = {
            "file": (io.BytesIO(b"test"), "test.exe"),
        }
        response = client.post(
            "/api/documents",
            data=data,
            content_type="multipart/form-data",
            headers=auth_headers,
        )
        assert response.status_code == 400

    def test_list_documents(self, client, auth_headers, upload_dir):
        """Test listing documents."""
        # Upload a document first
        client.post(
            "/api/documents",
            data={"file": (io.BytesIO(b"content"), "test.txt"), "title": "Doc1"},
            content_type="multipart/form-data",
            headers=auth_headers,
        )

        response = client.get("/api/documents", headers=auth_headers)
        assert response.status_code == 200
        data = response.get_json()
        assert "documents" in data
        assert data["total"] >= 1

    def test_get_document(self, client, auth_headers, upload_dir):
        """Test getting a specific document."""
        upload_resp = client.post(
            "/api/documents",
            data={"file": (io.BytesIO(b"content"), "test.txt"), "title": "MyDoc"},
            content_type="multipart/form-data",
            headers=auth_headers,
        )
        doc_id = upload_resp.get_json()["document"]["id"]

        response = client.get(f"/api/documents/{doc_id}", headers=auth_headers)
        assert response.status_code == 200
        assert response.get_json()["document"]["title"] == "MyDoc"

    def test_delete_document(self, client, auth_headers, upload_dir):
        """Test deleting a document."""
        upload_resp = client.post(
            "/api/documents",
            data={"file": (io.BytesIO(b"content"), "test.txt")},
            content_type="multipart/form-data",
            headers=auth_headers,
        )
        doc_id = upload_resp.get_json()["document"]["id"]

        response = client.delete(f"/api/documents/{doc_id}", headers=auth_headers)
        assert response.status_code == 200

    def test_search_requires_query(self, client, auth_headers):
        """Test search without query parameter."""
        response = client.get("/api/search", headers=auth_headers)
        assert response.status_code == 400
