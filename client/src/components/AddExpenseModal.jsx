import React from "react";

const CATEGORY_COLORS = {
  transport: "#DF8114",
  accommodation: "#88B116",
  food: "#14BADF",
  activities: "#D90E5F",
};

const AddExpenseModal = ({
  open,
  currentCategory,
  formData,
  errorPopUp,
  teamMembers,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-[30%] max-w-md bg-textCardDark rounded-lg overflow-hidden">
        <span className="text-white text-xl font-aldrich flex items-center justify-center mt-5">
          Add Expense: &nbsp;
          <span
            className="capitalize"
            style={{ color: CATEGORY_COLORS[currentCategory] || "#333" }}
          >
            {currentCategory}
          </span>
        </span>

        <div className="flex flex-col gap-4 p-5">
          {errorPopUp && (
            <div className="flex bg-headerBG justify-center items-center">
              <p className="p-2 text-textCard font-light text-lg font-inria">
                {errorPopUp}
              </p>
            </div>
          )}

          {/* Tripmate Dropdown */}
          <div className="flex flex-col mb-2">
            <label className="text-white mb-1">Tripmate</label>
            <select
              className="p-2 bg-textInputBG border-none rounded-md text-white outline-none"
              value={formData.added_by_name}
              onChange={(e) => onChange("added_by_name", e.target.value)}
            >
              <option value="">Select Member</option>
              {teamMembers.map((member, idx) => (
                <option key={idx} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="flex flex-col mb-4">
            <label className="text-white mb-1">Amount</label>
            <input
              type="number"
              className="p-2 bg-textInputBG border-none outline-none rounded-md text-white"
              value={formData.amount}
              onChange={(e) => onChange("amount", e.target.value)}
            />
          </div>

          {/* Comments */}
          <div className="flex flex-col mb-2">
            <label className="text-white mb-1">Comments</label>
            <textarea
              className="p-2 bg-textInputBG border-none outline-none rounded-md text-white"
              value={formData.comments}
              onChange={(e) => onChange("comments", e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-topHeader text-white rounded-md w-1/3"
              style={{
                backgroundColor: CATEGORY_COLORS[currentCategory] || "#333",
              }}
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md w-1/3"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
