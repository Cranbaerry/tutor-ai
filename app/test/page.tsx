'use client';
import React, { useState } from 'react';
import { useAudioPlayer } from 'react-use-audio-player';

const AudioPlayer = () => {
  const [audioStream, setAudioStream] = useState(null);

  const playAudio = async () => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'Your text to convert to speech' }),
      });

      const { load } = useAudioPlayer();

      const reader = response.body.getReader();
      const audioStream = new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              push();
            }).catch(error => {
              console.error('Error reading stream:', error);
              controller.error(error);
            });
          }

          push();
        }
      });

      setAudioStream(audioStream);

    } catch (error) {
      console.error('Error fetching audio:', error);
    }
  };

  return (
    <div>
      <button onClick={playAudio}>Play Audio</button>
      {audioStream && (
        <audio controls>
          <source src={URL.createObjectURL(new Blob([audioStream]))} type="audio/webm" />
        </audio>
      )}
    </div>
  );
};

export default AudioPlayer;
