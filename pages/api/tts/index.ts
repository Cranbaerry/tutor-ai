import type { NextApiRequest, NextApiResponse } from 'next';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text, voiceName } = req.body;
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.WEBM_24KHZ_16BIT_MONO_OPUS);
    const readable = tts.toStream(text);

    readable.on('data', (chunk) => {
      console.log(chunk);
      res.write(chunk);
    });

    readable.on('end', () => {
      res.end();
    });

    readable.on('error', (error) => {
      res.status(500).json({ error: error.message });
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
