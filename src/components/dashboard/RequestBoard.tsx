import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import CategoryFilter from "./CategoryFilter";
import RequestCard, { RequestCardProps } from "./RequestCard";
import CreateRequestModal from "../modals/CreateRequestModal";
import CreateOfferModal from "../modals/CreateOfferModal";

interface RequestBoardProps {
  requests?: RequestCardProps[];
  offers?: RequestCardProps[];
  onCategoryChange?: (category: string) => void;
  onViewChange?: (view: "requests" | "offers") => void;
}

const RequestBoard = ({
  requests = [
    {
      id: "1",
      title: "Help with React Component",
      description:
        "I need assistance creating a custom hook for form validation in my React application.",
      category: "coding",
      coinAmount: 50,
      type: "request",
      username: "johndoe",
      timePosted: "2 hours ago",
    },
    {
      id: "2",
      title: "Math Tutoring Needed",
      description:
        "Looking for help with calculus problems for my upcoming exam. Need someone who can explain concepts clearly.",
      category: "studying",
      coinAmount: 35,
      type: "request",
      username: "mathstudent",
      timePosted: "3 hours ago",
    },
    {
      id: "3",
      title: "Help Moving Furniture",
      description:
        "Need assistance moving a couch and bookshelf to my new apartment this weekend. It should take about 1 hour.",
      category: "everyday",
      coinAmount: 60,
      type: "request",
      username: "movingout",
      timePosted: "1 day ago",
    },
    {
      id: "4",
      title: "Website Debugging",
      description:
        "Having issues with responsive design on my portfolio website. Need someone experienced with CSS and media queries.",
      category: "coding",
      coinAmount: 45,
      type: "request",
      username: "webdev101",
      timePosted: "5 hours ago",
    },
    {
      id: "5",
      title: "Essay Proofreading",
      description:
        "Need someone to review my 10-page research paper on environmental science. Looking for grammar and structure feedback.",
      category: "studying",
      coinAmount: 30,
      type: "request",
      username: "essaywriter",
      timePosted: "12 hours ago",
    },
    {
      id: "6",
      title: "Dog Walking Help",
      description:
        "Need someone to walk my golden retriever for the next three days while I'm recovering from surgery.",
      category: "everyday",
      coinAmount: 40,
      type: "request",
      username: "dogparent",
      timePosted: "6 hours ago",
    },
  ],
  offers = [
    {
      id: "7",
      title: "JavaScript Tutoring Available",
      description:
        "Experienced JavaScript developer offering help with React, Vue, or vanilla JS projects. Can help debug or explain concepts.",
      category: "coding",
      coinAmount: 40,
      type: "offer",
      username: "jsmaster",
      timePosted: "1 day ago",
    },
    {
      id: "8",
      title: "Chemistry Study Sessions",
      description:
        "Chemistry major offering help with general and organic chemistry concepts. Can help with problem sets or exam prep.",
      category: "studying",
      coinAmount: 35,
      type: "offer",
      username: "chemwhiz",
      timePosted: "4 hours ago",
    },
    {
      id: "9",
      title: "Grocery Shopping Assistance",
      description:
        "Happy to pick up groceries for elderly or those unable to go shopping. Available weekday evenings.",
      category: "everyday",
      coinAmount: 25,
      type: "offer",
      username: "helpfulneighbor",
      timePosted: "2 days ago",
    },
    {
      id: "10",
      title: "Python Programming Help",
      description:
        "Data scientist offering help with Python programming, data analysis, or machine learning projects.",
      category: "coding",
      coinAmount: 50,
      type: "offer",
      username: "pythonista",
      timePosted: "8 hours ago",
    },
    {
      id: "11",
      title: "History Essay Assistance",
      description:
        "History major offering help with research, structuring, and proofreading history essays and papers.",
      category: "studying",
      coinAmount: 30,
      type: "offer",
      username: "historybuff",
      timePosted: "1 day ago",
    },
    {
      id: "12",
      title: "Handyman Services",
      description:
        "Experienced in basic home repairs, furniture assembly, and other household tasks. Have my own tools.",
      category: "everyday",
      coinAmount: 45,
      type: "offer",
      username: "fixitall",
      timePosted: "3 days ago",
    },
  ],
  onCategoryChange = () => {},
  onViewChange = () => {},
}: RequestBoardProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedView, setSelectedView] = useState<"requests" | "offers">(
    "requests",
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handleViewChange = (view: "requests" | "offers") => {
    setSelectedView(view);
    onViewChange(view);
  };

  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  // Filter requests/offers based on selected category
  const filteredItems = (
    selectedView === "requests" ? requests : offers
  ).filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <CategoryFilter
        selectedCategory={selectedCategory}
        selectedView={selectedView}
        onCategoryChange={handleCategoryChange}
        onViewChange={handleViewChange}
        onCreateNew={handleCreateNew}
      />

      <Tabs value={selectedView} className="mt-6">
        <TabsContent value="requests" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((request) => (
                <RequestCard key={request.id} {...request} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  No requests found in this category. Try selecting a different
                  category or create a new request.
                </p>
                <Button onClick={handleCreateNew} className="mt-4">
                  Create New Request
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="offers" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((offer) => (
                <RequestCard key={offer.id} {...offer} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  No offers found in this category. Try selecting a different
                  category or create a new offer.
                </p>
                <Button onClick={handleCreateNew} className="mt-4">
                  Create New Offer
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          {selectedView === "requests" ? (
            <CreateRequestModal onClose={() => setIsCreateModalOpen(false)} />
          ) : (
            <CreateOfferModal onClose={() => setIsCreateModalOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestBoard;
