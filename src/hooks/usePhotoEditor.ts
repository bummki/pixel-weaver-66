import { useState, useCallback, useRef } from 'react';
import { Adjustments, FilterType, HistoryState } from '@/types/editor';
import { toast } from 'sonner';

const defaultAdjustments: Adjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  temperature: 0,
  exposure: 0,
};

export const usePhotoEditor = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [adjustments, setAdjustments] = useState<Adjustments>(defaultAdjustments);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const workingCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const loadImage = useCallback(async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return reject('Canvas not found');

          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Context not found');

          // Set canvas size to image size
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw image
          ctx.drawImage(img, 0, 0);

          // Store original image reference
          originalImageRef.current = img;

          // Create working canvas
          if (!workingCanvasRef.current) {
            workingCanvasRef.current = document.createElement('canvas');
          }
          workingCanvasRef.current.width = img.width;
          workingCanvasRef.current.height = img.height;
          const workingCtx = workingCanvasRef.current.getContext('2d');
          if (workingCtx) {
            workingCtx.drawImage(img, 0, 0);
          }

          // Save initial state
          saveToHistory();
          toast.success('Image loaded successfully!');
          resolve();
        };
        img.onerror = () => reject('Failed to load image');
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject('Failed to read file');
      reader.readAsDataURL(file);
    });
  }, [canvasRef]);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL();
    const newState: HistoryState = {
      imageData: dataURL,
      adjustments: { ...adjustments },
    };

    // Remove any history after current index
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);

    // Limit history to 20 states
    if (newHistory.length > 20) {
      newHistory.shift();
    } else {
      setHistoryIndex(prev => prev + 1);
    }

    setHistory(newHistory);
  }, [history, historyIndex, adjustments, canvasRef]);

  const updateAdjustment = useCallback((key: keyof Adjustments, value: number) => {
    setAdjustments(prev => ({ ...prev, [key]: value }));
    
    // Apply adjustments in real-time
    if (originalImageRef.current && canvasRef.current) {
      applyAdjustmentsToCanvas({ ...adjustments, [key]: value });
    }
  }, [adjustments, canvasRef]);

  const applyAdjustmentsToCanvas = useCallback((adj: Adjustments) => {
    const canvas = canvasRef.current;
    const originalImage = originalImageRef.current;
    if (!canvas || !originalImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply filters using CSS filters for real-time preview
    ctx.filter = `
      brightness(${100 + adj.brightness}%)
      contrast(${100 + adj.contrast}%)
      saturate(${100 + adj.saturation}%)
      hue-rotate(${adj.hue}deg)
      sepia(${adj.temperature > 0 ? adj.temperature / 2 : 0}%)
      ${adj.exposure !== 0 ? `brightness(${100 + adj.exposure}%)` : ''}
    `;

    ctx.drawImage(originalImage, 0, 0);
    
    // Reset filter
    ctx.filter = 'none';
  }, [canvasRef]);

  const applyAdjustments = useCallback(() => {
    applyAdjustmentsToCanvas(adjustments);
    saveToHistory();
    toast.success('Adjustments applied!');
  }, [adjustments, applyAdjustmentsToCanvas, saveToHistory]);

  const resetAdjustments = useCallback(() => {
    setAdjustments(defaultAdjustments);
    if (originalImageRef.current) {
      applyAdjustmentsToCanvas(defaultAdjustments);
    }
    toast.info('Adjustments reset');
  }, [applyAdjustmentsToCanvas]);

  const applyFilter = useCallback((filterType: FilterType) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    switch (filterType) {
      case 'grayscale':
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }
        break;
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        break;
      case 'invert':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }
        break;
      case 'vibrant':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.3);
          data[i + 1] = Math.min(255, data[i + 1] * 1.2);
          data[i + 2] = Math.min(255, data[i + 2] * 1.1);
        }
        break;
    }

    ctx.putImageData(imageData, 0, 0);
    saveToHistory();
    toast.success(`${filterType} filter applied!`);
  }, [canvasRef, saveToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      if (prevState && canvasRef.current) {
        const img = new Image();
        img.onload = () => {
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx && canvasRef.current) {
            canvasRef.current.width = img.width;
            canvasRef.current.height = img.height;
            ctx.drawImage(img, 0, 0);
          }
        };
        img.src = prevState.imageData;
        setAdjustments(prevState.adjustments);
        setHistoryIndex(prev => prev - 1);
      }
    }
  }, [history, historyIndex, canvasRef]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      if (nextState && canvasRef.current) {
        const img = new Image();
        img.onload = () => {
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx && canvasRef.current) {
            canvasRef.current.width = img.width;
            canvasRef.current.height = img.height;
            ctx.drawImage(img, 0, 0);
          }
        };
        img.src = nextState.imageData;
        setAdjustments(nextState.adjustments);
        setHistoryIndex(prev => prev + 1);
      }
    }
  }, [history, historyIndex, canvasRef]);

  const saveImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'photoforge-edited.png';
    link.href = canvas.toDataURL();
    link.click();
    toast.success('Image saved!');
  }, [canvasRef]);

  return {
    loadImage,
    saveImage,
    applyFilter,
    adjustments,
    updateAdjustment,
    applyAdjustments,
    resetAdjustments,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    historyIndex,
    historyLength: history.length,
  };
};