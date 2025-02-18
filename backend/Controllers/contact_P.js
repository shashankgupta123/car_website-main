import Contact from "../Models/contact_p.js";

export const ContactPage = async (req, res) => {
    try {
      const { name, email, message } = req.body;
      const newContact = new Contact({ name, email, message });
      await newContact.save();
      res.status(201).json({ message: "Message saved successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };