import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import moment from "moment";

const CalendarPicker = ({ type, selectedDate, dataOffset, editable, onChangeDate, minDate, maxDate }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(moment(selectedDate));
  const [showMessage, setShowMessage] = useState(false);

  const generateDateRange = (start, days) => {
    const dateArray = [];
    for (let i = -days; i <= days; i++) {
      const date = moment(start).add(i, "days");
      dateArray.push(date);
    }
    return dateArray;
  };

  useEffect(() => {
    setSelectedStartDate(moment(selectedDate));
  }, [selectedDate]);

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

  useLayoutEffect(() => {
    if (scrollRef.current) {
      const selector = `.selected-${type}`;
      const selectedElement = scrollRef.current.querySelector(selector);

      if (selectedElement) {
        const containerWidth = scrollRef.current.offsetWidth;
        const selectedElementWidth = selectedElement.offsetWidth;

        const offset =
          selectedElement.offsetLeft -
          containerWidth / 2 +
          selectedElementWidth / 2 -
          dataOffset;

        scrollRef.current.scrollTo({ left: offset, behavior: "smooth" });
      }
    }
  }, [selectedStartDate, type, dataOffset]);

  const dateList = generateDateRange(moment(selectedStartDate), 90);
  const scrollRef = useRef(null);
  useAutoScrollOnHover(scrollRef);

  // Check if the date is valid (inside the range defined by minDate and maxDate)
  const isValidDate = (date) => {
    return (
      (!minDate || date.isSameOrAfter(moment(minDate), "day")) &&
      (!maxDate || date.isSameOrBefore(moment(maxDate), "day"))
    );
  };

  const handleDateClick = (date) => {
    if (!editable) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
      return;
    }

    // Prevent selecting invalid dates
    if (!isValidDate(date)) {
      return;
    }

    setSelectedStartDate(date);
    if (onChangeDate) onChangeDate(date.toISOString());
  };

  useEffect(() => {
    setSelectedStartDate(moment(selectedDate));
  }, [selectedDate]);

  return (
    <div>
      <p className="text-white text-center mb-2">
        {type === "start" ? "Start Date: " : "End Date: "}
        <span className="text-topHeader">
          {selectedStartDate.format("Do MMMM, YYYY")}
        </span>
      </p>

      <div className="overflow-x-auto custom-scrollbar-hide pb-2" ref={scrollRef}>
        <div className="flex space-x-1 min-w-max px-2">
          {dateList.map((date, idx) => (
            <div
              key={idx}
              onClick={() => handleDateClick(date)}
              className={`flex flex-col items-center px-2 py-1 rounded-md w-14 ${
                editable ? "cursor-pointer" : "cursor-default opacity-70"
              } ${
                date.isSame(selectedStartDate, "day")
                  ? `bg-topHeader text-white selected-${type}`
                  : "bg-calendarView text-white"
              } `}
            >
              <span className="text-lg font-semibold">{date.format("D")}</span>
              <span className="text-sm text-myTripSearchBGLite">{date.format("ddd")}</span>
            </div>
          ))}
        </div>
      </div>

      {showMessage && (
        <p className="text-center text-sm text-textCard mt-1">
          To change dates, go to <span className="font-semibold">Edit Trip</span>.
        </p>
      )}
    </div>
  );
};

export default CalendarPicker;
