import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Coins, History, ArrowUpRight, TrendingUp } from "lucide-react";

interface Transaction {
  id: string;
  type: "earned" | "spent" | "received" | "transferred";
  amount: number;
  date: string;
  description: string;
  counterparty?: string;
}

interface CoinBalanceCardProps {
  balance?: number;
  transactions?: Transaction[];
  onViewHistory?: () => void;
  onTransferCoins?: () => void;
}

const CoinBalanceCard = ({
  balance = 250,
  transactions = [
    {
      id: "tx1",
      type: "earned",
      amount: 50,
      date: "2023-06-15",
      description: "Helped with JavaScript debugging",
      counterparty: "Alex Chen",
    },
    {
      id: "tx2",
      type: "spent",
      amount: 30,
      date: "2023-06-10",
      description: "Requested help with React components",
      counterparty: "Jamie Smith",
    },
    {
      id: "tx3",
      type: "received",
      amount: 25,
      date: "2023-06-05",
      description: "Bonus for quick response",
      counterparty: "System",
    },
  ],
  onViewHistory = () => {},
  onTransferCoins = () => {},
}: CoinBalanceCardProps) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <Card className="w-full max-w-[300px] bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Coin Balance</CardTitle>
          <Coins className="h-6 w-6 text-yellow-500" />
        </div>
        <CardDescription>Your current skill exchange currency</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center py-2">
          <div className="text-4xl font-bold text-primary mb-1">{balance}</div>
          <div className="text-sm text-muted-foreground">Available Coins</div>

          <div className="w-full mt-4 bg-gray-100 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${Math.min(100, (balance / 500) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between w-full text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>500</span>
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={onViewHistory}
            >
              <History className="h-4 w-4" />
              History
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Transaction History</DialogTitle>
            </DialogHeader>
            <div className="max-h-[300px] overflow-y-auto">
              {transactions.map((tx) => (
                <div key={tx.id} className="py-2 border-b last:border-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString()} •{" "}
                        {tx.counterparty}
                      </p>
                    </div>
                    <div
                      className={`font-semibold ${tx.type === "spent" || tx.type === "transferred" ? "text-red-500" : "text-green-500"}`}
                    >
                      {tx.type === "spent" || tx.type === "transferred"
                        ? "-"
                        : "+"}
                      {tx.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="default"
          size="sm"
          className="flex items-center gap-1"
          onClick={onTransferCoins}
        >
          <ArrowUpRight className="h-4 w-4" />
          Transfer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CoinBalanceCard;
