import React, { useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isLeapYear from "dayjs/plugin/isLeapYear";
import "dayjs/locale/en";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(weekday);
dayjs.extend(isLeapYear);

const CalendarView = ({ startDate, endDate }) => {
    const start = dayjs.utc(startDate).startOf("day");
    const end = dayjs.utc(endDate).startOf("day");
    const [selectedDate, setSelectedDate] = useState(start.clone());


  const generateDates = () => {
    const dates = [];
    const rangeStart = start.subtract(3, "day");
    const rangeEnd = end.add(3, "day");

    for (
      let d = rangeStart.clone();
      d.isBefore(rangeEnd) || d.isSame(rangeEnd, "day");
      d = d.add(1, "day")
    ) {
      dates.push(d.clone());
    }

    return dates;
  };

  const dates = generateDates();

  const getDayNumber = (date) => {
    return date.diff(start, "day") + 1;
  };

  return (
    <div className="text-white p-4 rounded-md">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {dates.map((date) => {
          const isStart = date.isSame(start, "day");
          const isEnd = date.isSame(end, "day");
          const isInRange = date.isAfter(start) && date.isBefore(end);
          const isSelected = date.isSame(selectedDate, "day");

          return (
            <div
              key={date.format("YYYY-MM-DD")}
              onClick={() => setSelectedDate(date)}
              className={`w-16 flex-shrink-0 text-center py-2 rounded-md cursor-pointer
                ${
                  isStart || isEnd
                    ? "bg-orange-500 text-white"
                    : isInRange
                    ? "bg-orange-200 text-orange-800"
                    : "bg-gray-700 text-gray-300"
                }
                ${isSelected && "ring-2 ring-orange-400"}
              `}
            >
              <div className="text-sm">{date.format("DD")}</div>
              <div className="text-xs">{date.format("ddd")}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold">
          Day {getDayNumber(selectedDate)} |{" "}
          <span className="text-orange-400">{selectedDate.format("dddd")}</span>
        </h2>
        <p className="text-sm text-gray-400">
          {selectedDate.format("D MMMM, YYYY")}
        </p>
      </div>
    </div>
  );
};

export default CalendarView;
