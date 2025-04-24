import React, { useState, useEffect, useRef, useContext } from "react";
import DatePicker from "react-datepicker";
import {
  FaCloudUploadAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/SetSecene.css";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { tripContext } from "../context/useTripDataContext";
import api from "../api/api";


const SetSecene = ({ onClickNext }) => {
  const [data, setData] = useState({
    title: "",
    start_point: "",
    destination: "",
    start_date: "",
    end_date: "",
    outbound_mode_of_transport: "road",
    return_mode_of_transport: "road",
    fuel_budget: "",
    outbound_flight: {},
    return_flight: {},
  });


  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dateToFlight, setDateToFlight] = useState();
  const [dateFromFlight, setDateFromFlight] = useState();
  const [obTransport, setObTransport] = useState("road");
  const [retTransport, setRetTransport] = useState("road");
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");

  const [startLocationOBFrom, setStartLocationOBFrom] = useState("");
  const [destinationOBFrom, setDestinationOBFrom] = useState("");
  const [startCoordinatesOBFrom, setStartCoordinatesOBFrom] = useState(null);
  const [destinationCoordinatesOBFrom, setDestinationCoordinatesOBFrom] =
    useState(null);
  const [startLocationOBTo, setStartLocationOBTo] = useState("");
  const [destinationOBTo, setDestinationOBTo] = useState("");
  const [startCoordinatesOBTo, setStartCoordinatesOBTo] = useState(null);
  const [destinationCoordinatesOBTo, setDestinationCoordinatesOBTo] =
    useState(null);

  const [departureHourOB, setDepartureHourOB] = useState("");
  const [departureMinuteOB, setDepartureMinuteOB] = useState("");
  const [arrivalHourOB, setArrivalHourOB] = useState("");
  const [arrivalMinuteOB, setArrivalMinuteOB] = useState("");

  const [departureHourRT, setDepartureHourRT] = useState("");
  const [departureMinuteRT, setDepartureMinuteRT] = useState("");
  const [arrivalHourRT, setArrivalHourRT] = useState("");
  const [arrivalMinuteRT, setArrivalMinuteRT] = useState("");

  const [error, setError] = useState("");

  const {
    tripId,
    setTripId,
    destinationPoint,
    setDestinationPoint,
    startPoint,
    setStartPoint,
    startDt,
    setStartDt,
    endDt,
    setEndDt,
    startCoordinates,
    setStartCoordinates,
    destinationCoordinates,
    setDestinationCoordinates,
    title,
    setTitle,
    transportBudget,
    setTransportBudget,
  } = useContext(tripContext);
  const today = new Date();
  const api_key = import.meta.env.VITE_GOOGLE_API_KEY;
  

  const handleNext = async () => {
    const { fromOB, toOB, budgetOB, dateOB, departure_timeOB, arrival_timeOB } =
      data.outbound_flight;
    const { fromRT, toRT, budgetRT, dateRT, departure_timeRT, arrival_timeRT } =
      data.return_flight;

    if (!data.title.trim()) {
      setError("Please enter Title of Journey");
      return;
    } else if (!data.start_point) {
      setError("Please enter Start Point");
      return;
    } else if (!data.destination) {
      setError("Please enter Destination");
      return;
    } else if (!startDate) {
      setError("Please enter Start Date");
      return;
    } else if (!endDate) {
      setError("Please enter End Date");
      return;
    } else if (
      obTransport === "road" &&
      (!data.fuel_budget || data.fuel_budget === "0")
    ) {
      setError("Fuel budget is mandatory when choosing road transport.");
      return;
    } else if (
      obTransport === "flight" &&
      (!fromOB ||
        !toOB ||
        !budgetOB ||
        !dateOB ||
        !departure_timeOB ||
        !arrival_timeOB)
    ) {
      console.log(
        fromOB,
        toOB,
        budgetOB,
        dateOB,
        departure_timeOB,
        arrival_timeOB
      );
      setError("Please fill in all the flight details.");
      return;
    } else if (
      retTransport === "road" &&
      (!data.fuel_budget || data.fuel_budget === "0")
    ) {
      setError("Fuel budget is mandatory when choosing road transport.");
      return;
    } else if (
      retTransport === "flight" &&
      (!fromRT ||
        !toRT ||
        !budgetRT ||
        !dateRT ||
        !departure_timeRT ||
        !arrival_timeRT)
    ) {
      console.log(
        fromRT,
        toRT,
        budgetRT,
        dateRT,
        departure_timeRT,
        arrival_timeRT
      );
      setError("Please fill in all the flight details.");
      return;
    } else {
      setError("");
      console.log("data:", data);
    }

    const response = await api
      .post(
        "/trips",
        {
          ...data,
          start_point: startValue,
          destination: destinationValue,
          start_date: startDate,
          end_date: endDate,
          outbound_flight:
            obTransport === "flight"
              ? {
                  from: fromOB,
                  to: toOB,
                  budget: budgetOB,
                  date: dateOB,
                  departure_time: departure_timeOB,
                  arrival_time: arrival_timeOB,
                }
              : {},
          return_flight:
            retTransport === "flight"
              ? {
                  from: fromRT,
                  to: toRT,
                  budget: budgetRT,
                  date: dateRT,
                  departure_time: departure_timeRT,
                  arrival_time: arrival_timeRT,
                }
              : {},
        }
      )
      .then(function (response) {
        setTripId(response.data.trip_id);
        setDestinationPoint(destinationValue);
        setStartPoint(startValue);
        setStartDt(startDate);
        setEndDt(endDate);
        setTitle(data.title);
        setTransportBudget(
          Number(data.fuel_budget) ||
            0 + Number(data.outbound_flight?.budgetOB) ||
            0 + Number(data.return_flight?.budgetRT) ||
            0
        );
        onClickNext(1);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    setObTransport("road");
    setRetTransport("road");
    console.log(startCoordinates, destinationCoordinates);
  }, []);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${api_key}&libraries=places&loading=async`;
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        console.log("Google Maps script loaded successfully.");
      };

      script.onerror = () => {
        console.error("Error loading Google Maps script.");
      };
    }
  }, [api_key]);

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

  const {
    ready: startReadyOBFrom,
    value: startValueOBFrom,
    suggestions: { status: startStatusOBFrom, data: startDataOBFrom },
    setValue: setStartValueOBFrom,
    clearSuggestions: clearStartSuggestionsOBFrom,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["address"],
    },
    debounce: 300,
  });

  const {
    ready: destinationReadyOBFrom,
    value: destinationValueOBFrom,
    suggestions: {
      status: destinationStatusOBFrom,
      data: destinationDataOBFrom,
    },
    setValue: setDestinationValueOBFrom,
    clearSuggestions: clearDestinationSuggestionsOBFrom,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["address"],
    },
    debounce: 300,
  });

  const {
    ready: startReadyOBTo,
    value: startValueOBTo,
    suggestions: { status: startStatusOBTo, data: startDataOBTo },
    setValue: setStartValueOBTo,
    clearSuggestions: clearStartSuggestionsOBTo,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["address"],
    },
    debounce: 300,
  });

  const {
    ready: destinationReadyOBTo,
    value: destinationValueOBTo,
    suggestions: { status: destinationStatusOBTo, data: destinationDataOBTo },
    setValue: setDestinationValueOBTo,
    clearSuggestions: clearDestinationSuggestionsOBTo,
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
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleStartSelectOBFrom = async (address) => {
    setStartValueOBFrom(address, false);
    clearStartSuggestionsOBFrom();
    handleFlightChange("fromOB", address, true);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setStartLocationOBFrom(address);
      setStartCoordinatesOBFrom({ lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleDestinationSelectOBFrom = async (address) => {
    setDestinationValueOBFrom(address, false);
    clearDestinationSuggestionsOBFrom();
    handleFlightChange("toOB", address, true);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setDestinationOBFrom(address);
      setDestinationCoordinatesOBFrom({ lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleStartSelectOBTo = async (address) => {
    setStartValueOBTo(address, false);
    clearStartSuggestionsOBTo();
    handleFlightChange("fromRT", address, false);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setStartLocationOBTo(address);
      setStartCoordinatesOBTo({ lat, lng });
      console.log("Start Coordinates: ", { lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleDestinationSelectOBTo = async (address) => {
    setDestinationValueOBTo(address, false);
    clearDestinationSuggestionsOBTo();
    handleFlightChange("toRT", address, false);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setDestinationOBTo(address);
      setDestinationCoordinatesOBTo({ lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleFlightChange = (field, value, isOutbound = true) => {
    const updatedFlightData = isOutbound
      ? { ...data.outbound_flight, [field]: value }
      : { ...data.return_flight, [field]: value };

    setData({
      ...data,
      [isOutbound ? "outbound_flight" : "return_flight"]: updatedFlightData,
    });
  };

  const handleDepartureTimeOBChange = (type, value) => {
    if (type === "hour") {
      setDepartureHourOB(value);
      if (value && departureMinuteOB) {
        handleFlightChange(
          "departure_timeOB",
          `${value}:${departureMinuteOB}`,
          true
        );
      }
    } else {
      setDepartureMinuteOB(value);
      if (departureHourOB && value) {
        handleFlightChange(
          "departure_timeOB",
          `${departureHourOB}:${value}`,
          true
        );
      }
    }
  };

  const handleArrivalTimeOBChange = (type, value) => {
    if (type === "hour") {
      setArrivalHourOB(value);
      if (value && arrivalMinuteOB) {
        handleFlightChange(
          "arrival_timeOB",
          `${value}:${arrivalMinuteOB}`,
          true
        );
      }
    } else {
      setArrivalMinuteOB(value);
      if (arrivalHourOB && value) {
        handleFlightChange("arrival_timeOB", `${arrivalHourOB}:${value}`, true);
      }
    }
  };

  const handleDepartureTimeRTChange = (type, value) => {
    if (type === "hour") {
      setDepartureHourRT(value);
      if (value && departureMinuteRT) {
        handleFlightChange(
          "departure_timeRT",
          `${value}:${departureMinuteRT}`,
          false
        );
      }
    } else {
      setDepartureMinuteRT(value);
      if (departureHourRT && value) {
        handleFlightChange(
          "departure_timeRT",
          `${departureHourRT}:${value}`,
          false
        );
      }
    }
  };

  const handleArrivalTimeRTChange = (type, value) => {
    if (type === "hour") {
      setArrivalHourRT(value);
      if (value && arrivalMinuteRT) {
        handleFlightChange(
          "arrival_timeRT",
          `${value}:${arrivalMinuteRT}`,
          false
        );
      }
    } else {
      setArrivalMinuteRT(value);
      if (arrivalHourRT && value) {
        handleFlightChange(
          "arrival_timeRT",
          `${arrivalHourRT}:${value}`,
          false
        );
      }
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
        className="w-full h-[31px] bg-transparent outline-none pl-10"
        value={value}
        readOnly
      />
    </div>
  ));

  return (
    <div>
      <div className="text-center m-5 mb-16">
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
      {error && (
        <div className="flex bg-topHeader mx-10 rounded-md mb-10 justify-center items-center">
          <p className="p-2 text-white font-normal text-lg font-inria">
            {error}
          </p>
        </div>
      )}

      <div className="font-inria text-white text-lg flex flex-col gap-4 mx-10">
        <div className="flex items-center  gap-16 justify-between ">
          <label className="w-[20%]">Title Your Journey</label>
          <input
            className="bg-textInputBG w-[90%] h-[31px] rounded-lg pl-2"
            onChange={(e) => setData({ ...data, title: e.target.value })}
            value={data.title}
          ></input>
        </div>
        <div className="flex items-center gap-16 justify-between ">
          <label className="w-[20%]">Start Point</label>
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
              selected={startDate}
              onChange={(startDate) => {
                setStartDate(startDate);
                setData({ ...data, start_date: startDate });
              }}
              placeholderText="Select Date"
              minDate={today}
              customInput={<CustomInput />}
            />
          </div>

          <label className="w-[20%]">End Date</label>
          <div className=" h-[31px] w-[30%] rounded-lg">
            <DatePicker
              selected={endDate}
              onChange={(endDate) => {
                setEndDate(endDate);
                setData({ ...data, end_date: endDate });
              }}
              placeholderText="Select Date"
              minDate={today}
              customInput={<CustomInput />}
            />
          </div>
        </div>

        <div className="flex items-center gap-16 justify-between ">
          <label className="w-[20%]">Outbound Mode of Transport</label>
          <div className=" h-[31px] w-[30%] flex items-center justify-start rounded-lg ">
            <input
              type="radio"
              value="road"
              checked={obTransport === "road"}
              onChange={() => {
                setObTransport("road");
                setData({
                  ...data,
                  outbound_mode_of_transport: "road",
                  outbound_flight: {
                    fromOB: null,
                    toOB: null,
                    budgetOB: null,
                    dateOB: null,
                    departure_timeOB: null,
                    arrival_timeOB: null,
                  },
                });
                setStartValueOBFrom("");
                setDestinationValueOBFrom("");
                setDepartureHourOB("");
                setArrivalHourOB("");
                setDepartureMinuteOB("");
                setArrivalMinuteOB("");
              }}
              className="appearance-none h-3 w-3 border-2 border-white rounded-full checked:bg-topHeader focus:outline-none focus:ring-topHeader"
            /> &nbsp;&nbsp;&nbsp;&nbsp;
            <label>Road</label>
            {/* <input
              type="radio"
              value="flight"
              checked={obTransport === "flight"}
              onChange={() => {
                setObTransport("flight");
                setData({ ...data, outbound_mode_of_transport: "flight" });
              }}
              className="appearance-none h-3 w-3 border-2 border-white rounded-full checked:bg-topHeader focus:outline-none focus:ring-topHeader"
            />
            <label>Flight</label> */}
          </div>
          <label className="w-[20%]">Return Mode of Transport</label>
          <div className=" h-[31px] w-[30%] flex items-center justify-start  rounded-lg ">
            <input
              type="radio"
              value="road"
              checked={retTransport === "road"}
              onChange={() => {
                setRetTransport("road");
                setData({
                  ...data,
                  return_mode_of_transport: "road",
                  return_flight: {
                    fromRT: null,
                    toRT: null,
                    budgetRT: null,
                    dateRT: null,
                    departure_timeRT: null,
                    arrival_timeRT: null,
                  },
                });
                setStartValueOBTo("");
                setDestinationValueOBTo("");
                setDepartureHourRT("");
                setDepartureMinuteRT("");
                setArrivalHourRT("");
                setArrivalMinuteRT("");
              }}
              className="appearance-none h-3 w-3 border-2 border-white rounded-full checked:bg-topHeader focus:outline-none focus:ring-topHeader"
            />&nbsp;&nbsp;&nbsp;&nbsp;
            <label>Road</label>
            {/* <input
              type="radio"
              value="flight"
              checked={retTransport === "flight"}
              onChange={() => {
                setRetTransport("flight");
                setData({ ...data, return_mode_of_transport: "flight" });
              }}
              className="appearance-none h-3 w-3 border-2 border-white rounded-full checked:bg-topHeader focus:outline-none focus:ring-topHeader"
            />
            <label>Flight</label> */}
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
              <div className="flex items-center gap-8 justify-between rounded-2xl">
                <label className="w-[15%]">From</label>
                <div className="w-[30%] relative">
                  <input
                    type="text"
                    className="bg-textInputBG h-[31px] rounded-lg p-2 w-full"
                    onChange={(e) => {
                      handleFlightChange("fromOB", e.target.value, true);
                      setStartValueOBFrom(e.target.value);
                    }}
                    value={startValueOBFrom}
                    disabled={!startReadyOBFrom}
                    placeholder="Enter From Location..."
                  />

                  {startStatusOBFrom === "OK" && (
                    <ul className="absolute text-black left-0 mt-1 bg-white border-1 border-gray-300 rounded-md shadow-lg z-10 w-full max-h-48 overflow-y-auto">
                      {startDataOBFrom.map(({ place_id, description }) => (
                        <li
                          key={place_id}
                          onClick={() => handleStartSelectOBFrom(description)}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        >
                          {description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <label className="w-[20%]">To</label>
                <div className="w-[27%] relative">
                  <input
                    type="text"
                    className="bg-textInputBG h-[31px] rounded-lg p-2 w-full"
                    onChange={(e) => {
                      handleFlightChange("toOB", e.target.value, true);
                      setDestinationValueOBFrom(e.target.value);
                    }}
                    value={destinationValueOBFrom}
                    disabled={!destinationReadyOBFrom}
                    placeholder="Enter To Location..."
                  />
                  {destinationStatusOBFrom === "OK" && (
                    <ul className="absolute text-black left-0 mt-1 bg-white border-1 border-gray-300 rounded-md shadow-lg z-10 w-full max-h-48 overflow-y-auto">
                      {destinationDataOBFrom.map(
                        ({ place_id, description }) => (
                          <li
                            key={place_id}
                            onClick={() =>
                              handleDestinationSelectOBFrom(description)
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
                <label className="w-[20%]">Budget</label>
                <div className="flex w-[27%] items-center gap-2">
                  <p>$</p>
                  <input
                    type="text"
                    className="bg-textInputBG h-[31px] rounded-lg pl-2 w-full"
                    onChange={(e) =>
                      handleFlightChange("budgetOB", e.target.value, true)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-8 justify-between rounded-2xl">
                <label className="w-[15%]">Date</label>
                <div className="w-[30%] relative h-[31px]">
                  <DatePicker
                    selected={dateFromFlight}
                    onChange={(dateFromFlight) => {
                      setDateFromFlight(dateFromFlight);
                      handleFlightChange("dateOB", dateFromFlight, true);
                    }}
                    placeholderText="Select Date"
                    minDate={today}
                    customInput={<CustomInput />}
                  />
                </div>

                <label className="w-[20%]">Departure Time</label>
                <div className="flex w-[27%] items-center gap-2">
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[20%] px-1"
                    maxLength={2}
                    placeholder="HH"
                    value={departureHourOB}
                    onChange={(e) =>
                      handleDepartureTimeOBChange("hour", e.target.value)
                    }
                  />
                  :
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[20%] px-1"
                    maxLength={2}
                    placeholder="MM"
                    value={departureMinuteOB}
                    onChange={(e) =>
                      handleDepartureTimeOBChange("minute", e.target.value)
                    }
                  />
                  Hrs
                </div>

                <label className="w-[20%]">Arrival Time</label>
                <div className="flex w-[27%] items-center gap-2">
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[20%] px-1"
                    maxLength={2}
                    placeholder="HH"
                    value={arrivalHourOB}
                    onChange={(e) =>
                      handleArrivalTimeOBChange("hour", e.target.value)
                    }
                  />
                  :
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[20%] px-1"
                    maxLength={2}
                    placeholder="MM"
                    value={arrivalMinuteOB}
                    onChange={(e) =>
                      handleArrivalTimeOBChange("minute", e.target.value)
                    }
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
            <h3 className="text-xl font-inria bg-topHeader rounded-r-xl p-2 w-[20%] mt-5">
              Return Flight Itinerary
            </h3>
            <div className="bg-textInputBG rounded-r-xl p-10 flex flex-col gap-4">
              <div className="flex items-center gap-8 justify-between rounded-2xl">
                <label className="w-[15%]">From</label>
                <div className="w-[30%] relative">
                  <input
                    type="text"
                    className="bg-textInputBG h-[31px] rounded-lg p-2 w-full"
                    onChange={(e) => {
                      handleFlightChange("fromRT", e.target.value, false);
                      setStartValueOBTo(e.target.value);
                    }}
                    value={startValueOBTo}
                    disabled={!startReadyOBTo}
                    placeholder="Enter From Location..."
                  />
                  {startStatusOBTo === "OK" && (
                    <ul className="absolute text-black left-0 mt-1 bg-white border-1 border-gray-300 rounded-md shadow-lg z-10 w-full max-h-48 overflow-y-auto">
                      {startDataOBTo.map(({ place_id, description }) => (
                        <li
                          key={place_id}
                          onClick={() => handleStartSelectOBTo(description)}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        >
                          {description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <label className="w-[20%]">To</label>
                <div className="w-[27%] relative">
                  <input
                    type="text"
                    className="bg-textInputBG h-[31px] rounded-lg p-2 w-full"
                    onChange={(e) => {
                      handleFlightChange("toRT", e.target.value, false);
                      setDestinationValueOBTo(e.target.value);
                    }}
                    value={destinationValueOBTo}
                    disabled={!destinationReadyOBTo}
                    placeholder="Enter To Location..."
                  />
                  {destinationStatusOBTo === "OK" && (
                    <ul className="absolute text-black left-0 mt-1 bg-white border-1 border-gray-300 rounded-md shadow-lg z-10 w-full max-h-48 overflow-y-auto">
                      {destinationDataOBTo.map(({ place_id, description }) => (
                        <li
                          key={place_id}
                          onClick={() =>
                            handleDestinationSelectOBTo(description)
                          }
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        >
                          {description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <label className="w-[20%]">Budget</label>
                <div className="flex w-[27%] items-center gap-2">
                  <p>$</p>
                  <input
                    type="text"
                    className="bg-textInputBG h-[31px] rounded-lg pl-2 w-full"
                    onChange={(e) =>
                      handleFlightChange("budgetRT", e.target.value, false)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-8 justify-between rounded-2xl">
                <label className="w-[15%]">Date</label>
                <div className="w-[30%] relative h-[31px]">
                  <DatePicker
                    selected={dateToFlight}
                    onChange={(dateToFlight) => {
                      setDateToFlight(dateToFlight);
                      handleFlightChange("dateRT", dateToFlight, false);
                    }}
                    placeholderText="Select Date"
                    minDate={today}
                    customInput={<CustomInput />}
                  />
                </div>

                <label className="w-[20%]">Departure Time</label>
                <div className="flex w-[27%] items-center gap-2">
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[20%] px-1 pl-2"
                    maxLength={2}
                    placeholder="HH"
                    value={departureHourRT}
                    onChange={(e) =>
                      handleDepartureTimeRTChange("hour", e.target.value)
                    }
                  />
                  :
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[20%] px-1 pl-2"
                    maxLength={2}
                    placeholder="MM"
                    value={departureMinuteRT}
                    onChange={(e) =>
                      handleDepartureTimeRTChange("minute", e.target.value)
                    }
                  />
                  Hrs
                </div>

                <label className="w-[20%]">Arrival Time</label>
                <div className="flex w-[27%] items-center gap-2">
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[20%] px-1 pl-2"
                    maxLength={2}
                    placeholder="HH"
                    value={arrivalHourRT}
                    onChange={(e) =>
                      handleArrivalTimeRTChange("hour", e.target.value)
                    }
                  />
                  :
                  <input
                    type="text"
                    className="bg-textInputBG rounded-lg w-[20%] px-1 pl-2"
                    maxLength={2}
                    placeholder="MM"
                    value={arrivalMinuteRT}
                    onChange={(e) =>
                      handleArrivalTimeRTChange("minute", e.target.value)
                    }
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
      </div>
      <div className="flex justify-end pb-20 pr-10 mt-10 gap-5">
        <button
          className="bg-topHeader text-white p-2 px-10 flex gap-3 font-semibold rounded-lg items-center"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SetSecene;