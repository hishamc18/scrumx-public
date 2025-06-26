import { AppDispatch } from "@/redux/app/store";
import { deleteInviteMember, getProjectById } from "@/redux/features/projectSlice";
import React, { useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch } from "react-redux";

interface InviteMemberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitedEmail: string | null;
  projectId: string;
  
}

function InviteMemberDetailsModal({
  isOpen,
  onClose,
  invitedEmail,
  projectId
}: InviteMemberDetailsModalProps) {
  const dispatch = useDispatch<AppDispatch>()
 

  const handleDeleteMember = async()=>{
    if (confirm("Are you sure you want to remove this invitedMembers?")) {
     await dispatch(deleteInviteMember({projectId, email: invitedEmail as string}))
     await dispatch(getProjectById(projectId));
      onClose()
  }
}

 useEffect(() => {
    dispatch(getProjectById(projectId));
  }, [dispatch, projectId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-[300px] shadow-lg relative">
        <div className="absolute top-2 right-3 flex gap-2">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-sm"
          >
            ✖
          </button>
        </div>

        {/* Profile & Info Section */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <img
            src="/Avatar.png"
            alt="profile"
            className="w-16 h-16 rounded-full border border-gray-300"
          />

          {/* Member Info */}
          <div>
            <h2 className="text-md font-semibold text-textColor"> Invited User</h2>
            <p className="text-gray-500 text-xs">{invitedEmail}</p>
          </div>
        </div>

        {/* Role Selection */}
        <div className="mt-3 flex justify-between items-center text-textColor">
          <span className="text-gray-600 text-xs font-medium">Role:</span>
          <h6 className="border p-1 rounded-md w-[150px] text-xs bg-gray-100">Contributor</h6>
        </div>

        <div className="mt-4 flex justify-between items-center">
          {/* Delete Button on Left */}
          <button
            onClick={handleDeleteMember}
            className="text-gray-500 hover:text-red-500 text-sm flex items-center gap-1"
          >
            <MdDeleteForever className="text-lg" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default InviteMemberDetailsModal;