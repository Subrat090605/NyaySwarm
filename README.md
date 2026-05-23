# NyaySwarm 🏛️⚖️

> An AI-powered legal assistance platform built for IGNITE ROOM HACKARENA 2.0

[![Hackathon](https://img.shields.io/badge/Hackathon-IGNITE%20ROOM%20HACKARENA%202.0-blue)](https://github.com/Subrat090605/NyaySwarm)
[![TypeScript](https://img.shields.io/badge/TypeScript-53.3%25-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-9.6%25-yellow)](https://www.python.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📌 Overview

**NyaySwarm** (न्याय = Justice) is an innovative legal technology platform designed to democratize access to justice through intelligent automation and AI-powered assistance. Built during the IGNITE ROOM HACKARENA 2.0 hackathon, this platform leverages cutting-edge technology to provide legal support, document analysis, and case management capabilities.

## ✨ Features

- 🤖 **AI-Powered Legal Assistant**: Intelligent chatbot for legal queries and guidance
- 📄 **Document Analysis**: Automated analysis and summarization of legal documents
- 🔍 **Case Research**: Quick access to relevant case laws and precedents
- 📊 **Legal Analytics**: Data-driven insights for case management
- 🌐 **Multi-language Support**: Accessibility in regional languages
- 🔐 **Secure & Confidential**: End-to-end encryption for sensitive legal data

## 🛠️ Tech Stack

### Frontend
- **TypeScript** (53.3%) - Type-safe development
- **React/Next.js** - Modern web framework
- **CSS** (32.0%) - Responsive styling
- **JavaScript** (3.4%) - Dynamic functionality
- **HTML** (1.7%) - Semantic structure

### Backend
- **Python** (9.6%) - Core backend logic
- **FastAPI/Django** - RESTful API framework
- **Machine Learning** - NLP for legal document processing
- **Database** - PostgreSQL/MongoDB for data persistence

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- npm or yarn
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Subrat090605/NyaySwarm.git
   cd NyaySwarm
   ```

2. **Setup Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   # or
   yarn install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   python manage.py runserver
   # or
   uvicorn main:app --reload
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   # or
   yarn dev
   ```

3. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`

## 📁 Project Structure

```
NyaySwarm/
├── backend/                 # Python backend
│   ├── api/                # API endpoints
│   ├── models/             # Data models
│   ├── services/           # Business logic
│   ├── ml/                 # Machine learning modules
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # TypeScript/React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # Node dependencies
│
└── README.md              # Project documentation
```

## 🎯 Use Cases

1. **Individual Citizens**: Get quick answers to legal questions without expensive consultations
2. **Legal Professionals**: Streamline research and document review processes
3. **Law Students**: Access learning resources and case studies
4. **NGOs**: Provide legal aid to underserved communities
5. **Businesses**: Ensure compliance and manage legal documentation

## 🔧 Configuration

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/nyayswarm
SECRET_KEY=your-secret-key
AI_API_KEY=your-ai-api-key
DEBUG=True
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=NyaySwarm
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
# or
yarn test
```

## 🤝 Contributing

We welcome contributions to NyaySwarm! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Team

Built with ❤️ by Team NyaySwarm for IGNITE ROOM HACKARENA 2.0

- **[Subrat Panda](https://github.com/Subrat090605)** - Team Lead & Full Stack Developer
- *[Add team member names and roles]*

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- IGNITE ROOM HACKARENA 2.0 organizers
- Open source libraries and frameworks used in this project
- Legal professionals who provided domain expertise
- The AI/ML community for inspiration and tools

## 📞 Contact

For queries and suggestions:
- GitHub: [@Subrat090605](https://github.com/Subrat090605)
- Project Link: [https://github.com/Subrat090605/NyaySwarm](https://github.com/Subrat090605/NyaySwarm)

## 🗺️ Roadmap

- [ ] Multi-language NLP support for Indian languages
- [ ] Integration with legal databases and APIs
- [ ] Mobile application (iOS & Android)
- [ ] Advanced ML models for case outcome prediction
- [ ] Blockchain integration for document verification
- [ ] Voice-based query system

---

<p align="center">Made with ⚡ for IGNITE ROOM HACKARENA 2.0</p>
<p align="center">© 2024 NyaySwarm. All rights reserved.</p>
