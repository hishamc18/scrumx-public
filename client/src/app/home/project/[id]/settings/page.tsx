"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState, AppDispatch } from "../../../../../redux/app/store";
import {
  getProjectById,
  updateProject,
  deleteProject,
  getProjects,
} from "@/redux/features/projectSlice";
import DeleteProjectModal from "../../../../../components/AddProjectModal/DeleteProjectModal";


interface Member {
  _id: string;
  userId: {
    _id: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
    userProfession?: string;
  };
}
interface FormData {
  _id?: string;
  name: string;
  description: string;
  image?: string;
  isGroup?: boolean;
  joinedMembers?: Member[];
  invitedMembers?: string[];
}

const ProjectDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Get the project ID from the URL
  const params = useParams<{ id: string }>();
  const projectId = params?.id ?? "";

  const { project } = useSelector((state: RootState) => state.project);
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  useEffect(()=>{
    if(projectId){
      dispatch(getProjectById(projectId))
    }
  },[dispatch, projectId])

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
      });
    }
  }, [project]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!project) return;

    const updatedProject = {
      ...project,
      name: formData.name,
      description: formData.description,
    };

    dispatch(updateProject({ projectId, formData: updatedProject }))
      .unwrap()
      .then(() => {
        dispatch(getProjectById(projectId));
      })
      .catch((error) => {
        console.error("Update failed:", error);
      });
  };

  // Handle project deletion
  const handleDelete = async () => {
    dispatch(deleteProject(projectId))
      .unwrap()
      .then(() => {
        dispatch(getProjects());
        router.push("/home");
      })
      .catch((error) => {
        console.error("Delete failed:", error);
      });
  };

  return (
    <div
      className={`bg-pureWhite h-[calc(100vh-81px)] transition-all`}
    >
      <div className="flex justify-between px-[40px] pt-[24px]">
        <p className="text-[16px] font-bold text-black px-[5px]">
          {project?.name}
        </p>
      </div>

      <div className="px-8 py-6">
        <label className="block text-black font-semibold text-[13px]">
          Project Name
        </label>
        <div className="px-[6px] py-[10px]">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-[250px] h-[30px] p-3 text-placeholder text-[11px] border border-black rounded-md"
          />
        </div>
      </div>

      <div className="px-8">
        <label className="block text-black font-semibold text-[13px]">
          Description
        </label>
        <div className="px-[6px] py-[10px]">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-[765px] p-3 text-placeholder border border-black rounded-md resize-none outline-none focus:outline-none h-[125px] max-h-32 overflow-y-auto text-[13px]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            rows={4}
          ></textarea>
        </div>
        <button
          onClick={handleUpdate}
          className="bg-lightBlue text-white text-[11px] w-[90px] h-[25px] rounded-lg transition duration-200"
        >
          Save
        </button>
      </div>

      {/* Delete Section */}
      <div className="flex mr-14 justify-between mt-6 p-9">
        <div className="flex flex-col">
          <h3 className="text-[14px] font-semibold text-black">
            Delete this project
          </h3>
          <p className="text-[12px] text-black">
            Once you delete a project, there is no going back. Please be
            certain.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#D72638] text-white text-[13px] font-semibold px-5 py-2 mr-6 rounded-lg transition duration-200"
        >
          Delete this Project
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <DeleteProjectModal
          projectName={project?.name || "Untitled Project"}
          userName={user?.firstName || "Unknown User"}
          memberCount={project?.joinedMembers?.length || 0}
          onDelete={handleDelete}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
