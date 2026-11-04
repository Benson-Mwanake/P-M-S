import PageHeader from "../components/PageHeader";
import "../styles/pages.css";

const team = [
  {
    name: "Benson",
    role: "Frontend Developer",
    description:
      "Designed and built the React user interface, forms, tables and overall user experience.",
  },
  {
    name: "Joel Emmanuel",
    role: "Backend / Database",
    description:
      "Responsible for database design, schema, ER diagram and data operations.",
  },
  {
    name: "Team Member 3",
    role: "System Design & Documentation",
    description:
      "Handled system requirements, documentation, testing and project coordination.",
  },
];

function About() {
  return (
    <>
      <PageHeader
        title="About PatientCare"
        subtitle="A digital solution for managing patient records in healthcare facilities"
      />

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-section card">
              <h2>Our Mission</h2>
              <p>
                PatientCare aims to simplify how hospitals and clinics manage
                patient information. Healthcare staff should spend less time on
                paperwork and more time caring for patients.
              </p>
              <p>
                This system provides a clean, reliable platform for registering
                patients, storing key medical details, searching records quickly
                and keeping information up to date.
              </p>
            </div>

            <div className="about-section card">
              <h2>Project Purpose</h2>
              <p>
                This Patient Management System was developed as a Group Work CAT
                2 academic project. It demonstrates the full process of:
              </p>
              <ul>
                <li>Designing a database schema and ER diagram</li>
                <li>Building a frontend for data entry and retrieval</li>
                <li>Implementing Add, View, Edit and Delete operations</li>
                <li>
                  Creating a usable web interface for real-world scenarios
                </li>
              </ul>
            </div>

            <div className="about-section card">
              <h2>Key Benefits</h2>
              <ul>
                <li>Faster patient registration and lookup</li>
                <li>Reduced paperwork and lost files</li>
                <li>Organised and consistent medical records</li>
                <li>Simple search across all patient data</li>
                <li>Easy editing and updating of records</li>
                <li>Confirmation step before deleting data</li>
              </ul>
            </div>

            <div className="about-section card">
              <h2>System Users</h2>
              <p>
                The system is intended for staff who handle patient data daily:
              </p>
              <ul>
                <li>Receptionists and front-desk officers</li>
                <li>Nurses and clinical officers</li>
                <li>Doctors and medical practitioners</li>
                <li>Hospital administrators</li>
                <li>Medical records departments</li>
              </ul>
            </div>
          </div>

          <div className="team-section">
            <h2 className="team-title">Our Development Team</h2>
            <p className="team-intro">
              This project was built by a small student development team as part
              of a group assignment on database design and web application
              development.
            </p>

            <div className="team-grid">
              {team.map((member, index) => (
                <div className="team-card card" key={index}>
                  <div className="team-avatar">{member.name.charAt(0)}</div>
                  <h3>{member.name}</h3>
                  <span className="team-role">{member.role}</span>
                  <p>{member.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card tech-card">
            <h2>Technology Used</h2>
            <div className="tech-grid">
              <div className="tech-item">
                <strong>Frontend</strong>
                <p>React, Vite, JavaScript, CSS</p>
              </div>
              <div className="tech-item">
                <strong>Mock Backend</strong>
                <p>JSON Server (REST API)</p>
              </div>
              <div className="tech-item">
                <strong>Routing</strong>
                <p>React Router DOM</p>
              </div>
              <div className="tech-item">
                <strong>Data Operations</strong>
                <p>Add, View, Edit, Delete (CRUD)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
