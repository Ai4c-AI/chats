import Decimal from 'decimal.js';
import { Content, Message, Role } from './chat';

export interface ChatMessage {
  id: string;
  parentId: string | null;
  childrenIds: string[];
  content: Content;
  role: Role;
  tokenUsed?: number;
  calculatedPrice?: Decimal;
}

export interface MessageNode {
  id: string;
  parentId: string;
  messages: any[];
  childrenIds?: string[];
  tokenUsed: number;
  calculatedPrice: Decimal;
}
