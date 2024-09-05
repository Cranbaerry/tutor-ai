import { NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

export async function POST(req: Request) {
    const { text } = await req.json();
    const tts = new MsEdgeTTS();
    const voiceName = process.env.NEXT_PUBLIC_AZURE_SPEECH_SERVICE_VOICE_NAME ?? 'en-US-MichelleNeural';
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.WEBM_24KHZ_16BIT_MONO_OPUS);

    const readable = tts.toStream(text);
    const stream = new ReadableStream({
        async start(controller) {
            readable.on('data', (chunk) => {
                controller.enqueue(chunk);
            });

            readable.on('end', () => {
                controller.close();
            });

            readable.on('error', (error) => {
                controller.error(error);
            });
        },
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'audio/webm',
        },
    });
}