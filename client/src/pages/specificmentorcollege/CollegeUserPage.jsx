import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "../../components/Card";
import Navbar from "../../components/Navbar";
import NoCollegeFound from "../../components/NoCollegeFound";
import { courseAndDepartments } from "../../data/courseData";

const CollegeUserPage = () => {
  const [page, setPage] = useState(0);
  const [mentors, setMentors] = useState([]);
  const [limit, setLimit] = useState(3);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { name: searchParam } = useParams();
  const [place, setPlace] = useState("");
  const [course, setCourse] = useState("");
  const [department, setDepartment] = useState("");
  const [places, setPlaces] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const resPlaces = await fetch(
          `${process.env.VITE_BACKEND_URL}/api/v1/colleges/places/:id`
        );
        const placesData = await resPlaces.json();
        setPlaces(placesData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.VITE_BACKEND_URL}/api/v1/user/get/${searchParam}?page=${page}&limit=${limit}&place=${place}&course=${course}&department=${department}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.status === 404) {
          // toast.error(data.message);
          setMentors([]);
          setTotal(0);
        } else {
          setMentors(data?.data);
          setTotal(data.totalCount); // Ensure this is correctly set
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [page, limit, searchParam, place, course, department]);

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage((prevPage) =>
      (prevPage + 1) * limit < total ? prevPage + 1 : prevPage
    );
  };

  const showPagination = mentors.length > 0;

  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value;
    setCourse(selectedCourse);
    setDepartment(""); // Reset department when course changes
  };

  const availableDepartments = course ? courseAndDepartments[course] : [];

  return (
    <div className="flex flex-col w-full bg-white no-scrollbar">
      <Navbar />
      <div className="flex flex-col md:flex-row gap-4 py-4 md:py-8 px-4 md:px-10 w-full">
        <select
          value={course}
          onChange={handleCourseChange}
          className="border p-2 rounded-full w-full md:w-auto"
        >
          <option value="">Select Course</option>
          {Object.keys(courseAndDepartments).map((courseOption) => (
            <option key={courseOption} value={courseOption}>
              {courseOption}
            </option>
          ))}
        </select>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border p-2 rounded-full w-full md:w-auto"
          disabled={!course}
        >
          <option value="">Select Department</option>
          {availableDepartments.map((departmentOption) => (
            <option key={departmentOption} value={departmentOption}>
              {departmentOption}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col p-4 bg-white">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="skeleton h-16 w-16 rounded-full"></div>
            <div className="flex flex-col gap-4">
              <div className="skeleton h-4 w-20"></div>
              <div className="skeleton h-4 w-28"></div>
            </div>
            <div className="skeleton h-32 w-full"></div>
          </div>
        ) : mentors.length === 0 ? (
          <NoCollegeFound />
        ) : (
          <div className="flex flex-wrap gap-10 justify-center items-center">
            {mentors.map((mentor) => (
              <Card
                key={mentor._id}
                image={mentor.profilePic}
                name={mentor.name}
                CourseOfStream={mentor.CourseofStream}
                Department={mentor.Department}
                place={mentor.place}
                about={mentor.about.substring(0, 100)}
                mentorId={mentor._id}
              />
            ))}
          </div>
        )}
        {mentors == [] && (
          <div className="flex flex-row justify-between p-10 w-full">
            <button
              className={`p-3 text-black border ${
                page === 0
                  ? "bg-red-100 border-red-500 cursor-not-allowed"
                  : "bg-gray-100 border-gray-200"
              }`}
              onClick={handlePrevPage}
              disabled={page === 0}
            >
              Prev
            </button>
            <button
              className={`p-3 text-black border ${
                (page + 1) * limit >= total
                  ? "bg-red-100 border-red-500 cursor-not-allowed"
                  : "bg-gray-100 border-gray-200"
              }`}
              onClick={handleNextPage}
              disabled={(page + 1) * limit >= total}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeUserPage;
