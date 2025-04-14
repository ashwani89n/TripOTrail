import React, {
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useContext,
} from "react";
import moment from "moment";
import "../components/styles/UpcomingMytrip.css";
import dayjs from "dayjs";
import CarImg from "../images/Car.png";
import AccomodationImg from "../images/EqualHousingOpportunity.png";
import AlarmClock from "../images/AlarmClock.png";
import Moneybox from "../images/MoneyBox.png";
import { useParams } from "react-router-dom";
import { tripContext } from "../context/useTripDataContext";
import axios from "axios";

const generateDateRange = (start, days) => {
  const dateArray = [];
  for (let i = -days; i <= days; i++) {
    const date = moment(start).add(i, "days");
    dateArray.push(date);
  }
  return dateArray;
};

const useAutoScrollOnHover = (ref, speed = 2, edgeThreshold = 40) => {
  useEffect(() => {
    let animationId = null;

    const scrollContainer = ref.current;
    if (!scrollContainer) return;

    const onMouseMove = (e) => {
      const { left, right } = scrollContainer.getBoundingClientRect();
      const x = e.clientX;

      const scrollLeft = () => {
        scrollContainer.scrollLeft -= speed;
        animationId = requestAnimationFrame(scrollLeft);
      };

      const scrollRight = () => {
        scrollContainer.scrollLeft += speed;
        animationId = requestAnimationFrame(scrollRight);
      };

      if (x - left < edgeThreshold) {
        cancelAnimationFrame(animationId);
        scrollLeft();
      } else if (right - x < edgeThreshold) {
        cancelAnimationFrame(animationId);
        scrollRight();
      } else {
        cancelAnimationFrame(animationId);
      }
    };

    const stopScroll = () => cancelAnimationFrame(animationId);

    scrollContainer.addEventListener("mousemove", onMouseMove);
    scrollContainer.addEventListener("mouseleave", stopScroll);

    return () => {
      scrollContainer.removeEventListener("mousemove", onMouseMove);
      scrollContainer.removeEventListener("mouseleave", stopScroll);
      cancelAnimationFrame(animationId);
    };
  }, [ref, speed, edgeThreshold]);
};

