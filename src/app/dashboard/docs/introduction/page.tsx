import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function IntroductionPage() {
  return (
    <div className='container mx-auto py-6'>
      <h1 className='mb-6 text-3xl font-bold'>Introduction to TB3 Dashboard</h1>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Welcome to TB3 Dashboard</CardTitle>
          <CardDescription>
            Your control center for the TurtleBot3
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='mb-4'>
            TB3 Dashboard is a comprehensive web interface designed to simplify
            your interaction with the TurtleBot3 robot. This dashboard provides
            tools for robot pairing, teleoperation, topic exploration, and
            terminal access all in one place.
          </p>
          <p className='mb-4'>
            Whether you are a beginner or an experienced robotics engineer, this
            dashboard aims to enhance your experience working with ROS2 and the
            TurtleBot3 platform.
          </p>
        </CardContent>
      </Card>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Dashboard Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='list-disc space-y-2 pl-6'>
            <li>
              <strong>Robot Pairing:</strong> Easily connect your dashboard with
              your TurtleBot3 through a simple pairing process
            </li>
            <li>
              <strong>Teleoperation:</strong> Control your TurtleBot3 in
              real-time with an intuitive interface
            </li>
            <li>
              <strong>Topic Explorer:</strong> Browse and interact with ROS2
              topics published by your robot
            </li>
            <li>
              <strong>Terminal Access:</strong> Direct terminal access to the
              robot's operating system for advanced operations
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className='list-decimal space-y-2 pl-6'>
            <li>
              First, ensure your TurtleBot3 is powered on and connected to the
              same network as your computer
            </li>
            <li>
              Visit the{' '}
              <a
                href='/dashboard/pairing'
                className='text-blue-600 hover:underline'
              >
                Pairing
              </a>{' '}
              page to connect your dashboard to your robot
            </li>
            <li>
              Once connected, explore the dashboard features using the sidebar
              navigation
            </li>
            <li>
              Check the documentation and tutorials sections for detailed
              instructions and learning resources
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
