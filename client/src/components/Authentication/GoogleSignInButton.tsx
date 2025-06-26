import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/app/store";
import { googleOAuth } from "@/redux/features/authSlice";

export default function GoogleSignInButton() {
    const dispatch = useDispatch<AppDispatch>();

    const handleGoogleSignIn = () => {
        dispatch(googleOAuth());
    };

    return (
        <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-[100%] px-4 py-2 border  bg-primaryDark rounded-2xl shadow-sm text-white  hover:bg-gray-900 transition"
        >
            <FcGoogle className="text-2xl mr-2" />
            <span className="text-white font-regular text-sm">Sign in with Google</span>
        </button>
    );
}
