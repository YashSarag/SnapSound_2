import whisper

# Load the model once at the top
model = whisper.load_model("tiny")  # Options: tiny, base, small, medium, large

def transcribe_audio(filepath: str) -> str:
    try:
        print(f"📄 [DEBUG] Transcribing file at: {filepath}")
        result = model.transcribe(filepath)
        return result["text"]
    except Exception as e:
        print("❌ [LOCAL] Error during transcription:", e)
        return "ERROR"