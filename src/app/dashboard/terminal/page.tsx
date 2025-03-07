"use client";

import Code from "@/components/code";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { executeCommand } from "@/lib/command";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TerminalPage() {
	const [output, setOutput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [command, setCommand] = useState("");
	const outputEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [output]);

	const runCommand = async () => {
		if (!command.trim()) return;

		setIsLoading(true);
		try {
			const data = await executeCommand(command);

			if (data.error && data.error.trim()) {
				setOutput(
					(prev) => prev + "\n" + formatCommandLine(command) + "\n" + data.error
				);
			} else {
				setOutput(
					(prev) =>
						prev + "\n" + formatCommandLine(command) + "\n" + data.output
				);
			}
			setCommand(""); // Clear the input after execution
		} catch (error: any) {
			setOutput(
				(prev) =>
					prev +
					"\n\n" +
					formatCommandLine(command) +
					"\n" +
					"Error: " +
					error.message
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Format command line with colors
	const formatCommandLine = (cmd: string) => {
		return `__PROMPT__$ ros2 __CMD__${cmd}__END__`;
	};

	// Render a line with proper styling
	const renderLine = (line: string) => {
		if (line.includes("__PROMPT__")) {
			const parts = line.split("__PROMPT__")[1].split("__CMD__");
			const prompt = parts[0]; // "$ ros2 "
			const commandWithEnd = parts[1]; // "command__END__"
			const command = commandWithEnd.split("__END__")[0];

			return (
				<div className="min-h-[10px]">
					<span className="text-green-600">{prompt.split(" ")[0]}</span>
					<span className="text-gray-400"> ros2 </span>
					<span className="text-cyan-600">{command}</span>
				</div>
			);
		}
		return <div className="min-h-[10px]">{line}</div>;
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !isLoading) {
			runCommand();
		}
	};

	return (
		<div className="flex flex-col space-y-4 h-[85vh] lg:h-auto">
			<h1 className="text-xl">Terminal</h1>
			<p>
				You are able to run <Code>ros2</Code> commands using the input below.
				Press enter or the send arrow when you want to send a command.
			</p>
			<div className="flex w-full">
				<div className="relative">
					<span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
						ros2
					</span>
					<Input
						className="peer ps-12 pe-9"
						placeholder="command"
						onKeyDown={handleKeyDown}
						disabled={isLoading}
						value={command}
						onChange={(e) => setCommand(e.target.value)}
					/>
					<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50"></div>
					<button
						className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
						aria-label="Submit command"
						disabled={isLoading}
						onClick={runCommand}
					>
						{isLoading ? (
							<Spinner className="text-zinc-500" variant="ellipsis" />
						) : (
							<ArrowRightIcon size={16} aria-hidden="true" />
						)}
					</button>
				</div>
			</div>
			<div
				id="output"
				className="min-w-[200px] font-mono h-full max-h-full lg:min-h-[75vh] lg:max-h-[75h] overflow-y-auto border rounded-md p-2"
			>
				{output === "" ? (
					<div className="text-muted-foreground/80 p-2 italic ">No output</div>
				) : (
					output.split("\n").map((line, index) => renderLine(line))
				)}
				<div ref={outputEndRef} />
			</div>
		</div>
	);
}
