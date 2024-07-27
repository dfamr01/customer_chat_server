export interface CreateCallDto {
  customer: string;
}

export interface CreateMessageDto {
  callId: string;
  message: string;
  sender: string;
}
