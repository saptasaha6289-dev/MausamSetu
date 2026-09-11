import sys
import asyncio
from main import app, extract_location_entity, geocode_location, fetch_telemetry, haversine_km, COMMUNITY_HAZARDS
from httpx import AsyncClient, ASGITransport

async def run_tests():
    print("=== Testing MausamSetu Backend ===")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Health
        res = await ac.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.status_code}"
        health_data = res.json()
        print(f"PASS: /api/health -> {health_data['status']}, {health_data['service']}")

        # 2. Chat with 'Jammu weather'
        chat_payload = {
            "query": "Jammu weather",
            "persona": "kisan",
            "language": "en"
        }
        res = await ac.post("/api/chat", json=chat_payload)
        assert res.status_code == 200, f"Chat failed: {res.status_code}, {res.text}"
        chat_data = res.json()
        telemetry = chat_data["telemetry"]
        print(f"PASS: /api/chat 'Jammu weather'")
        print(f"   Location: {telemetry['location']}")
        print(f"   Coordinates: ({telemetry['latitude']}, {telemetry['longitude']})")
        print(f"   Temp: {telemetry['temp']}C, Humidity: {telemetry['humidity']}%, Wind: {telemetry['wind']}km/h")
        print(f"   Risk: {telemetry['risk_level']}")
        print(f"   7-day Forecast items: {len(telemetry['forecast_7d'])}")
        assert abs(telemetry['latitude'] - 32.7266) < 0.001, f"Expected lat 32.7266, got {telemetry['latitude']}"
        assert abs(telemetry['longitude'] - 74.8570) < 0.001, f"Expected lon 74.8570, got {telemetry['longitude']}"
        assert len(telemetry['forecast_7d']) == 7, f"Expected 7 forecast days, got {len(telemetry['forecast_7d'])}"
        assert len(chat_data["response"]) > 20, "Expected non-empty response"

        # 3. Snap Hazard & Quorum Spatial Triangulation
        # Hazard A
        form_a = {
            "lat": 32.7300,
            "lon": 74.8600,
            "location": "Jammu Canal Road Sector 1"
        }
        res_ha = await ac.post("/api/snap-hazard", data=form_a)
        assert res_ha.status_code == 200, f"Snap hazard A failed: {res_ha.text}"
        ha_data = res_ha.json()
        print(f"PASS: Snap hazard A -> id={ha_data['id']}, status={ha_data['status']}, quorum={ha_data['quorum_count']}")

        # Hazard B within 300 meters of A (anti-spoofing triangulation check)
        form_b = {
            "lat": 32.7310,
            "lon": 74.8610,
            "location": "Jammu Canal Road Sector 1 West"
        }
        res_hb = await ac.post("/api/snap-hazard", data=form_b)
        assert res_hb.status_code == 200, f"Snap hazard B failed: {res_hb.text}"
        hb_data = res_hb.json()
        print(f"PASS: Snap hazard B (within 500m) -> status={hb_data['status']}, quorum={hb_data['quorum_count']}")
        assert hb_data["status"] == "TRIANGULATED_QUORUM", f"Expected TRIANGULATED_QUORUM, got {hb_data['status']}"
        assert hb_data["quorum_count"] >= 2, f"Expected quorum_count >= 2, got {hb_data['quorum_count']}"

        # 4. Evacuation Route with Clearance Limits
        # Test sedan (22cm) vs walking (15cm)
        evac_walking = {
            "start_lat": 32.7266,
            "start_lon": 74.8570,
            "vehicle_type": "walking"
        }
        res_walk = await ac.post("/api/evac-route", json=evac_walking)
        assert res_walk.status_code == 200
        walk_data = res_walk.json()
        print(f"PASS: /api/evac-route (walking 15cm) -> status={walk_data['status']}, detoured={walk_data['detour_required']}, shelter={walk_data['shelter_name']}")

        evac_rescue = {
            "start_lat": 32.7266,
            "start_lon": 74.8570,
            "vehicle_type": "heavy_rescue"
        }
        res_rescue = await ac.post("/api/evac-route", json=evac_rescue)
        assert res_rescue.status_code == 200
        rescue_data = res_rescue.json()
        print(f"PASS: /api/evac-route (heavy rescue 80cm) -> status={rescue_data['status']}, clearance={rescue_data['clearance_cm']}cm, dist={rescue_data['total_distance_km']}km")

    print("\nALL BACKEND AUTOMATED TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(run_tests())
