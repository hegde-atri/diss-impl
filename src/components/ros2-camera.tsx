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
  
  // Check if web_video_server is running
  const checkServerStatus = async () => {
    try {
      const result = await executeCommand("ps aux | grep 'web_video_server' | grep -v grep", true);
      const isRunning = result && 
                      !result.error && 
                      typeof result.output === 'string' && 
                      result.output.trim().length > 0;
      
      setIsServerRunning(isRunning);
      return isRunning;
    } catch (error) {
      console.error("Error checking web_video_server status:", error);
      setIsServerRunning(false);
      return false;
    }
  };

  // Start the web_video_server
  const startServer = async () => {
    try {
      setIsLoading(true);
      const result = await executeCommand("ros2 run web_video_server web_video_server &");
      
      if (result.error) {
        console.error("Failed to start web_video_server:", result.error);
        toast.error("Failed to start video server", {
          description: result.error
        });
        setIsServerRunning(false);
        return false;
      }
      
      // Wait a moment for the server to start
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if it's actually running
      const isRunning = await checkServerStatus();
      
      if (isRunning) {
        toast.success("Video server started successfully");
        setIsStreamEnabled(true);
        // Refresh the stream immediately after server starts
        setRefreshKey(prev => prev + 1);
      }
      
      return isRunning;
    } catch (error) {
      console.error("Error starting web_video_server:", error);
      toast.error("Error starting video server");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Stop the web_video_server
  const stopServer = async () => {
    try {
      setIsLoading(true);
      const result = await executeCommand("pkill -f web_video_server");
      
      // Check if it's actually stopped
      await new Promise(resolve => setTimeout(resolve, 500));
      const isRunning = await checkServerStatus();
      
      if (!isRunning) {
        toast.success("Video server stopped successfully");
      } else {
        toast.error("Failed to stop video server");
      }
      
      setIsStreamEnabled(false);
      return !isRunning;
    } catch (error) {
      console.error("Error stopping web_video_server:", error);
      toast.error("Error stopping video server");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle the server
  const toggleServer = async () => {
    if (isServerRunning) {
      await stopServer();
    } else {
      await startServer();
    }
  };

  // Refresh the stream
  const refreshStream = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Check server status when component mounts
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      const serverRunning = await checkServerStatus();
      setIsStreamEnabled(serverRunning);
      if (serverRunning) {
        // If server is already running, refresh the stream
        setRefreshKey(prev => prev + 1);
      }
      setIsLoading(false);
    };

    if (robotPaired) {
      initialize();
    }
  }, [robotPaired]);

  // Effect to auto-refresh stream when server becomes running
  useEffect(() => {
    if (isServerRunning && isStreamEnabled) {
      setRefreshKey(prev => prev + 1);
    }
  }, [isServerRunning, isStreamEnabled]);

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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Skeleton className="w-20 h-20 rounded-full" />
              <p className="text-white text-center mt-2">Loading...</p>
            </div>
          ) : !robotPaired ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-white text-center">Robot not connected. Please pair your robot first.</p>
            </div>
          ) : streamError ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-white text-center">{streamError}</p>
            </div>
          ) : !isServerRunning ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-white text-center">Toggle the switch above to start the video server.</p>
            </div>
          ) : !isStreamEnabled ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-white text-center">Stream is disabled. Toggle the switch to enable.</p>
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