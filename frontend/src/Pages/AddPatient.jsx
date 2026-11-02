import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Save } from "lucide-react";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import API from "../Services/api";

function AddPatient() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    dob: "",
    email: "",
    glucose: "",
    haemoglobin: "",
    cholesterol: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const [year, month, day] = formData.dob.split("-");

    const patientData = {
      ...formData,
      dob: `${day}/${month}/${year}`,
      glucose: Number(formData.glucose),
      haemoglobin: Number(formData.haemoglobin),
      cholesterol: Number(formData.cholesterol),
    };

    try {
      setLoading(true);

      await API.post("/patients/", patientData);

      setSuccess("Patient registered successfully!");

      setFormData({
        full_name: "",
        dob: "",
        email: "",
        glucose: "",
        haemoglobin: "",
        cholesterol: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (error) {
      console.error("Registration error:", error);

      const statusCode = error.response?.status;
      const validationErrors = error.response?.data?.detail;

      // Duplicate patient error
      if (statusCode === 409) {
        setError(
          "This patient is already registered. A duplicate record cannot be created."
        );
      }

      // Validation errors
      else if (Array.isArray(validationErrors)) {
        setError(
          validationErrors
            .map(
              (item) =>
                `${item.loc[item.loc.length - 1]}: ${item.msg}`
            )
            .join(" | ")
        );
      }

      // Other backend errors
      else {
        setError(
          validationErrors ||
            "Unable to register patient. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full border border-slate-300 rounded-xl px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClasses =
    "block text-sm font-semibold text-slate-700 mb-2";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 min-w-0">
        <Navbar />

        <div className="px-6 py-8 lg:px-10">

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition mb-6"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">
              Add New Patient
            </h1>

            <p className="text-slate-500 mt-2">
              Enter patient information and blood test results.
            </p>
          </div>

          {/* Centered Form */}
          <div className="max-w-5xl mx-auto">

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 lg:p-10">

              {/* Form Header */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">

                <div className="p-3.5 bg-blue-100 text-blue-600 rounded-xl">
                  <UserPlus size={26} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Patient Information
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    All fields are required.
                  </p>
                </div>

              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                  {/* Full Name */}
                  <div>
                    <label className={labelClasses}>
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      minLength={2}
                      maxLength={100}
                      required
                      className={inputClasses}
                    />
                  </div>

                  {/* DOB */}
                  <div>
                    <label className={labelClasses}>
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                      required
                      className={inputClasses}
                    />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className={labelClasses}>
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                      required
                      className={inputClasses}
                    />
                  </div>

                  {/* Glucose */}
                  <div>
                    <label className={labelClasses}>
                      Glucose
                    </label>

                    <input
                      type="number"
                      name="glucose"
                      value={formData.glucose}
                      onChange={handleChange}
                      placeholder="Enter glucose value"
                      min="0.01"
                      step="any"
                      required
                      className={inputClasses}
                    />
                  </div>

                  {/* Haemoglobin */}
                  <div>
                    <label className={labelClasses}>
                      Haemoglobin
                    </label>

                    <input
                      type="number"
                      name="haemoglobin"
                      value={formData.haemoglobin}
                      onChange={handleChange}
                      placeholder="Enter haemoglobin value"
                      min="0.01"
                      step="any"
                      required
                      className={inputClasses}
                    />
                  </div>

                  {/* Cholesterol */}
                  <div className="md:col-span-2">
                    <label className={labelClasses}>
                      Cholesterol
                    </label>

                    <input
                      type="number"
                      name="cholesterol"
                      value={formData.cholesterol}
                      onChange={handleChange}
                      placeholder="Enter cholesterol value"
                      min="0.01"
                      step="any"
                      required
                      className={inputClasses}
                    />
                  </div>

                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
                    {success}
                  </div>
                )}

                {/* Form Footer */}
                <div className="flex justify-end mt-8 pt-6 border-t border-slate-200">

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-7 py-3.5 rounded-xl font-semibold text-sm shadow-sm transition"
                  >
                    <Save size={18} />

                    {loading
                      ? "Saving..."
                      : "Register Patient"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default AddPatient;