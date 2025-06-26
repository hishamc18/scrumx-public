"use client"
import { useEffect, useState } from 'react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { RootState } from '@/redux/app/store';
import { useSelector } from 'react-redux';

export const useGetCalls = (refreshTrigger: number) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const client = useStreamVideoClient();
  const [calls, setCalls] = useState<Call[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user?.id) return;
      
      setIsLoading(true);

      try {
       
const { calls } = await client.queryCalls();

        setCalls(calls);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalls();
  }, [client, user?.id,refreshTrigger])
  const onGoingCalls = calls
  ?.filter(call => { 
    const allowedUsers = call.state.custom.allowedUsers || [];
    const startsAt = call.state.startsAt ? new Date(call.state.startsAt) : null;
    const endedAt = call.state.endedAt ? new Date(call.state.endedAt) : null;
    const now = new Date();

    return (
      allowedUsers.includes(user?.id) && //allowed users
      startsAt && startsAt <= now &&  // Call should start in the future
      (!endedAt || endedAt > now)    // Call should not have ended
    );
  })
  .sort((a, b) => 
    new Date(a.state.startsAt || 0).getTime() - new Date(b.state.startsAt || 0).getTime()
  );

  const upcomingCalls = calls
  ?.filter(call => { 
    const allowedUsers = call.state.custom.allowedUsers || [];
    const startsAt = call.state.startsAt ? new Date(call.state.startsAt) : null;
    const endedAt = call.state.endedAt ? new Date(call.state.endedAt) : null;
    const now = new Date();

    return (
      allowedUsers.includes(user?.id) && //allowed users
      startsAt && startsAt > now &&  // Call should start in the future
      (!endedAt || endedAt > now)    // Call should not have ended
    );
  })
  .sort((a, b) => 
    new Date(a.state.startsAt || 0).getTime() - new Date(b.state.startsAt || 0).getTime()
  );

  

console.log(upcomingCalls,"upcoming")
  return {  upcomingCalls,onGoingCalls, callRecordings: calls, isLoading }
};