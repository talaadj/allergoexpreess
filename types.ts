export enum Sender {
  USER = 'user',
  BOT = 'bot',
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    }[];
  };
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  isError?: boolean;
  grounding?: GroundingChunk[];
}

export enum AppMode {
  CHAT = 'chat',
  LIVE = 'live',
}

export enum ModelType {
  FLASH_GROUNDED = 'gemini-2.5-flash',
  PRO_EXPERT = 'gemini-3-pro-preview',
  LITE_FAST = 'gemini-2.5-flash-lite',
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export type Language = 'ru' | 'kk' | 'en';