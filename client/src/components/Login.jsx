import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import welcome from "../assets/Welcome6.jpg";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({
    email: "",
    password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!data.email.trim()) {
          setError("Please enter Email");
          setData({ ...data, email: "" });
          return;
        } else if (!data.password) {
          setError("Please enter Password");
          return;
        } else {
          setError("");
          try {
            const response = await axios.post(`/api/auth/login`, data, {
              headers: {
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQzOTU3OTg4LCJleHAiOjE3NDM5NjE1ODh9.HikGzXf3-ly5-5Wdz981IqJonhpudrW9glpJLfcQKRo",
              },
            });
            navigate("/");
          } catch (error) {
              setError(error.response?.data?.message || 'Login failed');
          }
        }
      };
    
      const handleCancel = () => {
        setData({
          email: "",
          password: "",
        });
        setError("");
      };

    return(
        <div className="bg-darkBG min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-col md:flex-row flex-1 text-white font-inria text-lg overflow-auto">
          {/* Welcome Image */}
          <div className="w-full md:w-1/2 h-screen">
            <img
              src={welcome}
              alt="Welcome"
              className="w-full h-full object-cover"
            />
          </div>
  
          {/* Register Form */}
          <div className="w-full md:w-1/2 bg-card text-white p-6 md:p-12 rounded-lg flex flex-col justify-center">
            <div className="w-full flex justify-center">
              <p className="text-2xl text-white truncate font-aldrich">
                <span className="text-topHeader">Login </span>to Get on the Road!
              </p>
            </div>
            {error && (
              <div className="w-full flex rounded-md mb-10 justify-center items-center bg-topHeader">
                <p className="p-2 text-white font-normal text-lg font-inria">
                  {error}
                </p>
              </div>
            )}
  
            {/* Form Fields */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label>Email</label>
                <input
                  className="bg-textInputBG h-[40px] rounded-lg pl-2"
                  placeholder="Enter your email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>
  
              <div className="flex flex-col gap-2">
                <label>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="bg-textInputBG h-[40px] w-full rounded-lg pl-2"
                    value={data.password}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-topHeader"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <AiFillEyeInvisible size={20} />
                    ) : (
                      <AiFillEye size={20} />
                    )}
                  </div>
                </div>
              </div>
            </div>
  
            {/* Buttons + Login Section */}
            <div className="mt-10">
              <div className="flex justify-center gap-4 mb-1">
                <button
                  className="bg-topHeader px-4 py-2 w-[20%] sm:w-[20%] rounded-lg hover:bg-opacity-80"
                  onClick={handleLogin}
                >
                  Login
                </button>
                <button
                  className="bg-subTitle px-4 py-2 w-[20%] sm:w-[20%] rounded-lg hover:bg-opacity-80 "
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
              <div className="text-sm text-center mt-1">
                Not registered?{" "}
                <span className="text-base text-topHeader hover:underline cursor-pointer hover:text-lg">
                  <Link to="/register">Sign Up</Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
export default Login;