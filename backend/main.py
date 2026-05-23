# main.py — Replace your entire backend/main.py with this
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents import run_swarm
from voice_router import router as voice_router
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="NyaySwarm API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register voice routes
app.include_router(voice_router)

class Query(BaseModel):
    question: str
    language: str = "auto"

@app.get("/health")
def health():
    return {"status": "ok", "message": "NyaySwarm is running"}

@app.post("/query")
async def query(q: Query):
    try:
        result = run_swarm(
            question=q.question,
            language=q.language
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {
        "name": "NyaySwarm",
        "description": "AI Legal Aid for Rural India",
        "agents": [
            "Language Agent",
            "Classifier Agent",
            "Research Agent",
            "Rights Explainer Agent",
            "Document Drafter Agent"
        ],
        "voice": {
            "transcribe": "/voice/transcribe",
            "speak": "/voice/speak"
        }
    }
