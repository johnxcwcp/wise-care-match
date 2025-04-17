
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface AdminHeaderProps {
  onLogout?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white border-b border-cwcp-gray">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="text-2xl font-medium text-cwcp-blue flex items-center mr-8">
            <span className="mr-2">CWCP</span>
            <span className="text-cwcp-darkgray text-lg">Admin</span>
          </a>
          
          <nav>
            <ul className="flex gap-6">
              <li>
                <a 
                  href="/"
                  className="text-cwcp-blue hover:text-cwcp-lightblue transition-colors"
                >
                  View Quiz
                </a>
              </li>
            </ul>
          </nav>
        </div>
        
        {onLogout && (
          <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
            <LogOut size={16} />
            Logout
          </Button>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
