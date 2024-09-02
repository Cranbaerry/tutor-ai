import { Stage, Layer, Line, Text } from 'react-konva';
import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import { KonvaEventObject } from 'konva/lib/Node';
import { CanvasProps, LineData } from '@/lib/definitions';
import Konva from 'konva';
import {
  Card,
} from "@/components/ui/card";
import { Pencil1Icon, EraserIcon, ArrowLeftIcon, ArrowRightIcon, ZoomInIcon, ZoomOutIcon, LineHeightIcon } from '@radix-ui/react-icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function Canvas(props: CanvasProps) {
  const stageParentRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil')
  const [lines, setLines] = useState<LineData[]>([]);
  const isDrawing = useRef<boolean>(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0
  });
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);

  // TODO: clean up later
  const [color, setColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(5)
  const [scale, setScale] = useState(1)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyStep, setHistoryStep] = useState(-1)

  useImperativeHandle(props.canvasRef, () => ({
    handleExport: () => handleExport(),
  }));

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setLines(JSON.parse(JSON.stringify(history[newStep])));
      setHistoryStep(newStep);
    }
  };


  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setLines(JSON.parse(JSON.stringify(history[newStep])));
      setHistoryStep(newStep);
    }
  };

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 3)); // Cap zoom in at 3x
  };


  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5)); // Cap zoom out at 0.5x
  };


  const handleExport = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      return uri;
    }
    return '';
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (showPlaceholder) setShowPlaceholder(false);
    isDrawing.current = true;
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;
    
    const adjustedPos = {
      x: pos.x / scale,
      y: pos.y / scale
    };
  
    setLines(prevLines => [...prevLines, { tool, points: [adjustedPos.x, adjustedPos.y] }]);
  };


  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;
  
    const adjustedPos = {
      x: pos.x / scale,
      y: pos.y / scale
    };
  
    setLines(prevLines => {
      const lastLine = prevLines[prevLines.length - 1];
      lastLine.points = lastLine.points.concat([adjustedPos.x, adjustedPos.y]);
      const newLines = [...prevLines.slice(0, -1), lastLine];
      return newLines;
    });
  };
  

  const handleMouseUp = () => {
    isDrawing.current = false;
    const newHistory = history.slice(0, historyStep + 1);
    setHistory([...newHistory, lines]);
    setHistoryStep(newHistory.length);
  };


  const handleResize = () => {
    console.log('Resizing triggered')
    var container = stageParentRef.current;
    if (!container) return;
    setDimensions({
      width: container.offsetWidth,
      height: container.offsetHeight
    });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function TooltipWrapper({ content, children }: { content: string; children: React.ReactNode }) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    )
  }
  return (
    <TooltipProvider>
      <Card className="h-full">
        <div className="flex bg-background h-full">
          <div className="w-16 bg-muted p-2 flex flex-col space-y-4 border-r">
            <TooltipWrapper content="Pencil">
              <Button
                onClick={() => setTool('pencil')}
                variant={tool === 'pencil' ? 'default' : 'ghost'}
                size="icon"
                className="w-full"
              >
                <Pencil1Icon className="h-4 w-4" />
              </Button>
            </TooltipWrapper>
            <TooltipWrapper content="Eraser">
              <Button
                onClick={() => setTool('eraser')}
                variant={tool === 'eraser' ? 'default' : 'ghost'}
                size="icon"
                className="w-full"
              >
                <EraserIcon className="h-4 w-4" />
              </Button>
            </TooltipWrapper>
            <Separator className="my-2" />
            <TooltipWrapper content="Color">
              <div className="flex justify-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-full overflow-hidden"
                />
              </div>
            </TooltipWrapper>
            <Separator className="my-2" />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full">
                  <LineHeightIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="stroke-width" className="text-sm font-medium">
                    Stroke Width: {strokeWidth}px
                  </label>
                  <Slider
                    id="stroke-width"
                    min={1}
                    max={20}
                    step={1}
                    value={[strokeWidth]}
                    onValueChange={(value) => setStrokeWidth(value[0])}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <Separator className="my-2" />
            <TooltipWrapper content="Undo">
              <Button onClick={handleUndo} disabled={historyStep <= 0} size="icon" variant="ghost" className="w-full">
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
            </TooltipWrapper>
            <TooltipWrapper content="Redo">
              <Button onClick={handleRedo} disabled={historyStep >= history.length - 1} size="icon" variant="ghost" className="w-full">
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </TooltipWrapper>
            <Separator className="my-2" />
            <TooltipWrapper content="Zoom In">
              <Button onClick={handleZoomIn} size="icon" variant="ghost" className="w-full">
                <ZoomInIcon className="h-4 w-4" />
              </Button>
            </TooltipWrapper>
            <TooltipWrapper content="Zoom Out">
              <Button onClick={handleZoomOut} size="icon" variant="ghost" className="w-full">
                <ZoomOutIcon className="h-4 w-4" />
              </Button>
            </TooltipWrapper>
            <div className="text-xs text-center">{Math.round(scale * 100)}%</div>
          </div>
          <div className="flex-1 overflow-auto">
            <div ref={stageParentRef} className="h-full w-full">
              <Stage
                ref={stageRef}
                width={dimensions.width}
                height={dimensions.height}
                scaleX={scale}
                scaleY={scale}
                draggable={false}
                style={{ backgroundColor: props.backgroundColor, borderColor: "#e4e4e7" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <Layer>
                  {lines.map((line, i) => (
                    <Line
                      key={i}
                      points={line.points}
                      stroke="#000"
                      strokeWidth={5}
                      tension={0.5}
                      lineCap="round"
                      lineJoin="round"
                      globalCompositeOperation={
                        line.tool === 'eraser' ? 'destination-out' : 'source-over'
                      }
                    />
                  ))}
                  {showPlaceholder && (
                    <Text
                      text="Interact to start drawing"
                      x={dimensions.width / 2}
                      y={dimensions.height / 2}
                      fontSize={24}
                      fontFamily="Arial"
                      fill="gray"
                      align="center"
                      verticalAlign="middle"
                      offsetX={150}
                      offsetY={40}
                      padding={20}
                    />
                  )}
                </Layer>
              </Stage>
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}

export default Canvas;
