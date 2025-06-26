"use client";
import React, { useState, useEffect ,useCallback} from "react";
import TrelloColumn from "@/components/trello/Trello_Column";
import { TiTick } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskToTrello,
  updateTaskStatus,
  fetchTasks,
  fetchStatuses,
  renameStatus,
  addColumn,
  deleteStatus,
  deleteTask,
  updateTasks,
} from "../../../redux/features/personalSlice";
import { AppDispatch, RootState } from "../../../redux/app/store";
import Loader from "@/components/Loader";

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
  interface DragResult {
    source: { droppableId: string; index: number };
    destination: { droppableId: string; index: number } | null; 
    draggableId: string;
  }

const Page: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, statuses,loading } = useSelector((state: RootState) => state.trello);
  const [newColumn, setNewColumn] = useState<boolean>(false);
  const [columnName, setColumnName] = useState<string>("");
  const role = "Founder";
  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchStatuses());
  }, [dispatch]);

  //add new columns
  const handleAddColumn = () => {
    const trimmedColumn = columnName.trim().toLowerCase();
    if (!trimmedColumn) return;
    if (statuses.includes(trimmedColumn)) {
      return;
    }
    dispatch(addColumn(trimmedColumn));
    setColumnName("");
    setNewColumn(false);
  };

  //delete the columns
  const deleteColumn = (status: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the column "${status}"? This will also remove all associated tasks.`
      )
    ) {
      dispatch(deleteStatus({ status }));
    }
  };

  // rename the coloumns
  const renameColumn = (oldStatus: string, newStatus: string) => {
    if (statuses.includes(newStatus)) {
      return;
    }
    dispatch(renameStatus({ oldStatus, newStatus }));
  };

  //add new task
  const addTask = (status: string, task: addtask) => {
    dispatch(addTaskToTrello({ ...task, status }));
  };

  //delete task
  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };
  const assignTasks=useCallback(()=>{},[])
  //Drag and Drop
  const onDragEnd = (result: DragResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;
    const newStatus = destination.droppableId;
    dispatch(updateTaskStatus({ taskId: draggableId, newStatus }));
  };


  //update task
   const handleUpdateTask = useCallback(
        (formData: FormData) => {
            dispatch(updateTasks(formData));
        },
        [dispatch]
    );
  if(loading){
    return <Loader/>
  }

  return (
    <div className="h-screen bg-pureWhite">
      <DragDropContext
        onDragEnd={
          role === "Founder" || role === "Assignee" || role === "Lead"
            ? onDragEnd
            : () => {}
        }
      >
        <div className="flex gap-5 h-full overflow-x-auto p-8 scrollbar-hidden">
          {statuses.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <TrelloColumn
                    key={status}
                    role={role}
                    status={status}
                    tasksList={tasks.filter((task) => task.status === status) as Task[]}
                    onDelete={deleteColumn}
                    onRename={renameColumn}
                    onAddTask={addTask}
                    onDeleteTask={handleDelete}
                    onUpdateTask={handleUpdateTask}
                    member={[]}
                    assignTasks={assignTasks}
                    statuses={statuses}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
          {newColumn ? (
            <div className="flex flex-col items-center w-72 h-full gap-2 bg-lightDark p-3 rounded-lg">
              <input
                id="column"
                name="column"
                type="text"
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
                placeholder="Enter column name"
                className="bg-transparent px-2 py-1 rounded-md focus:outline-none "
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
          )}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Page;
