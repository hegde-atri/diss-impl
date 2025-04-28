"use client";

import * as React from "react";
import {
	AudioWaveform,
	BookOpen,
	Bot,
	Command,
	Frame,
	GalleryVerticalEnd,
	Joystick,
	Link as LinkIcon,
	Map,
	Network,
	PieChart,
	Settings2,
	SquareTerminal,
} from "lucide-react";

import { NavResources } from "@/components/nav-resources";
import { NavTools } from "@/components/nav-tools";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

// This is sample data.
const data = {
	navMain: [
		{
			title: "Tutorials",
			url: "#",
			icon: Map,
			isActive: true,
			items: [
				{
					title: "Topics",
					url: "/dashboard/tutorials/topics",
				},
				{
					title: "Teleoperation",
					url: "/dashboard/tutorials/teleoperation",
				},
			],
		},
		{
			title: "Documentation",
			url: "#",
			icon: BookOpen,
			isActive: true,
			items: [
				{
					title: "Introduction",
					url: "/dashboard/docs/introduction",
				},
				{
					title: "Pairing",
					url: "/dashboard/docs/pairing",
				},
				{
					title: "Teleoperation",
					url: "/dashboard/docs/teleoperation",
				},
			],
		},
	],
	projects: [
		{
			name: "Pairing",
			url: "/dashboard/pairing",
			icon: LinkIcon,
		},
		{
			name: "Teleoperation",
			url: "/dashboard/tele",
			icon: Joystick,
		},
		{
			name: "Topic Explorer",
			url: "/dashboard/topic",
			icon: Network,
		},
		{
			name: "Terminal",
			url: "/dashboard/terminal",
			icon: SquareTerminal,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const waffle = {
		number: 2,
	};
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<Link href="/">
				<h1 className="overflow-hidden whitespace-nowrap">TB3 Dashboard</h1>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<NavTools projects={data.projects} />
				<NavResources items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
