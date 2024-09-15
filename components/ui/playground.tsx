'use client';
import React, { useRef, useEffect, useState } from "react";
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
import { CreateMessage, Message, useChat } from 'ai/react';
import { ChatRequestOptions, JSONValue } from "ai";

const Canvas = dynamic(() => import('@/components/ui/canvas'), {
    ssr: false,
});

export default function Playground() {
    const { messages, input, handleInputChange, handleSubmit, append } = useChat({
        onFinish: (message: Message) => {
            if (!/[.!?:]$/.test(message.content)) {
                console.log('onFinish special case:', message.content);
                setMessageBuffer(message.content);
            }
        },
    });
    const [messageBuffer, setMessageBuffer] = useState<string>('');
    const [messageBufferRead, setMessageBufferRead] = useState<string>('');
    const [currentlyPlayingTTSText, setCurrentlyPlayingTTSText] = useState<string>('');
    const canvasRef = useRef<{
        handleExport: () => string;
    }>(null);
    const ttsRef = useRef<{
        generateTTS: (text: string, language: string) => void;
        getTTSLoadingStatus: () => boolean;
        getTTSPlayingStatus: () => boolean;
        getTTSQueueCount: () => number;
        clearTTSQueue: () => void;
        startExternalAudioVisualization: (stream: MediaStream) => void;
    }>();

    const [pauseTimer, setPauseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [status, setStatus] = useState<'Listening' | 'Speak to interrupt' | 'Processing'>('Listening');
    const [activeStream, setActiveStream] = useState<'user' | 'bot' | null>('user');
    const [language, setLanguage] = useState<'en-US' | 'id-ID'>('en-US');
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
            setStatus('Processing');
            if (ttsRef.current) ttsRef.current.clearTTSQueue();
            const canvasDataUrl = canvasRef.current?.handleExport();
            const message: CreateMessage = {
                role: "user",
                content: finalTranscript.trim(),
            };

            const options: ChatRequestOptions = {
                data: { imageUrl: canvasDataUrl as JSONValue },
            };

            console.log('Sending transcript:', finalTranscript);
            append(message, canvasDataUrl ? options : undefined);
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
            const sentences = currentMessage.match(/[^.!?]+[.!?]+/g) || [];
            setMessageBufferRead(messageBuffer);

            sentences.forEach((sentence) => {
                const trimmedSentence = sentence.trim();
                if (trimmedSentence && ttsRef.current) {
                    console.log('Sentence:', trimmedSentence);
                    ttsRef.current.generateTTS(trimmedSentence, language);
                }
            });
        }
    }, [messageBuffer]);

    useEffect(() => {
        SpeechRecognition.startListening({
            continuous: true,
            interimResults: true,
            language: language
        });

        // if (ttsRef.current) {
        //     switch(language) {
        //         case 'id-ID':
        //             ttsRef.current.generateTTS('Selamat datang di BEExpert!', language);
        //             break;
        //         default:
        //             ttsRef.current.generateTTS('Welcome to BEExpert!', language);
        //             break;
        //     }            
        // }
        
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
            if (ttsRef.current) ttsRef.current.clearTTSQueue();
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
        console.log('activeStream changed:', activeStream);
    }, [activeStream]);

    const handleTTSPlayingStatusChange = (status: boolean) => {
        const tts = ttsRef.current;
        if (tts) console.log('ttsStatus: %s, queue count: %d', status, tts?.getTTSQueueCount())
        if (status) {
            setActiveStream('bot');
        } else if (tts && tts?.getTTSQueueCount() === 0) {
            setActiveStream('user');
        }
    };

    const handleTTSOnReadingTextChange = (text: string) => {
        setCurrentlyPlayingTTSText(text.trim());
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

            <Canvas backgroundColor={'#FAFAFA'} canvasRef={canvasRef} />
            <div className="fixed flex bottom-8 left-24 items-center space-x-2">
                <TTS ref={ttsRef} width={50} height={40} onPlayingStatusChange={handleTTSPlayingStatusChange} onReadingTextChange={handleTTSOnReadingTextChange} />
                <Badge>{status}</Badge>
                <div className="text-helper">
                    <span className="status mx-1">{activeStream === 'user' ? transcript : currentlyPlayingTTSText}</span>
                </div>
            </div>
        </>
    );
}
