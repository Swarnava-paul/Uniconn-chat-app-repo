import React from "react";

const CollegeCard = () => {
  return (
    <div className="flex flex-col w-[20em] h-[18em] p-2 justify-center items-center rounded-md  border border-gray-200 shadow-md transition ease-in-out hover:scale-110 hover:z-40 cursor-pointer">
      <div className="w-[99%] h-[80%] overflow-hidden contain-layout">
        <img
          src="https://cdn.pixabay.com/photo/2017/09/01/13/56/university-2704306_640.jpg"
          alt="college image card"
        />
      </div>
      <div className="flex flex-col gap-1 w-[100%]">
        <div className="flex flex-wrap font-bold font-sans items-center  justify-start text-xl text-black">
          University of Cambridge
        </div>
        <div className="flex flex-wrap font-bold text-gray-600 text-xs ">
          Mumbai
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;
