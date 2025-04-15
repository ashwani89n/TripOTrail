import React, {useLayoutEffect} from "react";
import moment from "moment";

const CalendarPicker = ({ type, selectedDate, onSelectDate, dateList, scrollRef, dataOffset }) => {
    useLayoutEffect(() => {
        console.log("type:", type);
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
      }, [selectedDate, type, dataOffset]);

    return (
      <div>
        <p className="text-white text-center mb-2">
          {type === "start" ? "Start Date: " : "End Date: "}
          <span className="text-topHeader">
            {selectedDate.format("Do MMMM, YYYY")}
          </span>
        </p>
        <div className="overflow-x-auto custom-scrollbar-hide pb-2" ref={scrollRef}>
          <div className="flex space-x-1 min-w-max px-2">
            {dateList.map((date, idx) => (
              <div
                key={idx}
                onClick={() => onSelectDate(date)}
                className={`flex flex-col items-center cursor-pointer px-2 py-1 rounded-md w-14 ${
                  date.isSame(selectedDate, "day")
                    ? `bg-topHeader text-white selected-${type}`
                    : "bg-calendarView text-white"
                }`}
              >
                <span className="text-lg font-semibold">{date.format("D")}</span>
                <span className="text-sm text-myTripSearchBGLite">
                  {date.format("ddd")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  

export default CalendarPicker;
