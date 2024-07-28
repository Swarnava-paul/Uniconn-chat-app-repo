import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "../../components/Card";
import toast from "react-hot-toast";

const CollegeUserPage = () => {
  const [page, setPage] = useState(0);
  const [mentors, setMentors] = useState([]);
  const [limit, setLimit] = useState(3);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { name: searchParam } = useParams();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.VITE_BACKEND_URL}/api/v1/user/get/${searchParam}?page=${page}&limit=${limit}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.status == 404) {
          toast.error(data.message);
        }
        setLoading(false);
        setMentors(data?.data);
        setTotal(data.totalCount); // ensure this is correctly set
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };

    fetchMentors();
  }, [page, limit, searchParam]); // added searchParam to dependencies

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage((prevPage) =>
      (prevPage + 1) * limit < total ? prevPage + 1 : prevPage
    );
  };

  return (
    <div className="flex flex-col">
      <h1>All Mentors</h1>
      {loading ? (
        <div className="flex w-52 flex-col gap-4">
          <div className="flex flex-col items-center gap-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
            <div className="flex flex-col gap-4">
              <div className="skeleton h-4 w-20"></div>
              <div className="skeleton h-4 w-28"></div>
            </div>
          </div>
          <div className="skeleton h-32 w-full"></div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-10 justify-center items-center">
          {mentors.map((mentor) => (
            <Card
              key={mentor._id} // add a key to each Card component
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
      <div className="flex flex-row justify-between p-10">
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
    </div>
  );
};

export default CollegeUserPage;