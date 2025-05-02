"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDown, ArrowUp, RotateCcw, RotateCw, Trash2 } from "lucide-react";
import { executeCommand } from "@/lib/command";
import { useState, useEffect, useCallback, useRef } from "react";
import { useCommandHistoryStore } from "@/store/command-history";
import ROS2Camera from "@/components/ros2-camera";

export default function TelePage() {
  // Turtlebot3 max velocities (you might want to adjust these based on your model)
  const MAX_LINEAR_VELOCITY = 0.26; // m/s
  const MAX_ANGULAR_VELOCITY = 1.82; // rad/s
  const LINEAR_VELOCITY_INCREMENT = 0.02;
  const ANGULAR_VELOCITY_INCREMENT = 0.2;

  const [linearVelocity, setLinearVelocity] = useState(0);
  const [angularVelocity, setAngularVelocity] = useState(0);
  const [inputLinearVelocity, setInputLinearVelocity] = useState("");
  const [inputAngularVelocity, setInputAngularVelocity] = useState("");
  const [cmdStatus, setCmdStatus] = useState("");
  const { history, addCommand, clearHistory } = useCommandHistoryStore();
  const terminalRef = useRef<HTMLDivElement>(null);

  const buttonClass =
    "bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-white rounded-md flex justify-center items-center w-[100px] p-4 cursor-pointer";

  // Auto-scroll terminal to bottom whenever history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Add keyboard control
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for these keys (like scrolling with arrow keys)
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(event.key.toLowerCase())) {
        event.preventDefault();
      }
      
      switch (event.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          handleForward();
          break;
        case 'arrowdown':
        case 's':
          handleBackward();
          break;
        case 'arrowleft':
        case 'a':
          handleRotateLeft();
          break;
        case 'arrowright':
        case 'd':
          handleRotateRight();
          break;
        case ' ': // Spacebar
          stopRobot();
          break;
      }
    };

    // Add event listener when component mounts
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [linearVelocity, angularVelocity]); // Dependencies for the velocity control functions

  // Function to send velocity command
  const sendVelocityCommand = useCallback(
    async (linear: number, angular: number) => {
      // Clamp velocities to max values
      const clampedLinear = Math.max(
        -MAX_LINEAR_VELOCITY,
        Math.min(MAX_LINEAR_VELOCITY, linear)
      );
      const clampedAngular = Math.max(
        -MAX_ANGULAR_VELOCITY,
        Math.min(MAX_ANGULAR_VELOCITY, angular)
      );

      setLinearVelocity(clampedLinear);
      setAngularVelocity(clampedAngular);

      // Format command for turtlebot3 velocity
      const command = `ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist "{linear: {x: ${clampedLinear.toFixed(
        2
      )}, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: ${clampedAngular.toFixed(
        2
      )}}}"`;

      try {
        setCmdStatus("Sending command...");
        const result = await executeCommand(command);

        // Add to command history with output
        addCommand({
          command: command,
          output: result.output || "",
          error: result.error || "",
        });

        setCmdStatus(
          result.error ? `Error: ${result.error}` : "Command sent successfully"
        );
      } catch (error) {
        console.error("Failed to send velocity command:", error);

        // Add failed command to history
        addCommand({
          command: command,
          error: "Failed to send command",
        });

        setCmdStatus("Failed to send command");
      }
    },
    [addCommand]
  );

  // Function to stop the robot
  const stopRobot = useCallback(async () => {
    setLinearVelocity(0);
    setAngularVelocity(0);
    setInputLinearVelocity("");
    setInputAngularVelocity("");
    await sendVelocityCommand(0, 0);
  }, [sendVelocityCommand]);

  // Handle button clicks
  const handleForward = () => {
    sendVelocityCommand(linearVelocity + LINEAR_VELOCITY_INCREMENT, angularVelocity);
  };

  const handleBackward = () => {
    sendVelocityCommand(linearVelocity - LINEAR_VELOCITY_INCREMENT, angularVelocity);
  };

  const handleRotateLeft = () => {
    sendVelocityCommand(linearVelocity, angularVelocity + ANGULAR_VELOCITY_INCREMENT);
  };

  const handleRotateRight = () => {
    sendVelocityCommand(linearVelocity, angularVelocity - ANGULAR_VELOCITY_INCREMENT);
  };

  // Handle custom velocity input
  const handleSetCustomVelocity = () => {
    const newLinear = inputLinearVelocity
      ? parseFloat(inputLinearVelocity)
      : linearVelocity;
    const newAngular = inputAngularVelocity
      ? parseFloat(inputAngularVelocity)
      : angularVelocity;
    sendVelocityCommand(newLinear, newAngular);
  };

  // Format timestamp to readable format
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  // Maintain chronological ordering for display
  const getOrderedHistory = () => {
    // Create a copy of the history array before reversing it
    // This ensures newest commands (at the beginning) are displayed at the bottom
    return [...history].reverse();
  };

  // Cleanup on unmount - make sure to stop the robot
  useEffect(() => {
    return () => {
      stopRobot();
    };
  }, [stopRobot]);

  return (
    <section>
      <h1 className="font-bold text-2xl mb-3">Teleoperation</h1>
      <div className="flex flex-col lg:grid lg:grid-cols-3 lg:grid-rows-4 lg:h-[85vh] lg:w-full gap-4">
        {/* Camera Panel */}
        <div className="col-span-2 row-span-3 rounded-md overflow-hidden">
          <ROS2Camera 
            height="100%" 
            width="100%" 
          />
        </div>
        {/* Teleoperation Panel */}
        <div className="flex flex-col col-span-1 row-span-3 border rounded-md items-center">
          <div className="flex flex-col w-full p-4 items-center h-full">
            <h2 className="text-xl font-semibold mb-3">Teleoperation</h2>
            <div className="flex flex-col w-full text-sm items-center justify-center h-full">
              {/* Live data display */}
              <div className="text-center">
                <p>
                  <span className="font-semibold">Linear:</span>{" "}
                  {linearVelocity.toFixed(2)} m/s
                </p>
                <p>
                  <span className="font-semibold">Angular:</span>{" "}
                  {angularVelocity.toFixed(2)} rad/s
                </p>
                <p className="text-xs text-muted-foreground my-2 truncate">
                  {cmdStatus}
                </p>
              </div>
              {/* Control buttons */}
              <div className="flex flex-col items-center w-full">
                <div className={buttonClass} onClick={handleForward}>
                  <ArrowUp size={45} />
                </div>
                <div className="flex w-full justify-between">
                  <div className={buttonClass} onClick={handleRotateLeft}>
                    <RotateCcw size={40} />
                  </div>
                  <div className={buttonClass} onClick={handleRotateRight}>
                    <RotateCw size={40} />
                  </div>
                </div>
                <div className={buttonClass} onClick={handleBackward}>
                  <ArrowDown size={45} />
                </div>
              </div>
              {/* Form */}
              <div className="my-4 w-full">
                <div className="*:not-first:mt-2">
                  <Label htmlFor="linear">Linear Speed</Label>
                  <div className="relative">
                    <Input
                      id="linear"
                      className="peer pe-12"
                      placeholder="0.00"
                      type="number"
                      value={inputLinearVelocity}
                      onChange={(e) => setInputLinearVelocity(e.target.value)}
                      min={-MAX_LINEAR_VELOCITY}
                      max={MAX_LINEAR_VELOCITY}
                      step="0.01"
                    />
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                      m/s
                    </span>
                  </div>
                </div>

                <div className="*:not-first:mt-2">
                  <Label htmlFor="angular">Angular Speed</Label>
                  <div className="relative">
                    <Input
                      id="angular"
                      className="peer pe-12"
                      placeholder="0.00"
                      type="number"
                      value={inputAngularVelocity}
                      onChange={(e) => setInputAngularVelocity(e.target.value)}
                      min={-MAX_ANGULAR_VELOCITY}
                      max={MAX_ANGULAR_VELOCITY}
                      step="0.01"
                    />
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                      rad/s
                    </span>
                  </div>
                </div>
              </div>
              {/* Buttons */}
              <Button
                className="p-4 text-lg w-full"
                variant="secondary"
                onClick={handleSetCustomVelocity}
              >
                Set
              </Button>
              <Button
                className="mt-4 p-4 text-lg w-full"
                variant="destructive"
                onClick={stopRobot}
              >
                Stop
              </Button>
            </div>
          </div>
        </div>
        {/* Terminal Panel */}
        <div className="col-span-3 row-span-1 bg-black text-green-500 rounded-md flex flex-col p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-white">Terminal</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="h-8 px-2 text-white hover:bg-gray-800"
            >
              <Trash2 size={16} className="mr-1" />
              Clear
            </Button>
          </div>

          <div
            ref={terminalRef}
            className="flex-1 overflow-y-auto font-mono text-sm"
            style={{ maxHeight: "calc(100% - 40px)" }}
          >
            {history.length === 0 ? (
              <p className="text-gray-500 italic">
                No commands have been executed yet
              </p>
            ) : (
              <div className="space-y-3">
                {getOrderedHistory().map((entry, index) => (
                  <div key={index} className="border-b border-gray-800 pb-2">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">
                        [{formatTimestamp(entry.timestamp)}]
                      </span>
                      <span className="text-white">$ {entry.command}</span>
                    </div>
                    {entry.output && (
                      <pre className="mt-1 text-green-400 whitespace-pre-wrap overflow-x-auto">
                        {entry.output}
                      </pre>
                    )}
                    {entry.error && (
                      <pre className="mt-1 text-red-400 whitespace-pre-wrap overflow-x-auto">
                        {entry.error}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
