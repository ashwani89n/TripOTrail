import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import api from "../api/api";
import transport from "../images/TransportSplit.png";
import activity from "../images/ActivitySplit.png";
import food from "../images/FoodSplit.png";
import accom from "../images/AccomSplit.png";
import dayjs from "dayjs";
import "../components/styles/PickSpots.css";

export default function WhoOwesWhom({ tripId }) {
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(true);

  const CATEGORY_ICONS = {
    transport,
    accommodation: accom,
    food,
    activities: activity,
  };

  const groupExpensesByDate = (expenses) => {
    const grouped = {};
    expenses.forEach((exp) => {
      const date = exp.dayDate
        ? dayjs(exp.dayDate).format("DD MMMM, YYYY")
        : "Unknown Date";
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(exp);
    });
    return grouped;
  };

  const fetchData = async () => {
    try {
      const res = await api.get(`/trips/${tripId}/who-owes-whom`);
      const rawData = res.data;

      if(rawData.length == 0){
        setNoData(false);
        return;
      }

      setNoData(true);
      const peopleMap = {};
      rawData.forEach((user) => {
        peopleMap[user.email] = {
          name: user.name,
          email: user.email,
          profile_picture: user.profile_picture,
          net_balance: 0,
          summary: [],
          expenses: user.expenses,
        };
      });

      const pairwiseMap = {};
      rawData.forEach((user) => {
        user.expenses.forEach((exp) => {
          const lender = exp.added_by.email;
          const borrower = user.email;
          if (lender === borrower) return;

          const key = [lender, borrower].sort().join("|");
          const direction = lender < borrower ? 1 : -1;
          const amount = direction * exp.lent - direction * exp.borrowed;

          if (!pairwiseMap[key]) pairwiseMap[key] = [];
          pairwiseMap[key].push({
            amount,
            expense_id: exp.expense_id,
            is_settled: exp.is_settled,
          });
        });
      });

      console.log("1:", rawData);

      Object.values(peopleMap).forEach((u) => (u.summary = []));

      console.log("2:", pairwiseMap);

      for (const key in pairwiseMap) {
        const [a, b] = key.split("|");
        const entries = pairwiseMap[key];
        const net = entries.reduce((acc, x) => acc + x.amount, 0);
        if (net === 0) continue;
      
        const largest = entries.reduce((a, b) => (Math.abs(a.amount) >= Math.abs(b.amount) ? a : b));
        const settled = entries.every((x) => x.is_settled); 
      
        const addSummary = (from, to, amount) => {
          peopleMap[from].summary.push({
            email: to,
            name: peopleMap[to].name,
            profile_picture: peopleMap[to].profile_picture,
            amount,
            expense_id: largest.expense_id,
            settled,
          });
        };

        if (net > 0) {
          addSummary(a, b, net);
          addSummary(b, a, -net);
        } else {
          addSummary(b, a, -net);
          addSummary(a, b, net);
        }
      }

      for (const email in peopleMap) {
        let net = 0;
        peopleMap[email].summary.forEach((s) => {
          if (!s.settled) net += s.amount;
        });
        peopleMap[email].net_balance = net;
      }

      setData(Object.values(peopleMap));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOnSettle = async (expense_id, payer_email, receiver_email) => {
    try {
      await api.put(`/trips/${tripId}/who-owes-whom`, {
        payer_email,
        receiver_email,
      });
      await fetchData(); // Refresh after settling
    } catch (error) {
      console.error("Error settling:", error);
    }
  };

  return (
    <div className="w-full p-6 min-h-screen bg-headerBG text-white">
      <div className="flex items-center justify-center text-2xl font-aldrich text-topHeader mb-8 mt-5">
        <span className="text-white mr-1">Who</span>
        <span>owes</span>
        <span className="text-white ml-1">Whom</span>
      </div>

      {noData ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-5">
        {data.map((user) => (
          <div
            key={user.email}
            className="bg-headerBG rounded-lg flex flex-col h-full col-span-2 p-3"
          >
            <div className="grid grid-cols-2 gap-3">
              {/* LEFT: Expenses */}
              <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
                <div className="flex items-center pl-2 gap-2 py-1 rounded-md mb-2 bg-topHeader">
                  <img
                    src={`http://localhost:5000${user.profile_picture}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border border-myTripSearchBGLite object-cover"
                  />
                  <h2 className="text-md font-normal text-white">{user.name}</h2>
                </div>
                <div className="overflow-y-auto custom-scrollbar pr-2" style={{ maxHeight: "330px" }}>
                  {Object.entries(groupExpensesByDate(user.expenses)).map(
                    ([formattedDate, expenses], i) => (
                      <div key={i} className="mb-3">
                        <div className="text-xs font-aldrich text-textCard mb-1 p-2">
                          {formattedDate}
                        </div>
                        {expenses.map((exp, idx) => (
                          <div
                            key={idx}
                            className="bg-zinc-800 rounded-md p-3 mb-2"
                          >
                            <div className="flex justify-between text-sm text-white">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-10 bg-calendarView rounded-md flex items-center justify-center">
                                  <img
                                    src={CATEGORY_ICONS[exp.category] || transport}
                                    alt={exp.category}
                                    className="w-10 h-7 object-contain"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-white">{exp.comment}</span>
                                  <span className="text-gray-400 text-[10px]">
                                    {exp.added_by.name} Paid: ${exp.total_amount}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-6 mt-2 space-y-1 text-sm">
                                {exp.lent > 0 && (
                                  <div className="flex flex-col text-splitGreen justify-end text-end text-[10px]">
                                    <div>you lent</div>
                                    <div>${exp.lent.toFixed(2)}</div>
                                  </div>
                                )}
                                {exp.borrowed > 0 && (
                                  <div className="flex flex-col text-topHeader justify-end text-end text-[10px]">
                                    <div>you borrowed</div>
                                    <div>${exp.borrowed.toFixed(2)}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* RIGHT: Summary */}
              <div className="bg-zinc-900 rounded-lg p-4 flex flex-col justify-between">
                <p className="text-sm mb-4 text-white">
                  On a whole,{" "}
                  <span className={user.net_balance >= 0 ? "text-topHeader" : "text-splitGreen"}>
                    you {user.net_balance >= 0 ? "are owed" : "owe"} $
                    {Math.abs(user.net_balance).toFixed(2)}
                  </span>
                </p>
                <div className="space-y-3">
                  {user.summary.map((summary, idx) => (
                    <div key={`${summary.email}-${idx}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={`http://localhost:5000${summary.profile_picture}`}
                          alt={summary.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="text-sm">
                          <p className="font-light">{summary.name}</p>
                          <p className={summary.amount > 0 ? "text-splitGreen text-[10px]" : "text-topHeader text-[10px]"}>
                            {summary.amount > 0
                              ? `owes you $${summary.amount.toFixed(2)}`
                              : `you owe $${Math.abs(summary.amount).toFixed(2)}`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleOnSettle(
                            summary.expense_id,
                            summary.email,
                            user.email
                          )
                        }
                        className={`px-3 py-1 text-xs rounded ${
                          summary.settled
                            ? "bg-gray-600 text-white cursor-default"
                            : "bg-topHeader hover:bg-opacity-90"
                        }`}
                        disabled={summary.settled}
                      >
                        {summary.settled ? "Settled" : "Settle"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      ) : (
        <div className="h-full">
      <p className="text-sm text-center text-gray-400 mt-4 italic">
  No expenses added yet. There's nothing to give or receive!
</p>
</div>)}
    </div>
  );
}
