import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { MessageCircle, Plus } from "lucide-react";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: string;
  unread: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: ChatMessage;
  unreadCount: number;
}

interface ChatPreviewProps {
  conversations?: Conversation[];
  onSelectConversation?: (conversationId: string) => void;
  onStartNewChat?: () => void;
}

const ChatPreview = ({
  conversations = [
    {
      id: "1",
      participantId: "user1",
      participantName: "Alex Johnson",
      participantAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      lastMessage: {
        id: "msg1",
        senderId: "user1",
        senderName: "Alex Johnson",
        message: "Thanks for helping with my coding problem!",
        timestamp: "10:30 AM",
        unread: true,
      },
      unreadCount: 1,
    },
    {
      id: "2",
      participantId: "user2",
      participantName: "Sarah Miller",
      participantAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      lastMessage: {
        id: "msg2",
        senderId: "user2",
        senderName: "Sarah Miller",
        message: "When can you help with my math assignment?",
        timestamp: "Yesterday",
        unread: false,
      },
      unreadCount: 0,
    },
    {
      id: "3",
      participantId: "user3",
      participantName: "Michael Chen",
      participantAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      lastMessage: {
        id: "msg3",
        senderId: "current-user",
        senderName: "You",
        message: "I can help you with that task tomorrow",
        timestamp: "2 days ago",
        unread: false,
      },
      unreadCount: 0,
    },
  ],
  onSelectConversation = () => {},
  onStartNewChat = () => {},
}: ChatPreviewProps) => {
  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Messages</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onStartNewChat}
            title="Start new chat"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No conversations yet</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={onStartNewChat}
            >
              Start a conversation
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[230px] pr-2">
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-start p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${conversation.unreadCount > 0 ? "bg-gray-50" : ""}`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                    <AvatarImage
                      src={conversation.participantAvatar}
                      alt={conversation.participantName}
                    />
                    <AvatarFallback>
                      {conversation.participantName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium truncate">
                        {conversation.participantName}
                      </p>
                      <span className="text-xs text-gray-500">
                        {conversation.lastMessage.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.lastMessage.senderId === "current-user"
                        ? "You: "
                        : ""}
                      {conversation.lastMessage.message}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <Badge
                      variant="default"
                      className="ml-2 bg-blue-500 hover:bg-blue-600"
                    >
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatPreview;
