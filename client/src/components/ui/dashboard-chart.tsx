import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type DataPoint = {
  day: string;
  amount: number;
};

interface DashboardChartProps {
  data: DataPoint[];
  maxValue?: number;
}

export function DashboardChart({ data, maxValue }: DashboardChartProps) {
  // Calculate chart scale
  const highestValue = maxValue || Math.max(...data.map(item => item.amount), 600000);
  
  // Format currency for labels
  const formatCurrency = (value: number) => {
    return `${Math.round(value / 1000)}K`;
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium text-[#212121]">Évolution des Ventes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 flex items-end space-x-2 border-b border-l border-gray-200 relative">
          {/* Chart Y-axis labels */}
          <div className="absolute -left-7 top-0 h-full flex flex-col justify-between text-xs text-[#757575]">
            <span>{formatCurrency(highestValue)}</span>
            <span>{formatCurrency(highestValue * 0.75)}</span>
            <span>{formatCurrency(highestValue * 0.5)}</span>
            <span>{formatCurrency(highestValue * 0.25)}</span>
            <span>0</span>
          </div>
          
          {/* Chart bars */}
          {data.map((item, index) => {
            const percentage = (item.amount / highestValue) * 100;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-6 bg-[#1976D2] rounded-t-sm" 
                  style={{ height: `${percentage}%` }}
                ></div>
                <span className="text-xs mt-1 text-[#757575]">{item.day}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
