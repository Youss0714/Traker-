import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { DashboardChart } from "@/components/ui/dashboard-chart";
import { ActivityItem } from "@/components/ui/activity-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/context/AppContext";
import { formatCurrency } from "@/lib/utils/helpers";

export default function Dashboard() {
  const { setActivePage } = useAppContext();
  
  useEffect(() => {
    setActivePage('dashboard');
  }, [setActivePage]);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard'],
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
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
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

      {/* Key Metrics Cards Row */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard 
          label="Ventes" 
          value={formatCurrency(data?.metrics?.sales?.total || 0)} 
          trend={data?.metrics?.sales?.trend} 
          trendUp={true}
        />
        <MetricCard 
          label="Commandes" 
          value={data?.metrics?.orders?.total || 0} 
          trend={data?.metrics?.orders?.trend} 
          trendUp={true}
        />
        <MetricCard 
          label="Clients" 
          value={data?.metrics?.clients?.total || 0} 
          trend={data?.metrics?.clients?.trend} 
          trendUp={true}
        />
        <MetricCard 
          label="Produits en Alerte" 
          value={data?.metrics?.inventory?.lowStock || 0} 
          trend={data?.metrics?.inventory?.trend} 
          trendUp={false}
        />
      </div>

      {/* Sales Chart */}
      <DashboardChart data={data?.dailySales || []} />

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
