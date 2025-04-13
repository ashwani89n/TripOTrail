// TripCard.js
import React from "react";
import destinationPin from "../images/destinationPin.png";
import tripJeep from "../images/TripJeep.png";
import BudgetCharts from "./BudgetCharts";
import homeHero from "../images/HomeHero.jpeg";
import tripsNext from "../images/MyTripsNext.png";
import tripsPrev from "../images/MyTripsPrevious.png";
import { CiUser } from "react-icons/ci";
import Slider from "react-slick"; // at top
import { Link } from "react-router-dom";
// import noUpcomingImg from "../images/noUpcomingTrips.png";
// import noActiveImg from "../images/noActiveTrips.png";
// import noPastImg from "../images/noPastTrips.png";

const TripCard = ({
  type,
  totalTrips,
  trip,
  onNextClick,
  onPrevClick,
  showBudgetVsExpense,
}) => {
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const weekday = date.toLocaleString("en-US", { weekday: "long" });

    // Get day suffix (st, nd, rd, th)
    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return "th"; // Covers 11th to 20th
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const dateWithSuffix = `${day}${getDaySuffix(day)} ${month} ${year}`;
    return [dateWithSuffix, weekday];
  };

  const calculateTripDays = (startDt, endDt) => {
    const startDate = new Date(startDt);
    const endDate = new Date(endDt);
    const daysCount =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    return daysCount;
  };

  return (
    <div className="w-[90%] md:w-[32%] h-[450px] bg-darkBG p-4 rounded-lg shadow-lg mt-2 items-center my-5 z-10">
      <div className="bg-topHeader h-[38px] text-xl w-[80%] mx-auto relative -top-9 text-center text-white font-inria font-semibold flex items-center justify-center rounded-md">
        {type}
      </div>

      {trip ? (
        <div >
          
          {(() => {
            const [date, weekday] = formatDate(new Date(trip.start_date));
            return (
              <>
                <div className="flex flex-row justify-between">
                  <p className="text-white font-aldrich text-[15px]">
                    {date}
                    <span className="font-light text-textCard text-[16px]">
                      {" "}
                      |{" "}
                    </span>
                    <span className="text-topHeader font-inria">{weekday}</span>
                  </p>
                  {totalTrips > 1 && (
                    <div className="flex justify-center">
                      <button
                        onClick={onPrevClick}
                        className="cursor-pointer bg-transparent border-none p-0"
                      >
                        <img
                          src={tripsPrev}
                          alt="Previous"
                          className="w-5 h-5"
                        />
                      </button>
                      <button
                        onClick={onNextClick}
                        className="cursor-pointer bg-transparent border-none p-0"
                      >
                        <img src={tripsNext} alt="Next" className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
          <div className="flex gap-3 mt-2 bg-headerBG rounded-lg pr-1h-[330px] relative overflow-hidden">
            <img
              src={homeHero}
              alt="trip"
              className="w-[40%] bg-contain rounded-l-lg"
            />

            <div className="text-topHeader flex flex-col w-full">
            <Link to={`/myTrip/${trip.trip_id}`} className="cursor-pointer">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col mt-3">
                <div className="flex flex-row justify-start text-md p-1 text-topHeader rounded-lg font-inria ">
                  
                    <span className="text-white">
                      {`${trip.title.split(" ")[0]}`}&nbsp;
                    </span>
                    {trip.title.split(" ").slice(1).join(" ")}
                  
                  </div>
                  <div className="text-[10px] pl-1 mb-2 text-textCard">
                    {calculateTripDays(trip.start_date, trip.end_date)} days
                    venture
                  </div>
                </div>
                <div className="flex items-center">
                  {trip.team_members?.slice(0, 3).map((mate, index) => (
                    <div
                      key={index}
                      className={`relative w-8 h-8 rounded-full bg-textCardDark border border-textCard flex items-center justify-center text-sm text-white ${
                        index !== 0 ? "-ml-3" : ""
                      }`}
                      style={{ zIndex: 10 + index }} // ensures proper stacking
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
              </Link>

              <div className="flex flex-row justify-evenly gap-2 items-center mt-5 p-1">
                <div className="text-center flex flex-col justify-center">
                  <img src={tripJeep} alt="start" className="w-5 ml-4" />
                  <h3 className="text-white text-[7px]">{trip.start_point}</h3>
                </div>
                <div className="border-t-2 border-topHeader border-dashed w-[90%]" />
                <div className="text-center">
                  <img src={destinationPin} alt="end" className="w-4 ml-6" />
                  <h3 className="text-white text-[7px]">{trip.destination}</h3>
                </div>
              </div>

              <div className="flex flex-row gap-2 mt-6 h-full">
                {/* Budget */}
                <div className="w-1/2 bg-zinc-900 p-2 rounded-lg flex flex-col">
                  <div className="font-aldrich text-center mb-1 text-[12px]">
                    Budget
                  </div>
                  <div className="flex-1 flex justify-center items-center">
                    {trip.budget || trip.expense ? (
                      <BudgetCharts
                        budget={trip.budget}
                        expense={trip.expense}
                        showBudgetVsExpense
                      />
                    ) : (
                      <p className="italic text-textCard text-[7px] text-center">
                        No budget data available..
                      </p>
                    )}
                  </div>
                </div>

                {/* Highlights */}
                <div className="w-1/2 bg-zinc-900 p-2 rounded-lg flex flex-col">
                  <div className="font-aldrich text-center mb-1 text-[12px]">
                    Highlights
                  </div>
                  <div className="flex-1 flex justify-center items-center">
                    {trip.media?.length > 0 ? (
                      <Slider
                        dots={true}
                        infinite={true}
                        speed={500}
                        slidesToShow={1}
                        slidesToScroll={1}
                      >
                        {trip.media.map((url, index) => (
                          <div key={index} className="px-2">
                            <img
                              src={`http://localhost:5000${url}`}
                              alt={`Trip Media ${index + 1}`}
                              className="rounded-md w-full h-[120px] object-cover"
                            />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <p className="italic text-textCard text-[7px] text-center">
                        No memories to cherish..
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Conditional rendering for empty states */}
          {type === "Upcoming" && (
            <div className="flex flex-col justify-center items-center text-center text-gray-400 h-full min-h-[300px]">
              <h3 className="text-lg font-normal text-white">
                Plan the Road Ahead..
              </h3>
              <p className="mt-1 text-sm italic text-textCard mb-20">
                Tank’s full, map’s blank — time to plan the ride.
              </p>
            </div>
          )}

          {type === "Active" && (
            <div className="h-full flex flex-col justify-center items-center text-center text-gray-400 h-full min-h-[300px]">
              <h3 className="text-lg font-normal text-white">
                Adventure Awaits..
              </h3>
              <p className="mt-1 text-sm italic text-textCard mb-20">
                No wheels turning yet — the open road awaits.
              </p>
            </div>
          )}

          {type === "Past" && (
            <div className="h-full flex flex-col justify-center items-center text-center text-gray-400 h-full min-h-[300px]">
              <h3 className="text-lg font-normal text-white">
                Memories in the Making..
              </h3>
              <p className="mt-1 text-sm italic text-textCard mb-20">
                No miles behind — your stories are still ahead.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TripCard;
