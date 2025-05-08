from fastapi import APIRouter, Depends, Form, HTTPException
from fastapi.responses import JSONResponse
import hashlib
from utils.response import manejo_errores, formato_respuesta, handle_exception
from datetime import datetime
import json
import requests
from dotenv import load_dotenv
import os
from loguru import logger

index  = APIRouter()

@index.get("/")
async def base():
    api_details = {
        "name": "Mi API Genial",
        "version": "1.0.0",  # Esto puedes cambiarlo dinámicamente si tienes un archivo setup.py
        "build_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),  # Fecha de compilación
        "author": "Wolfu Dev",
        "copyright": "© 2025 Wolfu Inc. Todos los derechos reservados.",
    }
    # Devolver la info como JSON
    return JSONResponse(content=api_details)


@index.get("/BusquedaPokemon/{pokemon}")
async def buscar_pokemons(pokemon: str):
    load_dotenv()
    
    API_URL = os.getenv("POKEMON_TCG_API_URL")
    API_KEY = os.getenv("POKEMON_TCG_API_KEY")
    
    try:
        if not pokemon:
            handle_exception("Nombre no proporcionado", 400)
        
        if not API_KEY:
            handle_exception("API Key no configurada", 500)
        
        headers = {
            "X-Api-Key": API_KEY
        }
        parts = pokemon.split()
        if len(parts) >= 2 and parts[-1].isdigit():
            # Si el último fragmento es un número -> filtramos por name Y number
            number = parts[-1]
            name = " ".join(parts[:-1])
            url = f"{API_URL}?q=name:\"{name}\" number:{number}"
        else:
            # Solo por nombre
            name = pokemon
            url = f"{API_URL}?q=name:*{name}*"
        
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            logger.error(f"Error al consultar la API de Pokémon: {response.status_code} - {response.text}")
            handle_exception("Error al consultar la API de Pokémon", 500)
        
        data = response.json()
        
        if not data.get("data"):
            handle_exception("No se encontraron cartas", 404)

        pokemons = {}
        for card in data["data"]:
            name = card["name"]
            number = card["number"]
            key = f"{name}-{number}"
            pokemons[key] = {
                "nombre_carta": name,
                "numero": number
            }
        
        return formato_respuesta(
            {
                "Cartas": pokemons
            },
            "Búsqueda exitosa"
        )
    
    except HTTPException as http_error:
        logger.error(f"HTTPException: {http_error.detail}")
        raise http_error
    except Exception as e:
        return manejo_errores(e, "Error al buscar cartas de Pokémon", "buscar_pokemons")

@index.get("/BusquedaPokemonDetalle/{nombre_carta}/{numero}")
async def buscar_pokemon_detalle(nombre_carta: str, numero: str):
    try:
        load_dotenv()   
        API_URL = os.getenv("POKEMON_TCG_API_URL")
        API_KEY = os.getenv("POKEMON_TCG_API_KEY")
        
        if not nombre_carta:
            raise HTTPException(status_code=400, detail="Nombre no proporcionado")
        
        if not numero:
            raise HTTPException(status_code=400, detail="Nombre no proporcionado")
        
        if not API_KEY:
            raise HTTPException(status_code=500, detail="API Key no configurada")
        
        url = f'{API_URL}?q=name:"{nombre_carta}" number:{numero}'
        headers = {'X-Api-Key': API_KEY}
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # sigue funcionando igual
        
        data = response.json()
        
        if not data or not data.get('data'):
                raise HTTPException(status_code=404, detail="No se encontró la carta")
        card = next((c for c in data['data'] if c['number'] == numero), None)
        
        if not card:
            raise HTTPException(status_code=404, detail="No se encontró la carta con ese número")
        print(card.get('tcgplayer', {}))
        
        ediciones = {}
        for tipo, valores in card.get('tcgplayer', {}).get('prices', {}).items():
            if not isinstance(valores, dict):
                continue

            direct_low = valores.get("directLow")
            market = valores.get("market")

            if direct_low is not None:
                ediciones[tipo] = {"valor": direct_low}
            elif market is not None:
                ediciones[tipo] = {"valor": market}

        # Valor destacado puede ser el primero que exista
        valor_destacado = next(
            (v["valor"] for v in ediciones.values() if v.get("valor")), ''
        )
        data = {
            "nombre": f"{card['name']} {card['number']}",
            "numero": card['number'],
            "imagen": card['images'].get('large') or card['images'].get('small', ''),
            "valor_actual": valor_destacado,
            "rareza": card.get('rarity', ''),
            "set": card.get('set', {}).get('name', ''),
            "set_series": card.get('set', {}).get('series', ''),
            "url_tcgplayer": card.get('tcgplayer', {}).get('url', ''),
            "precios_ediciones": ediciones
        }
        return formato_respuesta(
            {
                "Dato": data
            },
            "Búsqueda exitosa"
        )
    except HTTPException as http_error:
        logger.error(f"HTTPException: {http_error.detail}")
        raise http_error
    except Exception as e:
        return manejo_errores(e, "Error al buscar cartas de Pokémon", "buscar_pokemon_detalle")
