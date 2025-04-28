"use client"

import { useEffect, useState } from "react"
import { AlertCircle, ChevronDown, Code, Copy, Eye, Info, Loader2, MessageSquare, RefreshCw, Send, Terminal } from "lucide-react"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { executeCommand } from "@/lib/command"

interface Topic {
  name: string
  type: string
  description?: string
  publishers?: number
  subscribers?: number
  typeDetails?: string
  commands: {
    view: string
    publish: string
    info: string
    type: string
  }
}

export function TopicDashboard() {
  const [open, setOpen] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [typeDetails, setTypeDetails] = useState<string>("")
  const [loadingTypeDetails, setLoadingTypeDetails] = useState(false)
  const [topicData, setTopicData] = useState<string>("")
  const [loadingTopicData, setLoadingTopicData] = useState(false)

  // Function to fetch topics
  const fetchTopics = async () => {
    try {
      setRefreshing(true)
      // Get topics with their types
      const topicsResponse = await executeCommand("ros2 topic list -t");
      
      if (topicsResponse.error) {
        toast.error("Error fetching topics", {
          description: topicsResponse.error,
        });
        return;
      }

      const topicsOutput = topicsResponse.output || "";
      
      // Parse topics from output
      const topicsArray = topicsOutput
        .trim()
        .split("\n")
        .filter((line: string) => line.trim() !== "")
        .map((topic: string) => {
          // With the -t flag, the format is "/topic_name [type_name]"
          const parts = topic.match(/^(\/[^\s]+)\s+\[([^\]]+)\]$/);
          
          if (!parts) {
            // Fallback in case the format doesn't match
            const name = topic.trim();
            return {
              name: name,
              type: "Unknown",
              description: `ROS2 topic with unknown type`,
              commands: {
                view: `ros2 topic echo ${name}`,
                publish: `ros2 topic pub ${name} std_msgs/String "{}"`,
                info: `ros2 topic info ${name}`,
                type: `ros2 interface show std_msgs/String`,
              }
            };
          }
          
          const name = parts[1].trim();
          const type = parts[2].trim();
          
          return {
            name: name,
            type: type,
            description: `ROS2 topic of type ${type}`,
            commands: {
              view: `ros2 topic echo ${name}`,
              publish: `ros2 topic pub ${name} ${type} '{}'`,
              info: `ros2 topic info ${name}`,
              type: `ros2 interface show ${type}`,
            }
          };
        });

      setTopics(topicsArray);
      if (topicsArray.length > 0 && !selectedTopic) {
        setSelectedTopic(topicsArray[0]);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      toast.error("Failed to fetch topics", {
        description: "Please check if ROS2 is running",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Function to view topic details
  const viewTopicInfo = async (topic: Topic) => {
    if (!topic) return;

    try {
      setLoadingTopicData(true);
      
      // Debug log to verify the exact command being executed
      console.log("Executing topic info command:", topic.commands.info);
      
      const infoResponse = await executeCommand(topic.commands.info);
      
      if (infoResponse.error) {
        console.error("Error response from topic info:", infoResponse.error);
        toast.error("Error fetching topic info", {
          description: infoResponse.error,
        });
        return;
      }

      setTopicData(infoResponse.output || "No data available");
    } catch (error) {
      console.error("Error fetching topic info:", error);
      toast.error("Failed to get topic information");
    } finally {
      setLoadingTopicData(false);
    }
  };

  // Function to get type details
  const getTypeDetails = async (topic: Topic) => {
    if (!topic || !topic.type || topic.type === "Unknown") return;

    try {
      setLoadingTypeDetails(true);
      const typeResponse = await executeCommand(topic.commands.type);
      
      if (typeResponse.error) {
        toast.error("Error fetching type details", {
          description: typeResponse.error,
        });
        return;
      }

      setTypeDetails(typeResponse.output || "No type details available");
    } catch (error) {
      console.error("Error fetching type details:", error);
      toast.error("Failed to get type details");
    } finally {
      setLoadingTypeDetails(false);
    }
  };

  // Initial load of topics
  useEffect(() => {
    fetchTopics();
  }, []);

  // Fetch topic info when a topic is selected
  useEffect(() => {
    if (selectedTopic) {
      viewTopicInfo(selectedTopic);
      getTypeDetails(selectedTopic);
    }
  }, [selectedTopic]);

  // Handle topic selection change
  const handleTopicChange = (value: string) => {
    const topic = topics.find(t => t.name === value);
    if (topic) {
      setSelectedTopic(topic);
    }
  };

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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Topics Explorer</h1>
            <Button 
              variant="outline"
              onClick={fetchTopics}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              {refreshing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refresh Topics
                </>
              )}
            </Button>
          </div>
          <p className="text-muted-foreground">A beginner-friendly dashboard to explore and learn about ROS topics.</p>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Select a Topic</CardTitle>
              <CardDescription>Choose a ROS topic to explore</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select onValueChange={handleTopicChange} defaultValue={selectedTopic?.name}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a topic..." />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic.name} value={topic.name}>
                        <div className="flex items-center justify-between w-full">
                          <span>{topic.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">{topic.type}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          {selectedTopic && (
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
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Topic Information</h3>
                      {loadingTopicData ? (
                        <div className="mt-2 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ) : (
                        <pre className="mt-2 whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                          {topicData}
                        </pre>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Message Type Details</h3>
                      {loadingTypeDetails ? (
                        <div className="mt-2 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ) : (
                        <pre className="mt-2 whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                          {typeDetails}
                        </pre>
                      )}
                    </div>
                  </div>
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
                        This command publishes a sample message to the topic. You might need to modify the values for your use case.
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
                          <code className="text-sm">ros2 topic hz {selectedTopic.name}</code>
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

