import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  });

const ContactP = mongoose.model("Contact_P", contactSchema);

export default ContactP;