// src/App.js

import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PlanTrip from "./pages/PlanTrip";
import MyTrip from "./pages/MyTrip";
import Register from "./components/Register";
import Login from "./components/Login";
import { tripContext } from "./context/useTripDataContext";
import TripDetails from "./pages/TripDetails";

const AppRoutes = () => {
  const location = useLocation(); // ✅ Now it's inside the Router!

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/plan" element={<PlanTrip />} />
      <Route path="/myTrip" element={<MyTrip />} />
      <Route path="/myTrip/:tripId" element={<TripDetails />} />
    </Routes>
  );
};
function App() {
  const [token, setToken] = useState("");

  return (
    <tripContext.Provider value={{ token, setToken }}>
      <Router>
        <AppRoutes />
      </Router>
    </tripContext.Provider>
  );
}

export default App;
