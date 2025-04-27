# from utils.token import create_token
# from fastapi import APIRouter, Depends, Form
# from model.token.tokenModel import consultar_usuario_psg
# from model.token.loginModel import Login
# from datetime import datetime, timedelta, timezone
# from utils.token import verify_token

# tokenRout = APIRouter()
# @tokenRout.post("/signup_user/")
# async def login_for_access_token_v2(username: str = Form(...), password: str = Form(...)):
#     try:
#         id_personal = consultar_usuario_psg(username, password)
#         #que tipo de id_personal es
#         print(id_personal)
#         if isinstance(id_personal, dict):
#             if id_personal == [] or id_personal == {}:
#                 if 'message' in id_personal:
#                     return id_personal
#             else:
#                 if 'message' in id_personal:
#                     return id_personal
#         id_personal = int(id_personal)
#         access_token_expires = timedelta(hours=1)
#         access_token = create_token(data={"sub": id_personal}, expires_delta=access_token_expires)
#         return {"access_token": access_token, "token_type": "header"}
#     except Exception as e:
#         return {"message": "Error al obtener el token de acceso : " + str(e)}
    
# @tokenRout.get("/secure-endpoint")
# async def secure_endpoint(token_data = Depends(verify_token)):
#     return {"message": "Access granted", "data": token_data}