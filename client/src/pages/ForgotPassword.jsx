import { ArrowLeft, Mail } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../configs/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await api.post("/api/users/forgot-password", { email });
      setIsSubmitted(true);
      toast.success(data.message);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[380px] w-full text-center border border-gray-300/60 rounded-2xl px-8 py-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl font-medium">Forgot password</h1>
        <p className="text-gray-500 text-sm mt-2">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {!isSubmitted ? (
          <>
            <div className="flex items-center w-full mt-6 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
              <Mail size={14} color="#6B7280" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="border-none outline-none ring-0 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </button>
          </>
        ) : (
          <div className="mt-6 rounded-xl bg-green-50 border border-green-200 px-4 py-4 text-sm text-green-700">
            If an account with that email exists, a password reset link has been
            sent. Please check your inbox.
          </div>
        )}

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

export default ForgotPassword;
