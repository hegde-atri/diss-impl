export default function Code({ children }: { children: React.ReactNode }) {
  return (
    <span className='rounded-sm bg-zinc-200 px-1 py-0.5 font-mono'>
      {children}
    </span>
  );
}
