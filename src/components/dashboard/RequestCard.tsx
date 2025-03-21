import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Coins, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RequestCardProps {
  id?: string;
  title?: string;
  description?: string;
  category?: "coding" | "studying" | "everyday";
  coinAmount?: number;
  type?: "request" | "offer";
  username?: string;
  timePosted?: string;
  onAccept?: () => void;
  onMessage?: () => void;
}

const RequestCard = ({
  id = "1",
  title = "Help with React Component",
  description = "I need assistance creating a custom hook for form validation in my React application.",
  category = "coding",
  coinAmount = 50,
  type = "request",
  username = "johndoe",
  timePosted = "2 hours ago",
  onAccept = () => console.log("Accept clicked"),
  onMessage = () => console.log("Message clicked"),
}: RequestCardProps) => {
  // Map categories to colors
  const categoryColors = {
    coding: "bg-blue-100 text-blue-800",
    studying: "bg-purple-100 text-purple-800",
    everyday: "bg-green-100 text-green-800",
  };

  return (
    <Card className="w-full max-w-[380px] h-[220px] flex flex-col bg-white overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className={cn("font-normal", categoryColors[category])}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{timePosted}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center text-amber-600 font-medium">
            <Coins className="h-4 w-4 mr-1" />
            <span>{coinAmount}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden">
        <CardDescription className="text-sm line-clamp-3">
          {description}
        </CardDescription>
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <User className="h-3 w-3 mr-1" />
          <span>{username}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex justify-between">
        <Button
          variant="default"
          size="sm"
          onClick={onAccept}
          className={
            type === "request"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-green-600 hover:bg-green-700"
          }
        >
          {type === "request" ? "Offer Help" : "Accept Offer"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onMessage}
          className="flex items-center"
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Message
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RequestCard;
