import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';
import './ContactPage.css';

function ContactPage() {
  const { t } = useTranslation();
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
    alert(t('Thank you for your message! We will get back to you soon.'));
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
          <h1>{t("Contact Us")}</h1>
          <p className="subtitle">{t("We're here to help. Get in touch with our team for any inquiries.")}</p>
        </section>

        <div className="content-container">
          <div className="contact-layout">
            <section className="contact-info">
              <h2>{t("Get in Touch")}</h2>
              <p className="info-description">{t("Have questions? We'd love to hear from you.")}</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <h3>{t("Email")}</h3>
                  <p>support@irshad.com</p>
                  <p>info@irshad.com</p>
                </div>
                
                <div className="contact-item">
                  <h3>{t("Phone")}</h3>
                  <p>+1 (555) 123-4567</p>
                  <p>+1 (555) 987-6543</p>
                </div>
                
                <div className="contact-item">
                  <h3>{t("Office")}</h3>
                  <p>123 Tech Street, Suite 500</p>
                  <p>San Francisco, CA 94107</p>
                </div>
                
                <div className="contact-item">
                  <h3>{t("Business Hours")}</h3>
                  <p>{t("Monday - Friday: 9:00 AM - 6:00 PM")}</p>
                  <p>{t("Saturday: 10:00 AM - 2:00 PM")}</p>
                </div>
              </div>
            </section>

            <section className="contact-form-section">
              <h2>{t("Send us a Message")}</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">{t("Full Name")} *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("Enter your name")}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">{t("Email Address")} *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("Enter your email")}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">{t("Subject")} *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t("What is this regarding?")}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">{t("Message")} *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("Tell us how we can help you...")}
                    rows="6"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('Sending...') : t('Send Message')}
                </button>
              </form>
            </section>
          </div>

          <section className="location-section">
            <h2>{t("Our Location")}</h2>
            <div className="location-info">
              <p><strong>{t("Address")}:</strong> ركن الدين</p>
              {/* <p><strong>{t("Public Transport")}:</strong> {t("Near Montgomery Station")}</p> */}
              {/* <p><strong>{t("Parking")}:</strong> {t("Available in building")}</p> */}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ContactPage;