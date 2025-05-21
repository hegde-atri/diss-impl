'use client';

import { Button } from '@/components/ui/button';
import { BotIcon as RobotIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

interface IntroductionStepProps {
  onContinue: () => void;
}

export default function IntroductionStep({
  onContinue,
}: IntroductionStepProps) {
  return (
    <div className='flex flex-col items-center text-center'>
      <div className='mb-6 rounded-full bg-blue-100 p-6'>
        <RobotIcon className='h-16 w-16 text-blue-600' />
      </div>

      <h2 className='mb-4 text-xl font-bold'>Welcome to TurtleBot3 Pairing</h2>

      <p className='mb-6 max-w-lg text-gray-600'>
        This walkthrough will guide you through connecting to your TurtleBot3
        robot. The pairing process establishes a communication link with your
        robot through the ROS2 bridge.
      </p>

      <Alert className='mb-6 w-full max-w-md'>
        <InfoIcon className='h-4 w-4' />
        <AlertTitle>How Pairing Works</AlertTitle>
        <AlertDescription>
          <p className='mt-2'>The pairing process involves:</p>
          <ol className='mt-2 list-inside list-decimal space-y-1 text-left'>
            <li>Identifying your robot by its number</li>
            <li>Initiating a pairing command</li>
            <li>
              Starting a WebSocket bridge to enable communication with the robot
            </li>
          </ol>
        </AlertDescription>
      </Alert>

      <div className='mb-6 w-full max-w-md space-y-4 rounded-lg bg-amber-50 p-4'>
        <h3 className='font-medium text-amber-800'>Before you begin:</h3>
        <ul className='list-inside list-disc space-y-2 text-left text-amber-700'>
          <li>Make sure your TurtleBot3 is powered on</li>
          <li>
            Ensure your robot is connected to the same network as your computer
          </li>
          <li>
            Have your robot number ready (this will be provided by your
            instructor)
          </li>
          <li>Make sure you have permission to pair with the robot</li>
        </ul>
      </div>

      <Button onClick={onContinue} size='lg'>
        Begin Pairing
      </Button>
    </div>
  );
}
