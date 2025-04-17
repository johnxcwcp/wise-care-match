
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-cwcp-gray">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <a href="/" className="text-2xl font-medium text-cwcp-blue flex items-center">
          <span className="mr-2">CWCP</span>
          <span className="text-cwcp-darkgray text-lg">Therapist Matching</span>
        </a>
        <nav>
          <ul className="flex gap-6">
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
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
