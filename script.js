/**
 * PriceGuard AI — Frontend Client Engine
 * Handles real-time API synchronization, search & filter, side-by-side comparison,
 * AI price simulation, interactive Chart.js graphs, custom watchlist alerts, and details modal.
 */

// -----------------------------------------------------------------------------
// 1. STATE & BENCHMARK DATASET (Fallback for full offline/demo resilience)
// -----------------------------------------------------------------------------

const DEFAULT_COMMODITIES = [
    {
        id: "rice_basmati",
        name: "Rice (Basmati)",
        emoji: "🍚",
        unit: "per kg",
        category: "Grains",
        currentPrice: 58,
        previousPrice: 52,
        fairPriceMin: 44.07,
        fairPriceMax: 53.1,
        fairPriceMean: 48.58,
        fairPriceStd: 4.51,
        history: [42, 44, 43, 45, 48, 47, 50, 52, 49, 53, 52, 58],
        reasonabilityScore: 62,
        status: "watch",
        percentChange: 11.5,
        zScore: 2.08,
        isAnomaly: false,
        trend: { direction: "up", slope: 1.15, percent_change: 38.1 },
        volatility: { index: 9.3, level: "low" },
        source: "eNAM"
    },
    {
        id: "wheat",
        name: "Wheat",
        emoji: "🌾",
        unit: "per kg",
        category: "Grains",
        currentPrice: 32,
        previousPrice: 31,
        fairPriceMin: 27.29,
        fairPriceMax: 31.21,
        fairPriceMean: 29.25,
        fairPriceStd: 1.96,
        history: [26, 27, 28, 27, 29, 30, 28, 31, 30, 32, 31, 32],
        reasonabilityScore: 75,
        status: "fair",
        percentChange: 3.2,
        zScore: 1.4,
        isAnomaly: false,
        trend: { direction: "up", slope: 0.52, percent_change: 23.1 },
        volatility: { index: 6.7, level: "low" },
        source: "eNAM"
    },
    {
        id: "onion",
        name: "Onion",
        emoji: "🧅",
        unit: "per kg",
        category: "Vegetables",
        currentPrice: 72,
        previousPrice: 65,
        fairPriceMin: 31.26,
        fairPriceMax: 59.07,
        fairPriceMean: 45.17,
        fairPriceStd: 13.91,
        history: [30, 28, 35, 32, 40, 38, 42, 45, 55, 60, 65, 72],
        reasonabilityScore: 36,
        status: "alert",
        percentChange: 10.8,
        zScore: 1.93,
        isAnomaly: true,
        trend: { direction: "up", slope: 3.82, percent_change: 140.0 },
        volatility: { index: 30.8, level: "high" },
        source: "AGMARKNET"
    },
    {
        id: "tomato",
        name: "Tomato",
        emoji: "🍅",
        unit: "per kg",
        category: "Vegetables",
        currentPrice: 48,
        previousPrice: 55,
        fairPriceMin: 27.06,
        fairPriceMax: 58.94,
        fairPriceMean: 43.0,
        fairPriceStd: 15.94,
        history: [25, 30, 45, 80, 65, 40, 35, 30, 28, 35, 55, 48],
        reasonabilityScore: 88,
        status: "fair",
        percentChange: -12.7,
        zScore: 0.31,
        isAnomaly: true,
        trend: { direction: "up", slope: 1.18, percent_change: 92.0 },
        volatility: { index: 37.1, level: "high" },
        source: "AGMARKNET"
    },
    {
        id: "potato",
        name: "Potato",
        emoji: "🥔",
        unit: "per kg",
        category: "Vegetables",
        currentPrice: 28,
        previousPrice: 27,
        fairPriceMin: 23.57,
        fairPriceMax: 27.26,
        fairPriceMean: 25.42,
        fairPriceStd: 1.85,
        history: [22, 24, 23, 25, 26, 24, 28, 27, 26, 25, 27, 28],
        reasonabilityScore: 75,
        status: "fair",
        percentChange: 3.7,
        zScore: 1.4,
        isAnomaly: false,
        trend: { direction: "up", slope: 0.45, percent_change: 27.3 },
        volatility: { index: 7.3, level: "low" },
        source: "AGMARKNET"
    },
    {
        id: "milk",
        name: "Milk",
        emoji: "🥛",
        unit: "per litre",
        category: "Dairy",
        currentPrice: 62,
        previousPrice: 60,
        fairPriceMin: 51.32,
        fairPriceMax: 58.51,
        fairPriceMean: 54.92,
        fairPriceStd: 3.59,
        history: [50, 50, 52, 52, 54, 54, 55, 56, 56, 58, 60, 62],
        reasonabilityScore: 68,
        status: "watch",
        percentChange: 3.3,
        zScore: 1.97,
        isAnomaly: false,
        trend: { direction: "up", slope: 1.05, percent_change: 24.0 },
        volatility: { index: 6.5, level: "low" },
        source: "NDDB"
    },
    {
        id: "sugar",
        name: "Sugar",
        emoji: "🍬",
        unit: "per kg",
        category: "Essentials",
        currentPrice: 45,
        previousPrice: 45,
        fairPriceMin: 41.06,
        fairPriceMax: 44.44,
        fairPriceMean: 42.75,
        fairPriceStd: 1.69,
        history: [40, 41, 42, 40, 43, 42, 44, 43, 44, 44, 45, 45],
        reasonabilityScore: 77,
        status: "fair",
        percentChange: 0.0,
        zScore: 1.33,
        isAnomaly: false,
        trend: { direction: "up", slope: 0.42, percent_change: 12.5 },
        volatility: { index: 4.0, level: "low" },
        source: "ISMA"
    },
    {
        id: "cooking_oil",
        name: "Cooking Oil",
        emoji: "🫒",
        unit: "per litre",
        category: "Essentials",
        currentPrice: 165,
        previousPrice: 155,
        fairPriceMin: 123.38,
        fairPriceMax: 152.12,
        fairPriceMean: 137.75,
        fairPriceStd: 14.37,
        history: [115, 120, 125, 130, 128, 135, 140, 142, 148, 150, 155, 165],
        reasonabilityScore: 63,
        status: "watch",
        percentChange: 6.5,
        zScore: 1.9,
        isAnomaly: false,
        trend: { direction: "up", slope: 4.12, percent_change: 43.5 },
        volatility: { index: 10.4, level: "moderate" },
        source: "SEA"
    }
];

