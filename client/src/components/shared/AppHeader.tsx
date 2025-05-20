import { useLocation } from 'wouter';

export default function AppHeader() {
  const [location, navigate] = useLocation();
  
  // Get title based on the current path
  const getTitle = () => {
    if (location === '/') return 'gYS';
    if (location === '/inventory') return 'gYS';
    if (location === '/clients') return 'gYS';
    if (location === '/sales') return 'gYS';
    if (location === '/more') return 'gYS';
    if (location === '/add-sale') return 'Nouvelle Vente';
    if (location === '/add-product') return 'Nouveau Produit';
    if (location === '/add-client') return 'Nouveau Client';
    return 'gYS';
  };
  
  // Determine if we should show back button
  const showBackButton = location.includes('add-');
  
  return (
    <header className="bg-[#1976D2] text-white shadow-md z-10">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {showBackButton ? (
            <span 
              className="material-icons cursor-pointer" 
              onClick={() => navigate(-1)}
            >
              arrow_back
            </span>
          ) : (
            <span className="material-icons">menu</span>
          )}
          <h1 className="text-xl font-medium">{getTitle()}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="material-icons">search</span>
          <span className="material-icons">notifications</span>
          <span className="material-icons">sync</span>
        </div>
      </div>
    </header>
  );
}
