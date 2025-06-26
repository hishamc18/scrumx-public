


export default function AuthenticationLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="bg-white">
                <div className="flex justify-between items-center h-screen bg-[#FFFEFE]">
                    <img src="/auth.png" className="h-full p-2 rounded-[20px] hidden xl-custom:block"></img>
                    <div className="  h-full w-full flex justify-center items-center">
                        <main className="  h-full w-[90%] ">{children}</main>
                       
                    </div>
                </div>
            </div>
        </>
    );
}
