"use client";
import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { clearInvitedUser, createIndividualProject, createProject } from "@/redux/features/projectSlice";
import ProjectForm from "./ProjectForm";
import GroupSelection from "./GroupSelection";
import InviteUsers from "./InviteUsers";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/app/store";
import { showToast } from "@/utils/toastUtils";
interface ModalProps {
    isOpen: boolean;
    isIndividual: boolean;
    onClose: () => void;
    onDispatch: () => void;
}

interface createProject{
    name: string;
    description: string;
    image: string;
    isGroup: boolean;
    invitedMembers: string[];
    // joinedMembers?: Member[]; 
}
const AddProject: React.FC<ModalProps> = ({ isOpen, onClose, onDispatch, isIndividual }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isGroup, setIsGroup] = useState<boolean>(() => !isIndividual);
    const invitedUserData = useSelector((state: RootState) => state.project.invitedUser);
    console.log()
    useEffect(() => {
        setIsGroup(!isIndividual);
    }, [isIndividual]);

    if (!isOpen) return null;

    const initialValues = { name: "", description: "", image: "/Angry-Photoroom.png" };

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        description: Yup.string().required("Description is required"),
    });

    const handleDone = async (values: typeof initialValues) => {
        console.log({ ...values, invitedMembers: invitedUserData, isGroup });
        if (isGroup && invitedUserData.length === 0) {
            showToast("At least one member is required for a group project.","warning");
            return;
        }
        const projectData :createProject= { ...values, invitedMembers: invitedUserData.map((user) => user?.email?.trim()), isGroup };
        console.log(projectData,"creare project data");
        onClose();
        if (isGroup) {
            console.log("this worked");
            await dispatch(createProject(projectData));
            showToast("Project successfully created","success")
        } else {
            await dispatch(createIndividualProject(projectData));
            showToast("Project successfully created","success")
        }
        onDispatch();
        dispatch(clearInvitedUser([]));
        // setInvitedUsers([]);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
            <div className="bg-pureWhite w-[400px] p-4 rounded-lg shadow-lg relative" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold text-primaryDark">Plant the First Step</h2>
                    <button className="text-primaryDark hover:text-gray-800" onClick={onClose}>
                        <IoMdClose size={18} />
                    </button>
                </div>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleDone}>
                    {({ setFieldValue }) => (
                        <Form className="flex flex-col px-4 space-y-1">
                            <ProjectForm setFieldValue={setFieldValue} />
                            <GroupSelection isGroup={isGroup} setIsGroup={setIsGroup} />
                            {isGroup && <InviteUsers />}
                            <div className="flex justify-center py-5">
                                <button
                                    type="submit"
                                    className="flex justify-center items-center w-1/3 text-sm bg-lightBlue text-white rounded-xl hover:bg-opacity-90 h-[28px]"
                                >
                                    Done
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AddProject;
