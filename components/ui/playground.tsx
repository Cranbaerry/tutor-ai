'use client';
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MicIndicator } from "@/components/ui/mic-indicator";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import dynamic from 'next/dynamic';
const Canvas = dynamic(() => import('@/components/ui/canvas'), {
    ssr: false,
  });
export default function Playground() {
    const canvasRef = useRef<any>(null);
    const [pauseTimer, setPauseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const {
        transcript,
        finalTranscript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable
    } = useSpeechRecognition();

    // Function to handle sending transcript to the API
    const sendTranscript = async () => {
        if (finalTranscript.trim() !== '') {
            console.log('Sending transcript to API: ', finalTranscript);
            // try {
            //     const response = await fetch('https://your-api-endpoint.com/transcribe', {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({ transcript: finalTranscript }),
            //     });
            //     const data = await response.json();
            //     console.log('Success:', data);
            //     resetTranscript();
            // } catch (error) {
            //     console.error('Error:', error);
            // }
        }
    };

    const resetPauseTimer = () => {
        if (pauseTimer) {
            clearTimeout(pauseTimer);
        }
        setPauseTimer(setTimeout(() => {
            sendTranscript();
            resetTranscript();
        }, 2000));
    };

    useEffect(() => {
        if (finalTranscript) {
            resetPauseTimer();
        }
    }, [finalTranscript]);

    useEffect(() => {
        SpeechRecognition.startListening({ continuous: true, interimResults: true });

        return () => {
            SpeechRecognition.stopListening();
            if (pauseTimer) {
                clearTimeout(pauseTimer);
            }
        };
    }, []);

    return (
        <>
            {!browserSupportsSpeechRecognition &&
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
            }

            {!isMicrophoneAvailable &&
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
            }
            <Canvas backgroundColor={'red'} canvasRef={canvasRef} />
            <div className="flex items-center space-x-2">
                <Button onClick={() => {
                    const canvas = canvasRef.current;
                    console.log(canvas);
                    if (!canvas) return;
                    const data = canvas.handleExport();
                    console.log(data);
                }}>Submit</Button>
                <Button variant="secondary">
                    <span className="sr-only">Show history</span>
                    <CounterClockwiseClockIcon className="h-4 w-4" />
                </Button>
                <MicIndicator listening={listening} transcript={transcript} />
            </div>
        </>
    );
}
