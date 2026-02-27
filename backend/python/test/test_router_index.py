import os
import sys
from unittest.mock import patch, MagicMock

import pytest
from fastapi.testclient import TestClient

# Ensure the application module is on the Python path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from main import app  # noqa: E402

client = TestClient(app)


def test_base_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    body = response.json()
    assert body.get("name") == "Mi API Genial"
    assert "version" in body


@patch("router.index.routerIndex.requests.get")
def test_busqueda_pokemon(mock_get, monkeypatch):
    monkeypatch.setenv("POKEMON_TCG_API_URL", "https://api.example.com")
    monkeypatch.setenv("POKEMON_TCG_API_KEY", "testkey")

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "data": [
            {
                "name": "Pikachu",
                "number": "1"
            }
        ]
    }
    mock_get.return_value = mock_response

    response = client.get("/BusquedaPokemon/Pikachu")
    assert response.status_code == 200
    body = response.json()
    assert body["resultado"]["Cartas"]["Pikachu-1"]["nombre_carta"] == "Pikachu"


@patch("router.index.routerIndex.requests.get")
def test_busqueda_pokemon_detalle(mock_get, monkeypatch):
    monkeypatch.setenv("POKEMON_TCG_API_URL", "https://api.example.com")
    monkeypatch.setenv("POKEMON_TCG_API_KEY", "testkey")

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "data": [
            {
                "name": "Pikachu",
                "number": "1",
                "images": {"large": "img_large", "small": "img_small"},
                "tcgplayer": {
                    "prices": {
                        "normal": {"market": 1.23}
                    }
                }
            }
        ]
    }
    mock_response.raise_for_status.return_value = None
    mock_get.return_value = mock_response

    response = client.get("/BusquedaPokemonDetalle/Pikachu/1")
    assert response.status_code == 200
    body = response.json()
    assert body["resultado"]["Dato"]["nombre"] == "Pikachu 1"
