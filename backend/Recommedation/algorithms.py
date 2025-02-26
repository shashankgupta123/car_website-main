from flask import Flask, request, jsonify
from pymongo import MongoClient, DESCENDING
from bson import ObjectId

MONGO_URI = "mongodb+srv://shashank:shashank123@sem6-project.lfg2l.mongodb.net/SEM_6?retryWrites=true&w=majority&appName=Sem6-Project"
client = MongoClient(MONGO_URI)
db = client['SEM_6']
cars_collection = db['cars'] 
purchases_collection = db['purchases']
users_collection = db['users']  

def recommend_by_visit_count(user):
    carvisited_data = user.get("carvisited", [])
    if not carvisited_data:
        return []
    carvisited_sorted = sorted(carvisited_data, key=lambda car: car.get("visitCount", 0), reverse=True)
    max_visit_count = carvisited_sorted[0].get("visitCount", 0)
    most_visited_cars = []
    for car in carvisited_sorted:
        if car.get("visitCount", 0) == max_visit_count:
            first_color = car.get("colors", [])[0] if car.get("colors") else {}
            first_image = first_color.get("images", [])[0] if first_color.get("images") else None
            locations_list = [loc.get("placeName", "Unknown") for loc in car.get("locations", [])]
            most_visited_cars.append({
                "name": car.get("name"),
                "variant": car.get("variant"),
                "description": car.get("description"),
                "visitCount": car.get("visitCount"),
                "price": first_color.get("price", "N/A"),  
                "image": first_image,  
                "locations": locations_list,
                "id": str(car.get("_id"))
            })
    return most_visited_cars

def recommend_by_similarity(user):
    carvisited_data = user.get("carvisited", [])
    if not carvisited_data:
        return []

    # Find the most visited car
    base_car = max(carvisited_data, key=lambda car: car.get("visitCount", 0))
    base_car_id = base_car.get("_id")
    base_variant = base_car.get("variant", "")
    base_locations = set(base_car.get("locations", []))  

    # Fetch cars with the same variant (excluding the visited car)
    similar_cars = cars_collection.find({
        "_id": {"$ne": base_car_id},
        "variant": base_variant  # Ensuring cars have the same variant
    })

    similar_car_list = []

    for car in similar_cars:
        # Get first color and image
        first_color = car.get("colors", [])[0] if car.get("colors") else {}
        first_image = first_color.get("images", [])[0] if first_color.get("images") else None

        # Extract locations and calculate overlap
        car_locations = set([loc.get("placeName", "Unknown") for loc in car.get("locations", [])])
        location_match = len(base_locations & car_locations)  # Common locations count

        # Similarity score (weighted on variant match + location match)
        similarity_score = 80.0 + (location_match * 5)  # Base 80%, add 5% per matching location

        similar_car_list.append({
            "name": car.get("name"),
            "variant": car.get("variant"),
            "description": car.get("description"),
            "similarityScore": min(similarity_score, 100),  # Capped at 100%
            "price": first_color.get("price", "N/A"),
            "image": first_image,
            "locations": list(car_locations),
            "id": str(car.get("_id"))
        })

    # Sort by highest similarity score and limit to top 3 results
    similar_car_list.sort(key=lambda x: x["similarityScore"], reverse=True)
    return similar_car_list[:3]

def recommend_new_trends():
    try:
        email = request.args.get('email')
        print(f"User email received: {email}")

        # ✅ Get top 3 most purchased cars
        top_purchased_cars = list(purchases_collection.aggregate([
            {"$group": {"_id": "$carName", "purchaseCount": {"$sum": 1}}},
            {"$sort": {"purchaseCount": DESCENDING}},
            {"$limit": 3}
        ]))
        top_purchased_names = [car["_id"] for car in top_purchased_cars]

        # ✅ Get top 3 most favorited cars
        top_favorited_cars = list(users_collection.aggregate([
            {"$unwind": "$favorites"},
            {"$group": {"_id": "$favorites", "favoriteCount": {"$sum": 1}}},
            {"$sort": {"favoriteCount": DESCENDING}},
            {"$limit": 3}
        ]))
        top_favorited_names = [car["_id"] for car in top_favorited_cars]

        # ✅ Combine results (avoid duplicates)
        combined_names = list(set(top_purchased_names + top_favorited_names))[:3]

        if not combined_names:
            print("⚠️ No trending cars found!")
            return {"new_trends": []}

        # ✅ Fetch car details
        trending_cars = cars_collection.find({"name": {"$in": combined_names}})
        new_trend_list = []
        for car in trending_cars:
            first_color = car.get("colors", [])[0] if car.get("colors") else {}
            first_image = first_color.get("images", [])[0] if first_color.get("images") else None
            locations_list = [loc.get("placeName", "Unknown") for loc in car.get("locations", [])]

            new_trend_list.append({
                "name": car.get("name"),
                "model_no": car.get("model_no"),
                "price": first_color.get("price", "N/A"),
                "description": car.get("description", "No description available"),
                "image": first_image,
                "locations": locations_list,
                "id": str(car.get("_id"))  
            })

        return {"new_trends": new_trend_list}

    except Exception as e:
        print("❌ Error:", e)
        return {"message": f"An error occurred: {str(e)}"}
    
def recommend_by_last_two_searches(user):
    search_history = user.get("searchhistory", [])
    
    if len(search_history) < 3:
        return []
    last_two_searches = list(dict.fromkeys(search_history[-3:]))  
    
    search_results = []
    for search in last_two_searches:
        car = cars_collection.find_one({"name": {"$regex": search, "$options": "i"}})
        if car:
            first_color = car.get("colors", [])[0] if car.get("colors") else {}
            first_image = first_color.get("images", [])[0] if first_color.get("images") else None
            locations_list = [loc.get("placeName", "Unknown") for loc in car.get("locations", [])]

            search_results.append({
                "name": car.get("name"),
                "model_no": car.get("model_no"),
                "offers": car.get("offers", []),
                "price": first_color.get("price", "N/A"),
                "description": car.get("description", "No description available"),
                "image": first_image,
                "locations": locations_list,
                "id": str(car.get("_id")),
            })
    return search_results

def recommend_by_favourites(user):
    favourite_cars = user.get("favourites", [])

    if not favourite_cars:
        return []

    fav_car_list = []
    for car in favourite_cars:

        first_color = car.get("colors", [{}])[0] if car.get("colors") else {}
        first_image = first_color.get("images", [None])[0]

        fav_car_list.append({
            "id": str(car.get("_id")),
            "name": car.get("name"),
            "model_no": car.get("model_no"),
            "offers": car.get("offers", ""),
            "price": first_color.get("price", "N/A"),
            "description": car.get("description", "No description available"),
            "image": first_image,
        })

    print(f"Debug: Favourite car list -> {fav_car_list}")
    return fav_car_list
