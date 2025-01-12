import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Link, Users, Settings } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const CollaborationDrawer: React.FC = () => {
  const [permission, setPermission] = useState("read");
  const [sessionLink, setSessionLink] = useState("");
  const [sessionId, setSessionId] = useState("");

  // Generate a unique session ID and link
  const generateSessionDetails = () => {
    const id = uuidv4(); // Generate unique ID
    const baseUrl = `http://localhost:3000`; 
    const link = `${baseUrl}/codeeditor/${id}`;
    setSessionId(id);
    setSessionLink(link);
    return { id, link };
  };

  // Initialize session on first render
  React.useEffect(() => {
    if (!sessionId || !sessionLink) generateSessionDetails();
  }, []);

  // Copy session link to clipboard
  const copyLink = () => {
    navigator.clipboard.writeText(sessionLink);
    toast.success("Link copied to clipboard!", {
      description: `Session ID: ${sessionId}`,
    });
  };

  // Share session link via different platforms
  const shareLink = (platform: string) => {
    const { link } = sessionLink
      ? { link: sessionLink }
      : generateSessionDetails();
    switch (platform) {
      case "slack":
        toast.info("Slack sharing coming soon!");
        break;
      case "discord":
        toast.info("Discord sharing coming soon!");
        break;
      case "email":
        window.location.href = `mailto:?body=Join%20our%20coding%20session:%20${link}`;
        break;
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 
                     shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-600/60 
                     border-none neon-pulse"
        >
          <Users className="mr-2" /> Collaborate
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-gray-900 text-white">
        <DrawerHeader>
          <DrawerTitle className="text-purple-400">
            Collaboration Settings
          </DrawerTitle>
          <DrawerDescription className="text-gray-400">
            Invite collaborators and manage session permissions
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 space-y-4">
          {/* Session ID and Link Section */}
          <div className="bg-gray-800 p-4 rounded-lg space-y-2">
            <div className="flex items-center space-x-4">
              <Link className="text-purple-500" />
              <input
                type="text"
                value={sessionLink || generateSessionDetails().link}
                readOnly
                className="flex-grow bg-transparent text-gray-300 outline-none"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={copyLink}
                className="text-purple-400 hover:bg-purple-900/30"
              >
                <Copy className="h-5 w-5" />
              </Button>
            </div>
            <div className="text-sm text-gray-400">
              <span className="font-bold text-purple-400">Session ID:</span>{" "}
              {sessionId}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Settings className="text-purple-500" />
            <Select value={permission} onValueChange={setPermission}>
              <SelectTrigger className="w-[180px] bg-gray-800 text-white border-purple-700">
                <SelectValue placeholder="Permissions" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border-purple-700">
                <SelectItem value="read" className="focus:bg-purple-900">
                  Read Only
                </SelectItem>
                <SelectItem value="write" className="focus:bg-purple-900">
                  Read & Write
                </SelectItem>
                <SelectItem value="admin" className="focus:bg-purple-900">
                  Full Access
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Share Options */}
          <div className="space-y-2">
            <p className="text-gray-400 mb-2">Share via:</p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareLink("slack")}
                className="bg-[#4A154B] hover:bg-[#6D1F69] text-white"
              >
                <img
                  src="/api/placeholder/20/20"
                  alt="Slack"
                  className="mr-2"
                />{" "}
                Slack
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareLink("discord")}
                className="bg-[#5865F2] hover:bg-[#7983F5] text-white"
              >
                <img
                  src="/api/placeholder/20/20"
                  alt="Discord"
                  className="mr-2"
                />{" "}
                Discord
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareLink("email")}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                <img
                  src="/api/placeholder/20/20"
                  alt="Email"
                  className="mr-2"
                />{" "}
                Email
              </Button>
            </div>
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose>
            <Button
              variant="outline"
              className="w-full bg-purple-700 text-white hover:bg-purple-800"
              onClick={() => {
                window.open(sessionLink, "_blank");
              }}
            >
              Start Collaboration 🤖🤖🤖
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CollaborationDrawer;
