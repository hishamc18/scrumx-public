"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname  } from "next/navigation";
import { FaTrello } from "react-icons/fa";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
// import { LuNotebookPen } from "react-icons/lu";
import { IoChatbubblesOutline } from "react-icons/io5";
import { MdOutlineVideoCameraFront } from "react-icons/md";
import ChatUI from "@/app/home/project/[id]/chat/page";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { getSocket } from "@/socket/socket";
import { setOnlineUsers, updateUserStatus } from "@/redux/features/chatSlice";


interface SidebarProps {
  setSidebarExpanded: (expanded: boolean) => void;
}

interface Member {
    _id: string;
    userId: {
      _id: string;
      avatar?: string;
      firstName?: string;
      lastName?: string;
      userProfession?: string;
    };
  }

function ProjectSidebar({ setSidebarExpanded }: SidebarProps) {
    const params = useParams<{ id: string }>();
        const id = params?.id ?? "";
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const user = useSelector((state: RootState) => state.auth?.user);
    const { project } = useSelector((state: RootState) => state.project);
    const dispatch = useDispatch();


const pathname = usePathname(); // Get the current URL
const pathParts = pathname.split("/");
const lastPath = pathParts[pathParts.length - 1];

    // Check user role in project
    const loggedInMember = project?.joinedMembers?.find(
        (m:Member) => m?.userId?._id?.toString() === user?.id?.toString()
    );

    const isAuthorized = loggedInMember?.role === "Founder" || loggedInMember?.role === "Lead";


    useEffect(() => {
        const socket = getSocket();
      
        if (user?.id) {
          socket.emit("userOnline", user.id);
        }
      
        const handleOnlineUsers = (users: string[]) => {
          dispatch(setOnlineUsers(users));
        };
      
        const handleUserStatusUpdate = ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
          dispatch(updateUserStatus({ userId, isOnline }));
        };
      
        // Ensure previous listeners are removed before adding new ones
        socket.off("onlineUsers", handleOnlineUsers);
        socket.off("userStatusUpdate", handleUserStatusUpdate);
      
        socket.on("onlineUsers", handleOnlineUsers);
        socket.on("userStatusUpdate", handleUserStatusUpdate);
      
        return () => {
          socket.off("userStatusUpdate", handleUserStatusUpdate);
          socket.off("onlineUsers", handleOnlineUsers);
        };
      }, [dispatch, user?.id]);



    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed flex flex-col right-0 top-0 h-screen pt-[85px] bg-pureWhite shadow-[2px_0px_10px_3px_rgba(0,0,0,0.11)] text-textColor transition-all  
                    ${isExpanded ? "w-[210px]" : "w-16"}
                `}
                onMouseEnter={() => {
                    setIsExpanded(true);
                    setSidebarExpanded(true);
                }}
                onMouseLeave={() => {
                    if (selectedItem !== "chat") {
                        setIsExpanded(false);
                        setSidebarExpanded(false);
                    }
                }}
            >
                <div className="flex flex-col h-screen">
                    <div>
                        <p className={`text-[14px] text-gray-400 mt-4 ml-2 font-bold font-poppins mb-4 ${isExpanded ? "px-6" : "px-2"}`}>
                            Tools
                        </p>
                        <ul className="space-y-4">
                            {/* Trello Button */}
                            <li onClick={() => setSelectedItem("trello")}>
                                <Link
                                    href={`/home/project/${id}`}
                                    className={`flex justify-center items-center p-2 rounded-lg cursor-pointer w-full transition-all ${
                                        lastPath == id ? "bg-primaryDark text-white" : "hover:bg-gray-200"
                                    } ${isExpanded ? "gap-x-8" : "gap-x-0"}`}
                                >
                                    <FaTrello className="w-[24px] h-[24px] min-w-[24px]" />
                                    <span className={`overflow-hidden transition-all ${isExpanded ? "ml-3 w-auto opacity-100" : "w-0 opacity-0"} text-[12px]`}>
                                        Trello
                                    </span>
                                </Link>
                            </li>

                            {/* People Button (Only if project.isGroup is true) */}
                            {project?.isGroup && (
                                <li onClick={() => setSelectedItem("people")}>
                                    <Link
                                        href={`/home/project/${id}/people`}
                                        className={`flex justify-center items-center p-2 rounded-lg cursor-pointer w-full transition-all ${
                                            lastPath === "people" ? "bg-primaryDark text-white" : "hover:bg-gray-200"
                                        } ${isExpanded ? "gap-x-6" : "gap-x-0"}`}
                                    >
                                        <MdOutlinePeopleAlt className="w-[24px] h-[24px] min-w-[24px]" />
                                        <span className={`overflow-hidden transition-all ${isExpanded ? "ml-3 w-auto opacity-100" : "w-0 opacity-0"} text-[12px]`}>
                                            People
                                        </span>
                                    </Link>
                                </li>
                            )}

                            {/* Settings Button (Only for Authorized Users) */}
                            <li onClick={() => isAuthorized && setSelectedItem("settings")}>
                                <Link
                                    href={isAuthorized ? `/home/project/${id}/settings` : "#"}
                                    className={`flex justify-center items-center p-2 rounded-lg cursor-pointer w-full transition-all ${
                                        lastPath === "settings" ? "bg-primaryDark text-white" : "hover:bg-gray-200"
                                    } ${isExpanded ? "gap-x-5" : "gap-x-0"} ${!isAuthorized ? "cursor-not-allowed opacity-50" : ""}`}
                                    onClick={(e) => !isAuthorized && e.preventDefault()} // Prevent click if not authorized
                                >
                                    <IoSettingsOutline className="w-[24px] h-[25px] min-w-[25px]" />
                                    <span className={`overflow-hidden transition-all ${isExpanded ? "ml-3 w-auto opacity-100" : "w-0 opacity-0"} text-[12px]`}>
                                        Settings
                                    </span>
                                </Link>
                            </li>

                            {/* Note Button */}
                            {/* <li onClick={() => setSelectedItem("note")}>
                                <Link
                                    href={`/home/project/${id}/note`}
                                    className={`flex justify-center items-center p-2 rounded-lg cursor-pointer w-full transition-all ${
                                        selectedItem === "note" ? "bg-primaryDark text-white" : "hover:bg-gray-200"
                                    } ${isExpanded ? "gap-x-9" : "gap-x-0"}`}
                                >
                                    <LuNotebookPen className="w-[24px] h-[24px] min-w-[24px]" />
                                    <span className={`overflow-hidden transition-all ${isExpanded ? "ml-3 w-auto opacity-100" : "w-0 opacity-0"} text-[12px]`}>
                                        Note
                                    </span>
                                </Link>
                            </li> */}

                            {/* Meet Button (Only if project.isGroup is true) */}
                            {project?.isGroup && (
                                <li onClick={() => setSelectedItem("conference")}>
                                    <Link
                                        href={`/home/project/${id}/meetSpace`}
                                        className={`flex justify-center items-center p-2 rounded-lg cursor-pointer w-full transition-all ${
                                            lastPath === "meetSpace" ? "bg-primaryDark text-white" : "hover:bg-gray-200"
                                        } ${isExpanded ? "gap-x-9" : "gap-x-0"}`}
                                    >
                                        <MdOutlineVideoCameraFront className="w-[25px] h-[25px] min-w-[24px]" />
                                        <span className={`overflow-hidden transition-all ${isExpanded ? "ml-3 w-auto opacity-100" : "w-0 opacity-0"} text-[12px]`}>
                                            Meet
                                        </span>
                                    </Link>
                                </li>
                            )}

                            {/* Chat Button (Only if project.isGroup is true) */}
                            {project?.isGroup && (
                                <li onClick={() => setSelectedItem(selectedItem === "chat" ? null : "chat")}>
                                    {selectedItem !== "chat" && (
                                        <button
                                            className={`flex justify-center items-center p-2 rounded-lg cursor-pointer w-full transition-all ${
                                                selectedItem === "chat" ? "bg-primaryDark text-white" : "hover:bg-gray-200"
                                            } ${isExpanded ? "gap-x-9" : "gap-x-0"}`}
                                        >
                                            <IoChatbubblesOutline className="w-[24px] h-[25px] min-w-[25px]" />
                                            <span className={`overflow-hidden transition-all ${isExpanded ? "ml-3 w-auto opacity-100" : "w-0 opacity-0"} text-[12px]`}>
                                                Chat
                                            </span>
                                        </button>
                                    )}
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Chat UI inside Sidebar - Always Visible when Chat is Open */}
                    {selectedItem === "chat" && (
                        <div className="flex-1 flex flex-col">
                            <ChatUI />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ProjectSidebar;






// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useParams, usePathname } from "next/navigation";
// import { FaTrello } from "react-icons/fa";
// import { MdOutlinePeopleAlt } from "react-icons/md";
// import { IoSettingsOutline } from "react-icons/io5";
// import { IoChatbubblesOutline } from "react-icons/io5";
// import { MdOutlineVideoCameraFront } from "react-icons/md";
// import ChatUI from "@/app/home/project/[id]/chat/page";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/redux/app/store";
// import { getSocket } from "@/socket/socket";
// import { setOnlineUsers, updateUserStatus } from "@/redux/features/chatSlice";

// interface SidebarProps {
//   setSidebarExpanded: (expanded: boolean) => void;
// }

// interface Member {
//   _id: string;
//   userId: {
//     _id: string;
//     avatar?: string;
//     firstName?: string;
//     lastName?: string;
//     userProfession?: string;
//   };
// }

// function ProjectSidebar({ setSidebarExpanded }: SidebarProps) {
//   const params = useParams<{ id: string }>();
//   const pathname = usePathname(); // Get the current URL
//   const id = params?.id ?? "";

//   // Extract last part of the URL to determine the selected item
//   const pathParts = pathname.split("/");
//   const lastPath = pathParts[pathParts.length - 1];

//   const [selectedItem, setSelectedItem] = useState<string | null>(null);

//   const [isExpanded, setIsExpanded] = useState(false);
//   const user = useSelector((state: RootState) => state.auth?.user);
//   const { project } = useSelector((state: RootState) => state.project);
//   const dispatch = useDispatch();

//   // Check user role in project
//   const loggedInMember = project?.joinedMembers?.find(
//     (m: Member) => m?.userId?._id?.toString() === user?.id?.toString()
//   );

//   const isAuthorized =
//     loggedInMember?.role === "Founder" || loggedInMember?.role === "Lead";

// //   useEffect(() => {
// //     const socket = getSocket();

// //     if (user?.id) {
// //       socket.emit("userOnline", user.id);
// //     }

// //     socket.on("onlineUsers", (users) => {
// //       dispatch(setOnlineUsers(users));
// //     });

// //     socket.on("userStatusUpdate", ({ userId, isOnline }) => {
// //       dispatch(updateUserStatus({ userId, isOnline }));
// //     });

// //     return () => {
// //       socket.off("userStatusUpdate");
// //       socket.off("onlineUsers");
// //     };
// //   }, [dispatch, user?.id]);


// useEffect(() => {
//     const socket = getSocket();
  
//     if (user?.id) {
//       socket.emit("userOnline", user.id);
//     }
  
//     const handleOnlineUsers = (users: string[]) => {
//       dispatch(setOnlineUsers(users));
//     };
  
//     const handleUserStatusUpdate = ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
//       dispatch(updateUserStatus({ userId, isOnline }));
//     };
  
//     // Ensure previous listeners are removed before adding new ones
//     socket.off("onlineUsers", handleOnlineUsers);
//     socket.off("userStatusUpdate", handleUserStatusUpdate);
  
//     socket.on("onlineUsers", handleOnlineUsers);
//     socket.on("userStatusUpdate", handleUserStatusUpdate);
  
//     return () => {
//       socket.off("userStatusUpdate", handleUserStatusUpdate);
//       socket.off("onlineUsers", handleOnlineUsers);
//     };
//   }, [dispatch, user?.id]);

//   return (
//     <>
//       {/* Sidebar */}
//       <div
//         className={`fixed flex flex-col right-0 top-0 h-screen pt-[85px] bg-pureWhite shadow-[2px_0px_10px_3px_rgba(0,0,0,0.11)] text-textColor transition-all  
//             ${isExpanded ? "w-[210px]" : "w-16"}
//         `}
//         onMouseEnter={() => {
//           setIsExpanded(true);
//           setSidebarExpanded(true);
//         }}
//         onMouseLeave={() => {
//           setIsExpanded(false);
//           setSidebarExpanded(false);
//         }}
//       >
//         <div className="flex flex-col h-screen">
//           <div>
//             <p
//               className={`text-[14px] text-gray-400 mt-4 ml-2 font-bold font-poppins mb-4 ${
//                 isExpanded ? "px-6" : "px-2"
//               }`}
//             >
//               Tools
//             </p>
//             <ul className="space-y-4">
//               {/* Trello Button */}
//               <li>
//                 <Link
//                   href={`/home/project/${id}`}
//                   className={`flex justify-center items-center p-2 rounded-lg cursor-pointer w-full transition-all ${
//                     lastPath === id ? "bg-primaryDark text-white" : "hover:bg-gray-200"
//                   } ${isExpanded ? "gap-x-8" : "gap-x-0"}`}
//                 >
//                   <FaTrello className="w-[24px] h-[24px] min-w-[24px]" />
//                   <span
//                     className={`overflow-hidden transition-all ${
//                       isExpanded ? "ml-3 w-auto opacity-100" : "w-0 opacity-0"
//                     } text-[12px]`}
//                   >
//                     Trello
//                   </span>
//                 </Link>
//               </li>

