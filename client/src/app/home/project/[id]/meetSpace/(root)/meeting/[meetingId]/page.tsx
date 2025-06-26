'use client';

import { useState } from 'react';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';

import { useGetCallById } from '@/hooks/useGetCallById';
import Alert from '@/components/streamVideo/Alert';
import MeetingSetup from '@/components/streamVideo/MeetingSetup';
import MeetingRoom from '@/components/streamVideo/MeetingRoom';
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/app/store';

const MeetingPage = () => {
  
  const params = useParams();

  const user = useSelector((state: RootState) => state.auth.user);
  const id = typeof params?.meetingId === "string" ? params.meetingId : "";
  const { call, isCallLoading } = useGetCallById(id);
  
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (!user || isCallLoading) return <Loader />;

  if (!call) return (
    <p className="text-center text-3xl font-bold text-white">
      Call Not Found
    </p>
  );
  const notAllowed =  (!user || !call.state.custom.allowedUsers.find((m:string) => m === user.id));

  if (notAllowed){
    console.log("not allowed")

    return <Alert title="You are not allowed to join this meeting" />;
  } 
console.log("allowed")
  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>

        {!isSetupComplete ? (
          <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
        ) : (
          <MeetingRoom />
        )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;