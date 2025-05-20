interface AvatarInitialsProps {
  name: string;
  type?: 'regular' | 'new' | 'vip';
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarInitials({ name, type = 'regular', size = 'md' }: AvatarInitialsProps) {
  // Generate initials from the name
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  // Get color based on client type
  const getTypeColor = () => {
    switch (type) {
      case 'vip':
        return 'bg-[#2E7D32] bg-opacity-10 text-[#2E7D32]';
      case 'new':
        return 'bg-[#FF9800] bg-opacity-10 text-[#FF9800]';
      case 'regular':
      default:
        return 'bg-[#1976D2] bg-opacity-10 text-[#1976D2]';
    }
  };

  // Get size class
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8 text-xs';
      case 'lg':
        return 'h-12 w-12 text-base';
      case 'md':
      default:
        return 'h-10 w-10 text-sm';
    }
  };

  return (
    <div className={`${getTypeColor()} ${getSizeClass()} rounded-full flex items-center justify-center`}>
      <span className="font-medium">{getInitials(name)}</span>
    </div>
  );
}
