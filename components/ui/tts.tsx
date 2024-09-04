'use client';
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
interface TTSProps {
    width?: number;
    height?: number;
    onPlayingStatusChange: (status: boolean) => void;
}

interface TTSQueueItem {
    text: string;
    audioBuffer: ArrayBuffer | null;
}

const TTS = forwardRef((props: TTSProps, ref) => {
    const { width = 400, height = 200 } = props;
    const [loading, setLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState<TTSQueueItem[]>([]);
    const isProcessingQueue = useRef(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);

    const drawBar = (ctx: CanvasRenderingContext2D, x: number, barHeight: number, radii: number) => {
        ctx.beginPath();
        ctx.moveTo(x - radii, height / 2 + barHeight / 2);
        ctx.lineTo(x - radii, height / 2 - barHeight / 2);
        ctx.quadraticCurveTo(x - radii, height / 2 - barHeight / 2 - radii, x, height / 2 - barHeight / 2 - radii);
        ctx.quadraticCurveTo(x + radii, height / 2 - barHeight / 2 - radii, x + radii, height / 2 - barHeight / 2);
        ctx.lineTo(x + radii, height / 2 + barHeight / 2);
        ctx.quadraticCurveTo(x + radii, height / 2 + barHeight / 2 + radii, x, height / 2 + barHeight / 2 + radii);
        ctx.quadraticCurveTo(x - radii, height / 2 + barHeight / 2 + radii, x - radii, height / 2 + barHeight / 2);
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fill();
        ctx.closePath();
    };

    const initialDraw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = canvas.width / 4.5;
        const spacing = (canvas.width - barWidth * 4) / 3;
        const radii = barWidth / 2;

        for (let i = 0; i < 4; i++) {
            const x = spacing * i + barWidth * i + radii;
            drawBar(ctx, x, 4, radii);
        }
    };

    const fetchAudio = async (text: string): Promise<ArrayBuffer | null> => {
        console.log('Fetching audio: ' + text);
        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text, voiceName: "en-US-MichelleNeural" }),
        });

        if (response.ok) {
            return await response.arrayBuffer();
        } else {
            console.error("Failed to generate TTS");
            return null;
        }
    };

    const processQueue = async () => {
        if (isProcessingQueue.current) return; 
        if (queue.length > 0 && !isPlaying) {
            isProcessingQueue.current = true;
            const nextItem = queue[0];
            setQueue(queue.slice(1)); 
            if (nextItem.audioBuffer) {
                console.log('Playing: ' + nextItem.text);
                await playAudio(nextItem.audioBuffer);
            }
            isProcessingQueue.current = false;
        }
    };

    const playAudio = async (audioBuffer: ArrayBuffer): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            try {
                setIsPlaying(false);

                const mediaSource = new MediaSource();
                let sourceBuffer: SourceBuffer;

                mediaSource.addEventListener('sourceopen', () => {
                    try {
                        sourceBuffer = mediaSource.addSourceBuffer('audio/webm; codecs="opus"');
                        sourceBuffer.appendBuffer(audioBuffer);
                        sourceBuffer.addEventListener('updateend', () => {
                            mediaSource.endOfStream();
                        });
                    } catch (err) {
                        console.error("Error during source buffer setup:", err);
                        reject(err);
                    }
                });

                const audio = new Audio();
                audio.src = URL.createObjectURL(mediaSource);

                audio.oncanplay = () => {
                    try {
                        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                        const analyserNode = audioContext.createAnalyser();

                        analyserNode.fftSize = 2048;
                        analyserNode.minDecibels = -160;
                        analyserNode.maxDecibels = -20;

                        const source = audioContext.createMediaElementSource(audio);
                        source.connect(analyserNode);
                        analyserNode.connect(audioContext.destination);

                        analyserRef.current = analyserNode;

                        audio.play();
                        setIsPlaying(true);
                    } catch (err) {
                        console.error("Error during audio playback setup:", err);
                        reject(err);
                    }
                };

                audio.onended = () => {
                    setIsPlaying(false);
                    resolve();
                };

                audio.onerror = (err) => {
                    console.error("Audio playback error:", err);
                    reject(err);
                };
            } catch (err) {
                console.error("Error during playAudio setup:", err);
                reject(err);
            }
        });
    };

    useImperativeHandle(ref, () => ({
        generateTTS: async (text: string) => {
            setLoading(true);
            const audioBuffer = await fetchAudio(text);
            setQueue(prevQueue => [...prevQueue, { text, audioBuffer }]);
            setLoading(false);
        },
        getTTSLoadingStatus: () => {
            return loading;
        },
        getTTSPlayingStatus: () => {
            return isPlaying;
        },
        getTTSQueueCount: () => {
            return queue.length;
        },
        clearTTSQueue: () => {
            console.log('Clear queue');
            setQueue([]);
        },
        startExternalAudioVisualization: (stream: MediaStream) => {
            if (analyserRef.current) {
                analyserRef.current.disconnect();
            }
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyserNode = audioContext.createAnalyser();

            analyserNode.fftSize = 2048;
            analyserNode.minDecibels = -160;
            analyserNode.maxDecibels = -20;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyserNode);
            analyserRef.current = analyserNode;

            requestAnimationFrame(drawWaveform);
        }
    }));

    useEffect(() => {
        props.onPlayingStatusChange(isPlaying);
    }, [isPlaying]);

    useEffect(() => {
        processQueue();
    }, [isPlaying, queue]);

    const drawWaveform = () => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;
        if (!canvas || !analyser) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = canvas.width / 4.5;
        const spacing = (canvas.width - barWidth * 4) / 3;
        const radii = barWidth / 2;

        for (let i = 0; i < 4; i++) {
            const index = Math.floor(Math.pow(i / 4, 2) * (bufferLength - 1));
            const value = dataArray[index] / 255;
            const barHeight = 4 + (value * (canvas.height * 0.7 - 4));
            const x = spacing * i + barWidth * i + radii;
            drawBar(ctx, x, barHeight, radii);
        }

        requestAnimationFrame(drawWaveform);
    };

    useEffect(() => {
        initialDraw();

        if (analyserRef.current) {
            requestAnimationFrame(drawWaveform);
        }
    }, [isPlaying, width, height]);

    return (
        <div>
            <canvas ref={canvasRef} width={width} height={height} />
        </div>
    );
});

TTS.displayName = 'TTS';
export { TTS };
