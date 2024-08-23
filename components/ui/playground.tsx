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
import { TTS } from "@/components/ui/tts"
import dynamic from 'next/dynamic';
import { Badge } from "@/components/ui/badge"

const Canvas = dynamic(() => import('@/components/ui/canvas'), {
    ssr: false,
});

export default function Playground() {
    const canvasRef = useRef<any>(null);
    const ttsRef = useRef<{
        generateTTS: (text: string) => void;
        getTTSLoadingStatus: () => boolean;
        getTTSPlayingStatus: () => boolean;
        startExternalAudioVisualization: (stream: MediaStream) => void;  // New method
    }>();

    const [pauseTimer, setPauseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [status, setStatus] = useState<'Start speaking' | 'Listening' | 'Speak to interrupt'>('Start speaking');
    const [activeStream, setActiveStream] = useState<'user' | 'bot' | null>('user');
    const {
        transcript,
        finalTranscript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable
    } = useSpeechRecognition();

    const sendTranscript = async () => {
        if (finalTranscript.trim() !== '') {
            console.log('Sending transcript to API: ', finalTranscript);
            ttsRef.current?.generateTTS('n publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available');
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

    // useEffect(() => {
    //     if (ttsRef.current) {
    //         const checkStatus = () => {
    //             if (ttsRef.current?.getTTSLoadingStatus() || ttsRef.current?.getTTSPlayingStatus()) {
    //                 setStatus('Speak to interrupt');
    //             }
    //         };

    //         const intervalId = setInterval(checkStatus, 500);
    //         return () => clearInterval(intervalId);
    //     }
    // }, [ttsRef.current]);

    useEffect(() => {
        if (transcript.trim() !== '') {
            if (status !== 'Speak to interrupt') {
                
            }
        } else if (!ttsRef.current?.getTTSPlayingStatus()) {
            setStatus('Start speaking');
        }
    }, [transcript]);

    useEffect(() => {
        if (activeStream == 'user') {
            setStatus('Listening');
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                if (ttsRef.current) {
                    ttsRef.current.startExternalAudioVisualization(stream);
                }
            });
        } else {
            setStatus('Speak to interrupt');
        }
    }, [activeStream]);

    useEffect(() => {
        if (ttsRef.current?.getTTSPlayingStatus() && activeStream !== 'bot') {
            setActiveStream('bot');
            //ttsRef.current.startExternalAudioVisualization(null);
        }
    }, [ttsRef.current?.getTTSPlayingStatus()]);

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
            <Canvas backgroundColor={''} canvasRef={canvasRef} />
            <div className="flex items-center space-x-2">
                <TTS ref={ttsRef} width={100} height={50} />
                <Badge>{status}</Badge>
                <MicIndicator listening={listening} transcript={transcript} />
            </div>
        </>
    );
}
