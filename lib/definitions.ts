export type CanvasProps = {
  backgroundColor: string;
  canvasRef: any;
}

export type CanvasWrapperProps = {
  backgroundColor: string;
  ref: any;
}

export type LineData = {
  tool: string;
  points: number[];
  color: string;
  size: number;
}

export type LoginData = {
  email: string;
  password: string;
};