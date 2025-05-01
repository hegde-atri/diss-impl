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
            <li>A TurtleBot3 robot with ROS2 and waffle tools installed</li>
            <li>Both your computer and TurtleBot3 connected to the same network</li>
          </ul>
        </CardContent>
      </Card>

      <Alert className="mb-6 bg-amber-50">
        <AlertTitle>Required Robot Setup</AlertTitle>
        <AlertDescription className="space-y-2">
          For now the setup is limited to the TurtleBot3 robots in the Diamond robot arena of the University of Sheffield.
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
              <p>Turn the robot on and wait for the initialisation sound. </p>
            </li>
            <li>
              <p className="font-semibold">Navigate to the Pairing Page</p>
              <p>Access the pairing page from the sidebar or click <a href="/dashboard/pairing" className="text-blue-600 hover:underline">here</a>.</p>
            </li>
            <li>
              <p className="font-semibold">Enter the Robot's Information</p>
              <p>Enter the TurtleBot3 waffle's robot number.</p>
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
              <ul className="list-disc pl-6 space-y-1">
                <li>Check if you ran <code>tb3_bringup</code> on the robot</li>
                <li>If issues persist, restart the robot and re-connect again</li>
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