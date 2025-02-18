import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import '../../CSS/Contact_Us.css'

const Contact_Us = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    reply: ''
  });
  const [submitError, setSubmitError] = useState('');
  const [submitCount, setSubmitCount] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/message");
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        setMessages(data.messages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleReply = (contact) => {
    setFormData({
      name: contact.name,
      email: contact.email,
      message: contact.messages[0].message,
      reply: ''
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (submitCount >= 5) {
      setSubmitError("You have reached the maximum number of submissions.");
      return;
    }
  
    try {
      const { reply, ...formDataWithoutReply } = formData;
  
      const response = await fetch("http://localhost:5000/api/save-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithoutReply),
      });
  
      if (response.ok) {
        setSubmitCount(submitCount + 1);
        alert("Form submitted successfully!");
        setShowForm(false);
        setSubmitError(""); 
  
        const emailResponse = await sendEmail(formData);
        if (emailResponse) {
          console.log('Email sent successfully');
        } else {
          console.log('Error sending email');
        }
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  

  const sendEmail = async (formData) => {
    const emailTemplateParams = {
      from_name: 'Admin',            
    from_email: 'admin@example.com', 
    to_name: formData.name,          
    to_email: formData.email,        
    message: formData.message,       
    reply: formData.reply,           
    store_name: 'Wheels On Deals',   
    reply_to: 'admin@example.com'    
    };
    console.log("Sending email to:", emailTemplateParams.to_email);
    console.log("Email content:", emailTemplateParams);

    try {
      const result = await emailjs.send(
        'service_yk53sjg', 
        'template_obrc4ba',
        emailTemplateParams,
        '9Hpu8LqB30mogNUKL'
      );
      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      return null;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="contact-us-page">
      <h2>Contact Messages</h2>
      {messages.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Reply</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((contact, index) => (
              <tr key={index}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>
                  <ul>
                    {contact.messages.map((msg, idx) => (
                      <li key={idx}>
                        <strong>{msg.name}:</strong> {msg.message}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button onClick={() => handleReply(contact)}>Reply</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No messages found.</p>
      )}

      {showForm && (
        <div>
          <h3>Reply to {formData.name}</h3>
          <form onSubmit={handleFormSubmit}>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </label>
            <br />
            <label>
              Reply:
              <textarea
                name="reply"
                value={formData.reply}
                onChange={handleInputChange}
                required
              />
            </label>
            <br />
            <button type="submit">Send Reply</button>
          </form>
          {submitError && <div style={{ color: "red" }}>{submitError}</div>}
        </div>
      )}
    </div>
  );
};

export default Contact_Us;
