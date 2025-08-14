import React, { forwardRef, useEffect, useState } from 'react';
import { Tool } from '@/types/editor';

interface PhotoCanvasProps {
  selectedTool: Tool;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export const PhotoCanvas = forwardRef<HTMLCanvasElement, PhotoCanvasProps>(
  ({ selectedTool, zoom, onZoomChange }, ref) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: Math.round(e.clientX - rect.left),
        y: Math.round(e.clientY - rect.top)
      });
    };

    const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      const newZoom = Math.max(10, Math.min(400, zoom + delta));
      onZoomChange(newZoom);
    };

    const getCursorStyle = () => {
      switch (selectedTool) {
        case 'pan':
          return isDragging ? 'grabbing' : 'grab';
        case 'crop':
          return 'crosshair';
        case 'brush':
          return 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==") 12 12, auto';
        case 'eraser':
          return 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=") 12 12, auto';
        case 'text':
          return 'text';
        default:
          return 'default';
      }
    };

    useEffect(() => {
      const handleMouseUp = () => setIsDragging(false);
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    return (
      <div className="flex-1 canvas-stage relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="relative border border-primary/20 rounded-lg shadow-2xl glow-primary"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center',
            }}
          >
            <canvas
              ref={ref}
              width={800}
              height={600}
              className="block bg-white/5 backdrop-blur-sm rounded-lg"
              style={{ 
                cursor: getCursorStyle(),
                maxWidth: '90vw',
                maxHeight: '70vh',
              }}
              onMouseMove={handleMouseMove}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onWheel={handleWheel}
            />
            
            {/* Canvas Info Overlay */}
            <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2 text-sm font-medium">
              Tool: <span className="text-primary capitalize">{selectedTool}</span>
            </div>
            
            {/* Mouse Position Indicator */}
            <div className="absolute top-4 right-4 glass rounded-lg px-3 py-2 text-sm font-mono">
              {mousePos.x}, {mousePos.y}
            </div>
          </div>
        </div>

        {/* Drop Zone Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full gradient-primary flex items-center justify-center opacity-50">
              <span className="text-3xl">🎨</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground/70">
                Drop an image here or click Open
              </h3>
              <p className="text-muted-foreground">
                Supports JPG, PNG, GIF, and other image formats
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PhotoCanvas.displayName = 'PhotoCanvas';