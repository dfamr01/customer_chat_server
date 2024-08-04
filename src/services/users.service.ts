import { Call, Message, Address } from '@interfaces/calls.interface';
import { CreateCallDto, CreateMessageDto } from '@dtos/calls.dto';
import { randomUUID } from 'crypto';
import { db } from '@/database';

class UsersService {
  public async getAllAddresses(): Promise<Address[]> {
    const addresses = ['123 Main St, City, Country', '456 Elm St, Town, Country', '789 Oak St, Village, Country'];

    return addresses;
  }

  public async createCall(callData: CreateCallDto): Promise<Call> {
    const newCall: Call = {
      id: randomUUID(),
      firstName: callData.firstName,
      lastName: callData.lastName,
      email: callData.email,
      address: callData.address,
      timestamp: new Date(),
      messages: [],
    };

    db.set(callData.email, newCall);
    return newCall;
  }

  public async forwardMessage(messageData: CreateMessageDto): Promise<Message> {
    if (!db.has(messageData.sender)) {
      throw new Error('Sender not found');
    }
    const newMessage: Message = {
      sender: messageData.sender,
      message: messageData.message,
      timestamp: new Date(),
    };
    db.get(messageData.sender).messages.push(newMessage);
    return newMessage;
  }
}

export default UsersService;
