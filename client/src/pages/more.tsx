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
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:shadow-lg transition-all duration-200 cursor-pointer hover:from-indigo-100 hover:to-purple-100">
      <CardContent className="p-6 flex items-center">
        <div className={`${iconBgColor} ${iconTextColor} p-4 rounded-full mr-6 shadow-lg`}>
          <span className="material-icons text-2xl">{icon}</span>
        </div>
        <span className="flex-1 text-indigo-800 font-bold text-lg">{label}</span>
        {badge ? (
          <div className="flex items-center">
            <span className={`text-sm px-3 py-1 ${badge.color} rounded-full mr-3 font-medium shadow-sm`}>{badge.label}</span>
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="material-icons text-white text-sm">chevron_right</span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="material-icons text-white text-sm">chevron_right</span>
          </div>
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
    <div className="p-4 space-y-6 bg-white min-h-screen">
      <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Menu Administrateur</h2>
        <p className="text-blue-100">Gérez votre application et accédez aux outils avancés</p>
      </div>

      {/* Menu Categories */}
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-gray-800 text-base uppercase font-bold mb-6 tracking-wider">📋 GESTION</h3>
          <div className="space-y-4">
            <MenuItem 
              icon="receipt_long" 
              label="Factures" 
              iconBgColor="bg-blue-500" 
              iconTextColor="text-white" 
              link="/invoices"
            />
            <MenuItem 
              icon="category" 
              label="Catalogue de produits" 
              iconBgColor="bg-blue-500" 
              iconTextColor="text-white" 
              link="/catalog"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-gray-800 text-base uppercase font-bold mb-6 tracking-wider">📊 EXPORTATION & ANALYSES</h3>
          <div className="space-y-4">
            <MenuItem 
              icon="file_download" 
              label="Exporter les données" 
              iconBgColor="bg-orange-500" 
              iconTextColor="text-white" 
              link="/export"
            />
            <MenuItem 
              icon="insert_chart" 
              label="Rapports & Statistiques" 
              iconBgColor="bg-orange-500" 
              iconTextColor="text-white" 
              link="/reports"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-gray-800 text-base uppercase font-bold mb-6 tracking-wider">⚙️ CONFIGURATION</h3>
          <div className="space-y-4">
            <MenuItem 
              icon="settings" 
              label="Paramètres généraux" 
              iconBgColor="bg-gray-600" 
              iconTextColor="text-white" 
              link="/settings"
            />
            <MenuItem 
              icon="account_circle" 
              label="Profil utilisateur" 
              iconBgColor="bg-gray-600" 
              iconTextColor="text-white" 
              link="/profile"
            />
            <MenuItem 
              icon="sync" 
              label="Synchronisation" 
              iconBgColor="bg-green-500" 
              iconTextColor="text-white" 
              badge={{
                label: "Activée",
                color: "bg-green-600 text-white"
              }}
              link="/sync"
            />
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-xl shadow-md border-2 border-red-200">
          <MenuItem 
            icon="logout" 
            label="Déconnexion" 
            iconBgColor="bg-red-600" 
            iconTextColor="text-white" 
            onClick={() => alert("Déconnexion...")}
          />
        </div>
      </div>
    </div>
  );
}
