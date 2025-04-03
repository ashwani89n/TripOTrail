import React, { useRef, useState } from "react";
import Header from "../components/Header";
import { RiCompass3Fill } from "react-icons/ri";
import { CiCompass1 } from "react-icons/ci";
import { FaListCheck } from "react-icons/fa6";
import { TbCarCrash } from "react-icons/tb";
import { FaCalendar, FaCloudUploadAlt, FaFlagCheckered } from "react-icons/fa";
import { IoCalendar, IoCalendarSharp } from "react-icons/io5";

import "./planTrip.css";
import SetSecene from "../components/SetSecene";
import PickSpots from "../components/PickSpots";
import { tripContext } from "../context/useTripDataContext";

const PlanTrip = () => {
  const [tripId, setTripId] = useState();
  const [startPoint, setStartPoint] = useState();
  const [destinationPoint, setDestinationPoint] = useState();
  const [page, setPage] = useState(1);
  const handleNext = () => {
    setPage((prev) => prev + 1);
    console.log(page);
  };
  const handlePrevious = () => {
    setPage((prev) => prev - 1);
    console.log(page);
  };
  return (
    <tripContext.Provider
      value={{
        tripId,
        setTripId,
        destinationPoint,
        setDestinationPoint,
        startPoint,
        setStartPoint,
      }}
    >
      <div className="bg-darkBG min-h-screen flex flex-col">
        <Header />
        <div>
          <div className="bg-subHeaderBG text-center mt-12 p-2 mx-10 rounded-t-2xl mb-12">
            <p className="text-white text-xl font-aldrich">
              Plan your <span className="text-black">Trip</span>
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`bg-topHeader rounded-full w-[41px] h-[41px] flex items-center justify-center mr-2 ${
                    page === 0 ? "border-white-500 border-[2px]" : "border-none"
                  }`}
                >
                  <CiCompass1 className="text-white font-bold h-[25px] w-[62px]" />
                </div>
                <p className="text-white text-xl font-aldrich font:semibold mt-2">
                  Get
                </p>
              </div>
              <div className="border-white border-[1px] w-[192px] mb-10 ml-2 mr-2"></div>
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`bg-topHeader rounded-full w-[41px] h-[41px] flex items-center justify-center ${
                    page === 1 ? "border-white-500 border-[2px]" : "border-none"
                  }`}
                >
                  <FaListCheck className="text-white font-bold h-[25px] w-[62px] p-1" />
                </div>
                <p className="text-white text-xl font-aldrich mt-2 mr-2">Set</p>
              </div>
              <div className="border-white border-[1px] w-[192px] mb-10 mr-2 ml-2"></div>
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`bg-topHeader rounded-full w-[41px] h-[41px] flex items-center justify-center p-2 ${
                    page === 2 ? "border-white-500 border-[2px]" : "border-none"
                  }`}
                >
                  <TbCarCrash className="text-white font-bold h-[25px] w-[62px]" />
                </div>
                <p className="text-white text-xl font-aldrich mt-2">Go</p>
              </div>
              <div className="border-white border-[1px] w-[192px] mb-10 ml-2"></div>
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`bg-topHeader rounded-full w-[41px] h-[41px] flex items-center justify-center mr-1 ${
                    page === 3 ? "border-white-500 border-[2px]" : "border-none"
                  }`}
                >
                  <FaFlagCheckered className="text-white font-bold h-[25px] w-[62px] p-1" />
                </div>
                <p className="text-white text-xl font-aldrich mt-2">Confirm</p>
              </div>
            </div>
          </div>
        </div>
        {page === 0 && <SetSecene onClickNext={setPage} />}
        {page === 1 && <PickSpots />}
        {page > 0 && (
          <div className="flex justify-end pb-20 pr-10 mt-10 gap-5">
            <button
              className="bg-topHeader text-white p-2 px-10 flex gap-3 font-semibold rounded-lg items-center"
              onClick={handlePrevious}
            >
              Previous
            </button>
            <button
              className="bg-topHeader text-white p-2 px-10 flex gap-3 font-semibold  rounded-lg items-center"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </tripContext.Provider>
  );
};

export default PlanTrip;
