import os

import httpx

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

BACKEND_URL = (os.getenv("BACKEND_URL") or "http://localhost:8000").rstrip("/")


def api_get_profile(user_id: str) -> dict:
    try:
        response = httpx.get(
            f"{BACKEND_URL}/api/profile",
            params={"userId": user_id},
            timeout=5.0,
        )
        payload = response.json()
    except (httpx.HTTPError, ValueError) as error:
        return {"error": f"Could not reach the profile API: {error}"}

    if payload.get("success") and payload.get("data"):
        return payload["data"]
    return {}


def api_save_profile(user_id: str, fields: dict) -> dict:
    try:
        response = httpx.post(
            f"{BACKEND_URL}/api/home",
            json={"userId": user_id, **fields},
            timeout=5.0,
        )
        payload = response.json()
    except (httpx.HTTPError, ValueError) as error:
        return {"success": False, "message": f"Could not reach the profile API: {error}"}

    if response.is_success and payload.get("success"):
        return {"success": True, "data": payload.get("data", {})}
    return {"success": False, "message": payload.get("message", "Save failed")}
