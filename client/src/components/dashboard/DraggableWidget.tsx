import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number; };
  size: { width: number; height: number; };
  config?: any;
  isVisible: boolean;
}

interface DraggableWidgetProps {
  widget: DashboardWidget;
  index: number;
  onRemove: (widgetId: string) => void;
  onToggleVisibility: (widgetId: string) => void;
  children: React.ReactNode;
}

export function DraggableWidget({ 
  widget, 
  index, 
  onRemove, 
  onToggleVisibility, 
  children 
}: DraggableWidgetProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Draggable draggableId={widget.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`relative ${snapshot.isDragging ? 'z-50' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card 
            className={`transition-all duration-200 ${
              snapshot.isDragging 
                ? 'shadow-lg scale-105 rotate-3' 
                : 'shadow-sm hover:shadow-md'
            } ${!widget.isVisible ? 'opacity-50' : ''}`}
            style={{
              width: `${widget.size.width}px`,
              height: `${widget.size.height}px`,
            }}
          >
            {/* Widget Header with Drag Handle */}
            <CardHeader 
              {...provided.dragHandleProps}
              className={`pb-2 cursor-grab active:cursor-grabbing flex flex-row items-center justify-between ${
                snapshot.isDragging ? 'cursor-grabbing' : ''
              }`}
            >
              <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
                <span className="material-icons text-gray-400 text-sm mr-2">drag_indicator</span>
                {widget.title}
              </CardTitle>
              
              {/* Widget Controls */}
              {isHovered && (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onToggleVisibility(widget.id)}
                  >
                    <span className="material-icons text-xs">
                      {widget.isVisible ? 'visibility' : 'visibility_off'}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={() => onRemove(widget.id)}
                  >
                    <span className="material-icons text-xs">close</span>
                  </Button>
                </div>
              )}
            </CardHeader>
            
            {/* Widget Content */}
            {widget.isVisible && (
              <CardContent className="p-4 pt-0 h-full overflow-hidden">
                {children}
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );
}