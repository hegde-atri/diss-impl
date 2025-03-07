"use client"

import { useState } from "react"
import { AlertCircle, ChevronDown, Code, Copy, Eye, Info, MessageSquare, Send, Terminal } from "lucide-react"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample ROS topics data
const rosTopics = [
  {
    name: "/cmd_vel",
    description: "Command velocity topic used to control robot movement",
    type: "geometry_msgs/Twist",
    commands: {
      view: "ros2 topic echo /cmd_vel",
      publish:
        "ros2 topic pub /cmd_vel geometry_msgs/Twist '{linear: {x: 0.1, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 0.0}}'",
      info: "ros2 topic info /cmd_vel",
      type: "ros2 interface show geometry_msgs/Twist",
    },
  },
  {
    name: "/scan",
    description: "Laser scan data from the robot's sensors",
    type: "sensor_msgs/LaserScan",
    commands: {
      view: "ros2 topic echo /scan",
      publish:
        "ros2 topic pub /scan sensor_msgs/LaserScan '{header: {stamp: {sec: 0}, frame_id: \"laser\"}, angle_min: 0.0, angle_max: 1.0, angle_increment: 0.01, time_increment: 0.0, scan_time: 0.0, range_min: 0.0, range_max: 10.0, ranges: [1.0, 2.0], intensities: [1.0, 2.0]}'",
      info: "ros2 topic info /scan",
      type: "ros2 interface show sensor_msgs/LaserScan",
    },
  },
  {
    name: "/odom",
    description: "Odometry data for robot position tracking",
    type: "nav_msgs/Odometry",
    commands: {
      view: "ros2 topic echo /odom",
      publish:
        'ros2 topic pub /odom nav_msgs/Odometry \'{header: {stamp: {sec: 0}, frame_id: "odom"}, child_frame_id: "base_link"}\'',
      info: "ros2 topic info /odom",
      type: "ros2 interface show nav_msgs/Odometry",
    },
  },
  {
    name: "/tf",
    description: "Transform frames for coordinate transformations",
    type: "tf2_msgs/TFMessage",
    commands: {
      view: "ros2 topic echo /tf",
      publish:
        'ros2 topic pub /tf tf2_msgs/TFMessage \'{transforms: [{header: {stamp: {sec: 0}, frame_id: "world"}, child_frame_id: "base_link", transform: {translation: {x: 0.0, y: 0.0, z: 0.0}, rotation: {x: 0.0, y: 0.0, z: 0.0, w: 1.0}}]}\'',
      info: "ros2 topic info /tf",
      type: "ros2 interface show tf2_msgs/TFMessage",
    },
  },
  {
    name: "/camera/image_raw",
    description: "Raw camera image data",
    type: "sensor_msgs/Image",
    commands: {
      view: "ros2 topic echo /camera/image_raw",
      publish:
        'ros2 topic pub /camera/image_raw sensor_msgs/Image \'{header: {stamp: {sec: 0}, frame_id: "camera"}, height: 480, width: 640, encoding: "rgb8", is_bigendian: 0, step: 1920}\'',
      info: "ros2 topic info /camera/image_raw",
      type: "ros2 interface show sensor_msgs/Image",
    },
  },
]

