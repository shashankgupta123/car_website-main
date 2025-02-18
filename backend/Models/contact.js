import mongoose from "mongoose";
const ContactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique:true,
  },
  name: {
    type: String,
    required: true,
  },
  messages: [{
    name: String,
    message: String,
    date: { type: Date, default: Date.now }
  }]
  });

const Contact = mongoose.model("Contact", ContactSchema);

export default Contact;
