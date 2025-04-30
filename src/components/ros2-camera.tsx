"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useRobotStore } from "@/store/robot-store";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { executeCommand } from "@/lib/command";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { RefreshCcw, Camera } from "lucide-react";

interface ROS2CameraProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  topic?: string;
  minHeight?: string;
}

export default function ROS2Camera({
  width = "100%",
  height = "100%",
  className = "",
  topic = "/camera/color/image_raw",
  minHeight = "400px", // Default minimum height
}: ROS2CameraProps) {
  const robotPaired = useRobotStore((state) => state.robotPaired);
  
  const [isStreamEnabled, setIsStreamEnabled] = useState(false);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const streamContainerRef = useRef<HTMLDivElement>(null);

  // URL for the video stream
  const streamUrl = `http://localhost:8080/stream?topic=${topic}`;
  const snapshotUrl = `http://localhost:8080/snapshot?topic=${topic}`;
  
  // Take a snapshot of the current camera view
  const takeSnapshot = () => {
    window.open(snapshotUrl, '_blank');
  };
  
  // Start the web_video_server
  const startServer = async () => {
    try {
      setIsLoading(true);
      // Update switch and server state immediately for better UI feedback
      setIsStreamEnabled(true);
      setIsServerRunning(true);
      
      // Execute the command to start the web_video_server
      await executeCommand("ros2 run web_video_server web_video_server &");
      
      // Simple wait for 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Video server started");
      
      // Show the iframe with a new key - use positive value to exit initialization state
      setRefreshKey(Date.now());
      setIsLoading(false); // Ensure loading state is cleared
      return true;
    } catch (error) {
      console.error("Error starting web_video_server:", error);
      toast.error("Error starting video server");
      setIsStreamEnabled(false);
      setIsServerRunning(false);
      return false;
    } finally {
      setIsLoading(false); // Ensure loading state is cleared in all cases
    }
  };

  // Stop the web_video_server
  const stopServer = async () => {
    try {
      setIsLoading(true);
      setIsStreamEnabled(false);
      setIsServerRunning(false);
      
      // Kill the web_video_server process
      await executeCommand("pkill -f web_video_server", true);
      
      // Simple wait for 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Video server stopped");
      return true;
    } catch (error) {
      console.error("Error stopping web_video_server:", error);
      toast.error("Error stopping video server");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle the server - simplified
  const toggleServer = async () => {
    const targetState = !isServerRunning;
    if (targetState) {
      await startServer();
    } else {
      await stopServer();
    }
  };

  // Refresh the stream
  const refreshStream = () => {
    setRefreshKey(prev => prev + 1);
    setIsLoading(true); // Set loading state when refreshing
    
    // Clear loading state after a timeout even if iframe doesn't trigger events
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  // Check server status when component mounts - simplified
  useEffect(() => {
    if (robotPaired) {
      setIsLoading(true);
      
      // Check if web_video_server is running
      executeCommand("ps aux | grep 'web_video_server' | grep -v grep", true)
        .then(result => {
          const isRunning = result && 
                          !result.error && 
                          typeof result.output === 'string' && 
                          result.output.trim().length > 0;
          
          setIsServerRunning(isRunning);
          setIsStreamEnabled(isRunning);
          
          if (isRunning) {
            setRefreshKey(Date.now());
          }
        })
        .catch(error => {
          console.error("Error checking server status:", error);
          setIsServerRunning(false);
          setIsStreamEnabled(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [robotPaired]);

  // Handle image loading and error events
  const handleImageLoaded = () => {
    setStreamError(null);
    setIsLoading(false);
  };

  const handleImageError = () => {
    if (isServerRunning && isStreamEnabled) {
      setStreamError("Failed to load video stream. The server is running but the stream could not be loaded.");
    }
    setIsLoading(false);
  };

  // Add safety timeout to clear loading state in case other handlers fail
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading) {
      // Clear loading state after 5 seconds as a safety measure
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

  return (
    <Card 
      className={className} 
      style={{ 
        width, 
        height, 
        minHeight 
      }}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="stream-toggle"
                checked={isStreamEnabled}
                onCheckedChange={toggleServer}
                disabled={isLoading || !robotPaired}
              />
              <Label htmlFor="stream-toggle">
                {isServerRunning ? "Stop Video Server" : "Start Video Server"}
              </Label>
            </div>
            {isServerRunning && (
              <>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={refreshStream}
                  disabled={isLoading || !isServerRunning}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refresh Stream
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={takeSnapshot}
                  disabled={isLoading || !isServerRunning}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Snapshot
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center">
            <div 
              className={`w-2 h-2 rounded-full mr-2 ${
                isServerRunning ? 'bg-green-500' : 'bg-red-500'
              }`} 
            />
            <span className="text-xs text-muted-foreground">
              {isServerRunning ? "Server Running" : "Server Stopped"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex ">
        <div 
          ref={streamContainerRef}
          className="flex mx-auto w-full overflow-hidden "
          style={{ minHeight: '500px' }}
        >
          {isLoading && !isServerRunning ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Skeleton className="w-20 h-20 rounded-full" />
              <p className="text-center mt-2">Processing request...</p>
            </div>
          ) : isLoading && isServerRunning ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Skeleton className="w-20 h-20 rounded-full" />
              <p className="text-center mt-2">Loading stream...</p>
            </div>
          ) : !robotPaired ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-center">Robot not connected. Please pair your robot first.</p>
            </div>
          ) : streamError ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-center">{streamError}</p>
            </div>
          ) : !isServerRunning ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-center">Toggle the switch above to start the video server.</p>
            </div>
          ) : !isStreamEnabled ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-center">Stream is disabled. Toggle the switch to enable.</p>
            </div>
          ) : (
            <iframe
              key={refreshKey}
              src={streamUrl}
              className="w-full h-full border-0"
              style={{ minHeight: '100%' }}
              onLoad={handleImageLoaded}
              onError={handleImageError}
              title="ROS2 Camera Stream"
              allow="autoplay"
              sandbox="allow-same-origin"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}