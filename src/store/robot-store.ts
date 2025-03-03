import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type RobotStore = {
  robotNumber: number | null;
  robotPaired: boolean;
  setRobotNumber: (number: number) => void;
  setRobotPaired: (paired: boolean) => void;
};

export const useRobotStore = create<RobotStore>()(
  persist(
    (set) => ({
      robotNumber: null,
      robotPaired: false,
      setRobotNumber: (number) => set({ robotNumber: number }),
      setRobotPaired: (paired) => set({ robotPaired: paired }),
    }),
    {
      name: 'robot-storage',
    }
  )
);
