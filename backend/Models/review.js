import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  carId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Car',  // Reference the Car model
    required: true 
  },
  userId: { 
    type: String, 
    required: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  reviewText: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const CarReview = mongoose.model('CarReview', ReviewSchema);

export default CarReview;
