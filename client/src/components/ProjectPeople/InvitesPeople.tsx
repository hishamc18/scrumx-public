import { AppDispatch, RootState } from "@/redux/app/store";
import { getNewUserData } from "@/redux/features/authSlice";
import { getProjectById, sendInvite } from "@/redux/features/projectSlice";
import { showToast } from "@/utils/toastUtils";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface InvitesPeopleProps {
  projectId: string;
}

interface Member {
  _id: string;
  userId: {
    _id: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
    userProfession?: string;
  };
}

function InvitesPeople({ projectId }: InvitesPeopleProps) {
  const [email, setEmail] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const loggedInUserEmail = useSelector(
    (state: RootState) => state.auth?.user?.email
  );
  const invitedUserData = useSelector(
    (state: RootState) => state.project.invitedUser
  );

  const user = useSelector((state: RootState) => state.auth?.user);
  const { project } = useSelector((state: RootState) => state.project);

  const loggedInMember = project?.joinedMembers?.find(
      (m:Member ) => m?.userId?._id?.toString() === user?.id?.toString()
    );
  useEffect(() => {
    dispatch(getNewUserData());
    dispatch(getProjectById(projectId));
  }, [dispatch, projectId]);
  const handleAddInvite = () => {
    if (!email.trim()) {
      showToast("Enter an email address","warning");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showToast("Enter a valid email address","warning");
      return;
    }
    if (invitedUserData.some((user) => user.email === email.trim())) {
      showToast("Email already exists.","warning");
      return;
    }
    if (email.trim() === loggedInUserEmail) {
      showToast("You cannot invite yourself","warning");
      return;
    }
    dispatch(sendInvite({ projectId, email }))
      .unwrap()
      .then(() => {
        showToast("Invitation sent successfully!","warning");
        setEmail("");
        dispatch(getProjectById(projectId));
      })
      .catch((error) => {
        console.log(error, "parayu");
        showToast(`Failed to send invite: ${error.message}`);
      });
    setEmail("");
  };

  if (loggedInMember?.role !== "Founder" && loggedInMember?.role !== "Lead") {
    return null;
  }
  return (
  
    <div className="px-[40px]">
      <h3 className="text-textColor text-[14px] font-semibold pt-2">
        Invite via email
      </h3>
      <div className="space-x-8 mt-6">
        <input
          type="text"
          placeholder="Enter Member’s Email"
          className="w-[249px] h-[36px]  pl-6 focus:outline-none bg-gray-100 placeholder:text-[11px] round border-2 border-primaryDark rounded-[10px] text-textColor"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAddInvite}
          className="w-[84px] h-[35px] text-[10px] bg-primaryDark rounded-[10px] font-semibold hover:shadow-lg text-white"
        >
          Send invites
        </button>
      </div>

      <div className="bg-primaryDark text-white text-center text-[14px] font-semibold p-4 rounded-[20px] w-[589px] h-[52px] mx-auto mt-[50px]">
        Build Your Dream Team - Add the Right People, Create the Right Magic!
      </div>
    </div>
  );
}

export default InvitesPeople;
