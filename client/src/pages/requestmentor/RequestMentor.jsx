import React, { useState } from "react";
import { Link } from "react-router-dom";

const RequestMentor = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    department: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // New state variable for loading

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    try {
      const response = await fetch(
        `${process.env.VITE_BACKEND_URL}/api/v1/user/request-mentor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setLoading(false); // Set loading to false when request completes
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-purple-100 p-6">
        <h2 className="text-3xl font-bold mb-6">Thank You!</h2>
        <p className="text-gray-600 mb-6">
          Your request has been submitted. We will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between bg-white shadow-md p-4">
        <div className="flex items-center space-x-4">
          <button className="text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link to="/">
            <img src="/images/Logo.svg" alt="Logo" />
          </Link>
        </div>
        <button className="bg-purple-500 text-white py-2 px-4 rounded-lg">
          Contact Us
        </button>
      </nav>
      <div className="flex flex-col md:flex-row flex-grow items-center justify-center bg-purple-100 p-6">
        <div className="flex flex-col bg-white rounded-lg shadow-lg p-8 m-4 w-full md:w-1/3">
          <h2 className="text-2xl font-bold mb-6 text-center">
            REQUEST A MENTOR
          </h2>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-bold">Name*</label>
              <input
                type="text"
                name="name"
                className="w-full p-2 border bg-white text-black border-gray-300 rounded"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold">Email*</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  className="w-full p-2 border bg-white text-black border-gray-300 rounded pr-10"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold">
                College you want mentor from*
              </label>
              <input
                type="text"
                name="college"
                className="w-full p-2 border bg-white text-black border-gray-300 rounded"
                placeholder="College"
                value={formData.college}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold">
                Department*
              </label>
              <input
                type="text"
                name="department"
                className="w-full p-2 border bg-white text-black border-gray-300 rounded"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold">Message</label>
              <textarea
                name="message"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Message"
                rows="3"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-purple-500 text-white rounded-lg flex items-center justify-center"
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
                "Request"
              )}
            </button>
          </form>
        </div>
        <div className="flex flex-col items-center justify-center w-full md:w-2/3 text-center p-4 md:p-10">
          <h2 className="text-3xl font-bold mb-2">Didn't Find Your Mentor?</h2>
          <p className="text-gray-600 mb-6">We are working on it.</p>
          <div className="w-full flex justify-center">
            <img
              src="/images/ladder request mentor pic.png"
              alt="No mentors found"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestMentor;
