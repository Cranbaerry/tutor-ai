import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

// Switch to HuggingFace Inference Endpoint if it has latency issues, for now this will do
// Reference: https://discuss.huggingface.co/t/question-about-hugging-face-inference-api/84571/2

// Using MatryoshkaRetriever
// Reference: https://js.langchain.com/v0.2/docs/how_to/reduce_retrieval_latency

import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
const embeddings = new HuggingFaceInferenceEmbeddings({
  model: "BAAI/bge-m3",
  apiKey: process.env.HUGGINGFACEHUB_API_KEY ?? "",
});

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
);

export const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: "documents_bge",
  queryName: "match_documents_bgev2",
});

export const findRelevantContent = async (userQuery: string) => {
  const similarGuides = await vectorStore.similaritySearch(userQuery, 5);
  return similarGuides;
};
