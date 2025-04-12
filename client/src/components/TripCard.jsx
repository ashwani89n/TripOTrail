// TripCard.js
import React from "react";
import BudgetCharts from "./BudgetCharts";


const TripCard = ({ type, trip, onNextClick, showCountdown }) => {
  return (
    <div className="w-[30%] min-h-[400px] bg-darkBG p-4 rounded-lg shadow-lg mt-2 items-center">
      <div className="bg-topHeader h-[38px] text-xl w-[80%] mx-auto relative -top-9 text-center text-white font-inria font-semibold flex items-center justify-center rounded-md">
        {type}
      </div>

      {trip ? (
        <>
          <div className="text-white font-aldrich mb-2 text-center">
            {trip.start_date}
          </div>
          <div className="flex gap-5 items-center">
            <img src={trip.image} alt="trip" className="w-[170px] h-auto" />
            <div className="text-topHeader flex flex-col w-full">
              <h3>{trip.title}</h3>
              <div className="flex flex-row justify-evenly gap-2 items-center">
                <div className="text-center">
                  <img src={trip.icons?.startIcon} alt="start" />
                  <h3 className="text-white text-[6px]">{trip.start_point}</h3>
                </div>
                <div className="border-t-2 border-topHeader border-dashed w-[90%]" />
                <div className="text-center">
                  <img src={trip.icons?.endIcon} alt="end" />
                  <h3 className="text-white text-[6px]">{trip.destination}</h3>
                </div>
              </div>

              <div className="mt-3">
                <h3 className="font-aldrich text-center text-white">
                  {showCountdown ? "Time Left" : "Budget"}
                </h3>
                {showCountdown ? (
                  <p className="text-center text-white mt-2">{trip.timeLeft}</p>
                ) : (
                  <BudgetCharts budget={trip.budget} expense={trip.expense} />
                )}
              </div>
            </div>
          </div>

          <button
            className="text-white mt-4"
            onClick={onNextClick}
          >
            Next
          </button>
        </>
      ) : (<>
        {type === "Upcoming" && (
  <div className="h-full flex flex-col justify-center items-center text-center text-gray-400">
    {/* <img src={noUpcomingImg} alt="No Upcoming Trips" className="w-[28%] mb-4" /> */}
    <h3 className="text-lg font-normal text-white ">Plan the Road Ahead..</h3>
    <p className="mt-1 text-sm italic text-textCard mb-20">
      Tank’s full, map’s blank — time to plan the ride.
    </p>
  </div>
)}
          
          {type === "Active" && (
            <div className="h-full flex flex-col justify-center items-center text-center text-gray-400">
              {/* <img src={noActiveImg} alt="No Active Trips" className="w-[25%] mb-4" /> */}
              <h3 className="text-lg font-normal text-white">Adventure Awaits..</h3>
              <p className="mt-1 text-sm italic text-textCard mb-20">No wheels turning yet — the open road awaits.</p>
            </div>
          )}
          
          {type === "Past" && (
            <div className="h-full flex flex-col justify-center items-center text-center text-gray-400">
              {/* <img src={noPastImg} alt="No Past Trips" className="w-[25%] mt-3 mb-3" /> */}
              <h3 className="text-lg font-normal text-white">Memories in the Making..</h3>
              <p className="mt-1 text-sm italic text-textCard mb-20">No miles behind — your stories are still ahead.</p>
            </div>
          )}
          </>
          
      )}
    </div>
  );
};

export default TripCard;
