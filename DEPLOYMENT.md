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

## 🌐 Public Deployment Options

### 🌟 Option 1: GitHub Pages (100% Free, Static Web Hosting) — Recommended for Portfolio

Because the frontend is 100% self-contained in HTML, CSS, and browser-side JavaScript with embedded benchmark datasets and statistical heuristics, it can be hosted directly on **GitHub Pages** with zero cost, zero server wake-up lag, and high reliability.

**Live Deployment URL:**  
`https://mpavan3103.github.io/priceguard-ai/`

#### Step-by-Step GitHub Pages Activation:
1. **Push your code to GitHub:**
   ```bash
   git add index.html style.css script.js README.md DEPLOYMENT.md .gitignore
   git commit -m "feat: configure static client engine for GitHub Pages deployment"
   git push origin main
   ```
2. **Enable GitHub Pages:**
   - Go to your repository on GitHub: `https://github.com/mpavan3103/priceguard-ai`
   - Click on the **Settings** tab (gear icon at the top).
   - In the left sidebar, click on **Pages** (under the "Code and automation" section).
   - Under **Build and deployment**:
     - **Source:** Select `Deploy from a branch`
     - **Branch:** Select `main`
     - **Folder:** Select `/ (root)`
     - Click **Save**.
3. **Your Live Website:**
   - Within 30–60 seconds, GitHub Pages will deploy the site at:
     **`https://mpavan3103.github.io/priceguard-ai/`**

---

### 🌟 Option 2: Render.com (Full Python ML Backend Web Service)

If you also wish to expose the Python Flask REST API (`/api/dashboard`, `/api/evaluate`) as a live web service, Render provides a free tier.

#### Step-by-Step Instructions:
1. Create a free account on [Render.com](https://render.com).
2. Click **New +** > **Web Service** and connect your `priceguard-ai` repository.
3. Configure settings:
   - **Name:** `priceguard-ai`
   - **Branch:** `main`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Instance Type:** `Free`
4. Click **Deploy Web Service**.
5. Render will issue a public URL (e.g., `https://priceguard-ai.onrender.com`).

* **Free Tier Sleep Behavior:** Free instances on cloud platforms like Render spin down after 15 minutes of inactivity and take ~30–50 seconds to wake on the next visit.
* **PriceGuard AI Advantage:** The frontend has an embedded client-side demonstration fallback. If a recruiter or interviewer opens your portfolio link while the server is waking up, the page loads **instantly** with full interactive functionality, displaying:
  `[🟡 Demo Mode • Benchmarks]` transitioning to `[🟢 ML Backend Active]` once the API responds.

---

## 🔒 Security Best Practices
- **No Secrets in Frontend:** All model calculations and data processing remain on the backend or in clean, public benchmark files.
- **Environment Variables:** If connecting to external databases or paid APIs in the future, set them in the Render Dashboard under **Environment Variables** or in your local `.env` file (see `.env.example`).
