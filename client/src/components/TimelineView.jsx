import React from "react";
import dayjs from "dayjs";
import moment from "moment";
import Moneybox from "../images/MoneyBox.png";
import CarImg from "../images/Car.png";
import AccomodationImg from "../images/EqualHousingOpportunity.png";

const TimelineView = ({ itinerary, tripStartDate }) => {
  return (
    <div className="flex flex-col justify-center items-center overflow-y-auto custom-scrollbar mt-5 w-full">
      <div className="w-full overflow-y-auto custom-scrollbar">
      <div className="w-full h-[600px]  bg-headerBG p-8 rounded-lg">
        {itinerary.length > 0 ? (
          <ul className="space-y-14">
            {itinerary.map((day, idx) => (
              <React.Fragment key={idx}>
                {/* Day Header */}
                <li className="list-none mb-2">
                  <p className="text-white text-[18px] font-aldrich">
                    Day {moment(day.dayDate).diff(tripStartDate, "days") + 1}
                    <span className="font-light text-textCard text-[20px]"> | </span>
                    <span className="text-topHeader font-semibold">
                      {dayjs(day.dayDate).format("dddd")}
                    </span>
                  </p>
                  <p className="text-textCard text-md font-light">
                    {dayjs(day.dayDate).format("DD MMMM, YYYY")}
                  </p>
                </li>

                {/* Spot List with vertical line */}
                <li className="list-none">
                  <ul className="space-y-10 relative border-l-2 border-textCard ml-[26%] mt-6">
                    {day.selected_spots.map((spot, i) => (
                      <li key={`${idx}-${i}`} className="relative pl-6">
                        {/* Time */}
                        <div className="absolute left-[-38%] top-1 flex items-center gap-1">
                          {(() => {
                            const [hours, minutes] = (spot.travelTime ?? "00:00").split(":");
                            return (
                              <>
                                <input
                                  type="text"
                                  value={hours}
                                  readOnly
                                  className="bg-textCardDark text-topHeader rounded-lg px-2 w-10 h-7"
                                />
                                :
                                <input
                                  type="text"
                                  value={minutes}
                                  readOnly
                                  className="bg-textCardDark text-topHeader rounded-lg px-2 w-10 h-7"
                                />
                                Hrs
                              </>
                            );
                          })()}
                        </div>

                        {/* Icon */}
                        <span className="absolute left-[-12px] top-1 flex h-5 w-5 items-center justify-center bg-topHeader text-black rounded-full text-xs font-bold">
                          {spot.category === "accomodation" ? (
                            <img src={AccomodationImg} />
                          ) : (
                            <img src={CarImg} />
                          )}
                        </span>

                        {/* Spot Info */}
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col w-[75%] gap-2 italic text-md">
                            <span
                              className={`${
                                spot.category === "start" || spot.category === "end"
                                  ? "text-semibold italic text-white"
                                  : "font-semibold italic text-subTitle"
                              }`}
                            >
                              {spot.name}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-5 text-sm text-gray-300">
                            {["start", "end"].includes(spot.category) ? null : (
                              <>
                                <img src={Moneybox} className="w-8" alt="" />
                                <div className="flex items-center">
                                  $&nbsp;&nbsp;
                                  <input
                                    type="text"
                                    className="bg-textCardDark text-myTripSearchBGLite rounded-lg w-16 h-7 px-2"
                                    value={spot.cost}
                                    readOnly
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              </React.Fragment>
            ))}
          </ul>
        ) : (
          <p>No itinerary available for this trip.</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default TimelineView;
