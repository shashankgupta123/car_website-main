from pymongo import MongoClient

MONGO_URI = "mongodb+srv://shashank:shashank123@sem6-project.lfg2l.mongodb.net/SEM_6?retryWrites=true&w=majority&appName=Sem6-Project"
client = MongoClient(MONGO_URI)
db = client['SEM_6']
cars_collection = db['cars']  

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
            most_visited_cars.append({
                "name": car.get("name"),
                "variant": car.get("variant"),
                "description": car.get("description"),
                "visitCount": car.get("visitCount"),
                "price": first_color.get("price", "N/A"),  
                "image": first_image,  
                "id": str(car.get("_id"))
            })
    return most_visited_cars

def recommend_by_similarity(user):
    carvisited_data = user.get("carvisited", [])
    if not carvisited_data:
        return []
    base_car = max(carvisited_data, key=lambda car: car.get("visitCount", 0))
    base_car_id = base_car.get("_id")
    similar_cars = cars_collection.find({"_id": {"$ne": base_car_id}}).limit(3)  
    similar_car_list = []
    
    for car in similar_cars:
        first_color = car.get("colors", [])[0] if car.get("colors") else {}
        first_image = first_color.get("images", [])[0] if first_color.get("images") else None
        
        similar_car_list.append({
            "name": car.get("name"),
            "variant": car.get("variant"),
            "description": car.get("description"),
            "similarityScore": 85.0,  
            "price": first_color.get("price", "N/A"),
            "image": first_image,  
            "id": str(car.get("_id"))
        })
    return similar_car_list

def recommend_new_trends(user):
    new_cars = cars_collection.find().sort("date", -1).limit(3)  
    new_trend_list = []
    for car in new_cars:
        first_color = car.get("colors", [])[0] if car.get("colors") else {}
        first_image = first_color.get("images", [])[0] if first_color.get("images") else None

        new_trend_list.append({
            "name": car.get("name"),
            "model_no": car.get("model_no"),
            "offers": car.get("offers"),
            "price": first_color.get("price", "N/A"),  
            "image": first_image, 
            "id": str(car.get("_id")),
        })
    return new_trend_list

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

            search_results.append({
                "name": car.get("name"),
                "model_no": car.get("model_no"),
                "offers": car.get("offers", []),
                "price": first_color.get("price", "N/A"),
                "description": car.get("description", "No description available"),
                "image": first_image,
                "id": str(car.get("_id")),
            })
    return search_results


def recommend_by_favourites(user):
    favourite_cars = user.get("favourites", [])
    print(f"Debug: User's favourite cars: {favourite_cars}")  
    
    if not favourite_cars:
        return []
    fav_car_list = []
    for car in favourite_cars:
        first_color = car.get("colors", [])[0] if car.get("colors") else {}
        first_image = first_color.get("images", [])[0] if first_color.get("images") else None

        fav_car_list.append({
            "name": car.get("name"),
            "model_no": car.get("model_no"),
            "offers": car.get("offers", []),
            "price": first_color.get("price", "N/A"),
            "description": car.get("description", "No description available"),
            "image": first_image,
            "id": str(car.get("_id")),  
        })

    print(f"Debug: Favourite car list: {fav_car_list}") 
    return fav_car_list
