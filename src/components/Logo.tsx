
import React from "react";

interface LogoProps {
  src?: string;
  alt?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  src = "/placeholder.svg", 
  alt = "CWCP Logo", 
  className = "h-10 w-auto" 
}) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
    />
  );
};

export default Logo;
