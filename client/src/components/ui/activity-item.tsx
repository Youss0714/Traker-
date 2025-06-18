import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ActivityItemProps {
  type: 'sale' | 'client' | 'inventory' | 'pending-sale';
  description: string;
  time: Date | string;
  extraInfo?: string;
}

export function ActivityItem({ type, description, time, extraInfo }: ActivityItemProps) {
  const formatTime = (date: Date | string) => {
    try {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(parsedDate.getTime())) {
        return 'Il y a quelques instants';
      }
      return formatDistanceToNow(parsedDate, { addSuffix: true, locale: fr });
    } catch (error) {
      return 'Il y a quelques instants';
    }
  };

  const getIconAndColor = () => {
    switch (type) {
      case 'sale':
        return { 
          icon: 'shopping_cart', 
          colorClass: 'bg-[#1976D2] bg-opacity-10 text-[#1976D2]' 
        };
      case 'pending-sale':
        return { 
          icon: 'shopping_cart', 
          colorClass: 'bg-[#FF9800] bg-opacity-10 text-[#FF9800]' 
        };
      case 'client':
        return { 
          icon: 'person_add', 
          colorClass: 'bg-[#FF9800] bg-opacity-10 text-[#FF9800]' 
        };
      case 'inventory':
        return { 
          icon: 'inventory', 
          colorClass: 'bg-[#D32F2F] bg-opacity-10 text-[#D32F2F]' 
        };
      default:
        return { 
          icon: 'info', 
          colorClass: 'bg-[#1976D2] bg-opacity-10 text-[#1976D2]' 
        };
    }
  };

  const { icon, colorClass } = getIconAndColor();

  return (
    <div className="flex items-center space-x-2 pb-2 border-b border-gray-100 last:border-0 last:pb-0">
      <div className={`p-1.5 rounded-full ${colorClass}`}>
        <span className="material-icons text-xs">{icon}</span>
      </div>
      <div className="flex-1">
        <p className="text-xs text-[#212121]">
          {description}
          {extraInfo && <span className="font-medium"> - {extraInfo}</span>}
        </p>
        <p className="text-xs text-[#757575] opacity-75">{formatTime(time)}</p>
      </div>
    </div>
  );
}
