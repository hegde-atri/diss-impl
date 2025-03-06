import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDown, ArrowUp, RotateCcw, RotateCw } from "lucide-react";

export default function TelePage() {
	const buttonClass =
		"bg-zinc-800 text-white rounded-md flex justify-center items-center w-[100px] p-4";
	// TODO: play funny easter egg sound on robot.
	return (
		<section>
			<h1 className="font-bold text-2xl mb-5">Command Centre</h1>
			<div className="flex flex-col lg:grid lg:grid-cols-3 lg:grid-rows-4 lg:h-[85vh] lg:w-full gap-4">
				<div className="col-span-2 row-span-3 bg-gray-300 rounded-md"></div>
				<div className="flex flex-col col-span-1 row-span-3 border rounded-md items-center">
					<div className="flex flex-col w-full p-4 items-center h-full">
						<h2 className="text-xl font-semibold mb-3">Teleoperation</h2>

						<div className="flex flex-col w-full p-4 items-center justify-center h-full">
							{/* TODO: Live data */}
							<Card className="flex flex-col items-center w-[250px] mb-5  h-[100px]">
							</Card>
							{/* Control buttons */}
							<div className="flex flex-col items-center w-full">
								<div className={buttonClass}>
									<ArrowUp size={45} />
								</div>
								<div className="flex w-full justify-between">
									<div className={buttonClass}>
										<RotateCcw size={40} />
									</div>
									<div className={buttonClass}>
										<RotateCw size={40} />
									</div>
								</div>
								<div className={buttonClass}>
									<ArrowDown size={45} />
								</div>
							</div>
							{/* Form */}
							<div className="my-4">
								<div className="*:not-first:mt-2">
									<Label htmlFor="linear">Linear Speed</Label>
									<div className="relative">
										<Input
											id="linear"
											className="peer pe-12"
											placeholder="0.00"
											type="number"
										/>
										<span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
											m/s
										</span>
									</div>
								</div>

								<div className="*:not-first:mt-2">
									<Label htmlFor="angular">Angular Speed</Label>
									<div className="relative">
										<Input
											id="angular"
											className="peer pe-12"
											placeholder="0.00"
											type="number"
										/>
										<span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
											rad/s
										</span>
									</div>
								</div>
							</div>
							{/* Buttons */}
							<Button className="p-4 text-lg w-full" variant="secondary">
								Set
							</Button>
							<Button className="mt-4 p-4 text-lg w-full" variant="destructive">
								Stop
							</Button>
						</div>
					</div>
				</div>
				<div className="col-span-3 row-span-1 bg-gray-300 rounded-md"></div>
			</div>
		</section>
	);
}
