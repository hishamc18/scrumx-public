import React, { useState } from "react";
import { useField, useFormikContext } from "formik";
import { Eye, EyeOff } from "lucide-react";

interface LoginInputFieldProps {
  name: string;
  id: string;
  type?: string;
  className?: string;
  placeholder?: string;
}

const LoginInputField: React.FC<LoginInputFieldProps> = ({
  name,
  id,
  type = "text",
  className = "",
  placeholder = "",
}) => {
  const { submitCount } = useFormikContext();
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const showError = meta.error && (meta.touched || submitCount > 0);
  const isPasswordField = type === "password";

  return (
    <div className="relative mb-4">
      <input
        {...field}
        id={id}
        type={isPasswordField && showPassword ? "text" : type}
        placeholder={showError ? meta.error : placeholder}
        className={`border bg-pureWhite font-poppins font-medium text-sm px-3 py-[10px] rounded-xl w-full text-primaryDark
          placeholder-placeholder focus:outline-none active:outline-none 
          ${
            showError
              ? "border-red-500 text-red-700 placeholder-red-500"
              : "border-gray-300"
          } ${className}`}
      />

      {/* Eye Icon for Password Fields */}
      {isPasswordField && (
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

export default LoginInputField;
