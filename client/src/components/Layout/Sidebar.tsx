"use client";
import Link from "next/link";
import React, { useState } from "react";
import { MdArrowRight } from "react-icons/md";
import MyProfile from "@/components/Myaccount";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/app/store";
import { getProjects } from "@/redux/features/projectSlice";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const allProjects = useSelector(
    (state: RootState) => state.project.allProjects
  );

  const groupProjects = allProjects.filter((project) => project.isGroup);
  const individualProjects = allProjects.filter((project) => !project.isGroup);

  const [openSections, setOpenSections] = useState<{
    group: boolean;
    individual: boolean;
  }>({
    group: false,
    individual: false,
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const pathname = usePathname(); // Get the current URL
  const pathParts = pathname.split("/");
  const lastPath = pathParts[pathParts.length - 1];


  const toggleSection = async (section: "group" | "individual") => {
    setOpenSections((prev) => {
      const newState = !prev[section];

      // Fetch projects when expanding a section
      if (newState) {
        dispatch(getProjects()); // Trigger fetch
      }

      return { ...prev, [section]: newState };
    });
  };

  const handleLinkClick = () => {
    setIsModalOpen(false);
  };

    const handleAccountLinkClick = () => {
        setIsModalOpen(pre=>!pre);
    };

    return (
        <>
            <div className="z-10 bg-pureWhite h-screen w-[214px] shadow-[2px_0px_10px_3px_rgba(0,0,0,0.11)] pt-[100px] fixed">
                <nav>
                    <ul className="space-y-4 pl-10 font-medium text-textColor font-poppins">
                        <li>
                            <Link
                                href="/home"
                                className={`py-[6px] text-[12px] border-l-[3px] ${
                                    lastPath === "home" ? "border-primaryDark" : "border-pureWhite"
                                } pl-5`}
                                onClick={() => handleLinkClick()}
                            >
                                My Workplace
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/home/notes"
                                className={`py-[6px] text-[12px] border-l-[3px] ${
                                    lastPath === "notes" ? "border-primaryDark" : "border-pureWhite"
                                } pl-5`}
                                onClick={() => handleLinkClick()}
                            >
                                Notes
                            </Link>
                        </li>
                        <li>
                            <Link
                                href=""
                                className={`py-[6px] text-[12px] border-l-[3px] ${
                                    lastPath === "" ? "border-primaryDark" : "border-pureWhite"
                                } pl-5`}
                                onClick={handleAccountLinkClick}
                            >
                                My Account
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/home/trello"
                                className={`py-[6px] text-[12px] border-l-[3px] ${
                                    lastPath === "trello" ? "border-primaryDark" : "border-pureWhite"
                                } pl-5`}
                                onClick={() => handleLinkClick()}
                            >
                                Trello
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/home/scheduledMeetings"
                                className={`py-[6px] text-[12px] border-l-[3px] ${
                                    lastPath === "scheduledMeetings" ? "border-primaryDark" : "border-pureWhite"
                                } pl-5`}
                                onClick={() => handleLinkClick()}
                            >
                                Scheduled Meetings
                            </Link>
                        </li>
                    </ul>

                    {/* Projects Section */}
                    <div className="font-medium font-poppins mt-14 pl-10">
                        <p className="text-[13px] text-placeholder mb-2">Projects</p>

                        {/* Group Projects */}
                        <div>
                            <button onClick={() => toggleSection("group")} className="flex items-center w-full text-left">
                                <MdArrowRight
                                    className={`text-[#1C1B1F] w-[20px] h-[23px] transition-transform duration-300 ${
                                        openSections.group ? "rotate-90" : ""
                                    }`}
                                />
                                <span className="text-[12px] text-textColor ml-2">Group Projects</span>
                            </button>
                            {openSections.group && (
                                <ul className="pl-6 mt-1 space-y-1 text-[11px] text-textColor">
                                    {groupProjects.length > 0 ? (
                                        groupProjects.map((project, index) => (
                                            <li key={index} className="pl-4 py-1 ">
                                                <Link
                                                    className="relative after:content-[''] pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-primaryDark after:transition-all after:duration-300 hover:after:w-full"
                                                    href={`/home/project/${project._id}`}
                                                >
                                                    {project.name}
                                                </Link>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-placeholder pl-4 py-1">No projects available</li>
                                    )}
                                </ul>
                            )}
                        </div>

                        {/* Individual Projects */}
                        <div className="mt-2">
                            <button
                                onClick={() => toggleSection("individual")}
                                className="flex items-center w-full text-left"
                            >
                                <MdArrowRight
                                    className={`text-[#1C1B1F] w-[20px] h-[23px] transition-transform duration-300 ${
                                        openSections.individual ? "rotate-90" : ""
                                    }`}
                                />
                                <span className="text-[12px] text-textColor ml-2">Individual Projects</span>
                            </button>

                            {openSections.individual && (
                                <ul className="pl-6 mt-1 space-y-1 text-[11px] text-textColor">
                                    {individualProjects.length > 0 ? (
                                        individualProjects.map((project, index) => (
                                            <li key={index} className="pl-4 py-1">
                                                <Link  className="relative after:content-[''] pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-primaryDark after:transition-all after:duration-300 hover:after:w-full" href={`/home/project/${project._id}`}>{project.name}</Link>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-placeholder pl-4 py-1">No projects available</li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
            <div className="absolute -z-10">
                <MyProfile isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </>
    );
};

export default Sidebar;
