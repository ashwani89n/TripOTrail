const pool = require("../database/db");
<<<<<<< HEAD

exports.getDestinations = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    console.log("Received tripId for GET:", tripId);

    if (!tripId || isNaN(tripId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid trip ID in URL." });
    }

    const destinationsResult = await pool.query(
      `SELECT destination_id, name, category, cost, duration, travel_time, day_date, week_day, order_index
             FROM destinations
             WHERE trip_id = $1
             ORDER BY day_date ASC, order_index ASC`,
      [tripId]
    );

    const expensesResult = await pool.query(
      `SELECT added_by_name, added_by_profile_picture, category, comments, amount
             FROM expenses 
             WHERE trip_id = $1`,
      [tripId]
    );

    console.log("expensesResult:", expensesResult);

    const expenses = expensesResult.rows.map((expense) => ({
      added_by_name: expense.added_by_name,
      added_by_profile_picture: expense.added_by_profile_picture || null,
      category: expense.category,
      comments: expense.comments,
      amount: expense.amount || 0
    }));

    const expCatResult = await pool.query(
        `SELECT category, SUM(amount) AS total
         FROM expenses
         WHERE trip_id = $1
         GROUP BY category`,
        [tripId]
      );
    
      const expense_by_category = {};
      for (const row of expCatResult.rows) {
        const amount = parseFloat(row.total);
        expense_by_category[row.category] = amount;
      }
    // const expense_by_category = expCatResult.rows;
    

    const budgetResult = await pool.query(
        `SELECT category, SUM(amount) AS total
         FROM budget
         WHERE trip_id = $1
         GROUP BY category`,
        [tripId]
      );
      const budget = {};
      let totalBudget = 0;
      for (const row of budgetResult.rows) {
        console.log(row);
        const amount = parseFloat(row.total);
        budget[row.category] = amount;
        totalBudget += amount;
      }

      // Get team members
      const teamResult = await pool.query(
        "SELECT name, email, profile_picture FROM tripmates WHERE trip_id = $1",
        [tripId]
      );
      const team_members = teamResult.rows;

     // Group destinations by day
     const timelineMap = new Map();

     for (let dest of destinationsResult.rows) {
         const dayKey = dest.day_date.toISOString();

         if (!timelineMap.has(dayKey)) {
             timelineMap.set(dayKey, {
                 dayDate: dest.day_date,
                 weekDay: dest.week_day,
                 selected_spots: []
             });
         }

         timelineMap.get(dayKey).selected_spots.push({
             name: dest.name,
             category: dest.category,
             cost: dest.cost,
             duration: dest.duration || {},
             travelTime: dest.travel_time,
             order_index: dest.order_index
         });
     }
    
    // Convert Map to sorted array
    const timeline = Array.from(timelineMap.values()).sort(
      (a, b) => new Date(a.dayDate) - new Date(b.dayDate)
    );

    res.status(200).json({
      status: "success",
      timeline,
      budget,
      expenses,
      expense_by_category,
      team_members
    });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.addDestination = async (req, res) => {
  try {
    const { tripId } = req.params;
    console.log("trip id ", tripId);
    const { timeline, budget, team_members, status } = req.body;
    // const optimized_spots = aStarOptimizedRoute(selected_spots);
    // optimized_spots.forEach((spot, index) => {
    //     spot.order_index = index + 1; // starting from 1
    // });

    let insertedDestinations = [];
    // console.log(optimized_spots)
    for (let day of timeline) {
      for (let spot of day.selected_spots) {
        const destinationResult = await pool.query(
          `INSERT INTO destinations (trip_id, name, category, cost, duration, travel_time, day_date, week_day, order_index) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
          [
            tripId,
            spot.name,
            spot.category,
            spot.cost,
            spot.duration,
            spot.travelTime,
            day.dayDate, // Adding dayDate for each spot
            day.weekDay,
            spot.order_index, // Ensure you set an order_index or calculate it here
          ]
        );
        insertedDestinations.push(destinationResult.rows[0]);
      }
    }
    let insertedBudgets = [];
    if (budget && typeof budget === "object") {
      for (let [category, amount] of Object.entries(budget)) {
        const budgetResult = await pool.query(
          `INSERT INTO budget (trip_id, category, amount) VALUES ($1, $2, $3) RETURNING *`,
          [tripId, category, amount]
        );
        insertedBudgets.push(budgetResult.rows[0]);
      }
    }

    let insertedTeamMembers = [];

    for (let member of team_members) {
      console.log(member.photo);
      const teamMemberResult = await pool.query(
        `INSERT INTO tripmates (trip_id, name, email, profile_picture) VALUES ($1, $2, $3, $4) RETURNING *`,
        [tripId, member.name, member.email, member.photo]
      );
      insertedTeamMembers.push(teamMemberResult.rows[0]);
    }

    await pool.query(`UPDATE trips SET status = $1 WHERE trip_id = $2`, [
      status,
      tripId,
    ]);

    res.status(201).json({
      status: "success",
      destinations: insertedDestinations,
      budget: budget,
      team_members: insertedTeamMembers,
      message: "Destinations, budget, and team members added successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.deleteDestination = async (req, res) => {
  try {
    const { tripId, destinationId } = req.params;
    const result = await pool.query(
      "DELETE FROM destinations WHERE destination_id = $1 AND trip_id = $2 RETURNING *",
      [destinationId, tripId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
=======
// const haversine = require('haversine-distance');

// function getDistance(from, to) {
//     return haversine(
//         { lat: from.latitude, lon: from.longitude },
//         { lat: to.latitude, lon: to.longitude }
//     );
// }
// function aStarOptimizedRoute(spots) {
//     const start = spots.find(spot => spot.position === "start");
//     const end = spots.find(spot => spot.position === "end");
//     const betweens = spots.filter(spot => spot.position === "between");

//     const openList = [{
//         path: [start],
//         cost: 0,
//         heuristic: getDistance(start, end)
//     }];

//     let bestPath = null;

//     while (openList.length > 0) {
//         openList.sort((a, b) => (a.cost + a.heuristic) - (b.cost + b.heuristic));
//         const current = openList.shift();

//         if (current.path.length === betweens.length + 1) {
//             const totalCost = current.cost + getDistance(current.path[current.path.length - 1], end);
//             const completePath = [...current.path, end];
//             if (!bestPath || totalCost < bestPath.cost) {
//                 bestPath = {
//                     path: completePath,
//                     cost: totalCost
//                 };
//             }
//             continue;
//         }

//         for (let spot of betweens) {
//             if (current.path.includes(spot)) continue;

//             const last = current.path[current.path.length - 1];
//             const newCost = current.cost + getDistance(last, spot);
//             const newHeuristic = getDistance(spot, end);

//             openList.push({
//                 path: [...current.path, spot],
//                 cost: newCost,
//                 heuristic: newHeuristic
//             });
//         }
//     }

//     return bestPath?.path || spots;
// }

exports.getDestinations = async (req, res) => {
    try {
        const tripId = parseInt(req.params.tripId, 10);
        console.log("Received tripId for GET:", tripId);

        if (!tripId || isNaN(tripId)) {
            return res.status(400).json({ status: "error", message: "Invalid trip ID in URL." });
        }
        const destinationsResult = await pool.query(
            `SELECT destination_id, name, address, image, duration, cost, start_time
             FROM destinations WHERE trip_id = $1`,
            [tripId]
        );
        const expensesResult = await pool.query(
            `SELECT e.added_by_name, u.profile_picture, e.category, e.comments
             FROM expenses e
             LEFT JOIN tripmates u ON e.added_by_name = u.name AND u.trip_id = $1
             WHERE e.trip_id = $1`,
            [tripId]
        );
        const selectedSpots = destinationsResult.rows.map((destination) => ({
            id: destination.destination_id,
            name: destination.name,
            address: destination.address,
            image: destination.image,
            duration: destination.duration,
            cost: destination.cost
        }));

        const addedExpense = expensesResult.rows.map((expense) => ({
            added_by_name: expense.added_by_name,
            added_by_profile_picture: expense.profile_picture || null, 
            category: expense.category,
            comments: expense.comments
        }));

        res.status(200).json({
            start_time: destinationsResult.rows.length > 0 ? destinationsResult.rows[0].start_time : null,
            selected_spots: selectedSpots,
            added_expense: addedExpense
        });

    } catch (error) {
        console.error("Error fetching destinations:", error);
        res.status(500).json({ status: "error", error: error.message });
    }
};

exports.addDestination = async (req, res) => {
    try {
        const { tripId } = req.params;
        console.log("trip id ", tripId)
        const { timeline, budget, team_members, status } = req.body;
        // const optimized_spots = aStarOptimizedRoute(selected_spots);
        // optimized_spots.forEach((spot, index) => {
        //     spot.order_index = index + 1; // starting from 1
        // });


        let insertedDestinations = [];
        // console.log(optimized_spots)
        for (let day of timeline) {
            for (let spot of day.selected_spots) {
                const destinationResult = await pool.query(
                    `INSERT INTO destinations (trip_id, name, category, cost, duration, travel_time, day_date, week_day, order_index) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                    [
                        tripId,
                        spot.name,
                        spot.category,
                        spot.cost,
                        spot.duration,
                        spot.travelTime,
                        day.dayDate, // Adding dayDate for each spot
                        day.weekDay,
                        spot.order_index ,// Ensure you set an order_index or calculate it here
                    ]
                );
                insertedDestinations.push(destinationResult.rows[0]);
            }
        }
        let insertedBudgets = [];
        if (budget && typeof budget === "object") {
            for (let [category, amount] of Object.entries(budget)) {
                const budgetResult = await pool.query(
                    `INSERT INTO budget (trip_id, category, amount) VALUES ($1, $2, $3) RETURNING *`,
                    [tripId, category, amount]
                );
                insertedBudgets.push(budgetResult.rows[0]);
            }
        }

        let insertedTeamMembers = [];
        for (let member of team_members) {
            const teamMemberResult = await pool.query(
                `INSERT INTO tripmates (trip_id, name, email, profile_picture) VALUES ($1, $2, $3, $4) RETURNING *`,
                [tripId, member.name, member.email, member.profile_picture]
            );
            insertedTeamMembers.push(teamMemberResult.rows[0]);
        }

        await pool.query(
            `UPDATE trips SET status = $1 WHERE trip_id = $2`,
            [status, tripId]
        );

        res.status(201).json({
            status: "success",
            destinations: insertedDestinations,
            budget: budget,
            team_members: insertedTeamMembers,
            message: "Destinations, budget, and team members added successfully"
        });

    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

exports.deleteDestination = async (req, res) => {
    try {
        const { tripId, destinationId } = req.params;
        const result = await pool.query(
            "DELETE FROM destinations WHERE destination_id = $1 AND trip_id = $2 RETURNING *",
            [destinationId, tripId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Destination not found" });
        }

        res.status(200).json({ message: "Destination deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
>>>>>>> origin/main
};