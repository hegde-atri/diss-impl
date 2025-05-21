'use client';

import { useState, useEffect } from 'react';
import { executeCommand } from '@/lib/command';
import { useRobotStore } from '@/store/robot-store';

export function useConnectionStatus(checkIntervalMs = 5000) {
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const robotNumber = useRobotStore((state) => state.robotNumber);
  const robotPaired = useRobotStore((state) => state.robotPaired);
  const setRobotPaired = useRobotStore((state) => state.setRobotPaired);

  const checkConnectionStatus = async () => {
    if (!robotNumber || isChecking) return;

    setIsChecking(true);
    try {
      // Check if the bridge is running
      const bridgeResult = await executeCommand(
        `ps aux | grep "waffle ${robotNumber} bridge" | grep -v grep`,
        true
      );

      // If the command returns non-empty results, the bridge is running
      const bridgeRunning =
        bridgeResult &&
        !bridgeResult.error &&
        typeof bridgeResult.output === 'string' &&
        bridgeResult.output.trim().length > 0;

      // Check if the robot can be pinged using the pingpong command
      const pingResult = await executeCommand(
        `waffle ${robotNumber} pingpong`,
        true
      );

      // pingpong returns "true" or "false" string in the output
      const isPingable =
        pingResult &&
        !pingResult.error &&
        typeof pingResult.output === 'string' &&
        pingResult.output.includes('true');

      // Consider the robot connected if both bridge is running AND robot is pingable
      const isConnected = bridgeRunning && isPingable;

      // Update the robot paired status in the store if it's different
      if (robotPaired !== isConnected) {
        console.log(
          `Connection status changed: ${isConnected ? 'Connected' : 'Disconnected'}`
        );
        console.log(
          `Bridge running: ${bridgeRunning}, Pingable: ${isPingable}`
        );
        setRobotPaired(isConnected);
      }

      setLastChecked(new Date());
    } catch (error) {
      // This will likely not execute since we're using silent mode
      console.log('Error checking robot connection status:', error);

      // If there's an error checking the status, assume disconnected
      if (robotPaired) {
        setRobotPaired(false);
      }
    } finally {
      setIsChecking(false);
    }
  };

  // Effect to periodically check connection status
  useEffect(() => {
    // Only start checking if we have a robot number
    if (!robotNumber) return;

    // Initial check when the hook is first used
    checkConnectionStatus();

    // Set up interval for periodic checks
    const interval = setInterval(() => {
      checkConnectionStatus();
    }, checkIntervalMs);

    return () => {
      clearInterval(interval);
    };
  }, [robotNumber, checkIntervalMs]);

  return {
    isChecking,
    lastChecked,
    checkNow: checkConnectionStatus,
  };
}
