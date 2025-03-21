import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Coins } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  coinAmount: z.coerce
    .number()
    .min(1, { message: "Coin amount must be at least 1" }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateRequestModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (values: FormValues) => void;
}

export default function CreateRequestModal({
  open = true,
  onOpenChange,
  onSubmit,
}: CreateRequestModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      coinAmount: 5,
    },
  });

  const handleSubmit = (values: FormValues) => {
    // In a real implementation, this would submit the request to the backend
    console.log("Request created:", values);
    onSubmit?.(values);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Create Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a Help Request</DialogTitle>
          <DialogDescription>
            Describe what you need help with and how many coins you're willing
            to spend.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g., Help with React Hooks"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear, concise title for your request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you need help with in detail..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide enough details so helpers understand what you need.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="coding">Coding</SelectItem>
                      <SelectItem value="studying">Studying</SelectItem>
                      <SelectItem value="everyday">Everyday Tasks</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the category that best fits your request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coinAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coin Amount</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <Coins className="h-5 w-5 text-yellow-500" />
                  </div>
                  <FormDescription>
                    How many coins you're willing to spend for this help.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange?.(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Create Request
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
