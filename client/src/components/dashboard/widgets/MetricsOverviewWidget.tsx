import { MetricCard } from "@/components/ui/metric-card";

interface MetricsOverviewWidgetProps {
  data: {
    sales: { total: number; trend: string; };
    orders: { total: number; trend: string; };
    clients: { total: number; trend: string; };
    products: { total: number; trend: string; };
  };
}

export function MetricsOverviewWidget({ data }: MetricsOverviewWidgetProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      <MetricCard 
        label="Ventes" 
        value={formatCurrency(data?.sales?.total || 0)} 
        trend={data?.sales?.trend || ""} 
        trendUp={true}
        colorTheme="green"
      />
      <MetricCard 
        label="Commandes" 
        value={data?.orders?.total || 0} 
        trend={data?.orders?.trend || ""} 
        trendUp={true}
        colorTheme="blue"
      />
      <MetricCard 
        label="Clients" 
        value={data?.clients?.total || 0} 
        trend={data?.clients?.trend || ""} 
        trendUp={true}
        colorTheme="orange"
      />
      <MetricCard 
        label="Produits" 
        value={data?.products?.total || 0} 
        trend={data?.products?.trend || ""} 
        trendUp={false}
        colorTheme="purple"
      />
    </div>
  );
}