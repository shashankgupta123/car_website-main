import stripeModule from 'stripe';
import Purchase from '../Models/purchase.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import { log } from 'console';

const stripe = stripeModule('sk_test_51PrMfS2MTbYGhQ4qhCdsIfs3Y0OsE50lQzu2plVcNf874DRZmzFKh8D8AuFxIvOVSM5twxfs2IsfqNc4W7dEbYLU00yk3NAIBS');

export const createCheckoutSession = async (req, res) => {
    const { userDetails, amount } = req.body;

    console.log('Received data:', { userDetails, amount });

    if (!userDetails || !userDetails.fullName || !userDetails.email || !userDetails.phoneNumber || 
        !userDetails.pickupLocation || !userDetails.dropoffLocation || !userDetails.pickupDate || 
        !userDetails.dropoffDate || !userDetails.driversLicense || !userDetails.licenseExpiry || 
        !amount || !userDetails.carName) {  
        return res.status(400).send({ error: "Missing required fields" });
    }

    const price = Number(amount);
    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: "Invalid amount provided" });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: userDetails.carName || 'Unknown Car',  
                            description: userDetails.description || 'No description provided',
                        },
                        unit_amount: price * 100, 
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: 'http://localhost:5173/cancel',
            customer_email: userDetails.email,
            metadata: {
                userId: userDetails.userId,
                pickupDate: userDetails.pickupDate,
                dropoffDate: userDetails.dropoffDate,
                pickupLocation: userDetails.pickupLocation,
                dropoffLocation: userDetails.dropoffLocation,
                securityDeposit: userDetails.securityDeposit.toString(), 
                balance: userDetails.balance.toString(),
            }
        });

        console.log('Stripe Session Created:', session);

        const purchase = new Purchase({
            userId: userDetails.userId,
            carName: userDetails.carName,  
            pickupLocation: userDetails.pickupLocation,
            dropoffLocation: userDetails.dropoffLocation,
            pickupDate: new Date(userDetails.pickupDate),
            dropoffDate: new Date(userDetails.dropoffDate),
            fullName: userDetails.fullName,
            phoneNumber: userDetails.phoneNumber,
            email: userDetails.email,
            driversLicense: userDetails.driversLicense,
            licenseExpiry: new Date(userDetails.licenseExpiry),
            price: price,
            securityDeposit: userDetails.securityDeposit,
            balance: userDetails.balance,
            status: 'current',
            stripeSessionId: session.id,
        });

        await purchase.save();

        res.status(201).json({ url: session.url, sessionId: session.id });
    } catch (err) {
        console.error('Error creating Stripe session:', err);
        res.status(500).json({ message: 'Payment creation failed', error: err.message });
    }
};

