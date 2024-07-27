export interface CreateCallDto {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
}

export interface CreateMessageDto {
  callId: string;
  message: string;
  sender: string;
}
