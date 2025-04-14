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
import Sum from "../images/Sum.png";
import addExpAcc from "../images/AddExpenseAccomodation.png";
import addExpAct from "../images/AddExpenseActivity.png";
import addExpFood from "../images/AddExpenseFood.png";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Label,
  CartesianGrid,
} from "recharts";

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

  const categories = ["transport", "accommodation", "activities", "food"];

  const categorizeExpenses = () => {
    const catMap = {
      transport: [],
      accommodation: [],
      activities: [],
      food: [],
    };
    tripDetails.expenses?.forEach((item) => {
      if (catMap[item.category]) {
        catMap[item.category].push(item);
      }
    });
    return catMap;
  };

  const [expenses, setExpenses] = useState(categorizeExpenses());
  const [openModal, setOpenModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
  });

  const openExpenseModal = (cat) => {
    setCurrentCategory(cat);
    setOpenModal(true);
  };

  const handleFormSubmit = async () => {
    const selectedMember = tripDetails.team_members.find(
      (m) => m.name === formData.name
    );

    const newExpense = {
      name: formData.name,
      amount: formData.amount,
      description: formData.description,
      profile_picture: selectedMember?.profile_picture || "",
      category: currentCategory,
    };

    const updated = {
      ...expenses,
      [currentCategory]: [...expenses[currentCategory], newExpense],
    };

    setExpenses(updated);
    setOpenModal(false);
    setFormData({ name: "", amount: "", description: "" });

    // Optional: Send to backend
    // await axios.post(`/api/trips/${tripId}/expenses`, newExpense, { headers: { Authorization: `Bearer ${token}` } });
  };

  const CATEGORY_COLORS = {
    transport: "#DF8114",
    accommodation: "#88B116",
    food: "#14BADF",
    activities: "#D90E5F",
  };

  const getColorWithOpacity = (hex, opacity) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Build data from tripDetails
  const budgetData = Object.keys(tripDetails.budget).map((category) => ({
    category,
    budget: tripDetails.budget[category],
    expense: tripDetails.expense[category] || 0,
  }));

  const startDates = generateDateRange(moment(tripDetails.start_date), 90);
  const endDates = generateDateRange(moment(tripDetails.start_date), 90);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useAutoScrollOnHover(startDateRef);
  useAutoScrollOnHover(endDateRef);

  const getTripById = async () => {
    try {
      const response = await axios.get(`/api/trips/${tripId}/destinations`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ0NjUzMjIzLCJleHAiOjE3NDQ2NTY4MjN9.O8PBmfOeBw5otLKU3mHAoYkohX6wHlvGF7COpd9H548`,
        },
      });
      setItinerary(response.data.timeline);
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
        const dynamicOffset = (1400 / 1920) * containerWidth;
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
    <div className="w-full flex flex-row text-white mt-5">
      {/* Start Date Picker */}
      <div className="w-2/5 px flex flex-col h-full">
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
                <span className="text-lg font-semibold">{date.format("D")}</span>
                <span className="text-sm text-myTripSearchBGLite">{date.format("ddd")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-start gap-4 overflow-y-auto custom-scrollbar mt-5">
          <div className="w-full rounded-lg ">
            {itinerary.length > 0 ? (
              itinerary.map((day, idx) => (
                <div
                  key={idx}
                  className="rounded-lg p-8 bg-headerBG h-[600px] mb-5 "
                >
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

                  <ul className="space-y-10 relative border-l-2 border-textCard ml-[23%] mt-6">
                    {day.selected_spots.map((spot, i) => (
                      <li key={i} className="relative pl-6">
                        <div className="absolute left-[-33%] flex items-center gap-1">
                          {(() => {
                            const [hours, minute] = spot.travelTime.split(":");
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

                        <div className="flex items-center gap-4">
                          <div className="flex flex-col w-[80%] gap-2  italic text-md">
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
                            {/* <p className="text-xs text-textCard">
                              {spot.description}
                            </p> */}
                          </div>

                          <div className="flex items-center justify-between gap-5 text-sm text-gray-300  ">
                            {["start", "end"].includes(spot.category) ? (
                              <></>
                            ) : (
                              <>
                                <img src={Moneybox} className="w-8" alt="" />
                                <div className="flex items-center">
                                  $&nbsp;&nbsp;
                                  <input
                                    type="text"
                                    className="bg-textCardDark text-myTripSearchBGLite rounded-lg w-16 h-7 px-2"
                                    maxLength={4}
                                    value={spot.cost}
                                    onFocus={(e) => {
                                      if (spot.cost === 0) {
                                        e.target.value = "";
                                      }
                                    }}
                                    onBlur={(e) => {
                                      if (e.target.value === "") {
                                        e.target.value = 0;
                                      }
                                    }}
                                    onChange={(e) => {
                                      const newCost =
                                        parseFloat(e.target.value) || 0;
                                      const updatedItinerary = [...itinerary];
                                      updatedItinerary[idx].selected_spots[
                                        i
                                      ].cost = newCost;
                                      setItinerary(updatedItinerary);
                                    }}
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
              <p>No itinerary available for this trip.</p>
            )}
          </div>
        </div>
      </div>
      {/* End Date Picker */}
      <div className="w-3/5 px-4 flex flex-col h-full">
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
                    : "bg-calendarView text-white"
                }`}
              >
                <span className="text-lg font-semibold">{date.format("D")}</span>
                <span className="text-sm text-myTripSearchBGLite">{date.format("ddd")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget vs. Expenses Chart */}
        <div className="mt-5 bg-headerBG p-4 rounded-lg h-[330px] flex flex-col">
          <h3 className="text-white text-lg font-semibold font-aldrich mb-10 text-center ">
            Spend <span className="text-topHeader">Analyzer</span>
          </h3>
          <h3 className="text-white text-md font-semibold font-aldrich mb-4 text-center">
            Budget <span className="text-topHeader">V/s</span> Expenses
          </h3>

          {/* Chart container centered horizontally */}
          <div className="flex justify-center flex-1">
            <ResponsiveContainer width="60%" height="100%">
              <BarChart data={budgetData} barCategoryGap={1} barGap={1}>
                <CartesianGrid
                  stroke="#444"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="category" stroke="#ccc" />
                <YAxis>
                  <Label
                    value="USD"
                    angle={-90}
                    position="insideLeft"
                    offset={10}
                    style={{ fill: "#fff", fontSize: 12 }}
                  />
                </YAxis>
                <Tooltip />

                {/* Budget bars */}
                <Bar dataKey="budget" name="Budget" barSize={20}>
                  {budgetData.map((entry, index) => (
                    <Cell
                      key={`budget-${index}`}
                      fill={CATEGORY_COLORS[entry.category] || "#8884d8"}
                    />
                  ))}
                </Bar>

                {/* Expense bars */}
                <Bar dataKey="expense" name="Spent" barSize={20}>
                  {budgetData.map((entry, index) => (
                    <Cell
                      key={`expense-${index}`}
                      fill={getColorWithOpacity(
                        CATEGORY_COLORS[entry.category] || "#8884d8",
                        0.7
                      )}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="min-h-[30vh] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-5">
  {categories.map((cat) => (
    <div key={cat} className="bg-headerBG rounded-lg flex flex-col h-full">
      <div className="flex justify-between items-center">
        <div
          className="h-[38px] ml-4 capitalize text-md w-[70%] mx-auto relative -top-4 text-center text-white font-inria font-semibold flex items-center justify-center rounded-md"
          style={{ backgroundColor: CATEGORY_COLORS[cat] || "#333" }}
        >
          {cat}
        </div>
        <button
          onClick={() => openExpenseModal(cat)}
          className="text-topHeader mt-2 mb-2 rounded-md font-semibold"
        >
          {cat === "transport" ? (
            <img src={Sum} alt="transport icon" />
          ) : cat === "accommodation" ? (
            <img src={addExpAcc} alt="accommodation icon" />
          ) : cat === "food" ? (
            <img src={addExpFood} alt="food icon" />
          ) : cat === "activities" ? (
            <img src={addExpAct} alt="activities icon" />
          ) : null}
        </button>
      </div>

      {/* Content Area */}
      <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 flex m-4 flex-col gap-5 " style={{ maxHeight: '130px' }}>
        {expenses[cat].map((e, idx) => (
          <div key={idx} className="flex items-start space-x-3 w-full ">
            {e.profile_picture && (
              <img
                src={e.profile_picture}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <p className="text-md text-white font-light">{e.name}</p>
              <div className="text-xs text-myTripSearchBGLite">{e.description}:
              <span className="text-xs text-topHeader mt-1">
              ${e.amount}
            </span>
            </div>
            </div>
            </div>
        ))}
      </div>

      {/* Total at the bottom */}
      <div className="mt-4 ml-auto w-[60%] p-1 bg-calendarView rounded-md text-white flex items-center justify-between">
        <span>Total:&nbsp;</span>
        <span className="text-topHeader" style={{ color: CATEGORY_COLORS[cat] || "#333" }}>
          $
          {expenses[cat].reduce(
            (acc, e) => acc + parseFloat(e.amount || 0),
            0
          )}
        </span>
      </div>
    </div>
  ))}
</div>

{openModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="w-[90%] max-w-md bg-textCardDark rounded-lg overflow-hidden">
      <div className="flex flex-col gap-4 p-5">
        <h2 className="text-lg font-bold text-white text-center mb-2">
          Add Expense - {currentCategory}
        </h2>

        {/* Tripmate Dropdown */}
        <div className="flex flex-col mb-2">
          <label className="text-white mb-1">Tripmate</label>
          <select
            className="p-2 bg-textInputBG border-none rounded-md text-white"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          >
            <option value="">Select Member</option>
            {tripDetails.team_members.map((member, idx) => (
              <option key={idx} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="flex flex-col mb-2">
          <label className="text-white mb-1">Amount</label>
          <input
            type="number"
            className="p-2 bg-textInputBG border-none rounded-md text-white"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col mb-2">
          <label className="text-white mb-1">Description</label>
          <textarea
            className="p-2 bg-textInputBG border-none rounded-md text-white"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleFormSubmit}
            className="px-4 py-2 bg-topHeader text-white rounded-md w-1/3"
          >
            Save
          </button>
          <button
            onClick={() => setOpenModal(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md w-1/3"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}
</div>
    </div>
  );
};

export default UpcomingMytrip;