export const generateReceipt = async (req, res) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is missing' });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items'],
        });

        console.log('Retrieved Session Metadata:', session.metadata);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

        const productName = session.line_items?.data[0]?.description || 'Unknown Product';

        const pickupDate = session.metadata?.pickupDate || 'Not Available';
        const dropoffDate = session.metadata?.dropoffDate || 'Not Available';
        const pickupLocation = session.metadata?.pickupLocation || 'Not Provided';
        const dropoffLocation = session.metadata?.dropoffLocation || 'Not Provided';
        
        const securityDeposit = parseFloat(session.metadata?.securityDeposit || 0).toLocaleString('en-IN');
        const balance = parseFloat(session.metadata?.balance || 0).toLocaleString('en-IN');
        const totalAmount = (parseFloat(session.metadata?.securityDeposit || 0) + parseFloat(session.metadata?.balance || 0)).toLocaleString('en-IN');

        const paidAmount = securityDeposit;  
        const dueAmount = '0';  

        const doc = new PDFDocument({ size: 'A4' });
        const filePath = `receipts/receipt-${sessionId}.pdf`;

        if (!fs.existsSync('receipts')) {
            fs.mkdirSync('receipts');
        }

        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        doc.fontSize(60)
            .fillColor('lightgray')
            .text('RECEIPT', 200, 250, { opacity: 0.2 });

        doc.rect(0, 0, doc.page.width, doc.page.height)
            .fill('#f7f7f7'); 

        doc.font('Helvetica-Bold')
            .fontSize(22)
            .fillColor('black')  
            .text('Wheels On Deals', { align: 'center' });
        doc.font('Helvetica-Oblique')
            .fontSize(16)
            .fillColor('black') 
            .text('Your trusted partner for car rentals', { align: 'center' });
        doc.moveDown(1);

        doc.font('Times-Roman')
            .fontSize(18)
            .fillColor('black')  
            .text('Payment Receipt', { align: 'center' });
        doc.moveDown(1);

        doc.fontSize(12)
            .font('Helvetica')
            .fillColor('black'); 

        doc.text('Car Details:', { underline: true });
        doc.moveDown(0.5);

        doc.text(`Car: ${productName}`);
        doc.text(`Pickup Date: ${pickupDate}`);
        doc.text(`Dropoff Date: ${dropoffDate}`);
        doc.text(`Pickup Location: ${pickupLocation}`);
        doc.text(`Dropoff Location: ${dropoffLocation}`);
        doc.moveDown(1);

        doc.text('Amount Breakdown:', { underline: true });
        doc.moveDown(0.5);

        doc.text('Description', { continued: true, width: 200 });
        doc.text('Amount', { align: 'right' });
        doc.moveDown(0.5);

        doc.text('Total Amount', { continued: true, width: 200 });
        doc.text(`Rs. ${totalAmount}`, { align: 'right' });

        doc.text('Security Deposit', { continued: true, width: 200 });
        doc.text(`Rs. ${securityDeposit}`, { align: 'right' });

        doc.text('Balance', { continued: true, width: 200 });
        doc.fillColor('red').text(`Rs. ${balance}`, { align: 'right' });

        doc.moveDown(1);

        doc.text('Payment Details:', { underline: true });
        doc.moveDown(0.5);

        doc.text('Paid Amount', { continued: true, width: 200 });
        doc.fillColor('green').text(`Rs. ${paidAmount}`, { align: 'right' });

        if (parseFloat(dueAmount) > 0) {
            doc.moveDown(0.5);
            doc.text('Due Amount', { continued: true, width: 200 });
            doc.fillColor('red').text(`Rs. ${dueAmount}`, { align: 'right' });
        }

        doc.moveDown(1);

        doc.font('Helvetica-Bold')
            .fontSize(12)
            .fillColor('red')
            .text('** This receipt is mandatory at the time of returning. **', { align: 'center' });

        doc.end();

        writeStream.on('finish', () => {
            res.status(200).download(filePath, 'receipt.pdf', () => {
                fs.unlinkSync(filePath);  
            });
        });

    } catch (err) {
        console.error('Error generating receipt:', err);
        res.status(500).json({ message: 'Error generating receipt', error: err.message });
    }
};

export const getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find();
        
        res.json(purchases);
    } catch (error) {
        console.error('Error fetching purchases:', error);
        res.status(500).json({ message: 'Error fetching purchases', error: error.message });
    }
};


