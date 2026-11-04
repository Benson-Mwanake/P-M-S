import { createServer } from "node:http";
import { mkdirSync, readFileSync, existsSync, createReadStream } from "node:fs";
import { dirname, resolve, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const serverDirectory = dirname(fileURLToPath(import.meta.url));
const rootDirectory = resolve(serverDirectory, ".."); // project root
const publicDir = resolve(rootDirectory, "dist"); // serve frontend from here
const databasePath = resolve(
  process.env.DATABASE_PATH || resolve(serverDirectory, "pms.sqlite"),
);
const port = Number(process.env.PORT || 3001);

const sqliteConstraint = 19;
const sqliteConstraintPrimaryKey = 1555;
const sqliteConstraintUnique = 2067;

mkdirSync(dirname(databasePath), { recursive: true });

const database = new DatabaseSync(databasePath);
database.exec(readFileSync(resolve(serverDirectory, "schema.sql"), "utf8"));
database.exec("PRAGMA foreign_keys = ON");

if (
  database.prepare("SELECT COUNT(*) AS count FROM patients").get().count === 0
) {
  database.exec(readFileSync(resolve(serverDirectory, "seed.sql"), "utf8"));
}

const patientSelect = `
  SELECT
    patients.id,
    patients.patient_number,
    patients.first_name,
    patients.last_name,
    patients.gender,
    patients.date_of_birth,
    patients.phone,
    patients.address,
    medical_conditions.name AS medical_condition
  FROM patients
  LEFT JOIN medical_conditions
    ON medical_conditions.id = patients.medical_condition_id
`;

const findPatient = database.prepare(`${patientSelect} WHERE patients.id = ?`);

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function toApiPatient(row) {
  return {
    id: String(row.id),
    patientNumber: row.patient_number,
    firstName: row.first_name,
    lastName: row.last_name,
    gender: row.gender,
    dateOfBirth: row.date_of_birth,
    phone: row.phone,
    address: row.address,
    medicalCondition: row.medical_condition || "",
  };
}

function validatePatient(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new HttpError(400, "Request body must be a JSON object.");
  }

  const patient = {
    patientNumber: input.patientNumber,
    firstName: input.firstName,
    lastName: input.lastName,
    gender: input.gender,
    dateOfBirth: input.dateOfBirth,
    phone: input.phone,
    address: input.address ?? "",
    medicalCondition: input.medicalCondition ?? "",
  };

  const requiredFields = [
    ["patientNumber", 30],
    ["firstName", 80],
    ["lastName", 80],
    ["phone", 40],
  ];

  for (const [field, maxLength] of requiredFields) {
    if (typeof patient[field] !== "string" || !patient[field].trim()) {
      throw new HttpError(400, `${field} is required.`);
    }
    patient[field] = patient[field].trim();
    if (patient[field].length > maxLength) {
      throw new HttpError(
        400,
        `${field} must be ${maxLength} characters or fewer.`,
      );
    }
  }

  if (!["Male", "Female", "Other"].includes(patient.gender)) {
    throw new HttpError(400, "gender must be Male, Female, or Other.");
  }

  if (
    typeof patient.dateOfBirth !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(patient.dateOfBirth) ||
    Number.isNaN(Date.parse(`${patient.dateOfBirth}T00:00:00.000Z`)) ||
    new Date(`${patient.dateOfBirth}T00:00:00.000Z`)
      .toISOString()
      .slice(0, 10) !== patient.dateOfBirth
  ) {
    throw new HttpError(
      400,
      "dateOfBirth must be a valid date in YYYY-MM-DD format.",
    );
  }

  for (const [field, maxLength] of [
    ["address", 250],
    ["medicalCondition", 120],
  ]) {
    if (typeof patient[field] !== "string") {
      throw new HttpError(400, `${field} must be a string.`);
    }
    patient[field] = patient[field].trim();
    if (patient[field].length > maxLength) {
      throw new HttpError(
        400,
        `${field} must be ${maxLength} characters or fewer.`,
      );
    }
  }

  return patient;
}

function getMedicalConditionId(name) {
  if (!name) return null;

  database
    .prepare(
      "INSERT INTO medical_conditions (name) VALUES (?) ON CONFLICT(name) DO NOTHING",
    )
    .run(name);
  return database
    .prepare("SELECT id FROM medical_conditions WHERE name = ?")
    .get(name).id;
}

function withTransaction(operation) {
  database.exec("BEGIN");
  try {
    const result = operation();
    database.exec("COMMIT");
    return result;
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1024 * 1024) {
      throw new HttpError(413, "Request body exceeds the 1 MB limit.");
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "Request body must contain valid JSON.");
  }
}

function sendJson(response, status, value) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(value));
}

function getPatientId(pathname) {
  // Supports both /patients/123 and /api/patients/123
  const match = pathname.match(/^\/(?:api\/)?patients\/(\d+)$/);
  if (!match) return null;

  const id = Number(match[1]);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new HttpError(400, "Patient id must be a positive integer.");
  }
  return id;
}

