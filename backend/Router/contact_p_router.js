import express from "express";
import { ContactPage } from "../Controllers/contact_P.js";

const router = express.Router();

router.post("/contact", ContactPage);

export default router;
