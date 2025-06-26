"use client"
import Image from 'next/image';

export default function Loader() {
  
    return (
        <div className="flex h-screen w-screen justify-center items-center bg-pureWhite fixed top-0 left-0  z-[9999] overflow-hidden">
                <div className="relative scale-50 flex justify-center items-center h-screen w-screen  opacity-100 transition-opacity duration-800">
                    <Image src="/icons/LoadingLogo.png" alt="Logo" width={150} height={150} className="z-10 opacity-100 animate-fadeIn scale-80" />
                    <div className="absolute w-52 h-52 border-4 border-transparent border-t-black rounded-full animate-spin animate-fadeOut"></div>
                </div>
        </div>
    );
}
