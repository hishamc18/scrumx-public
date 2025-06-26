import { useState } from "react";
import { MdAutoDelete } from "react-icons/md";

interface DeleteModalProps {
  projectName: string;
  userName: string;
  memberCount: number;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteProjectModal: React.FC<DeleteModalProps> = ({
  projectName,
  onClose,
  userName,
  onDelete,
  memberCount,
}) => {
  const [confirmationText, setConfirmationText] = useState("");

  const isConfirmed =
    confirmationText === `sudo ${userName ?? ""}/${projectName ?? ""}`;

  return (
    <div className="fixed inset-0 flex z-[9999] items-center justify-center bg-primaryDark bg-opacity-20 ">
      <div className="bg-offWhite text-black py-5 rounded-xl w-[530px] h-[300px] border-black">
        <div className="flex justify-between items-center border-black border-b pb-2">
          <h2 className="text-[14px] font-semibold px-5">
            Delete {userName}/{projectName}
          </h2>
          <button
            className="text-primaryDark bg-yellow-300 rounded-full w-[17px] h-[17px] flex items-center justify-center mr-2"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="mt-8 text-center flex flex-col items-center border-black border-b pb-3">
          <MdAutoDelete className="text-[22px] mb-2" />
          <h3 className="text-[15px] font-semibold">
            {userName}/{projectName}
          </h3>
          <p className="text-[13px]">{memberCount} People</p>
        </div>

        {/* Confirmation Input */}
        <div className="mt-4 text-sm text-black">
          <p className="px-5 text-[14px] font-semibold ">
            To confirm, type “sudo {userName}/{projectName}” in the box below
          </p>
          <input
            type="text"
            className="mt-2 ml-3 px-3 mx-auto w-[503px] h-[26px] py-2 rounded-full text-[11px] border border-red-500 bg-black text-white"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
          />
        </div>

        {/* Delete Button */}
        <button
          className={`mt-4 ml-3 p-3 rounded-lg  bg-[#202830] w-[503px] h-[29px] font-bold text-[#8A3E3D] flex items-center justify-center text-[12px] ${
            isConfirmed
              ? "bg-red-800 hover:bg-red-700 text-white"
              : "bg-red-900"
          }`}
          disabled={!isConfirmed}
          onClick={onDelete}
        >
          Delete this project
        </button>
      </div>
    </div>
  );
};

export default DeleteProjectModal;
