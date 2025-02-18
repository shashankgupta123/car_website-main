import express from "express";
import {createCheckoutSession, 
    generateReceipt,
    getAllPurchases,
    updatePurchaseStatus,
    payBalanceAndGenerateReceipt,
    getPurchaseDetails,
    // getPurchaseById,
} from "../Controllers/purchase-Controller.js"

const router = express.Router();
router.post("/checkout", createCheckoutSession);
router.get("/receipt/:sessionId",generateReceipt);

router.get('/purchases',getAllPurchases);
router.put('/update-status/:purchaseId',updatePurchaseStatus)
router.get('/allpurchases/:email', getPurchaseDetails); 
router.post('/payBalance/:purchaseId', payBalanceAndGenerateReceipt); 
// router.get('/purchase/:id',getPurchaseById);

export default router;