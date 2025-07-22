import { useQuery } from "@tanstack/react-query";
import { MobileCard, MobileListItem, MobileButton } from "@/components/ui/mobile-card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/helpers";
import { Link } from "wouter";

interface DashboardMetrics {
  sales: { total: number; trend: string; };
  orders: { total: number; trend: string; };
  products: { total: number; trend: string; };
  clients: { total: number; trend: string; };
}

interface DashboardData {
  metrics: DashboardMetrics;
  dailySales: Array<{ date: string; amount: number; }>;
  recentActivities: Array<{
    type: 'sale' | 'client' | 'inventory' | 'pending-sale';
    title: string;
    subtitle: string;
    amount?: number;
    timestamp: string;
  }>;
}

export default function MobileDashboard() {
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Skeleton loading */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = dashboardData?.metrics;
  const activities = dashboardData?.recentActivities || [];

  const getTrendColor = (trend: string) => {
    if (trend.startsWith('+')) return 'text-green-600';
    if (trend.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return 'shopping_cart';
      case 'client': return 'person_add';
      case 'inventory': return 'inventory_2';
      case 'pending-sale': return 'pending';
      default: return 'circle';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'sale': return 'text-green-600 bg-green-50';
      case 'client': return 'text-blue-600 bg-blue-50';
      case 'inventory': return 'text-orange-600 bg-orange-50';
      case 'pending-sale': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      {/* Actions rapides */}
      <MobileCard padding="sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-900">Actions rapides</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Link href="/add-sale">
            <MobileButton
              size="sm"
              className="h-16 flex-col bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
              icon={<span className="material-icons text-lg">add_shopping_cart</span>}
            >
              <span className="text-xs mt-1">Vente</span>
            </MobileButton>
          </Link>
          <Link href="/add-product">
            <MobileButton
              size="sm"
              className="h-16 flex-col bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
              icon={<span className="material-icons text-lg">add_box</span>}
            >
              <span className="text-xs mt-1">Produit</span>
            </MobileButton>
          </Link>
          <Link href="/add-client">
            <MobileButton
              size="sm"
              className="h-16 flex-col bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
              icon={<span className="material-icons text-lg">person_add</span>}
            >
              <span className="text-xs mt-1">Client</span>
            </MobileButton>
          </Link>
        </div>
      </MobileCard>

      {/* Métriques */}
      {metrics && (
        <div className="grid grid-cols-2 gap-3">
          <MobileCard padding="sm" className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                {metrics?.sales ? formatCurrency(metrics.sales.total) : '0 FCFA'}
              </div>
              <div className="text-sm text-blue-600 font-medium">Ventes</div>
              <div className={`text-xs mt-1 ${getTrendColor(metrics?.sales?.trend || '')}`}>
                {metrics?.sales?.trend || '+0%'}
              </div>
            </div>
          </MobileCard>

          <MobileCard padding="sm" className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {metrics?.orders?.total || 0}
              </div>
              <div className="text-sm text-green-600 font-medium">Commandes</div>
              <div className={`text-xs mt-1 ${getTrendColor(metrics?.orders?.trend || '')}`}>
                {metrics?.orders?.trend || '+0%'}
              </div>
            </div>
          </MobileCard>

          <MobileCard padding="sm" className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700">
                {metrics?.products?.total || 0}
              </div>
              <div className="text-sm text-orange-600 font-medium">Produits</div>
              <div className={`text-xs mt-1 ${getTrendColor(metrics?.products?.trend || '')}`}>
                {metrics?.products?.trend || '+0%'}
              </div>
            </div>
          </MobileCard>

          <MobileCard padding="sm" className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">
                {metrics?.clients?.total || 0}
              </div>
              <div className="text-sm text-purple-600 font-medium">Clients</div>
              <div className={`text-xs mt-1 ${getTrendColor(metrics?.clients?.trend || '')}`}>
                {metrics?.clients?.trend || '+0%'}
              </div>
            </div>
          </MobileCard>
        </div>
      )}

      {/* Activités récentes */}
      <MobileCard padding="sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-900">Activités récentes</h2>
          <Link href="/sales">
            <span className="text-sm text-blue-600 font-medium">Voir tout</span>
          </Link>
        </div>
        <div className="space-y-1">
          {activities.slice(0, 5).map((activity, index) => (
            <MobileListItem
              key={index}
              leftIcon={
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  <span className="material-icons text-sm">
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
              }
              subtitle={activity.subtitle}
              rightIcon={
                <div className="text-right">
                  {activity.amount && (
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(activity.amount)}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              }
            >
              {activity.title}
            </MobileListItem>
          ))}
        </div>
      </MobileCard>

      {/* Ventes du jour */}
      <MobileCard>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-900">Résumé du jour</h2>
          <Badge variant="outline">Aujourd'hui</Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Ventes réalisées</span>
            <span className="font-semibold">{metrics?.orders.total || 0}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Chiffre d'affaires</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(metrics?.sales.total || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Nouveaux clients</span>
            <span className="font-semibold">3</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link href="/reports">
            <MobileButton variant="outline" fullWidth size="sm">
              Voir les rapports détaillés
            </MobileButton>
          </Link>
        </div>
      </MobileCard>
    </div>
  );
}