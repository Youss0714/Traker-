import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  colorTheme?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo';
}

export function MetricCard({ label, value, trend, trendUp = true, colorTheme = 'blue' }: MetricCardProps) {
  const colorClasses = {
    blue: {
      gradient: 'bg-gradient-to-r from-blue-100 to-cyan-100',
      border: 'border-blue-200',
      icon: 'bg-blue-500',
      text: 'text-blue-800',
      subtext: 'text-blue-600'
    },
    green: {
      gradient: 'bg-gradient-to-r from-green-100 to-emerald-100',
      border: 'border-green-200',
      icon: 'bg-green-500',
      text: 'text-green-800',
      subtext: 'text-green-600'
    },
    purple: {
      gradient: 'bg-gradient-to-r from-purple-100 to-pink-100',
      border: 'border-purple-200',
      icon: 'bg-purple-500',
      text: 'text-purple-800',
      subtext: 'text-purple-600'
    },
    orange: {
      gradient: 'bg-gradient-to-r from-orange-100 to-red-100',
      border: 'border-orange-200',
      icon: 'bg-orange-500',
      text: 'text-orange-800',
      subtext: 'text-orange-600'
    },
    pink: {
      gradient: 'bg-gradient-to-r from-pink-100 to-rose-100',
      border: 'border-pink-200',
      icon: 'bg-pink-500',
      text: 'text-pink-800',
      subtext: 'text-pink-600'
    },
    indigo: {
      gradient: 'bg-gradient-to-r from-indigo-100 to-purple-100',
      border: 'border-indigo-200',
      icon: 'bg-indigo-500',
      text: 'text-indigo-800',
      subtext: 'text-indigo-600'
    }
  };

  const theme = colorClasses[colorTheme];

  return (
    <Card className={`${theme.gradient} ${theme.border} shadow-sm`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${theme.icon} rounded-full flex items-center justify-center`}>
              <span className="material-icons text-white text-lg">
                {colorTheme === 'blue' ? 'analytics' : 
                 colorTheme === 'green' ? 'monetization_on' :
                 colorTheme === 'purple' ? 'inventory_2' :
                 colorTheme === 'orange' ? 'people' :
                 colorTheme === 'pink' ? 'shopping_cart' : 'trending_up'}
              </span>
            </div>
            <div>
              <h3 className={`${theme.subtext} text-xs uppercase font-medium`}>{label}</h3>
              <p className={`${theme.text} text-xl font-medium mt-1`}>{value}</p>
            </div>
          </div>
          {trend && (
            <div className={`flex items-center ${trendUp ? 'text-green-600' : 'text-red-600'} bg-white px-2 py-1 rounded-full shadow-sm`}>
              <span className="material-icons text-sm">
                {trendUp ? 'arrow_upward' : 'arrow_downward'}
              </span>
              <span className="text-xs font-medium">{trend}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
