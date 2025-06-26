import CallList from '@/components/streamVideo/CallList';

const Recordings = () => {

  return (
    <section className="flex size-full relative ml-8 flex-col gap-10 text-textColor">
      <h1 className="text-3xl font-bold">Recordings</h1>

      <CallList type="recordings" />
    </section>
  );
};

export default Recordings;