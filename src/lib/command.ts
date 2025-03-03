import { CommandOutput, CommandResponse } from "./types";

export async function executeCommand(command: string): Promise<CommandOutput> {
  const timestamp = new Date().toLocaleTimeString();
  
  try {
    const response = await fetch("/api/ros2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command }),
    });

    const data: CommandResponse = await response.json();

    if (data.error) {
      return { timestamp, content: data.error };
    }
    
    return { timestamp, content: data.output || "" };
  } catch (error: any) {
    return { 
      timestamp, 
      content: `Error: ${error.message}` 
    };
  }
}