const UpcomingMytrip = ({ tripDetails }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(
    moment(tripDetails.start_date)
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    moment(tripDetails.end_date)
  );
  const { token } = useContext(tripContext);
  const { tripId } = useParams();
  const [itinerary, setItinerary] = useState([]);

  const startDates = generateDateRange(moment(tripDetails.start_date), 90);
  const endDates = generateDateRange(moment(tripDetails.start_date), 90);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useAutoScrollOnHover(startDateRef);
  useAutoScrollOnHover(endDateRef);

  const getTripById = async () => {
    console.log("inisde destinations");
    try {
      const response = await axios.get(`/api/trips/${tripId}/destinations`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ0NTk3NDc3LCJleHAiOjE3NDQ2MDEwNzd9.hJwLiSbeq5mjjhrboFpxbWLiqRpyioqPPeTBMZctlUQ`,
        },
      });
      setItinerary(response.data.timeline);
      console.log("1:", response.data.timeline);
    } catch (error) {
      // setError(error.response?.data?.message || "Destinations Loading Unsuccessful");
      console.log({ error });
    }
  };

  useEffect(() => {
    if (!tripId) return;
    getTripById();
  }, []);

  useLayoutEffect(() => {
    if (startDateRef.current) {
      const selectedStartElement =
        startDateRef.current.querySelector(".selected-start");
      if (selectedStartElement) {
        const containerWidth = startDateRef.current.offsetWidth;
        const selectedElementWidth = selectedStartElement.offsetWidth;

        // Calculate the offset dynamically
        const offset =
          selectedStartElement.offsetLeft -
          containerWidth / 2 +
          selectedElementWidth / 2;
        startDateRef.current.scrollTo({ left: offset, behavior: "smooth" });
      }
    }
  }, [selectedStartDate]);

  useLayoutEffect(() => {
    if (endDateRef.current) {
      const selectedEndElement =
        endDateRef.current.querySelector(".selected-end");
      if (selectedEndElement) {
        const containerWidth = endDateRef.current.offsetWidth;
        const selectedElementWidth = selectedEndElement.offsetWidth;

        // Calculate the offset dynamically
        const dynamicOffset = (2050 / 1920) * containerWidth; // Adjust 750px based on the container width (assuming 1920px as a reference width)
        const offset =
          selectedEndElement.offsetLeft -
          containerWidth / 2 +
          selectedElementWidth / 2 -
          dynamicOffset;
        endDateRef.current.scrollTo({ left: offset, behavior: "smooth" });
      }
    }
  }, [selectedEndDate]);

  // Function to format the date with ordinal suffix
  const formatWithOrdinal = (date) => {
    const day = date.date();
    const suffix = ["th", "st", "nd", "rd"][
      day % 10 > 3 || (day >= 11 && day <= 13) ? 0 : day % 10
    ];
    return `${day}${suffix} ${date.format("MMMM, YYYY")}`;
  };

  return (
    <div className="w-full flex flex-row text-white mt-5 ">
      {/* Start Date Picker */}
      <div className="w-[50%] px-4 flex flex-col">
        <p className="text-white text-center mb-2">
          Start Date:{" "}
          <span className="text-topHeader">
            {formatWithOrdinal(selectedStartDate)}
          </span>
        </p>
        <div
          className="overflow-x-auto custom-scrollbar-hide pb-2"
          ref={startDateRef}
        >
          <div className="flex space-x-1 min-w-max px-2">
            {startDates.map((date, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedStartDate(date)}
                className={`flex flex-col items-center cursor-pointer px-2 py-1 rounded-md w-14 ${
                  date.isSame(selectedStartDate, "day")
                    ? "bg-topHeader text-white selected-start"
                    : "bg-calendarView text-white"
                }`}
              >
                <span className="text-lg font-bold">{date.format("D")}</span>
                <span className="text-sm">{date.format("ddd")}</span>
              </div>
            ))}
          </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-start gap-4 overflow-y-auto custom-scrollbar mt-5">
            <div className="w-full rounded-lg ">
                {itinerary.length > 0 ? (
                  itinerary.map((day, idx) => (
                    <div key={idx} className="rounded-lg p-8 bg-headerBG h-[600px] mb-5 ">
                      <div className="flex flex-col pb-2 w-full justify-between">
                        <p className="text-white text-[18px] font-aldrich">
                          Day{" "}
                          {moment(day.dayDate).diff(
                            tripDetails.start_date,
                            "days"
                          ) + 1}
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

                      <ul className="space-y-10 relative border-l-2 border-textCard ml-[22%] mt-6">
                        {day.selected_spots.map((spot, i) => (
                          <li key={i} className="relative pl-6">
                            {console.log(spot.name)}
                            <div className="absolute left-[-30%] flex items-center gap-1">
                              {(() => {
                                const [hours, minute] =
                                  spot.travelTime.split(":");
                                return (
                                  <>
                                    <input
                                      type="text"
                                      className="bg-textCardDark text-topHeader font rounded-lg px-2 w-10 h-7"
                                      maxLength={2}
                                      value={hours}
                                      readOnly
                                    />
                                    :
                                    <input
                                      type="text"
                                      className="bg-textCardDark text-topHeader font rounded-lg px-2 w-10 h-7"
                                      maxLength={2}
                                      value={minute}
                                      readOnly
                                    />
                                    Hrs
                                  </>
                                );
                              })()}
                            </div>

                            <span className="absolute left-[-12px] top-1 flex h-5 w-5 items-center justify-center bg-topHeader text-black rounded-full text-xs font-bold">
                              {spot.category === "accomodation" ? (
                                <img src={AccomodationImg} />
                              ) : (
                                <img src={CarImg} />
                              )}
                            </span>

                            <div className="flex items-center gap-4 mb-1">
                              <div className="flex flex-col w-[80%] gap-2 text-white text-md">
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

                                {/* {spot.category !== "start" && spot.travelTime && (
                            <div className="inline-flex items-center gap-2">
                              <img src={AlarmClock} className="w-6 h-4" />
                              <span className="font-light italic text-white">
                                {spot.travelTime}
                              </span>
                            </div>
                          )} */}
                              </div>

                              <div className="ml-7 flex items-center gap-2 text-sm text-gray-300 pr-8">
                                {["start", "end"].includes(
                                  spot.category
                                ) ? null : (
                                  <>
                                    <img
                                      src={Moneybox}
                                      className="w-8"
                                      alt=""
                                    />
                                    <div className="flex items-center">
                                      $&nbsp;&nbsp;
                                      <input
                                        type="text"
                                        className="bg-textCardDark rounded-lg w-16 h-7 px-2"
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
                    </div>
                  ))
                ) : (
                  <div className="text-white">Hello</div>
                )}
          </div>
        </div>
      </div>

      {/* End Date Picker */}
      <div className="w-[50%] px-4 flex flex-col">
        <p className="text-white text-center mb-2">
          End Date:{" "}
          <span className="text-topHeader">
            {formatWithOrdinal(selectedEndDate)}
          </span>
        </p>
        <div
          className="overflow-x-auto custom-scrollbar-hide pb-2"
          ref={endDateRef}
        >
          <div className="flex space-x-1 min-w-max px-2">
            {endDates.map((date, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedEndDate(date)}
                className={`flex flex-col items-center cursor-pointer px-2 py-1 rounded-md w-14 ${
                  date.isSame(selectedEndDate, "day")
                    ? "bg-topHeader text-white selected-end"
                    : "bg-calendarView text-gray-300"
                }`}
              >
                <span className="text-lg font-bold">{date.format("D")}</span>
                <span className="text-sm">{date.format("ddd")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingMytrip;
