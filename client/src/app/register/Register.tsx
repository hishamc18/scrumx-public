"use client";

import GoogleSignInButton from "@/components/Authentication/GoogleSignInButton";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import LoginInputField from "@/components/InputFields/LoginInputField";
import OtpInputField from "@/components/Authentication/OtpComponent";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/app/store";
import { checkEmailExists, sendOtp, login, forgotPassword, resetPassword } from "@/redux/features/authSlice";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updatePasswordSchema } from "@/schemas/resetPasswordSchema";



export default function Register() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const resetMode = searchParams?.get("reset") === "true";

    const { emailCheckLoading, emailExists, emailCheckError, error, loading, passwordResetSuccess, passwordResetError } =
        useSelector((state: RootState) => state.auth);

    const [showPasswordField, setShowPasswordField] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false);
    const [enteredEmail, setEnteredEmail] = useState("");
    const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
   

   

    return (
        <div className="flex flex-col justify-center items-center h-full w-full bg-white pb-14 xl-custom:w-[100%]">
            <Image src="/logo.png" width={200} height={200} priority alt="scrumX" />
            <div className="flex flex-col gap-2 w-full justify-center items-center">
                <h2 className="text-textColor font-poppins font-regular text-l">
                    <span className="font-bold">ScrumX</span>
                </h2>
                <p className="text-gray-500 font-poppins font-light text-xs">
                    {resetMode ? (
                        "Reset your password"
                    ) : showOtpField ? (
                        <>
                            Enter the OTP that has been sent to <strong className="font-bold">{enteredEmail}</strong>
                        </>
                    ) : (
                        "Welcome to ScrumX! Please enter your email."
                    )}
                </p>
            </div>

            <div className="flex flex-col gap-2 w-4/5">
                <Formik
                    initialValues={{ email: "", password: "", confirmPassword: "" }}
                    validationSchema={
                        resetMode
                            ? updatePasswordSchema
                            : Yup.object({
                                  email: Yup.string().email("Invalid email").required("Email is required"),
                              })
                    }
                    onSubmit={async (values, { setSubmitting, setFieldError }) => {

                        if (resetMode) {
                            try {
                                const token = searchParams?.get("token"); // Extract token from URL
                                if (!token) {
                                    setFieldError("password", "Invalid or missing reset token.");
                                    return;
                                }

                                const response = await dispatch(
                                    resetPassword({ token, password: values.password })
                                ).unwrap();
                                console.log(response);

                                if (response) {
                                    router.push("/home");
                                  
                                }
                            } catch (err) {
                                const errorMessage = (err as Error).message || "Something went wrong";
                                setFieldError("password", errorMessage);
                            }
                        } else {
                            if (!showPasswordField && !showOtpField) {
                                setEnteredEmail(values.email);
                                try {
                                    const response = await dispatch(checkEmailExists(values.email)).unwrap();
                                    if (response) {
                                        setShowPasswordField(true);
                                        setShowOtpField(false);
                                    } else {
                                        setShowOtpField(true);
                                        setShowPasswordField(false);
                                        dispatch(sendOtp(values.email));
                                    }
                                } catch (err) {
                                    console.error("Email check failed:", err);
                                }
                            } else if (showPasswordField) {
                                try {
                                    const response = await dispatch(
                                        login({ email: values.email, password: values.password })
                                    ).unwrap();
                                    if (response) {
                                        router.push("/home");
                                    }
                                } catch (err) {
                                    const errorMessage = (err as Error).message || "Invalid Credentials";
                                    setFieldError("password", errorMessage);
                                }
                            }
                        }
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="flex flex-col py-2">
                            {resetMode ? (
                                <>
                                    <LoginInputField id="password"  name="password" placeholder="Enter new password" type="password" />
                                    <LoginInputField id="password" 
                                        name="confirmPassword"
                                        placeholder="Confirm new password"
                                        type="password"
                                    />
                                    {passwordResetError && <p className="text-red-500 text-xs">{passwordResetError}</p>}

                                    {passwordResetSuccess && (
                                        <p className="text-green-500 text-xs">Password reset successful!</p>
                                    )}
                                </>
                            ) : (
                                <>
                                    {!showOtpField && !forgotPasswordSent && (
                                        <LoginInputField
                                            name="email"
                                            placeholder="Enter e-mail"
                                            id="email"
                                            className="mt-2"
                                        />
                                    )}
                                    {emailCheckError && <p className="text-red-500 text-xs mt-1">{emailCheckError}</p>}
                                    {emailExists && showPasswordField && !forgotPasswordSent && (
                                        <div className="relative">
                                            <LoginInputField id="password"  name="password" placeholder="Enter password" type="password" />
                                            <div className="flex justify-end mt-1">
                                                <button
                                                    type="button"
                                                    className="text-blue-500 text-xs -mt-2 mb-2 hover:underline"
                                                    onClick={async () => {
                                                        try {
                                                            await dispatch(forgotPassword(enteredEmail)).unwrap();
                                                            setForgotPasswordSent(true);
                                                        } catch (error) {
                                                            console.error("Failed to send reset email:", error);
                                                        }
                                                    }}
                                                >
                                                    Forgot Password?
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {forgotPasswordSent && (
                                        <div>
                                            <h3 className="text-center text-primaryDark mb-4 font-semibold text-[12px]">
                                                {enteredEmail}
                                            </h3>
                                            <p className="text-green-600 text-[12px] -mt-1 text-center">
                                                A verification link has been sent. Check your email to proceed.
                                            </p>
                                        </div>
                                    )}
                                    {error && showPasswordField && (
                                        <p className="text-red-500 text-xs -mt-3">Invalid Credentials</p>
                                    )}
                                    {showOtpField && <OtpInputField email={enteredEmail} />}
                                </>
                            )}

                            {/* Hide the button when OTP field is displayed */}
                            {!showOtpField && !forgotPasswordSent && (
                                <button
                                    type="submit"
                                    disabled={isSubmitting || emailCheckLoading || loading}
                                    className="w-full text-sm bg-blue-500 text-white py-2 rounded-lg mt-3 hover:bg-blue-600 transition"
                                >
                                    {resetMode
                                        ? "Update Password"
                                        : isSubmitting || emailCheckLoading || loading
                                        ? "Checking..."
                                        : "Confirm & Continue"}
                                </button>
                            )}
                        </Form>
                    )}
                </Formik>
                {!resetMode && (
                    <>
                        <div className="flex items-center w-full my-4">
                            <hr className="flex-grow border-t border-gray-300" />
                            <p className="mx-3 text-gray-500 text-xs font-medium">OR</p>
                            <hr className="flex-grow border-t border-gray-300" />
                        </div>
                        <GoogleSignInButton />
                    </>
                )}
            </div>
        </div>
    );
}
