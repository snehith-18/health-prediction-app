import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Search,
  Users,
  X,
  UserPlus,
  RefreshCw,
  Filter,
} from "lucide-react";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import PatientTable from "../Components/PatientTable";
import API from "../Services/api";

function Patients() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [patients, setPatients] = useState([]);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Fetch patient records
  const fetchPatients = async () => {
    try {
      setError("");
      setLoading(true);

      const response = await API.get("/patients/");

      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);

      setError("Unable to load patient records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Sync search with URL
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  // Handle search
  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearchTerm(value);

    if (value.trim()) {
      setSearchParams(
        { search: value },
        { replace: true }
      );
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setSearchParams({}, { replace: true });
  };

  // Delete patient
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient record? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await API.delete(`/patients/${id}`);

      await fetchPatients();
    } catch (error) {
      console.error("Delete error:", error);

      alert("Unable to delete patient. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return true;

    return (
      patient.full_name?.toLowerCase().includes(search) ||
      patient.email?.toLowerCase().includes(search) ||
      String(patient.id).includes(search)
    );
  });

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />

      <main className="flex-1 min-w-0">

        <Navbar />

        <div className="px-6 py-8 lg:px-10">

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

            <div>
              <div className="flex items-center gap-2 mb-2">

                <h1 className="text-2xl font-bold text-slate-800">
                  Patients
                </h1>

                <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                  Active Records
                </span>

              </div>

              <p className="text-slate-500 text-sm">
                View, search and manage registered patient information.
              </p>
            </div>

            <button
              onClick={() => navigate("/add-patient")}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-sm transition"
            >
              <UserPlus size={18} />
              Add New Patient
            </button>

          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    Total Patients
                  </p>

                  <h2 className="text-3xl font-bold text-slate-800 mt-2">
                    {patients.length}
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    Registered patient records
                  </p>
                </div>

                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <Users size={25} />
                </div>

              </div>

            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    Matching Records
                  </p>

                  <h2 className="text-3xl font-bold text-slate-800 mt-2">
                    {filteredPatients.length}
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    Patients matching your search
                  </p>
                </div>

                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                  <Filter size={25} />
                </div>

              </div>

            </div>

          </div>

          {/* Search Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-7">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">

              <div>
                <h2 className="font-semibold text-slate-800">
                  Search Patients
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Find patients using their name, email or patient ID.
                </p>
              </div>

              <button
                onClick={fetchPatients}
                disabled={loading}
                className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 font-medium"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh Records
              </button>

            </div>

            <div className="relative">

              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search by patient name, email or ID..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Clear search"
                >
                  <X size={18} />
                </button>
              )}

            </div>

            {searchTerm && (
              <div className="mt-3 flex items-center justify-between">

                <p className="text-xs text-slate-500">
                  Showing results for:
                  <span className="ml-1 font-semibold text-blue-600">
                    "{searchTerm}"
                  </span>
                </p>

                <button
                  onClick={clearSearch}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Clear filters
                </button>

              </div>
            )}

          </div>

          {/* Patient Records */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-6 border-b border-slate-200">

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Patient Records
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Manage registered patient information.
                </p>
              </div>

              <span className="text-sm font-medium text-slate-500">
                {filteredPatients.length} of {patients.length} records
              </span>

            </div>

            {loading ? (

              <div className="flex flex-col items-center justify-center py-16">

                <RefreshCw
                  size={30}
                  className="text-blue-600 animate-spin mb-4"
                />

                <p className="text-sm text-slate-500">
                  Loading patient records...
                </p>

              </div>

            ) : error ? (

              <div className="p-10 text-center">

                <p className="text-red-600 mb-4">
                  {error}
                </p>

                <button
                  onClick={fetchPatients}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Try Again
                </button>

              </div>

            ) : filteredPatients.length === 0 ? (

              <div className="flex flex-col items-center justify-center py-16 px-6">

                <div className="p-4 bg-slate-100 text-slate-400 rounded-full mb-4">
                  <Search size={30} />
                </div>

                <h3 className="text-lg font-semibold text-slate-700">
                  {searchTerm
                    ? "No patients found"
                    : "No patient records yet"}
                </h3>

                <p className="text-sm text-slate-500 mt-2 text-center max-w-md">
                  {searchTerm
                    ? "We couldn't find any patients matching your search. Try another name, email or ID."
                    : "Start by registering your first patient."}
                </p>

                {searchTerm ? (

                  <button
                    onClick={clearSearch}
                    className="mt-5 text-blue-600 hover:underline text-sm font-semibold"
                  >
                    Clear Search
                  </button>

                ) : (

                  <button
                    onClick={() => navigate("/add-patient")}
                    className="mt-5 flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    <UserPlus size={17} />
                    Add Patient
                  </button>

                )}

              </div>

            ) : (

              <div className="overflow-x-auto">

                <PatientTable
                  patients={filteredPatients}
                  onEdit={(patientId) =>
                    navigate(`/edit-patient/${patientId}`)
                  }
                  onDelete={handleDelete}
                />

              </div>

            )}

          </div>

          {/* Footer */}
          {!loading && !error && patients.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-5 text-xs text-slate-400">

              <p>
                Showing {filteredPatients.length} matching records out of {patients.length} patients.
              </p>

              <p>
                HealthCare Patient Management System
              </p>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default Patients;