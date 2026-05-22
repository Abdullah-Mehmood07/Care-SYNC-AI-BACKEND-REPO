# CareSync AI

CareSync AI is an intelligent healthcare platform designed to reduce administrative friction and summarize complex medical data. Built on the MERN stack (MongoDB, Express, React, Node.js), CareSync AI connects patients, medical personal assistants (PAs), lab technicians, and hospital administrators into a seamless, unified ecosystem.

## 🚀 Key Features

- **Unified Patient Portal**: A centralized entry point with smart triage and rapid appointment booking functionalities.
- **Personal Assistant (PA) Dashboard**: Advanced tools to efficiently manage doctor schedules, handle consultations, and engage in patient chats.
- **Lab Management System**: Dedicated portal for uploading lab documents (PDFs/JPGs) with a secure file interface and eventual AI layman translation for medical results.
- **Hospital Admin Portal**: Dashboard tailored for administrating networks of hospitals and dynamically mapping health center data.
- **Role-Based Access Control**: Highly secure structure directing different user types (Patients, PAs, Admins, Labs) to their respective services seamlessly.
- **AI-Powered Architecture**: Ongoing integration with Multimodal AI (like Google Gemini) designed to provide chatbot triage and extract medical data directly from uploaded lab pdfs!

## 🛠 Technology Stack

- **Frontend**: React (via Vite) & React Router
- **Backend**: Node.js & Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: Custom JWT integration & `bcryptjs`
- **File Management**: `multer` for secure PDF & Image handling

## 📂 Project Structure

This repository acts as a monorepo dividing the client-side presentation from the centralized backend service:

- `/caresync-app` (and `/src` root files) - The React frontend application.
- `/caresync-backend` - The Node.js API backend application.

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- Local or Atlas MongoDB Cluster

### Installation

1. **Clone the project:**
   ```bash
   git clone <repository-url>
   cd "CARESYNC AI HTML LATEST - Copy"
   ```

2. **Launch the Backend Server:**
   ```bash
   cd caresync-backend
   npm install
   # Create a .env file based on .env.example containing:
   # MONGO_URI, JWT_SECRET, GEMINI_API_KEY, GEMINI_MODEL, CLASSIFIER_DATASET_PATH
   npm run dev
   ```

3. **Launch the Frontend Client:**
   ```bash
   cd ../caresync-app
   # Note: Some frontend config and files are also placed at the project root. 
   npm install
   npm run dev
   ```

## 🤖 AI + ML Workflow

### 1) Train specialist classifier in Colab
- Notebook: `notebooks/CareSync_Specialist_Classifier_Colab.ipynb`
- Includes:
  - Google Drive mount
  - CSV training pipeline for `Healthcare_5000_with_Specialist.csv`
  - Baseline classifier training (TF-IDF + logistic regression)
  - Optional transformer fine-tuning path
  - Artifact export to Drive (`.joblib` model + label map JSON)

### 2) Backend AI services
Backend provides:
- Deterministic specialist classification based on symptom similarity against dataset records
- Gemini-powered triage explanation (optional in triage endpoint)
- Gemini-powered lab report summary generation

### 3) API endpoints (AI + reports)
- `GET /api/ai/health`
- `POST /api/ai/classify-specialist`
- `POST /api/ai/triage`
- `POST /api/ai/summarize-lab/:reportId`
- `POST /api/upload` (stores file + report metadata)
- `GET /api/upload/my-reports`
- `GET /api/upload/reports`

### 4) End-to-end flow
1. User enters symptoms in AI assistant
2. Backend classifier predicts specialist
3. Gemini adds rationale, urgency, and next-step guidance
4. Patient can upload/view lab reports
5. Authorized users can generate and persist AI lab summaries

## 📄 License
ISC
