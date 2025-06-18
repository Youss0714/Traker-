import { DashboardChart } from "@/components/ui/dashboard-chart";

interface SalesChartWidgetProps {
  data: Array<{
    date: string;
    amount: number;
  }>;
}

export function SalesChartWidget({ data }: SalesChartWidgetProps) {
  return (
    <div className="h-full">
      <DashboardChart 
        data={data?.map((item) => ({
          day: item.date,
          amount: item.amount
        })) || []} 
      />
    </div>
  );
}