const DEFAULT_ALERTS = [
    {
        icon: "🚨",
        title: "Onion — Significant Price Anomaly Detected",
        description: "Onion price of ₹72/kg exceeds the AI-determined fair range of ₹31.26–₹59.07. Z-score of 1.93 indicates abnormal deviation. Isolation Forest model confirms anomalous pattern.",
        severity: "high",
        time: "Monthly Benchmark Feed",
        source: "Ensemble Model (Z-Score + Isolation Forest)"
    },
    {
        icon: "🚨",
        title: "Rice (Basmati) — Elevated Fair Threshold",
        description: "Rice price of ₹58/kg exceeds the fair ceiling of ₹53.10. Z-score of 2.08 indicates rapid escalation.",
        severity: "high",
        time: "Monthly Benchmark Feed",
        source: "Statistical Anomaly Tracker"
    },
    {
        icon: "⚠️",
        title: "Cooking Oil — Sustained Price Inflation",
        description: "Cooking Oil at ₹165/litre is above fair threshold ₹152.12. Volatility index: 10.4% (moderate).",
        severity: "medium",
        time: "Monthly Benchmark Feed",
        source: "Statistical Tracker"
    },
    {
        icon: "⚠️",
        title: "Milk — Above Ceiling",
        description: "Milk at ₹62/litre is above the fair ceiling of ₹58.51. Monitoring for further escalation.",
        severity: "medium",
        time: "Monthly Benchmark Feed",
        source: "Statistical Tracker"
    }
];

const monthLabels = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

// App State
let commodities = JSON.parse(JSON.stringify(DEFAULT_COMMODITIES));
let alerts = JSON.parse(JSON.stringify(DEFAULT_ALERTS));
let watchlist = [];
let currentCategory = "all";
let currentSearch = "";
let currentSort = "default";

let priceChart = null;
let comparisonChart = null;

// -----------------------------------------------------------------------------
// 2. WATCHLIST (LOCALSTORAGE PERSISTENCE)
// -----------------------------------------------------------------------------

function loadWatchlist() {
    try {
        const stored = localStorage.getItem("priceguard_watchlist");
        if (stored) {
            watchlist = JSON.parse(stored);
        } else {
            // Pre-populate with sample alerts for portfolio demonstration
            watchlist = [
                {
                    id: "alert_1",
                    commodityId: "onion",
                    name: "Onion",
                    emoji: "🧅",
                    targetPrice: 45,
                    type: "below",
                    createdAt: "Recent",
                    triggered: false
                },
                {
                    id: "alert_2",
                    commodityId: "tomato",
                    name: "Tomato",
                    emoji: "🍅",
                    targetPrice: 35,
                    type: "below",
                    createdAt: "Recent",
                    triggered: false
                }
            ];
            saveWatchlist();
        }
    } catch (e) {
        console.warn("Could not load watchlist from localStorage", e);
    }
}

function saveWatchlist() {
    try {
        localStorage.setItem("priceguard_watchlist", JSON.stringify(watchlist));
    } catch (e) {
        console.warn("Could not save watchlist to localStorage", e);
    }
}

// -----------------------------------------------------------------------------
// 3. API FETCH & FALLBACK
// -----------------------------------------------------------------------------

async function syncWithAPI() {
    const statusEl = document.getElementById("backend-status");
    try {
        const response = await fetch("/api/dashboard", { cache: "no-store" });
        if (response.ok) {
            const data = await response.json();
            if (data.commodities && data.commodities.length > 0) {
                commodities = data.commodities;
            }
            if (data.alerts && data.alerts.length > 0) {
                alerts = data.alerts;
            }
            if (statusEl) {
                statusEl.innerHTML = '<span class="status-dot"></span><span>ML Backend Active</span>';
                statusEl.style.color = "var(--fair)";
                statusEl.style.borderColor = "rgba(74, 222, 128, 0.3)";
            }
            return true;
        }
    } catch (error) {
        // Backend offline or sleeping (e.g. Free Render instance waking up)
        console.log("ℹ️ Server offline or sleeping. Operating in client-side benchmark demonstration mode.");
    }

    if (statusEl) {
        statusEl.innerHTML = '<span class="status-dot" style="background:var(--watch)"></span><span>Demo Mode • Benchmarks</span>';
        statusEl.style.color = "var(--watch)";
        statusEl.style.borderColor = "rgba(251, 191, 36, 0.3)";
    }
    return false;
}

