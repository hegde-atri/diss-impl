"use client"

import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoaderCircle, Smartphone } from "lucide-react"

interface PairingStepProps {
  robotNumber: number | null
  setRobotNumber: (value: number) => void
  onPair: () => void
  isLoading: boolean
}

export default function PairingStep({ robotNumber, setRobotNumber, onPair, isLoading }: PairingStepProps) {
  const [error, setError] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (robotNumber === null || robotNumber <= 0 || robotNumber >= 100) {
      setError("Please enter a number between 1 and 99")
      return
    }
    
    setError("")
    onPair()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    if (value === "") {
      setRobotNumber(null as any) // Using as any since the interface expects number but we need to handle empty state
      setError("")
    } else {
      const num = parseInt(value, 10)
      if (isNaN(num) || num <= 0 || num >= 100) {
        setError("Please enter a number between 1 and 99")
        setRobotNumber(num) // Still set the number even if invalid to show in UI
      } else {
        setError("")
        setRobotNumber(num)
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-purple-100 p-6 rounded-full mb-6">
        <Smartphone className="h-16 w-16 text-purple-600" />
      </div>

      <h2 className="text-xl font-bold mb-4">Pair with Your Robot</h2>

      <p className="text-gray-600 mb-6 max-w-lg text-center">
        Enter your robot's number to begin the pairing process. This number can be found on the
        top of your robot or in your documentation.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div className="space-y-2">
          <label htmlFor="robot-number" className="text-sm font-medium">
            Robot Number
          </label>
          <Input
            id="robot-number"
            placeholder="e.g. 25"
            value={robotNumber === null ? "" : robotNumber.toString()}
            onChange={handleChange}
            className="w-full"
            required
            type="number"
            min="1"
            max="99"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500">
            {error || "Enter a number between 1 and 99"}
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={robotNumber === null || isLoading || !!error}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Pairing...
            </>
          ) : (
            "Pair Robot"
          )}
        </Button>
      </form>
    </div>
  )
}