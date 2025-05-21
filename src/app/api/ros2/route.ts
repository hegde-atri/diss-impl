import { exec } from 'child_process';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.command || typeof body.command !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: command string is required' },
        { status: 400 }
      );
    }

    return new Promise<Response>((resolve) => {
      exec(body.command, (error, stdout, stderr) => {
        if (error) {
          resolve(NextResponse.json({ error: error.message }, { status: 500 }));
          return;
        }

        resolve(
          NextResponse.json({
            output: stdout,
            error: stderr,
          })
        );
      });
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
