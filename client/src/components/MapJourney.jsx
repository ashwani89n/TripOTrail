import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { tripContext } from "../context/useTripDataContext";
import AlarmClock from "../images/AlarmClock.png";
import Moneybox from "../images/MoneyBox.png";
import DestinationPin from "../images/CabBackView.png";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const MapJourney = ({
  onClickNextPrev,
  selectedAttraction,
  sendDataToParent,
}) => {
  // const MapJourney = ({ onClickNextPrev , sendDataToParent}) => {
  const markerRefs = useRef([]);
  const [mapInstance, setMapInstance] = useState(null);
  //   const [selectedAttraction, setSelectedAttraction] = useState([
  //     {
  //       address: "",
  //       image: "",
  //       is_added: true,
  //       latitude: 33.8227293,
  //       longitude: -84.3717113,
  //       name: "2450 Camellia Lane Northeast, Atlanta, GA, USA",
  //       order_index: 1,
  //       position: "start",
  //     },
  //     {
  //       address: "425 Peachtree Hills Avenue Northeast #29b, Atlanta",
  //       image:
  //         "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAeeoHcJMAgoSbkMzMQG3eKOmp44nIHcCVsDDiCia6jYWlVOIKFZ0OjGH95qWBDiRdU2hUriBmqyNyOf9euth-i0SI6hyAaPI7F_nk32lrnmBU7GMJZj-vTrIgfWToKr2mg_QkhePuByvVl8dN3Yr0TI1HFOg-0g-1oY_uNyDei5ClKsMvaqFYJ5rexBQdnuLr_nQGt6zrJYsIsZJ9KjtjjUo8vsGqyocc8p62kBs2NrSYCWN8nGM499dqfE8tMILJdWcg0Tv8UkcuslSxnRQEq1Ucl2i4Ohboba3H59Tgg5uUzjySnTpWdKHTKpKGy6sXuzIvipN0OYy57E&3u400&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fplan&key=AIzaSyA3xEs87Yqi3PpC8YKGhztvrXNDJX5nNDw&token=77989",
  //       is_added: true,
  //       latitude: 33.8168204,
  //       longitude: -84.3756841,
  //       name: "Lumière",
  //       order_index: 2,
  //       position: "between",
  //     },
  //     {
  //       address: "2115 Piedmont Road Northeast, Atlanta",
  //       image:
  //         "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAeeoHcIFuKjKKeCBLoPFeZTlvF_9UrwIeKeLIo19oLvv2vv5zSbEGMOfK4MblHFOr1kCy6GL5kusSK6B46M8AWqhZiLlmPf855FUAe0LZsfokFYk--kh6tngkHjXZSTsVsArwM7BD8R7uOfc5t8jwroqQwCkkr_OA3rd11qQKMyJnoK88VMke3P4eWmupSNG_8NYUGhB31XxOTInYY4wcKNN9dDUo3wwkrkWjkhe12LL-w46RQ9dgNDt6nvw0pfSTgXTtOnPQbfbKO6qDct2wQkOareoiRAHoq44w1o8LOY_8sc6aQF7wFn5btBGTLnKRgqMFyd9PgmVZtfGZy50KpaeBYe-yVfDdF9V0qEMjtkq-K2GJDaKxZ8NRCHJlIKBC8SeFAoFEav_WOoW5s6dZTJmS_FfwEVhiHFDjLD-2cHFa9WiGcAgFlyH6IWYbDKAqJwhmBRhyS69qiR7QJ4ez5hQfEOmPZa9WvKVdoX1fmOQ15XhofJlxpH3pkn3F-XfjntWiLlkM3oDCKEXyxQCyIqZIswWR_ClmewGl-O1gg1gPP4U8a6lR36acpl56nL8G1z1nVUHEgSAr5O_XE0zNXVu4oTNXcb0kMHsSdohs_sEYVVWVHwa_F8dnJG5UiKjrXS6_2fm5w&3u400&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fplan&key=AIzaSyA3xEs87Yqi3PpC8YKGhztvrXNDJX5nNDw&token=120123",
  //       is_added: true,
  //       latitude: 33.8127915,
  //       longitude: -84.3657056,
  //       name: "Gurl Mobb Museum",
  //       order_index: 3,
  //       position: "between",
  //     },
  //     {
  //       address: "70 Lakeview Avenue Northeast, Atlanta",
  //       image: "",
  //       is_added: true,
  //       latitude: 33.82599239999999,
  //       longitude: -84.3845322,
  //       name: "Duck Pond Park",
  //       order_index: 4,
  //       position: "between",
  //     },
  //     {
  //       address: "",
  //       image: "",
  //       is_added: true,
  //       latitude: 33.8236359,
  //       longitude: -84.37147019999999,
  //       name: "2470 Camellia Lane Northeast, Atlanta, GA, USA",
  //       order_index: 5,
  //       position: "end",
  //     },
  //   ]);

  const [error, setError] = useState("");
  const {
    tripId,
    destinationPoint,
    startPoint,
    startDt,
    endDt,
    startCoordinates,
    destinationCoordinates,
    title,
    transportBudget
  } = useContext(tripContext);

  //   const startDt = "Tue Apr 08 2025 12:56:10 GMT-0400 (Eastern Daylight Time)";
  //   const endDt = "Tue Apr 09 2025 12:56:10 GMT-0400 (Eastern Daylight Time)";

  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [attractions, setAttractions] = useState(selectedAttraction);
  const mapRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const [inputValues, setInputValues] = useState({});
  //   const [startTime, setStartTime] = useState({
  //     hour:"00", minute: "00",
  //   })

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
  const [accommodationDetails, setAccommodationDetails] = useState(
    Array(daysCount - 1)
      .fill(null)
      .map(() => ({
        name: "",
        cost: "",
        location: "",
        coordinates: null,
      }))
  );
  const [activeAccommodationDay, setActiveAccommodationDay] = useState(null);
  const [accommodations, setAccommodations] = useState(
    Array(daysCount - 1).fill(false)
  );

  const [startTimes, setStartTimes] = useState(
    Array(daysCount).fill("") // Empty start times for each day
  );
  const [dayMap, setDayMap] = useState(() => {
    const map = {};
    for (let i = 1; i <= daysCount; i++) {
      map[i] = [];
    }
    map[1] = attractions.filter((a) => a.position === "between");
    return map;
  });

  // Trigger the markers update after setting new attractions
  useEffect(() => {
    if (!mapInstance) return; // Only proceed if map is initialized

    updateMapMarkers(attractions, mapInstance);
  }, [attractions, mapInstance]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceDay = parseInt(source.droppableId);
    const destDay = parseInt(destination.droppableId);

    const updatedDayMap = { ...dayMap };
    const [movedItem] = updatedDayMap[sourceDay].splice(source.index, 1);
    updatedDayMap[destDay].splice(destination.index, 0, movedItem);

    // Flatten all items in order across days
    const allBetween = Object.values(updatedDayMap)
      .flat()
      .filter((item) => item.is_added);

    const reindexedBetween = allBetween.map((item, idx) => ({
      ...item,
      order_index: idx + 2, // Start is 1, end is last+1
      position: "between",
    }));

    const start = attractions.find((a) => a.position === "start");
    const end = attractions.find((a) => a.position === "end");

    const finalAttractions = [
      { ...start, order_index: 1, position: "start" },
      ...reindexedBetween,
      { ...end, order_index: reindexedBetween.length + 2, position: "end" },
    ];

    setDayMap(updatedDayMap);
    setAttractions(finalAttractions);
  };

  const updateMapMarkers = (updatedAttractions, mapInstance) => {
    if (!mapInstance) return;
    // Clear existing markers
    markerRefs.current.forEach((marker) => {
      if (marker) {
        marker.setMap(null); // Remove from map
      }
    });
    markerRefs.current = []; // Reset the marker references array

    // Add new markers based on the updated attraction list
    updatedAttractions
      .filter((place) => place.is_added)
      .forEach((place) => {
        const markerContent = document.createElement("div");

        // Create the custom marker icon
        const markerIcon = document.createElement("img");
        markerIcon.src = DestinationPin; // Ensure to use the correct pin icon path
        markerIcon.alt = `Attraction ${place.order_index}`;
        markerIcon.style.width = "40px";
        markerIcon.style.height = "40px";
        markerContent.appendChild(markerIcon);

        // Create index label to display attraction order
        const indexLabel = document.createElement("span");
        indexLabel.textContent = place.order_index;
        indexLabel.style.position = "absolute";
        indexLabel.style.top = "16px";
        indexLabel.style.left = "50%";
        indexLabel.style.transform = "translateX(-50%)";
        indexLabel.style.fontSize = "10px";
        indexLabel.style.color = "white";
        indexLabel.style.fontWeight = "bold";
        markerContent.appendChild(indexLabel);

        // const marker = new window.google.maps.marker.AdvancedMarkerElement({
        //   position: { lat: place.latitude, lng: place.longitude },
        //   map: mapInstance,
        //   content: markerContent,
        //   title: `Attraction ${place.order_index}`,
        // });

        try {
          // Make sure everything is loaded and correct
          if (
            window.google?.maps?.marker?.AdvancedMarkerElement &&
            mapInstance instanceof window.google.maps.Map
          ) {
            const marker = new window.google.maps.marker.AdvancedMarkerElement({
              position: { lat: place.latitude, lng: place.longitude },
              map: mapInstance,
              content: markerContent,
              title: `Attraction ${place.order_index}`,
            });
        
            // ✅ Only push if the marker was created
            if (marker) {
              markerRefs.current.push(marker);
            }
          } else {
            console.warn("Advanced markers not available or map is invalid");
          }
        } catch (error) {
          console.error("Failed to create advanced marker:", error);
        }
        
      });
  };

  useEffect(() => {
    if (!selectedAttraction) return;

    const initialInputs = {};
    selectedAttraction.forEach((item) => {
      initialInputs[item.name] = {
        durationHour: "",
        durationMinute: "",
        cost: "0",
      };
    });
    setInputValues(initialInputs);
    // setStartTime({ hour: "00", minute: "00" });
  }, [selectedAttraction]);

  useEffect(() => {
    const initializeMap = () => {
      if (window.google && mapRef.current && !mapInstance) {
        const newMapInstance = new window.google.maps.Map(mapRef.current, {
          zoom: 13,
          center: {
            lat: attractions[0].latitude,
            lng: attractions[0].longitude,
          },
          mapId: "DEMO_MAP_ID", // Ensure to replace this with your actual Map ID
        });

        setMapInstance(newMapInstance);

        directionsServiceRef.current =
          new window.google.maps.DirectionsService();
        directionsRendererRef.current =
          new window.google.maps.DirectionsRenderer({
            suppressMarkers: true,
          });
        directionsRendererRef.current.setMap(newMapInstance);

        // Add markers once map is ready
        //updateMapMarkers(attractions, newMapInstance);
      }
    };

    const updateMapMarkers = (attractions, map) => {
      // Clear old markers
      markerRefs.current.forEach((marker) => marker?.setMap(null));
      markerRefs.current = [];

      // Add new markers
      attractions
        .filter((place) => place.is_added)
        .forEach((place) => {
          const markerContent = document.createElement("div");
          const markerIcon = document.createElement("img");
          markerIcon.src = DestinationPin; // Ensure to use the correct pin icon path
          markerIcon.alt = `Attraction ${place.order_index}`;
          markerIcon.style.width = "40px";
          markerIcon.style.height = "40px";
          markerContent.appendChild(markerIcon);

          const indexLabel = document.createElement("span");
          indexLabel.textContent = place.order_index;
          indexLabel.style.position = "absolute";
          indexLabel.style.top = "16px";
          indexLabel.style.left = "50%";
          indexLabel.style.transform = "translateX(-50%)";
          indexLabel.style.fontSize = "10px";
          indexLabel.style.color = "white";
          indexLabel.style.fontWeight = "bold";
          markerContent.appendChild(indexLabel);

          // const marker = new window.google.maps.marker.AdvancedMarkerElement({
          //   position: { lat: place.latitude, lng: place.longitude },
          //   map,
          //   content: markerContent,
          //   title: `Attraction ${place.order_index}`,
          // });

          try {
            // Make sure everything is loaded and correct
            if (
              window.google?.maps?.marker?.AdvancedMarkerElement &&
              mapInstance instanceof window.google.maps.Map
            ) {
              const marker = new window.google.maps.marker.AdvancedMarkerElement({
                position: { lat: place.latitude, lng: place.longitude },
                map: mapInstance,
                content: markerContent,
                title: `Attraction ${place.order_index}`,
              });
          
              // ✅ Only push if the marker was created
              if (marker) {
                markerRefs.current.push(marker);
              }
            } else {
              console.warn("Advanced markers not available or map is invalid");
            }
          } catch (error) {
            console.error("Failed to create advanced marker:", error);
          }
          
        });
    };

    if (!isGoogleMapsLoaded) {
      const interval = setInterval(() => {
        if (window.google && mapRef.current) {
          setIsGoogleMapsLoaded(true);
          initializeMap();
          clearInterval(interval);
        }
      }, 200);

      return () => clearInterval(interval);
    } else if (mapRef.current && !mapInstance) {
      initializeMap(); // Initialize map when loaded and no map instance
    } else if (mapInstance && attractions) {
      // If map instance exists, update markers when attractions change
      updateMapMarkers(attractions, mapInstance);
    }
  }, [isGoogleMapsLoaded, attractions, mapInstance]); // Ensure markers update on `attractions` change

  const calculateDirections = () => {
    if (
      !isGoogleMapsLoaded ||
      !directionsServiceRef.current ||
      !directionsRendererRef.current ||
      !attractions ||
      attractions.length === 0
    )
      return;

    const startPointData = attractions.find((p) => p.position === "start");
    const endPointData = attractions.find((p) => p.position === "end");
    const waypoints = attractions
      .filter((p) => p.position === "between" && p.is_added)
      .sort((a, b) => a.order_index - b.order_index)
      .map((place) => ({
        location: { lat: place.latitude, lng: place.longitude },
        stopover: true,
      }));

    directionsServiceRef.current.route(
      {
        origin: {
          lat: startPointData.latitude,
          lng: startPointData.longitude,
        },
        destination: {
          lat: endPointData.latitude,
          lng: endPointData.longitude,
        },
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRendererRef.current.setDirections(result);
        } else {
          console.error("Directions request failed:", status);
          setError("Failed to load directions");
        }
      }
    );
  };

  useEffect(() => {
    if (isGoogleMapsLoaded) {
      requestAnimationFrame(() => {
        calculateDirections();
      });
    }
  }, [attractions, isGoogleMapsLoaded]);

  const handlePrevious = () => {
    onClickNextPrev((prev) => prev - 1);
  };

  //   const handleNext = () => {
  //     // Validate top start time

  //     // const startHH = document
  //     //   .querySelector('input[name="start-hour"]')
  //     //   ?.value.trim();
  //     // const startMM = document
  //     //   .querySelector('input[name="start-minute"]')
  //     //   ?.value.trim();
  //     // if (!startHH || !startMM) {
  //     //   setError("Please enter Start Time");
  //     //   return;
  //     // } else if (parseInt(startHH, 10) > 24 || parseInt(startMM, 10) > 60) {
  //     //   setError("Please enter a valid Start Time");
  //     //   return;
  //     // }

  //     const items = Array.from(document.querySelectorAll("li[data-id]"));

  //     for (const li of items) {
  //       const id = li.getAttribute("data-id");

  //       const durHH = li
  //         .querySelector('input[name="duration-hour"]')
  //         ?.value.trim();
  //       const durMM = li
  //         .querySelector('input[name="duration-minute"]')
  //         ?.value.trim();
  //       const cost = li.querySelector('input[name="cost"]')?.value.trim();

  //       const durHHValue = parseInt(durHH, 10);
  //       const durMMValue = parseInt(durMM, 10);
  //       const costValue = parseInt(cost, 10);

  //       if (!durHH || !durMM || durHHValue > 24 || durMMValue > 60) {
  //         const label = li.querySelector("span")?.textContent?.trim() || id;
  //         setError(`Please enter valid Duration of spend for "${label}"`);
  //         return;
  //       } else if (!cost || costValue === 0) {
  //         const label = li.querySelector("span")?.textContent?.trim() || id;
  //         setError(`Please enter Budget for "${label}"`);
  //         return;
  //       }
  //     }
  //     // onClickNextPrev((prev) => prev + 1);
  //   };

  const handleNext = () => {
    let finalData = [];
    for (let day = 1; day <= daysCount; day++) {
      const startTime = startTimes[day - 1];

      // Validate start time
      if (!startTime?.hour || !startTime?.minute) {
        setError(`Please enter Start Time for Day ${day}`);
        return;
      }
      if (parseInt(startTime.hour) > 24 || parseInt(startTime.minute) > 59) {
        setError(`Invalid Start Time for Day ${day}`);
        return;
      }

      const daySpots = dayMap[day] || [];
      const spots = [];

      for (const item of daySpots) {
        if (!item.is_added) continue;

        const input = inputValues[item.name] || {};
        const durationHour = input.durationHour || "0";
        const durationMinute = input.durationMinute || "0";
        const cost = input.cost;

        if (
          !durationHour ||
          !durationMinute ||
          parseInt(durationHour) > 24 ||
          parseInt(durationMinute) > 59
        ) {
          setError(
            `Please enter Duration of spend for '${item.name}' on Day ${day}`
          );
          return;
        }
        // if (!cost || parseFloat(cost) === 0) {
        //   setError(`Please enter Budget for '${item.name}' on Day ${day}`);
        //   return;
        // }

        spots.push({
          name: item.name,
          address: item.address,
          image: item.image,
          category: "spot",
          duration: `${durationHour}:${durationMinute}`,
          cost: parseFloat(cost),
        });
      }

      if (spots.length === 0) {
        setError(`Please drop atleast one destination for Day ${day}`);
        return;
      }
      let accommodationObj = null;
      // Accommodation check
      if (day !== daysCount && accommodations[day - 1]) {
        const acc = accommodationDetails[day - 1];

        if (!acc.name) {
          setError(`Please enter Accommodation Name for Day ${day}`);
          return;
        }
        // if (!acc.cost || parseFloat(acc.cost) === 0) {
        //   setError(`Please enter Accommodation Cost for Day ${day}`);
        //   return;
        // }

        accommodationObj = {
          name: acc.name,
          address: acc.location,
          image: "",
          category: "accomodation",
          duration: "00:00",
          cost: parseFloat(acc.cost),
        };

        spots.push(accommodationObj);
      }

      // Optionally add start point for Day 1
      if (day === 1) {
        const start = attractions.find((a) => a.position === "start");
        if (start?.is_added) {
          spots.unshift({
            name: start.name,
            address: start.address,
            image: start.image,
            category: "start",
            duration: "00:00",
            cost: 0,
          });
        }
      }

      // Optionally add end point for last day
      if (day === daysCount) {
        const end = attractions.find((a) => a.position === "end");
        if (end?.is_added) {
          spots.push({
            name: end.name,
            address: end.address,
            image: end.image,
            category: "end",
            duration: "00:00",
            cost: 0,
          });
        }
      }

      // Inject previous day's accommodation as start of this day
      if (day > 1 && accommodations[day - 2]) {
        const prevAcc = accommodationDetails[day - 2];
        if (prevAcc.name) {
          spots.unshift({
            name: prevAcc.name,
            address: prevAcc.location,
            image: "",
            category: "accomodation",
            duration: "00:00",
            cost: parseFloat(prevAcc.cost || 0),
          });
        }
      }

      if (spots.length === 0) {
        setError(`Please drop at least one destination for Day ${day}`);
        return;
      }
      finalData.push({
        day,
        weekDay: dayDetails[day - 1].weekday,
        dayDate: dayDetails[day - 1].formatted,
        start_time: `${startTime.hour}:${startTime.minute}`,
        selected_spots: spots,
      });
    }

    sendDataToParent(finalData);
    setError("");
    onClickNextPrev((prev) => prev + 1);
  };

  const toggleCheckbox = (item) => {
    const updatedAttractions = attractions.map((attraction) => {
      if (attraction.name === item.name) {
        return { ...attraction, is_added: !attraction.is_added };
      }
      return attraction;
    });

    // Filter and sort valid attractions
    const visible = updatedAttractions.filter((p) => p.is_added);

    // Get start/end from visible list
    const start = visible.find((p) => p.position === "start");
    const end = visible.find((p) => p.position === "end");

    // Recompute order_index and ensure position is valid
    const reindexed = updatedAttractions.map((p) => {
      if (p.name === start?.name) {
        return { ...p, order_index: 1, position: "start" };
      }
      if (p.name === end?.name) {
        return {
          ...p,
          order_index: visible.length,
          position: "end",
        };
      }

      const idx = visible.findIndex((b) => b.name === p.name);
      return {
        ...p,
        order_index: p.is_added ? idx + 1 : "",
        position: "between",
      };
    });

    setAttractions(reindexed);

    // Update dayMap as well
    const newDayMap = { ...dayMap };
    Object.keys(newDayMap).forEach((key) => {
      newDayMap[key] = newDayMap[key].map((spot) =>
        spot.name === item.name ? { ...spot, is_added: !spot.is_added } : spot
      );
    });
    setDayMap(newDayMap);
  };

  const toggleAccommodation = (day) => {
    if (day === daysCount) return;
    const updatedAccommodations = [...accommodations];
    updatedAccommodations[day - 1] = !updatedAccommodations[day - 1];
    setAccommodations(updatedAccommodations);

    // Reset values if turned off
    if (!updatedAccommodations[day - 1]) {
      setAccommodationValue("");

    }
  };

  const {
    ready: accommodationReady,
    value: accommodationValue,
    suggestions: { status: accommodationStatus, data: accommodationData },
    setValue: setAccommodationValue,
    clearSuggestions: clearAccommodationSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["establishment"], // You can modify this based on the type of accommodation
    },
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
        ...updated[day - 1],
        name: address,
        location: address,
        coordinates: { lat, lng },
      };
      setAccommodationDetails(updated);
      setActiveAccommodationDay(null); 
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div>
      <div>
        <div className="text-center mt-5 mb-16">
          <h3 className="text-topHeader text-2xl font-kaushan">
            {" "}
            <span className="text-white font-aboreto font-semibold">
              MAP
            </span>{" "}
            Your Journey
          </h3>
          <p className="text-subTitle font-inria text-lg mt-1">
            Tie it all together in a perfect timeline and get ready to hit the
            road!
          </p>
        </div>
      </div>
      {error && (
        <div className="flex bg-topHeader mx-10 rounded-md mb-10 justify-center items-center">
          <p className="p-2 text-white font-normal text-lg font-inria">
            {error}
          </p>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-center items-start gap-4 p-5 mb--10">
        <div className="w-full lg:w-1/2 bg-card p-4 rounded-l">
          <div className="flex flex-row justify-between ">
            <div className="flex flex-row justify-center text-xl p-2 text-white rounded-lg mb-2 font-aldrich">
              <span className="text-topHeader">
                {`${title.split(" ")[0]}`}&nbsp;
              </span>
              {title.split(" ").slice(1).join(" ")}
            </div>
          </div>
          <div className="overflow-y-auto custom-scrollbar h-[520px] ">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 gap-5">
                {Array.from({ length: daysCount }, (_, i) => i + 1).map(
                  (day) => (
                    <Droppable key={day} droppableId={day.toString()}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`bg-darkBG p-4 rounded shadow-md rounded-lg  ${
                            snapshot.isDraggingOver ? "bg-blue-100" : ""
                          }`}
                        >
                          <div className="flex flex-row text-white mx-3 my-4">
                            <div className="flex flex-col w-full justify-between">
                              <p className="text-white text-[18px] font-aldrich">
                                Day {day}{" "}
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
                                <span className="text-topHeader">Start</span>
                                Time
                              </div>
                              <input
                                type="text"
                                className="bg-textCardDark text-textCard font-light rounded-lg px-2 w-10 h-7"
                                maxLength={2}
                                placeholder="HH"
                                name="start-hour"
                                value={startTimes[day - 1]?.hour}
                                onChange={(e) =>
                                  setStartTimes((prev) => {
                                    const updatedStartTimes = [...prev];
                                    updatedStartTimes[day - 1] = {
                                      ...updatedStartTimes[day - 1],
                                      hour: e.target.value,
                                    };
                                    return updatedStartTimes;
                                  })
                                }
                              />
                              :
                              <input
                                type="text"
                                className="bg-textCardDark text-textCard font-light rounded-lg w-10 h-7 px-2"
                                maxLength={2}
                                placeholder="MM"
                                name="start-minute"
                                value={startTimes[day - 1]?.minute}
                                onChange={(e) =>
                                  setStartTimes((prev) => {
                                    const updatedStartTimes = [...prev];
                                    updatedStartTimes[day - 1] = {
                                      ...updatedStartTimes[day - 1],
                                      minute: e.target.value,
                                    };
                                    return updatedStartTimes;
                                  })
                                }
                              />
                              Hrs
                            </div>
                          </div>

                          <ul className="space-y-5">
                            {dayMap[day]?.map((item, index) => (
                              <Draggable
                                key={item.name}
                                draggableId={item.name}
                                index={index}
                              >
                                {(provided) => (
                                  <li
                                    data-id={item.name}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex flex-row gap-2 border-none focus:outline-none"
                                  >
                                    <div className="bg-list p-3 pr-4 rounded-lg w-[55%] text-sm justify-between flex flex-row">
                                      <div className="flex flex-row gap-2 justify-between">
                                        <img
                                          className="w-[35px] h-[26px]"
                                          src={item.image}
                                          alt=""
                                        />
                                        <span className="truncate w-full mr-4 text-textCard italic">
                                          {item.name}
                                        </span>
                                      </div>
                                      <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          className="sr-only peer"
                                          checked={item.is_added}
                                          onChange={() => toggleCheckbox(item)}
                                        />
                                        <div className="w-8 h-3 bg-textCard peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-topHeader rounded-full peer-checked:bg-topHeader transition-colors"></div>
                                        <div className="absolute h-3 w-3 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-[1.5rem]"></div>
                                      </label>
                                    </div>

                                    <div className="bg-list rounded-lg w-[32%] text-sm flex flex-row justify-between items-center p-2 text-textCard">
                                      <img
                                        src={AlarmClock}
                                        className="w-8 h-6"
                                        alt=""
                                      />
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          className="bg-textCardDark rounded-lg px-2 w-10 h-7"
                                          maxLength={2}
                                          placeholder="HH"
                                          data-id={item.name}
                                          name="duration-hour"
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
                                          data-id={item.name}
                                          name="duration-minute"
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
                                        alt=""
                                      />
                                      <div className="flex items-center">
                                        ${" "}
                                        <input
                                          type="text"
                                          className="bg-textCardDark rounded-lg w-12 h-7 px-2"
                                          maxLength={4}
                                          data-id={item.name}
                                          name="cost"
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
                                  </li>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ul>
                          {/* Add Accommodation Section */}
                          {day !== daysCount && (
                            <div className="flex flex-row gap-2 mt-3">
                              {/* Accommodation Name & Checkbox */}
                              <div className="bg-list p-2 pr-4 rounded-lg w-full text-sm justify-between flex flex-row items-start">
                                <div className="relative group w-full">
                                  <input
                                    type="text"
                                    placeholder="Accommodation Name"
                                    value={
                                      accommodationDetails[day - 1]?.name || ""
                                    }
                                    disabled={!accommodations[day - 1]}
                                    onFocus={() =>
                                      setActiveAccommodationDay(day)
                                    }
                                    onChange={(e) => {
                                      const updated = [...accommodationDetails];
                                      updated[day - 1].name = e.target.value;
                                      setAccommodationDetails(updated);
                                      setAccommodationValue(e.target.value); // for suggestions
                                    }}
                                    className="bg-textCardDark p-2 w-full rounded-lg text-textCard"
                                  />
                                  <div className="absolute left-5 z-10 w-max bg-topHeader text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    This is the end point for Day{day} and start
                                    point for Day{day + 1}.
                                  </div>
                                  {/* Suggestions aligned with input */}
                                  {activeAccommodationDay === day &&
                                    accommodationStatus === "OK" && (
                                      <ul className="absolute z-10 left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-full max-h-40 overflow-y-auto">
                                        {accommodationData.map(
                                          ({ place_id, description }) => (
                                            <li
                                              key={place_id}
                                              onClick={() => {
                                                handleAccommodationSelect(
                                                  description,
                                                  day
                                                );
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

                                {/* Toggle Switch */}
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

                              {/* Budget input */}
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
                  )
                )}
              </div>
            </DragDropContext>
          </div>
        </div>
        <div className="w-full lg:w-1/2 h-full bg-card p-3 rounded-r">
          <div ref={mapRef} className="w-full h-[580px]" id="map"></div>
        </div>
      </div>

      <div className="flex justify-end pb-10 pr-10 gap-5">
        <button
          className="bg-topHeader text-white p-2 px-10 flex gap-3 font-semibold rounded-lg items-center"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          className="bg-topHeader text-white p-2 px-10 flex gap-3 font-semibold  rounded-lg items-center"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MapJourney;
