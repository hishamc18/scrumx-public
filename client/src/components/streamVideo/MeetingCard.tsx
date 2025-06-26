"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

import ScheduleEndCallButton from "./ScheduleEndCallButton";
import { Call } from "@stream-io/video-react-sdk";
import { showToast } from "@/utils/toastUtils";

interface MeetingCardProps {
    title: string;
    description?: string;
    duration?: string;
    date: string;
    isScheduleEnd: boolean;
    time: string;
    icon: string;
    handleRefresh: () => void;
    isPreviousMeeting?: boolean;
    buttonIcon1?: string;
    buttonText?: string;
    meeting: Call;
    handleClick: () => void;
    link: string;
}

const MeetingCard = ({
    icon,
    title,
    isScheduleEnd,
    description,
    date,
    time,
    duration,
    isPreviousMeeting,
    meeting,
    buttonIcon1,
    handleClick,
    handleRefresh,
    link,
    buttonText,
}: MeetingCardProps) => {
    return (
        <section className="flex scale-90 min-h-[350px] w-[280px] flex-col items-center justify-between rounded-[20px] bg-primaryDark px-6 py-8 hover:scale-105 transition ease-in-out duration-300 shadow-lg">
            <article className="flex flex-col items-center  w-full">
                <Image src={icon} alt="upcoming" width={60} height={60} className="mb-4" />
                <div className="text-center w-full">
                    <h1 className="text-2xl font-bold">{title.charAt(0)?.toUpperCase() + title.slice(1)}</h1>
                    {description && (
                        <h2 className="text-sm text-gray-300 mt-2">
                            Context: {description.charAt(0)?.toUpperCase() + description.slice(1)}
                        </h2>
                    )}
                    {duration && <h2 className="text-sm text-gray-300 mt-1">Meeting Duration: {duration}</h2>}
                    <p className="text-sm text-gray-400 mt-2">
                        Date: <span className="font-normal">{date}</span>
                    </p>
                    <p className="text-sm text-gray-400">
                        Time: <span className="font-normal">{time}</span>
                    </p>
                </div>
            </article>

            <article className={cn("flex flex-col items-center w-full gap-3 mt-6", {})}>
                {!isPreviousMeeting && (
                    <div className="flex flex-col gap-2 w-full">
                        <Button
                            onClick={handleClick}
                            className="bg-[#0094FF] text-white w-full py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
                        >
                            {buttonIcon1 && <Image src={buttonIcon1} alt="feature" width={16} height={16} />}
                            &nbsp; {buttonText}
                        </Button>
                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(link);
                                showToast("Link Copied");
                            }}
                            className="bg-[#f5e7e7] text-textColor w-full py-2 rounded-md hover:bg-offWhite transition-all duration-300"
                        >
                            <Image src="/icons/copy.svg" alt="feature" width={20} height={20} />
                            &nbsp; Copy Link
                        </Button>
                        {!duration && <ScheduleEndCallButton meeting={meeting} handleRefresh={handleRefresh} isScheduleEnd={isScheduleEnd} />}
                    </div>
                )}
            </article>
        </section>
    );
};

export default MeetingCard;