//               {/* People Button (Only if project.isGroup is true) */}
//               {project?.isGroup && (
//                 <li>
//                   <Link
//                     href={`/home/project/${id}/people`}
//                     className={`flex justify-center items-center p-2 rounded-lg cursor-pointer w-full transition-all ${
//                       lastPath === "people"
//                         ? "bg-primaryDark text-white"
//                         : "hover:bg-gray-200"
//                     } ${isExpanded ? "gap-x-6" : "gap-x-0"}`}
//                   >
//                     <MdOutlinePeopleAlt className="w-[24px] h-[24px] min-w-[24px]" />
//                     <span
//                       className={`overflow-hidden transition-all ${
//                         isExpanded ? "ml-3 w-auto opacity-100" : "w-0 opacity-0"
//                       } text-[12px]`}
//                     >
//                       People
//                     </span>
//                   </Link>
//                 </li>
//               )}

//               {/* Settings Button (Only for Authorized Users) */}
//               <li>
//                 <Link
//                   href={isAuthorized ? `/home/project/${id}/settings` : "#"}
//                   className={`flex justify-center items-center p-2 rounded-lg cursor-pointer w-full transition-all ${
//                     lastPath === "settings"
//                       ? "bg-primaryDark text-white"
//                       : "hover:bg-gray-200"
//                   } ${isExpanded ? "gap-x-5" : "gap-x-0"} ${
//                     !isAuthorized ? "cursor-not-allowed opacity-50" : ""
//                   }`}
//                   onClick={(e) => !isAuthorized && e.preventDefault()}
//                 >
//                   <IoSettingsOutline className="w-[24px] h-[25px] min-w-[25px]" />
//                   <span
//                     className={`overflow-hidden transition-all ${
//                       isExpanded ? "ml-3 w-auto opacity-100" : "w-0 opacity-0"
//                     } text-[12px]`}
//                   >
//                     Settings
//                   </span>
//                 </Link>
//               </li>

