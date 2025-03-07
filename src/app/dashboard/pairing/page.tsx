  'use client';
import RobotPairingWalkthrough from '@/components/walkthrough/robot-pairing-walkthrough';
import { useRobotStore } from '@/store/robot-store';

export default function PairingPage() {
  const robotNumber = useRobotStore((state) => state.robotNumber);
  const setRobotNumber = useRobotStore((state) => state.setRobotNumber);
  
  return (
    <div className="flex flex-col space-y-4 items-start">
      <RobotPairingWalkthrough />
      {/* <h2>Current Robot: {robotNumber ?? 'None selected'}</h2>
      <Button onClick={() => setRobotNumber(1)}>Select Robot 1</Button>
      <Button onClick={() => setRobotNumber(2)}>Select Robot 2</Button>
      <Button onClick={() => setRobotNumber(3)}>Select Robot 3</Button> */}
    </div>
  );
}