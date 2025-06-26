"use client";
import { useEffect, useCallback, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/app/store";
import {
    fetchStatuses,
    addStatus,
    renameStatus,
    deleteStatus,
    fetchProjectTasks,
    addProjectTaskToTrello,
    deleteProjectTask,
    editProjectTask,
    DragAndDropProjectTask,
    assignTask,
} from "@/redux/features/projectTrello";
import TrelloColumn from "@/components/trello/Trello_Column";
import { getNewUserData } from "@/redux/features/authSlice";
import { TiTick } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { getProjectById } from "@/redux/features/projectSlice";
import Loader from "@/components/Loader";

interface JoinedMember {
    userId: {
        _id: string;
        avatar: string;
        email: string;
        firstName: string;
        lastName: string;
        userProfession: string;
    };
    role: string;
    _id: string;
}

interface Project {
    _id?: string;
    name: string;
    description: string;
    image: string;
    isGroup: boolean;
    joinedMembers: JoinedMember[];
    invitedMembers: string[];
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

interface AddTask {
    title: string;
    category: string;
    priority: string;
}
interface DragResult {
    source: { droppableId: string; index: number };
    destination: { droppableId: string; index: number } | null;
    draggableId: string;
}

export default function DetailsPage() {
    const params = useParams<{ id: string }>();
    const projectId = params?.id ?? "";
  const dispatch = useDispatch<AppDispatch>();



  const user = useSelector((state: RootState) => state.auth.user);
  // const loading = useSelector((state: RootState) => state.auth.loading);
  const { tasks, statuses } = useSelector((state: RootState) => state.projectTrello);
  const project: Project | null = useSelector((state: RootState) => state.project.project);
  const status= useSelector((state: RootState) => state.project.status);

    const [newColumn, setNewColumn] = useState(false);
    const [columnName, setColumnName] = useState("");
    const [selectedAssignee, setSelectedAssignee] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const role = project?.joinedMembers?.find((m) => m.userId._id === user?.id)?.role || null;

    useEffect(() => {
        if (!projectId) return;
        dispatch(getProjectById(projectId));
        dispatch(fetchStatuses(projectId));
        dispatch(getNewUserData());
        dispatch(fetchProjectTasks({ projectId, assigneeid: selectedAssignee || "" }));
    }, [projectId, selectedAssignee, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDelete = useCallback(
        (status: string) => {
            if (
                window.confirm(
                    `Are you sure you want to delete the column "${status}"? This will also remove all associated tasks.`
                )
            ) {
                dispatch(deleteStatus({ projectId, status }));
            }
        },
        [projectId, dispatch]
    );

    const handleRename = useCallback(
        (oldStatus: string, newStatus: string) => {
            if (statuses.includes(newStatus)) {
                return;
            }
            dispatch(renameStatus({ projectId, oldStatus, newStatus }));
        },
        [projectId, dispatch, statuses]
    );

    const handleAddTask = useCallback(
        (status: string, task: AddTask) => {
            dispatch(addProjectTaskToTrello({ ...task, status, projectId }));
        },
        [projectId, dispatch]
    );

    const assignTasks = useCallback(
        (taskId: string, assignee: string) => {
            dispatch(assignTask({ taskId, assignee }));
        },
        [dispatch]
    );

    const handleDeleteTask = useCallback(
        (taskId: string) => {
            dispatch(deleteProjectTask(taskId));
        },
        [dispatch]
    );

    const handleUpdateTask = useCallback(
      (formData: FormData) => {
          dispatch(editProjectTask(formData));
      },
      [dispatch]
  );

    const onDragEnd = (result: DragResult) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId) return;

        const newStatus = destination.droppableId;

        dispatch(DragAndDropProjectTask({ taskId: draggableId, newStatus })).then(() => {
            dispatch(fetchProjectTasks({ projectId, assigneeid: selectedAssignee || "" }));
        });
    };

    const handleAddColumn = () => {
        if (!columnName.trim()) return;
        dispatch(addStatus({ projectId, trimmedColumn: columnName.trim() }));
        setColumnName("");
        setNewColumn(false);
    };

    if (status == "loading") {
        return <Loader />;
    }

    const selectedUser = project?.joinedMembers?.find((m) => m.userId._id === selectedAssignee);

    const handleAssigneeChange = (assigneeId: string) => {
        if (assigneeId === "project") {
            setSelectedAssignee("");
            dispatch(fetchProjectTasks({ projectId, assigneeid: null }));
            setIsOpen(false);
            return;
        }

        setSelectedAssignee(assigneeId);
        dispatch(fetchProjectTasks({ projectId, assigneeid: assigneeId }));
        setIsOpen(false);
    };
    return (
        <div className="bg-pureWhite mr-16">
            <div className="flex justify-between px-[40px] pt-[24px]">
                <p className="text-[16px] font-bold text-black px-[5px]">{project?.name}</p>
            </div>
            <div className="flex justify-between px-8 py-4">
                <h3 className="text-primaryDark font-poppins mt-6 font-semibold">Kanban Board</h3>
                <div className="relative border-2 border-placeholder rounded-2xl p-1" ref={dropdownRef}>
                    <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
                        {selectedUser ? (
                            <div>
                                <img
                                    src={selectedUser.userId.avatar}
                                    alt="profile"
                                    className="w-8 h-8 rounded-full inline-block mr-2"
                                    referrerPolicy="no-referrer"
                                />
                                <span className="text-primaryDark font-poppins">
                                    {selectedUser.userId.firstName} {selectedUser.userId.lastName}
                                </span>
                            </div>
                        ) : (
                            <span className="text-primaryDark font-poppins"> All Tasks</span>
                        )}
                    </div>

                    {isOpen && (
                        <div className="absolute -ml-[90px] border border-placeholder z-10 h-[151px] mt-4 w-48 bg-pureWhite shadow-md rounded-lg p-2 overflow-y-auto scrollbar-hidden">
                            <div
                                className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer overflow-y-auto scrollbar-hidden"
                                onClick={() => handleAssigneeChange("project")}
                            ></div>
                            <div className="absolute top-0 right-0 w-full bg-white z-20 shadow-md">
                                <div
                                    onClick={() => handleAssigneeChange("project")}
                                    className="flex cursor-pointer flex-row border-b rounded-2xl border-placeholder"
                                >
                                    <img
                                        src={project?.image}
                                        alt="projects"
                                        className="w-5 h-5 border-2 border-placeholder mt-2 ml-2 mb-2 rounded-full mr-2"
                                        referrerPolicy="no-referrer"
                                    />
                                    <p className="text-primaryDark mt-2 cursor-pointer font-semibold text-[14px]">
                                        {project?.name}
                                    </p>
                                </div>
                                {project?.joinedMembers?.map((m) => (
                                    <div
                                        key={m._id}
                                        className="flex items-center p-2 border-placeholder border-b hover:bg-gray-100 rounded cursor-pointer"
                                        onClick={() => handleAssigneeChange(m.userId._id)}
                                    >
                                        <img
                                            src={m.userId.avatar || "/default-avatar.png"}
                                            alt="profile"
                                            className="w-5 h-5 rounded-full mr-2 text-[11px]"
                                            referrerPolicy="no-referrer"
                                        />
                                        <p className="text-primaryDark text-[14px]">
                                            {m.userId.firstName} {m.userId.lastName}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-5 h-full overflow-x-auto p-8 scrollbar-hidden">
                    {statuses.map((status) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    <TrelloColumn
                                        key={status}
                                        role={role || ""}
                                        status={status}
                                        tasksList={tasks.filter((task) => task.status === status) as Task[]}
                                        onDelete={handleDelete}
                                        onRename={handleRename}
                                        onAddTask={handleAddTask}
                                        onDeleteTask={handleDeleteTask}
                                        onUpdateTask={handleUpdateTask}
                                        member={project?.joinedMembers || []}
                                        assignTasks={assignTasks}
                                        statuses={statuses}
                                    />
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}

                    {role &&
                        ["Founder", "Lead"].includes(role) &&
                        (newColumn ? (
                            <div className="flex flex-col items-center w-72 gap-2 bg-lightDark p-3 rounded-lg">
                                <input
                                    id="column"
                                    name="column"
                                    type="text"
                                    value={columnName}
                                    onChange={(e) => setColumnName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
                                    placeholder="Enter column name"
                                    className="bg-transparent px-2 py-1 rounded-md focus:outline-none text-primaryDark"
                                />
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={handleAddColumn}
                                        className="bg-transparent text-primaryDark px-4 py-2 hover:text-lightGreen"
                                    >
                                        <TiTick />
                                    </button>
                                    <button
                                        onClick={() => setNewColumn(false)}
                                        className="bg-transparent text-primaryDark px-4 py-2 hover:text-priorityRed"
                                    >
                                        <IoMdClose size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setNewColumn(true)}
                                className="bg-lightDark text-primaryDark px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 h-4 w-4 flex items-center justify-center"
                            >
                                +
                            </button>
                        ))}
                </div>
            </DragDropContext>
        </div>
    );
}