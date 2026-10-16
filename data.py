# Mock commodity dataset for AIML-08 hackathon demo
# Historical monthly price data (INR) gathered from AGMARKNET & eNAM benchmarks

COMMODITIES = [
    {
        "id": "rice_basmati",
        "name": "Rice (Basmati)",
        "emoji": "🍚",
        "unit": "per kg",
        "category": "Grains",
        "history": [42, 44, 43, 45, 48, 47, 50, 52, 49, 53, 52, 58],
        "source": "eNAM"
    },
    {
        "id": "wheat",
        "name": "Wheat",
        "emoji": "🌾",
        "unit": "per kg",
        "category": "Grains",
        "history": [26, 27, 28, 27, 29, 30, 28, 31, 30, 32, 31, 32],
        "source": "eNAM"
    },
    {
        "id": "onion",
        "name": "Onion",
        "emoji": "🧅",
        "unit": "per kg",
        "category": "Vegetables",
        "history": [30, 28, 35, 32, 40, 38, 42, 45, 55, 60, 65, 72],
        "source": "AGMARKNET"
    },
    {
        "id": "tomato",
        "name": "Tomato",
        "emoji": "🍅",
        "unit": "per kg",
        "category": "Vegetables",
        "history": [25, 30, 45, 80, 65, 40, 35, 30, 28, 35, 55, 48],
        "source": "AGMARKNET"
    },
    {
        "id": "potato",
        "name": "Potato",
        "emoji": "🥔",
        "unit": "per kg",
        "category": "Vegetables",
        "history": [22, 24, 23, 25, 26, 24, 28, 27, 26, 25, 27, 28],
        "source": "AGMARKNET"
    },
    {
        "id": "milk",
        "name": "Milk",
        "emoji": "🥛",
        "unit": "per litre",
        "category": "Dairy",
        "history": [50, 50, 52, 52, 54, 54, 55, 56, 56, 58, 60, 62],
        "source": "NDDB"
    },
    {
        "id": "sugar",
        "name": "Sugar",
        "emoji": "🍬",
        "unit": "per kg",
        "category": "Essentials",
        "history": [40, 41, 42, 40, 43, 42, 44, 43, 44, 44, 45, 45],
        "source": "ISMA"
    },
    {
        "id": "cooking_oil",
        "name": "Cooking Oil",
        "emoji": "🫒",
        "unit": "per litre",
        "category": "Essentials",
        "history": [115, 120, 125, 130, 128, 135, 140, 142, 148, 150, 155, 165],
        "source": "SEA"
    }
]

MONTHS = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
