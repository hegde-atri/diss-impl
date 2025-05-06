import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function TeleoperationDocumentation() {
  return (
    <div className="container mx-auto py-6">
      <Breadcrumb className="mb-6">
        <Link href="/dashboard/docs/introduction" className="text-sm text-muted-foreground hover:text-foreground">
          Documentation
        </Link>
        <span className="text-sm text-muted-foreground mx-2">/</span>
        <span className="text-sm font-medium">Teleoperation</span>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6">TurtleBot3 Teleoperation</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Remotely control your TurtleBot3</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Teleoperation allows you to control your TurtleBot3 robot remotely through this dashboard. 
            You can send movement commands, adjust speed, and see the robot's camera feed in real-time.
          </p>
          <p className="mb-4">
            The teleoperation interface provides an intuitive way to navigate your robot in its 
            environment without having to use command-line tools or complex programming.
          </p>
        </CardContent>
      </Card>

      <Alert className="mb-6">
        <AlertTitle>Prerequisites</AlertTitle>
        <AlertDescription>
          Before using the teleoperation feature, ensure that you have successfully paired your 
          dashboard with the TurtleBot3. See the <Link href="/dashboard/docs/pairing" className="underline">Pairing Documentation</Link> for 
          details.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Teleoperation Interface</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            The teleoperation interface consists of several components:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Teleoperation Buttons:</strong> 4 on-screen buttons and inputs to control the robot's movement
            </li>
            <li>
              <strong>Camera Feed:</strong> Real-time video from the robot's camera
            </li>
            <li>
              <strong>Terminal Output:</strong> Displays the commands being executed and their output when any buttons are clicked.
            </li>
          </ul>
          <div className="flex justify-center mb-4">
            <img src="/images/teleop.png" alt="Teleoperation screen" className="shadow-2xl rounded-2xl border-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Control Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">On-screen Controls</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Up: Move the robot forward</li>
                <li>Down: Move the robot backward</li>
                <li>Left/Right: Turn the robot in the corresponding direction</li>
                <li>Release to stop the robot</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Keyboard Controls</h3>
              <p className="mb-2">
                You can also use keyboard shortcuts for more precise control:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Arrow Up / W:</strong> Move forward</li>
                <li><strong>Arrow Down / S:</strong> Move backward</li>
                <li><strong>Arrow Left / A:</strong> Turn left</li>
                <li><strong>Arrow Right / D:</strong> Turn right</li>
                <li><strong>Spacebar:</strong> Emergency stop</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tips and Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Start with a low speed setting when first operating the robot in a new environment
            </li>
            <li>
              Keep the robot within sight or ensure the camera feed is working properly to avoid collisions
            </li>
            <li>
              Be aware of network latency which may cause delayed responses to your commands
            </li>
            <li>
              Use the emergency stop function (Spacebar) when the robot is about to collide with an obstacle
            </li>
            <li>
              For more precise movement control, use short command inputs rather than holding down controls
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}