export const updatePurchaseStatus = async (req, res) => {
    console.log("Updating purchase status for:", purchaseId);
    try {
        const { purchaseId } = req.params;
        const { status, securityDeposit, balance } = req.body;

        const updatedPurchase = await Purchase.findByIdAndUpdate(
            purchaseId,
            { status, securityDeposit, balance },
            { new: true, runValidators: true }
        );

        if (!updatedPurchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }

        res.status(200).json(updatedPurchase);
    } catch (error) {
        console.error('Error updating purchase:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPurchaseDetails  = async (req, res) => {
    const { email } = req.params; 
    console.log(`Fetching all purchase details for email: ${email}`); 

    try {
        
        const purchases = await Purchase.find({ email });

        if (purchases.length === 0) {
            console.log(`No purchases found for email: ${email}`); 
            return res.status(404).json({ message: 'No purchases found for this email' });
        }

        console.log(`Found ${purchases.length} purchase(s) for email: ${email}`); 
        res.json(purchases);
    } catch (error) {
        console.error('Error fetching purchase details:', error); 
        res.status(500).json({ message: 'Error fetching purchase details', error: error.message });
    }
};

export const createCheckoutSessionBalance = async (req, res) => {
    const { userDetails, amount } = req.body;

    console.log('Received data:', { userDetails, amount });

    if (!userDetails || !userDetails.fullName || !userDetails.email || !userDetails.phoneNumber || 
        !userDetails.pickupLocation || !userDetails.dropoffLocation || !userDetails.pickupDate || 
        !userDetails.dropoffDate || !userDetails.driversLicense || !userDetails.licenseExpiry || 
        !amount || !userDetails.carName) {  
        return res.status(400).send({ error: "Missing required fields" });
    }

    const price = Number(amount);
    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: "Invalid amount provided" });
    }

    // Calculate total balance (security deposit + balance)
    const securityDeposit = Number(userDetails.securityDeposit) || 0;
    const balance = Number(userDetails.balance) || 0;
    const totalBalance = securityDeposit + balance;

    try {
        // **Check if the purchase already exists to prevent duplicate entries**
        let existingPurchase = await Purchase.findOne({
            userId: userDetails.userId,
            carName: userDetails.carName,
            pickupDate: new Date(userDetails.pickupDate),
            dropoffDate: new Date(userDetails.dropoffDate),
        });

        // **Create Stripe session**
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: userDetails.carName || 'Unknown Car',  
                            description: userDetails.description || 'No description provided',
                        },
                        unit_amount: price * 100, 
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:5173/success1?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: 'http://localhost:5173/cancel',
            customer_email: userDetails.email,
            metadata: {
                userId: userDetails.userId,
                pickupDate: userDetails.pickupDate,
                dropoffDate: userDetails.dropoffDate,
                pickupLocation: userDetails.pickupLocation,
                dropoffLocation: userDetails.dropoffLocation,
                securityDeposit: securityDeposit.toString(),  
                balance: balance.toString(),
                totalBalance: totalBalance.toString(),  // Store total balance in metadata
            }
        });

        console.log('Stripe Session Created:', session);

        if (existingPurchase) {
            // **If a purchase exists, update it instead of inserting a new one**
            existingPurchase.price = price;
            existingPurchase.securityDeposit = 0;
            existingPurchase.balance = 0;
            existingPurchase.totalBalance = totalBalance;
            existingPurchase.status = 'past';
            existingPurchase.stripeSessionId = session.id;

            await existingPurchase.save();
            console.log('Updated existing purchase:', existingPurchase);
        } else {
            // **If no existing record, create a new purchase**
            const purchase = new Purchase({
                userId: userDetails.userId,
                carName: userDetails.carName,  
                pickupLocation: userDetails.pickupLocation,
                dropoffLocation: userDetails.dropoffLocation,
                pickupDate: new Date(userDetails.pickupDate),
                dropoffDate: new Date(userDetails.dropoffDate),
                fullName: userDetails.fullName,
                phoneNumber: userDetails.phoneNumber,
                email: userDetails.email,
                driversLicense: userDetails.driversLicense,
                licenseExpiry: new Date(userDetails.licenseExpiry),
                price: price,
                securityDeposit: securityDeposit,
                balance: balance,
                totalBalance: totalBalance,  // Save total balance in the database
                status: 'current',
                stripeSessionId: session.id,
            });

            await purchase.save();
            console.log('New purchase created:', purchase);
        }

        res.status(201).json({ url: session.url, sessionId: session.id });
    } catch (err) {
        console.error('Error creating Stripe session:', err);
        res.status(500).json({ message: 'Payment creation failed', error: err.message });
    }
};


