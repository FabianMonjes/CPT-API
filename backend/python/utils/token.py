from pydantic import BaseModel
from passlib.context import CryptContext
from fastapi import FastAPI, Header, Depends, HTTPException
from datetime import datetime, timedelta, timezone
import jwt
# from model.token.userModel import User
from typing import Optional
from loguru import logger

import os
from dotenv import load_dotenv
load_dotenv()
# pm2 start "uvicorn main:app --host 192.168.66.140 --port 3000" --name "api_utils" --watch
SECRET_KEY =  os.getenv("SECRET_KEY") 
ALGORITHM =  os.getenv("ALGORITHM_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def create_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)  # Duración por defecto
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
    
async def verify_token(access_token: Optional[str] = Header(None)):
    try:
        if not access_token:
            return {"message": "Access token header not found"}

        token = access_token
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            id_personal = payload.get("sub")
            if id_personal is None:
                return {"message": "Invalid token (no 'sub' claim found)"}
            
            return id_personal
        
        except jwt.ExpiredSignatureError:
            return {"message": "Token expired"}
        
        except jwt.InvalidTokenError as e:
            return {"message": f"Invalid token: {str(e)}"}

    except Exception as e:
        return {"message": f"Token verification failed: {str(e)}"}