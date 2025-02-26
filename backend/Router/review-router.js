import express from "express";
import { AddReview, getCarReviews, getAllCarReviews,  deleteCarReview} from "../Controllers/review-controller.js";

const router = express.Router();

// Route to add a review for a car
router.post("/add-review", AddReview);

// Route to get reviews of a car by car name
router.get("/:carName", getCarReviews);

router.get("/admin/all", getAllCarReviews);

// Delete a car review
router.delete("/admin/:reviewId", deleteCarReview);
export default router;
