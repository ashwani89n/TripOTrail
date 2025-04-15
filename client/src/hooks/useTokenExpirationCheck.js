import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const useTokenExpirationCheck = () => {
  const navigate = useNavigate(); // Initialize useNavigate inside the hook

  useEffect(() => {
    const interval = setInterval(() => {
      const expiry = localStorage.getItem("token_expiry");
      const token = localStorage.getItem("token");

      if (token && expiry && Date.now() > parseInt(expiry)) {
        // Clear session and notify
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");

        toast.error("Session expired. Please log in again.", {
          toastId: "session-timeout",
        });

        setTimeout(() => {
          navigate("/login"); // Use navigate instead of window.location
        }, 3000);
      }
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [navigate]);
};

export default useTokenExpirationCheck;