//               {/* Meet Button (Only if project.isGroup is true) */}
//               {project?.isGroup && (
//                 <li>
//                   <Link
//                     href={`/home/project/${id}/meetSpace`}
//                     className={`flex justify-center items-center p-2 rounded-lg cursor-pointer w-full transition-all ${
//                       lastPath === "meetSpace"
//                         ? "bg-primaryDark text-white"
//                         : "hover:bg-gray-200"
//                     } ${isExpanded ? "gap-x-9" : "gap-x-0"}`}
//                   >
//                     <MdOutlineVideoCameraFront className="w-[25px] h-[25px] min-w-[24px]" />
//                     <span
//                       className={`overflow-hidden transition-all ${
//                         isExpanded ? "ml-3 w-auto opacity-100" : "w-0 opacity-0"
//                       } text-[12px]`}
//                     >
//                       Meet
//                     </span>
//                   </Link>
//                 </li>
//               )}

//                             {project?.isGroup && (
//                                  <li onClick={() => setSelectedItem(selectedItem === "chat" ? null : "chat")}>
//                                      {selectedItem !== "chat" && (
//                                          <button
//                                              className={`flex justify-center items-center p-2 rounded-lg cursor-pointer w-full transition-all ${
//                                                  selectedItem === "chat" ? "bg-primaryDark text-white" : "hover:bg-gray-200"
//                                              } ${isExpanded ? "gap-x-9" : "gap-x-0"}`}
//                                          >
//                                              <IoChatbubblesOutline className="w-[24px] h-[25px] min-w-[25px]" />
//                                              <span className={`overflow-hidden transition-all ${isExpanded ? "ml-3 w-auto opacity-100" : "w-0 opacity-0"} text-[12px]`}>
//                                                  Chat
//                                              </span>
//                                          </button>
//                                      )}
//                                  </li>
// /                             )}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default ProjectSidebar;
