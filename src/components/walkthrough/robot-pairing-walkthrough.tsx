"use client"

import { useState } from "react"
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
  const [batteryLevel, setBatteryLevel] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [pairingInProgress, setPairingInProgress] = useState(false)

  const handlePairRobot = async () => {
    if (!robotNumber) return

    setIsLoading(true)
    setPairingInProgress(true)

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

    setPairingInProgress(false)
    setIsLoading(false)
    setActiveStep(2) // Move to result step
  }

  const resetWalkthrough = () => {
    setActiveStep(0)
    setRobotNumber(0)
    setRobotPaired(false)
    setBatteryLevel(0)
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

      <div className="mt-8 p-6 border rounded-lg">
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