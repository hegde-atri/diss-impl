import { exec } from 'child_process';
import { NextResponse } from 'next/server';

export async function POST() {
  return new Promise((resolve) => {
    exec('echo "Hello World"', (error, stdout, stderr) => {
      if (error) {
        resolve(NextResponse.json({ error: error.message }));
        return;
      }
      
      resolve(NextResponse.json({ 
        output: stdout,
        error: stderr 
      }));
    });
  });
}
