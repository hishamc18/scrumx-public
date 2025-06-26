/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Call, CallRecording } from "@stream-io/video-react-sdk";
import Loader from "../Loader";
import { useGetCalls } from "@/hooks/useGetCalls";
import MeetingCard from "./MeetingCard";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";

interface ExtendedCallRecording extends CallRecording {
    meetingDescription?: string; // Optional if it's not always present
    duration?: string;
}

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" | "onGoing" }) => {
    const router = useRouter();
    const [refreshTrigger, setRefreshTrigger] = useState(0); 
    const handleRefresh = () => {
        setRefreshTrigger((prev) => prev + 1); 
    };
    const { upcomingCalls, callRecordings, isLoading,onGoingCalls } = useGetCalls(refreshTrigger);
    const [recordings, setRecordings] = useState<ExtendedCallRecording[]>([]);
   
    const params = useParams() ?? {}; 
    const { id }: { id?: string | string[] } = params; 

    
    console.log(refreshTrigger);
    const { user } = useSelector((state: RootState) => state.auth);

    const getCalls = () => {
        switch (type) {
            case "recordings":
                return recordings;
            case "upcoming":
                return upcomingCalls;
            case"onGoing":
             return onGoingCalls
            default:
                return [];
        }
    };

    const getNoCallsMessage = () => {
        switch (type) {
            case "upcoming":
                return "No Upcoming Calls";
            case "onGoing":
                    return "No On Going Calls";
            case "recordings":
                return "No Recordings";
            default:
                return "";
        }
    };

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const callData = await Promise.all(
                    callRecordings?.map(async (meeting) => {
                        const data = await meeting.queryRecordings();
                        return {
                            ...data,
                            projectName: meeting.state.custom.projectName,
                            meetingDescription: meeting.state.custom.description,
                            projectId: meeting.state.custom.projectId,
                        };
                    }) ?? []
                );

                const calls = callData.filter((call) => call.recordings.length > 0).filter((call) => call.projectId == id);
                const flattenedRecordings = calls.flatMap((call) =>
                    call.recordings.map((recording) => ({
                        ...recording,
                        projectId: call.projectId,
                        duration: call.duration,
                        meetingDescription: call.meetingDescription,
                    }))
                );
                setRecordings(flattenedRecordings);
            } catch (error) {
                console.log(error);
            }
        };

        if (type === "recordings") {
            fetchRecordings();
        }
    }, [type,refreshTrigger,recordings]);

    if (isLoading) return <Loader />;

    const calls = getCalls();
    console.log(calls,"rerender")
    const noCallsMessage = getNoCallsMessage();

    return (
        <div key={calls?.length ||noCallsMessage } className="grid grid-cols-1 gap-1 xl:grid-cols-4  mr-12  text-offWhite">
            {calls && calls.length > 0 ? (
                calls.map((meeting: Call | CallRecording) => (
                    <MeetingCard
                        key={(meeting as Call).id}
                        icon={type === "upcoming" ? "/icons/telephone.png" : "/icons/logo.svg"}
                        title={
                            (meeting as Call).state?.custom?.projectName ||
                            (meeting as ExtendedCallRecording)?.meetingDescription?.substring(0, 20) ||
                            "Unnamed project"
                        }
                        description={(meeting as Call).state?.custom?.description}
                        duration={(meeting as ExtendedCallRecording)?.duration}
                        date={
                            (meeting as Call).state?.startsAt?.toLocaleString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                            }) ||
                            new Date((meeting as CallRecording)?.start_time)?.toLocaleString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                            })
                        }
                        time={
                            (meeting as Call).state?.startsAt?.toLocaleString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            }) ||
                            new Date((meeting as CallRecording).start_time)?.toLocaleString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            })
                        }
                        isPreviousMeeting={type === "ended"}
                        link={
                            type === "recordings"
                                ? (meeting as CallRecording).url
                                : `${(meeting as Call).state?.custom?.meetingLink}`
                        }
                        buttonIcon1={type === "recordings" ? "/icons/play.png" : undefined}
                        buttonText={type === "recordings" ? "Play" : "Join"}
                        handleClick={
                            type === "recordings"
                                ? () => router.push(`${(meeting as CallRecording).url}`)
                                : () => router.push(`${(meeting as Call).state?.custom?.meetingLink}`)
                        }
                        isScheduleEnd={(meeting as Call) ?.state?.createdBy?.id === user?.id}
                        meeting={(meeting as Call)}
                        handleRefresh={handleRefresh}
                    />
                ))
            ) : (
                <h1 className="text-md opacity-50 ml-6 font-semibold text-textColor">{noCallsMessage}</h1>
            )}
        </div>
    );
};

export default CallList;