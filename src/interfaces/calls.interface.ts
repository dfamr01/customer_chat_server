export interface Call {
  id: string;
  customer: string;
  timestamp: Date;
  messages: Message[];
}

export interface Message {
  sender: string;
  message: string;
  timestamp: Date;
}

export type Address = string;
