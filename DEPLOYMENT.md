# 🚀 PriceGuard AI — Deployment & Local Setup Guide

This guide explains how to run **PriceGuard AI** locally and how to deploy it to public hosting platforms for your personal portfolio.

---

## 🛠️ Local Development & Running

### Option 1: Standard Python Flask Environment
1. **Clone or Navigate to the Directory:**
   ```bash
   cd price-dashboard
   ```
2. **Install Dependencies:**
   ```bash
   python -m pip install -r requirements.txt
   ```
3. **Start the Application:**
   ```bash
   python app.py
   ```
4. **Access the Application:**
   Open your browser to: `http://localhost:5000`

### Option 2: One-Click Windows Starter
Double-click `run.bat` in the project root directory.

### Option 3: Standalone Windows Executable (.exe)
You can launch `dist/PriceGuardAI.exe` directly on any Windows PC without having Python installed.

---

## 🌐 Public Deployment (Free Hosting)

Because PriceGuard AI features a **Python backend with Scikit-learn and NumPy**, it requires a hosting provider that supports Python web services.

### 🌟 Recommended: Render.com (Free Web Service)

Render provides a 100% free tier for Python web services that connects directly to your GitHub repository.

#### Step-by-Step Instructions:
1. **Push your project to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit of PriceGuard AI portfolio web app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/priceguard-ai.git
   git push -u origin main
   ```
   *(Note: The included `.gitignore` will automatically prevent any secrets, virtual environments, or large `.exe` files from being pushed).*

2. **Create a Free Account on [Render.com](https://render.com).**

3. **Deploy the Web Service:**
   - Click **New +** > **Web Service**.
   - Choose **Build and deploy from a Git repository** and connect your `priceguard-ai` repository.
   - Configure the following settings:
     - **Name:** `priceguard-ai` (or your preferred name)
     - **Region:** Choose the region nearest to you (e.g., Singapore, Frankfurt, Oregon)
     - **Branch:** `main`
     - **Runtime:** `Python 3`
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `gunicorn app:app`
     - **Instance Type:** `Free`
   - Click **Deploy Web Service**.

4. **Your Live Portfolio URL:**
   Within 2–3 minutes, Render will build the environment and issue a public HTTPS link:  
   `https://priceguard-ai.onrender.com`

---

### 🛡️ Built-in Portfolio Resilience (Zero Downtime)

* **Free Tier Sleep Behavior:** Free instances on cloud platforms like Render spin down after 15 minutes of inactivity and take ~30–50 seconds to wake on the next visit.
* **PriceGuard AI Advantage:** The frontend has an embedded client-side demonstration fallback. If a recruiter or interviewer opens your portfolio link while the server is waking up, the page loads **instantly** with full interactive functionality, displaying:
  `[🟡 Demo Mode • Benchmarks]` transitioning to `[🟢 ML Backend Active]` once the API responds.

---

## 🔒 Security Best Practices
- **No Secrets in Frontend:** All model calculations and data processing remain on the backend or in clean, public benchmark files.
- **Environment Variables:** If connecting to external databases or paid APIs in the future, set them in the Render Dashboard under **Environment Variables** or in your local `.env` file (see `.env.example`).
