"use client";

// import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { tokenProvider } from "@/actions/stream.actions";
import React, { ReactNode, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();
    useEffect(() => {
        if ( !user) return;
        if (!STREAM_API_KEY) throw new Error("APi key is not provided");

        // create instance connect to streamVideo Api-------------------------------
        const videoClient = new StreamVideoClient({
            apiKey: STREAM_API_KEY,
            user: { id: user?.id || "", name: user?.firstName || user?.id, image: user?.avatar },
            tokenProvider: () => tokenProvider(user), //not static token .its dynamic token genrating
        });
        console.log("Video client created successfully", videoClient);
        // -------------------------------------------------------------------------

        setVideoClient(videoClient);

    }, [user]);

    if (!videoClient) return <Loader />;
    return <StreamVideo client={videoClient}>{children} </StreamVideo>;
};

export default StreamVideoProvider;