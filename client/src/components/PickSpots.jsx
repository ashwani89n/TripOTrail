import React, { useState, useEffect, useRef, useContext } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { tripContext } from "../context/useTripDataContext";
import "../components/styles/PickSpots.css";
import noSpotsChosen from "../assets/noSpots.png";

const PickSpots = ({onClickNextPrev, sendDataToParent}) => {
  const [attractions, setAttractions] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState([]);
  const [selectedSpotsData, setSelectedSpotsData] = useState([]);
  const apiKey = "AIzaSyA3xEs87Yqi3PpC8YKGhztvrXNDJX5nNDw";
  const { tripId, destinationPoint, startPoint, startDt, endDt , startCoordinates,
    destinationCoordinates, title, transportBudget} =
    useContext(tripContext);
  const [error, setError] = useState("");
  const [query, setQuery] = useState('');

  // const mapRef = useRef(null);
  const handleSelectSpots = (item) => {
    setSelectedAttraction((prev) => {
      if (!prev.find((a) => a.id === item.id)) {
        return [...prev, item];
      }
      return prev;
    });
  };
  
  function calculateDistance(a, b) {
    const dx = a.position.lat - b.position.lat;
    const dy = a.position.lng - b.position.lng;
    return Math.sqrt(dx * dx + dy * dy); // Replace with Haversine if needed
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
      const remainingPermuted = permute(remaining);
      for (const perm of remainingPermuted) {
        result.push([current, ...perm]);
      }
    }
    return result;
  }
  
  function getOptimizedRoute(start, attractions, end) {
    const allPermutations = permute(attractions);
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
  

    const handleNext = async() => {
      const nodes = [
        { id: "start", name: startPoint, position: startCoordinates },
        ...selectedAttraction.filter((item) => item.enabled === true).map((attraction) => ({
          ...attraction,
          id: attraction.name,
        })),
        { id: "end", name: destinationPoint, position: destinationCoordinates },
      ]; 

      const optimizedRoute = getOptimizedRoute(
        { position: startCoordinates, name: startPoint},
        selectedAttraction.filter((item) => item.enabled === true), 
        { position: destinationCoordinates, name: destinationPoint }
      );

      console.log("optimized:", optimizedRoute);

      if (optimizedRoute.length > 0) {
        const finalizedSpots = [
          ...optimizedRoute.map((spot, index) => ({
            name: spot.name,
            address: spot.address || "",
            image: spot.photoUrl || "",
            is_added: true,
            latitude: spot.position.lat,
            longitude: spot.position.lng,
            position: index === 0 ? "start" : index === optimizedRoute.length - 1 ? "end" : "between",
            order_index: index + 1,
          })),
        ];
    
        setSelectedSpotsData(finalizedSpots);


    if (!finalizedSpots || finalizedSpots.length === 0) {
      setError("Please select destinations to proceed");
      return;
    } else {
      setError("");
      console.log("selected1:", finalizedSpots);
      setSelectedSpotsData(finalizedSpots);
      sendDataToParent(finalizedSpots);
      onClickNextPrev((prev) => prev + 1);

    }
    }else {
      setError("No optimal route found.");
    }


    };
    const handlePrevious = () => {
      onClickNextPrev((prev) => prev - 1);
    };

  const handleSearch = async () => {
    try {
      const directionsService = new google.maps.DirectionsService();
      const route = await directionsService.route({
        origin: startPoint,
        destination: destinationPoint,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      const path = route.routes[0].overview_path;
      const segmentPoints = path.filter((_, i) => i % 10 === 0);
      const placesService = new google.maps.places.PlacesService(
        document.createElement("div")
      );
      const allAttractions = [];

      for (const point of segmentPoints) {
        const results = await new Promise((resolve) => {
          placesService.nearbySearch(
            {
              location: point,
              type: "tourist_attraction",
              rankBy: google.maps.places.RankBy.DISTANCE,
            },
            (results, status) => resolve(status === "OK" ? results : [])
          );
        });

        for (const place of results) {
          const photoRef = place.photos?.[0]?.getUrl({ maxWidth: 400 }) || null;
          const position = place.geometry.location.toJSON();
          const uniqueKey = `${place.place_id}-${position.lat}-${position.lng}`;

          if (!allAttractions.some((a) => a.id === uniqueKey)) {
            allAttractions.push({
              id: uniqueKey,
              name: place.name,
              position,
              rating: place.rating,
              address: place.vicinity,
              photoUrl: photoRef,
              enabled: true,
            });
          }
        }
      }
      console.log(allAttractions);
      setAttractions(allAttractions);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  useEffect(() => {
    console.log(startCoordinates, destinationCoordinates);
    if (!window.google || !window.google.maps) {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval);
          handleSearch();
        }
      }, 2000);
      return () => clearInterval(interval);
    } else {
      handleSearch();
    }
  }, [tripId]);


  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    // Get day suffix (st, nd, rd, th)
    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return "th"; // Covers 11th to 20th
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getDaySuffix(day)} ${month}, ${year}`;
  };

  const calculateTripDays = (startDt, endDt) => {
    const startDate = new Date(startDt);
    const endDate = new Date(endDt);
    const daysCount =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const dayOneWeekday = startDate.toLocaleString("en-US", {
      weekday: "long",
    });

    return {
      daysCount: daysCount,
      dayOneWeekday: dayOneWeekday,
      formattedDate: formatDate(startDate),
    };
  };

  const { daysCount, dayOneWeekday, formattedDate } = calculateTripDays(startDt, endDt);

  return (
    <>
      <div>
        <div className="text-center mt-5 mb-16">
          <h3 className="text-topHeader text-2xl font-kaushan">
            {" "}
            <span className="text-white font-aboreto font-semibold">
              PICK
            </span>{" "}
            Your Spots
          </h3>
          <p className="text-subTitle font-inria text-lg mt-1">
            Handpick the sights, bites, and stays for an unforgettale journey.
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
      <APIProvider apiKey={apiKey}>
        <div className="flex flex-col md:flex-row justify-center items-start gap-6 p-5 mb--10">
          <div className="w-full lg:w-1/2 bg-card text-center p-5 rounded-l">
            <div className="flex flex-row gap-2 mb-4 text-textCard">
              <input
                className="bg-textInputBG w-[70%] h-[31px] rounded-md pl-3 italic"
                placeholder="Search by location..."
                value={query}
                onChange={(e)=> setQuery(e.target.value)}
              ></input>
              <button
                disabled
                className="bg-topHeader w-[30%]  text-white h-[31px] px-4 rounded-md text-[12px]"
              >
                Category: <span className="text-black">Attractions</span>
              </button>
            </div>
            <div className="h-[580px] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 justify-between gap-3">
                {attractions
                  .filter((item) => item.photoUrl && 
                    (query.trim()?item.name.toLowerCase().includes(query.toLowerCase()):true))
                  .map((item) => (
                    <div
                      className="w-full h-[280px] bg-headerBG rounded-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-10 hover:border-[1px] hover:border-subTitle"
                      key={item.id}
                      onClick={() => handleSelectSpots(item)}
                    >
                      <img
                        src={item.photoUrl}
                        alt={item.name}
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
                            <div className="text-topHeader text-[10px]"> ★</div>
                          </div>
                        </div>
                        <p className="text-xs text-textCard mt-1 text-left">
                          {item.address}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-card text-white p-5 rounded-l h-full">
            <div className="h-[626px] overflow-y-auto custom-scrollbar justify-center">
              <div className="text-white mx-5 my-5">
              <p className="text-white text-xl font-aldrich">
              Day 1 - {daysCount}<span className="font-light text-textCard text-[20px]"> | </span><span className="text-topHeader font-semibold">{dayOneWeekday}</span></p>
                <p className="text-textCard text-md font-light">{formattedDate}</p>
              </div>
              <ul className="space-y-2">
                {selectedAttraction.length > 0 ? (
                  selectedAttraction.map((item, index) => (
                    <li
                      key={index}
                      className="bg-list p-3 rounded-lg text-sm flex justify-between items-center"
                    >
                      <div className="flex flex-row gap-2">
                      <img className="w-[35px] h-[26px]" src={item.photoUrl}></img>
                      <span className="truncate mr-4 text-textCard italic">
                        {item.name}
                      </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={item.enabled}
                          onChange={() => {
                            setSelectedAttraction(prev =>
                              prev.map((attraction, i) =>
                                i === index
                                  ? { ...attraction, enabled: !attraction.enabled }
                                  : attraction
                              )
                            );
                          }}
                        />
                        <div className="w-10 h-4 bg-textCard peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-topHeader rounded-full peer-checked:bg-topHeader transition-colors"></div>
                        <div className="absolute left-[2px] h-4 w-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-[1.5rem]"></div>
                      </label>
                    </li>
                  ))
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center mt-20">
                    <img
                      src={noSpotsChosen}
                      className="w-[300px] h-[300px] object-contain"
                    ></img>
                    <p className="text-textCard text-md font-light">Still undecided? Start narrowing down your bucket list today!</p>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-end pb-20 pr-10 gap-5">
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
      </APIProvider>
    </>
  );
};

export default PickSpots;
