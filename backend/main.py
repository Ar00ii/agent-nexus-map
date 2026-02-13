import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from google import genai

API_KEY = os.environ.get("GEMINI_API_KEY", "")

client = None
if API_KEY:
    try:
        client = genai.Client(api_key=API_KEY)
    except Exception as e:
        print(f"Error activando cliente Gemini: {e}")

app = FastAPI()

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
    if not client:
        return {"reply": "Backend no configurado. Establece GEMINI_API_KEY."}

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=request.message
        )

        return {"reply": response.text}

    except Exception as e:
        print(f"Error generando respuesta: {e}")
        return {"reply": "Error interno del servidor."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
