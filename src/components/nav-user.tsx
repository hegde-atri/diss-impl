"use client";

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	FileSliders,
	LogOut,
	Sparkles,
	Unlink,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useRobotStore } from "@/store/robot-store";
import Link from "next/link";
import { useState } from "react";

export function NavUser({
	waffle,
}: {
	waffle: {
		number: number;
	};
}) {
	const { isMobile } = useSidebar();
	const robotNumber = useRobotStore((state) => state.robotNumber);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-10 rounded-lg">
								<AvatarImage src="/images/tb3.jpg" alt="Turtlebot 3 Waffle" />
								<AvatarFallback className="rounded-lg">TB3</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									Waffle Number: {robotNumber}
								</span>
								<span className="truncate text-xs">TurtleBot3 Waffle</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-10 rounded-lg">
									<AvatarImage src="/images/tb3.jpg" alt="Turtlebot 3 Waffle" />
									<AvatarFallback className="rounded-lg">TB3</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										Waffle Number: {robotNumber}
									</span>
									<span className="truncate text-xs">TurtleBot3 Waffle</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link href="/dashboard/pairing">
									<FileSliders />
									Robot settings
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-red-600" asChild>
							<Link href="/dashboard/pairing">
								<Unlink />
								Unpair
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
