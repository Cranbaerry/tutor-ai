"use client";

import React, { useState } from 'react';

function TTSComponent() {
    const [loading, setLoading] = useState(false);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const getTTS = async () => {
        setLoading(true);
        setIsPlaying(false); 

        const mediaSource = new MediaSource();
        let sourceBuffer: SourceBuffer;

        mediaSource.addEventListener('sourceopen', () => {
            sourceBuffer = mediaSource.addSourceBuffer('audio/webm; codecs="opus"');
        });

        const audio = new Audio();
        setAudioElement(audio);
        audio.src = URL.createObjectURL(mediaSource);
        audio.oncanplay = () => {
            audio.play();
            setIsPlaying(true); 
        };

        audio.onended = () => {
            setIsPlaying(false);
        };

        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Voice list
            // https://gist.github.com/BettyJJ/17cbaa1de96235a7f5773b8690a20462
            body: JSON.stringify({ text: "Hello, do you want my milkies? I can give you my breast milk", voiceName: "en-US-MichelleNeural" }),
        });

        if (response.ok) {
            const reader = response.body?.getReader();
            if (!reader) {
                console.error("Failed to get reader from response body.");
                setLoading(false);
                return;
            }

            const pump = async () => {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        if (sourceBuffer.updating) {
                            await new Promise(resolve => {
                                sourceBuffer.addEventListener('updateend', resolve, { once: true });
                            });
                        }
                        mediaSource.endOfStream();
                        break;
                    }

                    if (sourceBuffer.updating) {
                        await new Promise(resolve => {
                            sourceBuffer.addEventListener('updateend', resolve, { once: true });
                        });
                    }
                    sourceBuffer.appendBuffer(value);
                }
            };

            await pump();
        } else {
            console.error("Failed to generate TTS");
        }

        setLoading(false);
    };

    return (
        <div>
            <button onClick={getTTS} disabled={loading}>
                {loading ? "Generating..." : "Generate TTS"}
            </button>
            {isPlaying && <div>Playing Audio...</div>}
        </div>
    );
}

export default TTSComponent;
