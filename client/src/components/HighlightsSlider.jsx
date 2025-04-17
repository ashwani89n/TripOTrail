import React, { useState } from "react";

const HighlightsSlider = ({ media = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(0);

  return (
    <div className="w-full flex flex-col items-center justify-center h-full">
      {/* Image */}
      <div className="w-full h-full overflow-hidden">
        <img
          src={`http://localhost:5000${media[hoveredIndex]}`}
          alt={`Trip Media ${hoveredIndex + 1}`}
          className="w-full h-full object-contaim rounded-md" 
        />
      </div>

      {/* Dots */}
      <div className="flex gap-1 mt-1">
        {media.map((_, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            className={`w-1 h-1 rounded-full cursor-pointer transition-all duration-300 ${
              hoveredIndex === index ? "bg-topHeader scale-110" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HighlightsSlider;
