import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PairingDocumentation() {
  return (
    <div className='container mx-auto py-6'>
      <Breadcrumb className='mb-6'>
        <Link
          href='/dashboard/docs/introduction'
          className='text-sm text-muted-foreground hover:text-foreground'
        >
          Documentation
        </Link>
        <span className='mx-2 text-sm text-muted-foreground'>/</span>
        <span className='text-sm font-medium'>Pairing</span>
      </Breadcrumb>

      <h1 className='mb-6 text-3xl font-bold'>Pairing with TurtleBot3</h1>
      <Button className='mb-4' asChild>
        <Link href='/dashboard/pairing'>Visit Page</Link>
      </Button>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            How to connect your dashboard to a TurtleBot3
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='mb-4'>
            Before you can control or interact with your TurtleBot3, you need to
            establish a connection between your dashboard and the robot. This
            process is called pairing and requires both devices to be on the
            same network.
          </p>
        </CardContent>
      </Card>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Prerequisites</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='list-disc space-y-2 pl-6'>
            <li>A TurtleBot3 robot with ROS2 and waffle tools installed</li>
            <li>
              Both your computer and TurtleBot3 connected to the same network
            </li>
          </ul>
        </CardContent>
      </Card>

      <Alert className='mb-6 bg-amber-50'>
        <AlertTitle>Required Robot Setup</AlertTitle>
        <AlertDescription className='space-y-2'>
          For now the setup is limited to the TurtleBot3 robots in the Diamond
          robot arena of the University of Sheffield.
        </AlertDescription>
      </Alert>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Pairing Process</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className='list-decimal space-y-4 pl-6'>
            <li>
              <p className='font-semibold'>Prepare the Robot</p>
              <p>Turn the robot on and wait for the initialisation sound. </p>
            </li>
            <li>
              <p className='font-semibold'>Navigate to the Pairing Page</p>
              <p>
                Access the pairing page from the sidebar or click{' '}
                <a
                  href='/dashboard/pairing'
                  className='text-blue-600 hover:underline'
                >
                  here
                </a>
                .
              </p>
            </li>
            <li>
              <p className='font-semibold'>Enter the Robot's Information</p>
              <p>Enter the TurtleBot3 waffle's robot number.</p>
            </li>
            <li>
              <p className='font-semibold'>Initiate Connection</p>
              <p>
                Click the "Connect" button to establish a WebSocket connection
                to the ROS2 bridge.
              </p>
            </li>
            <li>
              <p className='font-semibold'>Verify Connection</p>
              <p>
                If the connection is successful, you'll see a confirmation
                message and status indicator will turn green.
              </p>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <ul className='list-disc space-y-1 pl-6'>
                <li>
                  Check if you ran <code>tb3_bringup</code> on the robot
                </li>
                <li>
                  If issues persist, restart the robot and re-connect again
                </li>
                <li>Verify that the robot is turned on</li>
                <li>Try hard refreshing your browser (CTRL + SHIFT + R)</li>
                <li>Ensure you are in Computer Room 5</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
