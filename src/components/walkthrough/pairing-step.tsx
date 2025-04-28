"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoaderCircle, Smartphone, Terminal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { executeCommand } from "@/lib/command"

interface PairingStepProps {
  robotNumber: number
  setRobotNumber: (value: number) => void
  onPair: () => void
  isLoading: boolean
}

export default function PairingStep({ robotNumber, setRobotNumber, onPair, isLoading }: PairingStepProps) {
  const [error, setError] = useState<string>("")
  const [pairingStatus, setPairingStatus] = useState<string>("")
  const [pairingStage, setPairingStage] = useState<number>(0) // 0: not started, 1: pairing, 2: bridge
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up timeout if component unmounts during pairing process
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!robotNumber || robotNumber <= 0 || robotNumber >= 100) {
      setError("Please enter a number between 1 and 99")
      return
    }
    
    setError("")
    startPairingProcess()
  }

  const startPairingProcess = async () => {
    setPairingStage(1)
    setPairingStatus("Initiating pairing process...")
    
    // Set a 2-minute timeout
    timeoutRef.current = setTimeout(() => {
      if (pairingStage < 2) { // If still in the pairing process
        setPairingStatus(prev => `${prev}\nError: Could not establish connection with the robot. The process timed out after 2 minutes.`)
        setError("Failed to establish connection with the robot within 2 minutes. Please try again.")
        setPairingStage(0)
      }
    }, 2 * 60 * 1000) // 2 minutes in milliseconds
    
    try {
      // Step 1: Run the pairing command
      setPairingStatus(prev => `${prev}\nPairing command executed. Waiting for confirmation...`);
      const pairResult = await executeCommand(`waffle ${robotNumber} pair`);
      
      // Step 2: Start the bridge
      setPairingStatus(prev => `${prev}\nConfirmation received. Starting bridge connection...`);
      setPairingStage(2);
      
      const bridgeResult = await executeCommand(`waffle ${robotNumber} bridge`);
      setPairingStatus(prev => `${prev}\nBridge connection established successfully.`);
      
      // Wait a moment to simulate the bridge starting up
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Clear the timeout since we succeeded
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Notify parent component of successful pairing
      onPair();
      
    } catch (error) {
      console.error("Pairing error:", error);
      setError("Failed to complete the pairing process. Please try again.");
      setPairingStatus(prev => `${prev}\nError: Failed to establish connection.`);
      setPairingStage(0);
      
      // Clear the timeout since we've already failed
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    if (value === "") {
      setRobotNumber(0)
      setError("")
    } else {
      const num = parseInt(value, 10)
      if (isNaN(num) || num <= 0 || num >= 100) {
        setError("Please enter a number between 1 and 99")
      } else {
        setError("")
      }
      setRobotNumber(num)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-purple-100 p-6 rounded-full mb-6">
        <Smartphone className="h-16 w-16 text-purple-600" />
      </div>

      <h2 className="text-xl font-bold mb-4">Pair with Your TurtleBot3</h2>

      <p className="text-gray-600 mb-6 max-w-lg text-center">
        Enter your robot's number to begin the pairing process. This number is assigned to your 
        TurtleBot3 and will be used to establish a connection.
      </p>

      {pairingStage === 0 ? (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div className="space-y-2">
            <label htmlFor="robot-number" className="text-sm font-medium">
              Robot Number
            </label>
            <Input
              id="robot-number"
              placeholder="e.g. 25"
              value={robotNumber === 0 ? "" : robotNumber.toString()}
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
            disabled={robotNumber === 0 || isLoading || !!error}
          >
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              "Start Pairing Process"
            )}
          </Button>
        </form>
      ) : (
        <div className="w-full max-w-md space-y-4">
          <Alert variant="default" className="bg-gray-100">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Pairing Progress</AlertTitle>
            <AlertDescription className="font-mono text-xs whitespace-pre-wrap mt-2">
              {pairingStatus}
            </AlertDescription>
          </Alert>
          
          {pairingStage === 1 && (
            <div className="flex justify-center">
              <LoaderCircle className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          )}
          
          {pairingStage === 2 && (
            <div className="flex justify-center">
              <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          )}
          
          <p className="text-sm text-center text-gray-500">
            {pairingStage === 1 ? (
              "Pairing with TurtleBot3... Please wait."
            ) : (
              "Establishing bridge connection... This may take a moment."
            )}
          </p>
        </div>
      )}
    </div>
  )
}