export const generateReceiptBalance = async (req, res) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is missing' });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items'],
        });

        console.log('Retrieved Session Metadata:', session.metadata);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

        const productName = session.line_items?.data[0]?.description || 'Unknown Product';

        const pickupDate = session.metadata?.pickupDate || 'Not Available';
        const dropoffDate = session.metadata?.dropoffDate || 'Not Available';
        const pickupLocation = session.metadata?.pickupLocation || 'Not Provided';
        const dropoffLocation = session.metadata?.dropoffLocation || 'Not Provided';
        
        const securityDeposit = '0'; 
        const balance = '0'; 
        const totalAmount = parseFloat(session.amount_total / 100).toLocaleString('en-IN'); 
        const paidAmount = totalAmount; 
        const dueAmount = '0'; 
  

        const doc = new PDFDocument({ size: 'A4' });
        const filePath = `receipts/receipt-${sessionId}.pdf`;

        if (!fs.existsSync('receipts')) {
            fs.mkdirSync('receipts');
        }

        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        doc.fontSize(60)
            .fillColor('lightgray')
            .text('RECEIPT', 200, 250, { opacity: 0.2 });

        doc.rect(0, 0, doc.page.width, doc.page.height)
            .fill('#f7f7f7'); 

        doc.font('Helvetica-Bold')
            .fontSize(22)
            .fillColor('black')  
            .text('Wheels On Deals', { align: 'center' });
        doc.font('Helvetica-Oblique')
            .fontSize(16)
            .fillColor('black') 
            .text('Your trusted partner for car rentals', { align: 'center' });
        doc.moveDown(1);

        doc.font('Times-Roman')
            .fontSize(18)
            .fillColor('black')  
            .text('Payment Receipt', { align: 'center' });
        doc.moveDown(1);

        doc.fontSize(12)
            .font('Helvetica')
            .fillColor('black'); 

        doc.text('Car Details:', { underline: true });
        doc.moveDown(0.5);

        doc.text(`Car: ${productName}`);
        doc.text(`Pickup Date: ${pickupDate}`);
        doc.text(`Dropoff Date: ${dropoffDate}`);
        doc.text(`Pickup Location: ${pickupLocation}`);
        doc.text(`Dropoff Location: ${dropoffLocation}`);
        doc.moveDown(1);

        doc.text('Amount Breakdown:', { underline: true });
        doc.moveDown(0.5);

        doc.text('Description', { continued: true, width: 200 });
        doc.text('Amount', { align: 'right' });
        doc.moveDown(0.5);

        doc.text('Total Amount', { continued: true, width: 200 });
        doc.text(`Rs. ${totalAmount}`, { align: 'right' });

        doc.text('Security Deposit', { continued: true, width: 200 });
        doc.text(`Rs. ${securityDeposit}`, { align: 'right' });

        doc.text('Balance', { continued: true, width: 200 });
        doc.fillColor('red').text(`Rs. ${balance}`, { align: 'right' });

        doc.moveDown(1);

        doc.text('Payment Details:', { underline: true });
        doc.moveDown(0.5);

        doc.text('Paid Amount', { continued: true, width: 200 });
        doc.fillColor('green').text(`Rs. ${paidAmount}`, { align: 'right' });

        if (parseFloat(dueAmount) > 0) {
            doc.moveDown(0.5);
            doc.text('Due Amount', { continued: true, width: 200 });
            doc.fillColor('red').text(`Rs. ${dueAmount}`, { align: 'right' });
        }

        doc.moveDown(1);

        doc.font('Helvetica-Bold')
            .fontSize(12)
            .fillColor('red')
            .text('** This receipt is mandatory at the time of returning. **', { align: 'center' });

        doc.end();

        writeStream.on('finish', () => {
            res.status(200).download(filePath, 'receipt.pdf', () => {
                fs.unlinkSync(filePath);  
            });
        });

    } catch (err) {
        console.error('Error generating receipt:', err);
        res.status(500).json({ message: 'Error generating receipt', error: err.message });
    }
};









