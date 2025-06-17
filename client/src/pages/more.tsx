import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/lib/context/AppContext";
import { Link } from "wouter";

interface MenuItemProps {
  icon: string;
  label: string;
  link?: string;
  iconBgColor: string;
  iconTextColor: string;
  badge?: {
    label: string;
    color: string;
  };
  onClick?: () => void;
}

const MenuItem = ({ icon, label, link, iconBgColor, iconTextColor, badge, onClick }: MenuItemProps) => {
  const content = (
    <Card className="card hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-gray-300">
      <CardContent className="p-4 flex items-center">
        <div className={`${iconBgColor} ${iconTextColor} p-3 rounded-xl mr-4 shadow-sm`}>
          <span className="material-icons text-xl">{icon}</span>
        </div>
        <span className="flex-1 text-gray-800 font-medium text-base">{label}</span>
        {badge ? (
          <div className="flex items-center">
            <span className={`text-xs px-3 py-1 ${badge.color} rounded-full mr-3 font-medium`}>{badge.label}</span>
            <span className="material-icons text-gray-400 text-lg">chevron_right</span>
          </div>
        ) : (
          <span className="material-icons text-gray-400 text-lg">chevron_right</span>
        )}
      </CardContent>
    </Card>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return content;
};

export default function More() {
  const { setActivePage } = useAppContext();
  
  useEffect(() => {
    setActivePage('more');
  }, [setActivePage]);

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Menu Administrateur</h2>
        <p className="text-gray-600">Gérez votre application et accédez aux outils avancés</p>
      </div>

      {/* Menu Categories */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-700 text-sm uppercase font-semibold mb-4 tracking-wide">Gestion</h3>
          <div className="space-y-3">
            <MenuItem 
              icon="receipt_long" 
              label="Factures" 
              iconBgColor="bg-[#1976D2] bg-opacity-10" 
              iconTextColor="text-[#1976D2]" 
              link="/invoices"
            />
            <MenuItem 
              icon="category" 
              label="Catalogue de produits" 
              iconBgColor="bg-[#1976D2] bg-opacity-10" 
              iconTextColor="text-[#1976D2]" 
              link="/catalog"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-700 text-sm uppercase font-semibold mb-4 tracking-wide">Exportation & Analyses</h3>
          <div className="space-y-3">
            <MenuItem 
              icon="file_download" 
              label="Exporter les données" 
              iconBgColor="bg-orange-100" 
              iconTextColor="text-orange-600" 
              link="/export"
            />
            <MenuItem 
              icon="insert_chart" 
              label="Rapports & Statistiques" 
              iconBgColor="bg-orange-100" 
              iconTextColor="text-orange-600" 
              link="/reports"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-700 text-sm uppercase font-semibold mb-4 tracking-wide">Configuration</h3>
          <div className="space-y-3">
            <MenuItem 
              icon="settings" 
              label="Paramètres généraux" 
              iconBgColor="bg-gray-100" 
              iconTextColor="text-gray-600" 
              link="/settings"
            />
            <MenuItem 
              icon="account_circle" 
              label="Profil utilisateur" 
              iconBgColor="bg-gray-100" 
              iconTextColor="text-gray-600" 
              link="/profile"
            />
            <MenuItem 
              icon="sync" 
              label="Synchronisation" 
              iconBgColor="bg-green-100" 
              iconTextColor="text-green-600" 
              badge={{
                label: "Activée",
                color: "bg-green-100 text-green-700"
              }}
              link="/sync"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-400">
          <MenuItem 
            icon="logout" 
            label="Déconnexion" 
            iconBgColor="bg-red-100" 
            iconTextColor="text-red-600" 
            onClick={() => alert("Déconnexion...")}
          />
        </div>
      </div>
    </div>
  );
}
