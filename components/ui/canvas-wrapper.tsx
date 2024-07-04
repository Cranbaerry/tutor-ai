'use client';
import React, { forwardRef, useRef } from "react";
import dynamic from 'next/dynamic';
import { CanvasWrapperProps } from '@/lib/definitions';

const Canvas = dynamic(() => import('@/components/ui/canvas'), {
  ssr: false,
});

const CanvasWrapper = forwardRef((props: CanvasWrapperProps, ref) => {
  return (
    <Canvas {...props} canvasRef={ref} />
  );
});

CanvasWrapper.displayName = 'Canvas';
export default CanvasWrapper;