'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCw, XCircle, Wifi, WifiOff } from 'lucide-react';
import { executeCommand } from '@/lib/command';
import Link from 'next/link';

interface ResultStepProps {
  status: boolean;
  robotNumber: number;
  onReset: () => void;
}

export default function ResultStep({
  status,
  robotNumber,
  onReset,
}: ResultStepProps) {
  const [isConnected, setIsConnected] = useState(status);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  // Periodically check the connection status (every 15 seconds)
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      checkConnectionStatus();
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [isConnected, robotNumber]);

  // Check connection when the component mounts
  useEffect(() => {
    if (status) {
      checkConnectionStatus();
    }
  }, [status]);

  const checkConnectionStatus = async () => {
    if (isCheckingConnection) return;

    setIsCheckingConnection(true);
    try {
      // Check if the zenoh bridge is running for this robot - using silent mode
      const result = await executeCommand(
        `ps aux | grep "waffle ${robotNumber} bridge" | grep -v grep`,
        true
      );

      // If the command returns non-empty results, the bridge is running
      const bridgeRunning =
        result &&
        !result.error &&
        typeof result.output === 'string' &&
        result.output.trim().length > 0;

      setIsConnected(bridgeRunning);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Kill all SSH connections
      await executeCommand(`pkill ssh`, true);

      // Kill zenoh bridge processes
      await executeCommand(`pkill zenoh`, true);

      // Also kill the waffle process
      await executeCommand('pkill waffle', true);

      setIsConnected(false);
      onReset();
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  const handleRefreshStatus = () => {
    checkConnectionStatus();
  };

  if (status && isConnected) {
    return (
      <div className='flex flex-col items-center'>
        <div className='mb-6 rounded-full bg-green-100 p-6'>
          <CheckCircle className='h-16 w-16 text-green-600' />
        </div>

        <h2 className='mb-2 text-xl font-bold'>TurtleBot3 Connected</h2>
        <p className='mb-6 text-center text-gray-600'>
          Your robot is connected and ready to use. You can now control and
          monitor it through the dashboard.
        </p>

        <div className='mb-6 w-full max-w-md rounded-lg bg-gray-50 p-6'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-lg font-medium'>Robot Dashboard</h3>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleRefreshStatus}
              disabled={isCheckingConnection}
            >
              <RefreshCw
                className={`h-4 w-4 ${isCheckingConnection ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>

          <div className='space-y-6'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Robot ID</span>
                <span className='rounded bg-gray-200 px-2 py-1 font-mono text-sm'>
                  {robotNumber}
                </span>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Connection Status</span>
                <div className='flex items-center gap-1'>
                  <Wifi className='h-3 w-3 text-green-600' />
                  <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
                    Connected
                  </span>
                </div>
              </div>
              <div className='text-xs text-gray-500'>
                Last checked: {lastChecked.toLocaleTimeString()}
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Bridge Status</span>
                <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='mb-6 grid w-full max-w-md grid-cols-2 gap-4'>
          <Link href='/dashboard/tele' className='w-full'>
            <Button className='w-full'>Control Robot</Button>
          </Link>
          <Link href='/dashboard/topic' className='w-full'>
            <Button variant='outline' className='w-full'>
              View Topics
            </Button>
          </Link>
        </div>

        <Button
          variant='destructive'
          onClick={handleDisconnect}
          className='gap-2'
        >
          <WifiOff className='h-4 w-4' />
          Disconnect Robot
        </Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='mb-6 rounded-full bg-red-100 p-6'>
        <XCircle className='h-16 w-16 text-red-600' />
      </div>

      <h2 className='mb-2 text-xl font-bold'>
        {status ? 'Connection Lost' : 'Pairing Failed'}
      </h2>

      <p className='mb-6 max-w-lg text-center text-gray-600'>
        {status
          ? "We've lost the connection to your robot. This could be due to network issues, the robot powering off, or the bridge process terminating."
          : "We couldn't pair with your TurtleBot3. Please make sure your robot is powered on, and that you've entered the correct robot number."}
      </p>

      <div className='mb-6 w-full max-w-md space-y-4 rounded-lg bg-gray-50 p-4'>
        <h3 className='font-medium'>Troubleshooting tips:</h3>
        <ul className='list-inside list-disc space-y-2 text-left text-gray-600'>
          <li>Check that your robot is powered on</li>
          <li>Verify your network connection</li>
          <li>Make sure the robot number {robotNumber} is correct</li>
          <li>Try to restart the robot if necessary</li>
        </ul>
      </div>

      <div className='flex gap-4'>
        <Button onClick={onReset}>Try Again</Button>

        {status && (
          <Button
            variant='outline'
            onClick={handleRefreshStatus}
            disabled={isCheckingConnection}
          >
            {isCheckingConnection ? (
              <>
                <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className='mr-2 h-4 w-4' />
                Check Connection
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
