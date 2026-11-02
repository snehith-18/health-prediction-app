import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./Pages/Dashboard";
import Patients from "./Pages/Patients";
import AddPatient from "./Pages/AddPatient";
import EditPatient from "./Pages/EditPatient";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/patients" element={<Patients />} />

      <Route path="/add-patient" element={<AddPatient />} />

      <Route
        path="/edit-patient/:patientId"
        element={<EditPatient />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;