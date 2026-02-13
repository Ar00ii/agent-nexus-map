import os
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from google import genai

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
MOLTBOOK_API_KEY = os.environ.get("MOLTBOOK_API_KEY", "")
MOLTBOOK_API_BASE = "https://www.moltbook.com/api/v1"

gemini_client = None
if GEMINI_API_KEY:
    try:
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
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

# --- Chat (Gemini) ---

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not gemini_client:
        return {"reply": "Backend no configurado. Establece GEMINI_API_KEY."}

    try:
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=request.message
        )
        return {"reply": response.text}
    except Exception as e:
        print(f"Error generando respuesta: {e}")
        return {"reply": "Error interno del servidor."}

# --- Moltbook API Proxy ---

async def moltbook_fetch(endpoint: str):
    """Proxy requests to Moltbook API keeping the key server-side."""
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(
            f"{MOLTBOOK_API_BASE}{endpoint}",
            headers={
                "Authorization": f"Bearer {MOLTBOOK_API_KEY}",
                "Content-Type": "application/json",
            },
        )
        response.raise_for_status()
        return response.json()

@app.get("/api/moltbook/submolts")
async def proxy_submolts():
    try:
        return await moltbook_fetch("/submolts")
    except Exception:
        return {"success": False, "error": "Failed to fetch submolts"}

@app.get("/api/moltbook/posts")
async def proxy_posts(sort: str = "hot", limit: int = 10):
    try:
        return await moltbook_fetch(f"/posts?sort={sort}&limit={limit}")
    except Exception:
        return {"success": False, "posts": []}

@app.get("/api/moltbook/agents")
async def proxy_agents(sort: str = "karma", limit: int = 5):
    try:
        return await moltbook_fetch(f"/agents?sort={sort}&limit={limit}")
    except Exception:
        return {"success": False, "agents": []}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