function insertPatient(patient) {
  return withTransaction(() => {
    const conditionId = getMedicalConditionId(patient.medicalCondition);
    const result = database
      .prepare(
        `
        INSERT INTO patients (
          patient_number, first_name, last_name, gender, date_of_birth,
          phone, address, medical_condition_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      )
      .run(
        patient.patientNumber,
        patient.firstName,
        patient.lastName,
        patient.gender,
        patient.dateOfBirth,
        patient.phone,
        patient.address,
        conditionId,
      );
    return toApiPatient(findPatient.get(Number(result.lastInsertRowid)));
  });
}

function updatePatient(id, patient) {
  return withTransaction(() => {
    const conditionId = getMedicalConditionId(patient.medicalCondition);
    const result = database
      .prepare(
        `
        UPDATE patients
        SET patient_number = ?, first_name = ?, last_name = ?, gender = ?,
            date_of_birth = ?, phone = ?, address = ?,
            medical_condition_id = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      )
      .run(
        patient.patientNumber,
        patient.firstName,
        patient.lastName,
        patient.gender,
        patient.dateOfBirth,
        patient.phone,
        patient.address,
        conditionId,
        id,
      );
    return result.changes ? toApiPatient(findPatient.get(id)) : null;
  });
}

function deletePatient(id) {
  return (
    database.prepare("DELETE FROM patients WHERE id = ?").run(id).changes > 0
  );
}

// ---------- Static file helpers ----------
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function serveStatic(response, filePath) {
  const ext = extname(filePath).toLowerCase();
  const type = mimeTypes[ext] || "application/octet-stream";
  response.writeHead(200, { "Content-Type": type });
  createReadStream(filePath).pipe(response);
}

const server = createServer(async (request, response) => {
  try {
    // CORS
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }

    const { pathname } = new URL(request.url, `http://${request.headers.host}`);

    // ---------- Health ----------
    if (
      request.method === "GET" &&
      (pathname === "/health" || pathname === "/api/health")
    ) {
      sendJson(response, 200, { status: "ok" });
      return;
    }

    // ---------- GET all patients ----------
    if (
      request.method === "GET" &&
      (pathname === "/patients" || pathname === "/api/patients")
    ) {
      const patients = database
        .prepare(`${patientSelect} ORDER BY patients.id`)
        .all()
        .map(toApiPatient);
      sendJson(response, 200, patients);
      return;
    }

    // ---------- POST create patient ----------
    if (
      request.method === "POST" &&
      (pathname === "/patients" || pathname === "/api/patients")
    ) {
      const patient = validatePatient(await readJsonBody(request));
      sendJson(response, 201, insertPatient(patient));
      return;
    }

    // ---------- PUT / DELETE by id ----------
    const id = getPatientId(pathname);

    if (id !== null && request.method === "PUT") {
      const patient = validatePatient(await readJsonBody(request));
      const updated = updatePatient(id, patient);
      if (!updated) {
        sendJson(response, 404, { error: "Patient not found." });
        return;
      }
      sendJson(response, 200, updated);
      return;
    }

    if (id !== null && request.method === "DELETE") {
      if (!deletePatient(id)) {
        sendJson(response, 404, { error: "Patient not found." });
        return;
      }
      response.writeHead(204);
      response.end();
      return;
    }

    // Method not allowed for known patient routes
    if (
      pathname === "/patients" ||
      pathname === "/api/patients" ||
      id !== null
    ) {
      response.setHeader(
        "Allow",
        pathname === "/patients" || pathname === "/api/patients"
          ? "GET, POST"
          : "PUT, DELETE",
      );
      sendJson(response, 405, { error: "Method not allowed." });
      return;
    }

    // ---------- Serve static files from dist/ ----------
    let filePath = join(publicDir, pathname === "/" ? "index.html" : pathname);

    // Prevent path traversal
    if (!filePath.startsWith(publicDir)) {
      sendJson(response, 403, { error: "Forbidden" });
      return;
    }

    if (existsSync(filePath) && !filePath.endsWith("/")) {
      serveStatic(response, filePath);
      return;
    }

    // SPA fallback – any unknown route returns index.html so React Router works
    const indexPath = join(publicDir, "index.html");
    if (existsSync(indexPath)) {
      serveStatic(response, indexPath);
      return;
    }

    sendJson(response, 404, { error: "Route not found." });
  } catch (error) {
    if (error instanceof HttpError) {
      sendJson(response, error.status, { error: error.message });
      return;
    }

    if (
      error.errcode === sqliteConstraintUnique ||
      error.errcode === sqliteConstraintPrimaryKey
    ) {
      sendJson(response, 409, {
        error: "A patient with that patient number already exists.",
      });
      return;
    }

    if (error.errcode && (error.errcode & 0xff) === sqliteConstraint) {
      sendJson(response, 400, {
        error: "Patient data violates a database constraint.",
      });
      return;
    }

    console.error("Patient API request failed:", error);
    sendJson(response, 500, { error: "Internal server error." });
  }
});

server.listen(port, () => {
  console.log(`PatientCare running on http://localhost:${port}`);
  console.log(`Serving frontend from: ${publicDir}`);
  console.log(`SQLite database: ${databasePath}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => {
      database.close();
      process.exit(0);
    });
  });
}
