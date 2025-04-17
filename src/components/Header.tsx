
import React from "react";
import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-cwcp-gray">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <a href="/" className="text-2xl font-medium text-cwcp-blue flex items-center">
          <span className="mr-2">CWCP</span>
          <span className="text-cwcp-darkgray text-lg">Therapist Matching</span>
        </a>
        <nav>
          <ul className="flex gap-6 items-center">
            <li>
              <a 
                href="https://cwcp.ca" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cwcp-blue hover:text-cwcp-lightblue transition-colors"
              >
                Visit CWCP
              </a>
            </li>
            <li>
              <Link to="/admin">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <UserCog size={16} />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
