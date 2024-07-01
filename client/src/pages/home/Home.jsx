import React from "react";
import Card from "../../components/Card";
import CollegeCard from "../../components/CollegeCard";

const Home = () => {
  return (
    <div className="flex flex-col">
      <div className="flex w-[100vw] p-4 overflow-x-scroll no-scrollbar">
        <div className="flex gap-5">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
      <div className="flex w-[100vw] p-4 overflow-x-scroll no-scrollbar">
        <div className="flex gap-10">
          <CollegeCard />
          <CollegeCard />
          <CollegeCard />
          <CollegeCard />
          <CollegeCard />
        </div>
      </div>
    </div>
  );
};

export default Home;
