import { Call, Message, Address } from '@interfaces/calls.interface';
import { CreateCallDto, CreateMessageDto } from '@dtos/calls.dto';
import { randomUUID } from 'crypto';
// import  v4  from 'uuid';

class CallService {
  private calls = new Map<string, Call>();
  // private calls: Call[] = [];

  // giving the time i would have move this out to another service
  public async getAllAddresses(): Promise<Address[]> {
    const addresses = ['123 Main St, City, Country', '456 Elm St, Town, Country', '789 Oak St, Village, Country'];

    return addresses;
    // return addresses.filter(address => address.toLowerCase().includes(query.toLowerCase())).map(address => ({ address }));
  }

  public async getAllCalls(): Promise<Record<string, Call>> {
    return Object.fromEntries(this.calls);
    // return Array.from(this.calls.values());
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

    this.calls.set(callData.email, newCall);
    return newCall;
  }

  public async deleteCall(callId: string): Promise<Call> {
    if (this.calls.has(callId)) {
      const call = this.calls.get(callId);
      this.calls.delete(callId);
      return call;
    }
    return null;
  }

  public async forwardMessage(messageData: CreateMessageDto): Promise<Message> {
    if (!this.calls.has(messageData.sender)) {
      throw new Error('Sender not found');
    }
    const newMessage: Message = {
      sender: messageData.sender,
      message: messageData.message,
      timestamp: new Date(),
    };
    this.calls.get(messageData.sender).messages.push(newMessage);
    return newMessage;
  }
}

export default CallService;
