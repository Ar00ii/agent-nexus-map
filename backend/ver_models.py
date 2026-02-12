from google import genai

# Tu clave API
API_KEY = "AIzaSyCCQdSWdpgAWhHwclYws5HrfLHsJXIsfqE"

client = genai.Client(api_key=API_KEY)

print("--- BUSCANDO MODELOS DISPONIBLES ---")
try:
    # Listamos todos los modelos
    for model in client.models.list():
        # Filtramos solo los que sirven para generar texto (gemini)
        if "gemini" in model.name:
            print(f"✅ DISPONIBLE: {model.name}")
            
except Exception as e:
    print(f"❌ Error: {e}")