import React from "react";
import api from "../api/api";

const DeleteTrip = ({ showPrompt, data }) => {
  const handleDeleteTrip = async () => {
    try {
      const res = await api.patch(`trips/${data.trip_id}`, {status:"Cancel"});
      showPrompt(false);
    } catch (error) {
      console.log({ error });
      showPrompt(true);
    }
  };

  console.log(data);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-[30%] max-w-lg bg-textCardDark rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 ease-in-out">
        {/* Heading */}
        <div className="text-center mt-6 mb-4">
          <span className="text-2xl font-aldrich text-white">
            Change of Plans?
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 p-8 text-center">
          {/* Delete Trip Information */}
          <div className="flex flex-col mb-3 text-[16px] text-textCard">
            <p className="mb-2">
              Cancel Trip:{" "}
              <span className="font-aldrich text-topHeader text-lg">
                {data.title}
              </span>
            </p>
            <p className="text-[14px] text-textCard">
              Note: Trips once cancelled cannot be recovered.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={handleDeleteTrip}
              className="px-6 py-3 bg-topHeader text-white rounded-md w-1/3 transition-colors duration-200 ease-in-out hover:bg-topHeaderHover"
            >
              Delete
            </button>
            <button
              onClick={() => showPrompt(false)}
              className="px-6 py-3 bg-gray-600 text-white rounded-md w-1/3 transition-colors duration-200 ease-in-out hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTrip;
