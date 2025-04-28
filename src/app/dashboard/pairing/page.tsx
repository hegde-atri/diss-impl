'use client';

import RobotPairingWalkthrough from '@/components/walkthrough/robot-pairing-walkthrough';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PairingPage() {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Robot Pairing</h1>
        <p className="text-muted-foreground">Connect to your TurtleBot3 to begin controlling it</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>TurtleBot3 Connection</CardTitle>
          <CardDescription>Follow the steps below to pair with your robot</CardDescription>
        </CardHeader>
        <CardContent>
          <RobotPairingWalkthrough />
        </CardContent>
      </Card>
    </div>
  );
}