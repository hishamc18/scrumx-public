"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import AddProject from "../../components/AddProjectModal/AddProjectModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/app/store";
import { getProjects } from "@/redux/features/projectSlice";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

interface JoinedMembers {
    userId: {
        _id: string;
        avatar?: string;
        firstName?: string;
        lastName?: string;
        userProfession?: string;
    };
    role: string;
    _id: string;
}
interface Project {
    _id: string;
    name: string;
    description: string;
    image: string;
    isGroup: boolean;
    joinedMembers: JoinedMembers[];
    invitedMembers: string[];
}

const Page = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(getProjects());
    }, [dispatch]);
    const allProjects = useSelector((state: RootState) => state.project.allProjects);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isIndividual, setIsIndividual] = useState(false);
    const { status } = useSelector((state: RootState) => state.project);

    if (status == "loading") {
        return <Loader />;
    }

    return (
        <div className="bg-offWhite p-8 overflow-y-auto scrollbar-hidden">
            {/* title part */}
            <div className="bg-primaryDark rounded-2xl px-8 md:px-12 h-36 shadow-[0px_4px_4px_rgba(0,0,0,1)]">
                <p className="text-pureWhite sm:text-4xl pt-8 font-semibold md:text-5xl">Welcome to ScrumX</p>
                <p className="text-pureWhite px-1 py-2">Where teams click & create magic!</p>
            </div>
            {/* "Group project" */}
            <Section
                title="Group Projects"
                projects={allProjects.filter((project) => project.isGroup == true)}
                openModal={() => {
                    setIsIndividual(false);
                    setIsModalOpen(true);
                }}
            />

            {/* Individual project */}
            <Section
                title="Individual Projects"
                projects={allProjects.filter((project) => project.isGroup == false)}
                openModal={() => {
                    setIsIndividual(true);
                    setIsModalOpen(true);
                }}
            />

            {/* project modal */}
            <AddProject
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDispatch={() => dispatch(getProjects())}
                isIndividual={isIndividual}
            />
        </div>
    );
};

// card
interface SectionProps {
    title: string;
    projects: Project[];
    openModal: () => void;
}

// first part project
const Section: React.FC<SectionProps> = ({ title, projects, openModal }) => {
    return (
        <>
            <p className="text-lg font-poppins text-primaryDark font-semibold mt-10">{title}</p>
            <div className="flex bg-offWhite space-x-5 mt-5 pb-4 overflow-x-auto scrollbar-hidden">
                {/* Create new projecct */}
                <div
                    className="flex-none w-[204px] h-[313px] rounded-xl py-6 px-3 bg-pureWhite shadow-[0px_4px_4px_rgba(0,0,0,0.25)] cursor-pointer"
                    onClick={openModal}
                >
                    <div className="flex justify-between">
                        <p className="text-md text-primaryDark font-poppins font-bold">Create Project</p>
                        <div className="flex h-6 w-6 bg-primaryDark rounded-full justify-center items-center shadow-[0px_4px_4px_rgba(0,0,0,1)]">
                            <FaPlus className="text-pureWhite" />
                        </div>
                    </div>
                    <div className="my-4">
                        <Image
                            src="/CreateProject.png"
                            alt="Create a new project"
                            width={204}
                            height={150}
                            className="rounded-md"
                        />
                    </div>
                    <p className="text-sm font-poppins text-primaryDark font-bold text-center">Bring Your Ideas to Life!</p>
                </div>

                {/* project map */}
                {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                ))}
            </div>
        </>
    );
};

interface ProjectCardProps {
    project: Project;
}

// project card
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const router = useRouter();

    const handleClick = (productId: string) => {
        router.push(`home/project/${productId}`);
    };

    return (
        <div
            className="flex-none w-[204px] h-[313px] cursor-pointer rounded-xl py-6 px-3 bg-pureWhite shadow-[0px_4px_4px_rgba(0,0,0,0.25)] group"
            onClick={() => handleClick(project._id)}
        >
            <div className="flex justify-between">
                <p className="text-md text-primaryDark font-poppins font-bold">{project.name}</p>
                <div className="flex h-6 w-6">
                    <IoIosArrowForward className="text-primaryDark" />
                </div>
            </div>
            <p className="text-sm font-poppins text-gray-700 mt-2 line-clamp-2 group-hover:hidden">
                {project.description.length > 80 ? `${project.description.substring(0, 80)}...` : project.description}
            </p>
            <div className="relative my-4 h-[150px] w-full">
                <Image
                    src={project.image}
                    alt={project.name}
                    width={204}
                    height={150}
                    className="rounded-md transition-opacity duration-300 group-hover:opacity-0"
                />
                <p className="absolute inset-0 p-2 font-poppins text-gray-700 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-justify break-words">
                    {project.description.length > 210 ? `${project.description.substring(0, 210)}...` : project.description}
                </p>
            </div>
        </div>
    );
};

export default Page;
