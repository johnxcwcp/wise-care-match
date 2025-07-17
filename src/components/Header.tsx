
import React from "react";
import Logo from "./Logo";
import SocialMediaLinks from "./SocialMediaLinks";

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-cwcp-gray">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo 
            src="https://ukapxotdkjkqgarwehva.supabase.co/storage/v1/object/public/assets/cwcp_logo.png"
            className="h-12 w-auto" 
          />
          <a href="/" className="text-2xl font-medium text-cwcp-blue flex items-center">
            <span className="mr-2">CWCP</span>
            {/* Hide the subtitle on mobile screens */}
            <span className="text-cwcp-darkgray text-lg hidden md:block">Therapist Matching Quiz</span>
          </a>
        </div>
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
              <SocialMediaLinks />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
