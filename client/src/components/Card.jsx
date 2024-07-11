import React from "react";
import { Link } from "react-router-dom";

const Card = ({ image, name, CourseOfStream, Department, place, about }) => {
  return (
    <div className="flex flex-col p-4 gap-5 border border-gray-200 min-h-96 w-[20rem]  justify-center shadow-xl rounded-xl">
      <div className="flex flex-col justify-center  items-center">
        <div className="w-[8.5rem] h-[8.5rem] rounded-full flex justify-center items-center bg-[#8E69FF]">
          <div className="w-[8rem] h-[8rem] rounded-full :overflow-hidden bg-white p-1">
            <img
              src={image}
              className="object-cover w-full h-full rounded-full"
              alt="image"
            />
          </div>
        </div>
        <div className="text-xl flex flex-wrap">{name}</div>
        <div className="bg-[#a58af7] py-1 px-5 text-[1.1rem] rounded-2xl flex justify-center flex-wrap items-center text-[#EDEAFF]">
          {Department}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div>
            <b>I COME FROM</b>
          </div>
          <div>{place}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <b>MAJOR</b>
          </div>
          <div>{CourseOfStream}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <b>ABOUT</b>
          </div>
          <div>
            {about}
            <span>
              <Link to="/" className="text-blue-700 underline">
                readmore....
              </Link>
            </span>
          </div>
        </div>
      </div>
      <div className="">
        <div className="bg-[#8E69FF] p-3 flex flex-row gap-2 justify-center text-white items-center rounded-xl font-bold text-xl hover:cursor-pointer">
          <Link to="/chat"> Ask me a question</Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M12 3a9 9 0 0 0 0 18h4.5c1.398 0 2.097 0 2.648-.228a3 3 0 0 0 1.624-1.624C21 18.597 21 17.898 21 16.5V12a9 9 0 0 0-9-9m-4 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m3 4a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Card;
