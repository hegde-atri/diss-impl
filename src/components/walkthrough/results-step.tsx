"use client"

import { Button } from "@/components/ui/button"
import { Battery, BatteryFull, BatteryLow, BatteryMedium, CheckCircle, RefreshCw, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ResultStepProps {
  status: boolean
  robotNumber: number | null
  batteryLevel: number
  onReset: () => void
}

export default function ResultStep({ status, robotNumber, batteryLevel, onReset }: ResultStepProps) {
  if (status === true) {
    return (
      <div className="flex flex-col items-center">
        <div className="bg-green-100 p-6 rounded-full mb-6">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>

        <h2 className="text-xl font-bold mb-2">Pairing Successful!</h2>
        <p className="text-gray-600 mb-8 text-center">
          Your robot has been successfully paired. You can now monitor and control it.
        </p>

        <div className="w-full max-w-md bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Robot Dashboard</h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Robot ID</span>
                <span className="font-mono bg-gray-200 px-2 py-1 rounded text-sm">{robotNumber}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Battery Level</span>
                <span className="font-medium">{batteryLevel}%</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={batteryLevel} className="flex-1" />
                {batteryLevel > 70 ? (
                  <BatteryFull className="h-5 w-5 text-green-500" />
                ) : batteryLevel > 30 ? (
                  <BatteryMedium className="h-5 w-5 text-amber-500" />
                ) : (
                  <BatteryLow className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>

        <Button variant="outline" onClick={onReset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Start New Pairing
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-red-100 p-6 rounded-full mb-6">
        <XCircle className="h-16 w-16 text-red-600" />
      </div>

      <h2 className="text-xl font-bold mb-2">Pairing Failed</h2>
      <p className="text-gray-600 mb-6 max-w-lg text-center">
        We couldn't pair with your robot. Please make sure your robot is powered on, and that you've
        entered the correct robot number.
      </p>

      <div className="space-y-4 mb-6 bg-gray-50 p-4 rounded-lg w-full max-w-md">
        <h3 className="font-medium">Troubleshooting tips:</h3>
        <ul className="list-disc list-inside text-left text-gray-600 space-y-2">
          <li>Check that your robot is powered on</li>
          <li>Verify the robot number is correct</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onReset}>
          Try Again
        </Button>
      </div>
    </div>
  )
}

