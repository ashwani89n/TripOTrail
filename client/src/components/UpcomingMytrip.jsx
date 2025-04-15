import React, {
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useContext,
} from "react";
import moment from "moment";
import "../components/styles/UpcomingMytrip.css";
import { useParams } from "react-router-dom";
import { tripContext } from "../context/useTripDataContext";
import axios from "axios";
import SpendAnalyzerChart from "../components/SpendAnalyzerChart";
import ExpenseCards from "../components/ExpenseCards";
import CalendarPicker from "../components/CalendarPicker";
import TimelineView from "../components/TimelineView";
import AddExpenseModal from "../components/AddExpenseModal";
import api from "../api/api";



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

const UpcomingMytrip = ({ tripDetails, onClickEmail }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(
    moment(tripDetails.start_date)
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    moment(tripDetails.end_date)
  );
  const { token } = useContext(tripContext);
  const { tripId } = useParams();
  const [itinerary, setItinerary] = useState([]);
  const [errorPopUp, setErrorPopUp] = useState("");

  const categories = ["transport", "accommodation", "activities", "food"];

  const categorizeExpenses = (expenseList) => {
    const catMap = {
      transport: [],
      accommodation: [],
      activities: [],
      food: [],
    };
    expenseList?.forEach((item) => {
      if (catMap[item.category]) {
        catMap[item.category].push(item);
      }
    });
    return catMap;
  };

  const [openModal, setOpenModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const [budgetData, setBudgetData] = useState([]);
  const [formData, setFormData] = useState({
    added_by_name: "",
    amount: "",
    comments: "",
  });
  const [expenses, setExpenses] = useState({
    transport: [],
    accommodation: [],
    activities: [],
    food: [],
  });

  const openExpenseModal = (cat) => {
    setCurrentCategory(cat);
    setOpenModal(true);
  };

  const handleFormSubmit = async () => {
    if (!formData.added_by_name) {
      setErrorPopUp("Please choose the Tripmate");
      return;
    } else if (!formData.amount || parseInt(formData.amount, 10) == 0) {
      setErrorPopUp("Please enter the Amount");
      return;
    } else if (!formData.comments.trim()) {
      setErrorPopUp("Please enter Comments");
      return;
    }

    setErrorPopUp("");

    const selectedMember = tripDetails.team_members.find(
      (m) => m.name === formData.added_by_name
    );

    const newExpensePayload = {
      added_by_name: formData.added_by_name,
      amount: formData.amount,
      comments: formData.comments,
      added_by_profile_picture: selectedMember?.profile_picture || "",
      category: currentCategory,
    };

    try {
      const res = await api.post(
        `/api/trips/${tripId}/expenses`,
        newExpensePayload
      );

      if (res.status === 200 || res.status === 201) {
        const newExpense = res.data.expense;

        const updatedFlatExpenses = [
          ...Object.values(expenses).flat(),
          newExpense,
        ];

        setExpenses(categorizeExpenses(updatedFlatExpenses));
        setBudgetData(
          prepareBudgetData(tripDetails.budget, updatedFlatExpenses)
        );

        tripDetails.expenses = updatedFlatExpenses;
        setFormData({ added_by_name: "", amount: "", comments: "" });
        setOpenModal(false);
      } else {
        setErrorPopUp("Failed to save expense. Please try again.");
      }
    } catch (error) {
      console.error("Error saving expense:", error);
      setErrorPopUp("Something went wrong. Try again.");
    }
  };

  useEffect(() => {
    if (tripDetails?.budget) {
      const initialBudgetData = Object.keys(tripDetails.budget).map(
        (category) => ({
          category,
          budget: tripDetails.budget[category],
          expense: tripDetails.expense[category] || 0,
        })
      );
      setBudgetData(initialBudgetData);
    }
  }, [tripDetails]);

  const startDates = generateDateRange(moment(tripDetails.start_date), 90);
  const endDates = generateDateRange(moment(tripDetails.start_date), 90);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useAutoScrollOnHover(startDateRef);
  useAutoScrollOnHover(endDateRef);

  const buildItineraryHTML = (itinerary) => {
    if (!Array.isArray(itinerary)) return "";
  
    const iconBaseURLs = {
      accomodation: "1136bJw_94LGAOz9zn3xxQVk18w66Lbb1",
      start: "1UqyPGibpaxLqkU4bBkQ4kXyOLhLzKHZD",
      end: "1UqyPGibpaxLqkU4bBkQ4kXyOLhLzKHZD",
      spot: "1UqyPGibpaxLqkU4bBkQ4kXyOLhLzKHZD",
    };
  
    const getCategoryIcon = (category) => {
      const id = iconBaseURLs[category];
      return id ? `https://drive.google.com/uc?export=download&id=${id}` : "📍";
    };
    const getSpotHTML = (spot, index, totalSpots) => {
      const isSpot = spot.category === "spot";
      const icon = getCategoryIcon(spot.category);
      const isLast = index === totalSpots - 1;
    
      return `
        <table style="border-spacing: 0; margin: 0; padding: 0; width: 100%;">
          <tr>
            <!-- Left column: Centered Line and Circle -->
            <td style="width: 32px; text-align: center; vertical-align: top; padding: 0;">
    
              <!-- Circle dot -->
              <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #DF8114; display: inline-block; text-align: center; line-height: 32px; margin-bottom: 4px;">
                <img src="${icon}" alt="${spot.category}" style="width: 18px; height: 18px; display: inline-block; vertical-align: middle;" />
              </div>
    
              <!-- Vertical Line -->
              ${
                !isLast
                  ? `<div style="width: 2px; height: 40px; background-color: #DF8114; margin-left: auto; margin-right: auto; display: block;"></div>`
                  : ''
              }
            </td>
    
            <!-- Right column: Spot Content -->
            <td style="padding-left: 12px; padding-bottom: 28px; font-family: 'Segoe UI', sans-serif;">
              <div style="font-size: 16px; color: rgba(58, 58, 58, 0.8); font-weight: 600;">
                ${spot.name}
              </div>
              ${
                spot.travelTime
                  ? `<div style="font-size: 13px; color: rgba(141, 141, 141, 1); font-weight: 450; font-style: italic;">Start Time: ${spot.travelTime}</div>`
                  : ''
              }
              ${
                isSpot && spot.cost && parseFloat(spot.cost) > 0
                  ? `<div style="font-size: 13px; color: rgba(141, 141, 141, 1); font-weight: 450; font-style: italic;">Budget: ₹${spot.cost}</div>`
                  : '<div style="height:20px;"></div>'
              }
            </td>
          </tr>
        </table>
      `;
    };
    
    const getDayHTML = (day, index) => {
      const formattedDate = moment(day.dayDate).format("MMMM D, YYYY");
      const weekDay = moment(day.dayDate).format("dddd");
  
      const spotsHTML = (day.selected_spots || [])
        .map((spot, idx, arr) => getSpotHTML(spot, idx === arr.length - 1))
        .join("");
  
      return `
        <div style="background: #f0f0f0; padding: 24px; border-radius: 12px; margin-bottom: 20px; font-family: 'Segoe UI', sans-serif; color: #2e2e2e;">
          <div style="font-size: 18px; font-weight: bold; color: #DF8114; margin-bottom: 6px;">
            <span style="color: rgba(58, 58, 58, 0.8);">Day ${index + 1}:</span> ${formattedDate}, <span style="color: rgba(58, 58, 58, 0.8);">${weekDay}</span>
          </div>
          <div style="margin-top: 16px;">
            ${spotsHTML}
          </div>
        </div>
      `;
    };
  
    return itinerary.map(getDayHTML).join("");
  };
  
  


  const getTripById = async () => {
    try {
      const response = await api.get(`/trips/${tripId}/destinations`);
      setItinerary(response.data.timeline);
      if (onClickEmail && typeof onClickEmail === "function") {
        const formattedHTML = buildItineraryHTML(response.data.timeline);
        onClickEmail(formattedHTML);
      }
      setExpenses(categorizeExpenses(response.data.expenses));
      setBudgetData(
        prepareBudgetData(response.data.budget, response.data.expenses)
      );
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (!tripId) return;
    getTripById();
  }, [tripId]);

  const prepareBudgetData = (budget, expensesArr) => {
    const expenseMap = expensesArr.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount || 0);
      return acc;
    }, {});
    return Object.keys(budget).map((category) => ({
      category,
      budget: budget[category],
      expense: expenseMap[category] || 0,
    }));
  };

  return (
    <div className="w-full flex flex-row text-white mt-5">
      {/* Start Date Picker */}
      <div className="w-2/5 px flex flex-col h-full">
        <CalendarPicker
          type="start"
          selectedDate={selectedStartDate}
          onSelectDate={setSelectedStartDate}
          dateList={startDates}
          scrollRef={startDateRef}
          dataOffset={0}

        />

        <TimelineView
          itinerary={itinerary}
          tripStartDate={tripDetails.start_date}
          onCostChange={(dayIdx, spotIdx, newCost) => {
            const updated = [...itinerary];
            updated[dayIdx].selected_spots[spotIdx].cost = parseFloat(
              newCost || 0
            );
            setItinerary(updated);
          }}
        />
      </div>
      <div className="w-3/5 pl-3 flex flex-col h-full">
        <CalendarPicker
          type="end"
          selectedDate={selectedEndDate}
          onSelectDate={setSelectedEndDate}
          dateList={endDates}
          scrollRef={endDateRef}
          dataOffset={(800 / 1920) * window.innerWidth}
        />
        <SpendAnalyzerChart budgetData={budgetData} />
        <ExpenseCards
          categories={categories}
          expenses={expenses}
          openExpenseModal={openExpenseModal}
        />

        {openModal && (<AddExpenseModal
          open={openModal}
          currentCategory={currentCategory}
          formData={formData}
          errorPopUp={errorPopUp}
          teamMembers={tripDetails.team_members}
          onChange={(field, value) =>
            setFormData({ ...formData, [field]: value })
          }
          onClose={() => {
            setFormData({ added_by_name: "", amount: "", comments: "" });
            setErrorPopUp("");
            setOpenModal(false);
          }}
          onSubmit={handleFormSubmit}
        /> )}
      </div> 
    </div>
  );
};

export default UpcomingMytrip;