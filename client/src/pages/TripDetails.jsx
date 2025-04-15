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
import attch from "../images/Attach.png";
import endTrip from "../images/Remove.png";
import addStop from "../images/Address.png";
import sendEmail from "../images/SendEmail.png";
import emailjs from 'emailjs-com';


const TripDetails = () => {
  const [myTripsByIdData, setMyTripsByIdData] = useState({});
  const [error, setError] = useState("");
  const { token } = useContext(tripContext);
  const { tripId } = useParams();
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailBody, setEmailBody] = useState([]);

  const getTripById = async () => {
    try {
      const response = await axios.get(`/api/trips/${tripId}`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ0Njk0Nzk4LCJleHAiOjE3NDQ2OTgzOTh9.CN0P53iWn9500luCu_i6PtcvgST60EW9r9iqVpWVAzs`,
        },
      });
      setMyTripsByIdData(response.data);
      console.log(response.data);
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

  const handleEmailSend = async () => {
    if (!emailInput) {
      setEmailError("Please enter an email address");
      return;
    }
  
    // Format itinerary HTML
    const itinerary = myTripsByIdData.destinations || []; // Adjust if structured differently
    const tripBody = itinerary.map((spot, index) => {
      return `Day ${index + 1}: ${spot.name || "Unknown spot"} - ₹${spot.cost || 0}`;
    }).join("\n");
  
    const templateParams = {
      to_email: emailInput,
      trip_title: myTripsByIdData.title,
      trip_body: emailBody
    };
  
    try {
      const result = await emailjs.send(
        "service_q59sdwp",     // e.g., service_qwerty123
        "template_j6qd23w",    // e.g., template_abcd1234
        templateParams,
        "G1SL5ipv-ruQVsSmI"         // Your EmailJS public key
      );
  
      console.log("EmailJS success:", result.text);
    } catch (error) {
      console.error("EmailJS error:", error);
      alert("Failed to send itinerary email.");
    } finally {
      setShowEmailPrompt(false);
      setEmailInput("");
    }
  };
    
  

  return (
    <div className="bg-darkBG min-h-screen flex flex-col">
      <Header />
      <div className="mt-10 text-white">
        <div className=" p-1 text-topHeader rounded-lg cursor-pointer text-center font-aldrich text-2xl">
          <div className="flex flex-row justify-between items-center w-full px-10">
            {/* Center Title + Team Members */}
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
                onClick={() => setShowEmailPrompt(true)}
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
                onClick={() => setShowEmailPrompt(true)}
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
          <UpcomingMytrip tripDetails={myTripsByIdData} onClickEmail={setEmailBody}/>
        ) : myTripsByIdData.runningStatus === "active" ? (
          <ActiveMyTrip tripDetails={myTripsByIdData} />
        ) : (
          <PastMyTrip tripDetails={myTripsByIdData} />
        )}
      </div>
      {showEmailPrompt && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="w-[30%] max-w-md bg-textCardDark rounded-lg overflow-hidden">
      {/* Heading */}
      <span className="text-white text-xl font-aldrich flex items-center justify-center mt-5">
        Email Itinerary
      </span>

      {/* Content */}
      <div className="flex flex-col gap-4 p-5">
        {emailError && (
          <div className="flex bg-headerBG justify-center items-center">
            <p className="p-2 text-textCard font-light text-lg font-inria">
              {emailError}
            </p>
          </div>
        )}

        {/* Email Input */}
        <div className="flex flex-col mb-2">
          <label className="text-white mb-1">Recipient Email</label>
          <input
            type="email"
            className="p-2 bg-textInputBG border-none rounded-md text-white outline-none"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="example@email.com"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleEmailSend}
            className="px-4 py-2 bg-topHeader text-white rounded-md w-1/3"
          >
            Send
          </button>
          <button
            onClick={() => {
              setEmailInput("");
              setShowEmailPrompt(false);
              setEmailError("");
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-md w-1/3"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default TripDetails;
