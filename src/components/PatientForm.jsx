import { useState, useEffect } from "react";

const emptyForm = {
  patientNumber: "",
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  phone: "",
  address: "",
  medicalCondition: "",
};

function PatientForm({ onSubmit, editingPatient, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingPatient) {
      setForm({ ...editingPatient });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editingPatient]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.patientNumber.trim())
      newErrors.patientNumber = "Patient number is required";
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(form);
    if (!editingPatient) {
      setForm(emptyForm);
    }
  };

  return (
    <div className="card form-card">
      <h2>{editingPatient ? "Edit Patient" : "Register New Patient"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Patient Number *</label>
          <input
            type="text"
            name="patientNumber"
            value={form.patientNumber}
            onChange={handleChange}
            placeholder="e.g. PAT-004"
          />
          {errors.patientNumber && (
            <div className="error">{errors.patientNumber}</div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
            />
            {errors.firstName && (
              <div className="error">{errors.firstName}</div>
            )}
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
            />
            {errors.lastName && <div className="error">{errors.lastName}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Gender *</label>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <div className="error">{errors.gender}</div>}
          </div>
          <div className="form-group">
            <label>Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
            {errors.dateOfBirth && (
              <div className="error">{errors.dateOfBirth}</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="07XXXXXXXX"
          />
          {errors.phone && <div className="error">{errors.phone}</div>}
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="City / Area"
          />
        </div>

        <div className="form-group">
          <label>Medical Condition</label>
          <input
            type="text"
            name="medicalCondition"
            value={form.medicalCondition}
            onChange={handleChange}
            placeholder="e.g. Malaria, Hypertension"
          />
        </div>

        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem" }}>
          <button type="submit" className="btn btn-primary">
            {editingPatient ? "Update Patient" : "Register Patient"}
          </button>
          {editingPatient && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PatientForm;
