from fastapi import APIRouter, Depends, Form
from fastapi.responses import JSONResponse
import hashlib
from utils.response import manejo_errores, formato_respuesta
from datetime import datetime
import json

index  = APIRouter()

@index.get("/")
async def root():
    api_details = {
        "name": "Mi API Genial",
        "version": "1.0.0",  # Esto puedes cambiarlo dinámicamente si tienes un archivo setup.py
        "build_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),  # Fecha de compilación
        "author": "Wolfu Dev",
        "copyright": "© 2025 Wolfu Inc. Todos los derechos reservados.",
    }
    # Devolver la info como JSON
    return JSONResponse(content=api_details)


@index.get("/BusquedaPokemon/{nombre}")
async def buscar_pokemons(nombre:str):
    try:
        
        
        
        print("Hola")
        return {"Result": "Hola"}
    except Exception as e:
        return manejo_errores(e, "Error al obtener data /login", "loginRouter")