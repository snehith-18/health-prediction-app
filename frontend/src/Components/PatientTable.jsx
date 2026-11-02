import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Eye,
  X,
} from "lucide-react";

function PatientTable({ patients, onEdit, onDelete }) {
  const [selectedRemarks, setSelectedRemarks] = useState(null);

  // Synchronize popup with updated patient records
  useEffect(() => {
    if (selectedRemarks) {
      const updatedPatient = patients.find(
        (patient) => patient.id === selectedRemarks.id
      );

      if (updatedPatient) {
        setSelectedRemarks(updatedPatient);
      } else {
        setSelectedRemarks(null);
      }
    }
  }, [patients, selectedRemarks]);

  const openRemarks = (patient) => {
    setSelectedRemarks(patient);
  };

  const closeRemarks = () => {
    setSelectedRemarks(null);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            Patient Records
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Manage registered patient information
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">DOB</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Glucose</th>
                <th className="px-6 py-4">Haemoglobin</th>
                <th className="px-6 py-4">Cholesterol</th>
                <th className="px-6 py-4">Remarks</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {patients.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-10 text-slate-500"
                  >
                    No patient records found.
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 font-medium">
                      {patient.id}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {patient.full_name}
                    </td>

                    <td className="px-6 py-4">
                      {new Date(
                        `${patient.dob}T00:00:00`
                      ).toLocaleDateString("en-GB")}
                    </td>

                    <td className="px-6 py-4">
                      {patient.email}
                    </td>

                    <td className="px-6 py-4">
                      {patient.glucose}
                    </td>

                    <td className="px-6 py-4">
                      {patient.haemoglobin}
                    </td>

                    <td className="px-6 py-4">
                      {patient.cholesterol}
                    </td>

                    <td className="px-6 py-4 min-w-[170px]">
                      {patient.remarks ? (
                        <div>
                          <p className="text-slate-600 line-clamp-2">
                            {patient.remarks}
                          </p>

                          <button
                            type="button"
                            onClick={() => openRemarks(patient)}
                            className="mt-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <Eye size={15} />
                            View Remarks
                          </button>
                        </div>
                      ) : (
                        <span className="text-orange-500">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onEdit(patient.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit patient"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(patient.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete patient"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Remarks Popup */}
      {selectedRemarks && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeRemarks}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  AI Health Remarks
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {selectedRemarks.full_name}
                </p>
              </div>

              <button
                type="button"
                onClick={closeRemarks}
                className="text-slate-500 hover:text-slate-800"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 max-h-[65vh] overflow-y-auto">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <p className="text-sm leading-7 text-slate-700 whitespace-pre-line">
                  {selectedRemarks.remarks || "No AI remarks available."}
                </p>
              </div>

              <div className="mt-5 bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-orange-800">
                  Medical Disclaimer
                </p>

                <p className="text-sm text-orange-700 mt-1 leading-6">
                  These AI-generated remarks are for informational
                  purposes only. They are not a medical diagnosis.
                  Please consult a qualified healthcare professional
                  for proper interpretation.
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={closeRemarks}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PatientTable;