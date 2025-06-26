"use client"
import MeetingTypeList from '@/components/streamVideo/MeetingTypeList';
import { useGetCalls } from '@/hooks/useGetCalls';



const Home = () => {
  const dummyNumber=1
  const {upcomingCalls}=useGetCalls(dummyNumber)
  const universalUpcomingProjectName =upcomingCalls?.[0]?.state?.custom?.projectName
  const universalUpcoming =upcomingCalls?.[0]?.state?.startsAt?.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour12: true
})
 
   const untitle='No upcoming calls'
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(now);

  return (
    <section className="flex w-[95%]  pl-10   flex-col justify-center  gap-10   text-offWhite relative">
      <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover bg-primaryDark">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
        <h2 className="glassmorphism max-w-[336px] rounded-xl py-2 px-4 text-sm font-medium bg-[#2E2C54] hover:scale-105 transition ease-in-out duration-300">
    Upcoming Meeting  {universalUpcoming || 'at... to be announced!  📅'}
</h2>
          <h2 className="max-w-[336px] rounded-xl py-2 px-1 text-sm font-medium ">
           {(!universalUpcoming)? untitle :universalUpcomingProjectName?.charAt(0)?.toUpperCase() + universalUpcomingProjectName?.slice(1)}
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 ml-2 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;