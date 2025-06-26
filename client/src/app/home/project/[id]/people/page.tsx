"use client";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/app/store";
import InvitesPeople from "@/components/ProjectPeople/InvitesPeople";
import { useParams } from "next/navigation";
import { getProjectById } from "@/redux/features/projectSlice";
import MemberDetailsModal from "@/components/Project/MemberDetailsModal";
import InviteMemberDetailsModal from "@/components/Project/InviteMemberDetailsModal";


interface Member {
  _id?: string;
  userId: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    avatar?: string;
    userProfession?: string;
  };
  role: string;
}

const defaultMember = {
  _id: "",
  userId: { _id: "", firstName: "Unknown", lastName: "", email: "N/A" },
  role: "Unknown",
};

function ProjectPeople() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedInvitedMember, setSelectedInvitedMember] = useState<
    string | null
  >(null);

  const dispatch = useDispatch<AppDispatch>();
  const { project, status } = useSelector((state: RootState) => state.project);
  const { user } = useSelector((state: RootState) => state.auth);
  const params = useParams<{ id: string }>();
    const projectId = params?.id ?? "";

  console.log(status, "staus");
  useEffect(() => {
    dispatch(getProjectById(projectId));
  }, [dispatch, projectId]);

    console.log(project, "nifras", projectId);

  // Filter Joined Members
  const filteredJoinedMembers =
    project?.joinedMembers?.filter(
      (member: Member) =>
        `${member?.userId?.firstName} ${member?.userId?.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        member?.userId?.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // Filter Invited Members
    const filteredInvitedMembers =
        project?.invitedMembers?.filter((email: string) => email.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  //  open modal
  const openModal = (member: Member) => {
    const loggedInMember = project?.joinedMembers?.find(
      (m) => m?.userId?._id?.toString() === user?.id?.toString()
    );

        if (!loggedInMember) {
            return;
        }

        if (loggedInMember.role === "Contributor") {
            return;
        }

        // Leads cannot open a modal for Founders
        if (loggedInMember.role === "Lead" && member.role === "Founder") {
            return;
        }

        // Founder & Lead can open modals for other members but not their own
        if (
            (loggedInMember.role === "Founder" || loggedInMember.role === "Lead") &&
            loggedInMember?.userId?._id === member?.userId?._id
        ) {
            return;
        }

        // Founder & Lead can open other members' modals
        if (loggedInMember.role === "Founder" || loggedInMember.role === "Lead") {
            setSelectedMember(member);
            setIsModalOpen(true);
        }
    };

  //  close modal
  const closeModal = () => {
    setSelectedMember(null);
    setIsModalOpen(false);
  };
  // if(status=="loading"){
  //   return <Loader/>
  // }
  const openInviteModal = (email: string) => {
    const loggedInMember = project?.joinedMembers?.find(
      (m: Member) => m?.userId?._id?.toString() === user?.id?.toString()
    );

    if (!loggedInMember) return;
    if (loggedInMember.role === "Contributor") return;

    if (loggedInMember.role === "Founder" || loggedInMember.role === "Lead") {
      setSelectedInvitedMember(email);
      setIsInviteModalOpen(true);
    }
  };

  // invitedMembers close modal
  const closeInviteModal = () => {
    setSelectedInvitedMember(null);
    setIsInviteModalOpen(false);
  };

    return (
        <div
            className={`bg-pureWhite h-[calc(100vh-811px  transition-all`}
        >
            <div className="flex justify-between text-textColor pt-[24px] px-[40px]">
                <div>
                    <h1 className="text-[20px] font-semibold">{project?.name}</h1>
                </div>
            </div>

            <div className="relative w-full px-[40px] pt-3">
                <div className="w-[33px] h-[33px]   flex items-center justify-center absolute left-10">
                    <IoSearch className="text-textColor" />
                </div>
                <input
                    type="text"
                    placeholder="Search for Members"
                    className="w-[218px] h-[33px] pl-[50px] rounded-full focus:outline-none bg-gray-100 placeholder:text-[11px]  text-textColor"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <p className="text-textColor pl-[40px] pt-9 text-[12px] font-semibold">Team Members</p>

      <div className="mt-4 pt-2 h-[328px] overflow-y-auto scrollbar-hidden ">
        <table className="w-full border-collapse ">
          <tbody>
            {/* Joined Members */}
            {filteredJoinedMembers.length > 0 ? (
              filteredJoinedMembers.map((member: Member, index: number) => (
                <tr
                  key={index}
                  onClick={() => openModal(member)}
                  className={`cursor-pointer ${
                    project?.joinedMembers?.find(
                      (m: Member) => m?.userId?._id === user?.id
                    )?.role === "Contributor"
                      ? "cursor-not-allowed"
                      : ""
                  }`}
                >
                  {/* Avatar, Name, Email in One Cell */}
                  <td className="px-8 py-2 flex items-center  text-textColor">
                    <img
                      src={member.userId.avatar}
                      alt="profile"
                      referrerPolicy="no-referrer"
                      className="w-[37px] h-[38px] bg-gray-300 rounded-full"
                    />
                    <div className="ml-3">
                      <h4 className="text-[12px] font-semibold">
                        {member?.userId?.firstName} {member?.userId?.lastName}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {member?.userId?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-2 text-[14px] text-textColor">
                    {member?.role}
                  </td>
                  <td className="px-6 py-2  text-textColor text-[14px] ">
                    <div className="flex items-center">
                      <span className="w-[8px] h-[8.47px] rounded-full bg-green-500 mr-2 "></span>
                      Active
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center text-gray-500 py-4">
                  No team members found.
                </td>
              </tr>
            )}

            {/* Invited Members */}
            {filteredInvitedMembers.length > 0 &&
              filteredInvitedMembers.map((email: string, index: number) => (
                <tr
                  key={index}
                  onClick={() => openInviteModal(email)}
                  className="cursor-pointer"
                >
                  {/* Avatar, Name, Email in One Cell */}
                  <td className="px-8 py-2 flex items-center  text-textColor">
                    <img
                      src="/Avatar.png"
                      alt="Invited User"
                      referrerPolicy="no-referrer"
                      className="w-[37px] h-[38px] bg-gray-300 rounded-full"
                    />
                    <div className="ml-3">
                      <h4 className=" font-semibold text-[12px]">
                        Invited User
                      </h4>
                      <p className="text-[11px] text-gray-500">{email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-2 text-[14px] text-textColor">
                    Contributor
                  </td>
                  <td className="px-6 py-2  text-[14px] text-textColor">
                    <div className="flex items-center">
                      <span className="w-[8px] h-[8.47px] rounded-full bg-orange-500 mr-2 "></span>
                      Pending
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <MemberDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          member={selectedMember ?? defaultMember}
          projectId={projectId}
        />

        <InviteMemberDetailsModal
          isOpen={isInviteModalOpen}
          onClose={closeInviteModal}
          invitedEmail={selectedInvitedMember}
          projectId={projectId}
        />
      </div>

            <InvitesPeople projectId={projectId} />
        </div>
    );
}
export default ProjectPeople;

