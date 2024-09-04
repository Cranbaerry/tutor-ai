'use client';
import React, { useRef, useEffect, useState } from "react";
import { MicIndicator } from "@/components/ui/mic-indicator";
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
import { useChat } from 'ai/react';

const Canvas = dynamic(() => import('@/components/ui/canvas'), {
    ssr: false,
});

export default function Playground() {
    const { messages, input, handleInputChange, handleSubmit, append } = useChat();
    const [messageBuffer, setMessageBuffer] = useState<string>('');
    const [messageBufferRead, setMessageBufferRead] = useState<string>('');
    // const [readMessage, setReadMessage] = useState<string>(''); //
    const canvasRef = useRef<any>(null);
    const ttsRef = useRef<{
        generateTTS: (text: string) => void;
        getTTSLoadingStatus: () => boolean;
        getTTSPlayingStatus: () => boolean;
        getTTSQueueCount: () => number;
        clearTTSQueue: () => void;
        startExternalAudioVisualization: (stream: MediaStream) => void;
    }>();

    const [pauseTimer, setPauseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [status, setStatus] = useState<'Listening' | 'Speak to interrupt'>('Listening');
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
            console.log('Sending transcript:  ', finalTranscript);
            // await ttsRef.current?.generateTTS('Testing');
            // await ttsRef.current?.generateTTS('I am testing');
            append({
                role: "user",
                content: finalTranscript.trim(),
            });
            if (ttsRef.current) ttsRef.current.clearTTSQueue();
            //ttsRef.current?.generateTTS('In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available');
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
        if (messages.length > 0) {
            const latestMessage = messages[messages.length - 1];
            const content = latestMessage.content;
            if (latestMessage?.role === 'assistant') {
                if (content && /[.!?:]$/.test(content)) {
                    setMessageBuffer(content);
                }
            }
        }
    }, [messages]);

    useEffect(() => {
        if (messageBuffer.length > 0) {
            const currentMessage = messageBuffer.replace(messageBufferRead, '');
            const sentences = currentMessage.match(/[^.!?]+[.!?]*|\d+\./g) || [];
            setMessageBufferRead(messageBuffer);

            sentences.forEach((sentence) => {
                const trimmedSentence = sentence.trim();
                if (trimmedSentence && ttsRef.current) {
                    console.log('Sentence:', trimmedSentence);
                    ttsRef.current.generateTTS(trimmedSentence);
                }
            });

        }
    }, [messageBuffer]);


    useEffect(() => {
        SpeechRecognition.startListening({ continuous: true, interimResults: true });

        return () => {
            SpeechRecognition.stopListening();
            if (pauseTimer) {
                clearTimeout(pauseTimer);
            }
        };
    }, []);

    useEffect(() => {
        if (activeStream === 'user') {
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
        if (transcript.trim() !== '') {
            setActiveStream('user');
        }
    }, [transcript]);

    useEffect(() => {
        console.log('activeStream changed: ' + activeStream);
    }, [activeStream]);

    const handleTTSPlayingStatusChange = (status: boolean) => {
        const tts = ttsRef.current;
        if (status) {
            setActiveStream('bot');
        } else if (tts && tts?.getTTSQueueCount() === 0) {
            setActiveStream('user');
        }
    };

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

            <Canvas backgroundColor={'rgb(250 250 250 / 1)'} canvasRef={canvasRef} />
            <div className="fixed flex bottom-8 left-24 items-center space-x-2">
                <TTS ref={ttsRef} width={50} height={40} onPlayingStatusChange={handleTTSPlayingStatusChange} />
                <Badge>{status}</Badge>
                <MicIndicator listening={listening} transcript={transcript} />
            </div>
        </>
    );
}
