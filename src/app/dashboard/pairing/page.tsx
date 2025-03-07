'use client';
import RobotPairingWalkthrough from '@/components/walkthrough/robot-pairing-walkthrough';

export default function PairingPage() {
  
  return (
    <div className="flex flex-col space-y-4 items-start">
      <RobotPairingWalkthrough />
    </div>
  );
}