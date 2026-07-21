import pytest


@pytest.mark.asyncio
async def test_create_lead_success(client, valid_payload):
    response = await client.post("/api/leads", json=valid_payload)
    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "accepted"
    assert "id" in body


@pytest.mark.asyncio
async def test_create_lead_empty_name(client, valid_payload):
    valid_payload["name"] = "   "
    response = await client.post("/api/leads", json=valid_payload)
    assert response.status_code == 422
    assert response.json()["type"] == "urn:simandev:validation-error"


@pytest.mark.asyncio
async def test_create_lead_invalid_phone(client, valid_payload):
    valid_payload["phone"] = "+7123"
    response = await client.post("/api/leads", json=valid_payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_lead_consent_false(client, valid_payload):
    valid_payload["consent"] = False
    response = await client.post("/api/leads", json=valid_payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_honeypot_marks_spam_without_notification(
    client,
    valid_payload,
    _mock_notifications,
):
    valid_payload["honeypot"] = "bot-company"
    response = await client.post("/api/leads", json=valid_payload)
    assert response.status_code == 201
    assert response.json()["status"] == "accepted"
    _mock_notifications.assert_not_called()


@pytest.mark.asyncio
async def test_create_lead_missing_consent_version(client, valid_payload):
    del valid_payload["consent_text_version"]
    response = await client.post("/api/leads", json=valid_payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_rate_limit(client, valid_payload):
    statuses = []
    for _ in range(6):
        response = await client.post("/api/leads", json=valid_payload)
        statuses.append(response.status_code)
    assert 429 in statuses
