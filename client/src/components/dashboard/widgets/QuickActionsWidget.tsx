import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function QuickActionsWidget() {
  const [, navigate] = useLocation();

  const quickActions = [
    {
      icon: "point_of_sale",
      label: "Nouvelle vente",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      action: () => navigate("/add-sale")
    },
    {
      icon: "person_add",
      label: "Ajouter client",
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
      action: () => navigate("/add-client")
    },
    {
      icon: "inventory_2",
      label: "Ajouter produit",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      action: () => navigate("/add-product")
    },
    {
      icon: "receipt",
      label: "Factures",
      color: "bg-gradient-to-r from-orange-500 to-red-500",
      action: () => navigate("/invoices")
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      {quickActions.map((action, index) => (
        <Button
          key={index}
          onClick={action.action}
          className={`${action.color} text-white border-none shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center p-4 h-full`}
        >
          <span className="material-icons text-2xl mb-2">{action.icon}</span>
          <span className="text-xs font-medium text-center">{action.label}</span>
        </Button>
      ))}
    </div>
  );
}