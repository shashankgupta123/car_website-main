import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true 
    },
    carName: { 
        type: String, 
        required: true 
    },
    pickupLocation: { 
        type: String, 
        required: true 
    },
    dropoffLocation: { 
        type: String, 
        required: true 
    },
    pickupDate: { 
        type: Date, 
        required: true 
    },
    dropoffDate: { 
        type: Date, 
        required: true 
    },
    fullName: { 
        type: String, 
        required: true 
    },
    phoneNumber: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    driversLicense: { 
        type: String, 
        required: true 
    },
    licenseExpiry: { 
        type: Date, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    securityDeposit: { 
        type: Number, 
        required: true 
    },
    balance: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        default: 'current' 
    },
    stripeSessionId: { 
        type: String, 
        required: true 
    },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;
