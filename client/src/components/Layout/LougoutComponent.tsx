"use client";
import React, { useEffect, useRef } from "react";
import { VscSettings } from "react-icons/vsc";
import { HiOutlineLogout } from "react-icons/hi";
import { FaXTwitter } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/app/store";
import { getNewUserData, logoutUser } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { getSocket } from "@/socket/socket";
import Loader from "../Loader";
function LougoutComponent({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const menuRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    useEffect(() => {
        dispatch(getNewUserData());
    }, [dispatch]);

    const handleLogout = async () => {
        if (!user) return;
        await dispatch(logoutUser());
        const socket = getSocket();
        socket.emit("userOffline", user.id);
        socket.disconnect();
        sessionStorage.clear();
        router.push("/register");
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    if (loading) {
        <Loader />;
    }
    return (
        <>
            {isOpen && (
                <div
                    ref={menuRef}
                    // className="bg-primaryDark mt-2 text-white rounded-md w-[220px] shadow-lg mx-[1100px]"
                    className="bg-primaryDark text-white border-offWhite border-[1px] rounded-md w-[220px] shadow-lg absolute top-[85px] right-1 z-50"
                >
                    <div className="">
                        <ul className="space-y-4 p-3">
                            <li className=" cursor-pointer">
                                <div className="flex items-center space-x-2 ">
                                    <img
                                        src={user?.avatar && user.avatar.trim() !== "" ? user.avatar : "/Avatar.png"}
                                        alt="avatar"
                                        className="rounded-full w-[45px] h-[45px]"
                                    />

                                    <div className="flex flex-col">
                                        <span className="text-[12px]"> {`${user?.firstName} ${user?.lastName}`}</span>
                                        <span className="text-[11px] text-gray-300">{user?.email}</span>
                                    </div>
                                </div>
                            </li>
                            <hr className="border-gray-600" />
                            <li className="hover:bg-gray-700 px-2 py-1 cursor-pointer rounded-md text-[12px] flex items-center ">
                                <VscSettings className="mr-2 text-gray-400" /> Profile Settings
                            </li>
                            <li
                                onClick={() => {
                                    router.push("https://scrumx.vercel.app");
                                }}
                                className="hover:bg-gray-700 px-2 py-1 cursor-pointer  rounded-md text-[12px] flex items-center"
                            >
                                <FaXTwitter className="mr-2 text-gray-400" />
                                About Scrumx
                            </li>
                            <hr className="border-gray-600" />
                            <li
                                onClick={handleLogout}
                                className="hover:bg-gray-700 px-2 py-1 cursor-pointer text-[12px] flex items-center rounded-bl-md rounded-br-md p-5 "
                            >
                                <HiOutlineLogout className="transform rotate-180 mr-2 text-gray-400" />
                                Sign Out
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}

export default LougoutComponent;
