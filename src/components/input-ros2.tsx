import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InputRos2() {
	return (
		<div className="*:not-first:mt-2">
			<div className="relative">
				<Input
					className="peer ps-16"
					placeholder="google.com"
					type="text"
				/>
				<span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
					ros2
				</span>
			</div>
		</div>
	);
}