// -----------------------------------------------------------------------------
// 4. RENDERING FUNCTIONS
// -----------------------------------------------------------------------------

function renderStatsOverview() {
    const container = document.getElementById("stats-overview");
    if (!container) return;

    const total = commodities.length;
    const highAlerts = alerts.filter(a => a.severity === "high").length;
    const avgScore = Math.round(commodities.reduce((acc, c) => acc + (c.reasonabilityScore || 70), 0) / (total || 1));
    const marketStatus = avgScore >= 75 ? "Stable" : avgScore >= 50 ? "Caution" : "Critical";
    const statusColor = avgScore >= 75 ? "var(--fair)" : avgScore >= 50 ? "var(--watch)" : "var(--alert)";

    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-label">Commodities Tracked</div>
            <div class="stat-value">${total}</div>
            <div class="stat-sub">Essential food staples monitored</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Avg Reasonability Score</div>
            <div class="stat-value" style="color: ${statusColor}">${avgScore}%</div>
            <div class="stat-sub">Weighted market fairness index</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Active High Anomaly Alerts</div>
            <div class="stat-value" style="color: ${highAlerts > 0 ? 'var(--alert)' : 'var(--fair)'}">${highAlerts}</div>
            <div class="stat-sub">Flagged by Isolation Forest</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Market State</div>
            <div class="stat-value" style="color: ${statusColor}">${marketStatus}</div>
            <div class="stat-sub">Overall price equilibrium</div>
        </div>
    `;
}

function getFilteredAndSortedCommodities() {
    let items = [...commodities];

    // Filter by Category
    if (currentCategory !== "all") {
        if (currentCategory === "anomalies") {
            items = items.filter(c => c.isAnomaly || c.status === "alert");
        } else {
            items = items.filter(c => c.category && c.category.toLowerCase() === currentCategory.toLowerCase());
        }
    }

    // Filter by Search Query
    if (currentSearch.trim()) {
        const q = currentSearch.toLowerCase().trim();
        items = items.filter(c => 
            c.name.toLowerCase().includes(q) || 
            (c.category && c.category.toLowerCase().includes(q))
        );
    }

    // Sort
    switch (currentSort) {
        case "score-asc":
            items.sort((a, b) => a.reasonabilityScore - b.reasonabilityScore);
            break;
        case "score-desc":
            items.sort((a, b) => b.reasonabilityScore - a.reasonabilityScore);
            break;
        case "price-asc":
            items.sort((a, b) => a.currentPrice - b.currentPrice);
            break;
        case "price-desc":
            items.sort((a, b) => b.currentPrice - a.currentPrice);
            break;
        case "name-asc":
            items.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            break;
    }

    return items;
}

function renderCommodityGrid() {
    const container = document.getElementById("commodity-grid");
    const emptyState = document.getElementById("empty-state");
    if (!container) return;

    const filtered = getFilteredAndSortedCommodities();

    if (filtered.length === 0) {
        container.innerHTML = "";
        if (emptyState) emptyState.classList.remove("hidden");
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    container.innerHTML = filtered.map((c) => {
        const score = c.reasonabilityScore ?? 70;
        const status = c.status || (score >= 75 ? "fair" : score >= 50 ? "watch" : "alert");
        const statusColor = status === "fair" ? "var(--fair)" : status === "watch" ? "var(--watch)" : "var(--alert)";
        const change = c.percentChange !== undefined ? c.percentChange : (((c.currentPrice - c.previousPrice) / c.previousPrice) * 100).toFixed(1);
        const isUp = change > 0;
        const isStable = Math.abs(change) < 0.8;

        const trendClass = isStable ? "trend-stable" : isUp ? "trend-up" : "trend-down";
        const trendText = isStable ? "→ Stable (0%)" : (isUp ? `↑ +${change}%` : `↓ ${change}%`);
        const badgeText = status === "fair" ? "Fair" : status === "watch" ? "Watch" : "Alert";

        return `
            <article class="commodity-card status-${status}" data-id="${c.id || c.name}">
                <div class="card-top">
                    <div class="card-title-group">
                        <span class="card-emoji" aria-hidden="true">${c.emoji}</span>
                        <div>
                            <h3 class="card-name">${c.name}</h3>
                            <div class="card-category">${c.category || 'Commodity'} &bull; Source: ${c.source || 'eNAM'}</div>
                        </div>
                    </div>
                    <span class="badge badge-${status}">${badgeText}</span>
                </div>

                <div class="card-price-row">
                    <div>
                        <span class="price-current">₹${c.currentPrice}</span>
                        <span class="price-unit">${c.unit}</span>
                    </div>
                    <div class="price-fair-bounds">
                        Fair Bounds: ₹${c.fairPriceMin} – ₹${c.fairPriceMax}
                    </div>
                </div>

                <div>
                    <span class="card-trend-badge ${trendClass}">${trendText} vs prev mo</span>
                </div>

                <div class="score-box">
                    <div class="score-label-row">
                        <span>Reasonability Index</span>
                        <span class="score-val" style="color: ${statusColor}">${score}%</span>
                    </div>
                    <div class="score-track" role="progressbar" aria-valuenow="${score}" aria-valuemin="0" aria-valuemax="100">
                        <div class="score-progress" style="width: ${score}%; background: ${statusColor}"></div>
                    </div>
                </div>

                <div class="card-actions">
                    <button class="btn btn-secondary btn-sm" onclick="openProductModal('${c.id || c.name}')" aria-label="View details for ${c.name}">
                        🔍 Quick View
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="triggerCompareItem('${c.id || c.name}')" aria-label="Compare ${c.name}">
                        ⚖️ Compare
                    </button>
                </div>
            </article>
        `;
    }).join('');
}

function renderAlertsFeed() {
    const container = document.getElementById("alerts-container");
    if (!container) return;

    if (alerts.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No anomaly alerts currently active.</p></div>`;
        return;
    }

    container.innerHTML = alerts.map((a) => `
        <div class="alert-card severity-${a.severity}">
            <div class="alert-icon" aria-hidden="true">${a.icon}</div>
            <div class="alert-content">
                <div class="alert-title">${a.title}</div>
                <div class="alert-desc">${a.description}</div>
                <div class="alert-meta">
                    <span class="badge badge-${a.severity === 'high' ? 'alert' : a.severity === 'medium' ? 'watch' : 'neutral'}">${a.severity.toUpperCase()} PRIORITY</span>
                    <span>🕒 ${a.time}</span>
                    <span>📡 ${a.source}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// -----------------------------------------------------------------------------
// 5. PRICE COMPARISON TOOL
// -----------------------------------------------------------------------------

function initComparisonSelectors() {
    const select1 = document.getElementById("compare-item-1");
    const select2 = document.getElementById("compare-item-2");
    if (!select1 || !select2) return;

    const val1 = select1.value;
    const val2 = select2.value;

    const optionsHtml = commodities.map((c) => 
        `<option value="${c.id || c.name}">${c.emoji} ${c.name} (₹${c.currentPrice})</option>`
    ).join('');

    select1.innerHTML = optionsHtml;
    select2.innerHTML = optionsHtml;

    if (val1 && commodities.some(c => (c.id || c.name) === val1)) {
        select1.value = val1;
    } else if (commodities.length > 0) {
        select1.value = commodities[0].id || commodities[0].name;
    }

    if (val2 && commodities.some(c => (c.id || c.name) === val2)) {
        select2.value = val2;
    } else if (commodities.length > 2) {
        select2.value = commodities[2].id || commodities[2].name;
    }

    if (!select1.dataset.hasListener) {
        select1.dataset.hasListener = "true";
        select1.addEventListener("change", updateComparison);
        select2.addEventListener("change", updateComparison);
    }

    updateComparison();
}

function triggerCompareItem(id) {
    const select1 = document.getElementById("compare-item-1");
    if (select1) {
        select1.value = id;
        updateComparison();
        const section = document.getElementById("comparison");
        if (section) section.scrollIntoView({ behavior: "smooth" });
    }
}

function updateComparison() {
    const select1 = document.getElementById("compare-item-1");
    const select2 = document.getElementById("compare-item-2");
    const tableBody = document.getElementById("comparison-table-body");
    const head1 = document.getElementById("col-head-1");
    const head2 = document.getElementById("col-head-2");

    if (!select1 || !select2 || !tableBody) return;

    const c1 = commodities.find(c => (c.id || c.name) === select1.value) || commodities[0];
    const c2 = commodities.find(c => (c.id || c.name) === select2.value) || commodities[1];

    if (!c1 || !c2) return;

    if (head1) head1.textContent = `${c1.emoji} ${c1.name}`;
    if (head2) head2.textContent = `${c2.emoji} ${c2.name}`;

    const priceDiff = (c1.currentPrice - c2.currentPrice).toFixed(1);
    const scoreDiff = (c1.reasonabilityScore - c2.reasonabilityScore);
    const scoreDiffText = scoreDiff > 0 ? `${c1.name} +${scoreDiff}% fairer` : scoreDiff < 0 ? `${c2.name} +${Math.abs(scoreDiff)}% fairer` : "Equal reasonability";

    tableBody.innerHTML = `
        <tr>
            <td><strong>Current Price</strong></td>
            <td>₹${c1.currentPrice} ${c1.unit}</td>
            <td>₹${c2.currentPrice} ${c2.unit}</td>
            <td>Difference: ₹${Math.abs(priceDiff)} (${priceDiff > 0 ? c1.name : c2.name} is higher)</td>
        </tr>
        <tr>
            <td><strong>Fair Range Bounds</strong></td>
            <td>₹${c1.fairPriceMin} – ₹${c1.fairPriceMax}</td>
            <td>₹${c2.fairPriceMin} – ₹${c2.fairPriceMax}</td>
            <td>Statistically calculated baseline</td>
        </tr>
        <tr>
            <td><strong>Reasonability Index</strong></td>
            <td><strong style="color: ${c1.status === 'fair' ? 'var(--fair)' : c1.status === 'watch' ? 'var(--watch)' : 'var(--alert)'}">${c1.reasonabilityScore}%</strong> (${c1.status.toUpperCase()})</td>
            <td><strong style="color: ${c2.status === 'fair' ? 'var(--fair)' : c2.status === 'watch' ? 'var(--watch)' : 'var(--alert)'}">${c2.reasonabilityScore}%</strong> (${c2.status.toUpperCase()})</td>
            <td>${scoreDiffText}</td>
        </tr>
        <tr>
            <td><strong>Z-Score (Deviation)</strong></td>
            <td>${c1.zScore}</td>
            <td>${c2.zScore}</td>
            <td>${Math.abs(c1.zScore) > Math.abs(c2.zScore) ? `${c1.name} deviates further` : `${c2.name} deviates further`}</td>
        </tr>
        <tr>
            <td><strong>12-Month Price Trend</strong></td>
            <td>${c1.trend?.direction.toUpperCase()} (${c1.trend?.percent_change}%)</td>
            <td>${c2.trend?.direction.toUpperCase()} (${c2.trend?.percent_change}%)</td>
            <td>Annual price movement rate</td>
        </tr>
        <tr>
            <td><strong>Market Volatility (CV)</strong></td>
            <td>${c1.volatility?.level.toUpperCase()} (${c1.volatility?.index}%)</td>
            <td>${c2.volatility?.level.toUpperCase()} (${c2.volatility?.index}%)</td>
            <td>Degree of price stability</td>
        </tr>
        <tr>
            <td><strong>ML Anomaly Flag</strong></td>
            <td>${c1.isAnomaly ? '🚨 Anomaly Confirmed' : '✅ Normal'}</td>
            <td>${c2.isAnomaly ? '🚨 Anomaly Confirmed' : '✅ Normal'}</td>
            <td>Isolation Forest Model Decision</td>
        </tr>
    `;

    renderComparisonChart(c1, c2);
}

function renderComparisonChart(c1, c2) {
    const canvas = document.getElementById("comparisonChart");
    if (!canvas) return;

    if (comparisonChart) {
        comparisonChart.destroy();
    }

    const ctx = canvas.getContext("2d");

    comparisonChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: monthLabels,
            datasets: [
                {
                    label: `${c1.name} (₹)`,
                    data: c1.history,
                    borderColor: "#00e5a0",
                    backgroundColor: "rgba(0, 229, 160, 0.1)",
                    borderWidth: 2.5,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 4,
                    pointBackgroundColor: "#00e5a0"
                },
                {
                    label: `${c2.name} (₹)`,
                    data: c2.history,
                    borderColor: "#00b4d8",
                    backgroundColor: "rgba(0, 180, 216, 0.1)",
                    borderWidth: 2.5,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 4,
                    pointBackgroundColor: "#00b4d8"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            animation: {
                duration: 250
            },
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: {
                    labels: { color: "#94a3b8", font: { family: "'Inter'" }, usePointStyle: true }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `  ${ctx.dataset.label}: ₹${ctx.raw}`
                    }
                }
            },
            scales: {
                x: { ticks: { color: "#64748b" }, grid: { color: "rgba(255,255,255,0.04)" } },
                y: { ticks: { color: "#64748b", callback: (v) => `₹${v}` }, grid: { color: "rgba(255,255,255,0.04)" } }
            }
        }
    });
}

// -----------------------------------------------------------------------------
// 6. AI PRICE SIMULATOR
// -----------------------------------------------------------------------------

function initSimulator() {
    const select = document.getElementById("sim-commodity");
    const form = document.getElementById("simulator-form");
    if (!select || !form) return;

    select.innerHTML = commodities.map(c => 
        `<option value="${c.id || c.name}">${c.emoji} ${c.name} (Current: ₹${c.currentPrice})</option>`
    ).join('');

    form.addEventListener("submit", handleSimulatePrice);
}

async function handleSimulatePrice(e) {
    if (e) e.preventDefault();

    const select = document.getElementById("sim-commodity");
    const priceInput = document.getElementById("sim-price");
    const resultBox = document.getElementById("simulator-result");

    if (!select || !priceInput || !resultBox) return;

    const commodityId = select.value;
    const testPrice = parseFloat(priceInput.value);

    if (isNaN(testPrice) || testPrice <= 0) {
        showToast("Please enter a valid positive price.", "alert");
        return;
    }

    resultBox.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p>⚡ Running machine learning reasonability analysis on ₹${testPrice}...</p>
        </div>
    `;

    let evalResult = null;

    // Try backend API first
    try {
        const resp = await fetch(`/api/evaluate?id=${encodeURIComponent(commodityId)}&price=${testPrice}`);
        if (resp.ok) {
            evalResult = await resp.json();
        }
    } catch (err) {
        // Fallback to client-side ML calculation
    }

    // Client-side fallback calculation if API was sleeping
    if (!evalResult) {
        const item = commodities.find(c => (c.id || c.name) === commodityId) || commodities[0];
        const h = item.history;
        const mean = h.reduce((a, b) => a + b, 0) / h.length;
        const variance = h.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / h.length;
        const std = Math.sqrt(variance);
        const minFair = Math.max(0, +(mean - std).toFixed(2));
        const maxFair = +(mean + std).toFixed(2);

        let score = 70;
        let diagnosis = "";
        let status = "fair";

        if (testPrice >= minFair && testPrice <= maxFair) {
            const pos = (testPrice - minFair) / (maxFair - minFair);
            score = Math.round(95 - (pos * 10));
            status = "fair";
            diagnosis = `Price ₹${testPrice} falls inside standard statistical equilibrium (₹${minFair} – ₹${maxFair}). Evaluated as fair.`;
        } else if (testPrice < minFair) {
            score = 95;
            status = "fair";
            diagnosis = `Price ₹${testPrice} is below the benchmark minimum (₹${minFair}). High affordability for consumers.`;
        } else {
            const overPct = ((testPrice - maxFair) / maxFair) * 100;
            score = Math.max(0, Math.round(80 - (overPct * 2)));
            status = score < 50 ? "alert" : "watch";
            diagnosis = `Price ₹${testPrice} exceeds the fair ceiling of ₹${maxFair} by ${overPct.toFixed(1)}%. Potential artificial inflation.`;
        }

        const zScore = +((testPrice - mean) / (std || 1)).toFixed(2);

        evalResult = {
            commodity: item.name,
            emoji: item.emoji,
            unit: item.unit,
            evaluatedPrice: testPrice,
            currentBaseline: item.currentPrice,
            fairMin: minFair,
            fairMax: maxFair,
            score: score,
            status: status,
            zScore: zScore,
            isAnomaly: Math.abs(zScore) > 2.0 || score < 40,
            diagnosis: diagnosis
        };
    }

    renderSimulatorResult(evalResult);
}

