export type Message = {
  messageId: string;
  from: string;
  content: string;
  order: number;
};

export type MessageWithID = Message & { id: string };
