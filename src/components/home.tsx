import React, { useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent } from "./ui/dialog";

import CoinBalanceCard from "./dashboard/CoinBalanceCard";
import RecommendationsSection from "./dashboard/RecommendationsSection";
import ChatPreview from "./chat/ChatPreview";
import CreateRequestModal from "./modals/CreateRequestModal";
import CreateOfferModal from "./modals/CreateOfferModal";
import TransferCoinsModal from "./modals/TransferCoinsModal";
import CategoryFilter from "./dashboard/CategoryFilter";
import RequestCard from "./dashboard/RequestCard";

const Navbar = () => {
  return (
    <div className="w-full h-16 px-4 border-b flex items-center justify-between bg-white">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-primary mr-8">SkillExchange</h1>
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input className="pl-8" placeholder="Search requests or users..." />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
            3
          </Badge>
        </Button>

        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=currentUser" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-500">250 coins</p>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

const Home = () => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] =
    useState(false);
  const [isCreateOfferModalOpen, setIsCreateOfferModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const handleTransferCoins = () => {
    setIsTransferModalOpen(true);
  };

  const handleCreateRequest = () => {
    setIsCreateRequestModalOpen(true);
  };

  const handleCreateOffer = () => {
    setIsCreateOfferModalOpen(true);
  };

  // Sample data for the request board
  const requests = [
    {
      id: "1",
      title: "Help with React Hooks",
      description:
        "I need assistance understanding useEffect and useContext in a complex application.",
      category: "coding",
      coins: 50,
      user: {
        name: "Alex Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      },
    },
    {
      id: "2",
      title: "Math Tutoring for Calculus",
      description:
        "Looking for someone to help explain derivatives and integrals.",
      category: "studying",
      coins: 30,
      user: {
        name: "Sarah Miller",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
    },
    {
      id: "3",
      title: "Help Moving Furniture",
      description:
        "Need assistance moving a couch and bookshelf to my new apartment.",
      category: "everyday",
      coins: 75,
      user: {
        name: "Mike Thomas",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <CoinBalanceCard onTransferCoins={handleTransferCoins} />

            <div className="hidden lg:block">
              <RecommendationsSection />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Skill Exchange Board</h2>
              <div className="flex space-x-2">
                <Button onClick={handleCreateRequest}>Create Request</Button>
                <Button variant="outline" onClick={handleCreateOffer}>
                  Create Offer
                </Button>
              </div>
            </div>

            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="coding">Coding</TabsTrigger>
                <TabsTrigger value="studying">Studying</TabsTrigger>
                <TabsTrigger value="everyday">Everyday</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              <CategoryFilter
                activeCategory={activeTab}
                onCategoryChange={setActiveTab}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests
                  .filter(
                    (req) => activeTab === "all" || req.category === activeTab,
                  )
                  .map((request) => (
                    <RequestCard
                      key={request.id}
                      title={request.title}
                      description={request.description}
                      category={request.category}
                      coins={request.coins}
                      user={request.user}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <ChatPreview />

            <div className="lg:hidden">
              <RecommendationsSection />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
        <DialogContent className="p-0">
          <TransferCoinsModal
            open={isTransferModalOpen}
            onOpenChange={setIsTransferModalOpen}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCreateRequestModalOpen}
        onOpenChange={setIsCreateRequestModalOpen}
      >
        <DialogContent className="p-0">
          <CreateRequestModal
            open={isCreateRequestModalOpen}
            onOpenChange={setIsCreateRequestModalOpen}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCreateOfferModalOpen}
        onOpenChange={setIsCreateOfferModalOpen}
      >
        <DialogContent className="p-0">
          <CreateOfferModal
            open={isCreateOfferModalOpen}
            onOpenChange={setIsCreateOfferModalOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
