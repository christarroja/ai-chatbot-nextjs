import React from 'react'
import { ragChat } from '../lib/rag-chat';
import { redis } from '../lib/redis';

interface PageProps {
  params: Promise<{ url: string | string[] | undefined }>;
};

function reconstructUrl({ url }: { url: string[] }) {
  const decodedComponents = url.map((component) => decodeURIComponent(component));

  return decodedComponents.join("/");
};

const Page = async ({ params }: PageProps) => {
  const { url } = await params;
  const recostructedUrl = reconstructUrl({ url: url as string[] });

  const isAlreadyIndexed = await redis.sismember("indexedUrls", recostructedUrl);

  if (!isAlreadyIndexed) {
    await ragChat.context.add({
      type: "html",
      source: recostructedUrl,
      config: { 
        chunkOverlap: 50,
        chunkSize: 200,
      },
    });

    await redis.sadd("indexedUrls", recostructedUrl);
  }

  console.log("isAlreadyIndexed? ", isAlreadyIndexed);

  return (
    <div>Hello!</div>
  );
}

export default Page