import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RobotState {
  robotNumber: number;
  robotPaired: boolean;
  setRobotNumber: (number: number) => void;
  setRobotPaired: (paired: boolean) => void;
  resetState: () => void;
}

export const useRobotStore = create<RobotState>()(
  persist(
    (set) => ({
      robotNumber: 0,
      robotPaired: false,
      setRobotNumber: (number) => set({ robotNumber: number }),
      setRobotPaired: (paired) => set({ robotPaired: paired }),
      resetState: () => set({ robotNumber: 0, robotPaired: false }),
    }),
    {
      name: 'robot-storage', // unique name for localStorage
    }
  )
);