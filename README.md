# 🛡️ PriceGuard AI — Commodity Price Intelligence & Reasonability System

A full-stack, machine-learning-driven price monitoring platform designed to evaluate commodity market reasonability, detect artificial price manipulation, compare products side-by-side, and track price-drop alerts.

![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python)
![Flask](https://img.shields.io/badge/Backend-Flask-lightgrey?logo=flask)
![ML](https://img.shields.io/badge/ML-Scikit--Learn-orange?logo=scikit-learn)
![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20Chart.js-teal)

---

## 🌟 Key Features

- **Dynamic Fair Price Estimation:** Computes statistical equilibrium bounds ($\mu \pm 1\sigma$) dynamically from time-series mandi benchmarks.
- **Ensemble Anomaly Detection:** Combines **Z-score** statistical deviations with **Scikit-learn Isolation Forest** models to catch artificial spikes and hoarding patterns.
- **Side-by-Side Product Comparison:** Compare any two commodities side-by-side with metric comparison tables and dual-line Chart.js historical overlays.
- **Interactive AI Price Simulator:** Allows visitors and recruiters to enter any custom price for any commodity and receive instant ML reasonability ratings and diagnoses.
- **Real-Time Search & Category Filters:** Instant keystroke search and multi-category filtering (Grains, Vegetables, Dairy, Essentials, and High Anomalies).
- **Custom Price Tracking & Drop Alerts:** Interactive watchlist stored in `localStorage` with automated condition checks and simulation triggers.
- **Product Details Modal:** Detailed view showing 12-month highs/lows, volatility indices (Coefficient of Variation), and complete pricing histories.
- **100% Portfolio Resilience:** Features a dual-mode client engine that connects to the live Flask backend when available, while providing seamless client-side calculations and benchmark data if cloud instances are sleeping.

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

## 🌐 Free Public Deployment (Render.com)

1. Push this folder to a GitHub repository.
2. In [Render.com](https://render.com), click **New + > Web Service** and select your repo.
3. Settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Instance Type:** `Free`
4. Click **Deploy**. Your live site will be ready at `https://your-app-name.onrender.com`!

*(Refer to [`DEPLOYMENT.md`](DEPLOYMENT.md) for detailed deployment walkthroughs).*

---

## 🌍 UN Sustainable Development Goals (SDG) Alignment
- **SDG 1 (No Poverty):** Safeguards low-income household purchasing power against food staple price gouging.
- **SDG 8 (Decent Work & Economic Growth):** Fosters market transparency and fair trade dynamics.
- **SDG 12 (Responsible Consumption & Production):** Promotes data-driven supply chain accountability.

---

*Built with ❤️ for transparent markets and fair pricing.*
