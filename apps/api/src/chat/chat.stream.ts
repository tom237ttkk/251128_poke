type MessagePayload = {
  id: string;
  tradeOfferId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  sender?: {
    id: string;
    name: string;
    pokePokeId: string;
  } | null;
};

type StreamClient = {
  send: (payload: string) => void;
  close: () => void;
};

const tradeStreams = new Map<string, Set<StreamClient>>();

const getOrCreateStreamSet = (tradeId: string) => {
  const existing = tradeStreams.get(tradeId);
  if (existing) return existing;
  const created = new Set<StreamClient>();
  tradeStreams.set(tradeId, created);
  return created;
};

export const subscribeToTrade = (tradeId: string, client: StreamClient) => {
  const streamSet = getOrCreateStreamSet(tradeId);
  streamSet.add(client);

  return () => {
    streamSet.delete(client);
    if (streamSet.size === 0) {
      tradeStreams.delete(tradeId);
    }
  };
};

export const publishMessage = (tradeId: string, message: MessagePayload) => {
  const streamSet = tradeStreams.get(tradeId);
  if (!streamSet || streamSet.size === 0) return;

  const payload = `id: ${message.id}\nevent: message\ndata: ${JSON.stringify(
    message
  )}\n\n`;

  for (const client of streamSet) {
    client.send(payload);
  }
};
