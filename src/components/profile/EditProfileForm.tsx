import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Loader2, Upload, X, Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  bio: z
    .string()
    .max(160, { message: "Bio must not exceed 160 characters" })
    .optional(),
  newSkill: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditProfileForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      bio: "",
      newSkill: "",
    },
  });

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

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error);
        } else if (profileData) {
          form.reset({
            username: profileData.username || user.email?.split("@")[0] || "",
            bio: profileData.bio || "",
          });
          setSkills(profileData.skills || []);
          setAvatarUrl(profileData.avatar_url || null);
        } else {
          // Set default values if no profile exists
          form.reset({
            username: user.email?.split("@")[0] || "",
            bio: "",
          });
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndProfile();
  }, [navigate, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      setAvatarFile(file);
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return null;

    try {
      setAvatarUploading(true);

      const fileExt = avatarFile.name.split(".").pop();
      const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("user-avatars")
        .upload(filePath, avatarFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from("user-avatars")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return null;
    } finally {
      setAvatarUploading(false);
    }
  };

  const addSkill = () => {
    const newSkill = form.getValues().newSkill?.trim();
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      form.setValue("newSkill", "");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) return;

    try {
      setSaving(true);

      // Upload avatar if changed
      let avatarPublicUrl = avatarUrl;
      if (avatarFile) {
        avatarPublicUrl = await uploadAvatar();
      }

      // Update profile in database
      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          username: values.username,
          bio: values.bio || null,
          skills: skills,
          avatar_url: avatarPublicUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

      if (error) throw error;

      // Navigate back to profile page
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
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
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
          <CardDescription>
            Update your profile information and customize how others see you
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={
                      avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.getValues().username}`
                    }
                  />
                  <AvatarFallback>
                    {form.getValues().username?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex items-center">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="flex items-center space-x-2 text-sm text-primary hover:underline">
                      <Upload className="h-4 w-4" />
                      <span>Upload new picture</span>
                    </div>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={avatarUploading}
                    />
                  </label>
                  {avatarFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-8 w-8 p-0"
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarUrl(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your username" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little about yourself"
                        className="resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Brief description for your profile. Max 160 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Skills */}
              <div className="space-y-2">
                <FormLabel>Skills</FormLabel>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removeSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  {skills.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No skills added yet
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="newSkill"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Add a skill (e.g. React, Design, Math)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addSkill}
                    disabled={!form.getValues().newSkill}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                <FormDescription>
                  Add skills that you can offer to help others with
                </FormDescription>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
