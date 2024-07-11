import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import CollegeCard from "../../components/CollegeCard";
import Navbar from "../../components/Navbar";
import Typewriter from "typewriter-effect";

const Home = () => {
  const [mentorpage, setMentorPage] = useState(0);
  const [mentorlimit, setMentorLimit] = useState(5);
  const [collegepage, setCollegePage] = useState(0);
  const [collegelimit, setCollegeLimit] = useState(5);
  const [mentors, setMentors] = useState([]);
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://uniconn-chat-app-repo-dw8d5g67b-kalkeshwars-projects.vercel.app/user?page=${mentorpage}&limit=${mentorlimit}`
        );
        const data = await res.json();
        setMentors(data.users);
      } catch (er) {
        console.log(er);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://uniconn-chat-app-repo-dw8d5g67b-kalkeshwars-projects.vercel.app/colleges?page=${collegepage}&limit=${collegelimit}`
        );
        const data = await res.json();
        setColleges(data.colleges);
      } catch (er) {
        console.log(er);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col gap-3 no-scrollbar scroll-smooth">
      <Navbar />
      <div className="relative flex h-screen justify-center items-center -mt-3 bg-cover bg-center">
        <img
          src="https://as1.ftcdn.net/v2/jpg/04/34/08/56/1000_F_434085662_Pd3yWP81H8d7kGW5Z1J3SfSfvMgGsth7.jpg"
          alt="background"
          className=" inset-0 w-full h-full object-cover opacity-[1]"
        />
        <div className="absolute z-10 text-7xl top-[10rem] font-bold text-center text-white">
          <Typewriter
            options={{ loop: true }}
            onInit={(typewriter) => {
              typewriter
                .typeString("Connecting Students...")
                .pauseFor(1000)
                .deleteAll()
                .typeString("Welcomes You")
                .start();
            }}
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between p-2">
          <div className="flex text-black text-3xl font-bold">
            Talk to our Community
          </div>
          <div className="flex underline text-black text-2xl">See all</div>
        </div>
        <div className="flex w-full p-4 overflow-x-scroll no-scrollbar">
          <div className="flex gap-5">
            {mentors.map((mentor) => (
              <Card
                image={mentor.profilePic}
                name={mentor.name}
                CourseOfStream={mentor.CourseofStream}
                Department={mentor.Department}
                place={mentor.place}
                about={mentor.about.substring(0, 100)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-row justify-between p-2">
          <div className="flex text-black text-3xl font-bold">
            Explore Colleges
          </div>
          <div className="flex underline text-black text-2xl">See all</div>
        </div>
        <div className="flex w-full p-4 overflow-x-scroll no-scrollbar">
          <div className="flex gap-10">
            {colleges.map((college) => (
              <CollegeCard
                name={college.name}
                place={college.place}
                image={college.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
