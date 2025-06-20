'use client';

import * as React from 'react';
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
  Wifi,
  WifiOff,
} from 'lucide-react';

import { NavResources } from '@/components/nav-resources';
import { NavTools } from '@/components/nav-tools';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { useRobotStore } from '@/store/robot-store';
import { useConnectionStatus } from '@/hooks/use-connection-status';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const data = {
  navMain: [
    {
      title: 'Tutorials',
      url: '#',
      icon: Map,
      isActive: true,
      items: [
        {
          title: 'Topics',
          url: '/dashboard/tutorials/topics',
        },
        {
          title: 'Teleoperation',
          url: '/dashboard/tutorials/teleoperation',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: 'Introduction',
          url: '/dashboard/docs/introduction',
        },
        {
          title: 'Pairing',
          url: '/dashboard/docs/pairing',
        },
        {
          title: 'Teleoperation',
          url: '/dashboard/docs/teleoperation',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Pairing',
      url: '/dashboard/pairing',
      icon: LinkIcon,
    },
    {
      name: 'Teleoperation',
      url: '/dashboard/tele',
      icon: Joystick,
    },
    {
      name: 'Topic Explorer',
      url: '/dashboard/topic',
      icon: Network,
    },
    {
      name: 'Terminal',
      url: '/dashboard/terminal',
      icon: SquareTerminal,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const robotNumber = useRobotStore((state) => state.robotNumber);
  const robotPaired = useRobotStore((state) => state.robotPaired);

  // Use the connection status hook to check every 5 seconds
  const { isChecking, lastChecked } = useConnectionStatus(5000);

  // Get the sidebar state to determine if it's collapsed
  const { state, isMobile } = useSidebar();
  const isExpanded = state === 'expanded' || isMobile;

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <Link href='/'>
          <div className='flex w-full items-center justify-between'>
            <h1 className='overflow-hidden whitespace-nowrap'>TB3 Dashboard</h1>

            {robotNumber > 0 && isExpanded && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      {robotPaired ? (
                        <Badge
                          variant='outline'
                          className='ml-2 flex items-center gap-1 border-green-200 bg-green-100 text-green-800'
                        >
                          <Wifi className='h-3 w-3' />
                          <span className='text-xs'>TB3-{robotNumber}</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant='outline'
                          className='ml-2 flex items-center gap-1 border-red-200 bg-red-100 text-red-800'
                        >
                          <WifiOff className='h-3 w-3' />
                          <span className='text-xs'>Disconnected</span>
                        </Badge>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='right'>
                    {robotPaired
                      ? `Connected to TurtleBot3 #${robotNumber}`
                      : `Not connected to TurtleBot3 #${robotNumber}`}
                    <br />
                    {lastChecked && (
                      <span className='text-xs text-muted-foreground'>
                        Last checked: {lastChecked.toLocaleTimeString()}
                      </span>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
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
