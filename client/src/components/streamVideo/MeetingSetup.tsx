"use client";
import { useEffect, useState } from "react";
import { DeviceSettings, VideoPreview, useCall, useCallStateHooks } from "@stream-io/video-react-sdk";

import Alert from "./Alert";
import { Button } from "./ui/button";
import Image from "next/image";

const MeetingSetup = ({ setIsSetupComplete }: { setIsSetupComplete: (value: boolean) => void }) => {
    const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
    const callStartsAt = useCallStartsAt();
    const callEndedAt = useCallEndedAt();
    const callTimeNotArrived = callStartsAt && new Date(callStartsAt) > new Date();
    const callHasEnded = !!callEndedAt;

    const call = useCall();

    if (!call) {
        throw new Error("useStreamCall must be used within a StreamCall component.");
    }

    const [isMicToggled, setIsMicCamToggled] = useState(false);
    const [isCameraToggled, setIsCameraamToggled] = useState(false);

    useEffect(() => {
        if (isMicToggled) {
            call.microphone.enable();
        } else {
            call.microphone.disable();
        }
        if (isCameraToggled) {
            call.camera.enable();
        } else {
            call.camera.disable();
        }
    }, [isMicToggled, isCameraToggled, call.camera, call.microphone]);

    if (callTimeNotArrived)
        return (
            <Alert
                title={`Your Meeting has not started yet`}
                description={`It is scheduled for ${callStartsAt.toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                })}`}
            />
        );

    if (callHasEnded) return <Alert title="The call has been ended by the host" iconUrl="/icons/call-ended.svg" />;

    return (
        <div className="flex fixed inset-0 h-screen w-full items-center justify-center  text-white   bg-[#11223e] backdrop-blur-sm z-50">
            <div className="flex flex-col gap-3 justify-center items-center">
                <VideoPreview />
                
            </div>
            <div className="flex flex-col gap-6 justify-center items-center relative left-20">
            <Image className="rounded-2xl" src={"/logo.png"} alt="scrumX" width={60} height={60} />
            <h1 className="font-bold text-2xl mb-10">scrumX CONFER SPACE</h1>
                <div className="flex  items-center justify-center gap-4  bg-[#2c2754] px-6 py-4 rounded-3xl">
                    <Image
                        onClick={() => setIsMicCamToggled((pre) => !pre)}
                        src={isMicToggled ? "/icons/micOn.png" : "/icons/noMic.png"}
                        height={40}
                        width={40}
                        alt="Mic"
                        className="transition-all duration-300 ease-in-out transform scale-105 cursor-pointer hover:scale-110 hover:opacity-80"
                    />

                    <Image
                        onClick={() => setIsCameraamToggled((pre) => !pre)}
                        src={isCameraToggled ? "/icons/videoOn.png" : "/icons/noVideo.png"}
                        height={40}
                        width={40}
                        alt="Mic"
                        className="transition-all duration-300 ease-in-out transform scale-105 cursor-pointer hover:scale-110 hover:opacity-80"
                    />

                    <DeviceSettings />
                </div>

                <Button
                    className="rounded-xl bg-[#233a5f]  px-4 py-2.5 hover:bg-primaryDark cursor-pointer transition-all duration-300 ease-in-out transform scale-105 hover:scale-110 hover:opacity-80"
                    onClick={() => {
                        call.join();
                        setIsSetupComplete(true);
                    }}
                >
                    Join meeting
                </Button>
            </div>
        </div>
    );
};

export default MeetingSetup;
