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

export default function TopicsTutorialPage() {
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
        <span className='text-sm font-medium'>Topics</span>
      </Breadcrumb>

      <h1 className='mb-6 text-3xl font-bold'>Understanding ROS2 Topics</h1>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Introduction to ROS2 Topics</CardTitle>
          <CardDescription>
            Learn the fundamentals of topics in ROS2
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='mb-4'>
            Topics are an essential communication mechanism in ROS2 (Robot
            Operating System 2). They provide a way for nodes (individual
            processes) to exchange messages, enabling modular and distributed
            robot systems.
          </p>
          <p className='mb-4'>
            This tutorial will help you understand ROS2 topics and how to work
            with them using the TB3 Dashboard's Topic Explorer feature.
          </p>
        </CardContent>
      </Card>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>What are ROS2 Topics?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='mb-4'>
            In ROS2, a topic is a named bus over which nodes exchange messages.
            Topics implement a publish/subscribe communication pattern with the
            following characteristics:
          </p>
          <ul className='mb-4 list-disc space-y-2 pl-6'>
            <li>
              <strong>Publishers:</strong> Nodes that generate data and send
              messages on a topic
            </li>
            <li>
              <strong>Subscribers:</strong> Nodes that receive and process
              messages from a topic
            </li>
            <li>
              <strong>Messages:</strong> Strongly typed data structures that
              define the format of the data being exchanged
            </li>
            <li>
              <strong>Asynchronous:</strong> Communication happens without
              blocking either the publisher or subscriber
            </li>
            <li>
              <strong>Many-to-many:</strong> Multiple nodes can publish to and
              subscribe to the same topic
            </li>
          </ul>

          <div className='mb-4 rounded-md bg-gray-100 p-4'>
            <p className='font-mono text-sm'>
              # Example of ROS2 topic communication model:
              <br />
              <br />
              [Camera Node] ───publishes to──→ /camera/image ───subscribes to──→
              [Image Processing Node]
              <br />
              [Lidar Node] ───publishes to──→ /scan ───subscribes to──→
              [Navigation Node]
              <br />
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Common TurtleBot3 Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='mb-3'>
            The TurtleBot3 exposes several standard topics that you can explore:
          </p>
          <table className='mb-4 w-full border-collapse'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border p-2 text-left'>Topic Name</th>
                <th className='border p-2 text-left'>Message Type</th>
                <th className='border p-2 text-left'>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='border p-2 font-mono'>/cmd_vel</td>
                <td className='border p-2 font-mono'>geometry_msgs/Twist</td>
                <td className='border p-2'>
                  Control robot movement (linear and angular velocity)
                </td>
              </tr>
              <tr>
                <td className='border p-2 font-mono'>/odom</td>
                <td className='border p-2 font-mono'>nav_msgs/Odometry</td>
                <td className='border p-2'>
                  Robot's position and velocity estimation
                </td>
              </tr>
              <tr>
                <td className='border p-2 font-mono'>/scan</td>
                <td className='border p-2 font-mono'>sensor_msgs/LaserScan</td>
                <td className='border p-2'>LiDAR sensor data</td>
              </tr>
              <tr>
                <td className='border p-2 font-mono'>/imu</td>
                <td className='border p-2 font-mono'>sensor_msgs/Imu</td>
                <td className='border p-2'>
                  IMU sensor data (orientation, angular velocity)
                </td>
              </tr>
              <tr>
                <td className='border p-2 font-mono'>/battery_state</td>
                <td className='border p-2 font-mono'>
                  sensor_msgs/BatteryState
                </td>
                <td className='border p-2'>Battery status information</td>
              </tr>
              <tr>
                <td className='border p-2 font-mono'>/camera/image_raw</td>
                <td className='border p-2 font-mono'>sensor_msgs/Image</td>
                <td className='border p-2'>
                  Raw camera image (if camera is equipped)
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Exploring Topics with TB3 Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <p>
              The TB3 Dashboard provides a user-friendly Topic Explorer that
              lets you browse and interact with all available ROS2 topics on
              your TurtleBot3. Here's how to use it:
            </p>

            <ol className='list-decimal space-y-4 pl-6'>
              <li>
                <p className='font-semibold'>Navigate to the Topic Explorer</p>
                <p>
                  Access the Topic Explorer from the sidebar or click{' '}
                  <a
                    href='/dashboard/topic'
                    className='text-blue-600 hover:underline'
                  >
                    here
                  </a>
                  .
                </p>
              </li>
              <li>
                <p className='font-semibold'>Browse Available Topics</p>
                <p>
                  Once connected to your TurtleBot3, you'll see a list of all
                  available topics.
                </p>
              </li>
              <li>
                <p className='font-semibold'>Select a Topic</p>
                <p>
                  Click on any topic to view its details, including message type
                  and current publishers/subscribers.
                </p>
              </li>
              <li>
                <p className='font-semibold'>Subscribe to Topic Data</p>
                <p>
                  Click "Subscribe" to start receiving real-time data from the
                  selected topic.
                </p>
              </li>
              <li>
                <p className='font-semibold'>Publish to Topics</p>
                <p>
                  For topics that accept input (like /cmd_vel), you can use the
                  interface to publish messages.
                </p>
              </li>
            </ol>

            <Alert>
              <AlertTitle>Practice Exercise</AlertTitle>
              <AlertDescription>
                Try subscribing to the <code>/odom</code> topic and observe how
                the values change as you move the robot using the teleoperation
                interface. This will help you understand how odometry data
                relates to physical movement.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Topic: Message Types</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='mb-4'>
            Every topic in ROS2 has a specific message type that defines the
            structure of data being exchanged. Understanding these message types
            is crucial for working with topics effectively.
          </p>

          <div className='mb-4'>
            <h3 className='mb-2 text-lg font-semibold'>
              Example: geometry_msgs/Twist
            </h3>
            <p className='mb-2'>
              The Twist message is used to control robot movement and contains:
            </p>
            <div className='rounded-md bg-gray-100 p-4 font-mono text-sm'>
              # This expresses velocity in free space broken into its linear and
              angular parts
              <br />
              Vector3 linear
              <br />
              Vector3 angular
            </div>
          </div>

          <p className='mb-4'>
            To send a command for moving forward at 0.2 m/s, you would publish a
            message to the
            <code>/cmd_vel</code> topic with:
          </p>

          <div className='mb-4 rounded-md bg-gray-100 p-4 font-mono text-sm'>
            linear:
            <br />
            x: 0.2
            <br />
            y: 0.0
            <br />
            z: 0.0
            <br />
            angular:
            <br />
            x: 0.0
            <br />
            y: 0.0
            <br />
            z: 0.0
          </div>

          <p>
            Using the TB3 Dashboard's Topic Explorer, you can experiment with
            different values to see how they affect the robot's behavior. This
            hands-on experience is invaluable for understanding ROS2 topics and
            message structures.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
