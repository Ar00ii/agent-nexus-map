from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from google import genai 

# --- TU CLAVE API ---
API_KEY = "AIzaSyCCQdSWdpgAWhHwclYws5HrfLHsJXIsfqE"

# Configuración del cliente
try:
    client = genai.Client(api_key=API_KEY)
    print("✅ Cliente Gemini activado")
except Exception as e:
    print(f"❌ Error activando cliente: {e}")

app = FastAPI()

# --- CORS (Crucial para que la web acepte el paquete) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str 

@app.get("/")
def read_root():
    return {"status": "Nexus AI Backend Online"}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        print(f"📩 Pregunta recibida: {request.message}")
        
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=request.message
        )
        
        texto_ia = response.text
        print(f"🤖 Respuesta IA: {texto_ia}") 

        # --- LA LLAVE UNIVERSAL ---
        # Enviamos el dato con TODAS las etiquetas posibles
        return {
            "response": texto_ia,  # Estándar 1
            "answer": texto_ia,    # Estándar 2
            "message": texto_ia,   # Estándar 3
            "content": texto_ia,   # Estándar 4
            "reply": texto_ia,     # Estándar 5
            "text": texto_ia,      # Estándar 6
            "sources": []          # Por si la web busca fuentes y falla si no las ve
        }

    except Exception as e:
        print(f"❌ Error generando respuesta: {e}")
        return {
            "response": "Error interno", 
            "answer": "Error interno",
            "message": "Error interno"
        }

if __name__ == "__main__":
    # Puerto 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)