PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS medical_conditions (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL COLLATE NOCASE UNIQUE
    CHECK (length(trim(name)) BETWEEN 1 AND 120)
);

CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY,
  patient_number TEXT NOT NULL COLLATE NOCASE UNIQUE
    CHECK (length(trim(patient_number)) BETWEEN 1 AND 30),
  first_name TEXT NOT NULL CHECK (length(trim(first_name)) BETWEEN 1 AND 80),
  last_name TEXT NOT NULL CHECK (length(trim(last_name)) BETWEEN 1 AND 80),
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  date_of_birth TEXT NOT NULL CHECK (
    date_of_birth GLOB '????-??-??'
    AND date(date_of_birth) = date_of_birth
  ),
  phone TEXT NOT NULL CHECK (length(trim(phone)) BETWEEN 1 AND 40),
  address TEXT NOT NULL DEFAULT '' CHECK (length(address) <= 250),
  medical_condition_id INTEGER REFERENCES medical_conditions(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
