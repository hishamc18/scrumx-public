"use client";
import { FaTasks, FaUserTie, FaCalendarCheck, FaUserClock, FaRobot, FaMicrophone, FaUserEdit } from "react-icons/fa";
import {
    MdOutlineChat,
    MdSupportAgent,
    MdChecklist,
    MdCategory,
    MdMeetingRoom,
    MdDashboard,
    MdScreenShare,
    MdRecordVoiceOver,
    MdRateReview,
    MdAssistant,
    MdStickyNote2,
} from "react-icons/md";
import { BsKanban, BsFillPersonPlusFill } from "react-icons/bs";
import { PiNotepadBold, PiPresentationChartBold, PiClipboardTextBold } from "react-icons/pi";
import { AiOutlineTeam, AiOutlineProject } from "react-icons/ai";
import { FiActivity, FiTrello } from "react-icons/fi";
import { RiLiveLine, RiVipCrownFill } from "react-icons/ri";
import { GiPodiumWinner, GiProgression } from "react-icons/gi";

const features = [
    { name: "Search", icon: <FaUserTie /> },
    { name: "Tasks", icon: <FaTasks /> },
    { name: "D&D", icon: <AiOutlineTeam /> },
    { name: "AI", icon: <FaRobot /> },
    { name: "Chat", icon: <MdOutlineChat /> },
    { name: "Profile", icon: <FaUserEdit /> },
    { name: "Conference", icon: <FaMicrophone /> },
    { name: "Project", icon: <AiOutlineProject /> },
    { name: "Collab Notes", icon: <PiClipboardTextBold /> },
    { name: "Time Tracking", icon: <FaUserClock /> },
    { name: "Time Estimates", icon: <FaCalendarCheck /> },
    { name: "24/7 Support", icon: <MdSupportAgent /> },
    { name: "Assign", icon: <BsFillPersonPlusFill /> },
    { name: "Projects", image: "/4380.jpg", big: true },
    { name: "Conference", image: "/online-therapist-talking-through-mobile-phone.png", big: true },
    { name: "Kanban", icon: <BsKanban /> },
    { name: "Collab Notes", icon: <PiClipboardTextBold /> },
    { name: "Priority", icon: <GiPodiumWinner /> },
    { name: "Category", icon: <MdCategory /> },
    { name: "Meet", icon: <MdMeetingRoom /> },
    { name: "Board", icon: <MdDashboard /> },
    { name: "Live", icon: <RiLiveLine /> },
    { name: "Wikis", icon: <PiNotepadBold /> },
    { name: "AI Notetaker", icon: <FaRobot /> },
    { name: "Invite", icon: <FiActivity /> },
    { name: "Wikis", icon: <PiNotepadBold /> },
    { name: "AI Notetaker", icon: <FaRobot /> },
    { name: "Kanban", image: "/8104941.jpg", big: true },
    { name: "Chat", image: "/2992779.jpg", big: true },
    { name: "Time Tracking", icon: <FiActivity /> },
    { name: "Scheduling", icon: <FaCalendarCheck /> },
    { name: "Checklists", icon: <MdChecklist /> },
    { name: "Estimates", icon: <GiProgression /> },
    { name: "Reporting", icon: <PiPresentationChartBold /> },
    { name: "Lead", icon: <RiVipCrownFill /> },
    { name: "Live Actions", icon: <RiLiveLine /> },
    { name: "RBAC", icon: <AiOutlineTeam /> },
    { name: "Filtering", icon: <FiActivity /> },
    { name: "Live Notes", icon: <PiClipboardTextBold /> },
    { name: "Screen Sharing", icon: <MdScreenShare /> },
    { name: "Record", icon: <MdRecordVoiceOver /> },
    { name: "Review", icon: <MdRateReview /> },
    { name: "Assistance", icon: <MdAssistant /> },
    { name: "Free", icon: <FiActivity /> },
    { name: "Sticky", icon: <MdStickyNote2 /> },
    { name: "Minimal", icon: <FiActivity /> },
    { name: "Trello", icon: <FiTrello /> },
    { name: "Integrations", icon: <FiTrello /> },
];

const Features = () => {
    return (
        <div className="relative bg-gray-100 py-10 px-4">
            {/* Top Fade Effect - Increased Thickness */}
            <div className="absolute top-0 left-0 z-20 w-full h-[500px] bg-gradient-to-b from-gray-200 via-white/95 to-transparent">
                <div className="flex justify-center items-center flex-col mt-10 text-center">
                    <h2 className="text-priorityRed text-[22px] font-caveat tracking-wider font-bold">Features</h2>
                    <div>
                        <h2 className="text-[36px] text-black font-extrabold -mb-4">Every feature your team needs to</h2>
                        <span className="text-[36px] text-black font-extrabold">complete work faster</span>
                    </div>
                    <h3 className="text-[19px] text-black">40+ features to take productivity to the next level.</h3>
                    <button className="bg-black p-2 px-4 mt-4 text-[white] rounded-xl font-bold cursor-none">Discover All Features</button>
                </div>
            </div>

            {/* Left Fade Effect */}
            <div className="absolute left-0 top-0 h-full z-30 w-[250px] bg-gradient-to-r from-white via-white/70 to-transparent"></div>

            {/* Feature Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-10 gap-4 mt-52 mx-4 lg:mx-20 relative z-10">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={`border-gray-300 transition-all duration-200 border hover:border-2 hover:border-gray-400 text-center rounded-2xl shadow-md flex flex-col items-center justify-center hover:text-black text-gray-600
                        ${
                            feature.big
                                ? "h-[13rem] w-full sm:w-[15rem] col-span-1 sm:col-span-2 row-span-2 p-2 bg-white"
                                : "h-24 w-full sm:w-28 bg-gray-50"
                        }
                    `}
                    >
                        {/* Render Image for Big Boxes */}
                        {feature.image ? (
                            <img
                                src={feature.image}
                                alt={feature.name}
                                className="w-full h-40 object-cover scale-95 rounded-lg"
                            />
                        ) : (
                            feature.icon && <div className="text-3xl">{feature.icon}</div>
                        )}
                        <p
                            className={`mt-2 font-semibold ${
                                feature.big
                                    ? "text-[20px] font-semibold tracking-wider text-black"
                                    : "text-sm tracking-wider"
                            }`}
                        >
                            {feature.name}
                        </p>
                    </div>
                ))}
            </div>

            {/* Right Fade Effect */}
            <div className="absolute right-0 top-0 h-full z-30 w-[250px] bg-gradient-to-l from-white via-white/70 to-transparent"></div>

            {/* Bottom Fade Effect */}
            <div className="absolute bottom-0 z-10 left-0 w-full h-[200px] bg-gradient-to-t from-white via-white/70 to-transparent"></div>
        </div>
    );
};

export default Features;
