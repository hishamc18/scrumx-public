import React, { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import { TiTick } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/app/store";
import { getNewUserData } from "@/redux/features/authSlice";

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

interface addtask {
  title: string;
  category: string;
  priority: string;
}

interface TrelloColumnProps {
  status: string;
  tasksList: Task[];
  role: string;
  onDelete: (status: string) => void;
  onRename: (oldStatus: string, newStatus: string) => void;
  onAddTask: (status: string, task: addtask) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (formData: FormData) => void;
  member: JoinedMember[];
  assignTasks: (taskId: string, asignee: string) => void;
  statuses:string[]
}


const TrelloColumn: React.FC<TrelloColumnProps> = ({
  status,
  tasksList,
  onDelete,
  onRename,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  role,
  member,
  assignTasks,
  statuses
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(status);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState("high");
  const [category, setCategory] = useState("");
  const [buttonAddTask, setButtonAddTask] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleSubmit = () => {
    if (newTitle.trim() && newTitle !== status) {
      onRename(status, newTitle.trim());
    }
    setIsEditing(false);
  };
//  console.log(tasksList,"task list of the project ",status,"statusssss")
 
  const handleAddTask = () => {
    if (taskTitle.trim()) {
      onAddTask(status, {
        title: taskTitle,
        category,
        priority: priority.toLocaleLowerCase(),
      });
      setTaskTitle("");
      setCategory("");
      setIsAddingTask(false);
    }
  };

  useEffect(() => {
    dispatch(getNewUserData());
  }, [dispatch]);

  return (
    <div
      className="flex flex-col min-w-[270px] h-auto rounded-md text-black bg-lightDark overflow-x-auto scrollbar-hidden z-40"
      onMouseEnter={() => setButtonAddTask(true)}
      onMouseLeave={() => setButtonAddTask(false)}
    >
      <div
        className="flex justify-between items-center p-2 rounded-md sticky top-0 bg-lightDark"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex text-textColor items-center gap-3 w-full">
          {status !== "done" && role && ["Founder", "Lead"].includes(role) && isEditing ? (
            <input
              type="text"
              value={newTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
              autoFocus
              className="bg-transparent text-primaryDark outline-none px-2 py-1 rounded-md w-full"
            />
          ) : (
            <p
              className="text-md text-primaryDark font-semibold font-poppins cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
            {status.length > 27 ? `${status.slice(0, 22)}..` : status}
            </p>
          )}
        </div>
        {isHovered && role && ["Founder", "Lead"].includes(role) && status !== "done" && (
          <MdDelete
            className="text-primaryDark"
            onClick={() => {
              onDelete(status);
            }}
          />
        )}
      </div>
      <div className="flex flex-col px-3 overflow-y-auto scrollbar-hidden">
        <Droppable droppableId={status} type="task">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex-col gap-5 flex-1"
            >
              {tasksList.map((task, index) => (
                <Draggable
                  key={task._id}
                  draggableId={task._id}
                  index={index}
                  isDragDisabled={
                    !(
                      ["lead", "founder"].includes(role.toLowerCase()) || 
                      task.assignee === user?.id
                    )
                  }
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...(
                        ["lead", "founder"].includes(role.toLowerCase()) || 
                        task.assignee === user?.id
                      )
                        ? provided.dragHandleProps
                        : {}}
                      className={`relative p-3 bg-pureWhite rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mb-5 h-32 ${
                        snapshot.isDragging ? "z-50 shadow-lg" : ""
                      }`}
                    >
                      <TaskCard
                        key={task._id}
                        task={task}
                        onDeleteTask={onDeleteTask}
                        onUpdateTask={onUpdateTask}
                        member={member}
                        role={role}
                        assignTasks={assignTasks}
                        statuses={statuses}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="mt-2">
          {isAddingTask && (
            <div className="flex h-full bg-pureWhite rounded-xl flex-col shadow-md gap-2 p-2 over">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="text-[11px] bg-transparent text-primaryDark outline-none px-2 rounded-md"
                placeholder="Enter task title..."
                autoFocus
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="text-[10px] p-1 rounded-md text-primaryDark"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-[11px] bg-transparent text-primaryDark outline-none px-2 rounded-md"
                placeholder="Enter task category..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddTask}
                  className="bg-transparent text-lightGreen px-4 py-1 hover:text-primaryDark"
                >
                  <TiTick />
                </button>
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="bg-transparent text-priorityRed px-4 py-1 hover:text-primaryDark"
                >
                  <IoMdClose size={16} />
                </button>
              </div>
            </div>
          )}
          {role && ["Founder", "Lead"].includes(role) && buttonAddTask && (
            <button
              onClick={() => setIsAddingTask(true)}
              className="text-sm mb-2 text-primaryDark hover:underline bg-transparent"
            >
              + Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrelloColumn;