import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.linear_model import LinearRegression

def calculate_fair_range(history):
    prices = np.array(history)
    mean = float(np.mean(prices))
    std = float(np.std(prices))
    
    fair_min = max(0.0, round(mean - std, 2))
    fair_max = round(mean + std, 2)
    
    return {
        "min": fair_min,
        "max": fair_max,
        "mean": round(mean, 2),
        "std": round(std, 2)
    }

def calculate_reasonability_score(price, min_fair, max_fair):
    if min_fair <= price <= max_fair:
        pos = (price - min_fair) / (max_fair - min_fair) if max_fair != min_fair else 0.5
        return int(round(95 - (pos * 10)))
    
    if price < min_fair:
        return 95
    
    diff_pct = ((price - max_fair) / max_fair) * 100
    score = 80 - (diff_pct * 2)
    return int(round(max(0, min(100, score))))

def calculate_zscore(history, current_price):
    prices = np.array(history)
    mean = float(np.mean(prices))
    std = float(np.std(prices))
    
    if std == 0:
        return 0.0
    
    return float(round((current_price - mean) / std, 2))

def run_isolation_forest(commodities_data):
    features = []
    for item in commodities_data:
        h = item["history"]
        curr = h[-1]
        m = float(np.mean(h))
        std = float(np.std(h))
        delta = curr - h[0]
        
        features.append([
            curr / m if m > 0 else 1.0,
            std / m if m > 0 else 0.0,
            delta / m if m > 0 else 0.0
        ])
    
    clf = IsolationForest(contamination=0.15, random_state=42, n_estimators=100)
    preds = clf.fit_predict(np.array(features))
    return [bool(p == -1) for p in preds]

def calculate_trend(history):
    X = np.arange(len(history)).reshape(-1, 1)
    y = np.array(history)
    
    model = LinearRegression()
    model.fit(X, y)
    slope = float(round(model.coef_[0], 2))
    
    pct_change = round(((history[-1] - history[0]) / history[0]) * 100, 1) if history[0] != 0 else 0.0
    
    if abs(pct_change) < 3:
        direction = "stable"
    elif pct_change > 0:
        direction = "up"
    else:
        direction = "down"
        
    return {
        "direction": direction,
        "slope": slope,
        "percent_change": pct_change
    }

def calculate_volatility(history):
    prices = np.array(history)
    m = float(np.mean(prices))
    s = float(np.std(prices))
    
    if m == 0:
        return {"index": 0.0, "level": "low"}
    
    cv = round((s / m) * 100, 1)
    level = "low" if cv < 10 else "moderate" if cv < 20 else "high"
    return {"index": cv, "level": level}

def build_alerts(analyzed_items):
    alerts = []
    for c in analyzed_items:
        z = abs(c["zScore"])
        score = c["reasonabilityScore"]
        trend = c["trend"]
        
        if z > 2.0 or score < 40:
            alerts.append({
                "icon": "🚨",
                "title": f"{c['name']} — High Anomaly Detected",
                "description": f"{c['name']} (₹{c['currentPrice']}/{c['unit'].replace('per ', '')}) exceeds estimated fair bounds (₹{c['fairPriceMin']}–₹{c['fairPriceMax']}). Z-score: {c['zScore']}. Isolation forest flag: {c['isAnomaly']}.",
                "severity": "high",
                "time": "Just now",
                "source": "Ensemble Detector"
            })
        elif z > 1.0 or score < 65:
            alerts.append({
                "icon": "⚠️",
                "title": f"{c['name']} — Price Inflation Warning",
                "description": f"{c['name']} at ₹{c['currentPrice']}/{c['unit'].replace('per ', '')} is above fair threshold ₹{c['fairPriceMax']}. Volatility index: {c['volatility']['index']}% ({c['volatility']['level']}).",
                "severity": "medium",
                "time": "Just now",
                "source": "Statistical Tracker"
            })
        elif score < 80:
            alerts.append({
                "icon": "📋",
                "title": f"{c['name']} — Minor Trend Shift",
                "description": f"{c['name']} trending {trend['direction']} ({trend['percent_change']}% change). Operating near normal seasonal variation.",
                "severity": "low",
                "time": "Today",
                "source": "Trend Model"
            })
            
    severity_rank = {"high": 0, "medium": 1, "low": 2}
    alerts.sort(key=lambda a: severity_rank.get(a["severity"], 3))
    return alerts

