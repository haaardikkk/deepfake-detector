# DeepFake Detector

A web application for detecting AI-generated faces using a fine-tuned EfficientNet-B0 model. Upload an image and get a real/fake verdict with a confidence score in under a second.

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)
![PyTorch](https://img.shields.io/badge/PyTorch-2.x-ee4c2c?style=flat-square&logo=pytorch)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-06b6d4?style=flat-square&logo=tailwindcss)

---

## Overview

The model was trained on the AuthentiFace v2 dataset and achieves ~95% accuracy on held-out test data. Detection runs entirely server-side — no image data is stored or logged. The frontend is a single-page React app with Framer Motion animations, a Recharts confidence gauge, and a responsive glassmorphism UI.

---

## Stack

**Frontend** — React 18, Vite, Tailwind CSS v3, Framer Motion, Recharts, Axios, Lucide React

**Backend** — FastAPI, PyTorch, EfficientNet-B0, OpenCV, Pillow

---

## Getting Started

### Requirements

- Python 3.8+
- Node.js 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 9000
```

Swagger docs: `http://localhost:9000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:3000`

---

## API

### `GET /`

Returns server status.

```json
{ "status": "running" }
```

### `POST /predict`

Accepts a multipart form upload. Returns the prediction label and confidence percentage.

**Request:** `multipart/form-data` with `file` field (JPG / PNG, max 10 MB)

**Response:**

```json
{
  "prediction": "REAL",
  "confidence": 94.3
}
```

---

## Model

| Parameter | Value |
|-----------|-------|
| Architecture | EfficientNet-B0 |
| Dataset | AuthentiFace v2 |
| Classes | Real / Fake |
| Input size | 224 × 224 |
| Test accuracy | ~95% |
| Inference time | < 1 s |

---

## Project Structure

```
DeepFake/
├── backend/
│   ├── app.py
│   ├── predictor.py
│   ├── model_loader.py
│   ├── face_crop.py
│   ├── best_model_v2.pth
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── GridBackground.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── UploadCard.jsx
│   │   │   ├── PredictionCard.jsx
│   │   │   ├── ConfidenceGauge.jsx
│   │   │   ├── ModelStats.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── api.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── nginx.conf
```

---

## Docker

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:9000`

See [DEPLOYMENT.md](DEPLOYMENT.md) for Railway deployment instructions.

---

## Roadmap

- Grad-CAM heatmap overlay on predictions
- Face crop preview before analysis
- Batch image processing
- Prediction history (client-side)
- Video frame analysis

---

## License

MIT
