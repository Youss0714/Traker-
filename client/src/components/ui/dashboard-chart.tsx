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
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="material-icons text-white text-xs">trending_up</span>
          </div>
          Évolution des Ventes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-32 flex items-end space-x-2 border-b border-l border-blue-300 relative">
          {/* Chart Y-axis labels */}
          <div className="absolute -left-7 top-0 h-full flex flex-col justify-between text-xs text-blue-600">
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
                  className="w-4 bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t-sm" 
                  style={{ height: `${percentage}%` }}
                ></div>
                <span className="text-xs mt-1 text-blue-600">{item.day}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
