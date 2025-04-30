'use client';

import RobotPairingWalkthrough from '@/components/walkthrough/robot-pairing-walkthrough';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PairingPage() {
  return (
    <div className="container">
          <RobotPairingWalkthrough />
    </div>
  );
}