import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import AlarmClock from "../images/AlarmClock.png";
import Moneybox from "../images/MoneyBox.png";
import addStop from "../images/Sum.png";
import { MapPin, Flag, Target } from "lucide-react";

const EditPrompt = ({ itinerary, startDt, endDt }) => {
  const [startEndValues, setStartEndValues] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [activeStartEnd, setActiveStartEnd] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [popupAttractions, setPopupAttractions] = useState([]);
  const [popupLoading, setPopupLoading] = useState(false);
  const [popupPlaceType, setPopupPlaceType] = useState("tourist_attraction");
  const [popupRadius, setPopupRadius] = useState(2000);
  const [popupStartValue, setPopupStartValue] = useState("");
  const [popupEndValue, setPopupEndValue] = useState("");
  const [activePopupField, setActivePopupField] = useState(null);
  const [debouncedPopupValue, setDebouncedPopupValue] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setAccommodationValue(debouncedPopupValue);
    }, 800);
    return () => clearTimeout(delayDebounce);
  }, [debouncedPopupValue]);

  const [query, setQuery] = useState("");

  const calculateTripDays = (startDt, endDt) => {
    const startDate = new Date(startDt);
    const endDate = new Date(endDt);
    const daysCt = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const dayDetails = Array.from({ length: daysCt }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return {
        weekday: date.toLocaleString("en-US", { weekday: "long" }),
        formatted: date.toLocaleString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        }),
      };
    });

    return {
      daysCount: daysCt,
      dayDetails,
    };
  };

  const { daysCount, dayDetails } = calculateTripDays(startDt, endDt);
  const ADD_STOP_ID = "__ADD_STOP__";

  const [startTimes, setStartTimes] = useState(
    Array(daysCount).fill({ hour: "", minute: "" })
  );
  const [inputValues, setInputValues] = useState({});
  const [accommodations, setAccommodations] = useState(
    Array(daysCount - 1).fill(false)
  );
  const [accommodationDetails, setAccommodationDetails] = useState(
    Array(daysCount - 1).fill({
      name: "",
      cost: "",
      location: "",
      coordinates: null,
    })
  );
  const [activeAccommodationDay, setActiveAccommodationDay] = useState(null);
  const [beforeAfterSpots, setBeforeAfterSpots] = useState({
    before: null,
    after: null,
  });

  const [dayMap, setDayMap] = useState(() =>
    itinerary.reduce((acc, curr, idx) => {
      acc[idx + 1] = (curr.selected_spots || []).map((spot) => ({
        ...spot,
        is_added: spot.is_added ?? true,
      }));
      return acc;
    }, {})
  );

  useEffect(() => {
    const startEnd = {};
    let foundStart = null;
    let foundEnd = null;
  
    Object.values(dayMap).forEach((spots) => {
      spots.forEach((spot) => {
        if (spot.category === "start" && !foundStart) {
          foundStart = spot.name;
          startEnd[spot.name] = spot.name;
        }
        if (spot.category === "end" && !foundEnd) {
          foundEnd = spot.name;
          startEnd[spot.name] = spot.name;
        }
      });
    });
  
    setStartEndValues(startEnd);
  
    if (foundStart) setPopupStartValue(foundStart);
    if (foundEnd) setPopupEndValue(foundEnd);
  }, [dayMap]);
  


  useEffect(() => {
    const updates = {};
  
    if (beforeAfterSpots.before) {
      setPopupStartValue(beforeAfterSpots.before);
      updates[beforeAfterSpots.before] = beforeAfterSpots.before;
    }
  
    if (beforeAfterSpots.after) {
      setPopupEndValue(beforeAfterSpots.after);
      updates[beforeAfterSpots.after] = beforeAfterSpots.after;
    } else {
      const allSpots = Object.values(dayMap).flat();
      const beforeSpot = allSpots.find(s => s.name === beforeAfterSpots.before);
      if (beforeSpot?.category === "end") {
        setPopupEndValue(beforeAfterSpots.before);
        updates[beforeAfterSpots.before] = beforeAfterSpots.before;
      }
    }
  
    if (Object.keys(updates).length > 0) {
      setStartEndValues((prev) => ({ ...prev, ...updates }));
    }
  }, [beforeAfterSpots, dayMap]);
  


  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceDay = parseInt(source.droppableId);
    const destDay = parseInt(destination.droppableId);

    if (draggableId === ADD_STOP_ID) return;

    const updatedDayMap = { ...dayMap };
    const [movedItem] = updatedDayMap[sourceDay].splice(source.index, 1);
    updatedDayMap[destDay].splice(destination.index, 0, movedItem);

    setDayMap(updatedDayMap);
  };

  const toggleAccommodation = (day) => {
    const updated = [...accommodations];
    updated[day - 1] = !updated[day - 1];
    setAccommodations(updated);

    if (!updated[day - 1]) {
      const reset = [...accommodationDetails];
      reset[day - 1] = { name: "", cost: "", location: "", coordinates: null };
      setAccommodationDetails(reset);
    }
  };

  // For End location to appear in last spot
  useEffect(() => {
    const updatedDayMap = { ...dayMap };
    let endSpot = null;
    let endDay = null;

    // Step 1: Search all days for the end-location
    for (let d = 1; d <= daysCount; d++) {
      const index = updatedDayMap[d]?.findIndex((s) => s.category === "end");
      if (index !== -1 && index != null) {
        endSpot = updatedDayMap[d][index];
        endDay = d;
        updatedDayMap[d].splice(index, 1);
        break;
      }
    }

    if (endSpot) {
      if (!updatedDayMap[daysCount]) updatedDayMap[daysCount] = [];
      updatedDayMap[daysCount].push(endSpot);
      setDayMap(updatedDayMap);
    }
  }, [daysCount]);

  const fetchPopupAttractions = async (start, end) => {
    try {
      setPopupLoading(true);
      setPopupAttractions([]);

      const maps = window.google.maps;
      if (!maps) {
        console.error("Google Maps API not loaded.");
        return;
      }

      const [startGeo, endGeo] = await Promise.all([
        getGeocode({ address: start }),
        getGeocode({ address: end }),
      ]);

      const startCoords = await getLatLng(startGeo[0]);
      const endCoords = await getLatLng(endGeo[0]);

      // Step 2: Get directions between them
      const directionsService = new maps.DirectionsService();
      const routeResult = await directionsService.route({
        origin: startCoords,
        destination: endCoords,
        travelMode: maps.TravelMode.DRIVING,
      });

      const path = routeResult.routes[0].overview_path;

      // Step 3: Sample segment points along the path
      const segmentPoints = path.filter((_, i) => i % 10 === 0); // every 10th point

      const placesService = new maps.places.PlacesService(
        document.createElement("div")
      );

      const allResults = [];

      for (const point of segmentPoints) {
        const results = await new Promise((resolve) =>
          placesService.nearbySearch(
            {
              location: point,
              radius: popupRadius, // your user-controlled radius
              type: popupPlaceType, // "tourist_attraction" or "restaurant"
            },
            (results, status) =>
              resolve(
                status === maps.places.PlacesServiceStatus.OK ? results : []
              )
          )
        );

        for (const place of results) {
          const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 400 }) ?? null;
          const position = place.geometry.location.toJSON();
          const uniqueKey = `${place.place_id}-${position.lat}-${position.lng}`;

          if (!allResults.some((p) => p.id === uniqueKey)) {
            allResults.push({
              id: uniqueKey,
              name: place.name,
              position,
              rating: place.rating,
              address: place.vicinity,
              photoUrl,
              enabled: true,
            });
          }
        }
      }

      setPopupAttractions(allResults);
    } catch (err) {
      console.error("🚨 Error in fetchPopupAttractions:", err);
    } finally {
      setPopupLoading(false);
    }
  };

  const {
    ready: accommodationReady,
    value: accommodationValue,
    suggestions: { status: accommodationStatus, data: accommodationData },
    setValue: setAccommodationValue,
    clearSuggestions: clearAccommodationSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { types: ["geocode", "establishment"] },
    debounce: 300,
  });

  const handleAccommodationSelect = async (address, day) => {
    setAccommodationValue(address);
    clearAccommodationSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);

      const updated = [...accommodationDetails];
      updated[day - 1] = {
        name: address,
        cost: "",
        location: address,
        coordinates: { lat, lng },
      };
      setAccommodationDetails(updated);
      setActiveAccommodationDay(null);
    } catch (error) {
      console.error("Error fetching accommodation geocode:", error);
    }
  };

  const {
    ready: popupReady,
    value: popupAutocompleteValue,
    suggestions: { status: popupStatus, data: popupData },
    setValue: setPopupAutocompleteValue,
    clearSuggestions: clearPopupSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { types: ["geocode", "establishment"] },
    debounce: 300,
  });

  useEffect(() => {
    const initialStartTimes = [];
    const initialInputValues = {};

    itinerary.forEach((dayData, dayIndex) => {
      const spots = dayData.selected_spots || [];

      // Set the start time for the day using the travelTime of the first spot
      if (spots.length > 0) {
        const [hour, minute] = (spots[0].travelTime || "00:00").split(":");
        initialStartTimes[dayIndex] = { hour, minute };
      } else {
        initialStartTimes[dayIndex] = { hour: "", minute: "" };
      }

      // Populate input values for each spot
      spots.forEach((spot) => {
        const durationHour = spot.duration?.hours?.toString() || "00";
        const durationMinute = spot.duration?.minutes?.toString() || "00";
        const cost = spot.cost?.toString() || "";

        initialInputValues[spot.name] = {
          durationHour,
          durationMinute,
          cost,
        };
      });
    });

    setStartTimes(initialStartTimes);
    setInputValues(initialInputValues);
  }, [itinerary]);

  const handleInsertStop = (place) => {
    const newStop = {
      name: place.name,
      is_added: true,
      duration: { hours: 0, minutes: 0 },
      cost: 0,
      category: selectedCategory || "custom",
      image: place.photoUrl || "",
      address: place.address || "",
      coordinates: place.position || {},
    };

    const updated = { ...dayMap };

    const targetDay = Object.keys(updated).find((key) =>
      updated[key].some((s) => s.name === beforeAfterSpots.before)
    );

    if (!targetDay) return;

    const day = parseInt(targetDay);
    const insertIndex =
      updated[day].findIndex((s) => s.name === beforeAfterSpots.before) + 1;

    // Check if it's already in the list
    const alreadyExists = updated[day].some((s) => s.name === place.name);
    if (alreadyExists) return;

    updated[day].splice(insertIndex, 0, newStop);

    setDayMap(updated);
    setPopupAttractions([]);
    setBeforeAfterSpots({ before: null, after: null });
    setPopupStartValue("");
    setPopupEndValue("");
  };

  const handleConfirmUpdates = () => {
    // Call back to parent (optional): maybe via a prop like onConfirmUpdate(updatedItinerary)
  };

  return (
    <div className="w-full text-white mt-5 h-full flex flex-col space-y-4">
      {showMessage && (
        <p className="text-center text-sm text-textCard mt-1">
          To change dates, go to{" "}
          <span className="font-semibold">Edit Trip</span>.
        </p>
      )}
      <div className="w-full flex flex-row gap-4 h-[600px] ">
        <div className="w-2/5  bg-headerBG  h-full rounded-lg  p-7 space-y-4 ">
          <div className="text-white flex flex-col">
            <div className="text-center mt-6 mb-10">
              <p className="text-white text-[18px] font-aldrich">
                Fuel &nbsp;
                <span className="text-topHeader font-semibold">the fun</span>
              </p>
              <p className="text-[14px] text-textCard">
                Drop in your favorite pit stops!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative col-span-1 md:col-span-2">
                <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  value={popupStartValue}
                  onFocus={() => setActivePopupField("start")}
                  onChange={(e) => {
                    setPopupStartValue(e.target.value);
                    setPopupAutocompleteValue(e.target.value);
                  }}
                  className="bg-textInputBG w-full h-[31px] rounded-md pl-8 myTripSearchBGLiter"
                  placeholder="Start location"
                />
                {activePopupField === "start" &&
                  popupStatus === "OK" &&
                  popupData.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white text-black rounded shadow mt-1 max-h-40 overflow-y-auto">
                      {popupData.map(({ place_id, description }) => (
                        <li
                          key={place_id}
                          onClick={() => {
                            setPopupStartValue(description);
                            setActivePopupField(null);
                          }}
                          className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-sm"
                        >
                          {description}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
              {/* Radius */}
              <div className="relative col-span-1">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="number"
                  min={500}
                  max={10000}
                  step={100}
                  value={popupRadius}
                  onChange={(e) => setPopupRadius(Number(e.target.value))}
                  className="bg-textInputBG w-full h-[31px] rounded-md pl-8 myTripSearchBGLiter"
                />
              </div>

              {/* End Location */}
              <div className="relative col-span-1 md:col-span-2">
                <Flag className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  value={popupEndValue}
                  onFocus={() => setActivePopupField("end")}
                  onChange={(e) => {
                    setPopupEndValue(e.target.value);
                    setPopupAutocompleteValue(e.target.value);
                  }}
                  className="bg-textInputBG w-full h-[31px] rounded-md pl-8 text-myTripSearchBGLiter"
                  placeholder="End location"
                />
                {activePopupField === "end" &&
                  popupStatus === "OK" &&
                  popupData.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white text-black rounded shadow mt-1 max-h-40 overflow-y-auto">
                      {popupData.map(({ place_id, description }) => (
                        <li
                          key={place_id}
                          onClick={() => {
                            setPopupEndValue(description);
                            setActivePopupField(null);
                          }}
                          className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-sm"
                        >
                          {description}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
              <select
                value={popupPlaceType}
                onChange={(e) => setPopupPlaceType(e.target.value)}
                className="bg-textInputBG h-[31px] rounded-md text-sm text-myTripSearchBGLiter px-2 outline-none "
              >
                <option value="tourist_attraction">Attractions</option>
                <option value="restaurant">Restaurants</option>
              </select>

              <div className="relative col-span-1 md:col-span-2">
                <input
                  className="bg-textInputBG w-full h-[31px] rounded-md pl-3 italic"
                  placeholder="Search by location..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button
                disabled={!(popupStartValue && popupEndValue)}
                className="text-sm bg-topHeader text-black px-3 py-[4px] rounded hover:bg-opacity-90 transition w-full sm:w-auto disabled:opacity-50"
                onClick={() => {
                  fetchPopupAttractions(popupStartValue, popupEndValue);
                }}
              >
                Fetch
              </button>
            </div>

            {/* Search + Category */}

            {/* Result List */}
            <div className="h-[35vh] overflow-y-auto custom-scrollbar ">
              {popupLoading ? (
                <div className="flex items-center w-full justify-center h-full min-h-[300px]">
                  <div className="text-center">
                    <p className="text-lg font-light font-inria text-textCard">
                      Hang tight!
                    </p>
                    <p className="text-lg font-inria font-medium italic text-topHeader mt-1 animate-pulse">
                      We’re adding your bucket list spots...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mt-8 pr-5">
                  {popupAttractions
                    .filter((item) =>
                      query.trim()
                        ? item.name.toLowerCase().includes(query.toLowerCase())
                        : true
                    )
                    .map((item) => (
                      <div
                        className="w-full h-[270px] bg-headerBG rounded-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-[1.02] hover:border-[1px] hover:border-subTitle"
                        key={item.id}
                        onClick={() => handleInsertStop(item)}
                      >
                        <img
                          src={item.photoUrl}
                          className="w-full h-[200px] object-cover"
                        />
                        <div className="p-2">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-white truncate font-aldrich">
                              <span className="text-topHeader">
                                {item.name.split(" ")[0]}
                              </span>{" "}
                              {item.name.split(" ").slice(1).join(" ")}
                            </p>
                            <div className="flex flex-row">
                              <p className="text-textCard text-[10px] pr-1 font-light">
                                {item.rating}
                              </p>
                              <div className="text-topHeader text-[10px]">
                                ★
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-textCard mt-1 text-left">
                            {item.address}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-3/5 p-5 bg-headerBG h-full overflow-y-auto custom-scrollbar rounded-lg ">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="h-full rounded-lg flex flex-col gap-8 text-white">
              {Array.from({ length: daysCount }, (_, i) => i + 1).map((day) => (
                <Droppable key={day} droppableId={day.toString()}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 rounded-lg `}
                    >
                      <div className="flex flex-row text-white my-4">
                        <div className="flex flex-col w-full justify-between">
                          <p className="text-white text-[18px] font-aldrich">
                            Day {day}
                            <span className="font-light text-textCard text-[20px]">
                              {" "}
                              |{" "}
                            </span>
                            <span className="text-topHeader font-semibold">
                              {dayDetails[day - 1].weekday}
                            </span>
                          </p>
                          <p className="text-textCard text-md font-light">
                            {dayDetails[day - 1].formatted}
                          </p>
                        </div>
                        <div className="flex flex-row gap-2 mb-3">
                          <div className="flex items-center gap-1 text-white pr-2 mb-2 font-semibold">
                            <span className="text-topHeader">Start</span> Time
                          </div>
                          <input
                            type="text"
                            className="bg-textCardDark text-textCard font-light rounded-lg px-2 w-10 h-7"
                            maxLength={2}
                            placeholder="HH"
                            value={startTimes[day - 1]?.hour}
                            onChange={(e) =>
                              setStartTimes((prev) => {
                                const updated = [...prev];
                                updated[day - 1] = {
                                  ...updated[day - 1],
                                  hour: e.target.value,
                                };
                                return updated;
                              })
                            }
                          />
                          :
                          <input
                            type="text"
                            className="bg-textCardDark text-textCard font-light rounded-lg w-10 h-7 px-2"
                            maxLength={2}
                            placeholder="MM"
                            value={startTimes[day - 1]?.minute}
                            onChange={(e) =>
                              setStartTimes((prev) => {
                                const updated = [...prev];
                                updated[day - 1] = {
                                  ...updated[day - 1],
                                  minute: e.target.value,
                                };
                                return updated;
                              })
                            }
                          />
                          Hrs
                        </div>
                      </div>

                      <ul className="space-y-5 pt-3">
                        {dayMap[day]?.map((item, index) => {
                          //  SKIP end-location unless it's the last day
                          if (item.category === "end" && day !== daysCount)
                            return null;

                          return item.category === "start" ||
                            item.category === "end" ? (
                            // Not draggable
                            <li
                              key={item.name}
                              className="w-full flex flex-row gap-2 items-start bg-list p-3 rounded-lg"
                            >
                              <div className="relative w-full">
                                <input
                                  type="text"
                                  placeholder={`${
                                    item.category === "start" ? "Start" : "End"
                                  } Location`}
                                  value={
                                    startEndValues.hasOwnProperty(item.name)
                                      ? startEndValues[item.name]
                                      : item.name
                                  }
                                  onFocus={() => {
                                    setActiveStartEnd(item.name);
                                    setPopupAutocompleteValue(item.name);
                                  }}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setStartEndValues((prev) => ({
                                      ...prev,
                                      [item.name]: val,
                                    }));
                                    setPopupAutocompleteValue(val);
                                  }}
                                  className="bg-textCardDark p-2 w-full rounded-lg text-textCard"
                                />

                                {activeStartEnd === item.name &&
                                  popupStatus === "OK" && (
                                    <ul className="absolute z-10 left-0 mt-1 bg-white text-black border border-gray-300 rounded-md shadow-lg w-full max-h-40 overflow-y-auto">
                                      {popupData.map(
                                        ({ place_id, description }) => (
                                          <li
                                            key={place_id}
                                            onClick={() => {
                                              const updated = { ...dayMap };
                                              updated[day][index].name =
                                                description;

                                              setDayMap(updated);
                                              setStartEndValues((prev) => ({
                                                ...prev,
                                                [item.name]: description,
                                              }));
                                              setActiveStartEnd(null);
                                              clearPopupSuggestions();
                                            }}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                          >
                                            {description}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  )}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();

                                  const currentDayList = dayMap[day] || [];

                                  let before = null;
                                  let after = null;

                                  if (item.category === "start") {
                                    before = item.name;
                                    after =
                                      currentDayList[index + 1]?.name || null;
                                  } else if (item.category === "end") {
                                    //  Use the end location itself as "start"
                                    before = item.name;
                                    after = null;
                                  } else {
                                    before = item.name;
                                    after =
                                      currentDayList[index + 1]?.name || null;
                                  }

                                  setBeforeAfterSpots({ before, after });

                                  const startVal =
                                    startEndValues[before] || before;
                                  setPopupStartValue(startVal);

                                  if (after) {
                                    const endVal =
                                      startEndValues[after] || after;
                                    setPopupEndValue(endVal);
                                  } else {
                                    const allSpots =
                                      Object.values(dayMap).flat();
                                    const beforeSpot = allSpots.find(
                                      (s) => s.name === before
                                    );
                                    if (beforeSpot?.category === "end") {
                                      setPopupEndValue(startVal);
                                    }
                                  }
                                }}
                              >
                                <img
                                  src={addStop}
                                  className="w-8 h-6 mt-2"
                                  alt="add stop"
                                />
                              </button>
                            </li>
                          ) : (
                            <Draggable
                              key={item.name}
                              draggableId={item.name}
                              index={index}
                            >
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="flex flex-row gap-2"
                                  onClick={() => {
                                    // Identify before and after spots for placeholder logic
                                    const before =
                                      dayMap[day]?.[dayMap[day].length - 1]
                                        ?.name || dayMap[0].name;
                                    const after = null;
                                    setBeforeAfterSpots({ before, after });
                                  }}
                                >
                                  <div className="bg-list p-3 pr-4 rounded-lg w-[52%] text-sm justify-between flex flex-row">
                                    <div className="flex flex-row gap-2 justify-between">
                                      <span className="w-full mr-4 text-textCard italic">
                                        {item.name}
                                      </span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={item.is_added ?? true}
                                        onChange={() => {
                                          const updated = { ...dayMap };
                                          updated[day][index].is_added =
                                            !updated[day][index].is_added;
                                          setDayMap(updated);
                                        }}
                                      />
                                      <div className="w-8 h-3 bg-textCard peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-topHeader rounded-full peer-checked:bg-topHeader transition-colors"></div>
                                      <div className="absolute h-3 w-3 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-[1.5rem]"></div>
                                    </label>
                                  </div>

                                  <div className="bg-list rounded-lg w-[25%] text-sm flex flex-row justify-between items-center p-2 text-textCard">
                                    <img
                                      src={AlarmClock}
                                      className="w-8 h-6"
                                      alt="duration"
                                    />
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        className="bg-textCardDark rounded-lg px-2 w-10 h-7"
                                        maxLength={2}
                                        placeholder="HH"
                                        value={
                                          inputValues[item.name]
                                            ?.durationHour || ""
                                        }
                                        onChange={(e) =>
                                          setInputValues((prev) => ({
                                            ...prev,
                                            [item.name]: {
                                              ...prev[item.name],
                                              durationHour: e.target.value,
                                            },
                                          }))
                                        }
                                      />
                                      :
                                      <input
                                        type="text"
                                        className="bg-textCardDark rounded-lg w-10 h-7 px-2"
                                        maxLength={2}
                                        placeholder="MM"
                                        value={
                                          inputValues[item.name]
                                            ?.durationMinute || ""
                                        }
                                        onChange={(e) =>
                                          setInputValues((prev) => ({
                                            ...prev,
                                            [item.name]: {
                                              ...prev[item.name],
                                              durationMinute: e.target.value,
                                            },
                                          }))
                                        }
                                      />
                                      Hrs
                                    </div>
                                  </div>

                                  <div className="bg-list rounded-lg w-[15%] text-sm flex flex-row justify-between items-center p-2 text-textCard">
                                    <img
                                      src={Moneybox}
                                      className="w-8 h-6"
                                      alt="cost"
                                    />
                                    <div className="flex items-center">
                                      $&nbsp;
                                      <input
                                        type="text"
                                        className="bg-textCardDark rounded-lg w-14 h-7 px-2"
                                        maxLength={4}
                                        value={
                                          inputValues[item.name]?.cost || ""
                                        }
                                        onChange={(e) =>
                                          setInputValues((prev) => ({
                                            ...prev,
                                            [item.name]: {
                                              ...prev[item.name],
                                              cost: e.target.value,
                                            },
                                          }))
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="w-[4%]">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();

                                        const currentDayList =
                                          dayMap[day] || [];

                                        let before = null;
                                        let after = null;

                                        if (item.category === "start") {
                                          before = item.name;
                                          after =
                                            currentDayList[index + 1]?.name ||
                                            null;
                                        } else if (item.category === "end") {
                                          //  Use the end location itself as "start"
                                          before = item.name;
                                          after = null;
                                        } else {
                                          before = item.name;
                                          after =
                                            currentDayList[index + 1]?.name ||
                                            null;
                                        }

                                        setBeforeAfterSpots({ before, after });

                                        const startVal =
                                          startEndValues[before] || before;
                                        setPopupStartValue(startVal);

                                        if (after) {
                                          const endVal =
                                            startEndValues[after] || after;
                                          setPopupEndValue(endVal);
                                        } else {
                                          const allSpots =
                                            Object.values(dayMap).flat();
                                          const beforeSpot = allSpots.find(
                                            (s) => s.name === before
                                          );
                                          if (beforeSpot?.category === "end") {
                                            setPopupEndValue(startVal); // Use same as start
                                          }
                                        }
                                      }}
                                    >
                                      <img
                                        src={addStop}
                                        className="w-8 h-6 mt-3"
                                        alt="add stop"
                                      />
                                    </button>
                                  </div>
                                </li>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </ul>

                      {/* Accommodation section (if not last day) */}
                      {day !== daysCount && (
                        <div className="flex flex-row gap-2 mt-3">
                          <div className="bg-list p-2 pr-4 rounded-lg w-full text-sm justify-between flex flex-row items-start">
                            <div className="relative group w-full">
                              <input
                                type="text"
                                placeholder="Accommodation Name"
                                value={
                                  accommodationDetails[day - 1]?.name || ""
                                }
                                disabled={!accommodations[day - 1]}
                                onFocus={() => setActiveAccommodationDay(day)}
                                onChange={(e) => {
                                  const updated = [...accommodationDetails];
                                  updated[day - 1].name = e.target.value;
                                  setAccommodationDetails(updated);
                                  setAccommodationValue(e.target.value);
                                }}
                                className="bg-textCardDark p-2 w-full rounded-lg text-textCard"
                              />
                              {activeAccommodationDay === day &&
                                accommodationStatus === "OK" && (
                                  <ul className="absolute z-10 left-0 mt-1 bg-white text-black border border-gray-300 rounded-md shadow-lg w-full max-h-40 overflow-y-auto">
                                    {accommodationData.map(
                                      ({ place_id, description }) => (
                                        <li
                                          key={place_id}
                                          onClick={() =>
                                            handleAccommodationSelect(
                                              description,
                                              day
                                            )
                                          }
                                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                        >
                                          {description}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                )}
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer ml-2 mt-2">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={accommodations[day - 1]}
                                onChange={() => toggleAccommodation(day)}
                              />
                              <div className="w-8 h-3 bg-textCard peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-topHeader rounded-full peer-checked:bg-topHeader transition-colors"></div>
                              <div className="absolute h-3 w-3 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-[1.5rem]"></div>
                            </label>
                          </div>

                          <div className="bg-list rounded-lg w-[32%] text-sm flex flex-row justify-start p-2 text-textCard">
                            <img
                              src={Moneybox}
                              className="w-8 h-6 my-1"
                              alt="Money Icon"
                            />
                            <div className="flex items-center">
                              $&nbsp;
                              <input
                                type="text"
                                className="bg-textCardDark rounded-lg w-full h-7 px-2"
                                maxLength={4}
                                name="cost"
                                placeholder="Budget"
                                value={
                                  accommodationDetails[day - 1]?.cost || ""
                                }
                                onChange={(e) => {
                                  const updated = [...accommodationDetails];
                                  updated[day - 1].cost = e.target.value;
                                  setAccommodationDetails(updated);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button
          className="bg-blue-600 px-4 py-2 rounded text-white"
          onClick={() => handleRouteOptimize(dayMap)}
        >
          Optimize Route
        </button>

        <button
          className="bg-green-600 px-4 py-2 rounded text-white"
          onClick={handleConfirmUpdates}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default EditPrompt;
