import React, { useRef, useState, useCallback, useEffect } from 'react';
import { PhotoToolbar } from './PhotoToolbar';
import { ControlPanel } from './ControlPanel';
import { PhotoCanvas } from './PhotoCanvas';
import { PhotoStatusBar } from './PhotoStatusBar';
import { usePhotoEditor } from '@/hooks/usePhotoEditor';
import { Tool } from '@/types/editor';

export const PhotoEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>('pan');
  const [zoom, setZoom] = useState(100);
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    loadImage,
    saveImage,
    applyFilter,
    adjustments,
    updateAdjustment,
    applyAdjustments,
    resetAdjustments,
    undo,
    redo,
    canUndo,
    canRedo,
    historyIndex,
    historyLength
  } = usePhotoEditor(canvasRef);

  const handleFileLoad = useCallback((file: File) => {
    loadImage(file).then(() => {
      setImageLoaded(true);
      setZoom(100);
    });
  }, [loadImage]);

  const handleToolChange = useCallback((tool: Tool) => {
    setSelectedTool(tool);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header Toolbar */}
      <PhotoToolbar
        selectedTool={selectedTool}
        onToolChange={handleToolChange}
        onFileLoad={handleFileLoad}
        onSave={saveImage}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        zoom={zoom}
        onZoomChange={setZoom}
        imageLoaded={imageLoaded}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Control Panel */}
        <ControlPanel
          adjustments={adjustments}
          onAdjustmentChange={updateAdjustment}
          onApplyAdjustments={applyAdjustments}
          onResetAdjustments={resetAdjustments}
          onApplyFilter={applyFilter}
          imageLoaded={imageLoaded}
        />

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <PhotoCanvas
            ref={canvasRef}
            selectedTool={selectedTool}
            zoom={zoom}
            onZoomChange={setZoom}
          />
          
          {/* Status Bar */}
          <PhotoStatusBar
            selectedTool={selectedTool}
            zoom={zoom}
            historyIndex={historyIndex}
            historyLength={historyLength}
          />
        </div>
      </div>
    </div>
  );
};