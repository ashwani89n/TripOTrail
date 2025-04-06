import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import MytripsHero from "../images/MytripsHero.jpeg";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import tempTripImage from "../images/tempTripImage.png";
import TripJeep from "../images/TripJeep.png";
import destinationPin from "../images/destinationPin.png";

const MyTrip = () => {
  const [myTrips, setMyTrips] = useState([]);
  const [error, setError] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const [pastIndex, setPastIndex] = useState(0);

  dayjs.extend(weekday);
  dayjs.extend(localizedFormat);
  dayjs.extend(advancedFormat);

  const formatDate = (isoDate) => {
    return dayjs(isoDate).format("DD MMMM, YYYY | dddd");
  };

  const getTripsData = async () => {
    try {
      const response = await axios.get(`/api/trips`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQzOTU3OTg4LCJleHAiOjE3NDM5NjE1ODh9.HikGzXf3-ly5-5Wdz981IqJonhpudrW9glpJLfcQKRo",
        },
      });
      console.log(response.data);
      setMyTrips(response.data);
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "Email already exists"
      ) {
        setError("Email already exists");
      } else {
        setError(error.response?.data?.message || "Registration failed");
      }
    }
  };

  useEffect(() => {
    getTripsData();
  }, []);
  const activeTrips = myTrips.filter((trips) => trips.status === "active");
  const upcomingTrips = myTrips.filter((trips) => trips.status === "upcoming");
  const pastTrips = myTrips.filter((trips) => trips.status === "past");

  console.log({ activeTrips, upcomingTrips, pastTrips });

  return (
    <div className="bg-darkBG min-h-screen flex flex-col">
      <div>
        <Header />
        <div className=" text-center min-h-screen p-2 w-[100%] h-[65%] mb-12 bg-[url(images/MytripsHero.jpeg)] bg-no-repeat bg-cover">
          <div className=" h-[300px] items-end flex justify-end mr-24 mb-24">
            <h3 className="font-aboreto flex items-center text-white text-5xl gap-5">
              Explore{" "}
              <span className="font-kaushan text-topHeader">Hidden Gems</span>
            </h3>
          </div>
          <div className="flex items-center justify-start gap-2 mt-10 bg-myTripSearchBG w-[30%] mx-auto px-5 py-1 rounded-lg text-black font-semibold">
            <FaSearch />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent"
            />
          </div>

          <div className="flex mt-24 flex-row gap-10 justify-evenly">
            {activeTrips[activeIndex] && (
              <div className="w-[380px] h-[330px] bg-darkBG">
                <div className="bg-topHeader h-[38px] text-xl w-[80%] mx-auto relative top-[-5%] text-center text-white font-inria font-semibold flex items-center justify-center">
                  Active
                </div>
                <div className="text-white font-aldrich">
                  {formatDate(activeTrips[activeIndex].start_date)}
                </div>

                <div className="flex flex-row mx-5 gap-5">
                  <img
                    src={tempTripImage}
                    alt=""
                    className="w-[170px] h-[220px]"
                  />
                  <div className="text-topHeader flex flex-col w-full">
                    <h3>{activeTrips[activeIndex].title}</h3>
                    <div className="flex flex-row justify-evenly gap-2 items-center ">
                      <img src={TripJeep} />
                      <div className="border-t-2 border-topHeader border-dashed w-[90%]"></div>
                      <img src={destinationPin} />
                    </div>
                    <div className="flex flex-row justify-between gap-2 items-center text-white text-[6px]">
                      <h3>{activeTrips[activeIndex].start_point}</h3>
                      <h3>{activeTrips[activeIndex].destination}</h3>
                    </div>
                    <div className="flex flex-row mt-3">
                      <div>
                        <h3 className="font-aldrich text-center">Budget</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="text-white"
                  onClick={() => {
                    if (activeTrips.length - 1 !== activeIndex)
                      setActiveIndex((prev) => prev + 1);
                  }}
                >
                  next
                </button>
              </div>
            )}
            {upcomingTrips[upcomingIndex] && (
              <div className="w-[380px] h-[330px] bg-darkBG">
                <div className="bg-topHeader h-[38px] text-xl w-[80%] mx-auto relative top-[-5%] text-center text-white font-inria font-semibold flex items-center justify-center">
                  Upcoming
                </div>
                <div className="text-white font-aldrich">
                  {formatDate(upcomingTrips[upcomingIndex].start_date)}
                </div>

                <div className="flex flex-row mx-5 gap-5">
                  <img
                    src={tempTripImage}
                    alt=""
                    className="w-[170px] h-[220px]"
                  />
                  <div className="text-topHeader flex flex-col w-full">
                    <h3>
                      {upcomingTrips[upcomingIndex].title} {upcomingIndex}
                    </h3>
                    <div className="flex flex-row justify-evenly gap-2 items-center ">
                      <img src={TripJeep} />
                      <div className="border-t-2 border-topHeader border-dashed w-[90%]"></div>
                      <img src={destinationPin} />
                    </div>
                    <div className="flex flex-row justify-between gap-2 items-center text-white text-[6px]">
                      <h3>{upcomingTrips[upcomingIndex].start_point}</h3>
                      <h3>{upcomingTrips[upcomingIndex].destination}</h3>
                    </div>
                    <div className="flex flex-row mt-3">
                      <div>
                        <h3 className="font-aldrich text-center">Budget</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="text-white"
                  onClick={() => {
                    if (upcomingTrips.length - 1 !== upcomingIndex)
                      setUpcomingIndex((prev) => prev + 1);
                  }}
                >
                  next
                </button>
              </div>
            )}
            {pastTrips[pastIndex] && (
              <div className="w-[380px] h-[330px] bg-darkBG">
                <div className="bg-topHeader h-[38px] text-xl w-[80%] mx-auto relative top-[-5%] text-center text-white font-inria font-semibold flex items-center justify-center">
                  Past
                </div>
                <div className="text-white font-aldrich">
                  {formatDate(pastTrips[pastIndex].start_date)}
                </div>

                <div className="flex flex-row mx-5 gap-5">
                  <img
                    src={tempTripImage}
                    alt=""
                    className="w-[170px] h-[220px]"
                  />
                  <div className="text-topHeader flex flex-col w-full">
                    <h3>
                      {pastTrips[pastIndex].title} {upcomingIndex}
                    </h3>
                    <div className="flex flex-row justify-evenly gap-2 items-center ">
                      <img src={TripJeep} />
                      <div className="border-t-2 border-topHeader border-dashed w-[90%]"></div>
                      <img src={destinationPin} />
                    </div>
                    <div className="flex flex-row justify-between gap-2 items-center text-white text-[6px]">
                      <h3>{pastTrips[pastIndex].start_point}</h3>
                      <h3>{pastTrips[pastIndex].destination}</h3>
                    </div>
                    <div className="flex flex-row mt-3">
                      <div>
                        <h3 className="font-aldrich text-center">Budget</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="text-white"
                  onClick={() => {
                    if (pastTrips.length - 1 !== pastIndex)
                      setPastIndex((prev) => prev + 1);
                  }}
                >
                  next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTrip;
