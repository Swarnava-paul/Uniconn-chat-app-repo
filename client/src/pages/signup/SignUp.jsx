import React, { useState } from "react";
import { Link } from "react-router-dom";
import { courseAndDepartments } from "../../data/courseData";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    place: "",
    password: "",
    about: "",
    college: "",
    CourseOfStream: "",
    Department: "",
    profilePic: null,
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    place: "",
    password: "",
    about: "",
    college: "",
    CourseOfStream: "",
    Department: "",
    profilePic: "",
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      const validImageTypes = ["image/jpeg", "image/png"];
      if (validImageTypes.includes(fileType)) {
        setFormData({ ...formData, profilePic: file });
        setFormErrors({ ...formErrors, profilePic: "" });
      } else {
        setFormErrors({
          ...formErrors,
          profilePic: "Please select a valid image file (JPG or PNG)",
        });
      }
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const validatePhoneNumber = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };

  const validateForm = () => {
    let valid = true;
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      valid = false;
    }

    if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
      valid = false;
    }

    if (!validatePhoneNumber(formData.phone)) {
      errors.phone = "Please enter a valid phone number (10 digits)";
      valid = false;
    }

    if (!validatePassword(formData.password)) {
      errors.password =
        "Password must be alphanumeric and includes special char";
      valid = false;
    }
    if (!formData.place.trim()) {
      errors.place = "Place is required";
      valid = false;
    }

    if (!formData.about.trim()) {
      errors.about = "About is required";
      valid = false;
    }

    if (!formData.college.trim()) {
      errors.college = "College is required";
      valid = false;
    }

    if (!formData.CourseOfStream.trim()) {
      errors.CourseOfStream = "Course of Stream is required";
      valid = false;
    }

    if (!formData.Department.trim()) {
      errors.Department = "Department is required";
      valid = false;
    }

    if (formData.profilePic) {
      const fileType = formData.profilePic.type;
      const validImageTypes = ["image/jpeg", "image/png"];
      if (!validImageTypes.includes(fileType)) {
        errors.profilePic = "Please select a valid image file (JPG or PNG)";
        valid = false;
      }
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true); // Set loading to true when form submission starts
      try {
        let imageUrl = "";
        if (formData.profilePic) {
          const formDataImage = new FormData();
          formDataImage.append("file", formData.profilePic);
          formDataImage.append("upload_preset", `${process.env.VITE_NAME}`);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formDataImage,
            }
          );

          const data = await response.json();
          if (!data.secure_url) {
            console.log("Failed to load image");
            return;
          }
          imageUrl = data.secure_url;
        }

        const submissionData = {
          ...formData,
          profilePic: imageUrl,
        };

        // Handle form submission logic here, e.g., send the data to your server
        const response = await fetch(
          "http://localhost:3000/api/v1/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(submissionData),
          }
        );
        const resdata = await response.json();
        console.log("responsedata:", resdata);
        if (response.status == 200) {
          // Reset form after submission (if needed)
          setFormData({
            name: "",
            email: "",
            phone: "",
            place: "",
            password: "",
            about: "",
            college: "",
            CourseOfStream: "",
            Department: "",
            profilePic: null,
          });
          setFormErrors({
            name: "",
            email: "",
            phone: "",
            place: "",
            password: "",
            about: "",
            college: "",
            CourseOfStream: "",
            Department: "",
            profilePic: "",
          });
          toast.success(resdata?.message, {
            duration: 4000,
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsLoading(false); // Set loading to false when form submission ends
      }
    } else {
      console.log("Form validation failed.");
    }
  };

  return (
    <div className="w-full bg-slate-500 p-5 h-full">
      <div className="signup-container mx-auto max-w-md px-6 py-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.name ? "border-red-500" : ""
              }`}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs italic">{formErrors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.email ? "border-red-500" : ""
              }`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs italic">{formErrors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Place
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.place ? "border-red-500" : ""
              }`}
              type="text"
              name="place"
              value={formData.place}
              onChange={handleChange}
            />
            {formErrors.place && (
              <p className="text-red-500 text-xs italic">{formErrors.place}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.phone ? "border-red-500" : ""
              }`}
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {formErrors.phone && (
              <p className="text-red-500 text-xs italic">{formErrors.phone}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.password ? "border-red-500" : ""
              }`}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs italic">
                {formErrors.password}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              About
            </label>
            <textarea
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.about ? "border-red-500" : ""
              }`}
              name="about"
              value={formData.about}
              onChange={handleChange}
            />
            {formErrors.about && (
              <p className="text-red-500 text-xs italic">{formErrors.about}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              College
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.college ? "border-red-500" : ""
              }`}
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
            />
            {formErrors.college && (
              <p className="text-red-500 text-xs italic">
                {formErrors.college}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Course/Stream
            </label>
            <select
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.CourseOfStream ? "border-red-500" : ""
              }`}
              name="CourseOfStream"
              value={formData.CourseOfStream}
              onChange={handleChange}
            >
              <option value="">Select Course/Stream</option>
              {Object.keys(courseAndDepartments).map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
            {formErrors.CourseOfStream && (
              <p className="text-red-500 text-xs italic">
                {formErrors.CourseOfStream}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Department
            </label>
            <select
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.Department ? "border-red-500" : ""
              }`}
              name="Department"
              value={formData.Department}
              onChange={handleChange}
            >
              <option value="">Select Department(select course first)</option>
              {formData.CourseOfStream &&
                courseAndDepartments[formData.CourseOfStream].map(
                  (department, index) => (
                    <option key={index} value={department}>
                      {department}
                    </option>
                  )
                )}
            </select>
            {formErrors.Department && (
              <p className="text-red-500 text-xs italic">
                {formErrors.Department}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Profile Picture
            </label>
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
              accept=".jpg, .jpeg, .png"
              id="profilePic"
            />
            <div className="flex items-center justify-center">
              <label
                htmlFor="profilePic"
                className={`cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  formErrors.profilePic ? "border-red-500" : ""
                }`}
              >
                Upload
              </label>
              <span className="ml-2">
                {formData.profilePic ? formData.profilePic.name : ""}
              </span>
            </div>
            {formErrors.profilePic && (
              <p className="text-red-500 text-xs italic">
                {formErrors.profilePic}
              </p>
            )}
          </div>
          <div className="mb-6 text-center">
            <button
              className={`w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Sign Up"}
            </button>
          </div>
        </form>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;