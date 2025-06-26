"use client";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaCheck, FaPlus, FaFilePdf } from "react-icons/fa";

interface Task {
  _id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  dueDate?: string;
  attachment: (string | File)[];
  projectId?: string;
  assigner?: string;
  assignee?: string;
  description?: string;
}

interface JoinedMember {
  userId: JoinUser;
  role: string;
  _id: string;
}

interface JoinUser {
  avatar: string;
  email: string;
  firstName: string;
  lastName: string;
  userProfession: string;
  _id: string;
}

interface EditTaskModalProps {
  task: Task;
  statuses: string[];
  onClose: () => void;
  onSave: (formData: FormData) => void;
  member: JoinedMember[];
  assignTasks: (taskId: string, assignee: string) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onSave, member, assignTasks, statuses }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [updatedTask, setUpdatedTask] = useState<Task>(task);
  const [editingField, setEditingField] = useState<string | null>(null);


  const handleSave = (field: keyof Task, value: string | FileList) => {
    const formData = new FormData();
    formData.append("_id", updatedTask._id);
  
    // Update the task state
    const newTask = { ...updatedTask, [field]: value };
    setUpdatedTask(newTask);
  
    // Append all fields to the formData
    Object.entries(newTask).forEach(([key, val]) => {
      if (key === "attachment" && Array.isArray(val)) {
        val.forEach((fileOrUrl) => {
          if (typeof fileOrUrl === "string") {
            formData.append("existingAttachments", fileOrUrl);
          } else {
            formData.append("attachment", fileOrUrl);
          }
        });
      } else if (key !== "_id" && val !== undefined) {
        formData.append(key, String(val));
      }
    });
  
    // Call the onSave function with the updated formData
    onSave(formData);
    setEditingField(null);
  };


  const handleRemoveAttachment = (index: number) => {
    const newAttachments = updatedTask.attachment?.filter((_, i) => i !== index) || [];
  
    const removedAttachment = updatedTask.attachment?.[index]; // Get the removed attachment
  
    const newTask = {
      ...updatedTask,
      attachment: newAttachments,
    };
  
    setUpdatedTask(newTask);
  
    const formData = new FormData();
    Object.entries(newTask).forEach(([key, value]) => {
      if (key === "attachment" && Array.isArray(value)) {
        value.forEach((fileOrUrl) => {
          if (typeof fileOrUrl === "string") {
            formData.append("existingAttachments", fileOrUrl); 
          } else {
            formData.append("attachment", fileOrUrl); 
          }
        });
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });
  
    if (removedAttachment) {
      formData.append("removedAttachments", removedAttachment); 
    }
  
    console.log(formData, "when remove from the form data");
    onSave(formData);
  };
  

  const handleAddAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newTask = {
        ...updatedTask,
        attachment: [...(updatedTask.attachment || []), ...files],
      };

      setUpdatedTask(newTask);
      const formData = new FormData();
      formData.append("_id", updatedTask._id);
     newTask.attachment.forEach((file) => {
        formData.append("attachment", file); 
      });

      console.log(formData, "adding new data..........");
      onSave(formData);
    }
  };

  const handleAssigneeChange = (assigneeId: string) => {
    assignTasks(task._id, assigneeId);
    setUpdatedTask({ ...updatedTask, assignee: assigneeId });
    setShowDropdown(false);
  };

  const founder = member.find((m) => m.role === "Founder");
  const selectedAssignee = member.find((m) => m.userId._id === updatedTask.assignee);

  return (
    <div
      className="text-primaryDark bg-black fixed inset-0 flex items-center justify-center bg-opacity-60  z-50 px-4 shadow-lg"
      onClick={onClose}
    >
      <div
        className="bg-pureWhite p-5 rounded-lg shadow-lg relative w-full max-w-lg mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Title & Close Button */}
        <div className="flex justify-between items-center pb-1 mb-2 border-b-2 border-placeholder">
          {editingField === "title" ? (
            <div className="flex items-center w-full">
              <input
                type="text"
                value={updatedTask.title}
                onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
                className="text-lg font-semibold w-full border-b outline-none px-2 py-1"
                autoFocus
              />
              <div className="flex mr-6 justify-end gap-1">
                <FaCheck
                  className="cursor-pointer text-green-600 ml-1"
                  onClick={() => handleSave("title", updatedTask.title)}
                />
                <IoMdClose
                  className="cursor-pointer text-red-500 ml-2"
                  onClick={() => setEditingField(null)}
                />
              </div>
            </div>
          ) : (
            <p className="text-lg font-semibold cursor-pointer w-full" onClick={() => setEditingField("title")}>
              {updatedTask.title}
            </p>
          )}
          <button
            className="text-primaryDark bg-yellow-300 font-semibold rounded-full w-[18px] h-[18px] -mt-1 pb-1 flex items-center justify-center mr-2"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Main Content */}
        <div>
          <div className="flex gap-5">
            {/* Left Side: Task Details */}

            <div className={`${member.length > 1 ? "w-2/3" : "w-full"} flex flex-col`}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mt-3">Description:</label>
                {editingField === "description" ? (
                  <div className="flex items-center">
                    <input
                      value={updatedTask.description || ""}
                      onChange={(e) =>
                        setUpdatedTask({
                          ...updatedTask,
                          description: e.target.value,
                        })
                      }
                      className="p-2 w-full outline-none border-2 text-[11px]"
                      autoFocus
                    />
                    <div className="flex justify-end">
                      <FaCheck
                        className="cursor-pointer text-[13px] text-green-500 ml-2"
                        onClick={() => handleSave("description", updatedTask.description || "")}
                      />
                      <IoMdClose
                        className="cursor-pointer text-[13px] text-red-500 ml-2"
                        onClick={() => setEditingField(null)}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className="p-2 cursor-pointer focus:border text-[11px]"
                    onClick={() => setEditingField("description")}
                  >
                    {updatedTask.description || "Click to edit"}
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-1">Category:</label>
                  {editingField === "category" ? (
                    <div className="flex items-center">
                      <input
                        value={updatedTask.category || ""}
                        onChange={(e) =>
                          setUpdatedTask({ ...updatedTask, category: e.target.value })
                        }
                        className="text-[11px] p-2 rounded w-full outline-none"
                        autoFocus
                      />
                      <FaCheck
                        className="cursor-pointer text-green-500 ml-2"
                        onClick={() => handleSave("category", updatedTask.category || "")}
                      />
                      <IoMdClose
                        className="cursor-pointer text-red-500 ml-2"
                        onClick={() => setEditingField(null)}
                      />
                    </div>
                  ) : (
                    <div
                      className="text-[11px] focus:border rounded cursor-pointer"
                      onClick={() => setEditingField("category")}
                    >
                      {updatedTask.category || "Click to edit"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Priority:</label>
                  <select
                    value={updatedTask.priority || "low"}
                    onChange={(e) => handleSave("priority", e.target.value)}
                    className="text-[11px] p-2 rounded-tr-2xl rounded-bl-2xl border-placeholder w-[100px] cursor-pointer border-2  outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between gap-5 mt-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Status:</label>
                  <select
                    value={updatedTask.status}
                    onChange={(e) => handleSave("status", e.target.value)}
                    className="outline-none border-2 border-placeholder text-[11px] p-2 rounded-tr-2xl rounded-bl-2xl w-full cursor-pointer"
                  >
                    {statuses?.map((status) => (
                      <option key={status} value={status}>
                        {status.replace("-", " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Due Date:</label>
                  <input
                    type="date"
                    value={updatedTask.dueDate || ""}
                    onChange={(e) => handleSave("dueDate", e.target.value)}
                    className="border-2 border-placeholder outline-none p-2 rounded w-[100px] rounded-tr-2xl rounded-bl-2xl cursor-pointer text-[11px]"
                  />
                </div>
              </div>
            </div>
            {/* Right Side: Assignee & Founder */}
            {member.length > 1 && (
              <div className="w-1/3 pl-4 relative">
                <h3 className="text-sm font-semibold">Assigned To:</h3>
                <div
                  className="flex items-center gap-2 mt-2 cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {selectedAssignee ? (
                    <div className="ml-2 w-[200px] flex gap-2 items-center">
                      <img
                        src={selectedAssignee.userId.avatar}
                        alt="profile"
                        className="w-8 h-8 rounded-full"
                      />
                      <p className="text-sm">
                        {selectedAssignee.userId.firstName} {selectedAssignee.userId.lastName}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Select Assignee</p>
                  )}
                </div>
                {showDropdown && (
                  <div className="absolute top-16 left-0 w-[200px] bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                    {member.map((m) => (
                      <div
                        key={m._id}
                        className="flex items-center gap-2 p-2 border-b-2 rounded-2xl hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleAssigneeChange(m.userId._id)}
                      >
                        <img src={m.userId.avatar} alt="profile" className="w-6 h-6 rounded-full" />
                        <p className="text-sm">
                          {m.userId.firstName} {m.userId.lastName}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {founder && (
                  <div className="mt-12">
                    <h3 className="text-sm font-semibold">Founder:</h3>
                    <div className="flex items-center gap-2 p-2 ">
                      <img
                        src={founder.userId.avatar}
                        alt="profile"
                        className="w-8 h-8 rounded-full"
                      />
                      <p className="text-sm">
                        {founder.userId.firstName} {founder.userId.lastName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="my-4">
            <p className="text-sm font-semibold mb-1">Attachments:</p>
            <div className="flex gap-2 flex-wrap mb-2 h-20  overflow-y-auto scrollbar-hidden ">
              {updatedTask.attachment?.map((attachment, index) => {
                const isFileObject = attachment instanceof File;
                const fileUrl = isFileObject ? URL.createObjectURL(attachment) : attachment;
                const isImage = fileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i);

                return (
                  <div key={index} className="relative">
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                      {isImage ? (
                        <img
                          src={fileUrl}
                          alt="attachment"
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-2 border rounded bg-gray-100 w-20 h-20 justify-center">
                          <FaFilePdf className="text-red-500 text-3xl" />
                        </div>
                      )}
                    </a>
                    <IoMdClose
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 cursor-pointer"
                      onClick={() => handleRemoveAttachment(index)}
                    />
                  </div>
                );
              })}
            </div>

            <label className="p-2 rounded flex items-center gap-2 cursor-pointer">
              <FaPlus className="text-[11px]" /> <span className="text-[11px]">Add Attachment</span>
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleAddAttachment}
                accept="image/*,application/pdf"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;