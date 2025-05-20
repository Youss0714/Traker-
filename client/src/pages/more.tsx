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
    <Card className="card">
      <CardContent className="p-4 flex items-center">
        <div className={`${iconBgColor} ${iconTextColor} p-2 rounded-lg mr-3`}>
          <span className="material-icons">{icon}</span>
        </div>
        <span className="flex-1 text-[#212121]">{label}</span>
        {badge ? (
          <div className="flex items-center">
            <span className={`text-xs px-2 py-0.5 ${badge.color} rounded-full mr-2`}>{badge.label}</span>
            <span className="material-icons text-[#757575]">chevron_right</span>
          </div>
        ) : (
          <span className="material-icons text-[#757575]">chevron_right</span>
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
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-medium text-[#212121] mb-4">Plus</h2>

      {/* Menu Categories */}
      <div className="space-y-4">
        <div>
          <h3 className="text-[#757575] text-xs uppercase font-medium mb-2">Gestion</h3>
          <div className="space-y-2">
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

        <div>
          <h3 className="text-[#757575] text-xs uppercase font-medium mb-2">Exportation</h3>
          <div className="space-y-2">
            <MenuItem 
              icon="file_download" 
              label="Exporter les données" 
              iconBgColor="bg-[#FF9800] bg-opacity-10" 
              iconTextColor="text-[#FF9800]" 
              link="/export"
            />
            <MenuItem 
              icon="insert_chart" 
              label="Rapports" 
              iconBgColor="bg-[#FF9800] bg-opacity-10" 
              iconTextColor="text-[#FF9800]" 
              link="/reports"
            />
          </div>
        </div>

        <div>
          <h3 className="text-[#757575] text-xs uppercase font-medium mb-2">Paramètres</h3>
          <div className="space-y-2">
            <MenuItem 
              icon="settings" 
              label="Paramètres généraux" 
              iconBgColor="bg-[#757575] bg-opacity-10" 
              iconTextColor="text-[#212121]" 
              link="/settings"
            />
            <MenuItem 
              icon="account_circle" 
              label="Profil" 
              iconBgColor="bg-[#757575] bg-opacity-10" 
              iconTextColor="text-[#212121]" 
              link="/profile"
            />
            <MenuItem 
              icon="sync" 
              label="Synchronisation" 
              iconBgColor="bg-[#757575] bg-opacity-10" 
              iconTextColor="text-[#212121]" 
              badge={{
                label: "Activée",
                color: "bg-[#2E7D32] bg-opacity-10 text-[#2E7D32]"
              }}
              link="/sync"
            />
          </div>
        </div>

        <div className="pt-4">
          <MenuItem 
            icon="logout" 
            label="Déconnexion" 
            iconBgColor="bg-[#D32F2F] bg-opacity-10" 
            iconTextColor="text-[#D32F2F]" 
            onClick={() => alert("Déconnexion...")}
          />
        </div>
      </div>
    </div>
  );
}
