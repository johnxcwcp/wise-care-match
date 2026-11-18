
import React from "react";
import Logo from "./Logo";
import SocialMediaLinks from "./SocialMediaLinks";

const Header: React.FC = () => {
  return (
    <header className="bg-card/95 border-b border-cwcp-gray/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo 
            src="https://ukapxotdkjkqgarwehva.supabase.co/storage/v1/object/public/assets/cwcp_logo.png"
            className="h-12 w-auto" 
          />
          <a href="/" className="text-2xl font-normal flex items-center">
            {/* Hide the subtitle on mobile screens */}
            <span className="text-cwcp-darkgray text-lg hidden md:block">Therapist Matching Quiz</span>
          </a>
        </div>
        <nav>
          <div className="flex items-center gap-3 rounded-full border border-cwcp-gray/70 bg-secondary/60 px-4 py-2 sm:gap-4 sm:px-5 sm:py-2.5">
            <a 
              href="https://cwcp.ca" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cwcp-blue hover:text-cwcp-lightblue transition-colors whitespace-nowrap"
            >
              Visit CWCP
            </a>
            <SocialMediaLinks />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
