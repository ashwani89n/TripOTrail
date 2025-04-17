import moment from "moment";

const buildItineraryHTML = (itinerary) => {
  if (!Array.isArray(itinerary)) return "";

  const iconBaseURLs = {
    accomodation: "1136bJw_94LGAOz9zn3xxQVk18w66Lbb1",
    start: "1UqyPGibpaxLqkU4bBkQ4kXyOLhLzKHZD",
    end: "1UqyPGibpaxLqkU4bBkQ4kXyOLhLzKHZD",
    spot: "1UqyPGibpaxLqkU4bBkQ4kXyOLhLzKHZD",
  };

  const getCategoryIcon = (category) => {
    const id = iconBaseURLs[category];
    return id
      ? `https://drive.google.com/uc?export=download&id=${id}`
      : "📍";
  };

  const getSpotHTML = (spot, index, totalSpots) => {
    const isSpot = spot.category === "spot";
    const icon = getCategoryIcon(spot.category);
    const isLast = index === totalSpots - 1;

    return `
      <table style="border-spacing: 0; margin: 0; padding: 0; width: 100%;">
        <tr>
          <td style="width: 32px; text-align: center; vertical-align: top; padding: 0;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #DF8114; display: inline-block; text-align: center; line-height: 32px; margin-bottom: 4px;">
              <img src="${icon}" alt="${spot.category}" style="width: 18px; height: 18px; display: inline-block; vertical-align: middle;" />
            </div>
            ${
              !isLast
                ? `<div style="width: 2px; height: 40px; background-color: #DF8114; margin-left: auto; margin-right: auto; display: block;"></div>`
                : ""
            }
          </td>
          <td style="padding-left: 12px; padding-bottom: 28px; font-family: 'Segoe UI', sans-serif;">
            <div style="font-size: 16px; color: rgba(58, 58, 58, 0.8); font-weight: 600;">
              ${spot.name}
            </div>
            ${
              spot.travelTime
                ? `<div style="font-size: 13px; color: rgba(141, 141, 141, 1); font-weight: 450; font-style: italic;">Start Time: ${spot.travelTime}</div>`
                : ""
            }
            ${
              isSpot && spot.cost && parseFloat(spot.cost) > 0
                ? `<div style="font-size: 13px; color: rgba(141, 141, 141, 1); font-weight: 450; font-style: italic;">Budget: ₹${spot.cost}</div>`
                : "<div style='height:20px;'></div>"
            }
          </td>
        </tr>
      </table>
    `;
  };

  const getDayHTML = (day, index) => {
    const formattedDate = moment(day.dayDate).format("MMMM D, YYYY");
    const weekDay = moment(day.dayDate).format("dddd");

    const spotsHTML = (day.selected_spots || [])
      .map((spot, idx, arr) => getSpotHTML(spot, idx, arr.length))
      .join("");

    return `
      <div style="background: #f0f0f0; padding: 24px; border-radius: 12px; margin-bottom: 20px; font-family: 'Segoe UI', sans-serif; color: #2e2e2e;">
        <div style="font-size: 18px; font-weight: bold; color: #DF8114; margin-bottom: 6px;">
          <span style="color: rgba(58, 58, 58, 0.8);">Day ${index + 1}:</span> ${formattedDate}, <span style="color: rgba(58, 58, 58, 0.8);">${weekDay}</span>
        </div>
        <div style="margin-top: 16px;">
          ${spotsHTML}
        </div>
      </div>
    `;
  };

  return itinerary.map(getDayHTML).join("");
};

export default buildItineraryHTML;
