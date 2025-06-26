"use client";

import { AppDispatch } from "@/redux/app/store";
import { joinGroupProjects } from "@/redux/features/projectSlice";
import { showToast } from "@/utils/toastUtils";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const InvitePage = () => {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const inviteToken = params?.inviteToken as string;

    useEffect(() => {
        if (!inviteToken) return;

        dispatch(joinGroupProjects(inviteToken))
            .unwrap()
            .then(() => {
                router.replace("/home");
            })
            .catch((error) => {
                if (error === "No account found. Please sign up before joining.") {
                    showToast("Register in with the invite email and re-click the join button.","warning");
                    router.replace("/register");
                } else if (error === "Please log in with the email that received the invite link before joining.") {
                    showToast("Log in with the invite email and re-click the join button.","warning");
                    router.replace("/register"); // Redirect to login page //route to login after complete login
                } else if (error === "No token provided") {
                    showToast("Log in with the invite email and re-click the join button.","warning");
                    router.replace("/register"); // Redirect to login page //route to login after complete login
                } else {
                    router.replace(`/error?message=${encodeURIComponent(error)}`); // Handle other errors
                    // in not found page, fetch the params of the error
                }
            });
    }, [inviteToken, router, dispatch]);

    return <div className="text-center text-lg h-screen">Processing your invitation...</div>;
};

export default InvitePage;
