import { Stage, Layer, Line, Text } from 'react-konva';
import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import { KonvaEventObject } from 'konva/lib/Node';
import { CanvasProps, LineData } from '@/lib/definitions';
import Konva from 'konva';
import {
  Card,
} from "@/components/ui/card";

function Canvas(props: CanvasProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [tool, setTool] = useState<string>('pen');
  const [lines, setLines] = useState<LineData[]>([]);
  const isDrawing = useRef<boolean>(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0
  });
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);

  useImperativeHandle(props.canvasRef, () => ({
    handleExport: () => handleExport(),
  }));

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
    setLines(prevLines => [...prevLines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;
    setLines(prevLines => {
      const lastLine = prevLines[prevLines.length - 1];
      lastLine.points = lastLine.points.concat([pos.x, pos.y]);
      const newLines = [...prevLines.slice(0, -1), lastLine];
      return newLines;
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  useEffect(() => {
    if (divRef.current) {
      setDimensions({
        width: divRef.current.offsetWidth,
        height: divRef.current.offsetHeight
      });
    }
  }, []);

  return (
    <div ref={divRef} className="h-full w-full">
      <Card>
        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          draggable={false}
          style={{ backgroundColor: props.backgroundColor, borderColor: "#e4e4e7"}}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
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
                offsetX={150} // Half of the text width
                offsetY={40} // Half of the text height
                padding={20}
              />
            )}
          </Layer>
        </Stage>
      </Card>
    </div>
  );
}

export default Canvas;
