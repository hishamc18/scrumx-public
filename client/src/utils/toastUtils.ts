import { toast} from 'sonner';

type ToastVariants = "success" | "error" | "info" | "warning";

export const showToast = (
    message: string,
    type: ToastVariants | "default" = "default"
): void => {
    const toastFunction = type === "default" ? toast : toast[type];
    
    toastFunction(message, {
        style: {
            color: "#323333" // Fixed color for all toasts
        }
    });
};
