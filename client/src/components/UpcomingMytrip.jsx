import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import moment from "moment";
import "../components/styles/UpcomingMytrip.css";

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

  const startDates = generateDateRange(moment(tripDetails.start_date), 90);
  const endDates = generateDateRange(moment(tripDetails.start_date), 90);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useAutoScrollOnHover(startDateRef);
  useAutoScrollOnHover(endDateRef);

  useLayoutEffect(() => {
    if (startDateRef.current) {
      const selectedStartElement = startDateRef.current.querySelector(".selected-start");
      if (selectedStartElement) {
        const containerWidth = startDateRef.current.offsetWidth;
        const selectedElementWidth = selectedStartElement.offsetWidth;
  
        // Calculate the offset dynamically
        const offset = selectedStartElement.offsetLeft - (containerWidth / 2) + (selectedElementWidth / 2);
        startDateRef.current.scrollTo({ left: offset, behavior: "smooth" });
      }
    }
  }, [selectedStartDate]);

  useLayoutEffect(() => {
    if (endDateRef.current) {
      const selectedEndElement = endDateRef.current.querySelector(".selected-end");
      if (selectedEndElement) {
        const containerWidth = endDateRef.current.offsetWidth;
        const selectedElementWidth = selectedEndElement.offsetWidth;
  
        // Calculate the offset dynamically
        const dynamicOffset = (2050 / 1920) * containerWidth; // Adjust 750px based on the container width (assuming 1920px as a reference width)
      const offset = selectedEndElement.offsetLeft - (containerWidth / 2) + (selectedElementWidth / 2) - dynamicOffset;
endDateRef.current.scrollTo({ left: offset, behavior: "smooth" });
      }
    }
  }, [selectedEndDate]);

  // Function to format the date with ordinal suffix
  const formatWithOrdinal = (date) => {
    const day = date.date();
    const suffix = ["th", "st", "nd", "rd"][(day % 10 > 3 || (day >= 11 && day <= 13)) ? 0 : day % 10];
    return `${day}${suffix} ${date.format("MMMM, YYYY")}`;
  };

  return (
    <div className="w-full flex flex-row text-white">
      {/* Start Date Picker */}
      <div className="w-[50%] px-4 flex flex-col">
       <p className="text-white text-center mb-2">
          Start Date: <span className="text-topHeader">{formatWithOrdinal(selectedStartDate)}</span>
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
      </div>

      {/* End Date Picker */}
      <div className="w-[50%] px-4 flex flex-col">
      <p className="text-white text-center mb-2">
          End Date: <span className="text-topHeader">{formatWithOrdinal(selectedEndDate)}</span>
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
