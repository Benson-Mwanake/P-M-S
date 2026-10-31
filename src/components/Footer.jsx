import { Link } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div>
          <h4>PatientCare System</h4>
          <p>
            A modern digital platform for managing patient records, appointments
            and medical information efficiently and securely.
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/patients">Dashboard</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p>Email: support@patientcare.ke</p>
          <p>Phone: +254 700 123 456</p>
          <p>Nairobi, Kenya</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          &copy; {new Date().getFullYear()} PatientCare System. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
