"use client";
import React, { useState } from "react";
import HomeCard from "./HomeCard";
import { format } from "date-fns";
import Loader from "@/components/Loader";
import { showToast } from "@/utils/toastUtils";

import MeetingModal from "./MeetingModal";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import ReactDatePicker from "react-datepicker";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/app/store";
import {
  fetchProjectScopes,
  sendMeetingInviteLinks,
} from "@/redux/features/streamSlice";
import "react-datepicker/dist/react-datepicker.css";
type FormValues = {
  dateTime: Date | null;
  description: string;
  link: string;
};

const initialValues: FormValues = {
  dateTime: null,
  description: "",
  link: "",
};

const MeetingTypeList = () => {
  const pathname = usePathname();
  const params = useParams() ?? {}; // Ensure params is always an object
  const { id }: { id?: string | string[] } = params;
  const projectId = Array.isArray(id) ? id[0] : id;

  // const projectId = Array.isArray(id) ? id[0] : id;
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const client = useStreamVideoClient();
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >(undefined);

  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const [loading, setLoading] = useState<boolean>(false);

  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      setLoading(true);
      const CallId = crypto.randomUUID(); //projectId(scrumX)
      const call = client.call("default", CallId);
      if (!call) throw new Error("Failed to create meeting");
      const startsAt = values.dateTime
        ? new Date(values.dateTime).toISOString()
        : new Date(Date.now()).toISOString();
      const description = values.description || "Instant Meeting";
      const projectScopes = await dispatch(
        fetchProjectScopes(projectId)
      ).unwrap();
      const projectName = projectScopes.projectName;
      const allowedUsers = projectScopes.projectMembersIds;
      const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/home/project/${id}/meetSpace/meeting/${call.id}`;
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
            allowedUsers,
            meetingLink,
            projectName,
            projectId,
          },
        },
      });
      setCallDetail(call);

      if (!values.description) {
        router.push(`meetSpace/meeting/${call.id}`);
      }
      await dispatch(
        sendMeetingInviteLinks({
          projectId: id,
          inviteLink: meetingLink,
          meetingDescription: description,
          meetingDate: startsAt,
        })
      );
      showToast("Meeting Created", "success");
      setTimeout(() => {
        showToast("Invitation sended", "success");
      }, 1000);
      setValues({ dateTime: null, description: "", link: "" });

      setLoading(false);
    } catch (error) {
      console.error(error);
      showToast("Failed to create Meeting", "error");
    }
  };
  if (!user || !client) return <Loader />;
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/home/project/${id}/meetSpace/meeting/${callDetail?.id}`;
  if (loading) {
    return <Loader />;
  }
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/instantMeeting.png"
        className="bg-[#24457a]"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
      />
      <HomeCard
        img="/icons/scheduleMeeting.png"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-pureWhite border-2 text-primaryDark flex-none  rounded-xl py-6 px-3  shadow-[0px_4px_4px_rgba(0,0,0,0.25)] group"
        handleClick={() => setMeetingState("isScheduleMeeting")}
      />
      <HomeCard
        img="/icons/join.png"
        title="Join Meeting"
        description="via invitation link"
        className="bg-primaryDark border-2  rounded-xl py-6 px-3   "
        handleClick={() => setMeetingState("isJoiningMeeting")}
      />

      <HomeCard
        img="/icons/recordings.png"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-orange-400"
        handleClick={() => router.push(`${pathname}/recordings`)}
      />

      {/* is instant meeting modal check: endMeeting callDetails should be empty*/}
      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Meet Now"
        buttonText="Get going"
        handleClick={createMeeting}
      ></MeetingModal>

      {/* is Schedule meeting modal */}
      {!callDetail ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Book a meeting slot"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-offWhite font-normal leading-[22.4px] text-sky-2">
              Add a description
            </label>
            <Textarea
              placeholder=" Description...."
              className="border-none bg-dark-3 text-textColor focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
              onChange={(e) =>
                setValues({
                  ...values,
                  description: e.target.value || "schedule Meeting",
                })
              }
            />
          </div>
          <div className="flex w-full text-textColor flex-col gap-2.5">
            <label className="text-base text-offWhite font-normal leading-[22.4px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              placeholderText={format(new Date(), "MMMM d, yyyy h:mm aa")}
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              minDate={new Date()} // Disable past dates
              minTime={new Date()} // Disable past times for today
              maxTime={new Date(new Date().setHours(23, 59))}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full h-8 rounded-md bg-white p-3 text-textColor placeholder:text-gray-400 focus:outline-none border border-[#2D2D4A] shadow-md"
              calendarClassName="bg-[#161625] text-white border border-[#2D2D4A] shadow-xl rounded-lg"
              dayClassName={(date) =>
                date.getDay() === 0 || date.getDay() === 6
                  ? "text-[#FF6363] font-semibold" // Subtle red for weekends
                  : "text-white"
              }
              popperClassName="bg-[#1A1A2E] text-textColo border border-[#2D2D4A] shadow-xl rounded-md"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={async () => {
            await setMeetingState(undefined);
            setTimeout(() => {
              setCallDetail(undefined);
            }, 100);
          }}
          title="Meeting Created"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            showToast("Link Copied", "success");
          }}
          image={"/icons/checked.svg"}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Meeting Link"
        />
      )}
      {/* isJoinMeeting modal */}
      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 text-textColor focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
