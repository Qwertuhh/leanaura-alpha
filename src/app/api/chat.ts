export async function streamChatResponse(
  prompt: string,
  onChunk: (chunk: string) => void
) {
  const response = await fetch(
    `http://localhost:8000/api/ai/chat/stream`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    }
  );

  if (!response.ok || !response.body) {
    throw new Error("Failed to connect to stream");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
}
