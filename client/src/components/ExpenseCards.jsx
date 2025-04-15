import React from 'react';
import Sum from "../images/Sum.png";
import addExpAcc from "../images/AddExpenseAccomodation.png";
import addExpAct from "../images/AddExpenseActivity.png";
import addExpFood from "../images/AddExpenseFood.png";

const ExpenseCards = ({ categories, expenses, openExpenseModal }) => {
  const CATEGORY_COLORS = {
    transport: "#DF8114",
    accommodation: "#88B116",
    food: "#14BADF",
    activities: "#D90E5F",
  };

  return (
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
            {expenses[cat]?.map((e, idx) => (
              <div key={idx} className="flex items-start space-x-3 w-full ">
                {e.added_by_profile_picture && (
                  <img
                    src={e.added_by_profile_picture}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="text-md text-white font-light">{e.added_by_name}</p>
                  <div className="text-xs text-myTripSearchBGLite">{e.comments}:
                    <span className="text-xs text-topHeader mt-1">
                      ${e.amount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 ml-auto w-[60%] p-1 bg-calendarView rounded-md text-white flex items-center justify-between">
            <span>Total:&nbsp;</span>
            <span className="text-topHeader" style={{ color: CATEGORY_COLORS[cat] || "#333" }}>
              $
              {(expenses[cat] || []).reduce((acc, e) => acc + parseFloat(e.amount || 0), 0)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseCards;
