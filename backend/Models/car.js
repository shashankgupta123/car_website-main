import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    quantity: { type: Number, required: true }, // Number of books available at this location
    placeName: { type: String, required: true }
});

const carSchema = new mongoose.Schema({
    name: { type: String, required: true ,unique:true},
    variant: { type: String, required: true },
    colors: [{
        color: { type: String, required: true },
        price: { type: Number, required: true },  
        images: [{ type: String, required: true }]
    }],
    offers: { type: String },
    model_no: { type: String, required: true, unique: true },
    description: { type: String },
    date: { type: Date, required: true },
    year: { type: Number, required: true },
    mileage: { type: String },
    locations: [locationSchema],
});

const Car = mongoose.model("Car", carSchema);

export default Car;
