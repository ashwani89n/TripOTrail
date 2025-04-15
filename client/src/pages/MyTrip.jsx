<<<<<<< HEAD
import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import MytripsHero from "../images/MytripsHero.png";
import { FaHandLizard, FaSearch } from "react-icons/fa";
=======
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import MytripsHero from "../images/MytripsHero.jpeg";
import { FaSearch } from "react-icons/fa";
>>>>>>> origin/main
import axios from "axios";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import tempTripImage from "../images/tempTripImage.png";
import TripJeep from "../images/TripJeep.png";
import destinationPin from "../images/destinationPin.png";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import BudgetCharts from "../components/BudgetCharts";
<<<<<<< HEAD
import searchIcon from "../images/Search.png";
import TripCard from "../components/TripCard";
import { tripContext } from "../context/useTripDataContext";
import { useNavigate } from "react-router";

ChartJS.register(ArcElement, Tooltip, Legend);
const MyTrip = () => {
  const navigate = useNavigate();
  const {token} = useContext(tripContext)
=======
ChartJS.register(ArcElement, Tooltip, Legend);
const MyTrip = () => {
>>>>>>> origin/main
  const [myTrips, setMyTrips] = useState([]);
  const [error, setError] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const [pastIndex, setPastIndex] = useState(0);

  dayjs.extend(weekday);
  dayjs.extend(localizedFormat);
  dayjs.extend(advancedFormat);
<<<<<<< HEAD
  console.log("token:", token);
=======
>>>>>>> origin/main

  const formatDate = (isoDate) => {
    return dayjs(isoDate).format("DD MMMM, YYYY | dddd");
  };

<<<<<<< HEAD
  const handleCardClick =(tripId) =>{
    console.log(tripId);
    navigate(`/myTrip/${tripId}`)
  }

=======
>>>>>>> origin/main
  const getTripsData = async () => {
    try {
      const response = await axios.get(`/api/trips`, {
        headers: {
          Authorization:
<<<<<<< HEAD
            // `Bearer ${token}`,
            ` Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ0NjkwODE3LCJleHAiOjE3NDQ2OTQ0MTd9.kwfKh_9FGZaqJUvAG8rRFTRBzYIenae7XA6baWPSpCA`,
=======
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQzOTYyNTMxLCJleHAiOjE3NDM5NjYxMzF9.QiH67NPIIj07l4vRNEjGHNCgHX1YiAhuOqxBnpF5T9A",
>>>>>>> origin/main
        },
      });
      console.log(response.data);
      setMyTrips(response.data);
    } catch (error) {
<<<<<<< HEAD
      setError(error.response?.data?.message || "Trips Loading Unsuccessful");
=======
      if (
        error.response &&
        error.response.data.message === "Email already exists"
      ) {
        setError("Email already exists");
      } else {
        setError(error.response?.data?.message || "Registration failed");
      }
>>>>>>> origin/main
    }
  };

  useEffect(() => {
    getTripsData();
  }, []);
<<<<<<< HEAD
  const activeTrips = myTrips.filter((trips) => trips.runningStatus === "active");
  const upcomingTrips = myTrips.filter((trips) => trips.runningStatus === "upcoming");
  const pastTrips = myTrips.filter((trips) => trips.runningStatus === "past");
=======
  const activeTrips = myTrips.filter((trips) => trips.status === "active");
  const upcomingTrips = myTrips.filter((trips) => trips.status === "upcoming");
  const pastTrips = myTrips.filter((trips) => trips.status === "past");
>>>>>>> origin/main

  console.log({ activeTrips, upcomingTrips, pastTrips });

  return (
<<<<<<< HEAD
    <div className="bg-darkBG min-h-screen relative ">
    <Header />
  
    {/* Hero Section */}
    <div className="h-[65vh] w-full relative">
      <div className="absolute inset-0 bg-[url(images/MytripsHero.png)] bg-no-repeat bg-cover bg-top z-0"></div>
    </div>
  
    {/* Main Content, overlapping the hero */}
    <div className="relative -mt-[48vh] w-full z-10 pb-10">
      <div className="flex justify-end mr-[20%] mb-20">
        <h3 className="font-aboreto text-4xl gap-5 text-white flex items-center">
          Explore{" "}
          <span className="font-kaushan text-topHeader">Hidden Gems</span>
        </h3>
      </div>
  
      <div className="flex items-center justify-start gap-2 bg-myTripSearchBGLite w-[30%] mx-auto px-1 py-1 mb-5 rounded-lg text-black font-semibold">
        <img src={searchIcon} className="w-6" />
        <input type="text" value="Search" className="text-textCardDarker bg-transparent" />
      </div>
  
      <div className="flex flex-col md:flex-row justify-between items-center p-6">
        <TripCard
          type="Upcoming"
          totalTrips={upcomingTrips.length}
          trip={upcomingTrips[upcomingIndex]}
          onNextClick={() => setUpcomingIndex((prev) =>  Math.min(prev + 1, upcomingTrips.length - 1))}
          onPrevClick={() => setUpcomingIndex((prev) => Math.max(prev - 1, 0))}
          showBudgetVsExpense={true}
          onClick={() =>handleCardClick(upcomingTrips[upcomingIndex].trip_id)}
        />
  
        <TripCard
          type="Active"
          totalTrips={activeTrips.length}
          trip={activeTrips[activeIndex]}
          onNextClick={() => setActiveIndex((prev) =>  Math.min(prev + 1, activeTrips.length - 1))}
          onPrevClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
          showBudgetVsExpense={false}
          onClick={() =>handleCardClick(activeTrips[activeIndex].trip_id)}
        />
  
        <TripCard
          type="Past"
          totalTrips={pastTrips.length}
          trip={pastTrips[pastIndex]}
          onNextClick={() => setPastIndex((prev) =>  Math.min(prev + 1, pastTrips.length - 1))}
          onPrevClick={() => setPastIndex((prev) => Math.max(prev - 1, 0))}
          showBudgetVsExpense={false}
          onClick={() =>handleCardClick(pastTrips[pastIndex].trip_id)}

        />
      </div>
    </div>
  </div>
  
=======
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
              <div className="w-[380px] h-[fit] bg-darkBG">
                <div className="bg-topHeader h-[38px] text-xl w-[80%] mx-auto relative top-[-5%] text-center text-white font-inria font-semibold flex items-center justify-center">
                  Active
                </div>
                <div className="text-white font-aldrich mb-2">
                  {formatDate(activeTrips[activeIndex].start_date)}
                </div>

                <div className="flex flex-row mx-5 gap-5">
                  <img
                    src={tempTripImage}
                    alt=""
                    className="w-[170px] h-[100%]"
                  />
                  <div className="text-topHeader flex flex-col w-full">
                    <h3>{activeTrips[activeIndex].title}</h3>
                    <div className="flex flex-row justify-evenly gap-2 items-center  ">
                      <div>
                        <img src={TripJeep} />
                        <h3 className=" text-white text-[6px]">
                          {activeTrips[activeIndex].start_point}
                        </h3>
                      </div>

                      <div className="border-t-2 border-topHeader border-dashed w-[90%]"></div>
                      <div>
                        <img src={destinationPin} />
                        <h3 className=" text-white text-[6px]">{activeTrips[activeIndex].destination}</h3>
                      </div>
                    </div>
                    <div className="flex flex-row justify-between gap-2 items-center"></div>
                    <div className="flex flex-row mt-3">
                      <div>
                        <h3 className="font-aldrich text-center">Budget</h3>
                        <div>
                          <BudgetCharts
                            budget={activeTrips[activeIndex].budget}
                            expense={activeTrips[activeIndex].expense}
                          />
                        </div>
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
              <div className="w-[380px] h-[fit] bg-darkBG">
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
                    <div className="flex flex-row justify-evenly gap-2 items-center  ">
                      <div>
                        <img src={TripJeep} />
                        <h3 className=" text-white text-[6px]">
                          {activeTrips[activeIndex].start_point}
                        </h3>
                      </div>

                      <div className="border-t-2 border-topHeader border-dashed w-[90%]"></div>
                      <div>
                        <img src={destinationPin} />
                        <h3 className=" text-white text-[6px]">{activeTrips[activeIndex].destination}</h3>
                      </div>
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
                    <div className="flex flex-row justify-evenly gap-2 items-center  ">
                      <div>
                        <img src={TripJeep} />
                        <h3 className=" text-white text-[6px]">
                          {activeTrips[activeIndex].start_point}
                        </h3>
                      </div>

                      <div className="border-t-2 border-topHeader border-dashed w-[90%]"></div>
                      <div>
                        <img src={destinationPin} />
                        <h3 className=" text-white text-[6px]">{activeTrips[activeIndex].destination}</h3>
                      </div>
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
>>>>>>> origin/main
  );
};

export default MyTrip;
