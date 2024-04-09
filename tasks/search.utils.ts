import { QdrantClient } from "@qdrant/js-client-rest";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const VECTOR_SIZE = 1536;

class QdrantConnect {
  client: QdrantClient;
  embeddings: OpenAIEmbeddings;

  constructor() {
    this.client = new QdrantClient({ url: process.env.QDRANT_URL });
    this.embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 });
  }

  async createCleanCollection(collectionName) {
    const collectionExists = await this.client.collectionExists(collectionName);

    if (collectionExists.exists) {
      // await this.client.deleteCollection(collectionName);
      return;
    }

    await this.client.createCollection(collectionName, {
      vectors: { size: VECTOR_SIZE, distance: "Cosine", on_disk: true },
    });
  }

  async saveDocumentsOnce(collectionName, documents) {
    const collectionInfo = await this.client.getCollection(collectionName);

    if (collectionInfo.points_count) {
      return;
    }

    const vectors: {
      id: string;
      payload: Record<string, string>;
      vector: number[];
    }[] = [];
    for (const document of documents) {
      const [embedding] = await this.embeddings.embedDocuments([
        document.pageContent,
      ]);
      vectors.push({
        id: document.metadata.uuid,
        payload: document.metadata,
        vector: embedding,
      });
    }

    await this.client.upsert(collectionName, {
      wait: true,
      batch: {
        ids: vectors.map(({ id }) => id),
        vectors: vectors.map(({ vector }) => vector),
        payloads: vectors.map(({ payload }) => payload),
      },
    });
  }

  async search(collectionName, query) {
    const queryEmbedding = await this.embeddings.embedQuery(query);

    const result = await this.client.search(collectionName, {
      vector: queryEmbedding,
      limit: 1,
    });

    return result[0] || null;
  }
}

export { QdrantConnect };
