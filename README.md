# 🛡️ PriceGuard AI — Commodity Price Intelligence & Reasonability System

A machine-learning-driven price monitoring platform designed to evaluate commodity market reasonability, detect artificial price manipulation, compare products side-by-side, and track price-drop alerts.

[![GitHub Pages](https://img.shields.io/badge/Live_Demo-GitHub_Pages-blue?logo=github)](https://mpavan3103.github.io/priceguard-ai/)
![License](https://img.shields.io/badge/license-MIT-green)
![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-teal)
![Charts](https://img.shields.io/badge/Visualization-Chart.js%204.4-yellow)
![Python](https://img.shields.io/badge/Backend-Python%20Flask-blue?logo=python)
![ML](https://img.shields.io/badge/ML-Scikit--Learn%20Isolation%20Forest-orange?logo=scikit-learn)

🌐 **Live Portfolio Website:** [https://mpavan3103.github.io/priceguard-ai/](https://mpavan3103.github.io/priceguard-ai/)

> **Portfolio Notice:** The published website on GitHub Pages runs as a high-speed, client-side static application using verified historical market benchmark datasets (eNAM &amp; AGMARKNET). The standalone Python machine-learning backend (`app.py`, `ml_model.py`) is preserved in this repository for local execution and REST API integration.

---

## 🌟 Key Features

- **Dynamic Fair Price Estimation:** Computes statistical equilibrium bounds ($\mu \pm 1\sigma$) dynamically from time-series mandi benchmarks.
- **Ensemble Anomaly Detection:** Combines **Z-score** statistical deviations with **Scikit-learn Isolation Forest** modeling to detect artificial spikes and hoarding patterns.
- **Side-by-Side Product Comparison:** Compare any two commodities side-by-side with metric comparison tables and dual-line Chart.js historical overlays.
- **Interactive AI Price Simulator:** Allows visitors and recruiters to enter any custom price for any commodity and receive instant reasonability ratings and diagnoses in real time.
- **Real-Time Search & Category Filters:** Keystroke search and category filtering across Grains, Vegetables, Dairy, Essentials, and High Anomalies.
- **Custom Price Tracking & Drop Alerts:** Interactive watchlist stored in `localStorage` with automated condition checks and simulation triggers.
- **Product Details Modal:** Detailed breakdown showing 12-month highs/lows, volatility indices (Coefficient of Variation), and complete monthly price trajectories.
- **100% Static & Serverless Ready:** Works directly on GitHub Pages with zero external backend runtime required.

---

## 🧠 Machine Learning & Statistical Methodology

1. **Equilibrium Fair Range:**  
   $$\text{Fair Range} = [\mu - \sigma, \, \mu + \sigma]$$  
   Captures the normal ~68% historical price distribution under standard economic conditions.

2. **Z-Score Anomaly Threshold:**  
   $$Z = \frac{x - \mu}{\sigma}$$  
   Quantifies standard deviations from baseline ($|Z| > 2.0$ flags statistical anomalies).

3. **Isolation Forest Model:**  
   Unsupervised tree ensemble evaluating multi-feature vectors:  
   `[price_ratio, coefficient_of_variation, cumulative_change]`

4. **Linear Regression Trend Slope:**  
   Calculates rate-of-change over time to differentiate gradual seasonal inflation from sudden market gouging.

---

## 🏗️ Architecture & Project Structure

```
price-dashboard/
├── app.py                # Flask REST API & static server
├── ml_model.py           # Statistical analytics & ML pipeline
├── data.py               # Benchmark historical commodity dataset
├── index.html            # Responsive semantic web application
├── style.css             # Glassmorphic dark UI design system
├── script.js             # Client engine (Search, Compare, Simulator, Charts)
├── requirements.txt      # Python dependencies (Flask, NumPy, Scikit-learn, Gunicorn)
├── Procfile              # Production server configuration for cloud hosting
├── runtime.txt           # Python runtime version
├── .env.example          # Environment variable template
├── .gitignore            # Git exclusion rules
├── DEPLOYMENT.md         # Step-by-step free deployment guide
└── run.bat               # One-click Windows starter script
```

---

## 🚀 REST API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | `GET` | Serves the interactive web application |
| `/api/dashboard` | `GET` | Returns all commodities, system alerts, and market summary stats |
| `/api/commodities` | `GET` | Returns list of analyzed commodities with reasonability scores |
| `/api/evaluate` | `GET/POST` | Evaluates a custom price input against ML bounds (`?id=onion&price=75`) |
| `/api/compare` | `GET` | Returns side-by-side metrics for two commodities (`?id1=onion&id2=tomato`) |
| `/api/alerts` | `GET` | Returns active anomaly detection notifications |
| `/api/stats` | `GET` | Returns top-level market health metrics |

---

## 💻 Local Setup & Execution

### Option 1: One-Click Windows Run
Double-click **`run.bat`** in the project folder.

### Option 2: Terminal / Command Prompt
```bash
# 1. Install dependencies
python -m pip install -r requirements.txt

# 2. Run the server
python app.py

# 3. Open your browser
http://localhost:5000
```

---

## 🌐 Deployment Options

### Option 1: GitHub Pages (Recommended for Portfolio — 100% Free & Static)

Because the site requires zero backend runtime on GitHub Pages:
1. Push your changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Configure PriceGuard AI for GitHub Pages"
   git push origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages**
   - Under **Build and deployment**, set Source to **Deploy from a branch**
   - Branch: **`main`**, Folder: **`/ (root)`**
   - Click **Save**
3. Your live application will be available at:  
   **[https://mpavan3103.github.io/priceguard-ai/](https://mpavan3103.github.io/priceguard-ai/)**

---

### Option 2: Render.com (Full Python ML Backend Web Service)

If you also want to expose the live Python Flask REST API:
1. In [Render.com](https://render.com), click **New + > Web Service** and select your repo.
2. Configure settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Instance Type:** `Free`
3. Click **Deploy**. Your live Python API will be ready at `https://your-app-name.onrender.com`!

*(See [`DEPLOYMENT.md`](DEPLOYMENT.md) for full walkthroughs).*

---

## 🌍 UN Sustainable Development Goals (SDG) Alignment
- **SDG 1 (No Poverty):** Safeguards low-income household purchasing power against food staple price gouging.
- **SDG 8 (Decent Work & Economic Growth):** Fosters market transparency and fair trade dynamics.
- **SDG 12 (Responsible Consumption & Production):** Promotes data-driven supply chain accountability.

---

*Built with ❤️ for transparent markets and fair pricing.*
