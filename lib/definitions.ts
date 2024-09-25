export type CanvasProps = {
  backgroundColor: string;
  canvasRef: any;
  questionsSheetImageSource?: CanvasImageSource | null;
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

export type LanguageDetails = {
  id: string;
  name: string;
  azureSpeechVoiceName: string;
};

export const languages: LanguageDetails[] = [
  {
    id: 'en-US',
    name: 'English',
    azureSpeechVoiceName: 'en-US-JennyNeural',
  },
  {
    id: 'id-ID',
    name: 'Indonesian',
    azureSpeechVoiceName: 'id-ID-ArdiNeural',
  }
];

export type LanguageCode = (typeof languages[number])['id'];
