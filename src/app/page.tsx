import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  const features = [
    {
      title: 'Topic Visualization',
      description: 'Visualize ROS2 topics in real-time',
    },
    {
      title: 'Teleoperation',
      description: 'Control your Turtlebot3 Waffle remotely',
    },
    {
      title: 'Learn ROS2 Commands',
      description: 'Interactive tutorials for ROS2 command-line tools',
    },
  ];

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-100 to-zinc-200 px-4 py-12'>
      <h1 className='mb-4 text-4xl font-bold text-zinc-800'>
        Welcome to TB3 Tools
      </h1>
      <p className='mb-6 max-w-2xl text-center text-xl text-zinc-600'>
        A developer dashboard for the Turtlebot3 Waffle
      </p>
      <Button asChild className='mb-12 bg-zinc-800 hover:bg-zinc-700'>
        <Link href='/dashboard/pairing'>Start Pairing</Link>
      </Button>
      <div className='grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3'>
        {features.map((feature, index) => (
          <Card key={index} className='w-full border-zinc-200 bg-zinc-50'>
            <CardHeader>
              <CardTitle className='text-zinc-800'>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-zinc-600'>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
