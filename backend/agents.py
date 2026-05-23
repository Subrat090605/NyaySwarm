import os
from groq import Groq
from retriever import retrieve
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def llm(prompt: str, system: str = "You are a helpful legal assistant.") -> str:
    """Helper - calls Groq Llama3 with any prompt."""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=800
    )
    return response.choices[0].message.content.strip()


# ─── AGENT 1: Language Agent ──────────────────────────────
def language_agent(text: str) -> dict:
    """Detects language and translates to English if needed."""
    try:
        prompt = f"""Detect the language of this text and translate it to English if it is not already English.

Text: {text}

Respond ONLY with valid JSON in this exact format:
{{"detected_lang": "language name", "english_text": "translated or original text"}}"""

        result = llm(prompt)
        import json
        result = result.replace("```json","").replace("```","").strip()
        return json.loads(result)
    except Exception as e:
        print(f"  AGENT 1 ERROR: {e}")
        raise e


# ─── AGENT 2: Classifier Agent ────────────────────────────
def classifier_agent(english_text: str) -> str:
    """Classifies the legal domain of the query."""
    prompt = f"""Classify this legal query into exactly ONE of these categories:
land_rights, domestic_violence, labour, consumer, criminal, constitutional, rti, other

Query: {english_text}

Respond ONLY with the category name, nothing else."""

    return llm(prompt).strip().lower()


# ─── AGENT 3: Research Agent ──────────────────────────────
def research_agent(english_text: str, domain: str) -> list:
    """Retrieves relevant law sections from the knowledge base."""
    # Combine query with domain for better retrieval
    enriched_query = f"{domain} {english_text}"
    chunks = retrieve(enriched_query, match_count=3)
    return chunks


# ─── AGENT 4: Rights Explainer Agent ─────────────────────
def explainer_agent(
    original_question: str,
    english_text: str,
    chunks: list,
    detected_lang: str
) -> str:
    """Explains legal rights in plain simple language."""

    # Build context from retrieved chunks
    context = "\n\n".join([
        f"[{c['source'].upper()} - {c['section']}]\n{c['content']}"
        for c in chunks
    ])

    prompt = f"""You are a legal aid assistant helping rural citizens in India understand their rights.

A person asked: "{original_question}"
(In English this means: "{english_text}")

Based ONLY on the following law sections, explain their legal rights in very simple, 
plain language that a person with basic education can understand. 
No legal jargon. Be warm and helpful. Use bullet points.
Then translate your entire response into {detected_lang}.

Law sections:
{context}"""

    return llm(prompt, system="You are a compassionate legal aid assistant for rural India. Always respond in the language requested.")


# ─── AGENT 5: Document Drafter Agent ─────────────────────
def drafter_agent(
    original_question: str,
    english_text: str,
    domain: str,
    detected_lang: str
) -> str:
    """Drafts a legal document based on the user's situation."""

    # Pick document type based on domain
    doc_type_map = {
        "rti": "RTI Application",
        "consumer": "Consumer Complaint Letter",
        "labour": "Labour Grievance Letter",
        "land_rights": "Legal Notice for Land Dispute",
        "domestic_violence": "Complaint under Protection of Women from Domestic Violence Act",
        "criminal": "Police Complaint Letter",
        "constitutional": "Writ Petition Draft",
        "other": "Legal Notice"
    }
    doc_type = doc_type_map.get(domain, "Legal Notice")

    prompt = f"""Draft a formal {doc_type} in English based on this situation:
"{english_text}"

Format it properly with:
- TO: [Authority name - leave blank for user to fill]
- FROM: [User name - leave blank]  
- DATE: [Date - leave blank]
- SUBJECT: Clear subject line
- Body: Formal legal language citing relevant rights
- Closing: Formal closing

After the English draft, provide a {detected_lang} translation of the same document.

Keep blank fields marked as [_____________] for the user to fill in."""

    return llm(prompt, system="You are a legal document drafting expert for Indian citizens.")


# ─── ORCHESTRATOR ─────────────────────────────────────────
def run_swarm(question: str, language: str = "auto") -> dict:
    print(f"\n🎯 NyaySwarm received: {question}")
    try:
        print("→ Agent 1: Language detection...")
        lang_result = language_agent(question)
        detected_lang = lang_result["detected_lang"]
        english_text = lang_result["english_text"]
        print(f"  ✓ Detected: {detected_lang}")

        print("→ Agent 2: Classifying legal domain...")
        domain = classifier_agent(english_text)
        print(f"  ✓ Domain: {domain}")

        print("→ Agent 3: Searching legal knowledge base...")
        chunks = research_agent(english_text, domain)
        print(f"  ✓ Found {len(chunks)} chunks")

        print("→ Agent 4: Explaining rights...")
        explanation = explainer_agent(question, english_text, chunks, detected_lang)
        print(f"  ✓ Explanation done ({len(explanation)} chars)")

        print("→ Agent 5: Drafting legal document...")
        document = drafter_agent(question, english_text, domain, detected_lang)
        print(f"  ✓ Document done ({len(document)} chars)")

        sources = [
            {"source": c["source"], "section": c["section"], "similarity": c["similarity"]}
            for c in chunks
        ]

        print("✅ NyaySwarm complete!\n")
        severity_map = {
            "domestic_violence": 0.95,
            "criminal":          0.85,
            "land_rights":       0.75,
            "constitutional":    0.70,
            "labour":            0.60,
            "other":             0.50,
            "consumer":          0.45,
            "rti":               0.30,
        }
        severity_score = severity_map.get(domain, 0.50)
 
        # Compute retrieval confidence from chunk similarity scores
        retrieval_confidence = round(
            max([c["similarity"] for c in chunks], default=0.0), 3
        )
 
        print(f"  Severity: {severity_score} | Confidence: {retrieval_confidence}")
        print("✅ NyaySwarm complete!\n")
 
        return {
            "detected_lang":        detected_lang,
            "domain":               domain,
            "explanation":          explanation,
            "document":             document,
            "sources":              sources,
            "severity_score":       severity_score,
            "retrieval_confidence": retrieval_confidence,
        }

    except Exception as e:
        import traceback
        print(f"\n❌ SWARM ERROR at step above:")
        traceback.print_exc()
        raise e