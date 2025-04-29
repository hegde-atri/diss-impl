"use client";

import { useState, useEffect } from 'react';
import { executeCommand } from '@/lib/command';
import { useRobotStore } from '@/store/robot-store';

/**
 * Hook to periodically check if the robot connection is active
 * by verifying if the zenoh bridge process is running
 */
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
      // Using a silent version of execute command to avoid error popups
      // when the process is not running (which is an expected case)
      const result = await executeCommand(`ps aux | grep "waffle ${robotNumber} bridge" | grep -v grep`, true);
      
      // If the command returns non-empty results, the bridge is running
      // Empty result or error result means the process is not running
      const bridgeRunning = result && 
                           !result.error && 
                           typeof result.output === 'string' && 
                           result.output.trim().length > 0;
      
      // Update the robot paired status in the store if it's different
      if (robotPaired !== bridgeRunning) {
        console.log(`Connection status changed: ${bridgeRunning ? 'Connected' : 'Disconnected'}`);
        setRobotPaired(bridgeRunning);
      }
      
      setLastChecked(new Date());
    } catch (error) {
      // This will likely not execute since we're using silent mode
      console.log("Robot disconnected or process not running");
      
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
    checkNow: checkConnectionStatus
  };
}