"use client";

import { AppDispatch, RootState } from "@/redux/app/store";
import { getNewUserData, updateUserData } from "@/redux/features/authSlice";
import LoginInputField from "@/components/InputFields/LoginInputField";
import Image from "next/image";
import { Formik, Form } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userValidationSchema from "@/schemas/userValidationSchema";
import Loader from "@/components/Loader";

export default function UserCredentials() {
    const dispatch = useDispatch<AppDispatch>();

    const [isUserLoaded, setIsUserLoaded] = useState(false);

    useEffect(() => {
        dispatch(getNewUserData())
            .then(() => setIsUserLoaded(true))
            .catch((error) => {
                console.error("Error fetching user data", error);
                setIsUserLoaded(true);
            });
    }, [dispatch]);

    const user = useSelector((state: RootState) => state.auth.user);
    console.log(user, "hello");

    if (!isUserLoaded) {
        return <Loader/>
    }

    return (
        <div className="flex flex-col justify-center items-center h-full pb-14">
            <Image src="/logo.png" width={200} height={200} priority alt="scrumX" />

            <div className="flex flex-col w-full justify-center items-center">
                <h2 className="text-textColor font-poppins font-regular text-l">
                    <span className="font-bold">ScrumX</span>
                </h2>
                <div className="text-gray-500 font-poppins font-light text-normal text-center text-xs py-2 flex flex-col gap-1">
                    <p className="font-poppins font-semibold text-primaryDark">{user?.email}</p>
                    <p>Finish setting up your account</p>
                </div>
            </div>

            <div className="flex flex-col gap-2 w-4/5">
                <Formik
                    initialValues={{
                        firstName: "",
                        lastName: "",
                        userProfession: "",
                        password: "",
                        confirmPassword: "",
                    }}
                    validateOnChange={true}
                    validateOnBlur={true}
                    validationSchema={userValidationSchema}
                    onSubmit={(values) => {
                        const {confirmPassword, ...userData}={...values,email:user?.email}
                        console.log("Form submitted:", confirmPassword);
                    
                        if (user?.email) {
                            dispatch(updateUserData(userData));
                        } else {
                            console.error("Email is missing, cannot update user data.");
                        }
                    }}
                    
                >
                    {({  isSubmitting }) => {
                        return (
                            <Form className="flex flex-col py-2">
                                <LoginInputField name="firstName" type="text" id="firstName" placeholder="First Name" />
                                <LoginInputField name="lastName" type="text" id="lastName" placeholder="Last Name" />
                                <LoginInputField
                                    name="userProfession"
                                    type="text"
                                    id="userProfession"
                                    placeholder="Profession"
                                />
                                <LoginInputField
                                    name="password"
                                    type="password"
                                    id="password"
                                    placeholder="Enter your Password"
                                />

                                {/* Confirm Password Field - Always Visible but Disabled Initially */}
                                <LoginInputField
                                    name="confirmPassword"
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                />

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full text-sm bg-blue-500 text-white py-2 rounded-lg mt-3 hover:bg-blue-600 transition"
                                >
                                    {isSubmitting ? "Registering..." : "Register"}
                                </button>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
}
