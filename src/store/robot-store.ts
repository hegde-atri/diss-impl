import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RobotState {
  robotNumber: number;
  robotPaired: boolean;
  batteryLevel: number;
  setRobotNumber: (number: number) => void;
  setRobotPaired: (paired: boolean) => void;
  setBatteryLevel: (level: number) => void;
  resetState: () => void;
}

export const useRobotStore = create<RobotState>()(
  persist(
    (set) => ({
      robotNumber: 0,
      robotPaired: false,
      batteryLevel: 0,
      setRobotNumber: (number) => set({ robotNumber: number }),
      setRobotPaired: (paired) => set({ robotPaired: paired }),
      setBatteryLevel: (level) => set({ batteryLevel: level }),
      resetState: () => set({ robotNumber: 0, robotPaired: false, batteryLevel: 0 }),
    }),
    {
      name: 'robot-storage', // unique name for localStorage
    }
  )
);