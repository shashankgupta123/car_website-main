import express from "express";
import { getWeeklyIncome, getTotalIncome, getCarsLentByWeek,getCarsByStatus } from "../Controllers/graph.js";

const router = express.Router();

// Route for fetching weekly income
router.get("/weekly-income", getWeeklyIncome);

// Route for fetching total income
router.get("/total-income", getTotalIncome);
router.get('/cars-lent-by-week',getCarsLentByWeek);
router.get('/car-status',getCarsByStatus);

export default router;
