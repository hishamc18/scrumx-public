"useEffect";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoaderPage() {
  

  

    return (
        <div className="flex h-screen w-screen items-center justify-center  overflow-hidden">
           
                <div
                    className={`loader } flex items-center justify-center w-full h-full relative bg-[#f0f2f5] transition-opacity duration-800`}
                >
                    <Image src="/logo-scrumx.png" alt="Logo" width={150} height={150} className="opacity-100 animate-fadeIn scale-[0.8]" />
                </div>
           

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .loader.hidden {
                    opacity: 0;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}
