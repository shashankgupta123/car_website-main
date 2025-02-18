import express from "express";
import {saveContactForm,getContactMessages } from '../Controllers/contact-controller.js'

const router = express.Router();
router.post('/save-contact', saveContactForm);
router.get('/message',getContactMessages)
export default router;