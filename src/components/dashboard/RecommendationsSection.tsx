import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";
import { MessageSquare, Star, Users } from "lucide-react";

interface RecommendationProps {
  recommendations?: {
    requests: RecommendedRequest[];
    helpers: RecommendedHelper[];
  };
}

interface RecommendedRequest {
  id: string;
  title: string;
  category: string;
  coins: number;
  username: string;
  avatarUrl?: string;
  matchScore: number;
}

interface RecommendedHelper {
  id: string;
  username: string;
  avatarUrl?: string;
  skills: string[];
  rating: number;
  helpCount: number;
}

const RecommendationsSection = ({
  recommendations = {
    requests: [
      {
        id: "1",
        title: "Help with React Hooks",
        category: "coding",
        coins: 25,
        username: "coder123",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=coder123",
        matchScore: 95,
      },
      {
        id: "2",
        title: "Math Tutoring - Calculus",
        category: "studying",
        coins: 15,
        username: "mathwhiz",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=mathwhiz",
        matchScore: 87,
      },
      {
        id: "3",
        title: "Help Moving Furniture",
        category: "everyday tasks",
        coins: 40,
        username: "helpfulhands",
        avatarUrl:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=helpfulhands",
        matchScore: 82,
      },
    ],
    helpers: [
      {
        id: "1",
        username: "techguru",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=techguru",
        skills: ["JavaScript", "React", "Node.js"],
        rating: 4.9,
        helpCount: 27,
      },
      {
        id: "2",
        username: "studybuddy",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=studybuddy",
        skills: ["Mathematics", "Physics", "Chemistry"],
        rating: 4.7,
        helpCount: 19,
      },
      {
        id: "3",
        username: "handyperson",
        avatarUrl:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=handyperson",
        skills: ["Moving", "Assembly", "Repairs"],
        rating: 4.8,
        helpCount: 32,
      },
    ],
  },
}: RecommendationProps) => {
  return (
    <Card className="w-full h-full bg-white overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Recommendations</CardTitle>
        <CardDescription>Based on your skills and interests</CardDescription>
      </CardHeader>
      <Tabs defaultValue="requests" className="w-full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">For You</TabsTrigger>
            <TabsTrigger value="helpers">Helpers</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="requests" className="mt-0">
          <CardContent className="px-4 py-2">
            <div className="space-y-3">
              {recommendations.requests.map((request) => (
                <RecommendedRequestCard key={request.id} request={request} />
              ))}

              {recommendations.requests.length > 0 && (
                <Button
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground hover:text-primary mt-2"
                >
                  View all recommendations
                </Button>
              )}

              {recommendations.requests.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No recommendations available</p>
                  <p className="text-sm">
                    Complete your profile to get personalized suggestions
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="helpers" className="mt-0">
          <CardContent className="px-4 py-2">
            <div className="space-y-3">
              {recommendations.helpers.map((helper) => (
                <RecommendedHelperCard key={helper.id} helper={helper} />
              ))}

              {recommendations.helpers.length > 0 && (
                <Button
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground hover:text-primary mt-2"
                >
                  View all helpers
                </Button>
              )}

              {recommendations.helpers.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No helpers available</p>
                  <p className="text-sm">Try adjusting your request details</p>
                </div>
              )}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

const RecommendedRequestCard = ({
  request,
}: {
  request: RecommendedRequest;
}) => {
  return (
    <div className="p-3 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-sm line-clamp-1">{request.title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs py-0 h-5">
              {request.category}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {request.coins} coins
            </span>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
          {request.matchScore}% match
        </Badge>
      </div>
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={request.avatarUrl} alt={request.username} />
            <AvatarFallback>
              {request.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs">{request.username}</span>
        </div>
        <Button size="sm" variant="secondary" className="h-7 text-xs">
          Help
        </Button>
      </div>
    </div>
  );
};

const RecommendedHelperCard = ({ helper }: { helper: RecommendedHelper }) => {
  return (
    <div className="p-3 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={helper.avatarUrl} alt={helper.username} />
          <AvatarFallback>
            {helper.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-sm">{helper.username}</h4>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-xs">{helper.rating}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {helper.skills.slice(0, 3).map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs py-0 h-5"
              >
                {skill}
              </Badge>
            ))}
            {helper.skills.length > 3 && (
              <Badge variant="outline" className="text-xs py-0 h-5">
                +{helper.skills.length - 3}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>Contact</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Helped {helper.helpCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsSection;
