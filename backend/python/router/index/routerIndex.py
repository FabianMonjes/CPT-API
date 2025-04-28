from fastapi import APIRouter, Depends, Form, HTTPException
from fastapi.responses import JSONResponse
import hashlib
from utils.response import manejo_errores, formato_respuesta
from datetime import datetime
import json
import httpx
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
            raise HTTPException(status_code=400, detail="Nombre no proporcionado")
        
        if not API_KEY:
            raise HTTPException(status_code=500, detail="API Key no configurada")
        
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
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
        
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Error al consultar la API de Pokémon")
        
        data = response.json()
        
        if not data.get("data"):
            raise HTTPException(status_code=404, detail="No se encontraron cartas")

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
        print(f"Nombre de carta: {nombre_carta}, Número: {numero}")
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
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
        
        data = response.json()
        
        if not data or not data.get('data'):
                raise HTTPException(status_code=404, detail="No se encontró la carta")
        card = next((c for c in data['data'] if c['number'] == numero), None)
        
        if not card:
            raise HTTPException(status_code=404, detail="No se encontró la carta con ese número")
        
        return {
            "nombre": f"{card['name']} {card['number']}",
            "numero": card['number'],
            "imagen": card['images'].get('large') or card['images'].get('small', ''),
            "valor_actual": card.get('cardmarket', {}).get('prices', {}).get('trendPrice', ''),
            "valor_minimo": card.get('cardmarket', {}).get('prices', {}).get('lowPriceExPlus', ''),
            "valor_reversa": card.get('cardmarket', {}).get('prices', {}).get('reverseHoloTrend', ''),
            "valor_maximo": card.get('cardmarket', {}).get('prices', {}).get('avg30', '')
        }
    except HTTPException as http_error:
        logger.error(f"HTTPException: {http_error.detail}")
        raise http_error
    except Exception as e:
        return manejo_errores(e, "Error al buscar cartas de Pokémon", "buscar_pokemon_detalle")
