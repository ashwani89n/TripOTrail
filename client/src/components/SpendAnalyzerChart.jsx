import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Label
} from 'recharts';

const SpendAnalyzerChart = ({ budgetData }) => {
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

  return (
    <div className="mt-5 bg-headerBG p-4 rounded-lg h-[330px] flex flex-col">
      {/* <h3 className="text-white text-lg font-semibold font-aldrich mb-10 text-center">
        Spend <span className="text-topHeader">Analyzer</span>
      </h3> */}
      <h3 className="text-white text-lg font-semibold font-aldrich mb-4 mt-5 text-center">
        Budget <span className="text-topHeader">V/s</span> Expenses
      </h3>

      <div className="flex justify-center flex-1">
        <ResponsiveContainer width="60%" height="90%">
          <BarChart data={budgetData} barCategoryGap={1} barGap={1}>
            <CartesianGrid stroke="#444" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="category" stroke="#ccc"/>
            <YAxis>
              <Label value="USD" angle={-90} position="insideLeft" offset={10} style={{ fill: "#fff", fontSize: 12 }} />
            </YAxis>
            <Tooltip />
            <Bar dataKey="budget" name="Budget" barSize={20}>
              {budgetData.map((entry, index) => (
                <Cell key={`budget-${index}`} fill={CATEGORY_COLORS[entry.category] || "#8884d8"} />
              ))}
            </Bar>
            <Bar dataKey="expense" name="Spent" barSize={20}>
              {budgetData.map((entry, index) => (
                <Cell key={`expense-${index}`} fill={getColorWithOpacity(CATEGORY_COLORS[entry.category] || "#8884d8", 0.7)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendAnalyzerChart;
