import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import destinationPin from "../images/destinationPin.png";
import tripJeep from "../images/TripJeep.png";
import UpcomingMytrip from "../components/UpcomingMytrip";
import ActiveMyTrip from "../components/ActiveMyTrip";
import PastMyTrip from "../components/PastMyTrip";
import attch from "../images/Attach.png";
import endTrip from "../images/Remove.png";
import addStop from "../images/Address.png";
import sendEmail from "../images/SendEmail.png";
import splitMoney from "../images/SplitMoney.png";
import api from "../api/api";
import { CiUser } from "react-icons/ci";
import EmailPrompt from "../components/EmailPrompt";
import DeleteTrip from "../components/DeleteTrip";

const TripDetails = () => {
  const [myTripsByIdData, setMyTripsByIdData] = useState({});
  const { tripId } = useParams();
  const [showSplitPrompt, setShowSplitPrompt] = useState(true);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [showAttachPrompt, setShowAttachPrompt] = useState(false);
  const [emailBody, setEmailBody] = useState([]);

  const getTripById = async () => {
    try {
      const response = await api.get(`/trips/${tripId}`);
      setMyTripsByIdData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Trips Loading Unsuccessful");
      console.log({ error });
    }
  };

  useEffect(() => {
    if (!tripId) return;
    getTripById();
  }, []);

  return (
    <div className="bg-darkBG min-h-screen flex flex-col">
      <Header />
      <div className="mt-10 text-white">
        <div className=" p-1 text-topHeader rounded-lg cursor-pointer text-center font-aldrich text-2xl">
          <div className="flex flex-row justify-between items-center w-full px-10">
            <div className="flex flex-row items-center justify-center mx-auto pl-20 text-center">
              {myTripsByIdData.title && (
                <div className="flex items-center justify-center text-2xl font-aldrich text-topHeader">
                  <span className="text-white mr-1">
                    {myTripsByIdData.title.split(" ")[0]}
                  </span>
                  <span>
                    {myTripsByIdData.title.split(" ").slice(1).join(" ")}
                  </span>
                </div>
              )}
              &nbsp;
              <div className="flex items-center justify-center">
                {myTripsByIdData.team_members
                  ?.slice(0, 3)
                  .map((mate, index) => (
                    <div
                      key={index}
                      className={`relative w-8 h-8 rounded-full bg-textCardDark border border-textCard flex items-center justify-center text-sm text-white ${
                        index !== 0 ? "-ml-3" : ""
                      }`}
                      style={{ zIndex: 10 + index }}
                    >
                      {mate.profile_picture ? (
                        <img
                          src={`http://localhost:5000${mate.profile_picture}`}
                          alt={`Tripmate ${index + 1}`}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center rounded-full bg-textInputBG">
                          <CiUser className="text-white w-full h-full p-2" />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Right Action Icons */}
            <div className="flex flex-row gap-2">
              <button
                onClick={() => {setShowSplitPrompt(true);setShowAttachPrompt(false)}}
                className= "bg-topHeader rounded-sm w-7 h-7 p-1"
              >
                <img src={splitMoney} className="w-full h-full" />
              </button>
              <button
                onClick={() => {setShowAttachPrompt(true);setShowSplitPrompt(true)}}
                className="bg-topHeader rounded-sm w-7 h-7 p-1"
              >
                <img src={attch} className="w-full h-full" />
              </button>
              <button
                onClick={() => setShowEmailPrompt(true)}
                className="bg-topHeader rounded-sm w-7 h-7 p-1"
              >
                <img src={addStop} className="w-full h-full" />
              </button>
              <button
                onClick={() => setShowDeletePrompt(true)}
                className="bg-topHeader rounded-sm w-7 h-7 p-1"
              >
                <img src={endTrip} className="w-full h-full" />
              </button>

              <button
                onClick={() => setShowEmailPrompt(true)}
                className="bg-topHeader rounded-sm w-7 h-7 p-1"
              >
                <img src={sendEmail} className="w-full h-full" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full mt-8">
          {/* Icons and dashed line */}
          <div className="flex flex-row items-center justify-center gap-4 w-[40%]">
            <div className="flex flex-col items-center justify-center pl-20">
              <img src={tripJeep} alt="" className="w-6 h-6" />
            </div>

            <div className="flex-1 border-t border-dashed border-topHeader h-0" />

            <div className="flex flex-col items-center justify-center">
              <img src={destinationPin} alt="" className="w-5 h-5 mr-20" />
            </div>
          </div>

          {/* Text under icons */}
          <div className="flex flex-row justify-between w-[40%] mt-2 text-white font-inria">
            <p className="text-left w-1/2 text-md ">
              {myTripsByIdData.start_point}
            </p>
            <p className="text-right w-1/2 text-md ">
              {myTripsByIdData.destination}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10 p-4">
        {myTripsByIdData.runningStatus === "upcoming" ? (
          <UpcomingMytrip
            tripDetails={myTripsByIdData}
            onClickEmail={setEmailBody}
            showSplitPrompt={showSplitPrompt}
            showAttachPrompt={showAttachPrompt}
          />
        ) : myTripsByIdData.runningStatus === "active" ? (
          <ActiveMyTrip tripDetails={myTripsByIdData} />
        ) : (
          <PastMyTrip tripDetails={myTripsByIdData} />
        )}
      </div>
      {showEmailPrompt && <EmailPrompt showPrompt={setShowEmailPrompt} data={myTripsByIdData} body={emailBody}/>}
      {showDeletePrompt && <DeleteTrip showPrompt={setShowDeletePrompt} data={myTripsByIdData}/>}
    </div>
  );
};

export default TripDetails;
