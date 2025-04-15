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
      const res = await axios.post(
        `/api/trips/${tripId}/expenses`,
        newExpensePayload,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ0Njk0Nzk4LCJleHAiOjE3NDQ2OTgzOTh9.CN0P53iWn9500luCu_i6PtcvgST60EW9r9iqVpWVAzs`,
          },
        }
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

  const buildItineraryHTML = (itinerary, startDate) => {
    if (!Array.isArray(itinerary)) return "";
  
    return itinerary
      .map((day, index) => {
        const formattedDate = moment(day.dayDate || startDate).format("MMMM D, YYYY");
        const spots = day.selected_spots
          .map(
            (spot) => `<li>📍 ${spot.name}${spot.cost ? ` – ₹${spot.cost}` : ""}</li>`
          )
          .join("");
  
        return `
          <div style="background: #f4faff; padding: 15px 20px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 10px; color: #1a73e8;">🗓️ Day ${index + 1} – ${formattedDate}</h3>
            <ul style="padding-left: 20px; margin: 0; line-height: 1.6;">
              ${spots}
            </ul>
          </div>
        `;
      })
      .join("");
  };

  const getTripById = async () => {
    try {
      const response = await axios.get(`/api/trips/${tripId}/destinations`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ0Njk0Nzk4LCJleHAiOjE3NDQ2OTgzOTh9.CN0P53iWn9500luCu_i6PtcvgST60EW9r9iqVpWVAzs`,
        },
      });
      setItinerary(response.data.timeline);
      if (onClickEmail && typeof onClickEmail === "function") {
        const formattedHTML = buildItineraryHTML(response.data.timeline, tripDetails.start_date);
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
