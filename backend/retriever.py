import os
from supabase import create_client
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# Load model once at startup
print("Loading embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")
print("Model loaded.")

def retrieve(query: str, match_count: int = 5):
    try:
        embedding = model.encode(query, show_progress_bar=False).tolist()

        result = supabase.rpc(
            "match_legal_chunks",
            {
                "query_embedding": embedding,
                "match_count": match_count
            }
        ).execute()

        chunks = result.data or []

        formatted = []
        for chunk in chunks:
            formatted.append({
                "content": chunk["content"],
                "source": chunk.get("source", "unknown"),
                "section": chunk.get("section", ""),
                "similarity": round(chunk.get("similarity", 0), 3)
            })

        return formatted

    except Exception as e:
        print(f"  RETRIEVER ERROR: {e}")
        return []  # Return empty instead of crashing