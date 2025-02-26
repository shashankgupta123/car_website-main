import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import connectDb from './utils/db.js'


import userRouter from "./Router/user-router.js"
import carRouter from "./Router/car-router.js"
import contactRouter from "./Router/contact-router.js"
import purchaseRouter from "./Router/purchaseRouter.js"
import contactP from "./Router/contact_p_router.js"
import graphRouter from "./Router/graph-router.js"
import reviewRouter from "./Router/review-router.js";

import bodyParser from "body-parser";

import { processCommand } from './services/voice-assistance.js'

dotenv.config();

const app = express();
const corsOption = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credential: true,
};
app.use(cors(corsOption));
app.use(express.json());

app.use(bodyParser.json());

app.use("/api/users",userRouter);
app.use("/api",carRouter);
app.use("/api",contactRouter);
app.use("/api",purchaseRouter);
app.use("/api",contactP);
app.use("/api/purchase",graphRouter);
app.use("/api/reviews",reviewRouter);

const PORT = 5000;
connectDb().then(()=> {
    app.listen(PORT, ()=> {
        console.log(`Server is running on port ${PORT}`);
    })
})

app.post("/process-command", async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { command, username } = req.body;

    if (!command) {
      throw new Error("Command is missing from the request body.");
    }

    console.log("Command received:", command);
    console.log("Username received:", username);

    const result = await processCommand({ command, username }); // Ensure async handling
    console.log("Response Data:", result); // Log response before sending

    res.json(result); // Send response correctly
  } catch (error) {
    console.error("Error in /process-command:", error.message);
    res.status(500).json({ message: error.message });
  }
});


app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({ message: "Something went wrong!" });
});
