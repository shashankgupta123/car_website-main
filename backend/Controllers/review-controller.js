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

