"use client";
import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotes, createNote, updateNote, deleteNote } from "../../../redux/features/noteSlice";
import { AppDispatch, RootState } from "../../../redux/app/store";
import Loader from "@/components/Loader";


interface Note {
  _id: string;
  title: string;
  content: string;
  backgroundColor: string;
}

const NotesApp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notes,loading } = useSelector((state: RootState) => state.notes);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState<Omit<Note, "_id">>({
    title: "",
    content: "",
    backgroundColor: "bg-pureWhite",
  });

    const colors: string[] = ["bg-pureWhite", "bg-[#0094FF]", "bg-[#323333]", "bg-[#FF6E60]", "bg-[#00BFA5]"];

  useEffect(() => {
    if(!isCreating){
      dispatch(fetchNotes());
    }
  }, [dispatch,isCreating]);
  

  // Handle note creation or update
  const handleCreateOrUpdateNote = (): void => {    
    if (newNote.title && newNote.content) {
      if (editingNote) {
        dispatch(
          updateNote({
            ...newNote,
            _id: editingNote._id,
          })
        ).then(() => {
          dispatch(fetchNotes());
        });
      } else {
        dispatch(createNote(newNote))
      }
      resetForm();
    }
  };

    // Handle note deletion
    const handleDeleteNote = (id: string) => {
        dispatch(deleteNote(id)).then(() => {
            dispatch(fetchNotes());
        });
    };

    // Reset modal and note states
    const resetForm = () => {
        setNewNote({ title: "", content: "", backgroundColor: "bg-pureWhite" });
        setIsCreating(false);
        setEditingNote(null);
    };

    // Open a note for editing
    const handleEditNote = (note: Note) => {
        setEditingNote(note);
        setNewNote({ title: note.title, content: note.content, backgroundColor: note.backgroundColor });
        setIsCreating(true);
    };
    if (loading) {
        return <Loader />;
    }
    // Notes Grid View Component
    const NotesGridView = () => (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-[54px]">
                {/* "Create Note" Card */}
                <div
                    key={"create-note"}
                    className="-z-9 flex-none w-[204px] h-[313px] rounded-xl py-6 px-3 bg-pureWhite shadow-[0px_4px_4px_rgba(0,0,0,0.25)] group relative cursor-pointer"
                    onClick={() => setIsCreating(true)}
                >
                    <div className="flex justify-between items-center">
                        <p className="text-[13px] text-primaryDark font-bold">Create Note</p>
                        <div className="flex h-7 w-7 bg-primaryDark rounded-full justify-center items-center shadow-md">
                            <FaPlus className="text-pureWhite" />
                        </div>
                    </div>
                    <div className="my-14 flex justify-center">
                        <img src="/image.png" alt="Create Note Icon" className="w-20 h-20"   referrerPolicy="no-referrer" />
                    </div>
                    <p className="text-sm font-bold text-primaryDark text-center">Stick Your Ideas!</p>
                </div>
                {notes.map((note, index) => {
                    const isWhiteBg = note.backgroundColor === "bg-pureWhite" || note.backgroundColor === "bg-white";
                    return (
                        <div
                            key={note._id || `note-${index}`}
                            className={`${note.backgroundColor} flex-none w-[204px] h-[313px] rounded-xl py-6 px-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] cursor-pointer`}
                            onClick={() => handleEditNote(note)}
                        >
                            <p className={`text-[13px] font-bold ${isWhiteBg ? "text-primaryDark" : "text-white"}`}>
                                {note.title?.slice(0,24)}
                            </p>
                            <hr className={`h-[2px] ${isWhiteBg ? "bg-gray-200" : "bg-white"} border-0 my-3`} />
                            <p
                                className={`text-[11px] mt-2 max-h-[210px] overflow-hidden ${
                                    isWhiteBg ? "text-gray-700" : "text-white"
                                }`}
                            >
                                {note.content}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="bg-offWhite overflow-auto flex flex-col items-center px-8 h-[calc(100vh-80px)] scrollbar-hidden">
            <div className="flex self-start">
                <p className="text-[20px] text-primaryDark font-bold mt-10">Notes</p>
            </div>
            <div className="mt-8 pb-4 w-full flex justify-center items-center">
                <NotesGridView />
            </div>

            {/* Modal for Creating or Editing a Note */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    {/* Sticky Note Container */}
                    <div
                        className={`relative p-8 w-[330px] min-h-[350px] shadow-xl ${newNote.backgroundColor}`}
                        style={{
                            clipPath: "polygon(0 0, 100% 0, 100% 93%, 95% 100%, 0 100%)",
                        }}
                    >
                        {/* Pin */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2">
                            <div className="w-8 h-8 bg-red-500 rounded-full shadow-md" />
                            <div className="w-4 h-4 bg-red-400 rounded-full absolute top-1 left-1" />
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={resetForm}
                            className="absolute top-2 right-2 text-2xl text-[#FF3B30] font-bold hover:text-red-700 transition-colors"
                        >
                            ×
                        </button>

                        {/* Content Area */}
                        <div className="mt-8 mb-8">
                            {/* Title Input */}
                            <input
                                type="text"
                                placeholder="Title"
                                value={newNote.title}
                                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                className="text-[24px] bg-transparent border-b-2 border-dashed border-gray-600 w-full mb-4 
            placeholder-gray-600 focus:outline-none focus:border-solid transition-all"
                                style={{
                                    color:
                                        newNote.backgroundColor === "bg-pureWhite"
                                            ? "black"
                                            : newNote.backgroundColor === "bg-[#323333]"
                                            ? "white"
                                            : "black",
                                }}
                            />

                            {/* Content Textarea */}
                            <textarea
                                placeholder="Start writing..."
                                value={newNote.content}
                                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                className="text-[14px] bg-transparent w-full h-48 resize-none placeholder-gray-600 
            focus:outline-none overflow-y-auto transition-all"
                                style={{
                                    color:
                                        newNote.backgroundColor === "bg-pureWhite"
                                            ? "black"
                                            : newNote.backgroundColor === "bg-[#323333]"
                                            ? "bg-pureWhite"
                                            : "black",
                                }}
                            />
                        </div>

                        {/* Control Bar */}
                        <div className="absolute bottom-2 left-0 right-0 px-4 flex justify-between items-center">
                            {/* Color Picker */}
                            <div className="flex gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setNewNote({ ...newNote, backgroundColor: color })}
                                        className={`w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center
                ${color} ${newNote.backgroundColor === color ? "ring-2 ring-blue-500" : ""} 
                ${
                    color === "bg-pureWhite" && newNote.backgroundColor === color
                        ? "border-2 border-blue-500 rounded-lg"
                        : ""
                }`}
                                    >
                                        {newNote.backgroundColor === color && color !== "bg-pureWhite" && (
                                            <div className="w-3 h-3 rounded-full bg-black opacity-30" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                {editingNote && (
                                    <button
                                        onClick={() => {
                                            handleDeleteNote(editingNote._id);
                                            resetForm();
                                        }}
                                        className="hover:text-red-700 text-2xl transition-colors"
                                        style={{
                                            color: newNote.backgroundColor === "bg-pureWhite" ? "#323333" : "white",
                                        }}
                                    >
                                        <MdDelete />
                                    </button>
                                )}
                                <button
                                    onClick={handleCreateOrUpdateNote}
                                    className="px-4 py-1 bg-[#0094FF] text-white rounded-[10px] shadow-md 
              hover:bg-blue-600 transition-colors text-bold scale-[0.9]"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default NotesApp;
