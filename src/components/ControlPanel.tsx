import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Palette,
  Filter,
  Sliders,
  Sparkles,
  RotateCcw,
  Check
} from 'lucide-react';
import { Adjustments, FilterType } from '@/types/editor';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ControlPanelProps {
  adjustments: Adjustments;
  onAdjustmentChange: (key: keyof Adjustments, value: number) => void;
  onApplyAdjustments: () => void;
  onResetAdjustments: () => void;
  onApplyFilter: (filter: FilterType) => void;
  imageLoaded: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  adjustments,
  onAdjustmentChange,
  onApplyAdjustments,
  onResetAdjustments,
  onApplyFilter,
  imageLoaded
}) => {
  const adjustmentControls = [
    { key: 'brightness' as keyof Adjustments, label: 'Brightness', min: -100, max: 100 },
    { key: 'contrast' as keyof Adjustments, label: 'Contrast', min: -100, max: 100 },
    { key: 'saturation' as keyof Adjustments, label: 'Saturation', min: -100, max: 100 },
    { key: 'hue' as keyof Adjustments, label: 'Hue', min: -180, max: 180 },
    { key: 'temperature' as keyof Adjustments, label: 'Temperature', min: -100, max: 100 },
    { key: 'exposure' as keyof Adjustments, label: 'Exposure', min: -100, max: 100 },
  ];

  const filters = [
    { id: 'grayscale' as FilterType, label: 'Grayscale', color: 'from-gray-400 to-gray-600' },
    { id: 'sepia' as FilterType, label: 'Sepia', color: 'from-amber-400 to-amber-600' },
    { id: 'invert' as FilterType, label: 'Invert', color: 'from-blue-400 to-purple-600' },
    { id: 'vibrant' as FilterType, label: 'Vibrant', color: 'from-pink-400 to-purple-600' },
    { id: 'blur' as FilterType, label: 'Blur', color: 'from-cyan-400 to-blue-600' },
    { id: 'sharpen' as FilterType, label: 'Sharpen', color: 'from-green-400 to-emerald-600' },
  ];

  const hasAdjustments = Object.values(adjustments).some(value => value !== 0);

  return (
    <div className="w-80 border-r border-primary/20 bg-surface/50 backdrop-blur-sm overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Color & Tone Adjustments */}
        <Card className="control-panel">
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-primary/5 transition-fast rounded-t-xl">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-primary" />
                  Color & Tone
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {adjustmentControls.map((control) => (
                  <div key={control.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-muted-foreground">
                        {control.label}
                      </label>
                      <Badge variant="outline" className="surface-elevated min-w-[60px] justify-center">
                        {adjustments[control.key]}
                      </Badge>
                    </div>
                    <Slider
                      value={[adjustments[control.key]]}
                      onValueChange={(value) => onAdjustmentChange(control.key, value[0])}
                      min={control.min}
                      max={control.max}
                      step={1}
                      disabled={!imageLoaded}
                      className="w-full"
                    />
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex gap-2">
                  <Button 
                    onClick={onApplyAdjustments}
                    disabled={!imageLoaded || !hasAdjustments}
                    className="flex-1 gradient-primary hover:opacity-90 transition-fast"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Apply
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={onResetAdjustments}
                    disabled={!imageLoaded || !hasAdjustments}
                    className="surface-elevated border-primary/30 hover:border-primary/50"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Filters */}
        <Card className="control-panel">
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-primary/5 transition-fast rounded-t-xl">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-secondary" />
                  Filters
                  <Sparkles className="w-4 h-4 ml-auto text-secondary animate-pulse" />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {filters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant="outline"
                      size="sm"
                      onClick={() => onApplyFilter(filter.id)}
                      disabled={!imageLoaded}
                      className={`
                        h-12 surface-elevated border-primary/30 hover:border-primary/50 
                        transition-all duration-300 group relative overflow-hidden
                      `}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${filter.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      <span className="relative z-10 text-xs font-medium">{filter.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Brush Settings */}
        <Card className="control-panel">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-primary/5 transition-fast rounded-t-xl">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="w-5 h-5 text-accent" />
                  Brush & Effects
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Brush Size</label>
                  <Slider
                    defaultValue={[16]}
                    min={1}
                    max={100}
                    step={1}
                    disabled={!imageLoaded}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Opacity</label>
                  <Slider
                    defaultValue={[100]}
                    min={0}
                    max={100}
                    step={1}
                    disabled={!imageLoaded}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  );
};