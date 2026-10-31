function DeleteConfirmation({ patient, onConfirm, onCancel }) {
  if (!patient) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Delete Patient?</h3>
        <p>
          Are you sure you want to delete{" "}
          <strong>
            {patient.firstName} {patient.lastName}
          </strong>{" "}
          ({patient.patientNumber})? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={onConfirm}>
            Yes, Delete
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