def _sanitize_for_json(obj):
    if isinstance(obj, dict):
        return {k: _sanitize_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_sanitize_for_json(v) for v in obj]
    elif isinstance(obj, (np.integer, int)):
        return int(obj)
    elif isinstance(obj, (np.floating, float)):
        return float(obj)
    elif isinstance(obj, (np.bool_, bool)):
        return bool(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    return obj

def analyze_all(raw_data):
    if_flags = run_isolation_forest(raw_data)
    analyzed = []
    total_score = 0
    
    for i, item in enumerate(raw_data):
        h = item["history"]
        curr = h[-1]
        prev = h[-2]
        
        bounds = calculate_fair_range(h)
        score = calculate_reasonability_score(curr, bounds["min"], bounds["max"])
        z = calculate_zscore(h, curr)
        tr = calculate_trend(h)
        vol = calculate_volatility(h)
        
        status = "fair" if score >= 75 else "watch" if score >= 50 else "alert"
        pct_change = round(((curr - prev) / prev) * 100, 1) if prev != 0 else 0.0
        
        entry = {
            "name": item["name"],
            "emoji": item["emoji"],
            "unit": item["unit"],
            "category": item["category"],
            "currentPrice": curr,
            "previousPrice": prev,
            "fairPriceMin": bounds["min"],
            "fairPriceMax": bounds["max"],
            "fairPriceMean": bounds["mean"],
            "fairPriceStd": bounds["std"],
            "history": h,
            "reasonabilityScore": score,
            "status": status,
            "percentChange": pct_change,
            "zScore": z,
            "isAnomaly": if_flags[i],
            "trend": tr,
            "volatility": vol,
            "source": item.get("source", "Market API")
        }
        
        analyzed.append(entry)
        total_score += score
        
    alerts = build_alerts(analyzed)
    avg_score = round(total_score / len(analyzed)) if analyzed else 0
    high_count = len([a for a in alerts if a["severity"] == "high"])
    
    mkt_status = "Stable" if avg_score >= 75 else "Caution" if avg_score >= 50 else "Critical"
    
    res = {
        "commodities": analyzed,
        "alerts": alerts,
        "stats": {
            "totalCommodities": len(analyzed),
            "avgReasonability": avg_score,
            "activeAlerts": high_count,
            "marketStatus": mkt_status
        }
    }
    return _sanitize_for_json(res)

def evaluate_custom_price(item_data, test_price):
    h = item_data["history"]
    bounds = calculate_fair_range(h)
    score = calculate_reasonability_score(test_price, bounds["min"], bounds["max"])
    z = calculate_zscore(h, test_price)
    vol = calculate_volatility(h)
    
    if test_price > bounds["max"]:
        pct_over = round(((test_price - bounds["max"]) / bounds["max"]) * 100, 1)
        diagnosis = f"Price is {pct_over}% above estimated fair ceiling (₹{bounds['max']}). Potential inflation or price manipulation."
        status = "alert" if score < 50 else "watch"
    elif test_price < bounds["min"]:
        pct_under = round(((bounds["min"] - test_price) / bounds["min"]) * 100, 1)
        diagnosis = f"Price is {pct_under}% below standard benchmark floor (₹{bounds['min']}). High consumer affordability."
        status = "fair"
    else:
        diagnosis = f"Price is within normal historical equilibrium (₹{bounds['min']} – ₹{bounds['max']}). Assessed as fair and reasonable."
        status = "fair"
        
    return _sanitize_for_json({
        "commodity": item_data["name"],
        "emoji": item_data["emoji"],
        "unit": item_data["unit"],
        "category": item_data["category"],
        "currentBaseline": h[-1],
        "evaluatedPrice": test_price,
        "fairMin": bounds["min"],
        "fairMax": bounds["max"],
        "fairMean": bounds["mean"],
        "fairStd": bounds["std"],
        "score": score,
        "status": status,
        "zScore": z,
        "isAnomaly": bool(abs(z) > 2.0 or score < 40),
        "volatility": vol,
        "diagnosis": diagnosis
    })

if __name__ == "__main__":
    import sys, io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    from data import COMMODITIES
    
    print("[+] Testing ML analysis pipeline...")
    output = analyze_all(COMMODITIES)
    print(f"[+] Processed {output['stats']['totalCommodities']} items | Market state: {output['stats']['marketStatus']}")
