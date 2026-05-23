# voice_router.py — Place in backend/voice_router.py
# Handles speech-to-text and text-to-speech

import os
import io
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/voice", tags=["voice"])
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# ── SPEECH TO TEXT ─────────────────────────────────────────
@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """
    Receives audio blob from frontend,
    transcribes it using Groq Whisper,
    returns the text.
    """
    try:
        # Read audio bytes
        audio_bytes = await audio.read()

        if len(audio_bytes) < 100:
            raise HTTPException(status_code=400, detail="Audio too short")

        # Write to temp file (Groq needs a file path)
        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        try:
            # Transcribe using Groq Whisper
            with open(tmp_path, "rb") as f:
                transcription = client.audio.transcriptions.create(
                    model="whisper-large-v3",
                    file=("recording.webm", f, "audio/webm"),
                    response_format="text",
                    language=None,  # auto-detect language
                )
        finally:
            os.unlink(tmp_path)  # clean up temp file

        # transcription is a string when response_format="text"
        text = transcription if isinstance(transcription, str) else transcription.text

        print(f"[Voice] Transcribed: {text[:80]}...")
        return {"transcribed_text": text.strip(), "success": True}

    except Exception as e:
        print(f"[Voice] Transcription error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── TEXT TO SPEECH ──────────────────────────────────────────
class SpeakRequest(BaseModel):
    text: str
    language: str = "auto"

@router.post("/speak")
async def speak_text(req: SpeakRequest):
    """
    Converts explanation text to speech using Groq TTS,
    returns audio as streaming response.
    Falls back to gTTS if Groq TTS unavailable.
    """
    try:
        # Truncate text if too long (TTS has limits)
        text = req.text[:2000] if len(req.text) > 2000 else req.text

        # Try Groq TTS first
        try:
            response = client.audio.speech.create(
                model="playai-tts",
                voice="Celeste-PlayAI",
                input=text,
                response_format="mp3",
            )
            audio_bytes = response.read()
            return StreamingResponse(
                io.BytesIO(audio_bytes),
                media_type="audio/mpeg",
                headers={"Content-Disposition": "inline; filename=speech.mp3"}
            )
        except Exception as groq_err:
            print(f"[Voice] Groq TTS failed: {groq_err}, trying gTTS fallback...")

        # Fallback: gTTS (Google Text-to-Speech, free)
        try:
            from gtts import gTTS

            # Detect language for gTTS
            lang_map = {
                "Bengali": "bn", "Hindi": "hi", "Odia": "or",
                "Tamil": "ta", "Telugu": "te", "Marathi": "mr",
                "Gujarati": "gu", "Kannada": "kn", "Malayalam": "ml",
                "English": "en",
            }
            tts_lang = lang_map.get(req.language, "en")

            tts = gTTS(text=text, lang=tts_lang, slow=False)
            buf = io.BytesIO()
            tts.write_to_fp(buf)
            buf.seek(0)

            return StreamingResponse(
                buf,
                media_type="audio/mpeg",
                headers={"Content-Disposition": "inline; filename=speech.mp3"}
            )
        except ImportError:
            raise HTTPException(
                status_code=503,
                detail="TTS not available. Install gTTS: pip install gtts"
            )

    except HTTPException:
        raise
    except Exception as e:
        print(f"[Voice] TTS error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
