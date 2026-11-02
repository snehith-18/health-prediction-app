# Health Prediction Application

A full-stack Health Prediction Application developed using Python, FastAPI, React, SQLite, and Google Gemini AI.

## Features

- Add new patient records.
- View all registered patients.
- Update existing patient details.
- Delete patient records.
- Generate AI-powered health screening remarks.
- Validate email addresses and dates of birth.
- Validate numerical blood test values.
- Prevent duplicate patient registration.
- Search patient records.
- Dashboard displaying patient statistics.
- Store patient information persistently using SQLite.

## Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- Lucide React

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic

### Database
- SQLite

### AI Integration
- Google Gemini API

## Project Structure

```text
health-prediction-app/
│
├── backend/
│   ├── ai_service.py
│   ├── database.py
│   ├── dependencies.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── Services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd health-prediction-app
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend folder and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend server:

```bash
uvicorn main:app --reload
```

Backend URL: http://127.0.0.1:8000

API Documentation: http://127.0.0.1:8000/docs

### 3. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend URL: http://localhost:5173

## AI Health Remarks

The application integrates Google Gemini AI to generate informational health screening remarks based on:

- Glucose
- Haemoglobin
- Cholesterol

The AI-generated remarks are intended for informational purposes only and do not constitute a medical diagnosis.

## Database

Patient information is stored persistently using SQLite and managed through SQLAlchemy.

## Security

- API keys are stored in environment variables.
- The actual `.env` file is excluded from Git.
- A `.env.example` file is provided as a configuration reference.
- Database files and virtual environments are excluded from Git.

## Author

Developed as part of the Python Programming Skills Assessment.