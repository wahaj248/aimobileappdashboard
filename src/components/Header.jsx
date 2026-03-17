import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutManual, setProfileSuccess } from "../store/authSlice";
import axiosInstance from "../Axios/axiosInstance";
import appLogo from "../assets/appLogo.png";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const t = setTimeout(() => {
      (async () => {
        try {
          const res = await axiosInstance.get("profile");
          if (!cancelled) dispatch(setProfileSuccess(res?.data));
        } catch (_) {
          // ignore
        }
      })();
    }, 1000);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [dispatch, isAuthenticated]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("logout");
    } catch (_) {
      // Even if API fails, proceed with local logout.
    } finally {
      dispatch(logoutManual());
      setShowLogoutModal(false);
      navigate("/");
    }
  };

  return (
    <>
      <header className="flex items-center justify-between mb-10 relative bg-[#FFFFFF] px-6 md:px-10 py-6">
        <div className="flex items-center gap-6">
          <Link to="/dashboard">
            <div className="flex items-center gap-3">
              <img src={appLogo} alt="App logo" className="w-20 h-20 rounded-lg object-contain bg-white" />
              <div className="leading-tight">
                <div className="text-sm font-semibold text-gray-900">Admin Portal</div>
                <div className="text-[11px] text-gray-500">Control panel</div>
              </div>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Dashboard</Link>
            <Link to="/users" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Users</Link>
            <Link to="/subscriptions" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Subscriptions</Link>
            <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Profile</Link>
            <Link to="/change-password" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Change Password</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
            {user?.name?.[0] || "U"}
          </div>
          <span className="font-medium text-gray-800 text-sm">{user?.name || "User"}</span>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <LogOut size={20} className="text-gray-600" />
          </button>
        </div>
      </header>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-lg relative">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <div className="text-center py-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Want to logout?</h2>
            </div>
            <div className="flex justify-between gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-1/2 border py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={handleLogout}
                className="w-1/2 bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