function renderSimulatorResult(res) {
    const resultBox = document.getElementById("simulator-result");
    if (!resultBox) return;

    const statusColor = res.status === 'fair' ? 'var(--fair)' : res.status === 'watch' ? 'var(--watch)' : 'var(--alert)';

    resultBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
            <div>
                <h4 style="font-size: 18px; font-weight: 700;">${res.emoji || '📦'} ${res.commodity} @ ₹${res.evaluatedPrice}</h4>
                <div style="font-size: 12px; color: var(--text-2);">Current Market Baseline: ₹${res.currentBaseline} ${res.unit || ''}</div>
            </div>
            <span class="badge badge-${res.status}">${res.status.toUpperCase()} DIAGNOSIS</span>
        </div>

        <div class="score-label-row">
            <span>Calculated Reasonability Score</span>
            <span class="score-val" style="color: ${statusColor}; font-size: 18px;">${res.score}%</span>
        </div>
        <div class="score-track" style="margin-bottom: 20px;">
            <div class="score-progress" style="width: ${res.score}%; background: ${statusColor}"></div>
        </div>

        <div class="eval-card-grid">
            <div class="eval-kpi">
                <div class="kpi-label">Estimated Fair Range</div>
                <div class="kpi-val">₹${res.fairMin} – ₹${res.fairMax}</div>
            </div>
            <div class="eval-kpi">
                <div class="kpi-label">Statistical Z-Score</div>
                <div class="kpi-val" style="color: ${Math.abs(res.zScore) > 2 ? 'var(--alert)' : 'var(--text-1)'}">${res.zScore}</div>
            </div>
            <div class="eval-kpi">
                <div class="kpi-label">Anomaly Detected?</div>
                <div class="kpi-val" style="color: ${res.isAnomaly ? 'var(--alert)' : 'var(--fair)'}">
                    ${res.isAnomaly ? '🚨 YES' : '✅ NO'}
                </div>
            </div>
        </div>

        <div class="eval-diagnosis ${res.status}">
            <strong>AI Assessment:</strong> ${res.diagnosis}
        </div>
    `;
}

// -----------------------------------------------------------------------------
// 7. HISTORICAL TREND CHART
// -----------------------------------------------------------------------------

function initChartDropdown() {
    const select = document.getElementById("commodity-select");
    if (!select) return;

    const prevIndex = select.value || 0;
    select.innerHTML = commodities.map((c, i) => 
        `<option value="${i}">${c.emoji} ${c.name} (Current: ₹${c.currentPrice})</option>`
    ).join('');

    select.value = prevIndex < commodities.length ? prevIndex : 0;

    if (!select.dataset.hasListener) {
        select.dataset.hasListener = "true";
        select.addEventListener("change", () => updateTrendChart(select.value));
    }
    updateTrendChart(select.value);
}

function updateTrendChart(index) {
    const c = commodities[index];
    const canvas = document.getElementById("priceChart");
    if (!canvas || !c) return;

    if (priceChart) {
        priceChart.destroy();
    }

    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 350);
    gradient.addColorStop(0, "rgba(0, 229, 160, 0.25)");
    gradient.addColorStop(1, "rgba(0, 229, 160, 0.0)");

    priceChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: monthLabels,
            datasets: [
                {
                    label: `${c.name} Market Price (₹)`,
                    data: c.history,
                    borderColor: "#00e5a0",
                    backgroundColor: gradient,
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 5,
                    pointBackgroundColor: "#00e5a0",
                    pointBorderColor: "#060612",
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                },
                {
                    label: `Fair Ceiling (₹${c.fairPriceMax})`,
                    data: new Array(12).fill(c.fairPriceMax),
                    borderColor: "rgba(74, 222, 128, 0.6)",
                    borderWidth: 1.5,
                    borderDash: [6, 4],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: `Fair Floor (₹${c.fairPriceMin})`,
                    data: new Array(12).fill(c.fairPriceMin),
                    borderColor: "rgba(74, 222, 128, 0.6)",
                    borderWidth: 1.5,
                    borderDash: [6, 4],
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            animation: {
                duration: 250
            },
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: {
                    labels: { color: "#94a3b8", font: { family: "'Inter'" }, usePointStyle: true, padding: 18 }
                },
                tooltip: {
                    backgroundColor: "rgba(12, 12, 36, 0.95)",
                    titleColor: "#f8fafc",
                    bodyColor: "#94a3b8",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                        label: (ctx) => `  ${ctx.dataset.label}: ₹${ctx.raw}`
                    }
                }
            },
            scales: {
                x: { ticks: { color: "#64748b" }, grid: { color: "rgba(255,255,255,0.04)" } },
                y: { ticks: { color: "#64748b", callback: (v) => `₹${v}` }, grid: { color: "rgba(255,255,255,0.04)" } }
            }
        }
    });
}

// -----------------------------------------------------------------------------
// 8. WATCHLIST & PRICE-DROP ALERTS
// -----------------------------------------------------------------------------

function initWatchlistForm() {
    const select = document.getElementById("alert-commodity");
    const form = document.getElementById("add-alert-form");
    const simDropBtn = document.getElementById("simulate-drop-btn");

    if (select) {
        select.innerHTML = commodities.map(c => 
            `<option value="${c.id || c.name}">${c.emoji} ${c.name} (Current: ₹${c.currentPrice})</option>`
        ).join('');
    }

    if (form) {
        form.addEventListener("submit", handleAddAlert);
    }

    if (simDropBtn) {
        simDropBtn.addEventListener("click", handleSimulateDropEvent);
    }

    renderWatchlist();
}

function handleAddAlert(e) {
    e.preventDefault();
    const select = document.getElementById("alert-commodity");
    const typeSelect = document.getElementById("alert-type");
    const priceInput = document.getElementById("alert-price");

    if (!select || !typeSelect || !priceInput) return;

    const targetPrice = parseFloat(priceInput.value);
    if (isNaN(targetPrice) || targetPrice <= 0) {
        showToast("Please enter a valid target price.", "alert");
        return;
    }

    const item = commodities.find(c => (c.id || c.name) === select.value) || commodities[0];

    const newAlert = {
        id: "alert_" + Date.now(),
        commodityId: item.id || item.name,
        name: item.name,
        emoji: item.emoji,
        targetPrice: targetPrice,
        type: typeSelect.value,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        triggered: false
    };

    watchlist.unshift(newAlert);
    saveWatchlist();
    renderWatchlist();
    priceInput.value = "";
    showToast(`Price alert activated for ${item.name} at ₹${targetPrice}!`);
}

function removeWatchlistItem(id) {
    watchlist = watchlist.filter(item => item.id !== id);
    saveWatchlist();
    renderWatchlist();
    showToast("Alert subscription removed.");
}

function renderWatchlist() {
    const container = document.getElementById("watchlist-items-list");
    const countEl = document.getElementById("watchlist-count");
    if (!container) return;

    if (countEl) {
        countEl.textContent = `${watchlist.length} item${watchlist.length === 1 ? '' : 's'}`;
    }

    if (watchlist.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 30px; color: var(--text-3);">
                <p>No active price alerts set. Use the form to track commodity price drops.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = watchlist.map(w => {
        const currentItem = commodities.find(c => (c.id || c.name) === w.commodityId);
        const currPrice = currentItem ? currentItem.currentPrice : 0;
        const isTriggered = w.triggered || (w.type === "below" && currPrice <= w.targetPrice) || (w.type === "above" && currPrice >= w.targetPrice);

        return `
            <div class="watchlist-item">
                <div class="watchlist-item-info">
                    <div class="watchlist-item-title">${w.emoji || '📦'} ${w.name}</div>
                    <div class="watchlist-item-condition">
                        Condition: ${w.type === 'below' ? 'Drop below' : 'Rise above'} <strong>₹${w.targetPrice}</strong> &bull; Current: <strong>₹${currPrice}</strong>
                    </div>
                </div>
                <div class="watchlist-item-actions">
                    <span class="badge ${isTriggered ? 'badge-alert' : 'badge-fair'}">
                        ${isTriggered ? '⚡ TRIGGERED' : 'ACTIVE'}
                    </span>
                    <button class="btn-remove-item" onclick="removeWatchlistItem('${w.id}')" title="Delete alert" aria-label="Remove alert">
                        ✕
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function handleSimulateDropEvent() {
    // Simulate temporary price drop on Onion and Tomato to demonstrate trigger
    const onion = commodities.find(c => c.id === "onion" || c.name === "Onion");
    if (onion) {
        onion.currentPrice = 42; // Drops from 72 to 42
    }
    const tomato = commodities.find(c => c.id === "tomato" || c.name === "Tomato");
    if (tomato) {
        tomato.currentPrice = 30; // Drops from 48 to 30
    }

    renderCommodityGrid();
    renderStatsOverview();
    renderWatchlist();

    showToast("🎉 Market Event: Onion dropped to ₹42 & Tomato dropped to ₹30! Watchlist alerts triggered.", "alert");
}

// -----------------------------------------------------------------------------
// 9. PRODUCT DETAILS MODAL
// -----------------------------------------------------------------------------

function openProductModal(id) {
    const modal = document.getElementById("product-modal-overlay");
    const body = document.getElementById("modal-body");
    if (!modal || !body) return;

    const c = commodities.find(item => (item.id || item.name) === id);
    if (!c) return;

    const statusColor = c.status === 'fair' ? 'var(--fair)' : c.status === 'watch' ? 'var(--watch)' : 'var(--alert)';
    const maxHist = Math.max(...c.history);
    const minHist = Math.min(...c.history);

    body.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
            <span style="font-size: 40px; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 14px;">${c.emoji}</span>
            <div>
                <h3 id="modal-product-name" style="font-size: 24px; font-weight: 800;">${c.name}</h3>
                <span class="badge badge-${c.status}">${c.status.toUpperCase()} REASONABILITY</span>
                <span style="font-size: 12px; color: var(--text-2); margin-left: 8px;">Source: ${c.source || 'eNAM Mandi API'}</span>
            </div>
        </div>

        <div class="eval-card-grid" style="margin-bottom: 24px;">
            <div class="eval-kpi">
                <div class="kpi-label">Current Price</div>
                <div class="kpi-val">₹${c.currentPrice} <span style="font-size: 13px; color: var(--text-3); font-weight: normal;">${c.unit}</span></div>
            </div>
            <div class="eval-kpi">
                <div class="kpi-label">Stat Fair Range</div>
                <div class="kpi-val">₹${c.fairPriceMin} – ₹${c.fairPriceMax}</div>
            </div>
            <div class="eval-kpi">
                <div class="kpi-label">Reasonability Score</div>
                <div class="kpi-val" style="color: ${statusColor}">${c.reasonabilityScore}%</div>
            </div>
            <div class="eval-kpi">
                <div class="kpi-label">12-Month High / Low</div>
                <div class="kpi-val">₹${maxHist} / ₹${minHist}</div>
            </div>
        </div>

        <div style="margin-bottom: 20px;">
            <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 10px;">12-Month Historical Price Trajectory (INR ₹)</h4>
            <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 8px;">
                ${c.history.map((h, i) => `
                    <div style="flex: 1; min-width: 44px; text-align: center; background: rgba(255,255,255,0.03); border: 1px solid var(--border-card); border-radius: 6px; padding: 8px 4px;">
                        <div style="font-size: 10px; color: var(--text-3);">${monthLabels[i]}</div>
                        <div style="font-size: 13px; font-weight: 700; margin-top: 4px; font-family: var(--font-mono);">₹${h}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="eval-diagnosis ${c.status}" style="margin-bottom: 24px;">
            <strong>Diagnostics:</strong> ${c.isAnomaly ? 'Isolation Forest confirms abnormal distribution.' : 'Normal seasonal distribution.'}
            Z-Score is ${c.zScore}. 12-month linear regression trend is ${c.trend?.direction.toUpperCase()} (${c.trend?.percent_change}%). Volatility rating is ${c.volatility?.level.toUpperCase()} (${c.volatility?.index}%).
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button class="btn btn-secondary" onclick="closeProductModal()">Close</button>
            <button class="btn btn-primary" onclick="triggerCompareItem('${c.id || c.name}'); closeProductModal();">Compare Side-by-Side</button>
        </div>
    `;

    modal.classList.remove("hidden");
}

function closeProductModal() {
    const modal = document.getElementById("product-modal-overlay");
    if (modal) modal.classList.add("hidden");
}

// -----------------------------------------------------------------------------
// 10. TOAST NOTIFICATIONS
// -----------------------------------------------------------------------------

function showToast(message, type = "normal") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type === "alert" ? "toast-alert" : ""}`;
    toast.innerHTML = `<span>🔔</span><span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// -----------------------------------------------------------------------------
// 11. INITIALIZATION & EVENT LISTENERS
// -----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
    loadWatchlist();

    // 1. Initial Render with local benchmark dataset
    renderStatsOverview();
    renderCommodityGrid();
    renderAlertsFeed();
    initComparisonSelectors();
    initSimulator();
    initChartDropdown();
    initWatchlistForm();

    // 2. Sync with Backend API
    const connected = await syncWithAPI();
    if (connected) {
        renderStatsOverview();
        renderCommodityGrid();
        renderAlertsFeed();
        initComparisonSelectors();
        initChartDropdown();
    }

    // 3. Search & Filter Handlers
    const searchInput = document.getElementById("commodity-search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentSearch = e.target.value;
            renderCommodityGrid();
        });
    }

    const sortSelect = document.getElementById("commodity-sort");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            currentSort = e.target.value;
            renderCommodityGrid();
        });
    }

    const filterPills = document.querySelectorAll(".filter-pill");
    filterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            filterPills.forEach(p => {
                p.classList.remove("active");
                p.setAttribute("aria-selected", "false");
            });
            pill.classList.add("active");
            pill.setAttribute("aria-selected", "true");
            currentCategory = pill.getAttribute("data-category");
            renderCommodityGrid();
        });
    });

    const resetBtn = document.getElementById("reset-filters-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            currentSearch = "";
            currentCategory = "all";
            currentSort = "default";
            if (searchInput) searchInput.value = "";
            if (sortSelect) sortSelect.value = "default";
            filterPills.forEach(p => p.classList.toggle("active", p.getAttribute("data-category") === "all"));
            renderCommodityGrid();
        });
    }

    // 4. Mobile Menu Toggle
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const navLinks = document.getElementById("nav-links");
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            mobileBtn.setAttribute("aria-expanded", isOpen);
        });

        // Close menu on link click
        navLinks.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                mobileBtn.setAttribute("aria-expanded", "false");
            });
        });
    }

    // 5. Modal Close Listeners
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalOverlay = document.getElementById("product-modal-overlay");

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeProductModal);
    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) closeProductModal();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeProductModal();
    });

    console.log("✅ PriceGuard AI Client successfully initialized!");
});
