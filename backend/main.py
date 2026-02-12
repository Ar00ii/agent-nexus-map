from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

# Configurar cliente de Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY no encontrada en el archivo .env")

client = genai.Client(api_key=api_key)

# Crear app FastAPI
app = FastAPI(title="Moltbook AI Backend")

# Configurar CORS para conectar con el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de datos
class Message(BaseModel):
    message: str

# Ruta principal para verificar que el backend funciona
@app.get("/")
async def root():
    return {"status": "Moltbook AI Backend corriendo correctamente"}

# Ruta del chat con IA
@app.post("/chat")
async def chat(msg: Message):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=msg.message
        )
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
