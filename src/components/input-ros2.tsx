import { Input } from '@/components/ui/input';

export default function InputRos2() {
  return (
    <div className='*:not-first:mt-2'>
      <div className='relative'>
        <Input className='peer ps-16' placeholder='google.com' type='text' />
        <span className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground peer-disabled:opacity-50'>
          ros2
        </span>
      </div>
    </div>
  );
}
