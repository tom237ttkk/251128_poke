// TypeScript型定義

export interface User {
  id: string;
  pokePokeId: string;
  name: string;
  role: string;
  isBlacklisted: boolean;
  createdAt: Date;
}

export interface CardCollection {
  id: string;
  userId: string;
  cardName: string;
  cardType: "wanted" | "offered";
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeOffer {
  id: string;
  userId: string;
  status: "active" | "closed";
  createdAt: Date;
  updatedAt: Date;
  cards?: TradeOfferCard[];
  user?: User;
}

export interface TradeOfferCard {
  id: string;
  tradeOfferId: string;
  cardName: string;
  cardType: "wanted" | "offered";
  quantity: number;
  createdAt: Date;
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
