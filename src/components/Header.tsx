
import React from "react";
import { Link } from "react-router-dom";
import { ChartBarIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <ChartBarIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-gray-900">VoteVision</span>
        </Link>
        
        <nav>
          <Button asChild variant="default">
            <Link to="/create" className="flex items-center space-x-1">
              <PlusIcon className="h-4 w-4" />
              <span>Create Poll</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
