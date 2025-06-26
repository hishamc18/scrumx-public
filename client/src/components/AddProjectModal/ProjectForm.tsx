import React, { useState } from "react";
import { Field, ErrorMessage, FormikProps } from "formik";
import Image from "next/image";

const imageOptions = [
  "/Angry-Photoroom.png",
  "/Credit-Card.jpg",
  "/Hello-Photoroom.png",
  "/Welcome-removebg-preview.png",
];

interface FormValues {
  name: string;
  description: string;
  image: string;
}
interface Props {
  setFieldValue: FormikProps<FormValues>["setFieldValue"];
}

const ProjectForm: React.FC<Props> = ({ setFieldValue }) => {
  const [selectedImage, setSelectedImage] = useState(imageOptions[0]);

  return (
    <>
      <div className="flex flex-row justify-between gap-2 pt-3">
        <label htmlFor="name" className="text-sm text-primaryDark">
          Name
        </label>
        <Field
          name="name"
          placeholder="Title Your Masterpiece"
          className="border-2 border-gray-300 bg-offWhite font-poppins text-sm px-3 py-2 w-[280px] h-[28px] rounded-xl  text-primaryDark
            placeholder-placeholder focus:outline-none active:outline-none "
        />
      </div>
      <ErrorMessage
        name="name"
        component="div"
        className="text-red-500 text-sm"
      />

      <div>
        <label htmlFor="description" className="text-sm text-primaryDark">
          Description
        </label>
        <Field
          as="textarea"
          name="description"
          placeholder="Describe your project..."
          className="resize-none border-2 text-sm border-gray-300 bg-offWhite mt-2 px-3 py-2 rounded-xl w-full text-primaryDark placeholder-placeholder focus:outline-none min-h-[80px]"
        />
        <ErrorMessage
          name="description"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      <div className="mb-2">
        <label className="text-sm text-gray-900">Select an Image</label>
        <div className="flex mt-1 justify-between space-x-2 overflow-x-auto scrollbar-none">
          {imageOptions.map((image, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedImage(image);
                setFieldValue("image", image);
              }}
            >
              <Image
                src={image}
                alt="project-image"
                width={50}
                height={50}
                className={`w-16 h-16 p-1 border-2 cursor-pointer rounded-lg ${
                  selectedImage === image
                    ? "border-primaryDark"
                    : "border-gray-300"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectForm;
