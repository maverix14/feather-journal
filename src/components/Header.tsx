import React from "react";
    import { Settings, User, Bookmark, Wallet, LogOut, Sparkle } from "lucide-react";
    import Logo from "./Logo";
    import { cn } from "@/lib/utils";
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";
    import { Link, useLocation } from "react-router-dom";
    import { toast } from "@/components/ui/use-toast";

    interface HeaderProps {
      className?: string;
    }

    const Header: React.FC<HeaderProps> = ({ className }) => {
      const handleLogout = () => {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
      };

      return (
        <header className={cn("py-4 px-5 mb-6 flex items-center justify-between animate-slide-down", className)}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full glass-morphism hover:bg-white/10 transition-all duration-300"
                aria-label="User profile"
              >
                <User className="w-5 h-5 text-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/bookmarks" className="flex items-center cursor-pointer">
                  <Bookmark className="mr-2 h-4 w-4" />
                  <span>Bookmarks</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/wallet" className="flex items-center cursor-pointer">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Wallet</span>
                  <span className="ml-auto text-xs text-muted-foreground">Coming soon</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1 flex justify-center">
            <Logo />
          </div>

          <Link
            to="/insights"
            className="w-10 h-10 flex items-center justify-center rounded-full glass-morphism hover:bg-white/10 transition-all duration-300"
            aria-label="Insights"
          >
            <Sparkle className="w-5 h-5 text-foreground" />
          </Link>
        </header>
      );
    };

    export default Header;
