// TeleLawPanel.tsx — Place in frontend/src/components/TeleLawPanel.tsx
import { useState } from "react";

// Domain-based checklist items
const DOMAIN_CHECKLIST: Record<string, string[]> = {
  domestic_violence: [
    "Print and sign the drafted complaint letter",
    "Carry Aadhaar card + any witness contact details",
    "Carry photos or medical reports if available",
    "Go to DLSA / Women's Helpline 181 immediately",
    "You can also call Police at 100 — it's your right",
  ],
  criminal: [
    "Print the drafted police complaint letter",
    "Carry Aadhaar card + any evidence (photos, videos)",
    "Go to the nearest police station and demand FIR registration",
    "If police refuse, go to DLSA office with this document",
    "You have the right to free legal aid under NALSA",
  ],
  land_rights: [
    "Print the drafted legal notice",
    "Carry land ownership documents (patta, deed)",
    "Carry Aadhaar card + 2 passport photos",
    "Visit DLSA office — mention Land Dispute under BNS 2023",
    "Ask for a free legal aid lawyer at the DLSA counter",
  ],
  consumer: [
    "Print the Consumer Complaint Letter",
    "Carry purchase receipt / bill / contract",
    "Carry Aadhaar card",
    "File at the District Consumer Commission (free filing)",
    "No lawyer needed for consumer cases under ₹50 lakhs",
  ],
  labour: [
    "Print the Labour Grievance Letter",
    "Carry your employment contract / salary slips",
    "Carry Aadhaar card",
    "Visit the Labour Commissioner's office in your district",
    "Free legal aid available at DLSA for labour disputes",
  ],
  rti: [
    "Print the RTI Application",
    "Attach a ₹10 postal order (payable to the PIO)",
    "Send by registered post or submit in person",
    "Keep a copy with the submission receipt",
    "Response must come within 30 days — it's the law",
  ],
  constitutional: [
    "Print the drafted document",
    "Carry Aadhaar card + supporting evidence",
    "Visit High Court Legal Services Committee for free help",
    "NALSA provides free lawyers for fundamental rights cases",
    "Call NALSA: 15100 to know your eligibility",
  ],
  other: [
    "Print and sign the drafted document",
    "Carry Aadhaar card + any relevant documents",
    "Visit the nearest DLSA office for free legal advice",
    "Mention you were referred by NyaySwarm / Tele-Law",
    "Call NALSA helpline: 15100 (free, all languages)",
  ],
};

// Tele-Law numbers by state
const TELELAW_NUMBERS: Record<string, string> = {
  "Odisha": "0674-2392824",
  "West Bengal": "033-22134000",
  "Bihar": "0612-2219080",
  "Uttar Pradesh": "0532-2623683",
  "Maharashtra": "022-22621254",
  "Tamil Nadu": "044-25300037",
  "Karnataka": "080-22867700",
  "Delhi": "011-23070045",
  "Gujarat": "079-27560000",
  "Rajasthan": "0291-2434010",
  "Madhya Pradesh": "0761-2628823",
  "Kerala": "0484-2562200",
  "Andhra Pradesh": "0863-2340000",
  "Telangana": "040-23234060",
  "Punjab": "0172-2748700",
  "Haryana": "0172-2560300",
  "Assam": "0361-2342000",
  "Jharkhand": "0651-2480600",
  "default": "15100",
};

interface Props {
  domain: string;
  severityScore: number;
  retrievalConfidence: number;
  userState?: string;
  detectedLang?: string;
}

