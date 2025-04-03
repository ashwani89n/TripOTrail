import React, { useState, useEffect, useRef, useContext } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { tripContext } from "../context/useTripDataContext";

const PickSpots = () => {
  const [start, setStart] = useState(
    "2470 Camellia Lane Northeast, Atlanta, GA, USA"
  );
  const [end, setEnd] = useState(
    "509 Lindbergh Place Northeast, Atlanta, GA, USA"
  );
  const [attractions, setAttractions] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState([]);
  const apiKey = "AIzaSyA3xEs87Yqi3PpC8YKGhztvrXNDJX5nNDw";
  const { tripId, destinationPoint, startPoint } = useContext(tripContext);
  const mapRef = useRef(null);
  let selectingAttractions = [];
  const handleSelectSpots = (item) => {
    setSelectedAttraction((prev) => [...prev, item]);
  };

  const handleSearch = async () => {
    try {
      const directionsService = new google.maps.DirectionsService();
      const route = await directionsService.route({
        origin: start,
        destination: end,
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
    handleSearch();
  }, [tripId]);
  useEffect(() => {
    console.log("selected ", selectedAttraction);
  }, [selectedAttraction]);

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ padding: "1rem" }}>
        <button onClick={handleSearch} className="text-white">
          Find Attractions
        </button>
        <p>{tripId}</p>
        <p>{destinationPoint}</p>
        <p>{startPoint}</p>
        <div className="flex">
          <div className="w-3/4">
            <div className="grid-cols-4 gap-3 grid">
              {attractions.map((item) => (
                <div
                  className="w-[127px] h-[173px] "
                  onClick={() => handleSelectSpots(item)}
                >
                  <div className="w-[100%] flex flex-col">
                    <img src={item.photoUrl} alt="" />
                    <p className="text-topHeader text-[10px]">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/4 text-white">
            {selectedAttraction &&
              selectedAttraction.map((item) => (
                <ul>
                  <li>{item.name}</li>
                </ul>
              ))}
          </div>
        </div>
      </div>
    </APIProvider>
  );
};

export default PickSpots;
