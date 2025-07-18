'use client';

import { useEffect, useState } from 'react';
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
} from '@/components/ui/stepper';
import IntroductionStep from './introduction-step';
import PairingStep from './pairing-step';
import ResultStep from './results-step';
import { useRobotStore } from '@/store/robot-store';
import { executeCommand } from '@/lib/command';

export default function RobotPairingWalkthrough() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Access robot store
  const robotNumber = useRobotStore((state) => state.robotNumber);
  const setRobotNumber = useRobotStore((state) => state.setRobotNumber);
  const robotPaired = useRobotStore((state) => state.robotPaired);
  const setRobotPaired = useRobotStore((state) => state.setRobotPaired);
  const resetState = useRobotStore((state) => state.resetState);

  // Set initial step based on pairing status when component mounts
  useEffect(() => {
    // Check if we already have a robot paired in the store
    if (robotPaired && robotNumber > 0) {
      checkExistingConnection();
      setActiveStep(2);
    }
  }, [robotPaired, robotNumber]);

  // Check if we have an existing connection
  const checkExistingConnection = async () => {
    if (!robotNumber) return;

    try {
      // Check if the zenoh bridge is running for this robot
      const result = await executeCommand(
        `ps aux | grep "waffle ${robotNumber} bridge" | grep -v grep`
      );

      // If no results, the bridge isn't running
      if (!result || result.error) {
        // Connection lost, but store thinks we're paired
        setRobotPaired(false);
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
      setRobotPaired(false);
    }
  };

  const handlePairRobot = async () => {
    if (!robotNumber) return;

    setIsLoading(true);

    try {
      // Execute the pairing process as defined in pairing.md
      // 1. Run the pair command
      await executeCommand(`waffle ${robotNumber} pair`);

      // Wait a moment for the pairing to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 2. Run the bringup command
      await executeCommand(`waffle ${robotNumber} bringup`);

      // Wait a moment for ROS2 to start on the robot
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 3. Run the bridge command
      const bridgeResult = await executeCommand(`waffle ${robotNumber} bridge`);

      // If the bridge started successfully
      if (!bridgeResult?.error) {
        setRobotPaired(true);
      } else {
        setRobotPaired(false);
        console.error('Failed to start bridge:', bridgeResult?.error);
      }
    } catch (error) {
      console.error('Pairing error:', error);
      setRobotPaired(false);
    } finally {
      setIsLoading(false);
      setActiveStep(2); // Move to result step
    }
  };

  const resetWalkthrough = () => {
    setActiveStep(0);
    resetState();
  };

  return (
    <div className='w-full'>
      <Stepper
        value={activeStep}
        onValueChange={setActiveStep}
        className='mb-10 w-full'
      >
        {/* Step 1: Introduction */}
        <StepperItem step={0} completed={activeStep > 0}>
          <StepperTrigger>
            <StepperIndicator />
            <div className='text-center'>
              <StepperTitle>Introduction</StepperTitle>
              <StepperDescription>
                Learn about the pairing process
              </StepperDescription>
            </div>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        {/* Step 2: Pairing */}
        <StepperItem
          step={1}
          completed={activeStep > 1}
          loading={isLoading && activeStep === 1}
        >
          <StepperTrigger>
            <StepperIndicator />
            <div className='text-center'>
              <StepperTitle>Pair Robot</StepperTitle>
              <StepperDescription>Enter your robot number</StepperDescription>
            </div>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        {/* Step 3: Result/Dashboard */}
        <StepperItem step={2} disabled={activeStep < 2}>
          <StepperTrigger>
            <StepperIndicator />
            <div className='text-center'>
              <StepperTitle>Status</StepperTitle>
              <StepperDescription>
                {robotPaired ? 'Connected' : 'Connection Status'}
              </StepperDescription>
            </div>
          </StepperTrigger>
        </StepperItem>
      </Stepper>

      <div className='mt-8 rounded-md border p-6'>
        {activeStep === 0 && (
          <IntroductionStep onContinue={() => setActiveStep(1)} />
        )}

        {activeStep === 1 && (
          <PairingStep
            robotNumber={robotNumber}
            setRobotNumber={setRobotNumber}
            onPair={handlePairRobot}
            isLoading={isLoading}
          />
        )}

        {activeStep === 2 && (
          <ResultStep
            status={robotPaired}
            robotNumber={robotNumber}
            onReset={resetWalkthrough}
          />
        )}
      </div>
    </div>
  );
}
