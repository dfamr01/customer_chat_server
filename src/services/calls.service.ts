import { Call, Message, Address } from '@interfaces/calls.interface';
import { CreateCallDto, CreateMessageDto } from '@dtos/calls.dto';

class CallService {
  private calls: Call[] = [];

  public async getAllAddresses(query: string): Promise<Address[]> {
    const addresses = ['123 Main St, City, Country', '456 Elm St, Town, Country', '789 Oak St, Village, Country'];

    return addresses;
    // return addresses.filter(address => address.toLowerCase().includes(query.toLowerCase())).map(address => ({ address }));
  }

  public async createCall(callData: CreateCallDto): Promise<Call> {
    const newCall: Call = {
      id: Date.now().toString(),
      customer: callData.customer,
      timestamp: new Date(),
      messages: [],
    };

    this.calls.push(newCall);
    return newCall;
  }

  public async deleteCall(callId: string): Promise<Call> {
    const index = this.calls.findIndex(call => call.id === callId);
    if (index === -1) throw new Error('Call not found');

    const [deletedCall] = this.calls.splice(index, 1);
    return deletedCall;
  }

  public async forwardMessage(messageData: CreateMessageDto): Promise<Message> {
    const call = this.calls.find(call => call.id === messageData.callId);
    if (!call) throw new Error('Call not found');

    const newMessage: Message = {
      sender: messageData.sender,
      message: messageData.message,
      timestamp: new Date(),
    };

    call.messages.push(newMessage);
    return newMessage;
  }
}

export default CallService;
