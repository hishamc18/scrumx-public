'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';

import { Button } from './ui/button';
import { usePathname, useRouter } from 'next/navigation';

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();
  const pathname = usePathname();

  if (!call)
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
console.log(localParticipant,"local-endButton")
console.log(call,"call-endButton")
  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => {
    await call.endCall();
    const newPath = pathname.split('/').slice(0, -2).join('/') || '/';
    router.push(newPath);
  };

  return (
    <Button onClick={endCall} className="bg-red-500">
      End call for everyone
    </Button>
  );
};

export default EndCallButton;