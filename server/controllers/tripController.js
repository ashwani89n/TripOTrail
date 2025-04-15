const pool = require("../database/db");
const dayjs = require("dayjs");

exports.getTrips = async (req, res) => {
<<<<<<< HEAD
  console.log("✅ getTrips called");
  try {
    console.log("✅ getTrips ty called");
    const userId = req.user.id;
  //   const tripResult = await pool.query(
  //       'SELECT * FROM trips WHERE user_id = $1 AND status = $2',
  // [userId, 'Confirm']
  //     );
    const tripResult = await pool.query(
      "SELECT * FROM trips WHERE user_id = $1 AND status = $2",
      [userId, "Confirm"]
    );
    const trips = [];
    console.log("Get:", tripResult.rows, userId);

    for (const trip of tripResult.rows) {
      const { trip_id: tripId } = trip;
      const budgetResult = await pool.query(
        `SELECT category, SUM(amount) AS total
=======
    console.log("✅ getTrips called");
  try {
    const userId = req.user.id;
    const tripResult = await pool.query(
        'SELECT * FROM trips WHERE user_id = $1',
        [userId]
      );
      const trips = [];

    for (const trip of tripResult.rows) {

      const { trip_id: tripId } = trip;
      const budgetResult = await pool.query(
       `SELECT category, SUM(amount) AS total
>>>>>>> origin/main
         FROM budget
         WHERE trip_id = $1
         GROUP BY category`,
        [tripId]
      );
      const budget = {};
      let totalBudget = 0;
      for (const row of budgetResult.rows) {
<<<<<<< HEAD
        console.log(row);
=======
        console.log(row)
>>>>>>> origin/main
        const amount = parseFloat(row.total);
        budget[row.category] = amount;
        totalBudget += amount;
      }

      // Get total expense
      const expenseResult = await pool.query(
        `SELECT category, SUM(amount) AS total
         FROM expenses
         WHERE trip_id = $1
         GROUP BY category`,
        [tripId]
      );
<<<<<<< HEAD
      console.log(tripId);
=======
      console.log(tripId)
>>>>>>> origin/main
      console.log("🧪 expenseResult.rows:", expenseResult.rows);
      const expense = {};
      let totalExpense = 0;
      for (const row of expenseResult.rows) {
<<<<<<< HEAD
        console.log(row);
=======
        console.log(row)
>>>>>>> origin/main
        const amount = parseFloat(row.total);
        expense[row.category] = amount;
        totalExpense += amount;
      }

<<<<<<< HEAD
      // Get media
      const fileType = "image";
      const mediaResult = await pool.query(
        `SELECT file_url FROM media WHERE trip_id = $1 AND file_type = $2`,
        [tripId, fileType]
      );
      const media = mediaResult.rows.map((row) => row.file_url);

      console.log(tripId);
      console.log("🧪 mediaResult.rows:", mediaResult.rows);

      // Get team members
      const teamResult = await pool.query(
        "SELECT name, email, profile_picture FROM tripmates WHERE trip_id = $1",
=======

      // Get team members
      const teamResult = await pool.query(
        'SELECT name, email FROM tripmates WHERE trip_id = $1',
>>>>>>> origin/main
        [tripId]
      );
      const team_members = teamResult.rows;
      const today = dayjs();

      const startDate = dayjs(trip.start_date);
      const endDate = dayjs(trip.end_date);

<<<<<<< HEAD
      let runningStatus = "";
      if (today.isBefore(startDate, "day")) {
        runningStatus = "upcoming";
      } else if (today.isAfter(endDate, "day")) {
        runningStatus = "past";
      } else {
        runningStatus = "active";
=======
      let status = "";
      if (today.isBefore(startDate, "day")) {
        status = "upcoming";
      } else if (today.isAfter(endDate, "day")) {
        status = "past";
      } else {
        status = "active";
>>>>>>> origin/main
      }

      trips.push({
        ...trip,
        budget,
        expense,
        team_members,
<<<<<<< HEAD
        media,
        runningStatus,
        totalBudget,
        totalExpense,
=======
        status,
        totalBudget,
        totalExpense
>>>>>>> origin/main
      });
    }

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
<<<<<<< HEAD
    let trips ={};
=======
>>>>>>> origin/main
    const { tripId } = req.params;
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM trips WHERE trip_id = $1 AND user_id = $2",
      [tripId, userId]
    );

<<<<<<< HEAD
    const tripResult = result.rows[0]

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
       console.log(row)
       const amount = parseFloat(row.total);
       budget[row.category] = amount;
       totalBudget += amount;
     }
     // Get total expense
     const expenseResult = await pool.query(
      `SELECT category, SUM(amount) AS total
       FROM expenses
       WHERE trip_id = $1
       GROUP BY category`,
      [tripId]
    );
    console.log(tripId)
    console.log("🧪 expenseResult.rows:", expenseResult.rows);
    const expense = {};
    let totalExpense = 0;
    for (const row of expenseResult.rows) {
      console.log(row)
      const amount = parseFloat(row.total);
      expense[row.category] = amount;
      totalExpense += amount;
    }


    // Get team members
    const teamResult = await pool.query(
      'SELECT name, email, profile_picture FROM tripmates WHERE trip_id = $1',
      [tripId]
    );
    const team_members = teamResult.rows;
    const today = dayjs();

    const startDate = dayjs(tripResult.start_date);
    const endDate = dayjs(tripResult.end_date);
    let runningStatus = "";
      if (today.isBefore(startDate, "day")) {
        runningStatus = "upcoming";
      } else if (today.isAfter(endDate, "day")) {
        runningStatus = "past";
      } else {
        runningStatus = "active";
      }

    console.log({
      ...tripResult,
      budget,
      expense,
      team_members,
      totalBudget,
      totalExpense
    })
    trips = {
      ...tripResult,
      runningStatus,
      budget,
      expense,
      team_members,
      totalBudget,
      totalExpense
    };


=======
>>>>>>> origin/main
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }

<<<<<<< HEAD
    res.status(200).json(trips);
=======
    res.status(200).json(result.rows[0]);
>>>>>>> origin/main
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createTrip = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      start_point,
      destination,
      start_date,
      end_date,
      outbound_mode_of_transport,
      return_mode_of_transport,
      fuel_budget,
      outbound_flight,
      return_flight,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO trips 
            (user_id, title, start_point, destination, start_date, end_date, 
             outbound_mode_of_transport, return_mode_of_transport, fuel_budget, 
             outbound_flight_from, outbound_flight_to, outbound_flight_date, 
             outbound_flight_dtime, outbound_flight_atime, outbound_budget, outbound_e_ticket,
             return_flight_from, return_flight_to, return_flight_date, 
             return_flight_dtime, return_flight_atime, return_budget, return_e_ticket, status) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, 
             $7, $8, $9, 
             $10, $11, $12, 
             $13, $14, $15, $16, 
             $17, $18, $19, 
             $20, $21, $22, $23, 'Unconfirmed') 
            RETURNING *`,
      [
        userId,
        title,
        start_point,
        destination,
        start_date,
        end_date,
        outbound_mode_of_transport,
        return_mode_of_transport,
        fuel_budget || null,
        outbound_flight?.from || null,
        outbound_flight?.to || null,
        outbound_flight?.date || null,
        outbound_flight?.departure_time || null,
        outbound_flight?.arrival_time || null,
        outbound_flight?.budget || null,
        outbound_flight?.e_ticket || null,
        return_flight?.from || null,
        return_flight?.to || null,
        return_flight?.date || null,
        return_flight?.departure_time || null,
        return_flight?.arrival_time || null,
        return_flight?.budget || null,
        return_flight?.e_ticket || null,
      ]
    );

    res.status(201).json({
      status: "success",
      trip_id: result.rows[0].trip_id,
      message: "Trip created successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const result = await pool.query(
      "DELETE FROM trips WHERE trip_id = $1 RETURNING *",
      [tripId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a trip
exports.updateTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    const {
      title,
      start_point,
      destination,
      start_date,
      end_date,
      outbound_mode_of_transport,
      return_mode_of_transport,
      fuel_budget,
      outbound_flight,
      return_flight,
      status,
    } = req.body;

    const result = await pool.query(
      `UPDATE trips SET 
                title = $1,
                start_point = $2,
                destination = $3,
                start_date = $4,
                end_date = $5,
                outbound_mode_of_transport = $6,
                return_mode_of_transport = $7,
                fuel_budget = $8,
                outbound_flight_from = $9,
                outbound_flight_to = $10,
                outbound_flight_date = $11,
                outbound_flight_dtime = $12,
                outbound_flight_atime = $13,
                outbound_budget = $14,
                outbound_e_ticket = $15,
                return_flight_from = $16,
                return_flight_to = $17,
                return_flight_date = $18,
                return_flight_dtime = $19,
                return_flight_atime = $20,
                return_budget = $21,
                return_e_ticket = $22,
                status = $23
            WHERE trip_id = $24 AND user_id = $25 RETURNING *`,
      [
        title,
        start_point,
        destination,
        start_date,
        end_date,
        outbound_mode_of_transport,
        return_mode_of_transport,
        fuel_budget || null,
        outbound_flight?.from || null,
        outbound_flight?.to || null,
        outbound_flight?.date || null,
        outbound_flight?.departure_time || null,
        outbound_flight?.arrival_time || null,
        outbound_flight?.budget || null,
        outbound_flight?.e_ticket || null,
        return_flight?.from || null,
        return_flight?.to || null,
        return_flight?.date || null,
        return_flight?.departure_time || null,
        return_flight?.arrival_time || null,
        return_flight?.budget || null,
        return_flight?.e_ticket || null,
        status,
        tripId,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Trip not found or unauthorized" });
    }

    res.status(200).json({
      status: "success",
      trip_id: result.rows[0].trip_id,
      message: "Trip updated successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};
