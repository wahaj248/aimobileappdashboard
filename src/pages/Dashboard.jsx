import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import totalorders from "../assets/totalorders-icon.svg";
import ordervalue from "../assets/ordervalue-icon.svg";
import grossprofit from "../assets/grossprofit-icon.svg";
import StatsCard from "../components/StatsCard";
import UsersSection from "../components/UsersSection";
import axiosInstance from "../Axios/axiosInstance";

const Dashboard = () => {
  const { user: authUser } = useSelector((state) => state.auth);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [userSearch, setUserSearch] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [users, setUsers] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);

  const USERS_API_BASE = "https://peru-wasp-681695.hostingersite.com/api/";

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const res = await axiosInstance.get(`${USERS_API_BASE}all-users`);
      setUsers(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (e) {
      setUsersError(e?.response?.data?.message || e?.message || "Failed to load users.");
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    setSubsLoading(true);
    setSubsError(null);
    try {
      const res = await axiosInstance.get("subscriptions");
      setSubscriptions(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setSubsError(e?.response?.data?.message || e?.message || "Failed to load subscriptions.");
      setSubscriptions([]);
    } finally {
      setSubsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const t = setTimeout(() => {
      fetchUsers();
      fetchSubscriptions();
    }, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const filteredUsers = useMemo(() => {
    const list = users && users.length > 0 ? users : [];
    return list.filter((u) => {
      if (authUser?.id && u.id === authUser.id) return false;
      if (!userSearch) return true;
      const q = userSearch.toLowerCase();
      return (u.name && u.name.toLowerCase().includes(q)) || (u.email && u.email.toLowerCase().includes(q));
    });
  }, [users, userSearch, authUser?.id]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status === "inactive").length;
  const totalSubscriptions = subscriptions.length;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total users", value: totalUsers, icon: totalorders, alt: "Total users icon" },
          { label: "Active users", value: activeUsers, icon: grossprofit, alt: "Active users icon" },
          { label: "Inactive users", value: inactiveUsers, icon: grossprofit, alt: "Inactive users icon" },
          { label: "Subscriptions", value: totalSubscriptions, icon: ordervalue, alt: "Subscriptions icon" },
        ].map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between gap-3 mb-6">
            <div>
              <h2 className="font-semibold text-gray-800 text-lg">Quick actions</h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage users, subscriptions, profile, and security settings.
              </p>
            </div>
            <button
              onClick={() => {
                fetchUsers();
                fetchSubscriptions();
              }}
              className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={usersLoading || subsLoading}
            >
              {usersLoading || subsLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/users" className="group border rounded-2xl p-5 hover:bg-gray-50 transition">
              <div className="text-sm font-semibold text-gray-800">Users</div>
              <div className="text-xs text-gray-500 mt-1">View all users and change active/inactive status.</div>
              <div className="mt-4 flex items-center gap-3 text-xs">
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">Total: {totalUsers}</span>
                <span className="px-2 py-1 rounded-full bg-green-50 text-green-700">Active: {activeUsers}</span>
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">Inactive: {inactiveUsers}</span>
              </div>
              {usersError && <div className="mt-3 text-xs text-red-600">{usersError}</div>}
            </Link>

            <Link to="/subscriptions" className="group border rounded-2xl p-5 hover:bg-gray-50 transition">
              <div className="text-sm font-semibold text-gray-800">Subscriptions</div>
              <div className="text-xs text-gray-500 mt-1">Create, update, and delete subscription plans.</div>
              <div className="mt-4 flex items-center gap-3 text-xs">
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">Total plans: {totalSubscriptions}</span>
              </div>
              {subsError && <div className="mt-3 text-xs text-red-600">{subsError}</div>}
            </Link>

            <Link to="/profile" className="group border rounded-2xl p-5 hover:bg-gray-50 transition">
              <div className="text-sm font-semibold text-gray-800">Profile</div>
              <div className="text-xs text-gray-500 mt-1">View admin profile details.</div>
            </Link>

            <Link to="/change-password" className="group border rounded-2xl p-5 hover:bg-gray-50 transition">
              <div className="text-sm font-semibold text-gray-800">Change Password</div>
              <div className="text-xs text-gray-500 mt-1">Update your password securely.</div>
            </Link>
          </div>
        </div>
        <div>
          <UsersSection
            users={filteredUsers}
            searchValue={userSearch}
            onSearchChange={setUserSearch}
            loading={usersLoading}
            error={usersError}
            showStatus={false}
            showToggle={false}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
