interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'full' | 'text';
  className?: string;
}

const sizeClasses = {
  sm: { container: 'w-8 h-8', text: 'text-sm' },
  md: { container: 'w-10 h-10', text: 'text-base' },
  lg: { container: 'w-12 h-12', text: 'text-lg' },
  xl: { container: 'w-16 h-16', text: 'text-xl' }
};

export function Logo({ size = 'md', variant = 'icon', className = '' }: LogoProps) {
  const sizes = sizeClasses[size];

  if (variant === 'text') {
    return (
      <div className={`flex items-center ${className}`}>
        <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          gYS
        </span>
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className={`${sizes.container} relative ${className}`}>
        <svg
          viewBox="0 0 48 48"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="30%" stopColor="#3B82F6" />
              <stop offset="70%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.25"/>
            </filter>
          </defs>
          
          {/* Background with modern rounded square */}
          <rect
            x="4"
            y="4"
            width="40"
            height="40"
            rx="12"
            ry="12"
            fill="url(#logoGradient)"
            filter="url(#shadow)"
          />
          
          {/* Subtle inner highlight */}
          <rect
            x="6"
            y="6"
            width="36"
            height="2"
            rx="1"
            fill="rgba(255,255,255,0.3)"
          />
          
          {/* Modern letter styling */}
          <g fill="url(#textGradient)" fontFamily="Inter, system-ui, sans-serif" fontWeight="700">
            {/* Letter 'g' */}
            <text x="12" y="32" fontSize="16" textAnchor="middle">g</text>
            
            {/* Letter 'Y' */}
            <text x="24" y="32" fontSize="16" textAnchor="middle">Y</text>
            
            {/* Letter 'S' */}
            <text x="36" y="32" fontSize="16" textAnchor="middle">S</text>
          </g>
          
          {/* Decorative elements */}
          <circle cx="40" cy="12" r="2" fill="rgba(255,255,255,0.4)" />
          <circle cx="8" cy="40" r="1.5" fill="rgba(255,255,255,0.3)" />
        </svg>
      </div>
    );
  }

  // variant === 'full'
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={sizes.container}>
        <svg
          viewBox="0 0 48 48"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="30%" stopColor="#3B82F6" />
              <stop offset="70%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="textGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <filter id="shadowFull" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.25"/>
            </filter>
          </defs>
          
          <rect
            x="4"
            y="4"
            width="40"
            height="40"
            rx="12"
            ry="12"
            fill="url(#logoGradientFull)"
            filter="url(#shadowFull)"
          />
          
          <rect
            x="6"
            y="6"
            width="36"
            height="2"
            rx="1"
            fill="rgba(255,255,255,0.3)"
          />
          
          <g fill="url(#textGradientFull)" fontFamily="Inter, system-ui, sans-serif" fontWeight="700">
            <text x="12" y="32" fontSize="16" textAnchor="middle">g</text>
            <text x="24" y="32" fontSize="16" textAnchor="middle">Y</text>
            <text x="36" y="32" fontSize="16" textAnchor="middle">S</text>
          </g>
          
          <circle cx="40" cy="12" r="2" fill="rgba(255,255,255,0.4)" />
          <circle cx="8" cy="40" r="1.5" fill="rgba(255,255,255,0.3)" />
        </svg>
      </div>
      <div>
        <h1 className={`font-bold ${sizes.text} bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
          gYS
        </h1>
        <p className="text-xs font-medium bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent">
          Business Management
        </p>
      </div>
    </div>
  );
}