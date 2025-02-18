import express from "express";
import {
    createCar,
    getCars,
    getCarByName,
    updateCar,
    deleteCar,
    filterCarsByPrice,
    checkPriceFieldExists,
    filterCarsByVariant,
    filterCarsByColor,
    filterCarsCombined,
    LocationgetCars
} from "../Controllers/car-controller.js";
import { validateCar } from "../middleware/car-validation.js";

const router = express.Router();

router.post("/cars/add",validateCar, createCar);
router.get("/cars", getCars);
router.get('/locationbooks', LocationgetCars);

router.get("/cars/:name", getCarByName);
router.put("/cars/:name", updateCar); 

router.delete("/cars/:name", deleteCar);
router.get("/PriceFilter", filterCarsByPrice);

router.get("/check",checkPriceFieldExists);

router.get("/VariantFilter",filterCarsByVariant);
router.get("/ColorFilter",filterCarsByColor);
router.get("/CombinedFilter",filterCarsCombined);

export default router;
