import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../Axios/axiosInstance";
import { setProfileSuccess } from "../store/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("profile");
      dispatch(setProfileSuccess(res?.data));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Profile</h2>
            <p className="text-gray-500">Admin profile details.</p>
          </div>
          <button
            onClick={fetchProfile}
            disabled={loading}
            className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border rounded-xl p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Name</div>
            <div className="text-sm font-semibold text-gray-800 mt-1">{user?.name || "—"}</div>
          </div>
          <div className="border rounded-xl p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Email</div>
            <div className="text-sm font-semibold text-gray-800 mt-1">{user?.email || "—"}</div>
          </div>
          <div className="border rounded-xl p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Status</div>
            <div className="text-sm font-semibold text-gray-800 mt-1">{user?.status || "—"}</div>
          </div>
          <div className="border rounded-xl p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Role ID</div>
            <div className="text-sm font-semibold text-gray-800 mt-1">
              {user?.role_id ?? "—"}
            </div>
          </div>
          <div className="border rounded-xl p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Created at</div>
            <div className="text-sm font-semibold text-gray-800 mt-1">{user?.created_at || "—"}</div>
          </div>
          <div className="border rounded-xl p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500">Updated at</div>
            <div className="text-sm font-semibold text-gray-800 mt-1">{user?.updated_at || "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
