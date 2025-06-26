"use client";
import React from "react";
import { FaComments } from "react-icons/fa"; // Importing an icon for the chat

const ChatSymbol: React.FC = () => {
    return (
        <div className="h-[160px] w-16 text-green-600 bg-primaryDark flex flex-col items-center justify-center rounded-t-md shadow-lg relative">
            <FaComments className="chat-icon text-3xl mb-2 cursor-pointer hover:scale-110 transition-transform duration-300" />
            
            <div className=" -mt-8 text-container flex flex-col items-center">
                <span className="text-letter text-[18px] font-semibold text-white">C</span>
                <span className="text-letter text-[18px] font-semibold text-white">H</span>
                <span className="text-letter text-[18px] font-semibold text-white">A</span>
                <span className="text-letter text-[18px] font-semibold text-white">T</span>
            </div>
        </div>
    );
};

export default ChatSymbol;