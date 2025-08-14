import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tool } from '@/types/editor';

interface PhotoStatusBarProps {
  selectedTool: Tool;
  zoom: number;
  historyIndex: number;
  historyLength: number;
}

export const PhotoStatusBar: React.FC<PhotoStatusBarProps> = ({
  selectedTool,
  zoom,
  historyIndex,
  historyLength
}) => {
  return (
    <div className="glass border-t border-primary/20 p-3">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Tool:</span>
            <Badge variant="outline" className="surface-elevated capitalize">
              {selectedTool}
            </Badge>
          </div>
          
          <Separator orientation="vertical" className="h-4" />
          
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Zoom:</span>
            <Badge variant="outline" className="surface-elevated">
              {zoom}%
            </Badge>
          </div>
          
          <Separator orientation="vertical" className="h-4" />
          
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">History:</span>
            <Badge variant="outline" className="surface-elevated">
              {historyIndex + 1}/{historyLength}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>ClipCraft v1.0</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <span>Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};