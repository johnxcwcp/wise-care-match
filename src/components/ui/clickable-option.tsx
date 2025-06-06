
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface ClickableOptionProps {
  children: React.ReactNode;
  value: string;
  isSelected: boolean;
  onClick: (value: string) => void;
  type?: 'checkbox' | 'radio';
  className?: string;
}

const ClickableOption: React.FC<ClickableOptionProps> = ({
  children,
  value,
  isSelected,
  onClick,
  type = 'checkbox',
  className
}) => {
  const handleClick = () => {
    onClick(value);
  };

  return (
    <div
      className={cn(
        "quiz-option flex items-start gap-3 cursor-pointer",
        isSelected && "selected",
        className
      )}
      onClick={handleClick}
    >
      {type === 'checkbox' ? (
        <Checkbox
          checked={isSelected}
          onChange={() => {}} // Handled by parent click
          className="mt-1 pointer-events-none"
        />
      ) : (
        <RadioGroupItem
          value={value}
          checked={isSelected}
          className="mt-1 pointer-events-none"
        />
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default ClickableOption;
