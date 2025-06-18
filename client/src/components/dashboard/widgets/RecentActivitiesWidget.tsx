import { ActivityItem } from "@/components/ui/activity-item";

interface RecentActivitiesWidgetProps {
  data: Array<{
    type: 'sale' | 'client' | 'inventory' | 'pending-sale';
    description: string;
    time: string;
    extraInfo?: string;
  }>;
}

export function RecentActivitiesWidget({ data }: RecentActivitiesWidgetProps) {
  return (
    <div className="space-y-3 h-full overflow-y-auto">
      {data?.slice(0, 5).map((activity, index: number) => (
        <ActivityItem
          key={index}
          type={activity.type}
          description={activity.description}
          time={activity.time}
          extraInfo={activity.extraInfo}
        />
      ))}
    </div>
  );
}