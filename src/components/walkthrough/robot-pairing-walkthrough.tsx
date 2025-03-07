  "use client"

import { useEffect, useState } from "react"
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
} from "@/components/ui/stepper"
import IntroductionStep from "./introduction-step"
import PairingStep from "./pairing-step"
import ResultStep from "./results-step"
import { useRobotStore } from '@/store/robot-store';

export default function RobotPairingWalkthrough() {
  const [activeStep, setActiveStep] = useState(0)
  const robotNumber = useRobotStore((state) => state.robotNumber);
  const setRobotNumber = useRobotStore((state) => state.setRobotNumber);
  const robotPaired = useRobotStore((state) => state.robotPaired);
  const setRobotPaired = useRobotStore((state) => state.setRobotPaired);
  const batteryLevel = useRobotStore((state) => state.batteryLevel);
  const setBatteryLevel = useRobotStore((state) => state.setBatteryLevel);
  const resetState = useRobotStore((state) => state.resetState);
  const [isLoading, setIsLoading] = useState(false)

  // Set initial step based on pairing status when component mounts
  useEffect(() => {
    if (robotPaired) {
      setActiveStep(2);
    }
  }, [robotPaired]);

  const handlePairRobot = async () => {
    if (!robotNumber) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate success/failure (80% success rate)
    const isSuccess = Math.random() < 0.8

    if (isSuccess) {
      setRobotPaired(true)
      // Generate random battery level between 10 and 100
      setBatteryLevel(Math.floor(Math.random() * 90) + 10)
    } else {
      setRobotPaired(false)
    }

    setIsLoading(false)
    setActiveStep(2) // Move to result step
  }

  const resetWalkthrough = () => {
    setActiveStep(0)
    resetState()
  }
  return (
    <div className="w-full">
      <Stepper value={activeStep} onValueChange={setActiveStep} className="mb-10 w-full">
        {/* Step 1: Introduction */}
        <StepperItem step={0} completed={activeStep > 0}>
          <StepperTrigger>
            <StepperIndicator />
            <div className="text-center">
              <StepperTitle>Introduction</StepperTitle>
              <StepperDescription>Learn about the pairing process</StepperDescription>
            </div>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>

        {/* Step 2: Pairing */}
        <StepperItem step={1} completed={activeStep > 1} loading={isLoading && activeStep === 1}>
          <StepperTrigger>
            <StepperIndicator />
            <div className="text-center">
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
            <div className="text-center">
              <StepperTitle>Result</StepperTitle>
              <StepperDescription>{robotPaired ? "Dashboard" : "Pairing status"}</StepperDescription>
            </div>
          </StepperTrigger>
        </StepperItem>
      </Stepper>

      <div className="mt-8 p-6 border rounded-md">
        {activeStep === 0 && <IntroductionStep onContinue={() => setActiveStep(1)} />}

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
            batteryLevel={batteryLevel}
            onReset={resetWalkthrough}
          />
        )}
      </div>
    </div>
  )
}