export interface User {
  id: string;
  pokePokeId: string;
  name: string;
  role: string;
  isBlacklisted: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  cardType: "wanted" | "offered";
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  card?: Card;
}

export interface TradeOffer {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  details?: TradeOfferCard[];
}

export interface TradeOfferCard {
  id: string;
  tradeOfferId: string;
  cardId: string;
  type: string;
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
}
