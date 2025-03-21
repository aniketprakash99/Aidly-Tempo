import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

interface CreateOfferModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (values: FormValues) => void;
}

const CreateOfferModal = ({
  open = true,
  onOpenChange,
  onSubmit: externalOnSubmit,
}: CreateOfferModalProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      coinAmount: 1,
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (externalOnSubmit) {
      externalOnSubmit(values);
    } else {
      console.log("Offer created:", values);
    }

    if (onOpenChange) {
      onOpenChange(false);
    }

    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Coins className="mr-2 h-4 w-4" />
          Create Offer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a Help Offer</DialogTitle>
          <DialogDescription>
            Offer your skills and expertise to help others. Specify what you can
            help with and how many coins you expect.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="I can help with..." {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear title describing what you can help with
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
                      placeholder="Describe your skills and how you can help others..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about your expertise and availability
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
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the category that best matches your offer
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
                  <FormLabel>Expected Coins</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormDescription>
                    How many coins you expect to receive for your help
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full sm:w-auto">
                Create Offer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOfferModal;
