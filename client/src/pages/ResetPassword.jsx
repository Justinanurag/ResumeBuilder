import { ArrowLeft, Lock } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../configs/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await api.post("/api/users/reset-password", {
        token,
        password,
      });
      toast.success(data.message);
      navigate("/app?state=login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="sm:w-[380px] w-full text-center border border-gray-300/60 rounded-2xl px-8 py-8 bg-white">
          <h1 className="text-gray-900 text-2xl font-medium">Invalid reset link</h1>
          <p className="text-gray-500 text-sm mt-2">
            This password reset link is missing or invalid.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block mt-6 text-green-500 hover:underline text-sm"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[380px] w-full text-center border border-gray-300/60 rounded-2xl px-8 py-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl font-medium">Reset password</h1>
        <p className="text-gray-500 text-sm mt-2">Enter your new password below.</p>

        <div className="flex items-center w-full mt-6 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={14} color="#6B7280" />
          <input
            type="password"
            name="password"
            placeholder="New password"
            className="border-none outline-none ring-0 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={14} color="#6B7280" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            className="border-none outline-none ring-0 w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </button>

        <Link
          to="/app?state=login"
          className="inline-flex items-center justify-center gap-2 text-green-500 text-sm mt-6 hover:underline"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </form>
    </div>
  );
};

export default ResetPassword;
