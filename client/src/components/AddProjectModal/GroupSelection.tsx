import React from "react";

interface Props {
    isGroup: boolean;
    setIsGroup: (value: boolean) => void;
}

const GroupSelection: React.FC<Props> = ({ isGroup, setIsGroup }) => {
    return (
        <div className="flex relative justify-end gap-2 py-3 ">
            <button
                type="button"
                className={`w-32 absolute right-28 px-4 py-2 rounded-xl transition-all text-sm mt-2 ${
                    !isGroup ? "bg-primaryDark text-white" : "bg-lightDark text-black"
                }`}
                onClick={() => setIsGroup(false)}
            >
                Individual
            </button>
            <button
                type="button"
                className={`w-32 px-4 py-2 rounded-xl transition-all text-sm mt-2 ${
                    isGroup ? "bg-primaryDark text-white z-10" : "bg-lightDark text-black"
                }`}
                onClick={() => setIsGroup(true)}
            >
                Group
            </button>
        </div>
    );
};

export default GroupSelection;
