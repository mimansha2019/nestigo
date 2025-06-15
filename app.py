from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import stripe
import smtplib
from email.message import EmailMessage
import urllib.parse
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()  # loads from .env file

app = Flask(__name__)
CORS(app)

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
RAPIDAPI_HOST = os.getenv("RAPIDAPI_HOST")

@app.route("/search", methods=["POST"])
def search_hotels():
    try:
        data = request.get_json()
        city = data.get("destination-input", "london")  # Default fallback
        checkin = data.get("checkin_date", "2025-06-15")
        checkout = data.get("checkout_date", "2025-06-18")

        url = "https://airbnb19.p.rapidapi.com/api/v1/searchPropertyByLocationV2"
        headers = {
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": RAPIDAPI_HOST
        }
        params = {
            "location": city,
            "checkin": checkin,
            "checkout": checkout,
            "adults": "1",
            "totalRecords": "18",
            "currency": "USD",
            "page": "1"
        }

        response = requests.get(url, headers=headers, params=params)
        data = response.json()

        if "data" in data and "list" in data["data"]:
            return jsonify(data["data"]["list"])
        else:
            print("⚠️ No results found in API response:", data)
            return jsonify([])

    except Exception as e:
        print("❌ Server error occurred:", str(e))
        return jsonify({"error": str(e)}), 500
    
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@app.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    data = request.json
    hotel = data.get("hotelName")
    price = float(data.get("amount"))
    email = data.get("userEmail")

    try:
        encoded_email = urllib.parse.quote(email)
        encoded_hotel = urllib.parse.quote(hotel)
        # Stripe expects amount in cents
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': hotel},
                    'unit_amount': int(price * 100),
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url = f"http://localhost:5000/success?email={encoded_email}&hotel={encoded_hotel}",
            cancel_url="http://localhost:5000/cancel"
            )
        return jsonify({'checkout_url': session.url})
    except Exception as e:
        return jsonify(error=str(e)), 500

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

@app.route("/success")
def payment_success():
    email = request.args.get("email")
    hotel = request.args.get("hotel")

    # Send confirmation email
    try:
        msg = EmailMessage()
        msg['Subject'] = 'Hotel Booking Confirmation'
        msg['From'] = EMAIL_USER
        msg['To'] = email
        msg.set_content(f"Thank you for booking {hotel} with us. Your payment was successful!")

        # Use SMTP
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_USER, EMAIL_PASS)
            smtp.send_message(msg)

        return "Payment successful and confirmation sent!"
    except Exception as e:
        return f"Payment done, but email failed: {e}"


# Replace with your actual URI
uri = os.getenv("MONGODB_URI")

client = MongoClient(uri)
db = client["nestigo2025"]
users_collection = db["users"]

@app.route('/')
def home():
    return "Nestigo Flask Backend is running ✅"

@app.route("/save-user", methods=["POST"])
def save_user():
    data = request.get_json()
    print("📩 Received data:", data)

    if not data or not data.get("name") or not data.get("email"):
        return jsonify({"error": "Missing name or email"}), 400

    existing = users_collection.find_one({"email": data["email"]})
    if existing:
        return jsonify({"message": "User already exists"}), 200

    users_collection.insert_one({
        "name": data["name"],
        "email": data["email"]
    })

    return jsonify({"message": "User saved successfully ✅"}), 201

@app.route('/users', methods=['GET'])
def get_users():
    users = list(users_collection.find({}, {"_id": 0}))
    return jsonify(users)

@app.route('/test-db', methods=['GET'])
def test_db():
    try:
        users_collection.insert_one({"test": "connected"})
        return jsonify({"message": "✅ MongoDB connection is working"})
    except Exception as e:
        return jsonify({"error": str(e)})
    
bookings_collection = db["bookings"]
@app.route("/save-booking", methods=["POST"])
def save_booking():
    data = request.get_json()

    required = ["email", "hotel", "destination", "checkin", "checkout"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing booking fields"}), 400

    data["timestamp"] = datetime.utcnow()
    bookings_collection.insert_one(data)
    return jsonify({"message": "Booking saved ✅"}), 201

@app.route("/get-bookings", methods=["GET"])
def get_bookings():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Email required"}), 400

    user_bookings = list(bookings_collection.find({"email": email}, {"_id": 0}))
    return jsonify(user_bookings), 200


if __name__ == "__main__":
    app.run(debug=True)
