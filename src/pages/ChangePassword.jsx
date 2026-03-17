import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "../Axios/axiosInstance";

const ChangePassword = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const newPassword = watch("new_password");

  const onSubmit = async (data) => {
    await axiosInstance.post("password/change", {
      current_password: data.current_password,
      new_password: data.new_password,
      new_password_confirmation: data.new_password_confirmation,
    });
    reset();
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Change Password</h2>
        <p className="text-gray-500 mb-8">Update your password securely.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                className={`w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none ${
                  errors.current_password ? "border-red-500" : "border-gray-300"
                }`}
                {...register("current_password", { required: "Current password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="h-5">
              {errors.current_password && (
                <p className="text-red-500 text-xs mt-1">{errors.current_password.message}</p>
              )}
            </div>
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                className={`w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none ${
                  errors.new_password ? "border-red-500" : "border-gray-300"
                }`}
                {...register("new_password", { required: "New password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="h-5">
              {errors.new_password && (
                <p className="text-red-500 text-xs mt-1">{errors.new_password.message}</p>
              )}
            </div>
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm new password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                className={`w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none ${
                  errors.new_password_confirmation ? "border-red-500" : "border-gray-300"
                }`}
                {...register("new_password_confirmation", {
                  required: "New password confirmation is required",
                  validate: (v) => v === newPassword || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="h-5">
              {errors.new_password_confirmation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.new_password_confirmation.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
