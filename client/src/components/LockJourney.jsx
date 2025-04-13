import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { GiMoneyStack } from "react-icons/gi";
import { useLoadScript } from "@react-google-maps/api";
import CarImg from "../images/Car.png";
import AccomodationImg from "../images/EqualHousingOpportunity.png";
import AlarmClock from "../images/AlarmClock.png";
import Moneybox from "../images/MoneyBox.png";
import Budget from "../images/Budget.png";
import Sum from "../images/Sum.png";
import solo from "../images/Solotrip.png";
import { CiUser } from "react-icons/ci";
import dayjs from "dayjs";
import { tripContext } from "../context/useTripDataContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const googleMapsApiKey = "AIzaSyA3xEs87Yqi3PpC8YKGhztvrXNDJX5nNDw"; // Replace with your key
const mapLibraries = ["places", "marker"];

function LockJourney({ onClickNextPrev, data }) {
  // const { isLoaded, loadError } = useLoadScript({
  //   googleMapsApiKey,
  //   libraries: mapLibraries,
  // });

  const [itinerary, setItinerary] = useState([]);
  const [error, setError] = useState("");
  const [errorPopUp, setErrorPopUp] = useState("");
  const [accommodationBudget, setAccommodationBudget] = useState(0);
  const [activitiesBudget, setActivitiesBudget] = useState(0);
  const [foodBudget, setfoodBudget] = useState(0);
  const navigate = useNavigate();
  const {token} = useContext(tripContext);

  const {
    tripId,
    destinationPoint,
    startPoint,
    startDt,
    endDt,
    startCoordinates,
    destinationCoordinates,
    title,
    transportBudget,
  } = useContext(tripContext);

  // State for members
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    photo: null,
  });

  const [req, setReq] = useState([]);
  useEffect(() => {
    // if (!isLoaded) return;

    if (!window.google || !window.google.maps) {
      console.warn("Google Maps not loaded");
      return;
    }

    const fetchTravelTimes = async () => {
      try {
        const google = window.google;
        const service = new google.maps.DistanceMatrixService();

        const updatedItinerary = await Promise.all(
          data.map(async (day) => {
            const spots = [...day.selected_spots];

            const initialTime = day.start_time || "09:00";
            let currentTime = dayjs(
              `${day.dayDate} ${initialTime}`,
              "MMMM DD, YYYY HH:mm"
            );

            // Assign timeline to the first spot
            spots[0].timeLine = currentTime.format("HH:mm");

            for (let i = 0; i < spots.length - 1; i++) {
              const spot = spots[i];
              const origin = spots[i].name;
              const destination = spots[i + 1].name;

              if (!origin || !destination) {
                console.warn("Skipping invalid route", { origin, destination });
                continue;
              }

              const response = await new Promise((resolve, reject) => {
                service.getDistanceMatrix(
                  {
                    origins: [origin],
                    destinations: [destination],
                    travelMode: google.maps.TravelMode.DRIVING,
                  },
                  (result, status) => {
                    if (status === "OK") {
                      resolve(result);
                    } else {
                      reject(status);
                    }
                  }
                );
              });

              const element = response?.rows?.[0]?.elements?.[0];
              if (!element || element.status !== "OK" || !element.duration) {
                console.warn("Distance Matrix failed for", {
                  origin,
                  destination,
                  element,
                });
                continue;
              }

              const travelTimeSec = element.duration.value;
              const travelTimeMin = Math.floor(travelTimeSec / 60);
              spots[i + 1].travelTime = element.duration.text;

              currentTime = currentTime.add(10, "minute").add(travelTimeMin, "minute");

              spots[i + 1].timeLine = currentTime.format("HH:mm");
            }

            return {
              ...day,
              selected_spots: spots,
            };
          })
        );

        setItinerary(updatedItinerary);

        // Calculate accommodation and activities budget after itinerary is updated
        const totalAccommodationBudget = updatedItinerary.reduce((sum, day) => {
          return (
            sum +
            day.selected_spots.reduce((spotSum, spot) => {
              return spot.category === "accomodation"
                ? spotSum + (spot.cost || 0)
                : spotSum;
            }, 0)
          );
        }, 0);

        const totalActivitiesBudget = updatedItinerary.reduce((sum, day) => {
          return (
            sum +
            day.selected_spots.reduce((spotSum, spot) => {
              return ["spot", "start", "end"].includes(spot.category)
                ? spotSum + (spot.cost || 0)
                : spotSum;
            }, 0)
          );
        }, 0);

        setAccommodationBudget(totalAccommodationBudget / 2);
        setActivitiesBudget(totalActivitiesBudget);
      } catch (err) {
        setError("Failed to load Google Maps travel durations.");
        console.error(err);
      }
    };

    fetchTravelTimes();
    // }, [isLoaded, data]);
  }, [data]);

  const handleTimeChange = (e, dayIdx, spotIdx, part) => {
    const value = e.target.value;
    const updatedItinerary = [...itinerary];
    const time =
      updatedItinerary[dayIdx].selected_spots[spotIdx].timeLine || "00:00";
    let [hours, minutes] = time.split(":");

    if (part === "hour") hours = value.padStart(2, "0");
    if (part === "minute") minutes = value.padStart(2, "0");

    updatedItinerary[dayIdx].selected_spots[
      spotIdx
    ].timeLine = `${hours}:${minutes}`;
    setItinerary(updatedItinerary);
  };

  const handlePrevious = () => {
    onClickNextPrev((prev) => prev - 1);
  };

  // const handleNext = async () => {
  //   const teamMembersWithBase64 = await Promise.all(
  //     members.map(async (m) => {
  //       let profilePictureBase64 = "";

  //       if (m.photo && m.photo instanceof File) {
  //         try {
  //           profilePictureBase64 = await convertToBase64(m.photo);
  //         } catch (error) {
  //           console.error("Error converting photo to base64:", error);
  //         }
  //       } else if (typeof m.photo === "string") {
  //         profilePictureBase64 = m.photo; // already base64
  //       }

  //       return {
  //         name: m.name,
  //         email: m.email,
  //         profile_picture: profilePictureBase64,
  //       };
  //     })
  //   );

  //   const formattedTimeline = itinerary.map((day) => ({
  //     day: day.day,
  //     dayDate: day.dayDate,
  //     weekDay: day.weekDay,
  //     selected_spots: day.selected_spots.map((spot, i) => ({
  //       name: spot.name,
  //       category: spot.category,
  //       cost: spot.cost || 0,
  //       duration: spot.duration || "0:00",
  //       travelTime: spot.timeLine || "00:00",
  //       order_index: i + 1,
  //     })),
  //   }));

  //   const requestPayload = {
  //     timeline: formattedTimeline,
  //     budget: {
  //       transport: transportBudget,
  //       food: foodBudget,
  //       accommodation: accommodationBudget,
  //       activities: activitiesBudget,
  //     },
  //     team_members: members.map((m) => ({
  //       name: m.name,
  //       email: m.email,
  //       profile_picture: m.photo || "", // ✅ already base64
  //     })),

  //     status: "Confirm",
  //   };

  //   // Only set state if needed
  //   setReq(requestPayload);
  //   console.log(requestPayload);

  //   try {
  //     const response = await axios.post(
  //       `/api/trips/${tripId}/destinations`,
  //       requestPayload,
  //       {
  //         headers: {
  //           Authorization:
  //             "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ0NTE5ODEwLCJleHAiOjE3NDQ1MjM0MTB9.VV3BDEufD08st-9e1-06FGnJzFSZ3EVuIjOKY34aeLk",
  //         },
  //       }
  //     );
  //     navigate("/");
  //     console.log(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handleNext = async () => {
    // Upload profile pictures for each member
    const teamMembersWithPhotos = await uploadMemberPhotos(members);
  
    const formattedTimeline = itinerary.map((day) => ({
      day: day.day,
      dayDate: day.dayDate,
      weekDay: day.weekDay,
      selected_spots: day.selected_spots.map((spot, i) => ({
        name: spot.name,
        category: spot.category,
        cost: spot.cost || 0,
        duration: spot.duration || "0:00",
        travelTime: spot.timeLine || "00:00",
        order_index: i + 1,
      })),
    }));
  
    const requestPayload = {
      timeline: formattedTimeline,
      budget: {
        transport: transportBudget,
        food: foodBudget,
        accommodation: accommodationBudget,
        activities: activitiesBudget,
      },
      team_members: teamMembersWithPhotos,  // Include profile picture URLs here
      status: "Confirm",
    };
  
    try {
      const response = await axios.post(
        `/api/trips/${tripId}/destinations`,
        // `/api/trips/1/destinations`,
        requestPayload,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTc0NDU3NTMyMiwiZXhwIjoxNzQ0NTc4OTIyfQ.xTQp5NdOtPhNIRG_4-m0hZC7Hz9_48Cp_Q3m2_1bqLA`,
          },
        }
      );
      navigate("/");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const uploadMemberPhotos = async (members) => {
    const updatedMembers = await Promise.all(
      members.map(async (member) => {
        if (member.photo) {
          // Prepare form data for uploading the file
          const formData = new FormData();
          formData.append('file', member.photo);  // Append the selected file to form data
  
          try {
            // Send the file to the backend (where it's stored on the server or cloud storage)
            const response = await axios.post("/api/uploads", formData, {
              headers: {
                "Content-Type": "multipart/form-data",  // Set correct header for file upload
              },
            });
  
            // Assuming the backend returns the URL of the uploaded image
            const fileUrl = response.data.url;
            
            // Return the updated member with the photo URL
            return { ...member, photo: fileUrl };
          } catch (error) {
            console.error("Error uploading image:", error);
            return { ...member, photo: null }; // Fallback if upload fails
          }
        }
        return member; // If no photo selected, return member as is
      })
    );
  
    return updatedMembers;
  };
  
  const handleAddMember = () => {
    if (!newMember.name.trim()) {
      setErrorPopUp("Please enter Name");
      return;
    } else if (!newMember.email.trim()) {
      setErrorPopUp("Please enter Email");
      return;
    }
    setErrorPopUp("");
    setMembers([...members, newMember]);
    setNewMember({ name: "", email: "", photo: null });
    setShowModal(false);
  };

  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMember((prev) => ({ ...prev, photo: file }));
    }
  };
  


  return (
    <div className="p-6 text-white">
      <div className="text-center mt-5 mb-16">
        <h3 className="text-topHeader text-2xl font-kaushan">
          <span className="font-aboreto font-semibold">LOCK</span> Your Journey
        </h3>
        <p className="text-subTitle font-inria text-lg mt-1">
          Get ready to hit the road!
        </p>
      </div>

      {error && (
        <div className="flex bg-topHeader mx-10 rounded-md mb-10 justify-center items-center">
          <p className="p-2 text-white font-normal text-lg font-inria">
            {error}
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-center items-start gap-4 mb--10">
        <div className="w-full lg:w-3/4 bg-card p-4 rounded-lg">
          <div className="overflow-y-auto custom-scrollbar h-[600px]">
            {itinerary.map((day, idx) => (
              <div key={idx} className="mb-5 rounded-lg p-8 bg-list">
                <div className="flex flex-col pb-2 w-full justify-between">
                  <p className="text-white text-[18px] font-aldrich">
                    Day {day.day}{" "}
                    <span className="font-light text-textCard text-[20px]">
                      {" "}
                      |{" "}
                    </span>
                    <span className="text-topHeader font-semibold">
                      {dayjs(day.dayDate).format("dddd")}
                    </span>
                  </p>
                  <p className="text-textCard text-md font-light">
                    {dayjs(day.dayDate).format("DD MMMM, YYYY")}
                  </p>
                </div>
                <ul className="space-y-10 relative border-l-2 border-textCard ml-[20%] mt-6 ">
                  {day.selected_spots.map((spot, i) => (
                    <li key={i} className="relative pl-6  ">
                      <div className="absolute left-[-26%]  flex items-center gap-1">
                        {(() => {
                          const [hours, minute] = spot.timeLine.split(":");
                          return (
                            <>
                              <input
                                type="text"
                                className="bg-textCardDark text-topHeader font rounded-lg px-2 w-10 h-7"
                                maxLength={2}
                                placeholder="HH"
                                name="start-hour"
                                value={hours}
                                onChange={(e) =>
                                  handleTimeChange(e, idx, i, "hour")
                                }
                              />
                              :
                              <input
                                type="text"
                                className="bg-textCardDark text-topHeader font rounded-lg w-10 h-7 px-2"
                                maxLength={2}
                                placeholder="MM"
                                name="start-minute"
                                value={minute}
                                onChange={(e) =>
                                  handleTimeChange(e, idx, i, "minute")
                                }
                              />
                              Hrs
                            </>
                          );
                        })()}
                      </div>
                      <span className="absolute left-[-12px] top-1 flex h-5 w-5 items-center justify-center bg-topHeader text-black rounded-full text-xs font-bold">
                        {["spot", "end", "start"].includes(spot.category) ? (
                          <img src={CarImg} />
                        ) : spot.category === "accomodation" ? (
                          <img src={AccomodationImg} />
                        ) : (
                          ""
                        )}
                      </span>
                      <div className="flex items-center gap-4 mb-1">
                        <div className="flex flex-col w-[80%] gap-2 text-white text-md ">
                          <span
                            className={`${
                              spot.category === "start" ||
                              spot.category === "end"
                                ? "text-semibold italic text-white"
                                : "font-semibold italic text-subTitle"
                            }`}
                          >
                            {spot.name}
                          </span>
                          <div className="inline-flex items-center gap-2">
                            {spot.category !== "start" && spot.travelTime && (
                              <>
                                <img src={AlarmClock} className="w-6 h-4" />
                                <span className="font-light italic text-white">
                                  {spot.travelTime}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="ml-7 flex items-center gap-2 text-sm text-gray-300 pr-8">
                          {["start", "end"].includes(spot.category) ? (
                            <></>
                          ) : (
                            <>
                              <img src={Moneybox} className="w-8" alt="" />
                              <div className="flex items-center">
                                $&nbsp;&nbsp;
                                <input
                                  type="text"
                                  className="bg-textCardDark rounded-lg w-12 h-7 px-2"
                                  maxLength={4}
                                  value={spot.cost}
                                  onFocus={(e) => {
                                    if (spot.cost === 0) {
                                      e.target.value = ""; // Clear the input if cost is 0
                                    }
                                  }}
                                  onBlur={(e) => {
                                    if (e.target.value === "") {
                                      e.target.value = 0; // Set the value to 0 if the input is empty when blurred
                                    }
                                  }}
                                  onChange={(e) => {
                                    const newCost =
                                      parseFloat(e.target.value) || 0;
                                    const updatedItinerary = [...itinerary];
                                    updatedItinerary[idx].selected_spots[
                                      i
                                    ].cost = newCost;
                                    setItinerary(updatedItinerary);
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2 h-full bg-card p-3 rounded-lg">
          <div className="w-full overflow-y-auto custom-scrollbar h-[600px]">
            <div className="mt-2 p-4 bg-card h-[50%] rounded-lg">
              <div className="flex flex-row justify-between">
                <div className="flex flex-row justify-center text-xl p-2 text-white rounded-lg mb-2 font-aldrich">
                  <span className="text-topHeader">Budget&nbsp;</span>
                  Review
                </div>
              </div>

              <div className="relative w-full h-full flex items-center justify-center">
                <img className="w-[25%] l-[-10px]" src={Budget} />
                <div className="absolute top-[10%] left-[15%] text-md font-semibold text-topHeader">
                  Transport&nbsp;&nbsp;
                  <span className="text-myTripSearchBG font-light">
                    $&nbsp;
                  </span>
                  <input
                    className="bg-textInputBG w-[20%] h-[31px] rounded-md pl-3 text-textCard"
                    readOnly
                    value={transportBudget}
                  ></input>
                </div>
                <div className="absolute top-[20%] left-[60%] text-md  text-white font-semibold">
                  Accommodation&nbsp;&nbsp;
                  <span className="text-myTripSearchBG font-light">
                    $&nbsp;
                  </span>
                  <input
                    className="bg-textInputBG w-[30%] h-[31px] rounded-md pl-3 text-textCard"
                    readOnly
                    value={accommodationBudget}
                  ></input>
                </div>
                <div className="absolute bottom-[30%] left-[15%] text-md  text-white font-semibold">
                  Food&nbsp;&nbsp;
                  <span className="text-myTripSearchBG font-light">
                    $&nbsp;
                  </span>
                  <input
                    className="bg-textInputBG w-[25%] h-[31px] rounded-md pl-3 text-textCard "
                    value={foodBudget}
                    onChange={(e) => setfoodBudget(e.target.value)}
                  ></input>
                </div>
                <div className="absolute bottom-[20%] left-[60%] text-md  text-topHeader font-semibold">
                  Activities&nbsp;&nbsp;
                  <span className="text-myTripSearchBG font-light">
                    $&nbsp;
                  </span>
                  <input
                    className="bg-textInputBG w-[30%] h-[31px] rounded-md pl-3 text-textCard"
                    readOnly
                    value={activitiesBudget}
                  ></input>
                </div>
              </div>
            </div>

            {/* Add Mmebers */}
            <div className="mt-3 p-4 h-[45%]  bg-card rounded-lg">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-row justify-center text-xl p-2 text-white rounded-lg mb-2 font-aldrich">
                  <span className="text-topHeader">Team&nbsp;</span>
                  Members
                </div>
                <div className="flex">
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-topHeader mb-5 rounded-md font-semibold"
                  >
                    <img src={Sum} />
                  </button>
                </div>
              </div>

              {/* Members List */}
              {members.length === 0 ? (
                <div className="text-center text-gray-400 flex flex-col justify-center items-center">
                  <img
                    src={solo}
                    alt="Solo traveler"
                    className="w-[26%] ml-5"
                  />
                  <div className="flex flex-col mb-6">
                    <p className="font-aboreto items-center text-white text-md gap-5">
                      Riding solo?{" "}
                    </p>
                    <span className="font-kaushan text-topHeader ">
                      That’s cool — no one to slow you down.I
                    </span>
                  </div>
                </div>
              ) : (
                <ul>
                  {members.map((member, index) => (
                    <li key={index} className="flex items-center gap-4 mb-3">
                      {member.photo ? (
                        <img
                        src={
                          typeof member.photo === "string"
                            ? member.photo // It's a URL
                            : URL.createObjectURL(member.photo) // It's a File object
                        }
                        alt="Member"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      ) : (
                        <div className="w-10 h-10 items-center justify-center rounded-full bg-textInputBG text-sm">
                          <CiUser className="text-white w-full h-full p-2" />
                        </div>
                      )}

                      <div className="flex flex-col">
                        <span className="text-white font-medium">
                          {member.name}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {member.email}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(index)}
                        className="ml-auto bg-topHeader text-white px-3 py-1 rounded-md"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="w-[90%] max-w-md bg-textCardDark rounded-lg overflow-hidden">
                    {/* </div> */}
                    {errorPopUp && (
                      <div className="flex bg-black mb-10 justify-center items-center">
                        <p className="p-2 text-white font-light text-lg font-inria">
                          {errorPopUp}
                        </p>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-col gap-4 p-5">
                      {/* Profile Picture Upload */}
                      <div className="flex flex-row items-center justify-start gap-5 mt-5">
                        <div className="flex gap-5 w-[35%] justify-center items-center">
                          <label
                            htmlFor="photo-upload"
                            className="relative cursor-pointer"
                          >
                            {newMember.photo ? (
                              <img
                                src={URL.createObjectURL(newMember.photo)} // Preview the selected file
                                alt="Profile"
                                className="w-20 h-20 object-cover rounded-full border-2 border-white"
                              />
                            ) : (
                              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-textInputBG text-sm">
                                <CiUser className="text-white w-10 h-10" />
                              </div>
                            )}
                            <input
                              id="photo-upload"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e)} // Handle file selection
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Form Inputs */}
                        <div className="flex-1">
                          <div className="flex flex-col mb-4">
                            <label className="text-white mb-1">Name</label>
                            <input
                              type="text"
                              value={newMember.name}
                              onChange={(e) =>
                                setNewMember({
                                  ...newMember,
                                  name: e.target.value,
                                })
                              }
                              className="p-2 bg-textInputBG border-none rounded-md"
                            />
                          </div>

                          <div className="flex flex-col mb-4">
                            <label className="text-white mb-1">Email</label>
                            <input
                              type="email"
                              value={newMember.email}
                              onChange={(e) =>
                                setNewMember({
                                  ...newMember,
                                  email: e.target.value,
                                })
                              }
                              className="p-2 bg-textInputBG border-none rounded-md"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-center gap-2 mt-6">
                        <button
                          onClick={handleAddMember}
                          className="px-4 py-2 w-[25%] rounded-md bg-topHeader text-white font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 w-[25%] rounded-md bg-topHeader text-white font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4 pr-10">
        <button
          className="bg-topHeader text-white p-2 px-10 rounded-lg font-semibold"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          className="bg-topHeader text-white p-2 px-10 rounded-lg font-semibold"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default LockJourney;
