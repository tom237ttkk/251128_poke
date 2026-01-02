// TypeScript型定義

export interface User {
  id: string;
  pokePokeId: string;
  name: string;
  role: string;
  isBlacklisted: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Pack {
  id: string;
  name: string;
  code?: string;
  releaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Card {
  id: string;
  packId: string;
  name: string;
  description?: string;
  rarity?: string;
  createdAt: Date;
  updatedAt: Date;
  pack?: Pack;
}

export interface CardCollection {
  id: string;
  userId: string;
  cardId: string;
  cardName: string;
  cardType: "wanted" | "offered";
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  card?: Card;
}

export interface TradeOffer {
  id: string;
  userId: string; // senderId
  status: "active" | "closed"; // normalized status
  createdAt: Date;
  updatedAt: Date;
  senderId?: string;
  receiverId?: string;
  cards?: TradeOfferCard[];
  user?: User;
}

export interface TradeOfferCard {
  id: string;
  tradeOfferId: string;
  cardId?: string;
  cardName: string;
  cardType: "wanted" | "offered";
  quantity: number;
  createdAt: Date;
  card?: Card;
}

export interface Message {
  id: string;
  tradeOfferId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  sender?: User;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
