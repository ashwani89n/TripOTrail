import React, { useState, useEffect } from "react";
import moment from "moment";
import "../components/styles/UpcomingMytrip.css";
import { useParams } from "react-router-dom";
import SpendAnalyzerChart from "../components/SpendAnalyzerChart";
import ExpenseCards from "../components/ExpenseCards";
import CalendarPicker from "../components/CalendarPicker";
import TimelineView from "../components/TimelineView";
import AddExpenseModal from "../components/AddExpenseModal";
import api from "../api/api";
import Attachments from "./Attachments";
import buildItineraryHTML from "../utils/buildItineraryHTML";
import EditPrompt from "./EditPrompt";
import WhoOwesWhom from "./WhoOwesWhom";

const UpcomingMytrip = ({
  tripDetails,
  onClickEmail,
  showSpendPrompt,
  showAttachPrompt,
  showEditPrompt,
  showSplitPrompt,
}) => {
  const { tripId } = useParams();
  const [itinerary, setItinerary] = useState([]);
  const [errorPopUp, setErrorPopUp] = useState("");
  const [error, setError] = useState("");
  const [isValidDate, setIsValidDate] = useState(true);
  const [startDate, setStartDate] = useState(
    tripDetails?.start_date || new Date().toISOString()
  );
  const [endDate, setEndDate] = useState(
    tripDetails?.end_date || new Date().toISOString()
  );

  const resetToOriginalDates = () => {
    console.log(
      "resetting calendar to original dates",
      tripDetails.start_date,
      tripDetails.end_date
    );
    setStartDate(tripDetails.start_date);
    setEndDate(tripDetails.end_date);
    setValidStartDate(tripDetails.start_date);
    setValidEndDate(tripDetails.end_date);
  };

  // Storing the last valid dates separately to retain them when needed
  const [validStartDate, setValidStartDate] = useState(startDate);
  const [validEndDate, setValidEndDate] = useState(endDate);

  // Categories array
  const categories = ["transport", "accommodation", "activities", "food"];

  useEffect(() => {
    if (tripDetails?.start_date) {
      setStartDate(tripDetails.start_date);
      setValidStartDate(tripDetails.start_date);
    }
    if (tripDetails?.end_date) {
      setEndDate(tripDetails.end_date);
      setValidEndDate(tripDetails.end_date);
    }
  }, [tripDetails]);

  // Conditional render based on validity
  if (!isValidDate) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

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
      added_by_email: selectedMember?.email,
      added_by_profile_picture: selectedMember?.profile_picture || "",
      category: currentCategory,
    };

    try {
      const res = await api.post(
        `/trips/${tripId}/expenses`,
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
    <div className="w-full text-white mt-5 h-full flex flex-col space-y-4">
      {!showSplitPrompt ? (<>
      <div className="w-full flex flex-row gap-4">
        {/* Start Calendar */}

        <div className="w-2/5 pr-3">
          <CalendarPicker
            type="start"
            selectedDate={startDate}
            editable={showEditPrompt}
            dataOffset={0}
            onChangeDate={(newDate) => {
              const newMoment = moment(newDate);
              if (newMoment.isSameOrBefore(moment(endDate), "day")) {
                setStartDate(newDate);
                setValidStartDate(newDate);
                setError("");
              } else {
                setStartDate(newDate);
                setError("Start date must be before or equal to end date.");
              }
            }}
            maxDate={endDate}
          />
          {error && (
            <p className="text-red-400 text-sm text-center mt-1">{error}</p>
          )}
        </div>

        {/* End Calendar */}
        <div className="w-3/5 pr-5">
          <CalendarPicker
            type="end"
            selectedDate={endDate}
            editable={showEditPrompt}
            dataOffset={(800 / 1920) * window.innerWidth}
            onChangeDate={(newDate) => {
              const newMoment = moment(newDate);
              if (newMoment.isSameOrAfter(moment(startDate), "day")) {
                setEndDate(newDate);
                setValidEndDate(newDate);
                setError("");
              } else {
                setEndDate(newDate);
                setError("End date must be after or equal to start date.");
              }
            }}
            minDate={startDate}
          />
          {error && (
            <p className="text-red-400 text-sm text-center mt-1">{error}</p>
          )}
        </div>
      </div>

      {/*   ROW 2: Timeline + Right Panel (Charts, EditPrompt, Attachments) */}
      <div className="w-full flex flex-row gap-4 flex-1 overflow-hidden">
        {/* TimelineView — hidden when editing */}
        {!showEditPrompt && (
          <div className="w-2/5 h-full overflow-y-auto pr-2">
            <TimelineView
              itinerary={itinerary}
              tripStartDate={tripDetails.start_date}
            />
          </div>
        )}

        {/* Right panel (expands to full if editing) */}
        <div
          className={`${
            showEditPrompt ? "w-full" : "w-3/5"
          } h-full overflow-y-auto`}
        >
          {showAttachPrompt ? (
            <Attachments id={tripDetails.trip_id} />
          ) : showSpendPrompt ? (
            <>
              <SpendAnalyzerChart budgetData={budgetData} />
              <ExpenseCards
                categories={categories}
                expenses={expenses}
                openExpenseModal={openExpenseModal}
              />
            </>
          ) : showEditPrompt ? (
            <EditPrompt
              itinerary={itinerary}
              startDt={validStartDate}
              endDt={validEndDate}
              tripId={tripId}
              resetDates={resetToOriginalDates}
            />
          ) : null}

          {openModal && (
            <AddExpenseModal
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
            />
          )}
        </div>
      </div>
        </> ):(      <div className="w-full flex flex-row gap-4">
          <WhoOwesWhom/>
        </div>)}
    </div>
  );
};

export default UpcomingMytrip;
