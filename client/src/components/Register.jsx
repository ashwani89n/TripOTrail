import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import welcome from "../assets/Welcome6.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import { CiUser } from "react-icons/ci";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    file: "",
  });
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidName = (name) => {
    console.log(name);
    if (name.length < 5) {
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!data.name.trim()) {
      setError("Please enter Name");
      setData({ ...data, name: "" });
      return;
    } else if (!data.email.trim()) {
      setError("Please enter Email");
      setData({ ...data, email: "" });
      return;
    } else if (!data.password) {
      setError("Please enter Password");
      return;
    } else if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      setData({ ...data, confirmPassword: "" });
      return;
    } else {
      setError("");
      const { confirmPassword, ...registerData } = data;

      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        if (data.file) formData.append("file", data.file);

        const response = await axios.post("/api/auth/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        navigate("/login");
      } catch (error) {
        if (
          error.response &&
          error.response.data.message === "Email already exists"
        ) {
          setError("Email already exists");
        } else {
          setError(error.response?.data?.message || "Registration failed");
        }
      }
    }
  };

  const handleCancel = () => {
    setData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); 
      setData((prev) => ({ ...prev, file })); 
    }
  };

  return (
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
          <div className="w-full flex justify-center mb-10">
            <p className="text-2xl text-white truncate font-aldrich">
              <span className="text-topHeader">Register</span> to Hit the Road!
            </p>
          </div>
          {error && (
            <div className="w-full flex rounded-md mb-10 justify-center items-center bg-topHeader">
              <p className="p-2 text-white font-normal text-lg font-inria">
                {error}
              </p>
            </div>
          )}
          <div className="flex w-full justify-center items-center mb-6">
            <label htmlFor="photo-upload" className="relative cursor-pointer">
              <div className="w-28 h-28 rounded-full p-2 bg-textInputBG overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <CiUser className="text-white w-16 h-16" />
                )}
              </div>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label>Name</label>
              <input
                className="bg-textInputBG h-[40px] rounded-lg pl-2"
                placeholder="Enter your name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                onBlur={(e) => {
                  console.log("inside");
                  const isValid = isValidName(e.target.value);
                  if (!isValid) {
                    setError("Name is too short");
                  } else setError("");
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Email</label>
              <input
                className="bg-textInputBG h-[40px] rounded-lg pl-2"
                placeholder="Enter your email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                onBlur={(e) => {
                  console.log("inside");
                  const isValid = isValidEmail(e.target.value);
                  if (!isValid) {
                    setError("Please enter a valid Email");
                  } else setError("");
                }}
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
                  {!showPassword ? (
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label>Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  className="bg-textInputBG h-[40px] w-full rounded-lg pl-2"
                  value={data.confirmPassword}
                  onChange={(e) =>
                    setData({ ...data, confirmPassword: e.target.value })
                  }
                  onBlur={(e) => {
                    console.log("inside");
                    if (data.password != e.target.value) {
                      setError("Password and Confirm Password do not match");
                    } else setError("");
                  }}
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-topHeader"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {!showConfirmPassword ? (
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
                onClick={handleRegister}
              >
                Register
              </button>
              <button
                className="bg-subTitle px-4 py-2 w-[20%] sm:w-[20%] rounded-lg hover:bg-opacity-80 "
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            <div className="text-sm text-center mt-1">
              Already registered?{" "}
              <span className="text-base text-topHeader hover:underline cursor-pointer hover:text-lg">
                <Link to="/login">Login</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
