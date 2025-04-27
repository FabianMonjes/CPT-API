from fastapi import HTTPException
from fastapi.responses import JSONResponse

# Manejador global de excepciones HTTP
async def http_exception_handler(request, exc: HTTPException):
    return JSONResponse(
        content={
            "message": exc.detail,
            "status": exc.status_code,
        },
        status_code=exc.status_code
    )
