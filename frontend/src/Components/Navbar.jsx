import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  UserCircle,
  X,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";

import API from "../Services/api";

const STORAGE_KEY = "readPatientNotifications";

function Navbar() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load previously read notification IDs from localStorage
  const [readNotifications, setReadNotifications] = useState(() => {
    try {
      const savedNotifications = localStorage.getItem(STORAGE_KEY);
      return savedNotifications
        ? JSON.parse(savedNotifications)
        : [];
    } catch (error) {
      console.error("Unable to load read notifications:", error);
      return [];
    }
  });

  // Save read notification IDs whenever they change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(readNotifications)
    );
  }, [readNotifications]);

  const fetchRecentPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/patients/");

      const now = new Date();

      const twentyFourHoursAgo = new Date(
        now.getTime() - 24 * 60 * 60 * 1000
      );

      const recentPatients = response.data
        .filter((patient) => {
          if (!patient.created_at) return false;

          const registrationDate = new Date(
            patient.created_at.endsWith("Z")
              ? patient.created_at
              : patient.created_at.replace(" ", "T") + "Z"
          );

          return (
            !Number.isNaN(registrationDate.getTime()) &&
            registrationDate >= twentyFourHoursAgo &&
            registrationDate <= now
          );
        })
        .sort(
          (a, b) =>
            new Date(b.created_at.replace(" ", "T") + "Z") -
            new Date(a.created_at.replace(" ", "T") + "Z")
        );

      setPatients(recentPatients);

    } catch (error) {
      console.error("Notification error:", error);
      setError("Unable to load recent registrations.");

    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on mount and every 60 seconds
  useEffect(() => {
    fetchRecentPatients();

    const interval = setInterval(
      fetchRecentPatients,
      60000
    );

    return () => clearInterval(interval);
  }, []);

  // Calculate unread notifications
  const unreadCount = patients.filter(
    (patient) => !readNotifications.includes(patient.id)
  ).length;

  // Mark one notification as read
  const markAsRead = (id) => {
    setReadNotifications((previous) => {
      if (previous.includes(id)) {
        return previous;
      }

      return [...previous, id];
    });
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const allPatientIds = patients.map(
      (patient) => patient.id
    );

    setReadNotifications((previous) => [
      ...new Set([...previous, ...allPatientIds]),
    ]);
  };

  // Format registration date
  const formatRegistrationTime = (dateValue) => {
    const registrationDate = new Date(
      dateValue.replace(" ", "T") + "Z"
    );

    return registrationDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle notification click
  const handlePatientClick = (patient) => {
    markAsRead(patient.id);
    setIsOpen(false);

    navigate(`/edit-patient/${patient.id}`);
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">

      {/* Page Heading */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Health Overview
        </h2>

        <p className="text-sm text-slate-500">
          Monitor and manage patient health records
        </p>
      </div>

      {/* Navbar Actions */}
      <div className="flex items-center gap-6">

        {/* Notification Section */}
        <div className="relative">

          <button
            type="button"
            onClick={() => setIsOpen((previous) => !previous)}
            className="relative text-slate-600 hover:text-blue-600 transition"
            title="Notifications"
            aria-label="Notifications"
            aria-expanded={isOpen}
          >
            <Bell size={22} />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popup */}
          {isOpen && (
            <div className="absolute right-0 top-12 w-96 max-w-[90vw] bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">

              {/* Popup Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200">

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Notifications
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Recent patient registrations
                  </p>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>

              </div>

              {/* Notification Actions */}
              {patients.length > 0 && (
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">

                  <span className="text-xs text-slate-500">
                    {unreadCount} unread
                  </span>

                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all as read
                  </button>

                </div>
              )}

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto">

                {loading ? (
                  <div className="p-8 text-center text-sm text-slate-500">
                    Loading notifications...
                  </div>

                ) : error ? (
                  <div className="p-6 text-center text-sm text-red-500">
                    {error}

                    <button
                      onClick={fetchRecentPatients}
                      className="block mx-auto mt-2 underline"
                    >
                      Retry
                    </button>
                  </div>

                ) : patients.length === 0 ? (
                  <div className="p-8 text-center">

                    <CheckCircle
                      size={32}
                      className="mx-auto text-green-500 mb-2"
                    />

                    <p className="text-sm font-medium text-slate-700">
                      No recent registrations
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      New patient registrations will appear here.
                    </p>

                  </div>

                ) : (
                  patients.map((patient) => {
                    const isRead = readNotifications.includes(
                      patient.id
                    );

                    return (
                      <button
                        key={patient.id}
                        onClick={() => handlePatientClick(patient)}
                        className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition ${
                          !isRead ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">

                          <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                            <Users size={18} />
                          </div>

                          <div className="flex-1 min-w-0">

                            <div className="flex items-center justify-between gap-2">

                              <p className="text-sm font-semibold text-slate-800">
                                New Patient Registered
                              </p>

                              {!isRead && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0"></span>
                              )}

                            </div>

                            <p className="text-sm text-slate-700 mt-1">
                              {patient.full_name}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              {patient.email}
                            </p>

                            <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                              <Clock size={12} />

                              {formatRegistrationTime(
                                patient.created_at
                              )}
                            </div>

                          </div>

                        </div>
                      </button>
                    );
                  })
                )}

              </div>

              {/* Popup Footer */}
              <div className="p-3 border-t border-slate-200">

                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/patients");
                  }}
                  className="w-full py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  View All Patients
                </button>

              </div>

            </div>
          )}

        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-2">

          <UserCircle size={32} className="text-blue-600" />

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Admin
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>

        </div>

      </div>
    </header>
  );
}

export default Navbar;