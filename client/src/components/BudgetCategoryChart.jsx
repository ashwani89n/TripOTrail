import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetCategoryChart = ({ category, budget, expense, color }) => {
  const remaining = Math.max(budget - expense, 0);

  const data = {
    labels: ["Spent", "Remaining"],
    datasets: [
      {
        data: [expense, remaining],
        backgroundColor: [color, "#333"], // color and gray
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `$${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center text-white">
      
      <div className="text-xs capitalize">{category}</div>
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
