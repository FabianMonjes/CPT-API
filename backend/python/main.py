from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from router.index.routerIndex import index
from loguru import logger

from fastapi.exceptions import HTTPException
from utils.handlers import http_exception_handler

app = FastAPI()
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    allow_credentials=True,
)

# app.include_router(amos, tags=["Amos"], dependencies=[Depends(verify_token)])
# app.include_router(tokenRout, tags=["Token"])
app.include_router(index, tags=["Index"])
logger.info("...Levantando Api 🦖")
for route in app.routes:
    logger.info(route.path)

# pm2 start "uvicorn main:app --host 192.168.66.140 --port 9040" --name "api_om:9040" --watch