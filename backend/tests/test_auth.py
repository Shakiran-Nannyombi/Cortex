"""Tests for authentication endpoints."""
import pytest


class TestAuth:
    """Authentication endpoint tests."""

    def test_register_success(self, client):
        """Test successful user registration."""
        response = client.post("/api/auth/register", json={
            "email": "new@example.com",
            "username": "newuser",
            "password": "password123",
            "full_name": "New User",
        })
        assert response.status_code == 201
        data = response.get_json()
        assert data["user"]["email"] == "new@example.com"
        assert "access_token" in data
        assert "refresh_token" in data

    def test_register_missing_fields(self, client):
        """Test registration with missing fields."""
        response = client.post("/api/auth/register", json={
            "email": "test@example.com",
        })
        assert response.status_code == 400

    def test_register_short_password(self, client):
        """Test registration with short password."""
        response = client.post("/api/auth/register", json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "short",
        })
        assert response.status_code == 400

    def test_register_duplicate_email(self, client):
        """Test registration with duplicate email."""
        client.post("/api/auth/register", json={
            "email": "dup@example.com",
            "username": "user1",
            "password": "password123",
        })
        response = client.post("/api/auth/register", json={
            "email": "dup@example.com",
            "username": "user2",
            "password": "password123",
        })
        assert response.status_code == 409

    def test_login_success(self, client):
        """Test successful login."""
        client.post("/api/auth/register", json={
            "email": "login@example.com",
            "username": "loginuser",
            "password": "password123",
        })
        response = client.post("/api/auth/login", json={
            "email": "login@example.com",
            "password": "password123",
        })
        assert response.status_code == 200
        data = response.get_json()
        assert "access_token" in data

    def test_login_wrong_password(self, client):
        """Test login with wrong password."""
        client.post("/api/auth/register", json={
            "email": "wrong@example.com",
            "username": "wronguser",
            "password": "password123",
        })
        response = client.post("/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "wrongpassword",
        })
        assert response.status_code == 401

    def test_get_current_user(self, client, auth_headers):
        """Test getting current user profile."""
        response = client.get("/api/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.get_json()
        assert data["user"]["email"] == "test@example.com"

    def test_update_profile(self, client, auth_headers):
        """Test updating user profile."""
        response = client.put("/api/auth/me", json={
            "full_name": "Updated Name",
        }, headers=auth_headers)
        assert response.status_code == 200
        data = response.get_json()
        assert data["user"]["full_name"] == "Updated Name"


class TestHealth:
    """Health check tests."""

    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.get_json()
        assert data["status"] == "healthy"
