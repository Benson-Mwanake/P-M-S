import { useState, useEffect } from "react";
import PatientForm from "../components/PatientForm";
import PatientTable from "../components/PatientTable";
import DeleteConfirmation from "../components/DeleteConfirmation";
import {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
} from "../services/patientService";
import "../styles/patients.css";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingPatient, setEditingPatient] = useState(null);
  const [deletingPatient, setDeletingPatient] = useState(null);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPatients();
      setPatients(data);
      setFiltered(data);
    } catch (err) {
      setError(
        "Could not load patients. Make sure JSON Server is running on port 3001.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const result = patients.filter(
      (p) =>
        p.firstName.toLowerCase().includes(term) ||
        p.lastName.toLowerCase().includes(term) ||
        p.patientNumber.toLowerCase().includes(term) ||
        (p.medicalCondition || "").toLowerCase().includes(term) ||
        (p.phone || "").includes(term),
    );
    setFiltered(result);
  }, [search, patients]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAddOrUpdate = async (formData) => {
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.id, formData);
        showMessage("Patient updated successfully!");
        setEditingPatient(null);
      } else {
        await addPatient(formData);
        showMessage("Patient registered successfully!");
      }
      loadPatients();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePatient(deletingPatient.id);
      showMessage("Patient deleted successfully!");
      setDeletingPatient(null);
      loadPatients();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="patients-page">
      <div className="container">
        <h1 className="page-title">Patient Management</h1>
        <p className="page-desc">
          Register, search, edit and manage patient records
        </p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="patients-layout">
          <PatientForm
            onSubmit={handleAddOrUpdate}
            editingPatient={editingPatient}
            onCancel={() => setEditingPatient(null)}
          />

          <div className="card">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by name, number, phone or condition..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <PatientTable
              patients={filtered}
              onEdit={setEditingPatient}
              onDelete={setDeletingPatient}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <DeleteConfirmation
        patient={deletingPatient}
        onConfirm={handleDelete}
        onCancel={() => setDeletingPatient(null)}
      />
    </div>
  );
}

export default Patients;
