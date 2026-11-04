INSERT OR IGNORE INTO medical_conditions (name)
VALUES ('Malaria'), ('Hypertension'), ('Asthma');

INSERT OR IGNORE INTO patients (
  id,
  patient_number,
  first_name,
  last_name,
  gender,
  date_of_birth,
  phone,
  address,
  medical_condition_id
)
VALUES
  (1, 'PAT-001', 'Jane', 'Wanjiku', 'Female', '1998-04-12', '0712345678', 'Nairobi',
   (SELECT id FROM medical_conditions WHERE name = 'Malaria')),
  (2, 'PAT-002', 'John', 'Kamau', 'Male', '1990-08-22', '0723456789', 'Mombasa',
   (SELECT id FROM medical_conditions WHERE name = 'Hypertension')),
  (3, 'PAT-003', 'Grace', 'Akinyi', 'Female', '2001-01-15', '0734567890', 'Kisumu',
   (SELECT id FROM medical_conditions WHERE name = 'Asthma')),
  (4, 'PAT-0045', 'test', 'test', 'Male', '2026-11-01', '0712345678', 'WAIYAKI WAY',
   (SELECT id FROM medical_conditions WHERE name = 'Malaria')),
  (5, 'PAT-004544', 'Benson', 'mwanake', 'Male', '2026-11-02', '0706444363', 'WAIYAKI WAY',
   (SELECT id FROM medical_conditions WHERE name = 'Malaria'));
