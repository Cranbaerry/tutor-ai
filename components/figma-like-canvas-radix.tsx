'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Pencil1Icon, EraserIcon, ArrowLeftIcon, ArrowRightIcon, ZoomInIcon, ZoomOutIcon } from '@radix-ui/react-icons'

export function FigmaLikeCanvasRadix() {
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil')
  const [color, setColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(5)
  const [scale, setScale] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const isDrawing = useRef(false)
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyStep, setHistoryStep] = useState(-1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth - 64
    canvas.height = window.innerHeight - 32
    const context = canvas.getContext('2d')
    if (!context) return

    context.lineCap = 'round'
    context.strokeStyle = color
    context.lineWidth = strokeWidth
    contextRef.current = context

    // Save initial blank canvas state
    const initialState = context.getImageData(0, 0, canvas.width, canvas.height)
    setHistory([initialState])
    setHistoryStep(0)
  }, [])

  useEffect(() => {
    if (!contextRef.current) return
    contextRef.current.strokeStyle = color
    contextRef.current.lineWidth = strokeWidth
  }, [color, strokeWidth])

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent
    contextRef.current?.beginPath()
    contextRef.current?.moveTo(offsetX / scale, offsetY / scale)
    isDrawing.current = true
  }

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !contextRef.current) return
    const { offsetX, offsetY } = event.nativeEvent
    
    if (tool === 'eraser') {
      contextRef.current.globalCompositeOperation = 'destination-out'
    } else {
      contextRef.current.globalCompositeOperation = 'source-over'
    }
    
    contextRef.current.lineTo(offsetX / scale, offsetY / scale)
    contextRef.current.stroke()
  }

  const stopDrawing = () => {
    if (!contextRef.current || !canvasRef.current) return
    contextRef.current.closePath()
    isDrawing.current = false

    // Save the current state to history
    const canvas = canvasRef.current
    const currentState = contextRef.current.getImageData(0, 0, canvas.width, canvas.height)
    setHistory(prevHistory => [...prevHistory.slice(0, historyStep + 1), currentState])
    setHistoryStep(prevStep => prevStep + 1)
  }

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(prevStep => prevStep - 1)
      const canvas = canvasRef.current
      const context = contextRef.current
      if (!canvas || !context) return
      context.putImageData(history[historyStep - 1], 0, 0)
    }
  }

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(prevStep => prevStep + 1)
      const canvas = canvasRef.current
      const context = contextRef.current
      if (!canvas || !context) return
      context.putImageData(history[historyStep + 1], 0, 0)
    }
  }

  const handleZoomIn = () => {
    setScale(prevScale => {
      const newScale = Math.min(prevScale * 1.2, 5)
      updateCanvasScale(newScale)
      return newScale
    })
  }

  const handleZoomOut = () => {
    setScale(prevScale => {
      const newScale = Math.max(prevScale / 1.2, 0.1)
      updateCanvasScale(newScale)
      return newScale
    })
  }

  const updateCanvasScale = (newScale: number) => {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context) return

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    canvas.style.width = `${canvas.width * newScale}px`
    canvas.style.height = `${canvas.height * newScale}px`
    context.putImageData(imageData, 0, 0)
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
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
          <TooltipWrapper content="Stroke Width">
            <Slider
              orientation="vertical"
              min={1}
              max={20}
              step={1}
              value={[strokeWidth]}
              onValueChange={(value) => setStrokeWidth(value[0])}
              className="h-24"
            />
          </TooltipWrapper>
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
        <div className="flex-1 p-4 overflow-auto">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            className="border border-gray-300 bg-white"
          />
        </div>
      </div>
    </TooltipProvider>
  )
}

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