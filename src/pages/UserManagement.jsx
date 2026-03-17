import React, { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { CreateUserModal } from "../components/CreateUserModal";
import axiosInstance from "../Axios/axiosInstance";
import { useSelector } from "react-redux";

const UserManagement = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState("all"); // all | active | inactive

  const API_BASE = "https://peru-wasp-681695.hostingersite.com/api/";

  const fetchUsers = async (nextFilter = filter) => {
    setLoading(true);
    try {
      const url =
        nextFilter === "active"
          ? `${API_BASE}users/active`
          : nextFilter === "inactive"
          ? `${API_BASE}users/inactive`
          : `${API_BASE}all-users`;

      const res = await axiosInstance.get(url);
      setUsers(Array.isArray(res?.data?.data) ? res.data.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const t = setTimeout(() => fetchUsers(filter), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, isAuthenticated]);

  const filteredUsers = useMemo(() => {
    const list = users && users.length > 0 ? users : [];
    if (!searchValue.trim()) return list;
    const q = searchValue.toLowerCase();
    return list.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q))
    );
  }, [users, searchValue]);

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    setLoading(true);
    try {
      await axiosInstance.post(`${API_BASE}users/${user.id}/toggle`, { status: nextStatus });
      await fetchUsers(filter);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchUsers(filter)}
            disabled={loading}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh"
          >
            <RefreshCw size={18} /> Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
            title="Local modal (API not provided)"
          >
            <Plus size={18} /> Add User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full md:max-w-md border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                filter === "active" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("inactive")}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                filter === "inactive" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">#</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">Name</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">Email</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.name || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {user.status || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={loading}
                          className={`px-3 py-2 rounded-lg transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                            user.status === "active"
                              ? "bg-red-50 text-red-700 hover:bg-red-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                          title="Toggle active/inactive"
                        >
                          {user.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                    {loading ? "Loading..." : "No users found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && <CreateUserModal onClose={handleCloseModal} />}
    </div>
  );
};

export default UserManagement;
