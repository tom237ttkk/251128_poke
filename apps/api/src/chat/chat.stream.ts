import { createClient } from "redis";

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

type TradeMessageEnvelope = {
  origin: string;
  tradeId: string;
  message: MessagePayload;
};

const tradeStreams = new Map<string, Set<StreamClient>>();
const chatChannel = process.env.REDIS_CHANNEL || "trade:messages";
const redisUrl = process.env.REDIS_URL;
const instanceId = crypto.randomUUID();

let publisherClient: ReturnType<typeof createClient> | null = null;
let subscriberClient: ReturnType<typeof createClient> | null = null;
let backplaneInitPromise: Promise<void> | null = null;

const buildSsePayload = (message: MessagePayload) =>
  `id: ${message.id}\nevent: message\ndata: ${JSON.stringify(message)}\n\n`;

const getOrCreateStreamSet = (tradeId: string) => {
  const existing = tradeStreams.get(tradeId);
  if (existing) return existing;
  const created = new Set<StreamClient>();
  tradeStreams.set(tradeId, created);
  return created;
};

const dispatchToLocalSubscribers = (tradeId: string, message: MessagePayload) => {
  const streamSet = tradeStreams.get(tradeId);
  if (!streamSet || streamSet.size === 0) return;

  const payload = buildSsePayload(message);
  for (const client of streamSet) {
    client.send(payload);
  }
};

const handleBackplaneMessage = (rawEnvelope: string) => {
  try {
    const envelope = JSON.parse(rawEnvelope) as TradeMessageEnvelope;
    if (envelope.origin === instanceId) return;
    dispatchToLocalSubscribers(envelope.tradeId, envelope.message);
  } catch (error) {
    console.error("[chat.stream] Failed to parse Redis message", error);
  }
};

const publishToBackplane = async (tradeId: string, message: MessagePayload) => {
  if (!redisUrl) return;

  await initializeTradeMessageBackplane();
  if (!publisherClient) return;

  const envelope: TradeMessageEnvelope = {
    origin: instanceId,
    tradeId,
    message,
  };

  try {
    await publisherClient.publish(chatChannel, JSON.stringify(envelope));
  } catch (error) {
    console.error("[chat.stream] Failed to publish Redis message", error);
  }
};

export const initializeTradeMessageBackplane = () => {
  if (!redisUrl) return Promise.resolve();
  if (backplaneInitPromise) return backplaneInitPromise;

  backplaneInitPromise = (async () => {
    const publisher = createClient({ url: redisUrl });
    const subscriber = publisher.duplicate();

    publisher.on("error", (error) => {
      console.error("[chat.stream] Redis publisher error", error);
    });
    subscriber.on("error", (error) => {
      console.error("[chat.stream] Redis subscriber error", error);
    });

    await Promise.all([publisher.connect(), subscriber.connect()]);
    await subscriber.subscribe(chatChannel, handleBackplaneMessage);

    publisherClient = publisher;
    subscriberClient = subscriber;
  })().catch((error) => {
    backplaneInitPromise = null;
    publisherClient = null;
    subscriberClient = null;
    console.error("[chat.stream] Failed to initialize Redis backplane", error);
  });

  return backplaneInitPromise;
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
  dispatchToLocalSubscribers(tradeId, message);
  void publishToBackplane(tradeId, message);
};
