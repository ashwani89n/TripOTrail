import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import MytripsHero from "../images/MytripsHero.png";
import { FaSearch } from "react-icons/fa";
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
import searchIcon from "../images/Search.png";
import TripCard from "../components/TripCard";

ChartJS.register(ArcElement, Tooltip, Legend);
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
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ0NDM4OTg3LCJleHAiOjE3NDQ0NDI1ODd9.PcYFX91tPDfeX767jR9VrDcPUSEUqiFBltT8B_hFjhg",
        },
      });
      console.log(response.data);
      setMyTrips(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Trips Loading Unsuccessful");
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
  
      <div className="flex flex-row justify-evenly">
        <TripCard
          type="Upcoming"
          trip={upcomingTrips[upcomingIndex]}
          onNextClick={() => setUpcomingIndex(prev => prev + 1)}
          showCountdown={true}
        />
  
        <TripCard
          type="Active"
          trip={activeTrips[activeIndex]}
          onNextClick={() => setActiveIndex(prev => prev + 1)}
          showCountdown={false}
        />
  
        <TripCard
          type="Past"
          trip={pastTrips[pastIndex]}
          onNextClick={() => setPastIndex(prev => prev + 1)}
          showCountdown={false}
        />
      </div>
    </div>
  </div>
  
  );
};

export default MyTrip;
