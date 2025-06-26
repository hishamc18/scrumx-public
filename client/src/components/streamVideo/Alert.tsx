
import Image from 'next/image';

import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { usePathname, useRouter } from 'next/navigation';

interface PermissionCardProps {
  title: string;
  description?:string
  iconUrl?: string;
}

const Alert = ({ title,description ,iconUrl }: PermissionCardProps) => {
  const pathname = usePathname();
  const router=useRouter()
  const handleClick=()=>{
    // const newPath = pathname.split('/').slice(0, -3).join('/') || '/';
    const newPath = (pathname ?? "/").split('/').slice(0, -3).join('/') || '/';
    router.push(newPath);
  }
  return (
    <section className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <Card className="w-full max-w-[520px] rounded-2xl shadow-2xl border-none bg-primaryDark p-6 py-9 text-white animate-fade-in">
        <CardContent>
          <div className="flex flex-col gap-9">
            <div className="flex flex-col gap-3.5">
              {iconUrl && (
                <div className="flex justify-center">
                  <Image src={iconUrl} width={72} height={72} alt="icon" />
                </div>
              )}
              <h1 className=" text-xl font-semibold text-center">{title}</h1>
              <p className='text-center'>{description}</p>
            </div>

            <Button  onClick={handleClick}  className="bg-[#f5e7e7]  text-textColor focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-offWhite hover:scale-105 transition ease-in-out duration-300">
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Alert;
