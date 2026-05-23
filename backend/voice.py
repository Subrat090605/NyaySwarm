"""
voice.py — Speech-to-Text (Groq Whisper) and Text-to-Speech (Groq TTS)
Handles multilingual voice input/output for rural Indian users.
"""

import os
import io
import httpx
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


# ─── SPEECH-TO-TEXT (Whisper) ─────────────────────────────
def transcribe_audio(audio_bytes: bytes, filename: str = "audio.webm") -> dict:
    """
    Transcribes audio bytes using Groq Whisper Large-v3.
    Auto-detects language — supports Hindi, Bengali, Odia, Tamil, Telugu, etc.
    
    Returns: { "text": "transcribed text", "language": "detected language code" }
    """
    try:
        # Create a file-like tuple for the Groq SDK
        transcription = client.audio.transcriptions.create(
            file=(filename, audio_bytes),
            model="whisper-large-v3",
            response_format="verbose_json",  # gives us language detection
            temperature=0.0,
        )

        # Extract transcribed text and detected language
        text = transcription.text.strip() if hasattr(transcription, 'text') else str(transcription).strip()
        language = getattr(transcription, 'language', 'unknown')

        print(f"  🎤 Whisper transcribed: '{text[:80]}...' (lang: {language})")
        return {
            "text": text,
            "language": language
        }

    except Exception as e:
        print(f"  ❌ Whisper STT error: {e}")
        raise e


# ─── TEXT-TO-SPEECH (Groq TTS) ───────────────────────────
def synthesize_speech(text: str) -> bytes:
    """
    Converts text to speech using Groq TTS API.
    Returns audio bytes in WAV format.
    """
    try:
        # Truncate very long text to avoid timeouts (max ~4000 chars)
        if len(text) > 4000:
            text = text[:4000] + "..."

        # Use httpx to call Groq TTS endpoint directly
        url = "https://api.groq.com/openai/v1/audio/speech"
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "playai-tts",
            "input": text,
            "voice": "Arista-PlayAI",
            "response_format": "wav",
        }

        with httpx.Client(timeout=60.0) as http_client:
            response = http_client.post(url, json=payload, headers=headers)
            response.raise_for_status()

        print(f"  🔊 TTS generated: {len(response.content)} bytes")
        return response.content

    except Exception as e:
        print(f"  ❌ Groq TTS error: {e}")
        raise e
