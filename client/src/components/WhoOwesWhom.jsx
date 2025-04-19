import { useEffect, useState } from "react";
import { CircleDollarSign, ArrowUp, ArrowDown } from "lucide-react";
import api from "../api/api";

export default function WhoOwesWhom() {
  const [data, setData] = useState([]);
  const tripId = 10;

  useEffect(() => {
    api
      .get(`/trips/${tripId}/who-owes-whom`)
      .then((res) => {
        const rawData = res.data;

        // Build a map of email to person for easy lookup
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

        // Calculate net balances between people
        rawData.forEach((user) => {
          user.expenses.forEach((exp) => {
            if (exp.lent > 0) {
              peopleMap[user.email].net_balance += exp.lent;
            }
            if (exp.borrowed > 0) {
              peopleMap[user.email].net_balance -= exp.borrowed;
            }
          });
        });

        // Build pairwise summaries
        const emailList = Object.keys(peopleMap);
        const summaryMap = {};

        rawData.forEach((user) => {
          summaryMap[user.email] = {};
        });

        rawData.forEach((user) => {
          user.expenses.forEach((exp) => {
            const lender = exp.added_by.email;

            if (exp.lent > 0 && lender !== user.email) {
              // user lent to someone else (they’re a lender)
              summaryMap[user.email][lender] =
                (summaryMap[user.email][lender] || 0) + exp.lent;
            }

            if (exp.borrowed > 0 && lender !== user.email) {
              // user borrowed from someone else (they’re a borrower)
              summaryMap[user.email][lender] =
                (summaryMap[user.email][lender] || 0) - exp.borrowed;
            }
          });
        });

        // Convert summary map to list
        for (const userEmail in summaryMap) {
          const summaries = [];
          for (const otherEmail in summaryMap[userEmail]) {
            if (userEmail === otherEmail) continue;
            const amount = summaryMap[userEmail][otherEmail];
            if (amount !== 0) {
              summaries.push({
                email: otherEmail,
                name: peopleMap[otherEmail].name,
                profile_picture: peopleMap[otherEmail].profile_picture,
                amount,
                settled: false,
              });
            }
          }
          peopleMap[userEmail].summary = summaries;
        }

        setData(Object.values(peopleMap));
        console.log("data:", data);
      })
      .catch((err) => console.error("Error fetching splits:", err));
  }, [tripId]);

  return (
    <div className="p-6 min-h-screen bg-headerBG text-white">
      <div className="flex items-center justify-center text-2xl font-aldrich text-topHeader mb-8 mt-5">
        <span className="text-white mr-1">Who</span>
        <span>owes</span>
        <span className="text-white ml-1">Whom</span>
      </div>
        
      <div className="grid grid-cols-4 gap-6">
  {data.map((user) => {
    const cat = user.expenses?.[0]?.category || "default";

    return (
      <div key={user.email} className="col-span-2 grid grid-cols-2 gap-4">
        {/* HEADER */}
        <div className="col-span-2 -mb-2">
          <div
            className="flex items-center gap-4 px-4 py-2 rounded-md"
            style={{
              backgroundColor: "#333",
            }}
          >
            <img
              src={user.profile_picture}
              alt={user.name}
              className="w-10 h-10 rounded-full border object-cover"
            />
            <h2 className="text-lg font-semibold text-white">
              {user.name}
            </h2>
          </div>
        </div>

        {/* LEFT CARD: Expenses */}
        <div className="bg-zinc-900 rounded-xl p-5 space-y-4">
          {user.expenses.map((exp) => (
            <div key={exp.expense_id} className="bg-zinc-800 rounded-md p-3">
              <div className="flex justify-between text-sm text-white">
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="text-orange-400 w-4 h-4" />
                  <span>{exp.category}</span>
                  <span className="italic text-gray-400">({exp.comment})</span>
                </div>
                <span className="text-gray-400 text-xs">
                  Paid by {exp.added_by.name}
                </span>
              </div>

              <div className="ml-6 mt-2 space-y-1 text-sm">
                {exp.lent > 0 && (
                  <div className="text-green-400 flex items-center gap-1">
                    <ArrowUp className="w-3 h-3" />
                    You lent ${exp.lent.toFixed(2)}
                  </div>
                )}
                {exp.borrowed > 0 && (
                  <div className="text-red-400 flex items-center gap-1">
                    <ArrowDown className="w-3 h-3" />
                    You borrowed ${exp.borrowed.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT CARD: Summary */}
        <div className="bg-zinc-900 rounded-xl p-5 flex flex-col justify-between">
          <p className="text-green-400 text-sm mb-4">
            On a whole, you are {user.net_balance >= 0 ? 'owed' : 'owe'}{" "}
            <span className="font-semibold">
              ${Math.abs(user.net_balance).toFixed(2)}
            </span>
          </p>
          <div className="space-y-3">
            {user.summary.map((summary) => (
              <div key={summary.email} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={summary.profile_picture}
                    alt={summary.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{summary.name}</p>
                    <p className={summary.amount > 0 ? 'text-green-400' : 'text-red-400'}>
                      {summary.amount > 0
                        ? `owes you $${summary.amount.toFixed(2)}`
                        : `you owe $${Math.abs(summary.amount).toFixed(2)}`}
                    </p>
                  </div>
                </div>
                <button
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    summary.settled
                      ? 'bg-gray-600 text-white cursor-default'
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {summary.settled ? 'Settled' : 'Settle'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  })}
</div>

    </div>
  );
}
