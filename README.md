# Patient Management System

Patient management coursework frontend built with React, Vite, and JSON Server.

## Run locally

```sh
npm install
```

In separate terminals, start the mock API and frontend:

```sh
npm run mock-api
npm run dev
```

The patient page uses `/api/patients`, proxied by Vite to JSON Server on port 3001. The Home, About, Contact, Login, and Patients pages use hash navigation. Login is a UI placeholder and does not authenticate users.

## Project structure

```text
public/
└── images/
    └── hospital.jpg
src/
├── assets/
│   └── logo.svg
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── PageHeader.jsx
│   ├── PatientForm.jsx
│   ├── PatientTable.jsx
│   └── DeleteConfirmation.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Login.jsx
│   └── Patients.jsx
├── services/
│   └── patientService.js
├── styles/
│   ├── index.css
│   ├── navbar.css
│   ├── footer.css
│   ├── pages.css
│   └── patients.css
├── App.jsx
└── main.jsx
```

Run `npm run lint` and `npm run build` to validate the app.
