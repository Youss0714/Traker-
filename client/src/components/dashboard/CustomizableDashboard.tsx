import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { DraggableWidget } from './DraggableWidget';
import { MetricsOverviewWidget } from './widgets/MetricsOverviewWidget';
import { SalesChartWidget } from './widgets/SalesChartWidget';
import { RecentActivitiesWidget } from './widgets/RecentActivitiesWidget';
import { QuickActionsWidget } from './widgets/QuickActionsWidget';
import { TopProductsWidget } from './widgets/TopProductsWidget';
import { InventoryAlertsWidget } from './widgets/InventoryAlertsWidget';
import { DashboardWidget, WidgetType } from '@/../../shared/dashboard-types';

export function CustomizableDashboard() {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);

  const { data: dashboardData } = useQuery({
    queryKey: ['/api/dashboard'],
  });

  // Initialize default widgets
  useEffect(() => {
    const defaultWidgets: DashboardWidget[] = [
      {
        id: 'metrics-overview',
        type: 'metrics-overview',
        title: 'Aperçu des métriques',
        position: { x: 0, y: 0 },
        size: { width: 500, height: 200 },
        isVisible: true,
      },
      {
        id: 'sales-chart',
        type: 'sales-chart',
        title: 'Évolution des ventes',
        position: { x: 0, y: 1 },
        size: { width: 600, height: 300 },
        isVisible: true,
      },
      {
        id: 'recent-activities',
        type: 'recent-activities',
        title: 'Activités récentes',
        position: { x: 1, y: 0 },
        size: { width: 400, height: 300 },
        isVisible: true,
      },
      {
        id: 'quick-actions',
        type: 'quick-actions',
        title: 'Actions rapides',
        position: { x: 1, y: 1 },
        size: { width: 300, height: 200 },
        isVisible: true,
      },
      {
        id: 'top-products',
        type: 'top-products',
        title: 'Produits populaires',
        position: { x: 2, y: 0 },
        size: { width: 350, height: 300 },
        isVisible: false,
      },
      {
        id: 'inventory-alerts',
        type: 'inventory-alerts',
        title: 'Alertes stock',
        position: { x: 2, y: 1 },
        size: { width: 350, height: 250 },
        isVisible: false,
      },
    ];

    // Load from localStorage or use defaults
    const savedWidgets = localStorage.getItem('dashboard-widgets');
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    } else {
      setWidgets(defaultWidgets);
    }
  }, []);

  // Save widgets to localStorage
  const saveWidgets = (newWidgets: DashboardWidget[]) => {
    setWidgets(newWidgets);
    localStorage.setItem('dashboard-widgets', JSON.stringify(newWidgets));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newWidgets = Array.from(widgets);
    const [reorderedWidget] = newWidgets.splice(result.source.index, 1);
    newWidgets.splice(result.destination.index, 0, reorderedWidget);

    saveWidgets(newWidgets);
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    const newWidgets = widgets.map(widget =>
      widget.id === widgetId
        ? { ...widget, isVisible: !widget.isVisible }
        : widget
    );
    saveWidgets(newWidgets);
  };

  const removeWidget = (widgetId: string) => {
    const newWidgets = widgets.filter(widget => widget.id !== widgetId);
    saveWidgets(newWidgets);
  };

  const addWidget = (type: WidgetType) => {
    const newWidget: DashboardWidget = {
      id: `${type}-${Date.now()}`,
      type,
      title: getWidgetTitle(type),
      position: { x: 0, y: widgets.length },
      size: getDefaultSize(type),
      isVisible: true,
    };

    saveWidgets([...widgets, newWidget]);
  };

  const getWidgetTitle = (type: WidgetType): string => {
    const titles = {
      'metrics-overview': 'Aperçu des métriques',
      'sales-chart': 'Graphique des ventes',
      'recent-activities': 'Activités récentes',
      'quick-actions': 'Actions rapides',
      'top-products': 'Produits populaires',
      'inventory-alerts': 'Alertes stock',
      'client-stats': 'Statistiques clients',
      'revenue-trends': 'Tendances revenus',
    };
    return titles[type] || 'Widget';
  };

  const getDefaultSize = (type: WidgetType) => {
    const sizes = {
      'metrics-overview': { width: 500, height: 200 },
      'sales-chart': { width: 600, height: 300 },
      'recent-activities': { width: 400, height: 300 },
      'quick-actions': { width: 300, height: 200 },
      'top-products': { width: 350, height: 300 },
      'inventory-alerts': { width: 350, height: 250 },
      'client-stats': { width: 400, height: 250 },
      'revenue-trends': { width: 500, height: 300 },
    };
    return sizes[type] || { width: 300, height: 200 };
  };

  const renderWidgetContent = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'metrics-overview':
        return <MetricsOverviewWidget data={(dashboardData as any)?.metrics} />;
      case 'sales-chart':
        return <SalesChartWidget data={(dashboardData as any)?.dailySales} />;
      case 'recent-activities':
        return <RecentActivitiesWidget data={(dashboardData as any)?.recentActivities} />;
      case 'quick-actions':
        return <QuickActionsWidget />;
      case 'top-products':
        return <TopProductsWidget />;
      case 'inventory-alerts':
        return <InventoryAlertsWidget />;
      default:
        return <div className="text-gray-500">Widget non configuré</div>;
    }
  };

  const visibleWidgets = widgets.filter(widget => widget.isVisible);
  const hiddenWidgets = widgets.filter(widget => !widget.isVisible);

  return (
    <div className="space-y-6">
      {/* Customization Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tableau de bord personnalisé</h2>
          <p className="text-gray-600 mt-1">Glissez-déposez pour organiser vos widgets</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {visibleWidgets.length} widgets actifs
          </Badge>
          <Button
            variant={isCustomizing ? "default" : "outline"}
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="flex items-center space-x-2"
          >
            <span className="material-icons text-sm">
              {isCustomizing ? 'check' : 'edit'}
            </span>
            <span>{isCustomizing ? 'Terminer' : 'Personnaliser'}</span>
          </Button>
        </div>
      </div>

      {/* Add Widget Panel */}
      {isCustomizing && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-blue-800">
              Ajouter des widgets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['top-products', 'inventory-alerts', 'client-stats', 'revenue-trends'] as WidgetType[]).map(type => (
                <Button
                  key={type}
                  variant="outline"
                  onClick={() => addWidget(type)}
                  className="flex flex-col items-center p-4 h-auto space-y-2 hover:bg-blue-50"
                >
                  <span className="material-icons text-lg">add_box</span>
                  <span className="text-xs">{getWidgetTitle(type)}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden Widgets Panel */}
      {isCustomizing && hiddenWidgets.length > 0 && (
        <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">
              Widgets masqués ({hiddenWidgets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {hiddenWidgets.map(widget => (
                <div
                  key={widget.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                >
                  <span className="text-sm font-medium">{widget.title}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleWidgetVisibility(widget.id)}
                  >
                    <span className="material-icons text-sm mr-1">visibility</span>
                    Afficher
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Draggable Widgets */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min"
            >
              {visibleWidgets.map((widget, index) => (
                <DraggableWidget
                  key={widget.id}
                  widget={widget}
                  index={index}
                  onRemove={removeWidget}
                  onToggleVisibility={toggleWidgetVisibility}
                >
                  {renderWidgetContent(widget)}
                </DraggableWidget>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}