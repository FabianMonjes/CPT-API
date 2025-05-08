from loguru import logger
import traceback
from fastapi.responses import JSONResponse
from fastapi import  HTTPException

# Respuesta exitosa - status dinámico
def formato_respuesta(valores, msg="Solicitud exitosa", status_code=200, ):
    try:
        return JSONResponse(
            content={
                "resultado": valores,
                "message": msg,
                "status": status_code
            },
            status_code=status_code
        )
    except Exception as e:
        return manejo_errores(e, "Error al procesar la respuesta exitosa", "formato_respuesta")

def manejo_errores(error, msg, endpoints, status_code=500):
    try:
        logger.error(f"Error en endpoint {endpoints}: {error}")
        logger.error(traceback.format_exc())
        resultado = {
            "message": msg,
            "error": str(error),
            "endpoints": endpoints,
        }
        return JSONResponse(
            content={"resultado": resultado, "status": status_code},
            status_code=status_code
        )
    except Exception as e:
        # Si hay un error al manejar el error, devolvemos un mensaje más genérico
        logger.error(f"Error al manejar el error: {e}")
        return JSONResponse(
            content={"message": "Error al procesar el error." + str(e)},
            status_code=500
        )
        
def handle_exception(detail, status_code=500):
    try:
        logger.error(f"Error: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=400, detail=detail)
    except Exception as e:
        return manejo_errores(e, "Error al procesar la excepción", "handle_exception")