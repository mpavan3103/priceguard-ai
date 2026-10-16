import sys
import os
import webbrowser
import threading
import time
from flask import Flask, jsonify, request, send_from_directory
from data import COMMODITIES
from ml_model import analyze_all, evaluate_custom_price, calculate_fair_range, calculate_volatility, calculate_trend

# Handle PyInstaller temporary directory path if frozen
if getattr(sys, 'frozen', False):
    base_dir = sys._MEIPASS
else:
    base_dir = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, static_folder=base_dir, static_url_path="")

# CORS and Cache Control Headers
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response

@app.route("/")
def index():
    return send_from_directory(base_dir, "index.html")

@app.route("/api/dashboard")
def api_dashboard():
    return jsonify(analyze_all(COMMODITIES))

@app.route("/api/commodities")
def api_commodities():
    res = analyze_all(COMMODITIES)
    return jsonify(res["commodities"])

@app.route("/api/alerts")
def api_alerts():
    res = analyze_all(COMMODITIES)
    return jsonify(res["alerts"])

@app.route("/api/stats")
def api_stats():
    res = analyze_all(COMMODITIES)
    return jsonify(res["stats"])

@app.route("/api/evaluate", methods=["GET", "POST"])
def api_evaluate():
    """
    Evaluates a user-entered custom price against the ML models.
    Accepts query parameters (GET) or JSON body (POST):
      id: commodity id or name (e.g. 'onion', 'tomato')
      price: numeric custom price (e.g. 75.0)
    """
    if request.method == "POST":
        payload = request.get_json(silent=True) or {}
        item_id = payload.get("id") or payload.get("name")
        price = payload.get("price")
    else:
        item_id = request.args.get("id") or request.args.get("name")
        price = request.args.get("price")

    if not item_id or price is None:
        return jsonify({"error": "Missing 'id' or 'price' parameter"}), 400

    try:
        price = float(price)
        if price <= 0:
            return jsonify({"error": "Price must be a positive number"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Price must be a valid number"}), 400

    # Locate commodity by id or name
    target = None
    item_id_lower = str(item_id).lower().replace(" ", "_")
    for c in COMMODITIES:
        if c["id"].lower() == item_id_lower or c["name"].lower() == str(item_id).lower():
            target = c
            break

    if not target:
        return jsonify({"error": f"Commodity '{item_id}' not found"}), 404

    result = evaluate_custom_price(target, price)
    return jsonify(result)

@app.route("/api/compare", methods=["GET"])
def api_compare():
    """
    Compares two commodities side-by-side.
    Query params: id1 and id2
    """
    id1 = request.args.get("id1")
    id2 = request.args.get("id2")

    if not id1 or not id2:
        return jsonify({"error": "Both 'id1' and 'id2' parameters are required"}), 400

    def find_item(cid):
        cid_clean = str(cid).lower().replace(" ", "_")
        for c in COMMODITIES:
            if c["id"].lower() == cid_clean or c["name"].lower() == str(cid).lower():
                return c
        return None

    item1 = find_item(id1)
    item2 = find_item(id2)

    if not item1 or not item2:
        return jsonify({"error": "One or both commodities could not be found"}), 404

    all_analyzed = analyze_all(COMMODITIES)["commodities"]
    a1 = next((x for x in all_analyzed if x["name"] == item1["name"]), None)
    a2 = next((x for x in all_analyzed if x["name"] == item2["name"]), None)

    return jsonify({
        "commodity1": a1,
        "commodity2": a2,
        "priceRatio": round(a1["currentPrice"] / a2["currentPrice"], 2) if a2["currentPrice"] else None,
        "scoreDifference": a1["reasonabilityScore"] - a2["reasonabilityScore"]
    })

def open_browser():
    time.sleep(1.2)
    port = int(os.environ.get("PORT", 5000))
    webbrowser.open(f"http://localhost:{port}")

if __name__ == "__main__":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    
    port = int(os.environ.get("PORT", 5000))
    print("[*] Starting PriceGuard AI Server...")
    data = analyze_all(COMMODITIES)
    print(f"[*] Loaded {data['stats']['totalCommodities']} commodities | Market status: {data['stats']['marketStatus']}")
    print(f"[*] Running on http://localhost:{port}")
    
    # Auto-open browser only on local desktop (not on cloud servers like Render)
    if not os.environ.get("RENDER") and not os.environ.get("DYNO"):
        threading.Thread(target=open_browser, daemon=True).start()

    app.run(host="0.0.0.0", port=port, debug=False)
