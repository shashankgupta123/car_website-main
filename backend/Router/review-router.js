import express from "express";
import { AddReview, getCarReviews } from "../Controllers/review-controller.js";

const router = express.Router();

// Route to add a review for a car
router.post("/add-review", AddReview);

// Route to get reviews of a car by car name
router.get("/:carName", getCarReviews);

export default router;
