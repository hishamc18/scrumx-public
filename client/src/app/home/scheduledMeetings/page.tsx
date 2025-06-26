"use client"
import CallList from "@/components/streamVideo/CallList";
import { useState } from "react";

const UpcomingPage = () => {
    const [activeTab, setActiveTab] = useState("onGoing");

    return (
        <section className="flex size-full relative px-10 mt-8 flex-col gap-10 text-textColor">
                        <div className="flex items-center justify-between">
                <h1 className="text-3xl   font-bold text-textColor">Meetings</h1>
                <div className="relative flex gap-6 border-gray-300 w-fit p-1 scale-75 bg-gray-200 rounded-xl">
          
            <div
                className={` absolute top-0 bottom-0 w-1/2 bg-primaryDark rounded-xl transition-all duration-300 ${
                    activeTab === "onGoing" ? "left-0" : "left-1/2"
                }`}
            />

           
            <button
                className={`relative text-xs flex justify-center px-4 py-2 items-center font-semibold z-10 ${
                    activeTab === "onGoing"
                        ? "text-white"
                        : "text-gray-400"
                }`}
                onClick={() => setActiveTab("onGoing")}
            >
                OnGoing
            </button>

            <button
                className={`relative text-xs flex justify-center items-center px-4 py-2 font-semibold z-10 ${
                    activeTab === "upcoming"
                        ? "text-white"
                        : "text-gray-400"
                }`}
                onClick={() => setActiveTab("upcoming")}
            >
                Upcoming
            </button>
        </div>
            </div>

            {activeTab === "onGoing" && <CallList type="onGoing" />}
            {activeTab === "upcoming" && <CallList type="upcoming" />}
            
        </section>
    );
};

export default UpcomingPage;