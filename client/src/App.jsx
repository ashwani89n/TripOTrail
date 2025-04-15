// src/App.js

import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

import Home from "./pages/Home";
import PlanTrip from "./pages/PlanTrip";
import MyTrip from "./pages/MyTrip";
import Register from "./components/Register";
import Login from "./components/Login";
import TripDetails from "./pages/TripDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import { tripContext } from "./context/useTripDataContext";
import { ToastContainer } from "react-toastify"; // Toast container
import useTokenExpirationCheck from "./hooks/useTokenExpirationCheck";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plan"
        element={
          <ProtectedRoute>
            <PlanTrip />
          </ProtectedRoute>
        }
      />
      <Route
        path="/myTrip"
        element={
          <ProtectedRoute>
            <MyTrip />
          </ProtectedRoute>
        }
      />
      <Route
        path="/myTrip/:tripId"
        element={
          <ProtectedRoute>
            <TripDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  const [token, setToken] = useState("");
  // useTokenExpirationCheck();
  return (
    <tripContext.Provider value={{ token, setToken }}>
      <Router>
        <AppRoutes />
        <ToastContainer position="top-center" autoClose={3000} />
      </Router>
    </tripContext.Provider>
  );
}

export default App;
