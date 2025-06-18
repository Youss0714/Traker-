import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: "sm" | "md" | "lg";
  shadow?: boolean;
}

export function MobileCard({ 
  children, 
  className, 
  onClick, 
  padding = "md", 
  shadow = true 
}: MobileCardProps) {
  const paddingClasses = {
    sm: "p-2",
    md: "p-4",
    lg: "p-6"
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 transition-all duration-200",
        shadow && "shadow-sm hover:shadow-md",
        onClick && "cursor-pointer active:scale-[0.98] touch-manipulation",
        paddingClasses[padding],
        className
      )}
      onClick={onClick}
      style={{
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation"
      }}
    >
      {children}
    </div>
  );
}

interface MobileListItemProps {
  children: ReactNode;
  onClick?: () => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  subtitle?: string;
  className?: string;
}

export function MobileListItem({
  children,
  onClick,
  leftIcon,
  rightIcon,
  subtitle,
  className
}: MobileListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center py-3 px-4 bg-white border-b border-gray-100 last:border-b-0",
        "transition-colors duration-150",
        onClick && "cursor-pointer active:bg-gray-50 touch-manipulation",
        className
      )}
      onClick={onClick}
      style={{
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        minHeight: "44px"
      }}
    >
      {leftIcon && (
        <div className="mr-3 flex-shrink-0">
          {leftIcon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">
          {children}
        </div>
        {subtitle && (
          <div className="text-sm text-gray-500 truncate">
            {subtitle}
          </div>
        )}
      </div>
      
      {rightIcon && (
        <div className="ml-3 flex-shrink-0">
          {rightIcon}
        </div>
      )}
    </div>
  );
}

interface MobileButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

export function MobileButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className,
  icon
}: MobileButtonProps) {
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm min-h-[36px]",
    md: "px-4 py-3 text-base min-h-[44px]",
    lg: "px-6 py-4 text-lg min-h-[52px]"
  };

  return (
    <button
      className={cn(
        "font-medium rounded-lg transition-all duration-150",
        "touch-manipulation active:scale-[0.98]",
        "flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      style={{
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation"
      }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}