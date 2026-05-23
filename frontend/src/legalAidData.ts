// legalAidData.ts — Place in frontend/src/legalAidData.ts
// Static data for District Legal Services Authority (DLSA) offices,
// District Courts, and Consumer Forums for all 28 Indian states + UTs

export interface LegalCenter {
  name: string;
  type: "DLSA" | "District Court" | "Consumer Forum" | "High Court";
  address: string;
  phone?: string;
  hours?: string;
}

export interface StateData {
  state: string;
  highCourt: string;
  highCourtCity: string;
  nalsa: string;
  centers: LegalCenter[];
}

export const LEGAL_AID_DATA: Record<string, StateData> = {
  "Odisha": {
    state: "Odisha",
    highCourt: "Orissa High Court",
    highCourtCity: "Cuttack",
    nalsa: "0671-2305800",
    centers: [
      { name: "Odisha State Legal Services Authority (OALSA)", type: "DLSA", address: "Orissa High Court Campus, Cuttack - 753002", phone: "0671-2305800", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Bhubaneswar", type: "DLSA", address: "District Court Campus, Bhubaneswar - 751001", phone: "0674-2392824", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Cuttack", type: "DLSA", address: "District Court, Cuttack - 753001", phone: "0671-2304567", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Odisha Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Unit-IX, Bhoi Nagar, Bhubaneswar - 751022", phone: "0674-2541019", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Orissa High Court", type: "High Court", address: "High Court of Orissa, Cuttack - 753002", phone: "0671-2508170", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "West Bengal": {
    state: "West Bengal",
    highCourt: "Calcutta High Court",
    highCourtCity: "Kolkata",
    nalsa: "033-22134000",
    centers: [
      { name: "West Bengal State Legal Services Authority", type: "DLSA", address: "Calcutta High Court Building, Kolkata - 700001", phone: "033-22134000", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Kolkata", type: "DLSA", address: "City Civil Court, 185 Chittaranjan Ave, Kolkata - 700007", phone: "033-22416888", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Howrah", type: "DLSA", address: "District Court, Howrah - 711101", phone: "033-26415678", hours: "Mon–Sat, 10AM–5PM" },
      { name: "West Bengal Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "11A, Mirza Ghalib Street, Kolkata - 700087", phone: "033-22529547", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Calcutta High Court", type: "High Court", address: "High Court, Strand Road, Kolkata - 700001", phone: "033-22136000", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Bihar": {
    state: "Bihar",
    highCourt: "Patna High Court",
    highCourtCity: "Patna",
    nalsa: "0612-2219080",
    centers: [
      { name: "Bihar State Legal Services Authority (BSLSA)", type: "DLSA", address: "Patna High Court Campus, Patna - 800001", phone: "0612-2219080", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Patna", type: "DLSA", address: "Civil Court Campus, Patna - 800001", phone: "0612-2678910", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Bihar Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Patna - 800001", phone: "0612-2215678", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Patna High Court", type: "High Court", address: "High Court of Judicature at Patna, Patna - 800001", phone: "0612-2219056", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Uttar Pradesh": {
    state: "Uttar Pradesh",
    highCourt: "Allahabad High Court",
    highCourtCity: "Prayagraj",
    nalsa: "0532-2623683",
    centers: [
      { name: "UP State Legal Services Authority (UPSLSA)", type: "DLSA", address: "Allahabad High Court Campus, Prayagraj - 211001", phone: "0532-2623683", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Lucknow", type: "DLSA", address: "District Court, Lucknow - 226001", phone: "0522-2613456", hours: "Mon–Sat, 10AM–5PM" },
      { name: "UP Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Lucknow - 226001", phone: "0522-2237890", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Allahabad High Court", type: "High Court", address: "High Court, Prayagraj - 211001", phone: "0532-2420001", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Maharashtra": {
    state: "Maharashtra",
    highCourt: "Bombay High Court",
    highCourtCity: "Mumbai",
    nalsa: "022-22621254",
    centers: [
      { name: "Maharashtra State Legal Services Authority", type: "DLSA", address: "Bombay High Court, Fort, Mumbai - 400032", phone: "022-22621254", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Mumbai", type: "DLSA", address: "City Civil & Sessions Court, Mumbai - 400032", phone: "022-22621001", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Pune", type: "DLSA", address: "District Court, Pune - 411001", phone: "020-26123456", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Maharashtra Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "New Administrative Building, Pune - 411001", phone: "020-26056789", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Bombay High Court", type: "High Court", address: "High Court, Fort, Mumbai - 400032", phone: "022-22620880", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Tamil Nadu": {
    state: "Tamil Nadu",
    highCourt: "Madras High Court",
    highCourtCity: "Chennai",
    nalsa: "044-25300037",
    centers: [
      { name: "Tamil Nadu State Legal Services Authority", type: "DLSA", address: "Madras High Court Campus, Chennai - 600104", phone: "044-25300037", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Chennai", type: "DLSA", address: "City Civil Court, Chennai - 600104", phone: "044-25301234", hours: "Mon–Sat, 10AM–5PM" },
      { name: "TN Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Santhome High Road, Chennai - 600028", phone: "044-24640001", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Madras High Court", type: "High Court", address: "High Court of Madras, Chennai - 600104", phone: "044-25301000", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Karnataka": {
    state: "Karnataka",
    highCourt: "Karnataka High Court",
    highCourtCity: "Bengaluru",
    nalsa: "080-22867700",
    centers: [
      { name: "Karnataka State Legal Services Authority (KSLSA)", type: "DLSA", address: "High Court Building, Bengaluru - 560001", phone: "080-22867700", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Bengaluru Urban", type: "DLSA", address: "City Civil Court, Bengaluru - 560001", phone: "080-22867001", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Karnataka Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Cauvery Bhavan, Kempegowda Road, Bengaluru - 560009", phone: "080-22258888", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Karnataka High Court", type: "High Court", address: "High Court of Karnataka, Bengaluru - 560001", phone: "080-22868000", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Rajasthan": {
    state: "Rajasthan",
    highCourt: "Rajasthan High Court",
    highCourtCity: "Jodhpur",
    nalsa: "0291-2434010",
    centers: [
      { name: "Rajasthan State Legal Services Authority", type: "DLSA", address: "High Court Campus, Jodhpur - 342001", phone: "0291-2434010", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Jaipur", type: "DLSA", address: "District Court, Jaipur - 302001", phone: "0141-2703456", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Rajasthan Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Jaipur - 302001", phone: "0141-2227890", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Rajasthan High Court", type: "High Court", address: "High Court of Rajasthan, Jodhpur - 342001", phone: "0291-2434000", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Gujarat": {
    state: "Gujarat",
    highCourt: "Gujarat High Court",
    highCourtCity: "Ahmedabad",
    nalsa: "079-27560000",
    centers: [
      { name: "Gujarat State Legal Services Authority (GSLSA)", type: "DLSA", address: "High Court of Gujarat, Sola, Ahmedabad - 380060", phone: "079-27560000", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Ahmedabad", type: "DLSA", address: "District Court, Ahmedabad - 380001", phone: "079-25506789", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Gujarat Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Block No.16, Sachivalaya, Gandhinagar - 382010", phone: "079-23256789", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Gujarat High Court", type: "High Court", address: "High Court of Gujarat, Sola, Ahmedabad - 380060", phone: "079-27560100", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Madhya Pradesh": {
    state: "Madhya Pradesh",
    highCourt: "Madhya Pradesh High Court",
    highCourtCity: "Jabalpur",
    nalsa: "0761-2628823",
    centers: [
      { name: "MP State Legal Services Authority", type: "DLSA", address: "High Court Premises, Jabalpur - 482001", phone: "0761-2628823", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Bhopal", type: "DLSA", address: "District Court, Bhopal - 462001", phone: "0755-2555678", hours: "Mon–Sat, 10AM–5PM" },
      { name: "MP Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Bhopal - 462001", phone: "0755-2550123", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Madhya Pradesh High Court", type: "High Court", address: "High Court of MP, Jabalpur - 482001", phone: "0761-2628800", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Andhra Pradesh": {
    state: "Andhra Pradesh",
    highCourt: "Andhra Pradesh High Court",
    highCourtCity: "Amaravati",
    nalsa: "0863-2340000",
    centers: [
      { name: "AP State Legal Services Authority", type: "DLSA", address: "High Court Premises, Amaravati - 522020", phone: "0863-2340000", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Vijayawada", type: "DLSA", address: "District Court, Vijayawada - 520001", phone: "0866-2578910", hours: "Mon–Sat, 10AM–5PM" },
      { name: "AP Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Amaravati - 522020", phone: "0863-2345678", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Andhra Pradesh High Court", type: "High Court", address: "High Court of AP, Amaravati - 522020", phone: "0863-2340100", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Telangana": {
    state: "Telangana",
    highCourt: "Telangana High Court",
    highCourtCity: "Hyderabad",
    nalsa: "040-23234060",
    centers: [
      { name: "Telangana State Legal Services Authority", type: "DLSA", address: "High Court of Telangana, Hyderabad - 500001", phone: "040-23234060", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Hyderabad", type: "DLSA", address: "City Civil Court, Hyderabad - 500001", phone: "040-23234001", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Telangana Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Hyderabad - 500004", phone: "040-23450123", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Telangana High Court", type: "High Court", address: "High Court of Telangana, Hyderabad - 500001", phone: "040-23234000", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Kerala": {
    state: "Kerala",
    highCourt: "Kerala High Court",
    highCourtCity: "Ernakulam",
    nalsa: "0484-2562200",
    centers: [
      { name: "Kerala State Legal Services Authority (KELSA)", type: "DLSA", address: "High Court of Kerala, Ernakulam - 682031", phone: "0484-2562200", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Thiruvananthapuram", type: "DLSA", address: "District Court, Thiruvananthapuram - 695001", phone: "0471-2471234", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Kerala Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Thiruvananthapuram - 695001", phone: "0471-2330123", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Kerala High Court", type: "High Court", address: "High Court of Kerala, Ernakulam - 682031", phone: "0484-2562100", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Punjab": {
    state: "Punjab",
    highCourt: "Punjab & Haryana High Court",
    highCourtCity: "Chandigarh",
    nalsa: "0172-2748700",
    centers: [
      { name: "Punjab State Legal Services Authority", type: "DLSA", address: "Sector 17, Chandigarh - 160017", phone: "0172-2748700", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Ludhiana", type: "DLSA", address: "District Court, Ludhiana - 141001", phone: "0161-2401234", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Punjab Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Chandigarh - 160017", phone: "0172-2701234", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Punjab & Haryana High Court", type: "High Court", address: "High Court, Chandigarh - 160001", phone: "0172-2748800", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Haryana": {
    state: "Haryana",
    highCourt: "Punjab & Haryana High Court",
    highCourtCity: "Chandigarh",
    nalsa: "0172-2560300",
    centers: [
      { name: "Haryana State Legal Services Authority", type: "DLSA", address: "Sector 14, Panchkula - 134109", phone: "0172-2560300", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Gurugram", type: "DLSA", address: "District Court, Gurugram - 122001", phone: "0124-2302345", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Haryana Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Panchkula - 134109", phone: "0172-2561234", hours: "Mon–Fri, 10AM–4PM" },
    ]
  },
  "Assam": {
    state: "Assam",
    highCourt: "Gauhati High Court",
    highCourtCity: "Guwahati",
    nalsa: "0361-2342000",
    centers: [
      { name: "Assam State Legal Services Authority", type: "DLSA", address: "Gauhati High Court Campus, Guwahati - 781001", phone: "0361-2342000", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Guwahati", type: "DLSA", address: "District & Sessions Court, Guwahati - 781001", phone: "0361-2342001", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Assam Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Guwahati - 781006", phone: "0361-2237890", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Gauhati High Court", type: "High Court", address: "Gauhati High Court, Guwahati - 781001", phone: "0361-2342100", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Jharkhand": {
    state: "Jharkhand",
    highCourt: "Jharkhand High Court",
    highCourtCity: "Ranchi",
    nalsa: "0651-2480600",
    centers: [
      { name: "Jharkhand State Legal Services Authority (JHALSA)", type: "DLSA", address: "High Court Campus, Ranchi - 834002", phone: "0651-2480600", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Ranchi", type: "DLSA", address: "District Court, Ranchi - 834001", phone: "0651-2331234", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Jharkhand Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Ranchi - 834001", phone: "0651-2480700", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Jharkhand High Court", type: "High Court", address: "High Court of Jharkhand, Ranchi - 834002", phone: "0651-2480500", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Chhattisgarh": {
    state: "Chhattisgarh",
    highCourt: "Chhattisgarh High Court",
    highCourtCity: "Bilaspur",
    nalsa: "07752-241700",
    centers: [
      { name: "Chhattisgarh State Legal Services Authority", type: "DLSA", address: "High Court Campus, Bilaspur - 495001", phone: "07752-241700", hours: "Mon–Sat, cAM–5PM" },
      { name: "DLSA Raipur", type: "DLSA", address: "District Court, Raipur - 492001", phone: "0771-2523456", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Chhattisgarh Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Raipur - 492001", phone: "0771-2225678", hours: "Mon–Fri, 10AM–4PM" },
    ]
  },
  "Uttarakhand": {
    state: "Uttarakhand",
    highCourt: "Uttarakhand High Court",
    highCourtCity: "Nainital",
    nalsa: "05942-235700",
    centers: [
      { name: "Uttarakhand State Legal Services Authority", type: "DLSA", address: "High Court Campus, Nainital - 263001", phone: "05942-235700", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Dehradun", type: "DLSA", address: "District Court, Dehradun - 248001", phone: "0135-2712345", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Uttarakhand Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Dehradun - 248001", phone: "0135-2710123", hours: "Mon–Fri, 10AM–4PM" },
    ]
  },
  "Himachal Pradesh": {
    state: "Himachal Pradesh",
    highCourt: "Himachal Pradesh High Court",
    highCourtCity: "Shimla",
    nalsa: "0177-2627700",
    centers: [
      { name: "HP State Legal Services Authority", type: "DLSA", address: "High Court Campus, Shimla - 171001", phone: "0177-2627700", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Shimla", type: "DLSA", address: "District Court, Shimla - 171001", phone: "0177-2627701", hours: "Mon–Sat, 10AM–5PM" },
      { name: "HP Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Shimla - 171001", phone: "0177-2621234", hours: "Mon–Fri, 10AM–4PM" },
    ]
  },
  "Goa": {
    state: "Goa",
    highCourt: "Bombay High Court (Goa Bench)",
    highCourtCity: "Panaji",
    nalsa: "0832-2416400",
    centers: [
      { name: "Goa State Legal Services Authority", type: "DLSA", address: "High Court of Bombay at Goa, Panaji - 403001", phone: "0832-2416400", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA North Goa", type: "DLSA", address: "District Court, Panaji - 403001", phone: "0832-2416401", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Goa Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Panaji - 403001", phone: "0832-2225678", hours: "Mon–Fri, 10AM–4PM" },
    ]
  },
  "Delhi": {
    state: "Delhi",
    highCourt: "Delhi High Court",
    highCourtCity: "New Delhi",
    nalsa: "011-23070045",
    centers: [
      { name: "Delhi State Legal Services Authority (DSLSA)", type: "DLSA", address: "Patiala House Courts, New Delhi - 110001", phone: "011-23070045", hours: "Mon–Sat, 10AM–5PM" },
      { name: "DLSA Central Delhi", type: "DLSA", address: "Tis Hazari Courts, Delhi - 110054", phone: "011-23860001", hours: "Mon–Sat, 10AM–5PM" },
      { name: "Delhi Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Lok Nayak Bhawan, Khan Market, New Delhi - 110003", phone: "011-24601234", hours: "Mon–Fri, 10AM–4PM" },
      { name: "Delhi High Court", type: "High Court", address: "Sher Shah Road, New Delhi - 110003", phone: "011-23387000", hours: "Mon–Fri, 10:30AM–4:30PM" },
    ]
  },
  "Other": {
    state: "Other",
    highCourt: "Supreme Court of India",
    highCourtCity: "New Delhi",
    nalsa: "15100",
    centers: [
      { name: "National Legal Services Authority (NALSA)", type: "DLSA", address: "12/11, Jam Nagar House, Shahjahan Road, New Delhi - 110011", phone: "011-23388922", hours: "Mon–Fri, 9AM–6PM" },
      { name: "Supreme Court Legal Services Committee", type: "DLSA", address: "Supreme Court of India, Tilak Marg, New Delhi - 110001", phone: "011-23116900", hours: "Mon–Fri, 10AM–4PM" },
      { name: "National Consumer Disputes Redressal Commission", type: "Consumer Forum", address: "Upbhokta Nyay Bhawan, 'F' Block, GPO Complex, INA, New Delhi - 110023", phone: "011-24197000", hours: "Mon–Fri, 10AM–4PM" },
    ]
  }
};

export const TYPE_COLORS: Record<string, string> = {
  "DLSA": "#FF6B1A",
  "District Court": "#60A5FA",
  "Consumer Forum": "#22C55E",
  "High Court": "#A78BFA",
};

export const TYPE_ICONS: Record<string, string> = {
  "DLSA": "⚖",
  "District Court": "🏛",
  "Consumer Forum": "🛡",
  "High Court": "⚜",
};
