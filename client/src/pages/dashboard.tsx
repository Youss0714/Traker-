import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { DashboardChart } from "@/components/ui/dashboard-chart";
import { ActivityItem } from "@/components/ui/activity-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context/AppContext";
import { formatCurrency } from "@/lib/utils/helpers";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface DashboardMetrics {
  sales: {
    total: number;
    trend: string;
  };
  orders: {
    total: number;
    trend: string;
  };
  products: {
    total: number;
    trend: string;
  };
  clients: {
    total: number;
    trend: string;
  };
}

interface DashboardData {
  metrics: DashboardMetrics;
  dailySales: Array<{
    date: string;
    amount: number;
  }>;
  recentActivities: Array<{
    type: 'sale' | 'client' | 'inventory' | 'pending-sale';
    description: string;
    time: string;
    extraInfo?: string;
  }>;
}

export default function Dashboard() {
  const { setActivePage } = useAppContext();
  const [timeRange, setTimeRange] = useState("week");
  const [filters, setFilters] = useState<string[]>([]);
  
  useEffect(() => {
    setActivePage('dashboard');
  }, [setActivePage]);
  
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard', timeRange, filters],
  });
  
  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-[#212121]">Tableau de Bord</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <span className="material-icons text-[#757575] text-sm mr-1">calendar_today</span>
              <span>Cette semaine</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <span className="material-icons text-[#757575] text-sm">more_vert</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-[90px]">
              <CardContent className="p-4 flex items-center justify-center">
                <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Évolution des Ventes</CardTitle>
          </CardHeader>
          <CardContent className="h-48 bg-gray-100 animate-pulse rounded-sm"></CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm">Activités Récentes</CardTitle>
            <Button variant="link" size="sm" className="text-[#1976D2] h-auto p-0">
              Voir tout
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3 pb-4 border-b last:border-0">
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <h3 className="text-red-700 font-medium">Erreur de chargement</h3>
            <p className="text-sm text-red-600 mt-1">
              Impossible de charger les données du tableau de bord.
            </p>
            <Button className="mt-4 bg-red-600" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Aperçu des performances</h2>
          <p className="text-gray-600 mt-1">Suivez vos indicateurs clés en temps réel</p>
        </div>
        <div className="flex space-x-2">
          {/* Sélecteur de période */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <span className="material-icons text-[#757575] text-sm mr-1">calendar_today</span>
                <span>
                  {timeRange === "day" && "Aujourd'hui"}
                  {timeRange === "week" && "Cette semaine"}
                  {timeRange === "month" && "Ce mois"}
                  {timeRange === "year" && "Cette année"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeRange("day")}>
                Aujourd'hui
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("week")}>
                Cette semaine
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("month")}>
                Ce mois
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("year")}>
                Cette année
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Filtres */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2 relative">
                <span className="material-icons text-[#757575] text-sm">tune</span>
                {filters.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {filters.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60" align="end">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Filtres</h4>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="filter-sales" className="text-sm">Ventes</label>
                    <input 
                      type="checkbox" 
                      id="filter-sales" 
                      checked={filters.includes('sales')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters([...filters, 'sales']);
                        } else {
                          setFilters(filters.filter(f => f !== 'sales'));
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="filter-clients" className="text-sm">Clients</label>
                    <input 
                      type="checkbox" 
                      id="filter-clients"
                      checked={filters.includes('clients')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters([...filters, 'clients']);
                        } else {
                          setFilters(filters.filter(f => f !== 'clients'));
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="filter-inventory" className="text-sm">Inventaire</label>
                    <input 
                      type="checkbox" 
                      id="filter-inventory"
                      checked={filters.includes('inventory')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters([...filters, 'inventory']);
                        } else {
                          setFilters(filters.filter(f => f !== 'inventory'));
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setFilters([])}
                  >
                    Réinitialiser
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      // Fermer le popover après l'application des filtres
                      document.body.click();
                    }}
                  >
                    Appliquer
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Key Metrics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Ventes" 
          value={formatCurrency(data?.metrics?.sales?.total || 0)} 
          trend={data?.metrics?.sales?.trend || ""} 
          trendUp={true}
        />
        <MetricCard 
          label="Commandes" 
          value={data?.metrics?.orders?.total || 0} 
          trend={data?.metrics?.orders?.trend || ""} 
          trendUp={true}
        />
        <MetricCard 
          label="Clients" 
          value={data?.metrics?.clients?.total || 0} 
          trend={data?.metrics?.clients?.trend || ""} 
          trendUp={true}
        />
        <MetricCard 
          label="Produits" 
          value={data?.metrics?.products?.total || 0} 
          trend={data?.metrics?.products?.trend || ""} 
          trendUp={false}
        />
      </div>

      {/* Sales Chart */}
      <DashboardChart data={data?.dailySales?.map(item => ({
        day: item.date,
        amount: item.amount
      })) || []} />

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex justify-between items-center pb-2">
          <CardTitle className="text-sm font-medium text-[#212121]">Activités Récentes</CardTitle>
          <Button variant="link" size="sm" className="text-[#1976D2] h-auto p-0">
            Voir tout
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {data?.recentActivities?.map((activity: any, index: number) => (
            <ActivityItem
              key={index}
              type={activity.type}
              description={activity.description}
              time={activity.date}
              extraInfo={activity.client}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
