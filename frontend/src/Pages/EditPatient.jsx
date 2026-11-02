import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, UserRoundPen } from "lucide-react";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import API from "../Services/api";

function EditPatient() {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [formData, setFormData] = useState({
    full_name: "",
    dob: "",
    email: "",
    glucose: "",
    haemoglobin: "",
    cholesterol: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch existing patient details
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/patients/${patientId}`);
        const patient = response.data;

        setFormData({
          full_name: patient.full_name,
          dob: patient.dob,
          email: patient.email,
          glucose: String(patient.glucose),
          haemoglobin: String(patient.haemoglobin),
          cholesterol: String(patient.cholesterol),
        });
      } catch (error) {
        console.error("Error fetching patient:", error);

        setError(
          error.response?.data?.detail ||
          "Unable to load patient details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Submit updated patient details
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.dob) {
      setError("Please select a date of birth.");
      return;
    }

    // Convert YYYY-MM-DD into DD/MM/YYYY
    const [year, month, day] = formData.dob.split("-");

    const patientData = {
      ...formData,
      dob: `${day}/${month}/${year}`,
      glucose: Number(formData.glucose),
      haemoglobin: Number(formData.haemoglobin),
      cholesterol: Number(formData.cholesterol),
    };

    try {
      setSaving(true);

      await API.put(`/patients/${patientId}`, patientData);

      setSuccess("Patient details updated successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      console.error("Error updating patient:", error);

      const validationErrors = error.response?.data?.detail;

      if (Array.isArray(validationErrors)) {
        setError(
          validationErrors
            .map(
              (item) =>
                `${item.loc[item.loc.length - 1]}: ${item.msg}`
            )
            .join(" | ")
        );
      } else {
        setError(
          error.response?.data?.detail ||
          "Unable to update patient details. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 min-w-0">
        <Navbar />

        <div className="p-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">
              Edit Patient
            </h1>

            <p className="text-slate-500 mt-1">
              Update patient information and blood test results.
            </p>
          </div>

          <div className="max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            {loading ? (
              <p className="text-center py-10 text-slate-500">
                Loading patient details...
              </p>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <UserRoundPen size={25} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-800">
                      Patient Information
                    </h2>

                    <p className="text-sm text-slate-500">
                      Update the required fields.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        minLength={2}
                        maxLength={100}
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date of Birth
                      </label>

                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        max={new Date().toISOString().split("T")[0]}
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Glucose
                      </label>

                      <input
                        type="number"
                        name="glucose"
                        value={formData.glucose}
                        onChange={handleChange}
                        min="0.01"
                        step="any"
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Haemoglobin
                      </label>

                      <input
                        type="number"
                        name="haemoglobin"
                        value={formData.haemoglobin}
                        onChange={handleChange}
                        min="0.01"
                        step="any"
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Cholesterol
                      </label>

                      <input
                        type="number"
                        name="cholesterol"
                        value={formData.cholesterol}
                        onChange={handleChange}
                        min="0.01"
                        step="any"
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-8 pt-6 border-t border-slate-200">
                    <button
                      type="submit"
                      disabled={saving || loading}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                      <Save size={18} />
                      {saving ? "Updating..." : "Update Patient"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditPatient;