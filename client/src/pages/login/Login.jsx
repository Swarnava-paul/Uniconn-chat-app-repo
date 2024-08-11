import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserByLoginDetails } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(
        fetchUserByLoginDetails({ email, password })
      ).unwrap();
      if (response) {
        navigate("/");
        setSubmitted(true);
      }
    } catch (error) {
      toast.error(error || "Invalid credentials, please try again.", {
        duration: 4000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 p-5">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6 sm:p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-4">
          Uniconn<span className="text-blue-500"> ChatApp</span>
        </h1>
        <form onSubmit={submitForm}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 bg-white placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 bg-white placeholder-gray-400 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 4.5C6.75 4.5 2.25 8.5 1.5 12c.75 3.5 5.25 7.5 10.5 7.5s9.75-4 10.5-7.5C21.75 8.5 17.25 4.5 12 4.5zM12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 4.5C6.75 4.5 2.25 8.5 1.5 12c.75 3.5 5.25 7.5 10.5 7.5s9.75-4 10.5-7.5C21.75 8.5 17.25 4.5 12 4.5zM12 16.5a4.5 4.5 0 0 1 0-9" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg flex items-center justify-center"
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Don't have an account?
          <a
            href="/signup"
            className="text-blue-500 hover:text-blue-600 focus:outline-none focus:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
