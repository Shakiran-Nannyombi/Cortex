"""Tests for workspace and folder endpoints."""
import pytest


class TestWorkspaces:
    """Workspace endpoint tests."""

    def test_create_workspace(self, client, auth_headers):
        """Test creating a workspace."""
        response = client.post("/api/workspaces", json={
            "name": "My Workspace",
            "description": "Test workspace",
        }, headers=auth_headers)
        assert response.status_code == 201
        data = response.get_json()
        assert data["workspace"]["name"] == "My Workspace"

    def test_list_workspaces(self, client, auth_headers):
        """Test listing workspaces."""
        client.post("/api/workspaces", json={
            "name": "Workspace 1",
        }, headers=auth_headers)
        client.post("/api/workspaces", json={
            "name": "Workspace 2",
        }, headers=auth_headers)

        response = client.get("/api/workspaces", headers=auth_headers)
        assert response.status_code == 200
        data = response.get_json()
        assert len(data["workspaces"]) == 2

    def test_update_workspace(self, client, auth_headers):
        """Test updating a workspace."""
        create_resp = client.post("/api/workspaces", json={
            "name": "Original",
        }, headers=auth_headers)
        ws_id = create_resp.get_json()["workspace"]["id"]

        response = client.put(f"/api/workspaces/{ws_id}", json={
            "name": "Updated",
        }, headers=auth_headers)
        assert response.status_code == 200
        assert response.get_json()["workspace"]["name"] == "Updated"

    def test_delete_workspace(self, client, auth_headers):
        """Test deleting a workspace."""
        create_resp = client.post("/api/workspaces", json={
            "name": "To Delete",
        }, headers=auth_headers)
        ws_id = create_resp.get_json()["workspace"]["id"]

        response = client.delete(f"/api/workspaces/{ws_id}", headers=auth_headers)
        assert response.status_code == 200


class TestTags:
    """Tag endpoint tests."""

    def test_create_tag(self, client, auth_headers):
        """Test creating a tag."""
        response = client.post("/api/tags", json={
            "name": "Important",
            "color": "#FF0000",
        }, headers=auth_headers)
        assert response.status_code == 201
        data = response.get_json()
        assert data["tag"]["name"] == "Important"

    def test_list_tags(self, client, auth_headers):
        """Test listing tags."""
        client.post("/api/tags", json={"name": "Tag1"}, headers=auth_headers)
        client.post("/api/tags", json={"name": "Tag2"}, headers=auth_headers)

        response = client.get("/api/tags", headers=auth_headers)
        assert response.status_code == 200
        data = response.get_json()
        assert len(data["tags"]) == 2

    def test_duplicate_tag(self, client, auth_headers):
        """Test creating duplicate tag."""
        client.post("/api/tags", json={"name": "Dup"}, headers=auth_headers)
        response = client.post("/api/tags", json={"name": "Dup"}, headers=auth_headers)
        assert response.status_code == 409

    def test_delete_tag(self, client, auth_headers):
        """Test deleting a tag."""
        create_resp = client.post("/api/tags", json={
            "name": "ToDelete",
        }, headers=auth_headers)
        tag_id = create_resp.get_json()["tag"]["id"]

        response = client.delete(f"/api/tags/{tag_id}", headers=auth_headers)
        assert response.status_code == 200
