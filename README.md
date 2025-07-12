# 👕 ReWear – Community Clothing Exchange

ReWear is a web-based platform that empowers individuals to swap unused clothing through direct exchanges or a point-based system. Designed to promote sustainable fashion and reduce textile waste, ReWear creates a community-centered ecosystem where garments are reused, not discarded.

## 🧩 Problem Statement

Each year, millions of wearable clothes are discarded, significantly contributing to textile waste and environmental harm. Although people often own clothing they no longer wear, there’s no widely adopted, community-driven platform for exchanging garments easily and sustainably.  
**ReWear** addresses this gap by enabling peer-to-peer swaps and incentivized redemptions through a point-based model—making sustainable fashion more accessible and engaging.

---
## 🚀 Features

### 👤 User Authentication
- Secure signup/login using email & password

### 🏠 Landing Page
- Platform overview
- CTAs: “Start Swapping”, “Browse Items”, “List an Item”
- Featured items carousel

### 📊 User Dashboard
- View profile details and points balance
- Manage uploaded items
- Track ongoing and completed swaps

### 🧥 Item Detail Page
- Image gallery
- Full item description, tags, condition
- Uploader info
- Swap or redeem via points
- Availability status indicator

### ➕ Add New Item
- Upload images
- Add title, description, category, size, type, condition, and tags
- Submit to list item for exchange

### 🛡️ Admin Panel
- Moderate item listings
- Approve/reject items
- Remove inappropriate content
- Lightweight interface for management

---


## 🚀 Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **React Query** for state management

### Backend
- **FastAPI** (Python) for robust API
- **SQLAlchemy** for database ORM
- **PostgreSQL** for data persistence
- **JWT** for authentication
- **Pydantic** for data validation

### AI Integration
- **SmartChain AI** chatbot for user assistance
- **Llama 2** model for intelligent recommendations
- **Local AI processing** for privacy and cost efficiency

### Deployment:
- Vercel (frontend), Render / Railway (backend)
---

## 📁 Project Structure

```
ReWear/
├── frontend/          # React frontend application
├── backend/           # FastAPI backend server
├── docs/             # Documentation
<<<<<<< HEAD
└── README.md         # This file
=======
└── README.md         # Readme file
>>>>>>> dc473949fbf57292ec7734d57a5c6b43851d5251
```

## 🛠️ Installation & Setup

### 1.  Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- PostgreSQL database

### 2. Clone the repo:

```bash
git clone https://github.com/sonamnimje/rewear.git
cd rewear
```
### 3. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 🧑‍🤝‍🧑 Team Members

| Name          | Role                 | Email                       |
|---------------|----------------------|-----------------------------|
| Riya Saraf   | Team Lead & ML Developer | riyasaraf19@gmail.com     |
| Shreya Saraf  | Frontend Developer   | shreyasaraf765@gmail.com     |
| Sonam Nimje   | Backend Engineer     | sonamnimje27@gmail.com     |
| Sameeksha Vishwakarma    | UI/UX Designer       | sameekshavishwakarma16@gmail.com     |
---

## 🌱 Environmental Impact

ReWear contributes to sustainability by:
- **Reducing textile waste** through community exchanges
- **Promoting circular fashion** economy
- **Building awareness** about sustainable consumption
- **Creating community** around eco-friendly practices

# 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---
🌍 Let's Make Fashion Circular.
ReWear is committed to creating a positive environmental and social impact by helping people exchange clothes, reduce waste, and embrace sustainable living.
---
# ReWear

A sustainable clothing exchange platform.
