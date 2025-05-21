'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowDown,
  ArrowUp,
  RotateCcw,
  RotateCw,
  Trash2,
  HelpCircle,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { executeCommand } from '@/lib/command';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useCommandHistoryStore } from '@/store/command-history';
import ROS2Camera from '@/components/ros2-camera';

export default function TelePage() {
  const MAX_LINEAR_VELOCITY = 0.26; // m/s
  const MAX_ANGULAR_VELOCITY = 1.82; // rad/s
  const LINEAR_VELOCITY_INCREMENT = 0.02;
  const ANGULAR_VELOCITY_INCREMENT = 0.2;

  const [linearVelocity, setLinearVelocity] = useState(0);
  const [angularVelocity, setAngularVelocity] = useState(0);
  const [inputLinearVelocity, setInputLinearVelocity] = useState('');
  const [inputAngularVelocity, setInputAngularVelocity] = useState('');
  const [cmdStatus, setCmdStatus] = useState('');
  const { history, addCommand, clearHistory } = useCommandHistoryStore();
  const terminalRef = useRef<HTMLDivElement>(null);

  const buttonClass =
    'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-white rounded-md flex justify-center items-center w-[100px] p-4 cursor-pointer';

  // Auto-scroll terminal to bottom whenever history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Add keyboard control
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'w',
          'a',
          's',
          'd',
          ' ',
        ].includes(event.key.toLowerCase())
      ) {
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
  }, [linearVelocity, angularVelocity]);

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

      const command = `ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist "{linear: {x: ${clampedLinear.toFixed(
        2
      )}, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: ${clampedAngular.toFixed(
        2
      )}}}"`;

      try {
        setCmdStatus('Sending command...');
        const result = await executeCommand(command);

        // Add to command history with output
        addCommand({
          command: command,
          output: result.output || '',
          error: result.error || '',
        });

        setCmdStatus(
          result.error ? `Error: ${result.error}` : 'Command sent successfully'
        );
      } catch (error) {
        console.error('Failed to send velocity command:', error);

        // Add failed command to history
        addCommand({
          command: command,
          error: 'Failed to send command',
        });

        setCmdStatus('Failed to send command');
      }
    },
    [addCommand]
  );

  const stopRobot = useCallback(async () => {
    setLinearVelocity(0);
    setAngularVelocity(0);
    setInputLinearVelocity('');
    setInputAngularVelocity('');
    await sendVelocityCommand(0, 0);
  }, [sendVelocityCommand]);

  // Handle button clicks
  const handleForward = () => {
    sendVelocityCommand(
      linearVelocity + LINEAR_VELOCITY_INCREMENT,
      angularVelocity
    );
  };

  const handleBackward = () => {
    sendVelocityCommand(
      linearVelocity - LINEAR_VELOCITY_INCREMENT,
      angularVelocity
    );
  };

  const handleRotateLeft = () => {
    sendVelocityCommand(
      linearVelocity,
      angularVelocity + ANGULAR_VELOCITY_INCREMENT
    );
  };

  const handleRotateRight = () => {
    sendVelocityCommand(
      linearVelocity,
      angularVelocity - ANGULAR_VELOCITY_INCREMENT
    );
  };

  // Handle custom velocity input
  const handleSetCustomVelocity = () => {
    const newLinear = inputLinearVelocity
      ? Math.max(
          -MAX_LINEAR_VELOCITY,
          Math.min(MAX_LINEAR_VELOCITY, parseFloat(inputLinearVelocity))
        )
      : linearVelocity;
    const newAngular = inputAngularVelocity
      ? Math.max(
          -MAX_ANGULAR_VELOCITY,
          Math.min(MAX_ANGULAR_VELOCITY, parseFloat(inputAngularVelocity))
        )
      : angularVelocity;

    // Update the input fields to show the clamped values
    if (inputLinearVelocity) {
      setInputLinearVelocity(newLinear.toString());
    }
    if (inputAngularVelocity) {
      setInputAngularVelocity(newAngular.toString());
    }

    sendVelocityCommand(newLinear, newAngular);
  };

  // Format timestamp to readable format
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  // Maintain chronological ordering for display
  const getOrderedHistory = () => {
    return [...history].reverse();
  };

  // on unmount make sure to stop the robot
  useEffect(() => {
    return () => {
      stopRobot();
    };
  }, [stopRobot]);

  return (
    <section>
      <h1 className='mb-3 text-2xl font-bold'>Teleoperation</h1>
      <div className='flex flex-col gap-4 lg:grid lg:h-[85vh] lg:w-full lg:grid-cols-3 lg:grid-rows-4'>
        {/* Camera Panel */}
        <div className='col-span-2 row-span-3 overflow-hidden rounded-md'>
          <ROS2Camera height='100%' width='100%' />
        </div>
        {/* Teleoperation Panel */}
        <div className='col-span-1 row-span-3 flex flex-col items-center rounded-md border'>
          <div className='flex h-full w-full flex-col items-center p-4'>
            <div className='mb-3 flex w-full items-center justify-between'>
              <h2 className='text-xl font-semibold'>Teleoperation</h2>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-8 w-8 rounded-full'
                    aria-label='Keyboard Controls Help'
                  >
                    <HelpCircle size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-64'>
                  <p className='mb-1 font-medium'>Keyboard Controls:</p>
                  <div className='grid grid-cols-2 gap-1'>
                    <span>
                      <kbd className='rounded bg-zinc-200 px-1 dark:bg-zinc-700'>
                        W
                      </kbd>{' '}
                      /{' '}
                      <kbd className='rounded bg-zinc-200 px-1 dark:bg-zinc-700'>
                        ↑
                      </kbd>{' '}
                      Forward
                    </span>
                    <span>
                      <kbd className='rounded bg-zinc-200 px-1 dark:bg-zinc-700'>
                        S
                      </kbd>{' '}
                      /{' '}
                      <kbd className='rounded bg-zinc-200 px-1 dark:bg-zinc-700'>
                        ↓
                      </kbd>{' '}
                      Backward
                    </span>
                    <span>
                      <kbd className='rounded bg-zinc-200 px-1 dark:bg-zinc-700'>
                        A
                      </kbd>{' '}
                      /{' '}
                      <kbd className='rounded bg-zinc-200 px-1 dark:bg-zinc-700'>
                        ←
                      </kbd>{' '}
                      Left
                    </span>
                    <span>
                      <kbd className='rounded bg-zinc-200 px-1 dark:bg-zinc-700'>
                        D
                      </kbd>{' '}
                      /{' '}
                      <kbd className='rounded bg-zinc-200 px-1 dark:bg-zinc-700'>
                        →
                      </kbd>{' '}
                      Right
                    </span>
                    <span className='col-span-2'>
                      <kbd className='rounded bg-zinc-200 px-1 dark:bg-zinc-700'>
                        Space
                      </kbd>{' '}
                      Stop
                    </span>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex h-full w-full flex-col items-center justify-center text-sm'>
              {/* Live data display */}
              <div className='text-center'>
                <p>
                  <span className='font-semibold'>Linear:</span>{' '}
                  {linearVelocity.toFixed(2)} m/s
                </p>
                <p>
                  <span className='font-semibold'>Angular:</span>{' '}
                  {angularVelocity.toFixed(2)} rad/s
                </p>
                <p className='my-2 truncate text-xs text-muted-foreground'>
                  {cmdStatus}
                </p>
              </div>
              {/* Control buttons */}
              <div className='flex w-full flex-col items-center'>
                <div className={buttonClass} onClick={handleForward}>
                  <ArrowUp size={45} />
                </div>
                <div className='flex w-full justify-between'>
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
              <div className='my-4 w-full'>
                <div className='*:not-first:mt-2'>
                  <Label htmlFor='linear'>Linear Speed</Label>
                  <div className='relative'>
                    <Input
                      id='linear'
                      className='peer pe-12'
                      placeholder='0.00'
                      type='number'
                      value={inputLinearVelocity}
                      onChange={(e) => setInputLinearVelocity(e.target.value)}
                      min={-MAX_LINEAR_VELOCITY}
                      max={MAX_LINEAR_VELOCITY}
                      step='0.01'
                    />
                    <span className='pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50'>
                      m/s
                    </span>
                  </div>
                </div>

                <div className='*:not-first:mt-2'>
                  <Label htmlFor='angular'>Angular Speed</Label>
                  <div className='relative'>
                    <Input
                      id='angular'
                      className='peer pe-12'
                      placeholder='0.00'
                      type='number'
                      value={inputAngularVelocity}
                      onChange={(e) => setInputAngularVelocity(e.target.value)}
                      min={-MAX_ANGULAR_VELOCITY}
                      max={MAX_ANGULAR_VELOCITY}
                      step='0.01'
                    />
                    <span className='pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50'>
                      rad/s
                    </span>
                  </div>
                </div>
              </div>
              {/* Buttons */}
              <Button
                className='w-full p-4 text-lg'
                variant='secondary'
                onClick={handleSetCustomVelocity}
              >
                Set
              </Button>
              <Button
                className='mt-4 w-full p-4 text-lg'
                variant='destructive'
                onClick={stopRobot}
              >
                Stop
              </Button>
            </div>
          </div>
        </div>
        {/* Terminal Panel */}
        <div className='col-span-3 row-span-1 flex flex-col overflow-hidden rounded-md bg-black p-4 text-green-500'>
          <div className='mb-2 flex items-center justify-between'>
            <h3 className='font-semibold text-white'>Terminal</h3>
            <Button
              variant='ghost'
              size='sm'
              onClick={clearHistory}
              className='h-8 px-2 text-white hover:bg-gray-800'
            >
              <Trash2 size={16} className='mr-1' />
              Clear
            </Button>
          </div>

          <div
            ref={terminalRef}
            className='flex-1 overflow-y-auto font-mono text-sm'
            style={{ maxHeight: 'calc(100% - 40px)' }}
          >
            {history.length === 0 ? (
              <p className='italic text-gray-500'>
                No commands have been executed yet
              </p>
            ) : (
              <div className='space-y-3'>
                {getOrderedHistory().map((entry, index) => (
                  <div key={index} className='border-b border-gray-800 pb-2'>
                    <div className='flex items-center'>
                      <span className='mr-2 text-gray-500'>
                        [{formatTimestamp(entry.timestamp)}]
                      </span>
                      <span className='text-white'>$ {entry.command}</span>
                    </div>
                    {entry.output && (
                      <pre className='mt-1 overflow-x-auto whitespace-pre-wrap text-green-400'>
                        {entry.output}
                      </pre>
                    )}
                    {entry.error && (
                      <pre className='mt-1 overflow-x-auto whitespace-pre-wrap text-red-400'>
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
