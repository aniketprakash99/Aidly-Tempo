import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Coins, Send, User } from "lucide-react";

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  recipient: z.string({
    required_error: "Please select a recipient",
  }),
  amount: z.coerce
    .number({
      required_error: "Please enter an amount",
    })
    .positive("Amount must be positive")
    .max(1000, "Maximum transfer amount is 1000 coins"),
  message: z.string().optional(),
});

type TransferCoinsFormValues = z.infer<typeof formSchema>;

interface TransferCoinsModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentBalance?: number;
  onTransferComplete?: (data: TransferCoinsFormValues) => void;
}

const mockUsers = [
  { id: "1", name: "Alice Johnson", skills: ["Coding", "Math"] },
  { id: "2", name: "Bob Smith", skills: ["Design", "Writing"] },
  { id: "3", name: "Carol Williams", skills: ["Languages", "Science"] },
  { id: "4", name: "David Brown", skills: ["Music", "Sports"] },
];

export default function TransferCoinsModal({
  open = true,
  onOpenChange,
  currentBalance = 500,
  onTransferComplete = () => {},
}: TransferCoinsModalProps) {
  const [isTransferring, setIsTransferring] = useState(false);

  const form = useForm<TransferCoinsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: "",
      amount: 0,
      message: "",
    },
  });

  function onSubmit(data: TransferCoinsFormValues) {
    setIsTransferring(true);

    // Simulate API call
    setTimeout(() => {
      setIsTransferring(false);
      onTransferComplete(data);
      form.reset();
      if (onOpenChange) onOpenChange(false);
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white">
          <Coins className="mr-2 h-4 w-4" />
          Transfer Coins
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transfer Coins</DialogTitle>
          <DialogDescription>
            Send coins to another user. Your current balance:{" "}
            <span className="font-semibold">{currentBalance} coins</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            {user.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the user you want to send coins to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber);
                        }}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Coins className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the amount of coins to transfer (max: {currentBalance}
                    )
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Thanks for your help!" {...field} />
                  </FormControl>
                  <FormDescription>
                    Add a personal message to the recipient
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange && onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isTransferring}>
                {isTransferring ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Coins
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
