'use client';



import { Call } from '@stream-io/video-react-sdk';
import { Button } from './ui/button';

const ScheduleEndCallButton = ({ isScheduleEnd,meeting,handleRefresh }: { isScheduleEnd: boolean,meeting:Call ,handleRefresh: () => void; }) => {

  const endCall = async () => {
    await meeting.endCall();
    
    setTimeout(() => handleRefresh(), 100);
  };

  return (
    <Button onClick={endCall} className={`bg-red-500 text-white px-4 py-2 rounded-md transition 
      ${!isScheduleEnd ? 'opacity-50 cursor-not-allowed hover:bg-red-500' : 'hover:bg-red-600'}
    `}>
      End call for everyone
    </Button>
  );
};

export default ScheduleEndCallButton;