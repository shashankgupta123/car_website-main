import Contact from "../Models/contact.js";

export const saveContactForm = async (req, res) => {
  const { email, name, message } = req.body;
  console.log('Received data:', req.body);

  if (!email || !name || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    let contact = await Contact.findOne({ email: email });

    if (!contact) {
      contact = new Contact({ email, name, messages: [] });
    }

    if (contact.messages.length >= 5) {
      return res.status(400).json({ error: 'You have reached the maximum submission limit of 5.' });
    }

    contact.messages.push({ name, message });

    const updatedContact = await contact.save();
    console.log('Contact updated:', updatedContact);

    res.status(201).json({ message: 'Form submitted and data saved successfully', data: updatedContact });
  } catch (error) {
    console.error('Error saving contact form data:', error);
    res.status(500).json({ error: 'Failed to save contact form data', details: error.message });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const contacts = await Contact.find().populate('messages.name').exec();

    if (!contacts) {
      return res.status(404).json({ error: 'No contact data found' });
    }

    res.status(200).json({ messages: contacts });
  } catch (error) {
    console.error('Error fetching contact data:', error);
    res.status(500).json({ error: 'Failed to fetch contact data', details: error.message });
  }
};