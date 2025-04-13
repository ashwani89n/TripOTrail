import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { tripContext } from "../context/useTripDataContext";
import axios from "axios";
import Header from "../components/Header";
import destinationPin from "../images/destinationPin.png";
import tripJeep from "../images/TripJeep.png";
import UpcomingMytrip from "../components/UpcomingMytrip";
import ActiveMyTrip from "../components/ActiveMyTrip";
import PastMyTrip from "../components/PastMyTrip";
const TripDetails = () => {
  const [myTripsByIdData, setMyTripsByIdData] = useState({});
  const [error, setError] = useState("");
  const { token } = useContext(tripContext);
  const { tripId } = useParams();

  const getTripById = async () => {
    try {
      const response = await axios.get(`/api/trips/${tripId}`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQ0NTYxOTM5LCJleHAiOjE3NDQ1NjU1Mzl9.VIaZoLEJAi2USut7DCEFTI0_zB1rTY2_TQ55T8S29H8`,
        },
      });
      setMyTripsByIdData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Trips Loading Unsuccessful");
      console.log({ error });
    }
  };

  useEffect(() => {
    console.log("USE EFFECT");
    if (!tripId) return;

    getTripById();
  }, []);

  return (
    <div className="bg-darkBG min-h-screen flex flex-col">
      <Header />
      <div className="mt-10 text-white">
        <div className=" p-1 text-topHeader rounded-lg cursor-pointer text-center font-aldrich text-2xl">
          {myTripsByIdData.title && (
            <>
              <span className="text-white">
                {`${myTripsByIdData.title.split(" ")[0]}`}&nbsp;
              </span>
              <span>{myTripsByIdData.title.split(" ").slice(1).join(" ")}</span>
            </>
          )}
        </div>
        <div className="text-white font-inria flex flex-row mt-3 items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center">
            <img src={tripJeep} alt="" />
            <p className="text-[10px] font-inria">
              {myTripsByIdData.start_point}
            </p>
          </div>
          <div className="border-t-2 border-topHeader border-dashed w-[30%]" />
          <div className="flex flex-col items-center justify-center">
            <img src={destinationPin} alt="" />
            <p className="text-[10px] font-inria">
              {myTripsByIdData.destination}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10">
        {myTripsByIdData.runningStatus === "upcoming" ? (
          <UpcomingMytrip tripDetails={myTripsByIdData} />
        ) : myTripsByIdData.runningStatus === "active" ? (
          <ActiveMyTrip tripDetails={myTripsByIdData} />
        ) : (
          <PastMyTrip tripDetails={myTripsByIdData} />
        )}
      </div>
    </div>
  );
};

export default TripDetails;
