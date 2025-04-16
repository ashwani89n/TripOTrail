import React, { useState } from "react";
import emailjs from "emailjs-com";

const EmailPrompt = ({ showPrompt, data, body }) => {
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");

  const service_id = import.meta.env.VITE_EMAIL_SERVICE_ID;
  const template_id = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
  const public_api_key = import.meta.env.VITE_EMAIL_PUBLIC_KEY;

  const handleEmailSend = async () => {
    if (!emailInput) {
      setEmailError("Please enter an email address");
      return;
    }

    const itinerary = data.destinations || [];
    const tripBody = itinerary
      .map((spot, index) => {
        return `Day ${index + 1}: ${spot.name || "Unknown spot"} - ₹${
          spot.cost || 0
        }`;
      })
      .join("\n");

    const templateParams = {
      to_email: emailInput,
      trip_title: data.title,
      start_date: data.start_date,
      end_date: data.end_data,
      trip_body: body,
    };

    try {
      const result = await emailjs.send(
        service_id,
        template_id,
        templateParams,
        public_api_key
      );

      console.log("EmailJS success:", result.text);
    } catch (error) {
      console.error("EmailJS error:", error);
      alert("Failed to send itinerary email.");
    } finally {
      showPrompt(false);
      setEmailInput("");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-[30%] max-w-md bg-textCardDark rounded-lg overflow-hidden">
          {/* Heading */}
          <span className="text-white text-xl font-aldrich flex items-center justify-center mt-5">
            Email Itinerary
          </span>

          {/* Content */}
          <div className="flex flex-col gap-4 p-5">
            {emailError && (
              <div className="flex bg-headerBG justify-center items-center">
                <p className="p-2 text-textCard font-light text-lg font-inria">
                  {emailError}
                </p>
              </div>
            )}

            {/* Email Input */}
            <div className="flex flex-col mb-2">
              <label className="text-white mb-1">Recipient Email</label>
              <input
                type="email"
                className="p-2 bg-textInputBG border-none rounded-md text-white outline-none"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="example@email.com"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleEmailSend}
                className="px-4 py-2 bg-topHeader text-white rounded-md w-1/3"
              >
                Send
              </button>
              <button
                onClick={() => {
                  setEmailInput("");
                  showPrompt(false);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md w-1/3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailPrompt;
