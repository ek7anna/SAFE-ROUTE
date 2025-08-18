import os
from flask import Flask, render_template, jsonify
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

# Public config (only safe keys go here)
@app.route('/public-config')
def public_config():
    return {
        "TOMTOM_API_KEY": os.getenv("TOMTOM_API_KEY")
    }

# Example proxy: Weather API (unsafe keys stay on backend)
@app.route('/weather/<lat>/<lon>')
def get_weather(lat, lon):
    api_key = os.getenv("R_API_KEY")
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}"
    r = requests.get(url)
    return jsonify(r.json())

if __name__ == '__main__':
    app.run(debug=True)