export default function TeleLawPanel({
  domain, severityScore, retrievalConfidence, userState, detectedLang
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showManual, setShowManual] = useState(false);

  // Auto-trigger logic
  const autoShow = severityScore > 0.7 || retrievalConfidence < 0.5;

  // If neither auto nor manual, show only the small link
  const checklist = DOMAIN_CHECKLIST[domain] || DOMAIN_CHECKLIST["other"];
  const teleLawNum = userState ? (TELELAW_NUMBERS[userState] || TELELAW_NUMBERS["default"]) : TELELAW_NUMBERS["default"];

  const severityLabel = severityScore >= 0.85 ? "Very High" : severityScore >= 0.7 ? "High" : severityScore >= 0.5 ? "Medium" : "Low";
  const severityColor = severityScore >= 0.85 ? "#EF4444" : severityScore >= 0.7 ? "#F97316" : severityScore >= 0.5 ? "#EAB308" : "#22C55E";
  const confidenceLabel = retrievalConfidence >= 0.7 ? "High" : retrievalConfidence >= 0.5 ? "Medium" : "Low";
  const confidenceColor = retrievalConfidence >= 0.7 ? "#22C55E" : retrievalConfidence >= 0.5 ? "#EAB308" : "#EF4444";

  if (!autoShow && !showManual) {
    return (
      <div className="telelaw-manual-trigger">
        <span>Still unsure about your rights?</span>
        <button onClick={() => setShowManual(true)} className="telelaw-link-btn">
          Talk to a free government lawyer →
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={`telelaw-panel ${autoShow ? "telelaw-auto" : "telelaw-manual"}`}>

        {/* Header */}
        <div className="telelaw-header">
          <div className="telelaw-header-left">
            <div className={`telelaw-alert-icon ${autoShow ? "alert-pulse" : ""}`}>
              {autoShow ? "⚠" : "💬"}
            </div>
            <div>
              <div className="telelaw-title">
                {autoShow
                  ? "This case may need a real lawyer"
                  : "Talk to a free government lawyer"}
              </div>
              <div className="telelaw-sub">
                {autoShow
                  ? "NyaySwarm detected this is a serious or complex case — free government legal help is available"
                  : "The Government of India provides free legal aid through Tele-Law and DLSA"}
              </div>
            </div>
          </div>
          {!autoShow && (
            <button className="telelaw-close" onClick={() => setShowManual(false)}>✕</button>
          )}
        </div>

        {/* Confidence scores — only show when auto-triggered */}
        {autoShow && (
          <div className="telelaw-scores">
            <div className="telelaw-score-card">
              <div className="telelaw-score-label">Case Severity</div>
              <div className="telelaw-score-bar-bg">
                <div className="telelaw-score-bar-fill"
                  style={{ width: `${severityScore * 100}%`, background: severityColor }} />
              </div>
              <div className="telelaw-score-val" style={{ color: severityColor }}>
                {severityLabel} ({Math.round(severityScore * 100)}%)
              </div>
            </div>
            <div className="telelaw-score-card">
              <div className="telelaw-score-label">AI Confidence</div>
              <div className="telelaw-score-bar-bg">
                <div className="telelaw-score-bar-fill"
                  style={{ width: `${retrievalConfidence * 100}%`, background: confidenceColor }} />
              </div>
              <div className="telelaw-score-val" style={{ color: confidenceColor }}>
                {confidenceLabel} ({Math.round(retrievalConfidence * 100)}%)
              </div>
            </div>
          </div>
        )}

        {/* What to do strip */}
        <div className="telelaw-options">
          <div className="telelaw-option">
            <div className="telelaw-option-icon">📞</div>
            <div>
              <div className="telelaw-option-title">Call Tele-Law / NALSA</div>
              <div className="telelaw-option-desc">Free legal advice by phone, available in your language</div>
              <a href="tel:15100" className="telelaw-num">15100</a>
              {userState && teleLawNum !== "15100" && (
                <a href={`tel:${teleLawNum}`} className="telelaw-num-state">{teleLawNum} ({userState})</a>
              )}
            </div>
          </div>

          <div className="telelaw-option-divider" />

          <div className="telelaw-option">
            <div className="telelaw-option-icon">🏛</div>
            <div>
              <div className="telelaw-option-title">Visit DLSA Office</div>
              <div className="telelaw-option-desc">Free legal aid lawyers available at every district office</div>
              <button className="telelaw-maps-btn"
                onClick={() => window.open(
                  `https://www.google.com/maps/search/?api=1&query=DLSA+District+Legal+Services+Authority+${userState || "India"}`,
                  "_blank"
                )}>
                🗺 Find nearest DLSA
              </button>
            </div>
          </div>

          <div className="telelaw-option-divider" />

          <div className="telelaw-option">
            <div className="telelaw-option-icon">💻</div>
            <div>
              <div className="telelaw-option-title">Tele-Law Online</div>
              <div className="telelaw-option-desc">Book a free lawyer consultation via CSC / Tele-Law portal</div>
              <button className="telelaw-maps-btn"
                onClick={() => window.open("https://tele-law.in", "_blank")}>
                Open tele-law.in →
              </button>
            </div>
          </div>
        </div>

        {/* CTA button */}
        <div className="telelaw-cta-row">
          <button className="telelaw-cta-btn" onClick={() => setShowModal(true)}>
            📋 See step-by-step guide — what to do next
          </button>
          <button className="telelaw-call-btn" onClick={() => window.open("tel:15100")}>
            📞 Call 15100 Now (Free)
          </button>
        </div>
      </div>

      {/* Step-by-step Modal */}
      {showModal && (
        <div className="telelaw-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="telelaw-modal" onClick={e => e.stopPropagation()}>
            <div className="telelaw-modal-header">
              <div className="telelaw-modal-title">Your Next Steps</div>
              <div className="telelaw-modal-sub">
                Follow these steps to get free legal help for your {domain?.replace(/_/g, " ")} case
              </div>
              <button className="telelaw-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="telelaw-checklist">
              {checklist.map((item, i) => (
                <ChecklistItem key={i} num={i + 1} text={item} />
              ))}
            </div>

            <div className="telelaw-modal-footer">
              <div className="telelaw-modal-reminder">
                <span>📌</span>
                <span>All legal aid through NALSA, DLSA and Tele-Law is <strong>completely free</strong> for eligible citizens. You do not need to pay anything.</span>
              </div>
              <div className="telelaw-modal-actions">
                <button className="telelaw-cta-btn" style={{ flex: 1 }}
                  onClick={() => window.open("https://tele-law.in", "_blank")}>
                  Open tele-law.in
                </button>
                <button className="telelaw-call-btn"
                  onClick={() => window.open("tel:15100")}>
                  📞 15100
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ChecklistItem({ num, text }: { num: number; text: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className={`checklist-item ${checked ? "checklist-done" : ""}`}
      onClick={() => setChecked(c => !c)}>
      <div className={`checklist-box ${checked ? "checklist-box-done" : ""}`}>
        {checked ? "✓" : num}
      </div>
      <span className="checklist-text">{text}</span>
    </div>
  );
}
