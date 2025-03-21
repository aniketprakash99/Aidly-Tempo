import React, { useState } from "react";
import {
  Bell,
  MessageSquare,
  Search,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  username?: string;
  avatarUrl?: string;
  notificationCount?: number;
  messageCount?: number;
  onSearchSubmit?: (query: string) => void;
}

const Navbar = ({
  username,
  avatarUrl = "",
  notificationCount = 3,
  messageCount = 2,
  onSearchSubmit = () => {},
}: NavbarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName = username || user?.email?.split("@")[0] || "User";
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchQuery);
  };

  return (
    <nav className="w-full h-[70px] bg-background border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
      {/* Logo and Brand */}
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              SE
            </span>
          </div>
          <span className="font-bold text-lg hidden md:block">
            SkillExchange
          </span>
        </div>
      </div>

      {/* Search Bar - Hidden on mobile */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex relative max-w-md w-full mx-4"
      >
        <Input
          type="text"
          placeholder="Search for skills, requests, or users..."
          className="w-full pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
          {messageCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {messageCount}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-9 px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={username} />
                <AvatarFallback>
                  {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm hidden lg:inline-block">
                {displayName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Coin Balance</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[70px] left-0 right-0 bg-background border-b border-border p-4 flex flex-col gap-4 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex justify-between">
            <Button
              variant="ghost"
              className="flex items-center justify-start w-full"
            >
              <Bell className="mr-2 h-5 w-5" />
              Notifications
              {notificationCount > 0 && (
                <Badge className="ml-2" variant="destructive">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </div>

          <div className="flex justify-between">
            <Button
              variant="ghost"
              className="flex items-center justify-start w-full"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Messages
              {messageCount > 0 && (
                <Badge className="ml-2" variant="destructive">
                  {messageCount}
                </Badge>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback>
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{displayName}</span>
          </div>

          <Button variant="ghost" className="flex items-center justify-start">
            <User className="mr-2 h-5 w-5" />
            Profile
          </Button>
          <Button variant="ghost" className="flex items-center justify-start">
            Coin Balance
          </Button>
          <Button variant="ghost" className="flex items-center justify-start">
            Settings
          </Button>
          <Button
            variant="ghost"
            className="flex items-center justify-start"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Log out
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
