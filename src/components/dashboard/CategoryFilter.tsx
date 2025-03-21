import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Filter, Plus } from "lucide-react";

interface CategoryFilterProps {
  onCategoryChange?: (category: string) => void;
  onViewChange?: (view: "requests" | "offers") => void;
  onCreateNew?: () => void;
  selectedCategory?: string;
  selectedView?: "requests" | "offers";
}

const CategoryFilter = ({
  onCategoryChange = () => {},
  onViewChange = () => {},
  onCreateNew = () => {},
  selectedCategory = "all",
  selectedView = "requests",
}: CategoryFilterProps) => {
  const [activeCategory, setActiveCategory] =
    useState<string>(selectedCategory);
  const [activeView, setActiveView] = useState<"requests" | "offers">(
    selectedView,
  );

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  const handleViewChange = (view: "requests" | "offers") => {
    setActiveView(view);
    onViewChange(view);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Tabs
            value={activeView}
            onValueChange={(value) =>
              handleViewChange(value as "requests" | "offers")
            }
            className="w-full sm:w-auto"
          >
            <TabsList>
              <TabsTrigger value="requests" className="flex items-center gap-2">
                Help Requests
                <Badge variant="secondary" className="ml-1">
                  24
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="offers" className="flex items-center gap-2">
                Help Offers
                <Badge variant="secondary" className="ml-1">
                  18
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            <Button
              variant={activeCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange("all")}
              className="whitespace-nowrap"
            >
              All Categories
            </Button>
            <Button
              variant={activeCategory === "coding" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange("coding")}
              className="whitespace-nowrap"
            >
              Coding
            </Button>
            <Button
              variant={activeCategory === "studying" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange("studying")}
              className="whitespace-nowrap"
            >
              Studying
            </Button>
            <Button
              variant={activeCategory === "everyday" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange("everyday")}
              className="whitespace-nowrap"
            >
              Everyday Tasks
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            More Filters
          </Button>
          <Button onClick={onCreateNew} className="flex items-center gap-2">
            <Plus size={16} />
            Create New
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
