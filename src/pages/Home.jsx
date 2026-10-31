import { Link } from "react-router-dom";
import "../styles/pages.css";

function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Patient Management System</h1>
          <p>
            Streamline patient registration, medical records and data retrieval
            with a simple, reliable digital platform built for hospitals and
            clinics.
          </p>
          <div className="hero-buttons">
            <Link to="/patients" className="btn btn-primary">
              Go to Dashboard
            </Link>
            <Link to="/about" className="btn btn-outline">
              About the System
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>What You Can Do</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Register Patients</h3>
              <p>
                Add new patients with full details including name, gender, date
                of birth, phone, address and medical condition.
              </p>
            </div>
            <div className="feature-card">
              <h3>Search Records</h3>
              <p>
                Quickly find any patient by name, patient number, phone number
                or medical condition using the built-in search.
              </p>
            </div>
            <div className="feature-card">
              <h3>Edit Information</h3>
              <p>
                Update patient details at any time. Changes are saved
                immediately and reflected in the records table.
              </p>
            </div>
            <div className="feature-card">
              <h3>Delete Records</h3>
              <p>
                Remove outdated or incorrect patient records with a confirmation
                step to prevent accidental deletion.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-info">
        <div className="container">
          <div className="home-info-grid">
            <div className="card">
              <h2>Why Digital Patient Records?</h2>
              <p>
                Paper-based records are slow, easy to lose and difficult to
                search. A digital Patient Management System helps hospitals and
                clinics keep accurate, organised and easily accessible patient
                information.
              </p>
              <ul className="check-list">
                <li>Faster registration and retrieval of patient data</li>
                <li>Reduced risk of lost or damaged files</li>
                <li>Better organisation of medical information</li>
                <li>Easy updates when patient details change</li>
              </ul>
            </div>
            <div className="card">
              <h2>Who Is This For?</h2>
              <p>
                This system is designed for use by staff in healthcare
                facilities who handle patient information on a daily basis.
              </p>
              <ul className="check-list">
                <li>Hospital receptionists and front-desk staff</li>
                <li>Nurses and clinical officers</li>
                <li>Doctors and medical practitioners</li>
                <li>Medical records departments</li>
                <li>Clinic administrators</li>
              </ul>
              <Link
                to="/patients"
                className="btn btn-primary"
                style={{ marginTop: "1.2rem" }}
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
