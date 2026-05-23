import os, glob
from dotenv import load_dotenv
from supabase import create_client
from sentence_transformers import SentenceTransformer

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)
model = SentenceTransformer("all-MiniLM-L6-v2")

def chunk_text(text, chunk_size=400, overlap=50):
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks

def ingest_file(filepath):
    source = os.path.basename(filepath).replace(".txt","")
    print(f"Ingesting {source}...")
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()
    chunks = chunk_text(text)
    print(f"  {len(chunks)} chunks found")
    for i, chunk in enumerate(chunks):
        embedding = model.encode(chunk).tolist()
        supabase.table("legal_chunks").insert({
            "content": chunk,
            "embedding": embedding,
            "source": source,
            "section": f"chunk_{i}"
        }).execute()
        if i % 10 == 0:
            print(f"  stored {i}/{len(chunks)}")
    print(f"  done: {source}")

files = glob.glob("data/*.txt")
for f in files:
    ingest_file(f)
print("All done. Your knowledge base is ready.")