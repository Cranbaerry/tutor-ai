'use client';
import {useRef} from "react"
import Canvas from "@/components/ui/canvas";
import { Button } from "@/components/ui/button"
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons"

export default function Playground() {
    const canvasRef = useRef<any>();
    return (
        <>
            <Canvas ref={canvasRef} />
            <div className="flex items-center space-x-2">
                <Button onClick={() => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;                    
                    const data = canvas.handleExport();
                    console.log(data);
                }}>Submit</Button>
                <Button variant="secondary">
                    <span className="sr-only">Show history</span>
                    <CounterClockwiseClockIcon className="h-4 w-4" />
                </Button>
            </div>
        </>
    );
};