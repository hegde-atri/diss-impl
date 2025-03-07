"use client"

import { Button } from "@/components/ui/button"
import { BotIcon as RobotIcon } from "lucide-react"

interface IntroductionStepProps {
  onContinue: () => void
}

export default function IntroductionStep({ onContinue }: IntroductionStepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-blue-100 p-6 rounded-full mb-6">
        <RobotIcon className="h-16 w-16 text-blue-600" />
      </div>

      <h2 className="text-xl font-bold mb-4">Welcome to Robot Pairing</h2>

      <p className="text-gray-600 mb-6 max-w-lg">
        This walkthrough will guide you through the process of pairing with your robot. You'll need your robot's 
        number to complete the pairing process.
      </p>

      <div className="space-y-4 mb-6 bg-amber-50 p-4 rounded-lg w-full max-w-md">
        <h3 className="font-medium text-amber-800">Before you begin:</h3>
        <ul className="list-disc list-inside text-left text-amber-700 space-y-2">
          <li>Make sure your robot is powered on</li>
          <li>Have your robot number ready (found on the top of your robot)</li>
        </ul>
      </div>

      <Button onClick={onContinue} size="lg">
        Begin Pairing
      </Button>
    </div>
  )
}

