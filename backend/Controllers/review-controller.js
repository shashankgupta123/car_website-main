import Car from "../Models/car.js"; // Import Car model
import CarReview from "../Models/review.js"; // Import CarReview model

export const AddReview = async (req, res) => {
  try {
      console.log("AddReview endpoint running");

      const { carId, userId, username, rating, reviewText } = req.body;

      // Log the received data for debugging
      console.log('Received data:', { carId, userId, username, rating, reviewText });

      // Check if the car exists using carId
      const car = await Car.findById(carId);
      if (!car) {
          console.error(`Car with ID ${carId} not found`);
          return res.status(404).json({ message: "Car not found" });
      }

      // Create a new review object
      const newReview = new CarReview({
          carId,  // Store carId
          userId,
          username,
          rating,
          reviewText,
      });

      // Save the new review to the database
      const savedReview = await newReview.save();
      console.log('Review saved successfully:', savedReview);

      // Return success response with the saved review object
      res.status(201).json({ message: 'Review added successfully!', review: savedReview });
  } catch (err) {
      console.error('Error adding review:', err);  // Log the error for debugging
      res.status(500).json({ message: 'Error adding review', error: err.message });
  }
};


export const getCarReviews = async (req, res) => {
  try {
      const { carName } = req.params;
      console.log("Requested car model:", carName); // Log for debugging

      // 🔹 Find the car by name (case-insensitive search)
      const car = await Car.findOne({ name: { $regex: new RegExp("^" + carName + "$", "i") } });

      if (!car) {
          console.log("Car not found in database."); // Debug log
          return res.status(404).json({ message: "Car not found" });
      }

      console.log("Car found:", car); // Log car details

      // 🔹 Fetch all reviews using carId
      const reviews = await CarReview.find({ carId: car._id });

      res.status(200).json(reviews);
  } catch (err) {
      console.error("Error fetching reviews:", err);
      res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCarReviews = async (req, res) => {
    try {
      console.log("Fetching all car reviews...");
  
      // Populate only the `name` from `Car` and return other review details as they are
      const reviews = await CarReview.find()
        .populate({ path: "carId", select: "name" }) // Fetch only `name` from Car
        .select("-__v"); // Exclude __v field from review results
  
      if (!reviews || reviews.length === 0) {
        return res.status(404).json({ message: "No car reviews found" });
      }
  
      // Debugging: Log fetched reviews
      console.log("Fetched Car Reviews:", reviews);
  
      const formattedReviews = reviews.map((review) => ({
        _id: review._id,
        carName: review.carId?.name || "Unknown Car", // Replace 'title' with 'name'
        username: review.username,
        rating: review.rating,
        reviewText: review.reviewText,
        createdAt: review.createdAt,
      }));
  
      res.status(200).json(formattedReviews);
    } catch (err) {
      console.error("Error fetching car reviews:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Delete a car review
  export const deleteCarReview = async (req, res) => {
    try {
      const { reviewId } = req.params;
      console.log(`Deleting car review with ID: ${reviewId}`);
  
      const deletedReview = await CarReview.findByIdAndDelete(reviewId);
  
      if (!deletedReview) {
        return res.status(404).json({ message: "Car review not found" });
      }
  
      res.status(200).json({ message: "Car review deleted successfully!" });
    } catch (err) {
      console.error("Error deleting car review:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };