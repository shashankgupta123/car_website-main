from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from algorithms import recommend_by_visit_count, recommend_by_similarity, recommend_new_trends, recommend_by_last_two_searches, recommend_by_favourites

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

MONGO_URI = "mongodb+srv://shashank:shashank123@sem6-project.lfg2l.mongodb.net/SEM_6?retryWrites=true&w=majority&appName=Sem6-Project"
client = MongoClient(MONGO_URI)
db = client['SEM_6']  
users_collection = db['users']  
cars_collection = db['cars']
print("hello")
def convert_objectid_to_str(data):
    if isinstance(data, dict):
        return {key: convert_objectid_to_str(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_objectid_to_str(item) for item in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

#most visited cars
@app.route('/api/recommendations/most_visited', methods=['GET'])
def get_most_visited():
    try:
        email = request.args.get('email')

        if not email:
            return jsonify({"message": "Email is required!"}), 400
        user = users_collection.find_one({"email": email.strip()})
        if not user:
            return jsonify({"message": "User not found!"}), 404
        most_visited_cars = recommend_by_visit_count(user)
        return jsonify({
            "message": "Most visited cars generated successfully!",
            "recommendations": most_visited_cars
        }), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

#Similar_car
@app.route('/api/recommendations/similar_cars', methods=['GET'])
def get_similar_cars():
    try:
        email = request.args.get('email')

        if not email:
            return jsonify({"message": "Email is required!"}), 400
        user = users_collection.find_one({"email": email.strip()})
        if not user:
            return jsonify({"message": "User not found!"}), 404
        similar_cars = recommend_by_similarity(user)
        return jsonify({
            "message": "Similar cars generated successfully!",
            "recommendations": similar_cars
        }), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

#new trends
@app.route('/api/recommendations/new_trends', methods=['GET'])
def get_new_trends():
    try:
        email = request.args.get('email')

        if not email:
            return jsonify({"message": "Email is required!"}), 400

        user = users_collection.find_one({"email": email.strip()})
        if not user:
            return jsonify({"message": "User not found!"}), 404

        new_trends = recommend_new_trends()

        print("🟢 New Trends Data:", new_trends) 

        return jsonify({
            "message": "New trends generated successfully!",
            "recommendations": new_trends.get("new_trends", [])
        }), 200

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

#last two searches
@app.route('/api/recommendations/last_two_searches', methods=['GET'])
def get_last_two_searches():
    try:
        email = request.args.get('email')

        if not email:
            return jsonify({"message": "Email is required!"}), 400
        user = users_collection.find_one({"email": email.strip()})
        if not user:
            return jsonify({"message": "User not found!"}), 404
        last_two_searches = recommend_by_last_two_searches(user)
        return jsonify({
            "message": "Last searches recommendations generated successfully!",
            "recommendations": last_two_searches
        }), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# favourite cars
@app.route('/api/recommendations/favourites', methods=['GET'])
def get_favourite_cars():
    try:
        email = request.args.get('email')

        if not email:
            return jsonify({"message": "Email is required!"}), 400
        user = users_collection.find_one({"email": email.strip()})
        if not user:
            return jsonify({"message": "User not found!"}), 404
        favourite_cars = recommend_by_favourites(user)
        return jsonify({
            "message": "Favourite cars recommendations generated successfully!",
            "recommendations": favourite_cars
        }), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    print("Flask is starting")
    app.run(debug=True, port=5001)
