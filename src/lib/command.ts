import { CommandOutput, CommandResponse } from "./types";

/**
 * Function to execute a ROS2 command by sending a POST request to the API
 * @param command - The command string to execute
 * @returns Promise that resolves to the response data
 */
export async function executeCommand(command: string) {
  try {
    const response = await fetch('/api/ros2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to execute command');
    }

    return await response.json();
  } catch (error) {
    console.error('Error executing command:', error);
    throw error;
  }
}