import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // محاكاة إرسال النموذج
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  return (
    <div>
      <Navbar />
      <div className="contact-page">
        <section className="page-header">
          <h1>Contact Us</h1>
          <p className="subtitle">We're here to help. Get in touch with our team for any inquiries.</p>
        </section>

        <div className="content-container">
          <div className="contact-layout">
            <section className="contact-info">
              <h2>Get in Touch</h2>
              <p className="info-description">Have questions? We'd love to hear from you.</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <h3>Email</h3>
                  <p>support@irshad.com</p>
                  <p>info@irshad.com</p>
                </div>
                
                <div className="contact-item">
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                  <p>+1 (555) 987-6543</p>
                </div>
                
                <div className="contact-item">
                  <h3>Office</h3>
                  <p>123 Tech Street, Suite 500</p>
                  <p>San Francisco, CA 94107</p>
                </div>
                
                <div className="contact-item">
                  <h3>Business Hours</h3>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </section>

            <section className="contact-form-section">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    rows="6"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </section>
          </div>

          <section className="location-section">
            <h2>Our Location</h2>
            <div className="location-info">
              <p><strong>Address:</strong> 123 Tech Street, Suite 500, San Francisco, CA 94107</p>
              <p><strong>Public Transport:</strong> Near Montgomery Station</p>
              <p><strong>Parking:</strong> Available in building</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ContactPage;