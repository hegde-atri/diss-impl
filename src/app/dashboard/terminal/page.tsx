'use client';

import React, { useEffect, useRef, useState } from 'react';
import Code from '@/components/code';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { executeCommand } from '@/lib/command';
import { ArrowRightIcon, InfoIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TerminalPage() {
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [command, setCommand] = useState('');
  const outputEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Check if command needs --once suggestion
  const needsOnceHint = (cmd: string): boolean => {
    let commandToExecute = cmd.trim();
    if (commandToExecute.toLowerCase().startsWith('ros2 ')) {
      commandToExecute = commandToExecute.substring(5).trim();
    }
    const commandsThatNeedOnce = [
      'topic echo',
      'topic list',
      'node list',
      'service list',
    ];

    // Don't show hint if --once is already in the command
    if (cmd.includes('--once')) return false;

    return commandsThatNeedOnce.some((needsOnceCmd) =>
      cmd.trim().startsWith(needsOnceCmd)
    );
  };

  const runCommand = async () => {
    if (!command.trim()) return;

    // Remove leading "ros2" if it exists
    let commandToExecute = command.trim();
    if (commandToExecute.toLowerCase().startsWith('ros2 ')) {
      commandToExecute = commandToExecute.substring(5).trim();
    }

    setIsLoading(true);

    // Set timeout for 10 seconds
    timeoutRef.current = setTimeout(() => {
      // Don't need to check isLoading here - if this timeout runs, we need to reset
      setOutput(
        (prev) =>
          prev +
          '\n' +
          formatCommandLine(commandToExecute) +
          '\n' +
          'Command is taking too long to complete. It may be running continuously. ' +
          "Consider using --once flag for commands like 'topic echo'."
      );
      setIsLoading(false);
      setCommand('');

      // Make sure to nullify timeout reference
      timeoutRef.current = null;
    }, 10000);

    try {
      const fullCommand = `ros2 ${commandToExecute}`;
      const data = await executeCommand(fullCommand);

      // Clear timeout since we got a response
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (data.error && data.error.trim()) {
        setOutput(
          (prev) =>
            prev +
            '\n' +
            formatCommandLine(commandToExecute) +
            '\n' +
            data.error
        );
      } else {
        setOutput(
          (prev) =>
            prev +
            '\n' +
            formatCommandLine(commandToExecute) +
            '\n' +
            data.output
        );
      }
      setCommand(''); // Clear the input after execution
    } catch (error: any) {
      // Clear timeout since we got a response
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setOutput(
        (prev) =>
          prev +
          '\n\n' +
          formatCommandLine(commandToExecute) +
          '\n' +
          'Error: ' +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      // Clear any remaining timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Always reset loading state regardless of timeout status
      setIsLoading(false);
    }
  };

  // Format command line with colors
  const formatCommandLine = (cmd: string) => {
    return `__PROMPT__$ ros2 __CMD__${cmd}__END__`;
  };

  // Render a line with proper styling
  const renderLine = (line: string) => {
    if (line.includes('__PROMPT__')) {
      const parts = line.split('__PROMPT__')[1].split('__CMD__');
      const prompt = parts[0]; // "$ ros2 "
      const commandWithEnd = parts[1]; // "command__END__"
      const command = commandWithEnd.split('__END__')[0];

      return (
        <div className='min-h-[10px]'>
          <span className='text-green-600'>{prompt.split(' ')[0]}</span>
          <span className='text-gray-400'> ros2 </span>
          <span className='text-cyan-600'>{command}</span>
        </div>
      );
    }
    return <div className='min-h-[10px]'>{line}</div>;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      runCommand();
    }
  };

  return (
    <div className='flex h-[85vh] flex-col space-y-4 lg:h-auto'>
      <h1 className='text-xl'>Terminal</h1>
      <p>
        You are able to run <Code>ros2</Code> commands using the input below.
        Press enter or the send arrow when you want to send a command.
      </p>
      <div className='flex w-full'>
        <div className='relative w-full'>
          <span className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground peer-disabled:opacity-50'>
            ros2
          </span>
          <Input
            className='peer w-full pe-9 ps-12'
            placeholder='command'
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
          <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50'></div>
          <button
            className='absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
            aria-label='Submit command'
            disabled={isLoading}
            onClick={runCommand}
          >
            {isLoading ? (
              <Spinner className='text-zinc-500' variant='ellipsis' />
            ) : (
              <ArrowRightIcon size={16} aria-hidden='true' />
            )}
          </button>
        </div>
      </div>
      {needsOnceHint(command) && (
        <Alert variant='default' className='border-blue-200 bg-blue-50'>
          <InfoIcon className='h-4 w-4 text-blue-500' />
          <AlertDescription>
            Tip: Add <Code>--once</Code> to this command to prevent it from
            running continuously.
          </AlertDescription>
        </Alert>
      )}
      <div
        id='output'
        className='h-full max-h-full min-w-[200px] overflow-y-auto rounded-md border p-2 font-mono lg:max-h-[75h] lg:min-h-[75vh]'
      >
        {output === '' ? (
          <div className='p-2 italic text-muted-foreground/80'>No output</div>
        ) : (
          output
            .split('\n')
            .map((line, index) => (
              <React.Fragment key={`line-${index}`}>
                {renderLine(line)}
              </React.Fragment>
            ))
        )}
        <div ref={outputEndRef} />
      </div>
    </div>
  );
}
