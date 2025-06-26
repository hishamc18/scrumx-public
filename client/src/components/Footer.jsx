import React from 'react'
import Image from "next/image";

const Footer = () => {
  return (<>
  <div className="flex justify-between w-full py-10">
    {/* Logo Section */}
    <div className="flex flex-1 items-center gap-4 pl-4 pr-2">
        <Image
            src="/output-onlinepngtools.png"
            alt="scrumX"
            width={160}
            height={160}
            className="max-w-[160px]"
        />
        <h1 className="text-pureWhite text-2xl font-semibold cursor-default">
            A Unified Hub For Agile
        </h1>
    </div>

    {/* Footer Links Section */}
    <div className="flex flex-1  justify-between px-28 gap-12 text-offWhite w-full ">
        {/* Socials Section */}
        <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl cursor-default">Socials</h1>
            {['Instagram', 'YouTube', 'LinkedIn', 'Behance'].map((social) => (
                <a href="#" key={social} className="text-xs hover:underline transition duration-200 cursor-pointer">
                    {social}
                </a>
            ))}
        </div>

        {/* About Section */}
        <div className="flex flex-col gap-4 ">
            <h1 className="font-bold text-xl cursor-default">About</h1>
            {['Workspace', 'Features'].map((link) => (
                <a href="#" key={link} className="text-xs hover:underline transition duration-200 cursor-pointer">
                    {link}
                </a>
            ))}
        </div>

        {/* Connect Section */}
        <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl cursor-default">Connect</h1>
            <div className="flex items-center gap-2">
                <Image src="/social media/phone.png" alt="call" width={18} height={15} />
                <a href="tel:+919656736286" className="text-xs hover:underline transition duration-200 cursor-pointer">
                    +91 9656736286
                </a>
            </div>
            <div className="flex items-center gap-2">
                <Image src="/social media/email.png" alt="email" width={18} height={10} />
                <a href="mailto:scrumxrct@gmail.com" className="text-xs hover:underline transition duration-200 cursor-pointer">
                    scrumx@gmail.com
                </a>
            </div>
        </div>
    </div>
</div>

    
                    <div className="text-center flex justify-between px-16 items-center text-sm text-offWhite mt-7   w-full border-t-[1px] pt-4">
                        <div className="text-start flex flex-col gap-2">
                            <div className="font-bold opacity-45 text-xs cursor-default"> &copy; {new Date().getFullYear()} ScrumX </div>
                            <div className="font-bold  opacity-45 text-xs  cursor-default"> All rights reserved </div>
                        </div>
                        <div className="flex gap-8">
                            <a href="">
                                <Image src="/social media/facebook.png" alt="facebook" width={20} height={20}></Image>{" "}
                            </a>
                            <a href="">
                                <Image src="/social media/github.png" alt="facebook" width={20} height={20}></Image>{" "}
                            </a>
                            <a href="">
                                <Image src="/social media/instagram.png" alt="facebook" width={20} height={20}></Image>{" "}
                            </a>
                            <a href="">
                                <Image src="/social media/youtube.png" alt="facebook" width={20} height={20}></Image>{" "}
                            </a>
                        </div>
                    </div>
                    </>
  )
}

export default Footer
