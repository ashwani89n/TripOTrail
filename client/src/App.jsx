// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/Home'; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PlanTrip from './pages/PlanTrip';
import MyTrip from './pages/MyTrip';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<PlanTrip />} />
        <Route path="/myTrip" element={<MyTrip />} />
        {/* <Route path="/investors" element={<Investors />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/services" element={<Services />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
