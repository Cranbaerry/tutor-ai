import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

export async function POST(req: Request) {
    const { text, language } = await req.json();
    const tts = new MsEdgeTTS();

    // VOICE LIST: https://gist.github.com/BettyJJ/17cbaa1de96235a7f5773b8690a20462
    const voiceName = language === 'en-US' ? 'en-US-JennyNeural' : 'id-ID-ArdiNeural';
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

    return new Response(stream, {
        headers: {
            'Content-Type': 'audio/webm',
        },
    });
}