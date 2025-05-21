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

export default function TeleoperationTutorialPage() {
  return (
    <div className='container mx-auto py-6'>
      <Breadcrumb className='mb-6'>
        <Link
          href='#'
          className='text-sm text-muted-foreground hover:text-foreground'
        >
          Tutorials
        </Link>
        <span className='mx-2 text-sm text-muted-foreground'>/</span>
        <span className='text-sm font-medium'>Teleoperation</span>
      </Breadcrumb>

      <h1 className='mb-6 text-3xl font-bold'>Teleoperation with ROS2</h1>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Introduction to Teleoperation</CardTitle>
          <CardDescription>
            Learn how to control TurtleBot3 remotely using ROS2
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='mb-4'>
            Teleoperation (or "teleop" for short) is the practice of controlling
            a robot from a distance. In ROS2, teleoperation is typically
            achieved by publishing velocity commands to the robot's command
            velocity topic.
          </p>
          <p className='mb-4'>
            This tutorial will guide you through understanding how teleoperation
            works in ROS2 and how to effectively control your TurtleBot3 using
            the TB3 Dashboard.
          </p>
        </CardContent>
      </Card>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Understanding the /cmd_vel Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='mb-4'>
            The primary mechanism for controlling a TurtleBot3's movement in
            ROS2 is through the
            <code>/cmd_vel</code> topic. This topic uses the{' '}
            <code>geometry_msgs/Twist</code> message type to specify linear and
            angular velocities.
          </p>

          <div className='mb-4 rounded-md bg-gray-100 p-4'>
            <p className='font-mono text-sm'>
              # geometry_msgs/Twist message structure
              <br />
              <br />
              # Linear velocity components (meters/second)
              <br />
              geometry_msgs/Vector3 linear
              <br />
              float64 x # forward/backward movement
              <br />
              float64 y # left/right movement (not used in differential drive
              robots like TurtleBot3)
              <br />
              float64 z # up/down movement (not used in ground robots)
              <br />
              <br />
              # Angular velocity components (radians/second)
              <br />
              geometry_msgs/Vector3 angular
              <br />
              float64 x # rotation around X axis (roll - not used in ground
              robots)
              <br />
              float64 y # rotation around Y axis (pitch - not used in ground
              robots)
              <br />
              float64 z # rotation around Z axis (yaw - used for turning
              left/right)
            </p>
          </div>

          <p className='mb-4'>
            For a standard differential drive robot like the TurtleBot3, we
            primarily use:
          </p>
          <ul className='mb-4 list-disc space-y-1 pl-6'>
            <li>
              <code>linear.x</code>: Forward/backward movement (positive values
              move forward)
            </li>
            <li>
              <code>angular.z</code>: Turning left/right (positive values rotate
              counterclockwise)
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Teleop Control Logic</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='mb-3'>
            Here's how basic movement commands translate to velocity values:
          </p>
          <table className='mb-4 w-full border-collapse'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border p-2 text-left'>Movement</th>
                <th className='border p-2 text-left'>linear.x</th>
                <th className='border p-2 text-left'>angular.z</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='border p-2'>Move forward</td>
                <td className='border p-2 font-mono'>Positive (e.g., 0.2)</td>
                <td className='border p-2 font-mono'>0.0</td>
              </tr>
              <tr>
                <td className='border p-2'>Move backward</td>
                <td className='border p-2 font-mono'>Negative (e.g., -0.2)</td>
                <td className='border p-2 font-mono'>0.0</td>
              </tr>
              <tr>
                <td className='border p-2'>Turn left (in place)</td>
                <td className='border p-2 font-mono'>0.0</td>
                <td className='border p-2 font-mono'>Positive (e.g., 1.0)</td>
              </tr>
              <tr>
                <td className='border p-2'>Turn right (in place)</td>
                <td className='border p-2 font-mono'>0.0</td>
                <td className='border p-2 font-mono'>Negative (e.g., -1.0)</td>
              </tr>
              <tr>
                <td className='border p-2'>Arc forward-left</td>
                <td className='border p-2 font-mono'>Positive (e.g., 0.2)</td>
                <td className='border p-2 font-mono'>Positive (e.g., 0.5)</td>
              </tr>
              <tr>
                <td className='border p-2'>Arc forward-right</td>
                <td className='border p-2 font-mono'>Positive (e.g., 0.2)</td>
                <td className='border p-2 font-mono'>Negative (e.g., -0.5)</td>
              </tr>
              <tr>
                <td className='border p-2'>Stop</td>
                <td className='border p-2 font-mono'>0.0</td>
                <td className='border p-2 font-mono'>0.0</td>
              </tr>
            </tbody>
          </table>

          <Alert className='mb-4'>
            <AlertTitle>Safety Tip</AlertTitle>
            <AlertDescription>
              Always start with low velocity values (e.g., 0.05 to 0.1 m/s
              linear, 0.3 to 0.7 rad/s angular) when first operating your robot
              to prevent accidents and damage.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Hands-on Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <Alert>
              <AlertTitle>Prerequisites</AlertTitle>
              <AlertDescription>
                Before proceeding, make sure your TurtleBot3 is powered on,
                connected to the same network as your computer, and paired with
                the TB3 Dashboard. See the{' '}
                <Link href='/dashboard/docs/pairing' className='underline'>
                  Pairing Documentation
                </Link>{' '}
                if needed.
              </AlertDescription>
            </Alert>

            <div>
              <h3 className='mb-2 text-lg font-semibold'>
                Exercise 1: Basic Control
              </h3>
              <ol className='list-decimal space-y-2 pl-6'>
                <li>
                  Navigate to the{' '}
                  <Link
                    href='/dashboard/tele'
                    className='text-blue-600 hover:underline'
                  >
                    Teleoperation
                  </Link>{' '}
                  page in the dashboard
                </li>
                <li>Try moving the robot forward for 2 seconds, then stop</li>
                <li>Try turning the robot 90 degrees to the left, then stop</li>
                <li>
                  Try moving in a square pattern by combining forward movements
                  and turns
                </li>
              </ol>
            </div>

            <div>
              <h3 className='mb-2 text-lg font-semibold'>
                Exercise 2: Understanding Velocity Limits
              </h3>
              <ol className='list-decimal space-y-2 pl-6'>
                <li>
                  Open the{' '}
                  <Link
                    href='/dashboard/topic'
                    className='text-blue-600 hover:underline'
                  >
                    Topic Explorer
                  </Link>{' '}
                  and locate the <code>/cmd_vel</code> topic
                </li>
                <li>
                  Try publishing different velocity values:
                  <ul className='mt-1 list-disc pl-6'>
                    <li>Low speed: linear.x = 0.1</li>
                    <li>Medium speed: linear.x = 0.2</li>
                    <li>Turning slowly: angular.z = 0.5</li>
                    <li>Turning quickly: angular.z = 1.5</li>
                  </ul>
                </li>
                <li>
                  Observe how the robot responds to different velocity commands
                </li>
              </ol>
            </div>

            <div>
              <h3 className='mb-2 text-lg font-semibold'>
                Exercise 3: Combined Movement
              </h3>
              <ol className='list-decimal space-y-2 pl-6'>
                <li>
                  Try commanding the robot to move in an arc by setting both
                  linear.x and angular.z
                </li>
                <li>
                  Experiment with different combinations of values to see how
                  they affect the robot's path
                </li>
                <li>
                  Try to make the robot follow a circular path by maintaining
                  constant linear and angular velocities
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Under the Hood: ROS2 Teleoperation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='mb-4'>
            While the TB3 Dashboard provides a user-friendly interface for
            teleoperation, it's valuable to understand what's happening behind
            the scenes:
          </p>

          <ol className='list-decimal space-y-4 pl-6'>
            <li>
              <p className='font-semibold'>User Input Capture</p>
              <p>
                When you interact with the dashboard's teleoperation controls,
                the interface captures your input (joystick movement, button
                presses, etc.) and translates it into appropriate velocity
                values.
              </p>
            </li>
            <li>
              <p className='font-semibold'>Message Creation</p>
              <p>
                The dashboard creates a <code>geometry_msgs/Twist</code> message
                with the calculated velocity values.
              </p>
            </li>
            <li>
              <p className='font-semibold'>WebSocket Communication</p>
              <p>
                The message is sent over WebSocket to the ROS2 bridge running on
                the TurtleBot3.
              </p>
            </li>
            <li>
              <p className='font-semibold'>Topic Publishing</p>
              <p>
                The ROS2 bridge publishes the message to the{' '}
                <code>/cmd_vel</code> topic in the ROS2 network.
              </p>
            </li>
            <li>
              <p className='font-semibold'>Robot Controller</p>
              <p>
                The TurtleBot3's controller node subscribes to the{' '}
                <code>/cmd_vel</code> topic and translates the velocity commands
                into motor control signals.
              </p>
            </li>
            <li>
              <p className='font-semibold'>Motor Actuation</p>
              <p>
                The motors adjust their speed and direction based on these
                signals, moving the robot accordingly.
              </p>
            </li>
          </ol>

          <div className='mt-6'>
            <p className='mb-2'>
              The dashboard translates each bottom to an equivalent ros2
              command. For example, pressing the "forward" button sends a
              command to the robot to move forward at a specified speed. The
              dashboard continuously monitors the robot's state and updates the
              interface accordingly, providing real-time feedback on the robot's
              position and orientation.
            </p>
            <p>
              By understanding this flow, you can better troubleshoot any
              teleoperation issues and gain insight into how ROS2 enables remote
              control of robotic systems.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
