'use client';
import React, { useRef, useEffect, useState, useCallback } from "react";
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
import { toast } from "sonner";
import { LanguageCode } from "@/lib/definitions";
import { useTabActive } from "@/hooks/use-tab-active";
import { DialogFinalAnswer } from "./final-answer-dialog";
import { Icons } from "@/components/ui/icons";
import { Button } from "./button";
import { Mic, MicOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import ChatDrawers from '@/components/ui/chat-drawers';

const Canvas = dynamic(() => import('@/components/ui/canvas'), {
    ssr: false,
});

interface IPlaygroundProps {
    language: LanguageCode;
}

export default function Playground({ language }: IPlaygroundProps) {
    const [toolCall, setToolCall] = useState<string>();
    const { messages, input, handleInputChange, handleSubmit, append } = useChat({
        onToolCall({ toolCall }) {
            setToolCall(toolCall.toolName);
        },
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

    const [questionSheetImageSource, setQuestionSheetImageSource] = useState<HTMLImageElement | null>(null);
    const [pauseTimer, setPauseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [status, setStatus] = useState<'Listening' | 'Speak to interrupt' | 'Processing'>('Listening');
    const [activeStream, setActiveStream] = useState<'user' | 'bot' | null>('user');
    const [isEmbeddingModelActive, setIsEmbeddingModelActive] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false)
    const [stream, setStream] = useState<MediaStream | null>(null)

    const {
        transcript,
        finalTranscript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable
    } = useSpeechRecognition();

    const loadImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    };

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
                data: {
                    imageUrl: canvasDataUrl as JSONValue,
                    language: language as JSONValue
                },
            };

            console.log('Sending transcript:', finalTranscript);
            append(message, canvasDataUrl ? options : undefined);
        }
    };

    useEffect(() => {
        if (finalTranscript) {
            if (pauseTimer) {
                clearTimeout(pauseTimer);
            }
            setPauseTimer(setTimeout(() => {
                sendTranscript();
                resetTranscript();
            }, 2000));
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
        loadImage('/soal/identitas-trigonometri.png').then((image) => {
            setQuestionSheetImageSource(image);
            toast.info("Question sheet succesfully loaded!")
        }).catch((error) => {
            toast.error("Failed to load sheet, please refresh and try again..")
        });;

        handleEmbeddingModelLoad();
    }, []);

    const handleEmbeddingModelLoad = async () => {
        setIsEmbeddingModelActive(false); // Initially set to false
        const callApiUntilOk = async () => {
            try {
                const response = await fetch('/api/test');

                if (response.ok) {
                    setIsEmbeddingModelActive(true);
                    return;
                }
            } catch (error) {
                console.error('API call failed', error);
            }

            setTimeout(callApiUntilOk, 1000);
        };

        callApiUntilOk();
    };

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

    const isTabActive = useTabActive();

    useEffect(() => {
        if (isTabActive && !isMuted) {
          SpeechRecognition.startListening({
            continuous: true,
            interimResults: true,
            language: language
          })
        } else {
          if (listening) {
            SpeechRecognition.stopListening()
          }
        }
      }, [isTabActive, isMuted, language, listening])

    const toggleMicrophone = useCallback(() => {
        if (isMuted) {
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then((mediaStream) => {
              setStream(mediaStream)
              setIsMuted(false)
              SpeechRecognition.startListening({
                continuous: true,
                interimResults: true,
                language: language
              })
              toast.success("Microphone unmuted")
            })
            .catch((error) => {
              console.error('Error accessing microphone:', error)
              toast.error("Failed to access microphone. Please check your permissions.")
            })
        } else {
          if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
          }
          SpeechRecognition.stopListening()
          setIsMuted(true)
          toast.success("Microphone muted")
        }
      }, [isMuted, stream, language])

      useEffect(() => {
        return () => {
          if (stream) {
            stream.getTracks().forEach(track => track.stop())
          }
        }
      }, [stream])
    
    return (
        <>
            <AlertDialog open={!browserSupportsSpeechRecognition}>
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

            <AlertDialog open={!isMicrophoneAvailable}>
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

            <AlertDialog open={!isEmbeddingModelActive}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogDescription className="flex flex-col items-center space-y-4">
                        <Icons.spinner className="h-14 w-14 animate-spin" />
                            <p>Please wait while we load embedding model...</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>

            <Canvas backgroundColor={'#FFFFFF'} canvasRef={canvasRef} questionsSheetImageSource={questionSheetImageSource} />
            <div className="fixed flex bottom-8 left-24 items-center space-x-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button
                            onClick={toggleMicrophone}
                            aria-label={isMuted ? 'Mute microphone' : 'Unmute microphone'}
                            variant="outline"
                            className="tool__mute p-2"
                        >
                            {isMuted ? <MicOff className="h-5 w-5 text-black" /> : <Mic className="h-5 w-5 text-black" />}
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>{isMuted ? 'Unmute microphone' : 'Mute microphone'}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TTS ref={ttsRef} width={50} height={40} onPlayingStatusChange={handleTTSPlayingStatusChange} onReadingTextChange={handleTTSOnReadingTextChange} />
                <Badge>{status}</Badge>
                <div className="text-helper">
                    <span className="status mx-1">{activeStream === 'user' ? transcript : currentlyPlayingTTSText}</span>
                </div>
                <div className="fixed right-8 bottom-10 flex gap-2">
                    <ChatDrawers messages={messages} />
                    <DialogFinalAnswer canvasRef={canvasRef} />
                </div>
            </div>
        </>
    );
}
