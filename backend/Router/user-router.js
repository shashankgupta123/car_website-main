import express from "express";
import {register,
    login,
    getAllUsers,
    logout,
    getCurrentUser,
    updatedUser,
    updatePassword,
    searchData,
    recordCarVisit,
    addFavourite,
    adminlogout,
    resetPassword,
} from "../Controllers/user-controller.js";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/reset-password",resetPassword);

// Admin Routes (Protected)
router.get("/", getAllUsers);
router.post("/logout",logout);
router.post("/adminlogout",adminlogout);

// Private Routes
router.get("/profile", getCurrentUser);
router.put("/update",updatedUser);
router.put("/password/:id", updatePassword);
router.post("/store-search",searchData);

router.post("/record-visit",recordCarVisit);

router.post("/add-favourite",addFavourite);

export default router;
