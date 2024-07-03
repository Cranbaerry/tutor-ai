import React, { useRef, useEffect } from "react";
import Canvas from "@/components/ui/canvas";
import { Button } from "@/components/ui/button";
import { MicIndicator } from "@/components/ui/mic-indicator";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Playground() {
    const canvasRef = useRef<any>();
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable
    } = useSpeechRecognition();
    
    const startListening = () => SpeechRecognition.startListening({ continuous: true });
    
    useEffect(() => {
        startListening();
    }, []);

    return (
        <>
            {!browserSupportsSpeechRecognition ?
                <AlertDialog defaultOpen={true}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Browser not supported</AlertDialogTitle>
                            <AlertDialogDescription>
                                Your browser doesn&apos;t support speech recognition. For a smooth experience, please try using the latest version of Google Chrome or Microsoft Edge.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction>Got it!</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                : null}

            {!isMicrophoneAvailable ?
                <AlertDialog defaultOpen={true}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Microphone not recognized</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please allow this web page to use your microphone before transcription can begin.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction>Got it!</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                : null}

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
                <MicIndicator listening={true} transcript={transcript} />
            </div>
        </>
    );
}