import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaCarSide,
  FaBusAlt,
  FaPlane,
  FaTrain,
  FaWalking,
} from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { useLoadScript } from "@react-google-maps/api";
import CarImg from "../images/Car.png";
import AccomodationImg from "../images/EqualHousingOpportunity.png";
import AlarmClock from "../images/AlarmClock.png";
import Moneybox from "../images/MoneyBox.png";
import dayjs from "dayjs";

const googleMapsApiKey = "AIzaSyA3xEs87Yqi3PpC8YKGhztvrXNDJX5nNDw"; // Replace with your key

function LockJourney({ onClickPrevNext, data }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries: ["places"],
  });

  const [itinerary, setItinerary] = useState([]);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!isLoaded) return;

    const fetchTravelTimes = async () => {
      try {
        const google = window.google;
        const service = new google.maps.DistanceMatrixService();
    
        const updatedItinerary = await Promise.all(
          data.map(async (day) => {
            const spots = [...day.selected_spots];
    
            const initialTime = day.start_time || "09:00";
            let currentTime = dayjs(
              `${day.dayDate} ${initialTime}`,
              "MMMM DD, YYYY HH:mm"
            );
    
            // Assign timeline to the first spot
            spots[0].timeLine = currentTime.format("HH:mm");
    
            for (let i = 0; i < spots.length - 1; i++) {
              const origin = spots[i].name;
              const destination = spots[i + 1].name;
    
              const response = await new Promise((resolve, reject) => {
                service.getDistanceMatrix(
                  {
                    origins: [origin],
                    destinations: [destination],
                    travelMode: google.maps.TravelMode.DRIVING,
                  },
                  (result, status) => {
                    if (status === "OK") {
                      resolve(result);
                    } else {
                      reject(status);
                    }
                  }
                );
              });
    
              const travelTimeSec = response.rows[0].elements[0].duration.value;
              const travelTimeMin = Math.floor(travelTimeSec / 60);
              spots[i + 1].travelTime = response.rows[0].elements[0].duration.text;
    
              // Convert duration "H:mm" or "M:ss" → total minutes
              const [h, m] = (spots[i].duration || "0:00").split(":").map(Number);
              const durationMins = (h * 60) + m;
    
              // Advance current time
              currentTime = currentTime
                .add(durationMins, "minute")
                .add(15, "minute")
                .add(travelTimeMin, "minute");
    
              spots[i + 1].timeLine = currentTime.format("HH:mm");
            }
    
            return {
              ...day,
              selected_spots: spots,
            };
          })
        );
    
        setItinerary(updatedItinerary);
      } catch (err) {
        setError("Failed to load Google Maps travel durations.");
        console.error(err);
      }
    };
    

    fetchTravelTimes();
  }, [isLoaded, data]);

  const handlePrevious = () => {
    onClickPrevNext((prev) => prev - 1);
  };

  const handleNext = () => {
    onClickPrevNext((prev) => prev + 1);
  };

  const getTransportIcon = (mode) => {
    switch (mode?.toLowerCase()) {
      case "car":
        return <FaCarSide />;
      case "bus":
        return <FaBusAlt />;
      case "flight":
        return <FaPlane />;
      case "train":
        return <FaTrain />;
      case "walk":
        return <FaWalking />;
      default:
        return <FaCarSide />;
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="text-center mt-10 mb-16">
        <h3 className="text-topHeader text-2xl font-kaushan">
          <span className="font-aboreto font-semibold">LOCK</span> Your Journey
        </h3>
        <p className="text-subTitle font-inria text-lg mt-1">
          Get ready to hit the road!
        </p>
      </div>

      {error && (
        <div className="flex bg-red-600 mx-10 rounded-md mb-10 justify-center items-center">
          <p className="p-2 text-white font-normal text-lg font-inria">
            {error}
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-center items-start gap-4 p-5 mb--10">
        <div className="w-full lg:w-3/4 bg-card p-4 rounded-lg">
          <div className="overflow-y-auto custom-scrollbar h-[580px]">
            {itinerary.map((day, idx) => (
              <div key={idx} className="mb-5 rounded-lg p-8 bg-list">
                <div className="flex flex-col pb-2 w-full justify-between">
                  <p className="text-white text-[18px] font-aldrich">
                    Day {day.day}{" "}
                    <span className="font-light text-textCard text-[20px]">
                      {" "}
                      |{" "}
                    </span>
                    <span className="text-topHeader font-semibold">
                      {dayjs(day.dayDate).format("dddd")}
                    </span>
                  </p>
                  <p className="text-textCard text-md font-light">
                    {dayjs(day.dayDate).format("DD MMMM, YYYY")}
                  </p>
                </div>
                <ul className="space-y-10 relative border-l-2 border-textCard ml-[20%] mt-6 ">
                  {day.selected_spots.map((spot, i) => (
                    <li key={i} className="relative pl-6  ">
                      <div className="absolute left-[-26%]  flex items-center gap-1">
                        
                        {(() => { console.log(day, spot.timeLine.split(":")[0]);
  const [hours, minute] = (spot.timeLine).split(":");
  return (
    <>
      <input
        type="text"
        className="bg-textCardDark text-topHeader font rounded-lg px-2 w-10 h-7"
        maxLength={2}
        placeholder="HH"
        name="start-hour"
        defaultValue={hours}
      />
      :
      <input
        type="text"
        className="bg-textCardDark text-topHeader font rounded-lg w-10 h-7 px-2"
        maxLength={2}
        placeholder="MM"
        name="start-minute"
        defaultValue={minute}
      />
      Hrs
    </>
  );
})()}

                      </div>
                      <span className="absolute left-[-12px] top-1 flex h-5 w-5 items-center justify-center bg-topHeader text-black rounded-full text-xs font-bold">
                        {console.log(spot.name, spot.category)}
                        {["spot", "end", "start"].includes(spot.category) ? (
                          <img src={CarImg} />
                        ) : spot.category === "accomodation" ? (
                          <img src={AccomodationImg} />
                        ) : (
                          ""
                        )}
                      </span>
                      <div className="flex items-center gap-4 mb-1">
                        <div className="flex flex-col w-[80%] gap-2 text-white text-md ">
                          <span
                            className={`${
                              spot.category === "start" ||
                              spot.category === "end"
                                ? "text-semibold italic text-white"
                                : "font-semibold italic text-subTitle"
                            }`}
                          >
                            {spot.name}
                          </span>
                          <div className="inline-flex items-center gap-2">
  {spot.category !== "start" && spot.travelTime &&(
    <>
      <img src={AlarmClock} className="w-6 h-4" />
      <span className="font-light italic text-white">{spot.travelTime}</span>
    </>
  )}
</div>
                        </div>
                        <div className="ml-7 flex items-center gap-2 text-sm text-gray-300 pr-8">
                          <img src={Moneybox} className="w-8" alt="" />
                          <div className="flex items-center">
                            $&nbsp;&nbsp;
                            <input
                              type="text"
                              className="bg-textCardDark rounded-lg w-12 h-7 px-2"
                              maxLength={4}
                              value={spot.cost}
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2 h-full bg-card p-3 rounded-lg">
          <div className="w-full h-[580px]" id="map"></div>
        </div>
      </div>
      <div className="flex justify-end gap-4 pr-10">
        <button
          className="bg-topHeader text-white p-2 px-10 rounded-lg font-semibold"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          className="bg-topHeader text-white p-2 px-10 rounded-lg font-semibold"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default LockJourney;
