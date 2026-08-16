"""
SynTrait
Comparative Genomics Platform for Agronomic Trait Discovery

Author: Balaji Muthukumar
Project: SynTrait
"""
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_stats():
    response = client.get("/stats")
    assert response.status_code == 200
    data = response.json()
    assert "candidates_count" in data
    assert data["candidates_count"] > 0

def test_get_candidates():
    response = client.get("/candidates?limit=2")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert len(data["data"]) == 2

def test_get_validation():
    response = client.get("/validation")
    assert response.status_code == 200
    data = response.json()
    assert data["total_evaluated"] == 40
    assert data["mrr"] == 0.0
