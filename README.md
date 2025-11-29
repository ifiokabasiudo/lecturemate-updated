# 🎓 LectureMate

AI-powered study assistant that helps students upload lecture notes (PDFs), ask context-specific questions, and get real-time study support.  
Built with **Next.js, Supabase, Azure Functions, and OpenAI API**.

> ⚠️ Note: The project relies on the OpenAI API, which is currently disabled due to cost.  
> A full **demo video** of the app in action is available here: [📹 Watch Demo](https://ifiok.vercel.app/Lecture_Mate.mp4)

---

## 📂 Repository Structure

```
lecturemate/
│
├── lecturemate-frontend # Next.js client-side app
├── lecturemate-backend # Node.js backend (handles file uploads, OCR, processing)
└── lecturemate-api # API layer for communication between frontend & backend
```


---

## 🚀 Features
- 📂 Upload PDFs (lecture notes).  
- 🧠 AI-powered Q&A tailored to uploaded content.  
- 🔐 User authentication via Supabase.  
- 📊 Vector-based semantic search for context-specific answers.  
- 📬 Email verification and account management.  
- 🎨 Responsive frontend with Chakra UI + Next.js SSR.  

---

## 🛠️ Tech Stack
- **Frontend:** Next.js, Chakra UI, TailwindCSS  
- **Backend:** Node.js (Express), Azure OCR, OpenAI Embeddings  
- **Database & Auth:** Supabase (Postgres, Row-Level Security)  
- **Storage:** Supabase Buckets (for PDFs)  
- **Deployment:** Vercel (frontend), Azure VM (backend), Cyclic (API)  

---

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/ifiokabasiudo/lecturemate-updated.git
cd lecturemate
```

## 2. Install Dependencies
```bash
cd lecturemate-frontend
npm install

cd ../lecturemate-backend
npm install

cd ../lecturemate-api
npm install
```

## 3. Node.js Version Requirement
This project requires Node v20 or below due to specific backend package compatibility.
You can manage versions using nvm

```bash
nvm install 20
nvm use 20
```

## 4. Running the Apps
- Frontend
```bash
cd lecturemate-frontend
npm run dev
```

-Backend
```bash
cd lecturemate-backend
# Requires nodemon installed globally: npm install -g nodemon
nodemon server.js
```

-Api
```bash
cd lecturemate-api
# Requires nodemon installed globally: npm install -g nodemon
npm run dev
```

🧑‍💻 My Role & Contributions

* Built the backend logic (OCR parsing, embedding generation, Supabase integration).

* Designed and implemented API endpoints for communication between frontend, backend, and database.

* Integrated authentication and role-based access via Supabase.

* Refactored the frontend for responsiveness and smoother UX.

* Deployed services across Azure, Vercel, and Cyclic with reverse proxy (NGINX) + SSL (Let’s Encrypt).

⚡ This repo was initially forked for frontend scaffolding but significantly extended and refactored.
All backend, API, and AI logic were written and maintained by me.


📚 What I Learned

* Designing end-to-end full-stack apps (frontend → API → backend → database → AI).

* Implementing vector similarity search for semantic Q&A.

* Managing auth & security with Supabase row-level policies.

* Balancing real-world constraints (like hosting costs) with architecture decisions.


🔮 Future Improvements

* Migrate backend from Azure VM → Vercel or Fly.io (reduce costs).

* Replace OpenAI embeddings with a cheaper alternative (or host my own).

* Add collaborative study sessions for group learning.

* Expand beyond PDFs to support lecture audio transcription.


If you’d like to learn more or see the code walkthrough:

GitHub: https://github.com/ifiokabasiudo

LinkedIn: https://www.linkedin.com/in/ifiokabasi-udo-7a896b216

