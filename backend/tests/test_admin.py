import pytest

from app.core.config import reset_settings_cache
from app.main import create_app


@pytest.mark.asyncio
async def test_admin_requires_auth(client):
    response = await client.get("/api/admin/leads")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_admin_list_and_patch(client, valid_payload, admin_auth):
    create_response = await client.post("/api/leads", json=valid_payload)
    lead_id = create_response.json()["id"]

    list_response = await client.get("/api/admin/leads", auth=admin_auth)
    assert list_response.status_code == 200
    body = list_response.json()
    assert body["total"] >= 1
    assert any(item["id"] == lead_id for item in body["items"])

    patch_response = await client.patch(
        f"/api/admin/leads/{lead_id}",
        json={"status": "processed"},
        auth=admin_auth,
    )
    assert patch_response.status_code == 200
    assert patch_response.json()["status"] == "processed"


@pytest.mark.asyncio
async def test_admin_disabled_returns_404(client, monkeypatch):
    monkeypatch.setenv("ENABLE_ADMIN", "false")
    reset_settings_cache()
    disabled_app = create_app()
    from httpx import ASGITransport, AsyncClient

    transport = ASGITransport(app=disabled_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/admin/leads")
        assert response.status_code == 404
