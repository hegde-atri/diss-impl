export async function executeCommand(command: string, silent: boolean = false) {
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
      if (silent) {
        // In silent mode, return error information rather than throwing
        return {
          error: true,
          output: errorData.error || 'Failed to execute command',
          exitCode: response.status,
        };
      }
      throw new Error(errorData.error || 'Failed to execute command');
    }

    return await response.json();
  } catch (error) {
    if (silent) {
      // In silent mode, return error information rather than re-throwing
      return {
        error: true,
        output: error instanceof Error ? error.message : 'Unknown error',
        exitCode: 1,
      };
    }
    console.error('Error executing command:', error);
    throw error;
  }
}
