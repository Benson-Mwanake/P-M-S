function PatientTable({ patients, onEdit, onDelete, loading }) {
  if (loading) {
    return <div className="loading-state">Loading patients...</div>;
  }

  if (patients.length === 0) {
    return (
      <div className="empty-state">
        <div className="icon">📋</div>
        <p>No patients found.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="patient-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>Phone</th>
            <th>Condition</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.patientNumber}</td>
              <td>
                {p.firstName} {p.lastName}
              </td>
              <td>{p.gender}</td>
              <td>{p.dateOfBirth}</td>
              <td>{p.phone}</td>
              <td>{p.medicalCondition || "—"}</td>
              <td>
                <div className="actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(p)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientTable;
