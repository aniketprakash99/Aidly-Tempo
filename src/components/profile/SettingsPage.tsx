import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Loader2, Bell, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const passwordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newRequests: true,
    messages: true,
    helpAccepted: true,
    systemUpdates: false,
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/");
          return;
        }

        setUser(user);

        // Fetch notification settings if you have them stored
        // This is a placeholder - you would fetch from your database
        const { data: settingsData, error } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (!error && settingsData) {
          setNotificationSettings({
            emailNotifications: settingsData.email_notifications || true,
            newRequests: settingsData.new_requests || true,
            messages: settingsData.messages || true,
            helpAccepted: settingsData.help_accepted || true,
            systemUpdates: settingsData.system_updates || false,
          });
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handlePasswordChange = async (values: PasswordFormValues) => {
    if (!user) return;

    try {
      setSaving(true);

      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: values.currentPassword,
      });

      if (signInError) {
        passwordForm.setError("currentPassword", {
          type: "manual",
          message: "Current password is incorrect",
        });
        return;
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (updateError) throw updateError;

      // Reset the form
      passwordForm.reset();
      alert("Password updated successfully");
    } catch (error: any) {
      console.error("Error updating password:", error);
      alert(error.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = async (
    setting: keyof typeof notificationSettings,
    value: boolean,
  ) => {
    if (!user) return;

    try {
      // Update local state
      setNotificationSettings((prev) => ({
        ...prev,
        [setting]: value,
      }));

      // Map to database column names
      const dbColumnMap: Record<string, string> = {
        emailNotifications: "email_notifications",
        newRequests: "new_requests",
        messages: "messages",
        helpAccepted: "help_accepted",
        systemUpdates: "system_updates",
      };

      // Update in database
      const { error } = await supabase.from("user_settings").upsert(
        {
          user_id: user.id,
          [dbColumnMap[setting]]: value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (error) throw error;
    } catch (error) {
      console.error("Error updating notification settings:", error);
      // Revert the change in UI if there was an error
      setNotificationSettings((prev) => ({
        ...prev,
        [setting]: !value,
      }));
      alert("Failed to update notification settings");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      // Delete user data from your database tables first
      // This is important to do before deleting the auth user

      // Example: Delete profile
      await supabase.from("profiles").delete().eq("id", user.id);

      // Example: Delete user settings
      await supabase.from("user_settings").delete().eq("user_id", user.id);

      // Finally delete the user from auth
      const { error } = await supabase.auth.admin.deleteUser(user.id);

      if (error) throw error;

      // Sign out and redirect to home
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please contact support.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Settings</CardTitle>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6 pt-4">
              {/* Email Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Email Address</h3>
                <p className="text-sm text-muted-foreground">
                  Your current email address is <strong>{user?.email}</strong>
                </p>
                <p className="text-xs text-muted-foreground">
                  To change your email, please contact support
                </p>
              </div>

              {/* Password Change Form */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Change Password</h3>

                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
                    className="space-y-4"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() =>
                                  setShowCurrentPassword(!showCurrentPassword)
                                }
                              >
                                {showCurrentPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Password must be at least 6 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Danger Zone */}
              <div className="space-y-4 pt-6">
                <h3 className="text-lg font-medium text-destructive">
                  Danger Zone
                </h3>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove all your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <p className="text-xs text-muted-foreground">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Email Notifications
                      </FormLabel>
                      <FormDescription>
                        Receive notifications via email
                      </FormDescription>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("emailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        New Help Requests
                      </FormLabel>
                      <FormDescription>
                        Get notified about new requests matching your skills
                      </FormDescription>
                    </div>
                    <Switch
                      checked={notificationSettings.newRequests}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("newRequests", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Messages</FormLabel>
                      <FormDescription>
                        Receive notifications for new messages
                      </FormDescription>
                    </div>
                    <Switch
                      checked={notificationSettings.messages}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("messages", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Help Accepted</FormLabel>
                      <FormDescription>
                        Get notified when someone accepts your help offer
                      </FormDescription>
                    </div>
                    <Switch
                      checked={notificationSettings.helpAccepted}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("helpAccepted", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        System Updates
                      </FormLabel>
                      <FormDescription>
                        Receive updates about new features and improvements
                      </FormDescription>
                    </div>
                    <Switch
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("systemUpdates", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/profile")}
          >
            Back to Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
