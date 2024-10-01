import { findRelevantContent } from '@/lib/embeddings';

export const dynamic = 'force-static'

export async function GET() {
    const documents = await findRelevantContent("Trigonometry");
    return Response.json({ documents })
}