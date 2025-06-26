import React from "react";
import { Field, ErrorMessage } from "formik";

interface InputFieldProps {
    name: string;
    id: string;
    type?: string;
    className?: string;
    placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ name, id, type = "text", className = "", placeholder = "" }) => {
    return (
        <div className="mb-4">
            <Field
                name={name}
                id={id}
                type={type}
                placeholder={placeholder}
                className={`border border-primaryDark bg-offWhite font-poppins text-sm px-3 py-2 rounded-xl w-full text-primaryDark
             placeholder-placeholder focus:outline-none active:outline-none ${className}`}
            />
            {/* <ErrorMessage name={name} component="div" className="text-red-700 text-[12px] mt-1" /> */}
            <div className="text-red-700 text-[12px] mt-1 ml-1 h-[10px] flex items-center">
                <ErrorMessage name={name} component="div" />
            </div>
        </div>
    );
};

export default InputField;
