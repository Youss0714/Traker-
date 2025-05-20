import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
}

export function MetricCard({ label, value, trend, trendUp = true }: MetricCardProps) {
  return (
    <Card className="card">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[#757575] text-xs uppercase font-medium">{label}</h3>
            <p className="text-[#212121] text-xl font-medium mt-1">{value}</p>
          </div>
          {trend && (
            <div className={`flex items-center ${trendUp ? 'text-[#2E7D32]' : 'text-[#D32F2F]'}`}>
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
