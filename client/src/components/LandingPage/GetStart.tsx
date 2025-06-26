"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const options = [
    { name: "Kanban", icon: "📋", bg: "/4380.jpg" },
    { name: "Chat", icon: "💬", bg: "/images/chat-bg.png" },
    { name: "AI", icon: "🤖", bg: "/images/ai-bg.png" },
    { name: "Meet", icon: "🏃", bg: "/images/sprints-bg.png" },
    { name: "Sticky", icon: "⏳", bg: "/images/time-bg.png" },
    { name: "Collab Notes", icon: "📅", bg: "/images/calendar-bg.png" },
    { name: "Drag & Drop", icon: "📄", bg: "/images/docs-bg.png" },
    { name: "Rich Task", icon: "📊", bg: "/images/dashboards-bg.png" },
    { name: "Screen Share", icon: "📝", bg: "/images/whiteboards-bg.png" },
];

const WorkspaceSetup = () => {
    const [selectedBg, setSelectedBg] = useState(options[0].bg);
    const router = useRouter();

    return (
        <div className="h-[1250px] bg-gray-100 flex flex-col">
            <div className="flex mt-20 flex-col justify-center items-center text-black text-center">
                <h2 className="text-[44px] font-extrabold">The everything app, for work</h2>
                <h2 className="text-[18px]">One app for projects, knowledge, conversations, and more</h2>
                <h2 className="text-[18px]">Get more done faster—together</h2>
                <button
                    onClick={() => {
                        router.push("/register");
                    }}
                    className="mt-6 mb-14 px-6 py-3 bg-gradient-to-r from-orange-300 to-priorityRed text-white font-bold rounded-lg shadow-lg text-lg hover:opacity-90 transition cursor-none"
                >
                    Get Started, It&apos;s Free
                </button>
            </div>
            <div className="relative flex py-10 justify-center bg-gray-100">
                {/* 🔹 Main Box (Background Image) */}
                <div className="relative w-[65vw] h-[50vh] bg-white rounded-3xl shadow-xl outline outline-4 outline-white outline-offset-8">
                    {/* Background Image */}
                    <img
                        src={selectedBg}
                        alt="Background"
                        className="absolute inset-0 w-full rounded-3xl h-full object-cover transition-opacity duration-500"
                    />
                    {/* 🔹 INNER BOX with Shadow */}
                    <div className="absolute bottom-[-70%] z-20 left-1/2 transform -translate-x-1/2 w-[76%] hidden md:block">
                        <div
                            className="relative bg-white backdrop-blur-lg rounded-2xl p-6 outline outline-3 outline-white outline-offset-8
                shadow-priorityRed/40 shadow-[0px_-10px_130px_30px_rgba(0,0,0,0.2)] before:absolute before:-top-2 before:left-0 before:w-full before:h-4 before:bg-black/10 before:blur-lg"
                        >
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-gray-900">Set up your Workspace</h2>
                                <p className="text-gray-600">Start with what you need, customize as you go.</p>
                                {/* Icons Grid */}
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
                                    {options.map((item) => (
                                        <button
                                            key={item.name}
                                            onClick={() => setSelectedBg(item.bg)}
                                            className="flex flex-col items-center place-item-center text-black justify-center py-2 bg-white rounded-lg border border-gray-300 shadow-md hover:bg-gray-100 transition cursor-none"
                                        >
                                            <span className="text-2xl">{item.icon}</span>
                                            <span className="text-sm mt-2">{item.name}</span>
                                        </button>
                                    ))}
                                </div>
                                {/* Get Started Button */}
                                <button className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-300 to-priorityRed text-white font-bold rounded-xl shadow-lg text-lg hover:opacity-90 transition cursor-none">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkspaceSetup;
