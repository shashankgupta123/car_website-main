import express from "express";
import {createCheckoutSession, 
    generateReceipt,
    getAllPurchases,
    updatePurchaseStatus,
    createCheckoutSessionBalance,
    getPurchaseDetails,
    generateReceiptBalance,
    // getPurchaseById,
} from "../Controllers/purchase-Controller.js"

const router = express.Router();
router.post("/checkout", createCheckoutSession);
router.get("/receipt/:sessionId",generateReceipt);
router.get("/receipt1/:sessionId",generateReceiptBalance);

router.get('/purchases',getAllPurchases);
router.put('/update-status/:purchaseId',updatePurchaseStatus)
router.get('/allpurchases/:email', getPurchaseDetails); 
router.post('/payBalance/',createCheckoutSessionBalance ); 
// router.get('/purchase/:id',getPurchaseById);

export default router;