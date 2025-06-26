"use client";
import { useState, useEffect } from "react";
import { SlArrowRight } from "react-icons/sl";
import ChatWithAI from "@/components/chatWithAi";
import Sidebar from "@/components/Layout/Sidebar";
import Navbar from "@/components/Layout/Navbar";
import ReduxProvider from "../../redux/ReduxProvider";
import "../../app/globals.css";
import StreamVideoProvider from "@/providers/StreamVideoProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateImagePosition = () => {
            setImagePosition({
                x: window.innerWidth * 0.95,
                y: window.innerHeight * 0.91,
            });
        };

        updateImagePosition(); // Set initial position
        window.addEventListener("resize", updateImagePosition);

        return () => window.removeEventListener("resize", updateImagePosition);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const openChat = () => setIsChatOpen((prev) => !prev);

    // Start dragging
    const startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setDragging(true);
        setOffset({
            x: e.clientX - imagePosition.x,
            y: e.clientY - imagePosition.y,
        });
    };

    // Move the image
    const onDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!dragging) return;
        setImagePosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        });
    };

    // Stop dragging
    const stopDrag = () => setDragging(false);

    return (
            <div className="antialiased" onMouseMove={onDrag} onMouseUp={stopDrag}>
                <ReduxProvider>
                    <div className="h-screen flex flex-col">
                        {/* Navbar */}
                        {/* asdasdasdasd */}
                        <div className="w-full fixed z-40 top-0 bg-white h-16 shadow-md">
                            <Navbar />
                        </div>

                        <div className="flex h-full">
                            {/* Sidebar*/}
                            <div
                                className={`fixed h-full z-30 bg-white shadow-md transition-transform duration-300 ${
                                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                                }`}
                                style={{ width: "212px" }}
                            >
                                <Sidebar />
                            </div>
                    {/* stream-VideoCAll-provier */}
                            <StreamVideoProvider>
                            {/* Main Content */}
                            <div
                                className={`transition-all duration-300 flex-1 pt-20 overflow-y-auto scrollbar-hidden ${
                                    isSidebarOpen ? "ml-[210px]" : ""
                                }`}
                            >
                                {children}
                            </div>
                        </StreamVideoProvider>
                        </div>
                        {/* Sidebar Toggle Button */}
                        <button
                            className="absolute left-3 bottom-4 transform -translate-x-1/2 bg-gray-800 text-white p-2 rounded-md z-50"
                            onClick={toggleSidebar}
                        >
                            <SlArrowRight
                                size={16}
                                className={isSidebarOpen ? "rotate-180 transition-transform" : "transition-transform"}
                            />
                        </button>

                        <div
                            className="fixed cursor-grab active:cursor-grabbing flex items-center justify-center"
                            style={{
                                left: `${imagePosition.x}px`,
                                top: `${imagePosition.y}px`,
                            }}
                            onMouseDown={startDrag}
                            onClick={openChat}
                        >
                            {/* Rotating AI Ring */}
                            <div className="relative w-16 h-16 rounded-full flex items-center justify-center group">
                                <div className="absolute w-16 h-16 flex justify-center items-center rounded-full animate-rotate-ring shadow-lg z-0"></div>

                                <img
                                    src="/logo.png"
                                    alt="Chat AI"
                                    className="w-14 h-14 rounded-full z-10 hidden sm:block"
                                    referrerPolicy="no-referrer"
                                />

                                {/* Tooltip Text */}
                                <div className="absolute bottom-full mb-5 hidden group-hover:block text-black text-[12px] font-semibold px-2 py-1 rounded-md bg-white border-priorityRed border-[1px] shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-2">
                                    AI
                                </div>
                            </div>
                        </div>

                        {/* AI Chat Modal Above the Image */}
                        {isChatOpen && (
                            <div
                                className="fixed w-80 h-[500px shadow-lg rounded-lg z-50 hidden sm:block"
                                style={{
                                    left: `${imagePosition.x - 365}px`,
                                    top: `${imagePosition.y - 610}px`,
                                }}
                            >
                                <ChatWithAI />
                                <button
                                    className="absolute text-[18px] top-2 left-[370px] text-black p-1 rounded-full"
                                    onClick={() => setIsChatOpen(false)}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                </ReduxProvider>
            </div>
    );
}