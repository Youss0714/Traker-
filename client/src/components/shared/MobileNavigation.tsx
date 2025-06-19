import { Link, useLocation } from 'wouter';
import { useAppContext, ActivePage } from '@/lib/context/AppContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function MobileNavigation() {
  const [location] = useLocation();
  const { activePage, setActivePage } = useAppContext();
  const { t } = useTranslation();
  
  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: t('dashboard'), path: '/' },
    { id: 'inventory', icon: 'inventory', label: t('inventory'), path: '/inventory' },
    { id: 'clients', icon: 'people', label: t('clients'), path: '/clients' },
    { id: 'sales', icon: 'shopping_cart', label: t('sales'), path: '/sales' },
    { id: 'more', icon: 'more_horiz', label: t('more'), path: '/more' }
  ];
  
  // Hide navigation on add pages
  if (location.includes('add-')) {
    return null;
  }

  return (
    <nav className="bg-white fixed bottom-0 w-full shadow-lg border-t border-gray-200 z-10">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link key={item.id} to={item.path}>
            <button 
              className={`py-2 px-3 flex flex-col items-center ${activePage === item.id ? 'text-[#1976D2]' : 'text-[#757575]'} flex-1`}
              onClick={() => setActivePage(item.id as ActivePage)}
            >
              <span className="material-icons text-current">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          </Link>
        ))}
      </div>
    </nav>
  );
}
