import { useState } from "react";
import PageHeader from "../components/PageHeader";
import "../styles/pages.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="Questions about the system? Get in touch with the development team"
      />

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="info-item">
                <div>
                  <h3>Email</h3>
                  <p>support@patientcare.ke</p>
                  <p style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    For system questions and feedback
                  </p>
                </div>
              </div>
              <div className="info-item">
                <div>
                  <h3>Phone</h3>
                  <p>+254 700 123 456</p>
                  <p style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    Available during working hours
                  </p>
                </div>
              </div>
              <div className="info-item">
                <div>
                  <h3>Location</h3>
                  <p>Nairobi, Kenya</p>
                  <p style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    Academic project – Group Work CAT 2
                  </p>
                </div>
              </div>
              <div className="info-item">
                <div>
                  <h3>Response Time</h3>
                  <p>Mon – Fri: 8:00 AM – 5:00 PM</p>
                  <p style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    We aim to reply within 1–2 working days
                  </p>
                </div>
              </div>

              <div className="card" style={{ marginTop: "1.5rem" }}>
                <h3 style={{ color: "var(--primary)", marginBottom: "0.6rem" }}>
                  What can you contact us about?
                </h3>
                <ul className="check-list">
                  <li>How to use the Patient Management System</li>
                  <li>Feedback on features or usability</li>
                  <li>Questions about the database design</li>
                  <li>Suggestions for future improvements</li>
                </ul>
              </div>
            </div>

            <div className="contact-form-card">
              <h2>Send a Message</h2>

              {submitted && (
                <div className="alert alert-success">
                  Thank you! Your message has been received. We will get back to
                  you soon.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                  {errors.name && <div className="error">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                  {errors.email && <div className="error">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="e.g. Question about patient registration"
                  />
                  {errors.subject && (
                    <div className="error">{errors.subject}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Write your message or question here..."
                  />
                  {errors.message && (
                    <div className="error">{errors.message}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
