import React, { useState } from "react";
import Header from "../components/Header";
import "./home.css";
import Plan1 from "../images/plan1.png";
import Plan2 from "../images/plan2.png";
import Plan3 from "../images/plan3.png";
import { tripContext } from "../context/useTripDataContext";
function Home() {
  const [token, setToken] = useState("");
  return (
    <tripContext.Provider value={{token, setToken}}>
      <Header />
      <div className="heroImage h-[790px] flex items-center ">
        <div className="heroContent ml-10 p-10 flex flex-col items-end rounded-xl">
          <p className="font-shalimar text-7xl text-white mb-5">
            {" "}
            Plan your <span className="text-topHeader">perfect</span> Gateway!
          </p>
          <button className="bg-black text-topHeader p-2 rounded-xl font-aldrich text-2xl px-7 w-52">
            Discover
          </button>
        </div>
      </div>
      <div className="bg-darkBG p-5">
        <div className="bg-black p-5 rounded-xl h-[fit] text-white">
          <h3 className="font-akaya text-4xl mb-28">
            {" "}
            How <span className="text-topHeader">TripOTrail</span> Works?
          </h3>

          <div className="flex flex-col justify-center items-center gap-28 mb-10 md:flex-row md:gap-28">
            <div className="w-[300px] h-[410px]">
              <div className="bg-[url(images/BackgroundArrow.png)] bg-no-repeat bg-contain">
                <div>
                  <div className="rounded-full border-white border-2  w-[97px] h-[97px] p-1 ml-24 relative top-[-50px]">
                    <img src={Plan1} className="bg-topHeader rounded-full p-2" />
                  </div>
                  <div className="ml-14">
                    <h3 className="font-aldrich text-2xl mt-2 text-topHeader mb-4 ">
                      Plan a Trip
                    </h3>

                    <ul className="font-akaya pb-20 text-xl mr-1 list-disc">
                      <li className="mb-1 ml-5">Discover Attractions</li>
                      <li className="mb-1 ml-5">Add Destinations</li>
                      <li className="mb-1 ml-5">Create Timelines</li>
                      <li className="mb-1 ml-5">Set Budgets</li>
                      <li className="mb-1 ml-5"> Invite Friends</li>
                    </ul>
                  </div>
                </div>
                <div className="flex justify-center ">
                    <h1 className="text-white text-2xl font-akaya bg-topHeader w-[30px] h-[30px] rounded-full flex items-center justify-center ml-5">1</h1>
                </div>
              </div>
            </div>
            <div className="w-[300px] h-[410px]">
              <div className="bg-[url(images/BackgroundArrow.png)] bg-no-repeat bg-contain">
                <div>
                  <div className="rounded-full border-white border-2 w-[97px] h-[97px] p-1 ml-24 relative top-[-50px]">
                    <img src={Plan2} className="bg-topHeader rounded-full p-2" />
                  </div>
                  <div className="ml-14">
                    <h3 className="font-aldrich text-2xl mt-2 text-topHeader mb-4 ">
                      Stay Organized
                    </h3>

                    <ul className="font-akaya text-xl pb-20 mr-1 list-disc min-h-[239.954px]">
                      <li className="mb-1 ml-5">Upload Documents</li>
                      <li className="mb-1 ml-5">Set Reminders</li>
                      <li className="mb-1 ml-5">Share Itinerary</li>
                    </ul>
                  </div>
                </div>
                <div className="flex justify-center ">
                    <h1 className="text-white text-2xl font-akaya bg-topHeader w-[30px] h-[30px] rounded-full flex items-center justify-center  ml-5" >2</h1>
                </div>
              </div>
              
            </div>
            <div className="w-[300px] h-[410px]">
              <div className="bg-[url(images/BackgroundArrow.png)] bg-no-repeat bg-contain">
                <div>
                  <div className="rounded-full border-white border-2  w-[97px] h-[97px] p-1 ml-24 relative top-[-50px]">
                    <img src={Plan3} className="bg-topHeader rounded-full p-4" />
                  </div>
                  <div className="ml-14">
                    <h3 className="font-aldrich text-2xl mt-2 text-topHeader mb-4 ">
                      Track & Enjoy
                    </h3>

                    <ul className="font-akaya text-xl pb-20 mr-1 list-disc min-h-[239.954px]">
                      <li className="mb-1 ml-5">Monitor activities</li>
                      <li className="mb-1 ml-5">Track Expenses</li>
                      <li className="mb-1 ml-5">Notify about split</li>
                      <li className="mb-1 ml-5">Review Journey</li>
                    </ul>
                  </div>
                </div>
                <div className="flex justify-center ">
                    <h1 className="text-white text-2xl font-akaya bg-topHeader w-[30px] h-[30px] rounded-full flex items-center justify-center ml-5">3</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </tripContext.Provider>
  );
}

export default Home;
