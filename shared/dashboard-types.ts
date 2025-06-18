export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  config?: any;
  isVisible: boolean;
}

export type WidgetType = 
  | 'metrics-overview'
  | 'sales-chart'
  | 'recent-activities'
  | 'top-products'
  | 'client-stats'
  | 'inventory-alerts'
  | 'revenue-trends'
  | 'quick-actions';

export interface WidgetConfig {
  [key: string]: any;
}

export interface DashboardLayout {
  userId: number;
  widgets: DashboardWidget[];
  lastUpdated: Date;
}