import { Link, useLocation } from 'wouter';
import { useAppContext } from '@/lib/context/AppContext';

export default function FloatingActionButton() {
  const [location] = useLocation();
  const { activePage } = useAppContext();
  
  // Determine the add action based on current page
  const getAddLink = () => {
    switch (activePage) {
      case 'inventory':
        return '/add-product';
      case 'clients':
        return '/add-client';
      case 'sales':
      default:
        return '/add-sale';
    }
  };
  
  // Hide FAB on add pages to prevent circular navigation
  if (location.includes('add-')) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-20 z-10">
      <Link to={getAddLink()}>
        <button className="ripple bg-[#1976D2] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
          <span className="material-icons">add</span>
        </button>
      </Link>
    </div>
  );
}
