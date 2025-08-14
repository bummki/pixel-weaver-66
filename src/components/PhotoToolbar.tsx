import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Save, 
  Undo, 
  Redo, 
  Hand, 
  Crop, 
  Brush, 
  Eraser, 
  Type,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Maximize
} from 'lucide-react';
import { Tool } from '@/types/editor';

interface PhotoToolbarProps {
  selectedTool: Tool;
  onToolChange: (tool: Tool) => void;
  onFileLoad: (file: File) => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  imageLoaded: boolean;
}

export const PhotoToolbar: React.FC<PhotoToolbarProps> = ({
  selectedTool,
  onToolChange,
  onFileLoad,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  zoom,
  onZoomChange,
  imageLoaded
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileLoad(file);
    }
  };

  const tools = [
    { id: 'pan' as Tool, icon: Hand, label: 'Pan', shortcut: 'V' },
    { id: 'crop' as Tool, icon: Crop, label: 'Crop', shortcut: 'C' },
    { id: 'brush' as Tool, icon: Brush, label: 'Brush', shortcut: 'B' },
    { id: 'eraser' as Tool, icon: Eraser, label: 'Eraser', shortcut: 'E' },
    { id: 'text' as Tool, icon: Type, label: 'Text', shortcut: 'T' },
  ];

  return (
    <div className="glass border-b border-primary/20 p-4">
      <div className="flex items-center justify-between max-w-full overflow-x-auto">
        <div className="flex items-center gap-4 min-w-0">
          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">PF</span>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              PhotoForge Pro
            </span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* File Operations */}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="surface-elevated border-primary/30 hover:border-primary/50 transition-fast"
            >
              <Upload className="w-4 h-4 mr-2" />
              Open
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              disabled={!imageLoaded}
              className="surface-elevated border-primary/30 hover:border-primary/50 transition-fast"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* History */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="surface-elevated border-primary/30 hover:border-primary/50 transition-fast"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="surface-elevated border-primary/30 hover:border-primary/50 transition-fast"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Tools */}
          <div className="flex items-center gap-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = selectedTool === tool.id;
              return (
                <Button
                  key={tool.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onToolChange(tool.id)}
                  className={`
                    transition-fast
                    ${isActive 
                      ? 'gradient-primary text-white font-medium glow-primary' 
                      : 'surface-elevated border-primary/30 hover:border-primary/50'
                    }
                  `}
                  title={`${tool.label} (${tool.shortcut})`}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onZoomChange(Math.max(10, zoom - 10))}
              disabled={!imageLoaded}
              className="surface-elevated border-primary/30 hover:border-primary/50 transition-fast"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Badge variant="secondary" className="surface-elevated min-w-[60px] justify-center">
              {zoom}%
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onZoomChange(Math.min(400, zoom + 10))}
              disabled={!imageLoaded}
              className="surface-elevated border-primary/30 hover:border-primary/50 transition-fast"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onZoomChange(100)}
              disabled={!imageLoaded}
              className="surface-elevated border-primary/30 hover:border-primary/50 transition-fast"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Transform Tools */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            disabled={!imageLoaded}
            className="surface-elevated border-primary/30 hover:border-primary/50 transition-fast"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!imageLoaded}
            className="surface-elevated border-primary/30 hover:border-primary/50 transition-fast"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!imageLoaded}
            className="surface-elevated border-primary/30 hover:border-primary/50 transition-fast"
          >
            <FlipHorizontal className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!imageLoaded}
            className="surface-elevated border-primary/30 hover:border-primary/50 transition-fast"
          >
            <FlipVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};