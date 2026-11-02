import { useEffect, useState } from "react";
import {
  Users,
  Activity,
  UserPlus,
  ClipboardList,
  RefreshCw,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import StatCard from "../Components/StatCard";
import PatientTable from "../Components/PatientTable";
import API from "../Services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const fetchPatients = async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await API.get("/patients/");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);

      setError(
        "Unable to load patient records. Please check the backend."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/patients/${id}`);
      await fetchPatients(true);
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Unable to delete patient.");
    }
  };

  // Dashboard statistics
  const totalPatients = patients.length;

  const aiRemarksGenerated = patients.filter(
    (patient) =>
      patient.remarks &&
      !patient.remarks.includes(
        "AI remarks could not be generated"
      )
  ).length;

  const pendingRemarks = totalPatients - aiRemarksGenerated;

  // Patients registered within the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const newPatients = patients.filter((patient) => {
    if (!patient.created_at) return false;

    const registrationDate = new Date(
      patient.created_at.replace(" ", "T") + "Z"
    );

    return (
      !Number.isNaN(registrationDate.getTime()) &&
      registrationDate >= sevenDaysAgo &&
      registrationDate <= new Date()
    );
  }).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 min-w-0">
        <Navbar />

        <div className="px-6 py-8 lg:px-10">

          {/* Dashboard Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Dashboard Overview
              </h1>

              <p className="text-sm text-slate-500 mt-2">
                Welcome to your Health Prediction System.
                Here's your patient management overview.
              </p>

              <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                <CalendarDays size={16} className="text-blue-600" />
                <span>{currentDate}</span>
              </div>
            </div>

            <button
              onClick={() => fetchPatients(true)}
              disabled={refreshing || loading}
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-600 px-5 py-3 rounded-xl text-sm font-semibold shadow-sm transition disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-9">
            <StatCard
              title="Total Patients"
              value={loading ? "—" : totalPatients}
              subtitle="Registered patient records"
              icon={Users}
              color="bg-blue-100 text-blue-600"
            />

            <StatCard
              title="AI Remarks Generated"
              value={loading ? "—" : aiRemarksGenerated}
              subtitle="Records with AI-generated remarks"
              icon={Activity}
              color="bg-green-100 text-green-600"
            />

            <StatCard
              title="Pending AI Remarks"
              value={loading ? "—" : pendingRemarks}
              subtitle="Records awaiting AI remarks"
              icon={ClipboardList}
              color="bg-orange-100 text-orange-600"
            />

            <StatCard
              title="New Patients"
              value={loading ? "—" : newPatients}
              subtitle="Registered in the last 7 days"
              icon={UserPlus}
              color="bg-purple-100 text-purple-600"
            />
          </div>

          {/* Recent Activity Section */}
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Recent Activity
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  A quick look at your latest patient registrations.
                </p>
              </div>

              <button
                onClick={() => navigate("/patients")}
                className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
              >
                View All Patients
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <RefreshCw
                  size={28}
                  className="text-blue-600 animate-spin mb-3"
                />

                <p className="text-sm text-slate-500">
                  Loading patient records...
                </p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-600 mb-4">{error}</p>

                <button
                  onClick={() => fetchPatients(true)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <PatientTable
                  patients={patients}
                  onEdit={(patientId) =>
                    navigate(`/edit-patient/${patientId}`)
                  }
                  onDelete={handleDelete}
                />
              </div>
            )}
          </section>

          {/* Dashboard Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-6 text-xs text-slate-400">
            <p>Health Prediction System</p>

            <p>
              Patient records are stored securely in your database.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;