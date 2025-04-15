import React from "react";
import BudgetCategoryChart from "./BudgetCategoryChart";
<<<<<<< HEAD
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = {
  transport: "#DF8114",
  accommodation: "#88B116",
  food: "#14BADF",
  activities: "#D90E5F",
};

const BudgetCharts = ({ budget, expense, showBudgetVsExpense }) => {
  const categories = Object.keys(budget);

  if (showBudgetVsExpense) {
    return (
      <div className="grid grid-cols-2 gap-4 rounded-xl">
        {categories.map((category) => (
          <BudgetCategoryChart
            key={category}
            category={category}
            budget={budget[category]}
            expense={expense[category] || 0}
            color={COLORS[category]}
          />
          
        ))
        }
      </div>
    );
  } else {
    const totalBudget = categories.map((cat) => budget[cat]);
    const data = {
      labels: categories,
      datasets: [
        {
          data: totalBudget,
          backgroundColor: categories.map((cat) => COLORS[cat]),
          borderWidth: 0,
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#fff",
            font: { size: 10 },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: $${context.raw}`;
            },
          },
        },
      },
      cutout: "80%",
    };

    return (
      <div className="bg-darkBG p-2 rounded-xl flex flex-col items-center justify-center">
        <div className="w-28 h-28">
          <Doughnut data={data} options={options} />
        </div>
        <p className="text-white text-xs mt-2">Budget Distribution</p>
      </div>
    );
  }
};

export default BudgetCharts;
=======


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
>>>>>>> origin/main
