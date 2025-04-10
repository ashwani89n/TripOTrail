import React, { useRef, useState } from "react";
import Header from "../components/Header";

import { CiCompass1 } from "react-icons/ci";
import { FaListCheck } from "react-icons/fa6";
import { TbCarCrash } from "react-icons/tb";
import { FaCalendar, FaCloudUploadAlt, FaFlagCheckered } from "react-icons/fa";
import { IoCalendar, IoCalendarSharp } from "react-icons/io5";

import "./planTrip.css";
import SetSecene from "../components/SetSecene";
import PickSpots from "../components/PickSpots";
import MapJourney from "../components/MapJourney";
import LockJourney from "../components/LockJourney";
import { tripContext } from "../context/useTripDataContext";

const PlanTrip = () => {
  const [tripId, setTripId] = useState();
  const [startPoint, setStartPoint] = useState();
  const [destinationPoint, setDestinationPoint] = useState();
  const [startDt, setStartDt] = useState(new Date());
  const [endDt, setEndDt] = useState(new Date());
  const [page, setPage] = useState(3);
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [selectedSpotsData, setSelectedSpotsData] = useState([]);
  const [finalData, setFinalData] = useState([
    {
        "day": 1,
        "start_time": "5:30",
        "weekDay": "Wednesday",
        "dayDate":"April 09, 2025",
        "selected_spots": [
            {
                "name": "2470 Cheshire Bridge Road Northeast, Atlanta, GA, USA",
                "address": "",
                "image": "",
                "category": "start",
                "duration": "00:00",
                "cost": 0
            },
            {
                "name": "Peachtree Park Nature Trail",
                "address": "751 Burke Road Northeast, Atlanta",
                "image": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAeeoHcLMSqdJd7VbpU04VUHliq_UXC0JlxC2TuFGDeTUy_9M3buDOFpGq-ex_RZtAKiReHRj7vy_ZcXmYvhG6KOxjgkp96A6QYYZ0rTWFCl0ZYYTC_Jyrwg1Mutjw1WEF1AN79pEoXW_kWDrhlGA8Qd_Pe3nmJ0LRT7g7IWhaYjyb7oLmXJpiJKBDqRyHE5WVl3wBfuScM5BdMOJlVq7ZOzCJdVT0rwTQ8hme1t-NYzbQzzEtVj5ibn1hxOmMMQsXWnbQJZhnicHzeFWmV9q1JZx6XoXLR3MO1zb7jHL5eKktHlWion729QdcqQfJ8wThaOi1DFVhTQ0bbIifjJEciB9jfToo4IsTMawx-GTDb4JnAkkHvmJrmhyfn-lVuuqYOgXAUHAYMH2puxSmsmrdx-aVDzkZB_TfCW7-FIQklnSv9AYj2NWtE8W6-6B7sytbMTIYu9UG6EFFwPUfAmabgcR0c9O5w-9syI_csqVhI-fT4s2pW61wqrdHAWTDkF27OLBXhYrrlqpteJDYnwiv_wnSboHxlR6Y6fnAya1xQEoWnaWnijM5_z2jNkXKF7DaFS5INSmIkilG29puHyCkhiFsGkIRmD1Yr9MxT53ahmOOHPkiLDM3T5BAFKpyGJhBIoxO9XXeA&3u400&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fplan&key=AIzaSyA3xEs87Yqi3PpC8YKGhztvrXNDJX5nNDw&token=93002",
                "category": "spot",
                "duration": "1:20",
                "cost": 0
            },
            {
                "name": "Kittredge Park",
                "address": "2545 North Druid Hills Road, Atlanta",
                "image": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAeeoHcIXOvQux1ZkLm_FffvJPbYcKmFVsbmJtLALijizconrrg1brJJuzC-j6_eyFgilvEsoSSPJl4onN044IvS4XAx48xARa6gPGjIWxkakeVJM8HpAKREx3ys0oAKLcMv0cV0HgcrAts5gLS57x1jpmCwiipHRjTOlnBwFPAt5KqEWIdjY4q3ubfGBGHwaFBpsRQJlk1HjTJn0XdqXwoNaKiyCF7KywPJD7IJBEL2NKHOETmmxSlpH0VcgLxP1EA7ftvHe3sDqoZgK_2rxKIqLZQNHLqymaZEwsKTAgr3XSIV_4R_ggsr3E2jQX5iqWhenkHUTHlctTxnFvSiG6h6f9ufbr4ADaDR8sdv-ErhU6XNZSUbKCLDf7if8P2b6edCfyum5f5jIV6lMsKoN8-jepE554k8n2_kL0yCblAqoTGCGe-lGnoHT-mRxvAAnVn0q4NS6O6YOtXzclcAcgZg1_X6GhBYdrPDS6Ul8A6lE17yxVmORbvq6bJa-NSppYRmJKlLrmf6BpFr8y6M6YWkdARBeUCH9FO2z6BhOgK4n5eKU4aPLhYk0OBYcc9FYLr7-otWwu326SaroqRo_5xTDkTyZosvWAk4PJS_OORYzLFq14Hz3Em5gRTdZcALMgNEqLZICPw&3u400&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fplan&key=AIzaSyA3xEs87Yqi3PpC8YKGhztvrXNDJX5nNDw&token=35828",
                "category": "spot",
                "duration": "2:00",
                "cost": 0
            },
            {
                "name": "The Kinsley at Perimeter Center, Mount Vernon Highway, Atlanta, GA, USA",
                "address": "The Kinsley at Perimeter Center, Mount Vernon Highway, Atlanta, GA, USA",
                "image": "",
                "category": "accomodation",
                "duration": "00:00",
                "cost": 100
            }
        ]
    },
    {
        "day": 2,
        "start_time": "8:00",
        "weekDay": "Thursday",
        "dayDate":"April 10, 2025",
        "selected_spots": [
            {
                "name": "The Kinsley at Perimeter Center, Mount Vernon Highway, Atlanta, GA, USA",
                "address": "The Kinsley at Perimeter Center, Mount Vernon Highway, Atlanta, GA, USA",
                "image": "",
                "category": "accomodation",
                "duration": "00:00",
                "cost": 100
            },
            {
                "name": "Morningside Nature Preserve",
                "address": "Parking lot, 2020 Lenox Road Northeast, Atlanta",
                "image": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAeeoHcKPBRL_G0dnMw_L3MqwWp_GIESBzRmhxyzPmQKLOuEtPK2lk9O1FLgJTlJYjJtKwzSsKl-SqLWe7fmewjQ0Zf9bP_EpUAjWqrBR-bOMkhr2UryJ1-UH06zGySkz1WqX0zSqObHYtp2VgFFtsWJ3b7SwlFHh6wLo3QPHTtweLhVma0gG7RpEbwRVqroQaLae0weo5HNoqkgnOFXXmWnYDqI4acadM4gXPEwfMrSnq-zZdGNYec5i4BD93fhB2B8u2lUuBAoC0-yqYzocDadVwBk8tYag9BtSBHqyjUyoDx7DHeswg0gOzfCilhiTnCkbCKfxku2WSyJXjcPNE8kdoKSZRtgVL93ugMay_uFQA8oU321x0hvUOYkWazcuVkwZ8dDuLn4osmsfhmsXHPOOcdXo7yL50Mh-uj61rLJ4ZXa5daQjRgMoEfUfkECWu4PG6Qb_MmC797Mr4SlsP_yH9TSr7I0uZhhWi78gi2b3raxauazPuXUAuG4KFbDGbiy_ZAD_fhRlBoCZAXfABevj8AuKRENqEUDT1Wg7GueaAu9nSCLggoYP91Up0Bcuym-ycB_M8xcoPUcUg52K5DUm-iykDSg3ySp1gMIlIXdP1t3zU4dF6y3oBc9vIsO3oJL-L_8Zu1ji&3u400&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fplan&key=AIzaSyA3xEs87Yqi3PpC8YKGhztvrXNDJX5nNDw&token=3114",
                "category": "spot",
                "duration": "0:0",
                "cost": 121
            },
            {
                "name": "The Kinsley at Perimeter Center, Mount Vernon Highway, Atlanta, GA, USA",
                "address": "The Kinsley at Perimeter Center, Mount Vernon Highway, Atlanta, GA, USA",
                "image": "",
                "category": "accomodation",
                "duration": "00:00",
                "cost": 50
            }
        ]
    },
    {
        "day": 3,
        "start_time": "11:00",
        "weekDay": "Friday",
        "dayDate":"April 11, 2025",
        "selected_spots": [
            {
                "name": "The Kinsley at Perimeter Center, Mount Vernon Highway, Atlanta, GA, USA",
                "address": "The Kinsley at Perimeter Center, Mount Vernon Highway, Atlanta, GA, USA",
                "image": "",
                "category": "accomodation",
                "duration": "00:00",
                "cost": 50
            },
            {
                "name": "Frankie Allen Park",
                "address": "100 Bagley Street Northeast, Atlanta",
                "image": "https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAeeoHcKG9Xk43-ruHCu4HwY8qa6XJVlcHjMDdQwRh53D-uZyeJz0N0-TuVGEOvN8t_9HCQeSFPvQ2D9m2eolohaKaQmZ-aJWLQNmkLUKOb_y2wLye3PqNb6gGh6mL4yooSPiWumzQx6B0bNCvMNOrKKrVeDmvRtzWV0pUCQNDntHMwDm7dx9wEnyuZRBA28mcVPnWQrpT5WqQjHTVuSd3Ur_xzxERsnv6X24Ua5kZeW3XR0_gSO93Al6mP22p7hJ-UQrYXra5k6gr85i0420pukySf5fBp1xk7CVBuvLZzdthxkGdn7Ka_Mokhu6BPOV9UVfsyvhZazMDAihRYhzikfdzs0TMa-Qw0LyPjPQeoVlbHCUPjgRze-K3Y63CHVaQWBthDOdMEYCdxtLHT8d8XP1jzxW-zbOaeZuM45zEqmuu6kh3JlDG-jqWdF8S91mzizt85gqVKrzpxApOvzP5v8I13P__6pvWDqWRz3u_VhfAn1ScJJjfv_YL6l4JPr0YFcLQqM3g0Fio9KjOifnPHLT5NQ7j1SMHM7dZhifuZ5lY4tjCMHwGaBec6DQmdaar3dkrmglueiLBHU6HMiBE6sEQLEACEc3wTV7aQf33_UmRFt-qw_A8Ced6CZ_MGnWrNMs50JEvg&3u400&5m1&2e1&callback=none&r_url=http%3A%2F%2Flocalhost%3A5173%2Fplan&key=AIzaSyA3xEs87Yqi3PpC8YKGhztvrXNDJX5nNDw&token=125004",
                "category": "spot",
                "duration": "0:30",
                "cost": 100
            },
            {
                "name": "5090 Buford Highway Northeast, Doraville, GA, USA",
                "address": "",
                "image": "",
                "category": "end",
                "duration": "00:00",
                "cost": 0
            }
        ]
    }
]
);
  const [title, setTitle] = useState("");
  const [transportBudget, setTransportBudget] = useState(0);
 
  return (
    <tripContext.Provider
      value={{
        tripId,
        setTripId,
        destinationPoint,
        setDestinationPoint,
        startPoint,
        setStartPoint,
        startDt, setStartDt,
        endDt, setEndDt,
        startCoordinates, setStartCoordinates,
        destinationCoordinates, setDestinationCoordinates,
        title, setTitle,
        transportBudget, setTransportBudget
      }}
    >
      <div className="bg-darkBG min-h-screen flex flex-col">
        <Header />
        <div>
          <div className="bg-subHeaderBG text-center mt-12 p-2 mx-10 rounded-t-2xl mb-12">
            <p className="text-white text-xl font-aldrich">
              Plan your <span className="text-black">Trip</span>
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`bg-topHeader rounded-full w-[41px] h-[41px] flex items-center justify-center mr-2 ${
                    page === 0 ? "border-white-500 border-[2px]" : "border-none"
                  }`}
                >
                  <CiCompass1 className="text-white font-bold h-[25px] w-[62px]" />
                </div>
                <p className="text-white text-xl font-aldrich font:semibold mt-2">
                  Get
                </p>
              </div>
              <div className="border-white border-[1px] w-[192px] mb-10 ml-2 mr-2"></div>
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`bg-topHeader rounded-full w-[41px] h-[41px] flex items-center justify-center ${
                    page === 1 ? "border-white-500 border-[2px]" : "border-none"
                  }`}
                >
                  <FaListCheck className="text-white font-bold h-[25px] w-[62px] p-1" />
                </div>
                <p className="text-white text-xl font-aldrich mt-2 mr-2">Set</p>
              </div>
              <div className="border-white border-[1px] w-[192px] mb-10 mr-2 ml-2"></div>
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`bg-topHeader rounded-full w-[41px] h-[41px] flex items-center justify-center p-2 ${
                    page === 2 ? "border-white-500 border-[2px]" : "border-none"
                  }`}
                >
                  <TbCarCrash className="text-white font-bold h-[25px] w-[62px]" />
                </div>
                <p className="text-white text-xl font-aldrich mt-2">Go</p>
              </div>
              <div className="border-white border-[1px] w-[192px] mb-10 ml-2"></div>
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`bg-topHeader rounded-full w-[41px] h-[41px] flex items-center justify-center mr-1 ${
                    page === 3 ? "border-white-500 border-[2px]" : "border-none"
                  }`}
                >
                  <FaFlagCheckered className="text-white font-bold h-[25px] w-[62px] p-1" />
                </div>
                <p className="text-white text-xl font-aldrich mt-2">Confirm</p>
              </div>
            </div>
          </div>
        </div>
        {page === 0 && <SetSecene onClickNext={setPage} />}
        {page === 1 && <PickSpots onClickNextPrev={setPage} sendDataToParent ={setSelectedSpotsData}/>}
        {page === 2 && <MapJourney onClickNextPrev={setPage} selectedAttraction={selectedSpotsData} sendDataToParent = {setFinalData}/>}  
        
        {page === 3 && <LockJourney onClickNextPrev={setPage} data = {finalData}/>} 
      </div>
    </tripContext.Provider>
  );
};

export default PlanTrip;
