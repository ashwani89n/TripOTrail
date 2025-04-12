import React from "react";
import BudgetCategoryChart from "./BudgetCategoryChart";


const BudgetCharts = ({ budget, expense }) => {
  const COLORS = {
    Transportation: "#f57c00",
    Accomodation: "#8bc34a",
    Food: "#00bcd4",
    Activities: "#e91e63",
  };
  const categories = Object.keys(budget);
  return (
    <div className="grid grid-cols-2 gap-4 bg-[#111] p-4 rounded-xl">
      {categories.map((category) => (
        <BudgetCategoryChart
          key={category}
          category={category}
          budget={budget[category]}
          expense={expense[category] || 0}
          color={COLORS[category]}
        />
      ))}
    </div>
  );
};

export default BudgetCharts;