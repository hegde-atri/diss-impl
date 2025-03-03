"use client";

import Code from "@/components/code";
import InputRos2 from "@/components/input-ros2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TerminalPage() {
	const [output, setOutput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const outputEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [output]);

	const runCommand = async () => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/ros2", {
				method: "POST",
			});

			const data = await response.json();

			if (data.error) {
				setOutput((prev) => prev + "\n" + data.error);
			} else {
				setOutput((prev) => prev + "\n" + data.output);
			}
		} catch (error: any) {
			setOutput((prev) => prev + "\n" + "Error: " + error.message);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className="flex flex-col space-y-4">
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
					<Input className="peer ps-12 pe-9" placeholder="command" />
					<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50"></div>
					<button
						className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
						aria-label="Submit search"
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
				className="min-w-[200px] min-h-[75vh] max-h-[75h] overflow-y-auto border rounded-md p-2"
			>
				{output === "" ? (
					<div className="text-muted-foreground/80 p-2 italic ">No output</div>
				) : (
					output.split("\n").map((line, index) => <div key={index}>{line}</div>)
				)}
				<div ref={outputEndRef} />
			</div>
		</div>
	);
}