export function TopicDashboard() {
  const [open, setOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(rosTopics[0])

  const copyToClipboard = async (text: string, commandType: string) => {
    try {
      await navigator.clipboard.writeText(text)

      // Show success toast notification
      toast.success("Copied to clipboard!", {
        description: commandType === "topic" ? `Topic name: ${text}` : `Command: ${commandType}`,
        duration: 2000,
      })
    } catch (err) {
      console.error("Failed to copy text: ", err)

      // Show error toast notification
      toast.error("Failed to copy to clipboard", {
        description: "Please try again or copy manually",
        duration: 3000,
      })
    }
  }

  return (
    <div className="container mx-auto px-4 mb-12">
      {/* Add Sonner Toaster component */}
      <Toaster position="bottom-right" richColors closeButton />

      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">ROS Topics Explorer</h1>
          <p className="text-muted-foreground">A beginner-friendly dashboard to explore and learn about ROS topics.</p>
        </div>

        <div className="flex flex-col gap-6">

            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Basic ROS 2 commands to help you get started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Terminal className="mr-2 h-4 w-4" />
                        <code className="text-sm">ros2 topic list</code>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard("ros2 topic list", "list")}
                        aria-label="Copy list command"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Lists all available topics in your ROS environment
                    </p>
                  </div>

                  <div className="rounded-md bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Terminal className="mr-2 h-4 w-4" />
                        <code className="text-sm">ros2 topic list -t</code>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard("ros2 topic list -t", "list-t")}
                        aria-label="Copy list with types command"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Lists all topics with their message types</p>
                  </div>

                  <div className="rounded-md bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Terminal className="mr-2 h-4 w-4" />
                        <code className="text-sm">ros2 topic hz /topic_name</code>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(`ros2 topic hz ${selectedTopic.name}`, "hz")}
                        aria-label="Copy hz command"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Shows the publishing rate of a topic</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Select a Topic</CardTitle>
              <CardDescription>Choose a ROS topic to explore</CardDescription>
            </CardHeader>
            <CardContent>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {selectedTopic ? selectedTopic.name : "Select a topic..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0">
                  <Command>
                    <CommandInput placeholder="Search topics..." />
                    <CommandList>
                      <CommandEmpty>No topics found.</CommandEmpty>
                      <CommandGroup>
                        {rosTopics.map((topic) => (
                          <CommandItem
                            key={topic.name}
                            onSelect={() => {
                              setSelectedTopic(topic)
                              setOpen(false)
                            }}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {topic.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedTopic.name}</CardTitle>
                    <CardDescription>Type: {selectedTopic.type}</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(selectedTopic.name, "topic")}
                    aria-label="Copy topic name"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p>{selectedTopic.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Topic Commands</CardTitle>
                <CardDescription>Common commands to interact with this topic</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="view">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="view" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" /> View
                    </TabsTrigger>
                    <TabsTrigger value="publish" className="flex items-center gap-2">
                      <Send className="h-4 w-4" /> Publish
                    </TabsTrigger>
                    <TabsTrigger value="info" className="flex items-center gap-2">
                      <Info className="h-4 w-4" /> Info
                    </TabsTrigger>
                    <TabsTrigger value="type" className="flex items-center gap-2">
                      <Code className="h-4 w-4" /> Type
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="view" className="mt-4">
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Terminal className="mr-2 h-4 w-4" />
                          <code className="text-sm">{selectedTopic.commands.view}</code>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(selectedTopic.commands.view, "view")}
                          aria-label="Copy view command"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      This command displays the messages being published to this topic in real-time.
                    </p>
                  </TabsContent>

                  <TabsContent value="publish" className="mt-4">
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Terminal className="mr-2 h-4 w-4" />
                          <code className="text-sm">{selectedTopic.commands.publish}</code>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(selectedTopic.commands.publish, "publish")}
                          aria-label="Copy publish command"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      This command publishes a sample message to the topic. You can modify the values to experiment.
                    </p>
                  </TabsContent>

                  <TabsContent value="info" className="mt-4">
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Terminal className="mr-2 h-4 w-4" />
                          <code className="text-sm">{selectedTopic.commands.info}</code>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(selectedTopic.commands.info, "info")}
                          aria-label="Copy info command"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      This command shows information about the topic, including publishers and subscribers.
                    </p>
                  </TabsContent>

                  <TabsContent value="type" className="mt-4">
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Terminal className="mr-2 h-4 w-4" />
                          <code className="text-sm">{selectedTopic.commands.type}</code>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(selectedTopic.commands.type, "type")}
                          aria-label="Copy type command"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      This command displays the message structure for this topic type.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Run these commands in your terminal with an active ROS 2 environment.
                </p>
              </CardFooter>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}

