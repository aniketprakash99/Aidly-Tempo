import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import {
  Edit,
  LogOut,
  Settings,
  Award,
  Clock,
  Star,
  Shield,
  Briefcase,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface UserProfile {
  username: string;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  total_coins?: number;
  total_helped?: number;
  total_received_help?: number;
  rating?: number;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/");
          return;
        }

        setUser(user);

        // Fetch user profile from the database
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          // Create a default profile if none exists
          setProfile({
            username: user.email?.split("@")[0] || "User",
            skills: [],
            total_coins: 0,
            total_helped: 0,
            total_received_help: 0,
            rating: 0,
          });
        } else {
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - User Info Card */}
        <div className="md:col-span-1">
          <Card className="shadow-md">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage
                    src={
                      profile?.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username}`
                    }
                  />
                  <AvatarFallback>
                    {profile?.username?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl font-bold">
                  {profile?.username}
                </CardTitle>
                <CardDescription className="text-center mt-2">
                  {profile?.bio ||
                    "No bio yet. Add one by editing your profile!"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No skills added yet
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Stats
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Coins</span>
                      <span className="font-medium">
                        {profile?.total_coins || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Helped Others</span>
                      <span className="font-medium">
                        {profile?.total_helped || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Received Help</span>
                      <span className="font-medium">
                        {profile?.total_received_help || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rating</span>
                      <div className="flex items-center">
                        <span className="font-medium mr-1">
                          {profile?.rating || 0}
                        </span>
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                onClick={handleEditProfile}
                className="w-full"
                variant="outline"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
              <Button
                onClick={handleSettings}
                className="w-full"
                variant="outline"
              >
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
              <Button
                onClick={handleLogout}
                className="w-full"
                variant="destructive"
              >
                <LogOut className="mr-2 h-4 w-4" /> Log Out
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className="md:col-span-2">
          <Card className="shadow-md">
            <CardHeader>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Activity Summary
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Help Ratio</span>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          Skill Diversity
                        </span>
                        <span className="text-sm font-medium">40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          Response Rate
                        </span>
                        <span className="text-sm font-medium">90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            Helped with a coding task
                          </p>
                          <p className="text-sm text-muted-foreground">
                            You earned 5 coins for helping Alex with React hooks
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            2 days ago
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold">Transaction History</h3>
                  <Button variant="outline" size="sm">
                    <Clock className="mr-2 h-4 w-4" /> Last 30 Days
                  </Button>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${index % 2 === 0 ? "bg-green-100" : "bg-amber-100"}`}
                        >
                          <span
                            className={`text-lg ${index % 2 === 0 ? "text-green-600" : "text-amber-600"}`}
                          >
                            {index % 2 === 0 ? "+" : "-"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {index % 2 === 0 ? "Received" : "Spent"} Coins
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {index % 2 === 0
                              ? "For helping with"
                              : "For requesting help with"}{" "}
                            {index % 3 === 0
                              ? "coding"
                              : index % 3 === 1
                                ? "design"
                                : "studying"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${index % 2 === 0 ? "text-green-600" : "text-amber-600"}`}
                        >
                          {index % 2 === 0 ? "+" : "-"}
                          {Math.floor(Math.random() * 10) + 1} coins
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 10) + 1} days ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <h3 className="text-lg font-semibold">Your Achievements</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Helpful Hand</p>
                      <p className="text-sm text-muted-foreground">
                        Helped 5+ people
                      </p>
                      <div className="mt-2">
                        <Progress value={100} className="h-1.5" />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Rising Star</p>
                      <p className="text-sm text-muted-foreground">
                        Received 10+ positive ratings
                      </p>
                      <div className="mt-2">
                        <Progress value={70} className="h-1.5" />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 flex items-center space-x-4">
                    <div className="bg-gray-200 p-3 rounded-full">
                      <Shield className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">Skill Master</p>
                      <p className="text-sm text-muted-foreground">
                        Add 5+ skills to your profile
                      </p>
                      <div className="mt-2">
                        <Progress value={40} className="h-1.5" />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 flex items-center space-x-4">
                    <div className="bg-gray-200 p-3 rounded-full">
                      <Briefcase className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">Task Champion</p>
                      <p className="text-sm text-muted-foreground">
                        Complete 20+ tasks
                      </p>
                      <div className="mt-2">
                        <Progress value={25} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
