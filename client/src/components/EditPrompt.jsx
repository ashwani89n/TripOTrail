import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import AlarmClock from "../images/AlarmClock.png";
import Moneybox from "../images/MoneyBox.png";
import addStop from "../images/Sum.png";
import { MapPin, Flag, Target } from "lucide-react";
import TimelineView from "./TimelineView";
import dayjs from "dayjs";

const EditPrompt = ({ itinerary, startDt, endDt, resetDates }) => {
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
  const [showTimeline, setShowTimeline] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dayMap, setDayMap] = useState([]);
  const [startDate, setStartDate] = useState(startDt);
  const [endDate, setEndDate] = useState(endDt);

  const originalDayMap = useRef({});
  const originalInputValues = useRef({});
  const originalStartTimes = useRef([]);
  const originalStartDateRef = useRef(startDt);
  const originalEndDateRef = useRef(endDt);
  const originalItinerary = useRef([]);

  useEffect(() => {
    if (!originalItinerary.current) {
      originalItinerary.current = itinerary;
      originalStartDateRef.current = startDt;
      originalEndDateRef.current = endDt;
      originalItinerary.current = JSON.parse(JSON.stringify(itinerary));
      originalStartTimes.current = JSON.parse(JSON.stringify(initStartTimes));
    }
  }, [itinerary]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setAccommodationValue(debouncedPopupValue);
    }, 800);
    return () => clearTimeout(delayDebounce);
  }, [debouncedPopupValue]);

  const [query, setQuery] = useState("");

  const calculateTripDays = (start, end) => {
    const days = [];
    const startDate = dayjs(start);
    const endDate = dayjs(end);

    let current = startDate;
    while (current.isBefore(endDate) || current.isSame(endDate)) {
      days.push({
        dayDate: current.toISOString(),
        weekday: current.format("dddd"),
        formatted: current.format("DD MMMM, YYYY"),
      });
      current = current.add(1, "day");
    }

    return {
      daysCount: days.length,
      dayDetails: days,
    };
  };

  const { daysCount, dayDetails } = calculateTripDays(startDt, endDt);
  const ADD_STOP_ID = "__ADD_STOP__";

  const [startTimes, setStartTimes] = useState(
    Array.from({ length: daysCount }, () => ({ hour: "", minute: "" }))
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

  // const [dayMap, setDayMap] = useState(() =>
  //   itinerary.reduce((acc, curr, idx) => {
  //     acc[idx + 1] = (curr.selected_spots || []).map((spot) => ({
  //       ...spot,
  //       is_added: spot.is_added ?? true,
  //     }));
  //     return acc;
  //   }, {})
  // );

  // useEffect(() => {
  //   const init = itinerary.reduce((acc, curr, idx) => {
  //     acc[idx + 1] = (curr.selected_spots || []).map((spot) => ({
  //       ...spot,
  //       is_added: spot.is_added ?? true,
  //     }));
  //     return acc;
  //   }, {});

  //   setDayMap(init);
  //   setInitialDayMap(init);

  //   originalDayMap.current = init;
  //   originalInputValues.current = inputValues;
  //   originalStartTimes.current = startTimes;
  // }, [itinerary]);

  const didInitOnce = useRef(false);

  useEffect(() => {
    if (didInitOnce.current) return;

    const init = itinerary.reduce((acc, curr, idx) => {
      acc[idx + 1] = (curr.selected_spots || []).map((spot) => ({
        ...spot,
        is_added: spot.is_added ?? true,
      }));
      return acc;
    }, {});

    const initInputValues = {};
    const initStartTimes = [];
    const initAccommodations = [];
    const initAccommodationDetails = [];

    itinerary.forEach((day, index) => {
      (day.selected_spots || []).forEach((spot) => {
        initInputValues[spot.name] = {
          durationHour: spot.duration?.hours ?? "",
          durationMinute: spot.duration?.minutes ?? "",
          cost: spot.cost ?? "0.00",
        };
      });
      if (day.startHour && day.startMinute) {
        initStartTimes[index] = {
          hour: day.startHour,
          minute: day.startMinute,
        };
      } else if (day.selected_spots?.[0]?.travelTime) {
        const [hour, minute] = day.selected_spots[0].travelTime.split(":");
        initStartTimes[index] = { hour, minute };
      } else {
        initStartTimes[index] = { hour: "09", minute: "00" };
      }
      
      initAccommodations[index] = false;
      initAccommodationDetails[index] = {
        name: "",
        cost: "",
        coordinates: null,
      };
    });

    // Set state
    setDayMap(init);
    setInputValues(initInputValues);
    setStartTimes(initStartTimes);
    setAccommodations(initAccommodations);
    setAccommodationDetails(initAccommodationDetails);
    setStartDate(startDt);
    setEndDate(endDt);

    // Store original for undo
    originalDayMap.current = JSON.parse(JSON.stringify(init));
    originalInputValues.current = JSON.parse(JSON.stringify(initInputValues));
    originalStartTimes.current = JSON.parse(JSON.stringify(initStartTimes));
    originalAccommodations.current = [...initAccommodations];
    originalAccommodationDetails.current = JSON.parse(
      JSON.stringify(initAccommodationDetails)
    );
    originalStartDateRef.current = startDt;
    originalEndDateRef.current = endDt;

    didInitOnce.current = true; // prevent re-run
  }, [itinerary, startDt, endDt]);

  const {
    ready: accommodationReady,
    value: accommodationValue,
    suggestions: { status: accommodationStatus, data: accommodationData },
    setValue: setAccommodationValue,
    clearSuggestions: clearAccommodationSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { types: ["establishment"] },
    debounce: 300,
  });

  const originalAccommodationDetails = useRef(accommodationDetails);
  const originalAccommodations = useRef(accommodations);
  const originalAccommodationValue = useRef(accommodationValue);

  const latestDayMapRef = useRef(dayMap);
  useEffect(() => {
    latestDayMapRef.current = dayMap;
  }, [dayMap]);

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
      const beforeSpot = allSpots.find(
        (s) => s.name === beforeAfterSpots.before
      );
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

  // // For End location to appear in last spot
  // useEffect(() => {
  //   const updatedDayMap = { ...dayMap };
  //   let endSpot = null;
  //   let endDay = null;

  //   // Step 1: Search all days for the end-location
  //   for (let d = 1; d <= daysCount; d++) {
  //     const index = updatedDayMap[d]?.findIndex((s) => s.category === "end");
  //     if (index !== -1 && index != null) {
  //       endSpot = updatedDayMap[d][index];
  //       endDay = d;
  //       updatedDayMap[d].splice(index, 1);
  //       break;
  //     }
  //   }

  //   if (endSpot) {
  //     if (!updatedDayMap[daysCount]) updatedDayMap[daysCount] = [];
  //     updatedDayMap[daysCount].push(endSpot);
  //     setDayMap(updatedDayMap);
  //   }
  // }, [daysCount]);

  const fetchPopupAttractions = async (start, end) => {
    console.log("fetch attractions");
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
      console.error("Error in fetchPopupAttractions:", err);
    } finally {
      setPopupLoading(false);
    }
  };

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

  // useEffect(() => {
  //   const initialStartTimes = [];
  //   const initialInputValues = {};

  //   itinerary.forEach((dayData, dayIndex) => {
  //     const spots = dayData.selected_spots || [];

  //     // Set the start time for the day using the travelTime of the first spot
  //     if (spots.length > 0) {
  //       const [hour, minute] = (spots[0].travelTime || "00:00").split(":");
  //       initialStartTimes[dayIndex] = { hour, minute };
  //     } else {
  //       initialStartTimes[dayIndex] = { hour: "", minute: "" };
  //     }

  //     // Populate input values for each spot
  //     spots.forEach((spot) => {
  //       const durationHour = spot.duration?.hours?.toString() || "00";
  //       const durationMinute = spot.duration?.minutes?.toString() || "00";
  //       const cost = spot.cost?.toString() || "";

  //       initialInputValues[spot.name] = {
  //         durationHour,
  //         durationMinute,
  //         cost,
  //       };
  //     });
  //   });

  //   setStartTimes(initialStartTimes);
  //   setInputValues(initialInputValues);
  // }, [itinerary]);

  // useEffect(() => {
  //   const enrichAndUpdate = async () => {
  //     const rawItinerary = await Promise.all(
  //       Object.entries(latestDayMapRef.current)
  //         .map(async ([day, spots]) => {
  //           const enrichedSpots = await Promise.all(
  //             spots
  //               .filter((s) => s.is_added)
  //               .map(async (s) => {
  //                 const enriched = await ensureCoordinates(s);
  //                 return {
  //                   ...enriched,
  //                   duration: {
  //                     hours: inputValues[s.name]?.durationHour ?? "",
  //                     minutes: inputValues[s.name]?.durationMinute ?? "",
  //                   },
  //                   cost: inputValues[s.name]?.cost ?? s.cost ?? "0.00",
  //                 };
  //               })
  //           );

  //           return {
  //             day_number: parseInt(day),
  //             selected_spots: enrichedSpots,
  //           };
  //         })
  //     );

  //     const finalItinerary = await computeTravelTimes(rawItinerary, startTimes, dayDetails);
  //     setUpdatedItinerary(finalItinerary);
  //   };

  //   enrichAndUpdate();
  // }, [dayMap, inputValues, startTimes]);

  useEffect(() => {
    const totalDays = dayjs(endDt).diff(dayjs(startDt), "day") + 1;

    setDayMap((prevMap) => {
      const newMap = {};
      let endSpot = null;

      // Step 1: Traverse all existing days to find the end spot
      for (const day of Object.keys(prevMap)) {
        const dayNum = parseInt(day);
        if (!dayNum) continue;

        const filteredSpots = [];

        for (const spot of prevMap[dayNum] || []) {
          if (spot.category === "end") {
            endSpot = spot;
          } else {
            filteredSpots.push(spot);
          }
        }

        // Only keep this day if it's within the new range
        if (dayNum <= totalDays) {
          newMap[dayNum] = filteredSpots;
        }
      }

      // Step 2: Add empty days if needed
      for (let i = 1; i <= totalDays; i++) {
        if (!newMap[i]) newMap[i] = [];
      }

      // Step 3: Push end spot to new last day
      if (endSpot) {
        newMap[totalDays].push(endSpot);
      }

      return newMap;
    });
    setAccommodations((prev) => prev.slice(0, totalDays - 1));
    setAccommodationDetails((prev) => prev.slice(0, totalDays - 1));
  }, [startDt, endDt]);

  useEffect(() => {
    setStartTimes((prev) => {
      const filled = [...prev];
      for (let i = prev.length; i < daysCount; i++) {
        filled[i] = { hour: "", minute: "" };
      }
      return filled.slice(0, daysCount);
    });
  }, [daysCount]);

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

    // Use popupStartValue to find the correct day
    const targetDay = Object.keys(updated).find((key) =>
      updated[key].some((s) => s.name === popupStartValue)
    );

    if (!targetDay) return;

    const day = parseInt(targetDay);

    const acc = accommodationDetails[day - 1];
    if (
      accommodations[day - 1] &&
      acc?.name?.toLowerCase().trim() === place.name.toLowerCase().trim()
    ) {
      console.warn("This is already set as accommodation, not adding.");
      return;
    }

    const beforeIndex = updated[day].findIndex(
      (s) => s.name === popupStartValue
    );
    const afterIndex = updated[day].findIndex((s) => s.name === popupEndValue);

    // Prevent duplicates
    const alreadyExists = updated[day].some((s) => s.name === place.name);
    if (alreadyExists) return;

    // Determine insert location using end if available, else after start
    const insertIndex = afterIndex !== -1 ? afterIndex : beforeIndex + 1;

    updated[day].splice(insertIndex, 0, newStop);

    // Clean up

    // Inside handleInsertStop
    setDayMap(updated);
    latestDayMapRef.current = updated;

    console.log("1:", dayMap);
    setBeforeAfterSpots({ before: null, after: null });
    setPopupAttractions((prev) => prev.filter((p) => p.name !== place.name));
    setPopupStartValue("");
    setPopupEndValue("");
  };

  const isEmpty = (val) =>
    val === undefined || val === null || val.trim() === "";

  const allDetailsEntered = () => {
    for (let day = 1; day <= daysCount; day++) {
      const start = startTimes[day - 1];

      if (!start?.hour || isNaN(start.hour)) {
        alert(`Please enter start hour for Day ${day}`);
        return false;
      }

      for (const spot of dayMap[day]) {
        if (spot.is_added) {
          const duration = inputValues[spot.name];
          const hour = duration?.durationHour ?? "";
          const minute = duration?.durationMinute ?? "";
          console.log(spot.name, duration);

          const hasHour = hour !== "";
          const hasMin = minute !== "";

          if (
            !hasHour &&
            !hasMin &&
            spot.category != "start" &&
            spot.category != "end"
          ) {
            alert(`Please enter duration for "${spot.name}" on Day ${day}`);
            return false;
          }
        }
      }
    }

    // Final check: Last day must have more than just an "end" spot
    const lastDaySpots = (dayMap[daysCount] || []).filter((s) => s.is_added);
    const onlyEnd =
      lastDaySpots.length === 1 && lastDaySpots[0]?.category === "end";

    const prevAcc =
      accommodations[daysCount - 2] && accommodationDetails[daysCount - 2];

    if (onlyEnd && !prevAcc?.name) {
      alert("Last day must have at least one stop (not just an end location).");
      return false;
    }

    return true;
  };

  const handleConfirmUpdates = () => {
    if (allDetailsEntered) {
    } else return;

    // Call back to parent (optional): maybe via a prop like onConfirmUpdate(updatedItinerary)
  };
  const [updatedItinerary, setUpdatedItinerary] = useState(() =>
    itinerary.map((item) => ({
      day_number: item.day_number,
      selected_spots: item.selected_spots || [],
    }))
  );
  const handlePreview = async () => {
    if (!allDetailsEntered()) return;
  
    const rawItinerary = await Promise.all(
      Object.entries(latestDayMapRef.current).map(async ([day, spots]) => {
        const dayNumber = parseInt(day);
        const meta = dayDetails[dayNumber - 1];
  
        const enrichedSpots = await Promise.all(
          spots
            .filter((s) => {
              const name = s.name?.toLowerCase().trim();
              const accName = accommodationDetails[dayNumber - 1]?.name?.toLowerCase().trim();
              const isDuplicateAccommodation =
                accommodations[dayNumber - 1] && name === accName;
              return s.is_added && !isDuplicateAccommodation;
            })
            .map(async (s) => {
              const enriched = await ensureCoordinates(s);
              const nameKey = s.name ?? "unknown";
              const saved = inputValues[nameKey] ?? {};
  
              return {
                ...enriched,
                duration: {
                  hours: saved.durationHour ?? s.duration?.hours ?? "0",
                  minutes: saved.durationMinute ?? s.duration?.minutes ?? "0",
                },
                cost: saved.cost ?? s.cost ?? "0.00",
              };
            })
        );
  
        return {
          day_number: dayNumber,
          selected_spots: enrichedSpots,
          dayDate: meta?.dayDate ?? "",
          weekday: meta?.weekday ?? "",
        };
      })
    );
  
    // Step 1: Copy the raw itinerary
    const enrichedItinerary = rawItinerary.map((day) => ({
      ...day,
      selected_spots: [...day.selected_spots],
    }));
  
    // Step 2: Get only the valid active day indexes
    const validDayIndexes = Object.keys(latestDayMapRef.current).map((key) => parseInt(key) - 1);
  
    // Step 3: Inject accommodations only for valid days
    for (let idx = 0; idx < daysCount - 1; idx++) {
  const currentDay = enrichedItinerary[idx];

  // SKIP if this day is now outside the current trip range
  if (currentDay.day_number > daysCount) continue;

  const acc = accommodationDetails[idx];

  if (accommodations[idx] && acc && acc.name && acc.coordinates) {
    const spots = currentDay.selected_spots;

    const alreadyInDay = spots.some(
      (s) =>
        s.name?.toLowerCase().trim() === acc.name?.toLowerCase().trim() &&
        s.category === "accomodation"
    );

    if (!alreadyInDay) {
      spots.push({
        name: acc.name,
        coordinates: acc.coordinates,
        category: "accomodation",
        cost: acc.cost || "0.00",
        duration: { hours: "0", minutes: "0" },
        travelTime: "",
        is_added: true,
      });
    }

    const nextDay = enrichedItinerary[idx + 1];
    if (nextDay && nextDay.day_number <= daysCount) {
      const alreadyInNextDay = nextDay.selected_spots.some(
        (s) =>
          s.name?.toLowerCase().trim() === acc.name?.toLowerCase().trim() &&
          s.category === "accomodation"
      );

      if (!alreadyInNextDay) {
        nextDay.selected_spots.unshift({
          name: acc.name,
          coordinates: acc.coordinates,
          category: "accomodation",
          cost: acc.cost || "0.00",
          duration: { hours: "0", minutes: "0" },
          travelTime: "",
          is_added: true,
        });
      }
    }
  }
}

    
  
    const finalItinerary = await computeTravelTimes(
      enrichedItinerary,
      startTimes,
      dayDetails,
      accommodationDetails
    );
  
    setUpdatedItinerary(finalItinerary);
    setShowTimeline(true);
  };
  
  

  const rawItinerary = Object.entries(latestDayMapRef.current)
    .map(([day, spots]) => {
      const dayNumber = parseInt(day);
      const meta = dayDetails[dayNumber - 1];

      const activeSpots = spots
        .filter((s) => s.is_added)
        .map((s) => ({
          ...s,
          duration: {
            hours: inputValues[s.name]?.durationHour ?? "",
            minutes: inputValues[s.name]?.durationMinute ?? "",
          },
          cost: inputValues[s.name]?.cost ?? s.cost ?? "0.00",
        }));

      return {
        day_number: dayNumber,
        selected_spots: activeSpots,
        dayDate: meta?.dayDate ?? "",
        weekday: meta?.weekday ?? "",
      };
    })
    .sort((a, b) => a.day_number - b.day_number);

  const [initialDayMap, setInitialDayMap] = useState(null);

  useEffect(() => {
    const init = itinerary.reduce((acc, curr, idx) => {
      acc[idx + 1] = (curr.selected_spots || []).map((spot) => ({
        ...spot,
        is_added: spot.is_added ?? true,
      }));
      return acc;
    }, {});
    setDayMap(init);
    setInitialDayMap(init);
  }, [itinerary]);

  const enrichDaySpotsWithCoordinates = async (spots) => {
    return await Promise.all(spots.map((spot) => ensureCoordinates(spot)));
  };

  const handleRouteOptimize = async () => {
    const updated = { ...dayMap };

    for (const day of Object.keys(updated)) {
      const daySpots = updated[day];

      // Ensure all spots have coordinates
      const enrichedSpotsRaw = await enrichDaySpotsWithCoordinates(daySpots);

      // ✅ Inject duration & cost from inputValues
      const enrichedSpots = enrichedSpotsRaw.map((spot) => {
        const nameKey = spot.name ?? "unknown";
        return {
          ...spot,
          cost: inputValues[nameKey]?.cost ?? spot.cost ?? "0.00",
          duration: {
            hours:
              inputValues[nameKey]?.durationHour ?? spot.duration?.hours ?? "0",
            minutes:
              inputValues[nameKey]?.durationMinute ??
              spot.duration?.minutes ??
              "0",
          },
        };
      });

      let start = enrichedSpots.find((s) => s.category === "start");
      let end = enrichedSpots.find((s) => s.category === "end");

      // Use accommodation as end if end not found and toggle is on
      if (!end && accommodations[day - 1]) {
        const acc = accommodationDetails[day - 1];
        if (acc?.coordinates) {
          end = {
            ...acc,
            category: "end",
            duration: { hours: "0", minutes: "0" },
            cost: acc.cost || "0.00",
            is_added: true,
          };
          console.log("Using accommodation as end location:", end);
        }
      }

      // Filter mids (exclude start/end and only include accommodation if toggled)
      const mids = enrichedSpots.filter((s) => {
        if (["start", "end"].includes(s.category)) return false;
        if (s.category === "accomodation") {
          return accommodations[day - 1]; // include only if toggled on
        }
        return true;
      });

      console.log(`DAY ${day}:`);
      console.log("Start:", start);
      console.log("End:", end);

      if (!start?.coordinates || !end?.coordinates || mids.length === 0) {
        console.warn(
          `Cannot optimize day ${day} — missing start/end or no mids`,
          {
            start,
            end,
            mids,
          }
        );
        continue;
      }

      const optimized = getOptimizedRoute(start, mids, end);
      updated[day] = optimized;
    }

    setDayMap(updated);
  };

  function calculateDistance(a, b) {
    if (!a?.coordinates || !b?.coordinates) {
      console.warn("Missing coordinates:", { a, b });
      return Infinity;
    }

    const toRad = (deg) => (deg * Math.PI) / 180;

    const lat1 = a.coordinates.lat;
    const lon1 = a.coordinates.lng;
    const lat2 = b.coordinates.lat;
    const lon2 = b.coordinates.lng;

    const R = 6371; // Earth radius in kilometers

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const aVal =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
    return R * c; // distance in kilometers
  }

  function getTotalDistance(path) {
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      total += calculateDistance(path[i], path[i + 1]);
    }
    return total;
  }

  function permute(arr) {
    if (arr.length <= 1) return [arr];

    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i];
      const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
      for (const perm of permute(remaining)) {
        result.push([current, ...perm]);
      }
    }
    return result;
  }

  function getOptimizedRoute(start, mids, end) {
    const allPermutations = permute(mids);
    let bestRoute = null;
    let shortestDistance = Infinity;

    for (const order of allPermutations) {
      const fullRoute = [start, ...order, end];
      const distance = getTotalDistance(fullRoute);

      if (distance < shortestDistance) {
        shortestDistance = distance;
        bestRoute = fullRoute;
      }
    }

    return bestRoute;
  }

  const computeTravelTimes = async (
    itinerary,
    startTimes,
    dayDetails,
    accommodationDetails
  ) => {
    if (!window.google || !window.google.maps) {
      console.warn("Google Maps API not loaded");
      return itinerary;
    }

    const service = new window.google.maps.DistanceMatrixService();

    const updated = await Promise.all(
      itinerary.map(async (day) => {
        const spots = [...day.selected_spots];

        // Use previous day's accommodation as start if available
        if (day.day_number > 1) {
          const prevAcc = accommodationDetails[day - 1];
          if (accommodations[day - 1] && prevAcc?.coordinates && prevAcc.name) {
            spots.unshift({
              name: prevAcc.name,
              coordinates: prevAcc.coordinates,
              category: "accomodation",
              cost: prevAcc.cost || "0.00",
              duration: { hours: "0", minutes: "0" },
              travelTime: "",
              is_added: true,
            });
          }
        }

        if (!spots.length) return day;

        const hour = startTimes[day.day_number - 1]?.hour || "09";
        const minute = startTimes[day.day_number - 1]?.minute || "00"; // <-- ADD THIS

        const initialTime = `${hour.padStart(2, "0")}:${minute.padStart(
          2,
          "0"
        )}`;
        const dayDate = dayDetails[day.day_number - 1]?.date;
        const formattedDate = dayjs(dayDate).format("YYYY-MM-DD");
        const fullDateTime = `${formattedDate}T${initialTime}`;
        let currentTime = dayjs(fullDateTime);

        // Set first spot's timeline and travelTime to start time
        spots[0].timeLine = currentTime.format("HH:mm");
        spots[0].travelTime = currentTime.format("HH:mm");

        for (let i = 0; i < spots.length - 1; i++) {
          const origin = spots[i].coordinates;
          const destination = spots[i + 1].coordinates;

          if (!origin || !destination) continue;

          const response = await new Promise((resolve, reject) => {
            service.getDistanceMatrix(
              {
                origins: [
                  new window.google.maps.LatLng(origin.lat, origin.lng),
                ],
                destinations: [
                  new window.google.maps.LatLng(
                    destination.lat,
                    destination.lng
                  ),
                ],
                travelMode: window.google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === "OK") resolve(result);
                else reject(status);
              }
            );
          });

          const element = response?.rows?.[0]?.elements?.[0];
          if (!element || element.status !== "OK" || !element.duration) {
            console.warn(
              "DistanceMatrix failed for",
              spots[i].name,
              "→",
              spots[i + 1].name
            );
            continue;
          }

          const travelTimeMin = Math.floor(element.duration.value / 60);

          const dur = spots[i]?.duration || {};
          const durationMin =
            parseInt(dur.hours || "0", 10) * 60 +
            parseInt(dur.minutes || "0", 10);

          const bufferMin = 10;

          // Use currentTime instead of reading from spots[i]
          currentTime = currentTime
            .add(durationMin, "minute")
            .add(travelTimeMin, "minute")
            .add(bufferMin, "minute");

          // Set arrival time for next spot
          spots[i + 1].timeLine = currentTime.format("HH:mm");
          spots[i + 1].travelTime = currentTime.format("HH:mm");
        }

        return {
          ...day,
          selected_spots: spots,
        };
      })
    );

    return updated;
  };

  const ensureCoordinates = async (spot) => {
    if (spot?.coordinates?.lat && spot?.coordinates?.lng) return spot;

    const locationString = spot?.address || spot?.name;

    if (!locationString) {
      console.warn("Cannot geocode spot: Missing name or address", spot);
      return spot;
    }

    try {
      const results = await getGeocode({ address: locationString });
      const { lat, lng } = await getLatLng(results[0]);
      return { ...spot, coordinates: { lat, lng } };
    } catch (err) {
      console.warn("Geocoding failed for:", locationString, err);
      return spot;
    }
  };

  // const handleUndo = () => {
  // const original = originalItineraryRef.current;
  // if (!original) return;

  // const restoredMap = original.reduce((acc, curr, idx) => {
  //   acc[idx + 1] = (curr.selected_spots || []).map((spot) => ({
  //     ...spot,
  //     is_added: true,
  //   }));
  //   return acc;
  // }, {});

  // setDayMap(restoredMap);
  // setInputValues({});
  // setAccommodationDetails(
  //   Array(original.length - 1).fill({
  //     name: "",
  //     cost: "",
  //     location: "",
  //     coordinates: null,
  //   })
  // );
  // setStartTimes(Array(original.length).fill({ hour: "", minute: "" }));
  // setShowTimeline(false);
  // setUpdatedItinerary([]);

  const handleUndo = () => {
    setDayMap(JSON.parse(JSON.stringify(originalDayMap.current)));
    setInputValues(JSON.parse(JSON.stringify(originalInputValues.current)));
    setStartTimes(JSON.parse(JSON.stringify(originalStartTimes.current)));
    setAccommodations([...originalAccommodations.current]);
    setAccommodationDetails(
      JSON.parse(JSON.stringify(originalAccommodationDetails.current))
    );
    setStartDate(originalStartDateRef.current);
    setEndDate(originalEndDateRef.current);
    setShowTimeline(false);

    if (typeof resetDates === "function") {
      resetDates(); // 🟢 This syncs calendar in UpcomingMytrip
    }
  };

  // };

  return (
    <div className="w-full text-white h-full flex flex-col space-y-4">
      {showMessage && (
        <p className="text-center text-sm text-textCard mt-1">
          To change dates, go to{" "}
          <span className="font-semibold">Edit Trip</span>.
        </p>
      )}
      <div className="w-full flex flex-row gap-4 h-[600px] ">
        <div className="w-2/5  bg-headerBG  h-full rounded-lg  space-y-4 ">
          {!showTimeline ? (
            <div className="text-white flex flex-col p-7">
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
                    className="bg-textCardDark w-full h-[31px] rounded-md pl-8 text-myTripSearchBGLite"
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
                    className="bg-textCardDark w-full h-[31px] rounded-md pl-8 text-myTripSearchBGLite"
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
                    className="bg-textCardDark w-full h-[31px] rounded-md pl-8 text-myTripSearchBGLite"
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
                  className="bg-textCardDark h-[31px] rounded-md text-sm text-myTripSearchBGLite px-2 outline-none "
                >
                  <option value="tourist_attraction">Attractions</option>
                  <option value="restaurant">Restaurants</option>
                </select>

                <div className="relative col-span-1 md:col-span-2">
                  <input
                    className="bg-textCardDark w-full h-[31px] rounded-md pl-3 italic"
                    placeholder="Search by location..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <button
                  disabled={!(popupStartValue && popupEndValue)}
                  className="text-sm bg-topHeader text-myTripSearchBGLite px-3 py-[4px] rounded hover:bg-opacity-90 transition w-full sm:w-auto disabled:opacity-50"
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
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mt-6 pr-5">
                    {popupAttractions
                      .filter((item) =>
                        query.trim()
                          ? item.name
                              .toLowerCase()
                              .includes(query.toLowerCase())
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
          ) : (
            <div className="w-full flex flex-row gap-4 flex-1 overflow-hidden">
              {console.log("before:", startDt)}
              <TimelineView
                itinerary={updatedItinerary}
                tripStartDate={startDt}
              />
            </div>
          )}
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
                                  ...(updated[day - 1] ?? {
                                    hour: "",
                                    minute: "",
                                  }),
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
                                  ...(updated[day - 1] ?? {
                                    hour: "",
                                    minute: "",
                                  }),
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
                              className="w-full flex flex-row gap-2 items-start bg-list p-3 rounded-lg outline-none"
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
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-200 outline-none"
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
                                  console.log(
                                    "11111:",
                                    popupEndValue,
                                    popupStartValue
                                  );
                                  if (popupStartValue && popupEndValue) {
                                    fetchPopupAttractions(
                                      popupStartValue,
                                      popupEndValue
                                    );
                                  }
                                }}
                              >
                                <img
                                  src={addStop}
                                  alt="add stop"
                                  className={`w-8 h-6 mt-2 transition-opacity duration-200 outline-none ${
                                    showTimeline
                                      ? "opacity-50 cursor-not-allowed"
                                      : "cursor-pointer"
                                  }`}
                                  title={
                                    showTimeline
                                      ? "Click on Add Stop to proceed"
                                      : ""
                                  }
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

                                  <div className="bg-list rounded-lg w-[22%] text-sm flex flex-row justify-between items-center p-2 text-textCard">
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

                                  <div className="bg-list rounded-lg w-[18%] text-sm flex flex-row justify-between items-center p-2 text-textCard">
                                    <img
                                      src={Moneybox}
                                      className="w-8 h-6"
                                      alt="cost"
                                    />
                                    <div className="flex items-center">
                                      $&nbsp;
                                      <input
                                        type="text"
                                        className="bg-textCardDark rounded-lg w-16 h-7 px-2"
                                        maxLength={7}
                                        value={
                                          inputValues[item.name]?.cost !==
                                          undefined
                                            ? inputValues[item.name].cost
                                            : "0.00"
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
                                        onBlur={(e) => {
                                          const value = parseFloat(
                                            e.target.value
                                          );
                                          if (!isNaN(value)) {
                                            setInputValues((prev) => ({
                                              ...prev,
                                              [item.name]: {
                                                ...prev[item.name],
                                                cost: value.toFixed(2),
                                              },
                                            }));
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="w-[4%] ">
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
                                            setPopupEndValue(startVal);
                                          }
                                        }
                                        console.log(
                                          "11111:",
                                          popupEndValue,
                                          popupStartValue
                                        );
                                        if (popupStartValue && popupEndValue) {
                                          fetchPopupAttractions(
                                            popupStartValue,
                                            popupEndValue
                                          );
                                        }
                                      }}
                                    >
                                      <img
                                        src={addStop}
                                        alt="add stop"
                                        className={`w-8 h-6 mt-2 transition-opacity duration-200 outline-none ${
                                          showTimeline
                                            ? "opacity-50 cursor-not-allowed"
                                            : "cursor-pointer"
                                        }`}
                                        title={
                                          showTimeline
                                            ? "Click on Add Stop to proceed"
                                            : ""
                                        }
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
                                value={accommodationValue}
                                disabled={!accommodations[day - 1]}
                                onFocus={() => {
                                  setActiveAccommodationDay(day);
                                  setAccommodationValue(
                                    accommodationDetails[day - 1]?.name || ""
                                  );
                                }}
                                onChange={(e) => {
                                  const val = e.target.value;

                                  setAccommodationDetails((prev) => {
                                    const updated = [...prev];
                                    const existing = updated[day - 1] || {
                                      name: "",
                                      cost: "",
                                      location: "",
                                      coordinates: null,
                                    };

                                    updated[day - 1] = {
                                      ...existing,
                                      name: val,
                                    };

                                    return updated;
                                  });
                                  setAccommodationValue(val);
                                }}
                                // THIS IS WHAT TRIGGERS AUTOCOMPLETE

                                className="bg-textCardDark p-2 w-full rounded-lg text-textCard"
                              />
                              {activeAccommodationDay === day &&
                                accommodationStatus === "OK" &&
                                accommodationData.length > 0 && (
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
                                maxLength={7}
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
                                onBlur={(e) => {
                                  const formatted = parseFloat(
                                    e.target.value || "0"
                                  ).toFixed(2);
                                  const updated = [...accommodationDetails];
                                  if (!updated[day - 1]) updated[day - 1] = {};
                                  updated[day - 1].cost = formatted;
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
      {/* <div className="flex justify-end gap-4 mt-6">
        <button
          className="bg-topHeader text-white p-2 px-10 font-semibold rounded-lg"
          onClick={handleUndo}
        >
          Discard
        </button>
        <button
          className="bg-topHeader text-white p-2 px-10 flex gap-3 font-semibold rounded-lg items-center"
          onClick={() => setShowTimeline(false)}
        >
          Add Stop
        </button>
        <button
          className="bg-topHeader text-white p-2 px-10 flex gap-3 font-semibold rounded-lg items-center"
          onClick={() => {
            handlePreview();
          }}
        >
          Preview
        </button>
        <button
          className="bg-topHeader text-white p-2 px-10 flex gap-3 font-semibold rounded-lg items-center"
          onClick={() => handleRouteOptimize(dayMap)}
        >
          Optimize
        </button>
        <button
          className="bg-topHeader text-white p-2 px-10 flex gap-3 font-semibold rounded-lg items-center"
          onClick={handleConfirmUpdates}
        >
          Confirm
        </button>
      </div> */}
      <div className="flex items-center justify-end gap-3 mt-4 mr-5">
        {/* Primary Actions */}
        <button
          className="bg-topHeader text-white px-5 py-2 rounded-lg font-semibold hover:cursor-pointer"
          onClick={() => setShowTimeline(false)}
        >
          Add Stop
        </button>

        <button
          className="bg-topHeader text-white px-5 py-2 rounded-lg font-semibold hover:cursor-pointer"
          onClick={handleConfirmUpdates}
        >
          Confirm
        </button>

        {/* Dropdown for extras */}
        <div className="relative group">
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            ⋯
          </button>
          {showDropdown && (
            <div className="absolute right-0 bottom-full  bg-white border rounded-md shadow-lg w-48 mb-2 z-10">
              <ul className="flex flex-col text-left text-black text-sm">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowDropdown(false);
                    handlePreview();
                  }}
                >
                  Preview
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowDropdown(false);
                    handleRouteOptimize();
                  }}
                >
                  Optimize
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-topHeader"
                  onClick={() => {
                    setShowDropdown(false);
                    handleUndo();
                  }}
                >
                  Discard Changes
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPrompt;
