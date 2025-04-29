import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function PairingDocumentation() {
  return (
    <div className="container mx-auto py-6">
      <Breadcrumb className="mb-6">
        <Link href="/dashboard/docs/introduction" className="text-sm text-muted-foreground hover:text-foreground">
          Documentation
        </Link>
        <span className="text-sm text-muted-foreground mx-2">/</span>
        <span className="text-sm font-medium">Pairing</span>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6">Pairing with TurtleBot3</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>How to connect your dashboard to a TurtleBot3</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Before you can control or interact with your TurtleBot3, you need to establish a connection 
            between your dashboard and the robot. This process is called pairing and requires both devices 
            to be on the same network.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Prerequisites</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>A TurtleBot3 robot with ROS2 installed</li>
            <li>Both your computer and TurtleBot3 connected to the same network</li>
            <li>The robot's IP address (check your router or use <code>ifconfig</code> on the robot)</li>
            <li>ROS2 bridge running on the TurtleBot3</li>
          </ul>
        </CardContent>
      </Card>

      <Alert className="mb-6 bg-amber-50">
        <AlertTitle>Required Robot Setup</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>Before running the bridge, you <strong>must</strong> start the necessary ROS nodes on the robot by following these steps:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Enter a remote terminal session by running: <code>waffle NUM term</code> (replace NUM with your robot number)</li>
            <li>Inside the terminal, run: <code>tb3_bringup</code> to start the required ROS nodes</li>
            <li>Keep this terminal running while you return to your local machine</li>
            <li>Now run <code>waffle NUM bridge</code> to establish the connection</li>
          </ol>
          <p className="italic mt-2">Failing to run tb3_bringup will result in missing topics and non-functional robot capabilities.</p>
        </AlertDescription>
      </Alert>

      <Alert className="mb-6">
        <AlertTitle>Important Note</AlertTitle>
        <AlertDescription>
          Make sure your TurtleBot3 is running the ROS2 bridge service. This typically requires 
          running <code>ros2 launch rosbridge_server rosbridge_websocket_launch.xml</code> on the robot.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pairing Process</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <p className="font-semibold">Prepare the Robot</p>
              <p>Use <code>waffle NUM term</code> to connect to the robot and run <code>tb3_bringup</code> to initialize the robot's ROS nodes.</p>
            </li>
            <li>
              <p className="font-semibold">Establish the Bridge</p>
              <p>Return to your local machine and run <code>waffle NUM bridge</code> to create a communication bridge with the robot.</p>
            </li>
            <li>
              <p className="font-semibold">Navigate to the Pairing Page</p>
              <p>Access the pairing page from the sidebar or click <a href="/dashboard/pairing" className="text-blue-600 hover:underline">here</a>.</p>
            </li>
            <li>
              <p className="font-semibold">Enter the Robot's Information</p>
              <p>Enter the IP address of your TurtleBot3 in the input field. The standard port is 9090 
              unless you've configured it differently.</p>
            </li>
            <li>
              <p className="font-semibold">Initiate Connection</p>
              <p>Click the "Connect" button to establish a WebSocket connection to the ROS2 bridge.</p>
            </li>
            <li>
              <p className="font-semibold">Verify Connection</p>
              <p>If the connection is successful, you'll see a confirmation message and status indicator will turn green.</p>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Missing ROS Topics or Non-functional Robot</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Check if you ran <code>tb3_bringup</code> on the robot</li>
                <li>Verify the terminal running <code>tb3_bringup</code> is still active and hasn't crashed</li>
                <li>If issues persist, restart the process by running <code>tb3_bringup</code> again</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Connection Refused</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Verify that the IP address is correct</li>
                <li>Check that the ROS2 bridge is running on the robot</li>
                <li>Ensure that your network allows WebSocket connections on the specified port</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Intermittent Connection</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Check your network stability</li>
                <li>Try reconnecting after restarting the ROS2 bridge on the robot</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">ROS2 Topic Errors</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Verify that the required ROS2 nodes are running on the TurtleBot3</li>
                <li>Check for any error messages in the robot's terminal</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}