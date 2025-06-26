"use client";
import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  
} from "@/components/ui/dialog"
// import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
//   instantMeeting?: boolean;
  image?: string;
//   buttonClassName?: string;
  buttonIcon?: string;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  // className,
  children,
  handleClick,
  buttonText,
//   instantMeeting,
  image,
//   buttonClassName,
  buttonIcon,
}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[350px] h-auto flex-col gap-6 border-none bg-primaryDark px-6 py-9 text-white">
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="checked" width={72} height={72} />
            </div>
          )}
          <DialogTitle className="text-3xl font-bold leading-[42px]">
          {/* <h1 className={cn("text-3xl font-bold leading-[42px]", className)}> */}
            {title}
          {/* </h1> */}
          </DialogTitle>
          
          {children}
          <Button
            className={
              "bg-[#f5e7e7]  text-textColor focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-offWhite hover:scale-105 transition ease-in-out duration-300 "
            }
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image
                src={buttonIcon}
                alt="button icon"
                width={13}
                height={13}
              />
            )}{" "}
            &nbsp;
            {buttonText || "Schedule Meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;