import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetCategoryChart = ({ category, budget, expense, color }) => {
const isEmpty = expense === 0 && budget === 0;
const safeExpense = isEmpty ? 1 : expense;
const safeRemaining = isEmpty ? 0 : Math.max(budget - expense, 0);


const data = {
  labels: [],
  datasets: [
    {
      data: [safeExpense, safeRemaining],
      backgroundColor: [isEmpty ? "#444" : color, "#333"],
      borderWidth: 0,
    },
  ],
};


  const options = {
    cutout: "80%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }, // turn off tooltip completely if you want
    },
  };

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div className="text-[7px] capitalize">{console.log(category)}{category==="accommodation"? "Stay": category}</div>
      <div className="w-8 h-8 my-1">
        <Doughnut data={data} options={options} />
      </div>
      <div className="text-[7px] text-gray-400">
        <span style={{ color }}>{`$${expense}`}</span> / ${budget}
      </div>
    </div>
  );
};


export default BudgetCategoryChart;
