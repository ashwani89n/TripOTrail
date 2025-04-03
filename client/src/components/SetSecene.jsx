import React, { useState, useEffect, useRef, useContext } from "react";
import DatePicker from "react-datepicker";
import {
  FaCalendar,
  FaCloudUploadAlt,
  FaFlagCheckered,
  FaCalendarAlt,
} from "react-icons/fa";
import { IoCalendar, IoCalendarSharp } from "react-icons/io5";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/SetSecene.css";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import axios from "axios";
import { tripContext } from "../context/useTripDataContext";

const SetSecene = ({ onClickNext }) => {
  const [data, setData] = useState({});
  const [date, setDate] = useState(new Date());
  const [obTransport, setObTransport] = useState("road");
  const [retTransport, setRetTransport] = useState("road");
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const {
    tripId,
    setTripId,
    destinationPoint,
    setDestinationPoint,
    startPoint,
    setStartPoint,
  } = useContext(tripContext);
  const today = new Date();

  const handleNext = async () => {
    const response = await axios
      .post(
        "/api/trips",
        {
          ...data,
          start_point: startValue,
          destination: destinationValue,
        },
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQzNzAzNDU3LCJleHAiOjE3NDM3MDcwNTd9.S98VVxslXVIzQp2A4Wgf4bhlduWqLRqV7BxBM_KlVHI",
          },
        }
      )
      .then(function (response) {
        setTripId(response.data.trip_id);
        setDestinationPoint(destinationValue)
        setStartPoint(startValue)
        onClickNext(1);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log({ tripId });
  }, [tripId]);

  const YOUR_GOOGLE_API_KEY = "AIzaSyA3xEs87Yqi3PpC8YKGhztvrXNDJX5nNDw";
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${YOUR_GOOGLE_API_KEY}&libraries=places&loading=async`;
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        console.log("Google Maps script loaded successfully.");
      };

      script.onerror = () => {
        console.error("Error loading Google Maps script.");
      };
    }
  }, [YOUR_GOOGLE_API_KEY]);

  const {
    ready: startReady,
    value: startValue,
    suggestions: { status: startStatus, data: startData },
    setValue: setStartValue,
    clearSuggestions: clearStartSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["address"],
    },
    debounce: 300,
  });

  const {
    ready: destinationReady,
    value: destinationValue,
    suggestions: { status: destinationStatus, data: destinationData },
    setValue: setDestinationValue,
    clearSuggestions: clearDestinationSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["address"],
    },
    debounce: 300,
  });

  const handleStartSelect = async (address) => {
    setStartValue(address, false);
    clearStartSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setStartLocation(address);
      setStartCoordinates({ lat, lng });
      console.log("Start Coordinates: ", { lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleDestinationSelect = async (address) => {
    setDestinationValue(address, false);
    clearDestinationSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setDestination(address);
      setDestinationCoordinates({ lat, lng });
      console.log("Destination Coordinates: ", { lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <div
      className="relative w-full bg-textInputBG rounded-lg flex items-center px-3 focus-within:border-subHeaderBG"
      onClick={onClick}
      ref={ref}
    >
      <FaCalendarAlt className="text-topHeader absolute left-3" />
      <input
        type="text"
        className="w-full h-[35px] bg-transparent outline-none pl-10"
        value={value}
        readOnly
      />
    </div>
  ));

  return (
    <div>
      <div className="text-center mt-10 mb-16">
        <h3 className="text-topHeader text-2xl font-kaushan">
          {" "}
          <span className="text-white font-aboreto font-semibold">
            SET
          </span>{" "}
          Your Scene
        </h3>
        <p className="text-subTitle font-inria text-lg mt-1 mb-1">
          Pin down your trip’s essentials—where, when, and how.
        </p>
      </div>
      {/* <div className="font-inria text-white text-lg font-normal mx-10 flex flex-col gap-5 "> */}
      <div className="font-inria text-white text-lg flex flex-col gap-4 mx-10">
        <div className="flex items-center  gap-16 justify-between ">
          <label className="w-[20%]">Title Your Journey</label>
          <input
            className="bg-textInputBG w-[90%] h-[31px] rounded-lg pl-2"
            onChange={(e) => setData({ ...data, title: e.target.value })}
          ></input>
        </div>
        <div className="flex items-center gap-16 justify-between ">
          <label className="w-[20%]">Start Point</label>
          {/* { <input className="bg-textInputBG h-[31px] w-[30%] rounded-lg pl-2"></input> } */}
          <div className="w-[30%] relative">
            <input
              value={startValue}
              onChange={(e) => {
                setStartValue(e.target.value);
                setData({ ...data, start_point: startValue });
              }}
              disabled={!startReady}
              className="bg-textInputBG h-[31px] w-full rounded-lg pl-2"
              placeholder="Enter start point..."
            />
            {startStatus === "OK" && (
              <ul className="absolute text-black left-0 mt-1 bg-white border-1 border-gray-300 rounded-md shadow-lg z-10 w-full w-full max-h-48 overflow-y-auto">
                {startData.map(({ place_id, description }) => (
                  <li
                    key={place_id}
                    onClick={() => handleStartSelect(description)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  >
                    {description}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <label className="w-[20%]">Destination</label>
          <div className="w-[30%] relative">
            <input
              value={destinationValue}
              onChange={(e) => {
                setDestinationValue(e.target.value);
                setData({ ...data, destination: destinationValue });
              }}
              disabled={!destinationReady}
              className="bg-textInputBG h-[31px] w-full rounded-lg pl-2"
              placeholder="Enter destination..."
            />
            {destinationStatus === "OK" && (
              <ul className="absolute text-black left-0 mt-1 bg-white border-1 border-gray-300 rounded-md shadow-lg z-10 w-full w-full max-h-48 overflow-y-auto">
                {destinationData.map(({ place_id, description }) => (
                  <li
                    key={place_id}
                    onClick={() => handleDestinationSelect(description)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  >
                    {description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex items-center gap-16 justify-between ">
          <label className="w-[20%]">Start Date</label>
          <div className=" h-[31px] w-[30%] rounded-lg ">
            <DatePicker
              selected={date}
              onChange={(date) => {
                setDate(date);
                setData({ ...data, start_date: date });
              }}
              placeholderText="Select Date"
              minDate={today}
              customInput={<CustomInput />}
            />
          </div>

          <label className="w-[20%]">End Date</label>
          <div className=" h-[31px] w-[30%] rounded-lg">
            <DatePicker
              selected={date}
              onChange={(date) => {
                setDate(date);
                setData({ ...data, end_date: date });
              }}
              placeholderText="Select Date"
              minDate={today}
              customInput={<CustomInput />}
            />
          </div>
        </div>

        <div className="flex items-center gap-16 justify-between ">
          <label className="w-[20%]">Outbound Mode of Transport</label>
          <div className=" h-[31px] w-[30%] flex items-center justify-between  rounded-lg ">
            <input
              type="radio"
              value="road"
              checked={obTransport === "road"}
              onChange={() => {
                setObTransport("road");
                setData({ ...data, outbound_mode_of_transport: "Road" });
              }}
              className="appearance-none h-3 w-3 border-2 border-white rounded-full checked:bg-topHeader focus:outline-none focus:ring-topHeader"
            />
            <label>Road</label>
            <input
              type="radio"
              value="flight"
              checked={obTransport === "flight"}
              onChange={() => {
                setObTransport("flight");
                setData({ ...data, outbound_mode_of_transport: "Flight" });
              }}
              className="appearance-none h-3 w-3 border-2 border-white rounded-full checked:bg-topHeader focus:outline-none focus:ring-topHeader"
            />
            <label>Flight</label>
          </div>
          <label className="w-[20%]">Return Mode of Transport</label>
          <div className=" h-[31px] w-[30%] flex items-center justify-between  rounded-lg ">
            <input
              type="radio"
              value="road"
              checked={retTransport === "road"}
              onChange={() => {
                setRetTransport("road");
                setData({ ...data, return_mode_of_transport: "Road" });
              }}
              className="appearance-none h-3 w-3 border-2 border-white rounded-full checked:bg-topHeader focus:outline-none focus:ring-topHeader"
            />
            <label>Road</label>
            <input
              type="radio"
              value="flight"
              checked={retTransport === "flight"}
              onChange={() => {
                setRetTransport("flight");
                setData({ ...data, return_mode_of_transport: "Flight" });
              }}
              className="appearance-none h-3 w-3 border-2 border-white rounded-full checked:bg-topHeader focus:outline-none focus:ring-topHeader"
            />
            <label>Flight</label>
          </div>
        </div>
        <div>
          {(obTransport === "road" || retTransport === "road") && (
            <div className="flex items-center mb-5 justify-between w-[48%]">
              <label className="w-[48%]">Fuel Budget</label>

              <div className="w-[60%] flex gap-4 justify-space-around">
                <p>$</p>
                <input
                  className="bg-textInputBG h-[31px] w-full rounded-lg pl-2"
                  onChange={(e) =>
                    setData({ ...data, fuel_budget: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        </div>
        {obTransport === "flight" && (
          <div>
            <h3 className="text-xl font-inria bg-topHeader rounded-r-xl p-2 w-[13%] mt-5">
              Flight Itinerary
            </h3>
            <div className="bg-textInputBG rounded-r-xl p-10 flex flex-col gap-4">
              <div className="flex items-center gap-16 justify-between rounded-2xl">
                <label className="w-[15%]">From</label>
                <input
                  type="text"
                  className="bg-textInputBG w-[18%] h-[31px] rounded-lg pl-2"
                />
                <label className="w-[15%]">To</label>
                <input
                  type="text"
                  className="bg-textInputBG w-[18%] h-[31px] rounded-lg pl-2"
                />
                <label className="w-[15%]">Budget</label>
                <input
                  type="text"
                  className="bg-textInputBG w-[18%] h-[31px] rounded-lg pl-2"
                />
              </div>
              <div className="flex items-center gap-16 justify-between rounded-2xl ">
                <label className="w-[15%]">Date</label>
                <div className="w-[18%] h-[31px]">
                  <DatePicker
                    selected={date}
                    onChange={(date) => setDate(date)}
                    placeholderText="Select Date"
                    customInput={<CustomInput />}
                  />
                </div>
                <label className="w-[15%]">Departure Time</label>
                <div className="flex  w-[18%] gap-3">
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[15%]"
                  />
                  :
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[15%]"
                  />
                  Hrs
                </div>
                <label className="w-[15%]"> Arrival Time</label>
                <div className="flex  w-[18%] gap-3">
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[15%]"
                  />
                  :
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[15%]"
                  />
                  Hrs
                </div>
              </div>
              <div className="flex items-center justify-center mt-8">
                <button className="bg-topHeader text-white p-3 flex gap-3 rounded-lg items-center">
                  <FaCloudUploadAlt className="w-6" />
                  Upload e-ticket
                </button>
              </div>
            </div>
          </div>
        )}
        {retTransport === "flight" && (
          <div>
            <h3 className="text-xl font-inria bg-topHeader rounded-r-xl p-2 w-[18%]">
              Return Flight Itinerary
            </h3>
            <div className="bg-textInputBG rounded-r-xl p-10 flex flex-col gap-4">
              <div className="flex items-center gap-16 justify-between rounded-2xl">
                <label className="w-[15%]">From</label>
                <input
                  type="text"
                  className="bg-textInputBG w-[18%] h-[31px] rounded-lg"
                />
                <label className="w-[15%]">To</label>
                <input
                  type="text"
                  className="bg-textInputBG w-[18%] h-[31px] rounded-lg"
                />
                <label className="w-[15%]">Budget</label>
                <input
                  type="text"
                  className="bg-textInputBG w-[18%] h-[31px] rounded-lg"
                />
              </div>
              <div className="flex items-center gap-16 justify-between rounded-2xl ">
                <label className="w-[15%]">Date</label>
                <div className="w-[18%] h-[31px]">
                  <DatePicker
                    selected={date}
                    onChange={(date) => setDate(date)}
                    placeholderText="Select Date"
                    customInput={<CustomInput />}
                  />
                </div>
                <label className="w-[15%]">Departure Time</label>
                <div className="flex  w-[18%] gap-3">
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[15%]"
                  />
                  :
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[15%]"
                  />
                  Hrs
                </div>
                <label className="w-[15%]"> Arrival Time</label>
                <div className="flex  w-[18%] gap-3">
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[15%]"
                  />
                  :
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[15%]"
                  />{" "}
                  Hrs
                </div>
              </div>
              <div className="flex items-center justify-center mt-8">
                <button className="bg-topHeader text-white p-3 flex gap-3 rounded-lg items-center">
                  <FaCloudUploadAlt className="w-6" />
                  Upload e-ticket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        className="bg-topHeader text-white p-2 px-10 flex gap-3 font-semibold  rounded-lg items-center"
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
};

export default SetSecene;
// AIzaSyA3xEs87Yqi3PpC8YKGhztvrXNDJX5nNDw
