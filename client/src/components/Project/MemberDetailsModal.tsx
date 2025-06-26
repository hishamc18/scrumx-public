import React, { useEffect, useState } from "react";
import { AppDispatch } from "@/redux/app/store";
import {
  deleteMember,
  getProjectById,
  updateMemberRole,
} from "@/redux/features/projectSlice";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch } from "react-redux";
interface MemberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    _id?: string;
    userId: {
      _id?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      avatar?: string;
      userProfession?: string;
    };
    role: string;
  } ;
  projectId: string;
  
}

const MemberDetailsModal: React.FC<MemberDetailsModalProps> = ({
  isOpen,
  onClose,
  member,
  projectId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRole, setSelectedRole] = useState(member?.role ||"Contributor");
  useEffect(() => {
    if (member) {
      setSelectedRole(member.role);
    }
  }, [member]);
 
  
  useEffect(() => {
    dispatch(getProjectById(projectId));
  }, [dispatch, projectId]);

   if (!isOpen) return null;
  
  
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value);
  };
  // udate member role
  const saveRoleChange = async () => {
    await dispatch(
      updateMemberRole({
        projectId,
        memberId: member.userId._id as string,
        role: selectedRole,
      })
    );
    await dispatch(getProjectById(projectId));
    onClose();
  };
  // delete Member
  const handleDeleteMember = async () => {
    if (confirm("Are you sure you want to remove this member?")) {
      await dispatch(deleteMember({ projectId, memberId: member.userId._id as string }));
      await dispatch(getProjectById(projectId));
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center z-50 items-center">
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
            src={member?.userId?.avatar}
            alt="profile"
            referrerPolicy="no-referrer" 
            className="w-16 h-16 rounded-full border border-gray-300"
          />

          {/* Member Info */}
          <div>
            <h2 className="text-md font-semibold text-textColor">
              {member?.userId?.firstName} {member?.userId?.lastName}
            </h2>
            <p className="text-gray-500 text-xs">{member?.userId?.email}</p>
          </div>
        </div>

        {/* Role Selection */}
        <div className="mt-3 flex justify-between items-center text-textColor">
          <span className="text-gray-600 text-xs font-medium">Role:</span>
          <select
            className="border p-1 rounded-md w-[150px] text-xs bg-gray-100"
            value={selectedRole}
            onChange={handleRoleChange}
          >
            <option>Lead</option>
            <option>Contributor</option>
          </select>
        </div>

        <div className="mt-4 flex justify-between items-center">
          {/* Delete Button on Left */}
          <button
            onClick={handleDeleteMember}
            className="text-gray-500 hover:text-red-500 text-sm flex items-center gap-1"
          >
            <MdDeleteForever className="text-lg text-red-600" />
            <p className="text-red-600">Delete</p>
          </button>

          {/* Save Button on Right */}
          <button
            onClick={saveRoleChange}
            className="bg-primaryDark text-white font-poppins py-1 px-3 rounded-md text-[12px] hover:bg-primaryDark/90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailsModal;


