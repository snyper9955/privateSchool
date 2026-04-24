# Deployment Guide: Render (Backend) + Vercel (Frontend)

This guide helps you deploy your application with a separate backend and frontend.

## 1. Backend Deployment (Render)

1.  **Repo**: Connect your `Coaching-Fullstack` (or `Coaching-backend`) repository.
2.  **Root Directory**: `backend`
3.  **Environment**: `Node`
4.  **Build Command**: `npm install`
5.  **Start Command**: `node server.js`
6.  **Environment Variables**:
    *   `MONGODB_URI`: (Your MongoDB URL)
    *   `JWT_SECRET`: (Your Secret Key)
    *   `GOOGLE_CLIENT_ID`: (From Google Console)
    *   `GOOGLE_CLIENT_SECRET`: (From Google Console)
    *   `BASE_URL`: Set this to your **Render** URL (e.g., `https://api.onrender.com`)
    *   `FRONTEND_URL`: Set this to your **Vercel** URL (e.g., `https://myapp.vercel.app`)

## 2. Frontend Deployment (Vercel)

1.  **Repo**: Connect your `Coaching-Fullstack` (or `Coaching`) repository.
2.  **Root Directory**: `client`
3.  **Framework Preset**: `Vite`
4.  **Environment Variables**:
    *   `VITE_API_URL`: Set this to your **Render** Backend URL (e.g., `https://api.onrender.com`)

---

## 🚀 Pro Tip:
Set the variables **before** you deploy to ensure everything connects immediately!
