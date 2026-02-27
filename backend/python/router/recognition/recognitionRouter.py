from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image, ImageEnhance
import pytesseract
import io
import requests
import os
from dotenv import load_dotenv
from loguru import logger
from utils.response import formato_respuesta, manejo_errores

load_dotenv()
API_URL = os.getenv("POKEMON_TCG_API_URL")
API_KEY = os.getenv("POKEMON_TCG_API_KEY")

recognition = APIRouter()


@recognition.post("/ReconocimientoCarta")
async def reconocer_carta(file: UploadFile = File(...)):
    """
    Recibe una imagen (captura de cámara web) e intenta identificar
    la carta Pokémon usando OCR sobre el nombre impreso en la carta.
    """
    try:
        if not API_KEY:
            raise HTTPException(status_code=500, detail="API Key no configurada")

        # Read uploaded image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        # Convert to RGB to ensure compatibility
        image = image.convert("RGB")
        width, height = image.size

        # Crop the top ~15% of the card where the Pokémon name is printed
        name_region = image.crop((0, 0, width, int(height * 0.15)))

        # Enhance contrast to improve OCR accuracy
        grayscale = name_region.convert("L")
        enhancer = ImageEnhance.Contrast(grayscale)
        enhanced = enhancer.enhance(2.5)

        # Run OCR
        raw_text = pytesseract.image_to_string(enhanced, config="--psm 6").strip()

        logger.info(f"OCR raw output: {raw_text!r}")

        # Take the first non-empty line as the card name
        lines = [line.strip() for line in raw_text.split("\n") if line.strip()]
        if not lines:
            raise HTTPException(
                status_code=422,
                detail="No se pudo extraer texto de la imagen. Asegúrate de que la carta sea visible y esté bien iluminada.",
            )

        card_name = lines[0]
        logger.info(f"Nombre de carta detectado: {card_name}")

        # Search in the Pokémon TCG API
        headers = {"X-Api-Key": API_KEY}
        url = f"{API_URL}?q=name:*{card_name}*"
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            logger.error(f"Error al consultar la API: {response.status_code} - {response.text}")
            raise HTTPException(status_code=500, detail="Error al consultar la API de Pokémon")

        data = response.json()

        if not data.get("data"):
            raise HTTPException(
                status_code=404,
                detail=f"No se encontraron cartas para el nombre detectado: '{card_name}'",
            )

        cards = {}
        for card in data["data"]:
            name = card["name"]
            number = card["number"]
            key = f"{name}-{number}"
            cards[key] = {"nombre_carta": name, "numero": number}

        return formato_respuesta(
            {"texto_extraido": card_name, "Cartas": cards},
            "Reconocimiento exitoso",
        )

    except HTTPException as http_error:
        logger.error(f"HTTPException: {http_error.detail}")
        raise http_error
    except Exception as e:
        return manejo_errores(e, "Error al reconocer carta", "reconocer_carta")
