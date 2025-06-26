import React, { useState, useRef, useEffect } from "react";
import { TiAttachment } from "react-icons/ti";
import EditTaskModal from "./editCard";
import { FaEdit, FaUserCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

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

interface TaskCardProps {
  task: Task;
  statuses: string[];
  onDeleteTask: (id: string) => void;
  // onUpdateTask: (updatedTask: Task) => void;
  onUpdateTask: (formData: FormData) => void;
  member: JoinedMember[];
  role: string;
  assignTasks: (taskId: string, assignee: string) => void;
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

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDeleteTask,
  onUpdateTask,
  member,
  role,
  assignTasks,
  statuses,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editCard, setEditCard] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [assignee, setAssignee] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  const handleEdit = () => {
    setEditCard(true);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (task?.dueDate) {
      const updateTimeRemaining = () => {
        const dueDate = task?.dueDate ? new Date(task.dueDate) : null;
        if (dueDate) {
          const currentDate = new Date();
          const diffInMs = dueDate.getTime() - currentDate.getTime();
          const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
          const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
          if (diffInMs < 0) {
            setTimeRemaining("Time Exceeded");
          } else {
            setTimeRemaining(diffInDays > 0 ? `${diffInDays} days` : `${diffInHours} hours`);
          }
        } else {
          setTimeRemaining(null); 
        }
        
      };

      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 1000 * 60); // Update every minute

      return () => clearInterval(interval);
    }
  }, [task.dueDate]);

  const assignedUser = member.find((m) => m.userId._id === task.assignee);

  return (
    <div
      className="text-black"
      onMouseEnter={() => setMenuOpen(true)}
      onMouseLeave={() => setMenuOpen(false)}
    >
      <div className="flex justify-between items-center">
          <p className="text-sm mr-12 font-bold">{task.title.length > 13 ?`${task.title.slice(0, 13)}...` : task.title}</p>

        <div className="flex items-center gap-2 relative">
          {task.attachment?.length ? (
            <TiAttachment className="cursor-pointer text-xl" />
          ) : null}
        </div>

        {role && ["Founder", "Lead"].includes(role) && menuOpen && (
          <>
            <FaEdit className="text-primaryDark cursor-pointer" onClick={handleEdit} />
            <MdDelete
              className="text-primaryDark cursor-pointer"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this task?")) {
                  onDeleteTask(task._id);
                }
              }}
            />
          </>
        )}
      </div>

      <div className="flex gap-3 mt-4">
        {task.category && (
          <p className="text-[11px] font-poppins rounded-md bg-lightDark px-2 h-5">
{task.category.length > 22 ? `${task.category.slice(0, 22)}..`: task.category}
          </p>
        )}
        {task.priority && (
          <p
            className={`text-[10px] font-semibold font-poppins h-[16px] rounded-md px-2 flex items-center justify-center ${
              task.priority.toLowerCase() === "high"
                ? "bg-priorityRed text-white"
                : task.priority === "medium"
                ? "bg-priorityMedium text-primaryDark"
                : "bg-priorityLow text-primaryDark"
            }`}
          >
            {task.priority}
          </p>
        )}
      </div>

      <div className="flex justify-between">
        {member.length > 1 && (
          <div className="flex items-center gap-2 mt-3">
            <div className="relative">
              {task.assignee && assignedUser ? (
                <div
                  className="flex items-center justify-center rounded-full text-sm font-bold text-pureWhite cursor-pointer"
                  onClick={() => ["Founder", "Lead"].includes(role) && setAssignee((prev) => !prev)}
                >
                  <img
                    src={assignedUser.userId.avatar}
                    alt="profile"
                    className="w-7 h-7 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div
                  className="w-8 h-8 flex items-center justify-center border-gray-400 rounded-full cursor-pointer"
                  onClick={() => ["Founder", "Lead"].includes(role) && setAssignee((prev) => !prev)}
                >
                  <FaUserCircle className="w-7 h-7" />
                </div>
              )}

              {assignee && ["Founder", "Lead"].includes(role) && (
                <div className="absolute mt-2 border rounded-md bg-white shadow-lg w-[150px] max-h-32 overflow-y-auto z-30">
                  {member.map((m) => (
                    <button
                      key={m._id}
                      className="flex items-center border-b-2 rounded-2xl gap-2 p-2 hover:bg-gray-100 w-full text-left"
                      onClick={() => {
                        assignTasks(task._id, m.userId._id);
                        setAssignee(false);
                      }}
                    >
                      <img
                        src={m.userId.avatar}
                        alt="profile"
                        className="w-5 h-5 rounded-full"
                        referrerPolicy="no-referrer"
                      />
                      <p className="text-[11px]">{m.userId.firstName} {m.userId.lastName}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {task.status !== "done" && task.dueDate && (
          <div className="flex justify-end mt-3">
            <p className="flex justify-center items-center p-1 text-[11px] text-pureWhite font-semibold bg-[#00BFA6] rounded-md font-poppins">
              {timeRemaining || "Loading..."}
            </p>
          </div>
        )}
      </div>

      {editCard && (
        <EditTaskModal
          task={task}
          onClose={() => setEditCard(false)}
          onSave={onUpdateTask}
          member={member}
          assignTasks={assignTasks}
          statuses={statuses}
        />
      )}
    </div>
  );
};

export default TaskCard;