import { Call, Message } from '@interfaces/calls.interface';
import { CreateMessageDto } from '@dtos/calls.dto';
import { db } from '@/database';

class CallService {
  public async getAllCalls(): Promise<Record<string, Call>> {
    return Object.fromEntries(db.getDB());
  }

  public async deleteCall(callId: string): Promise<Call> {
    if (db.has(callId)) {
      const call = db.get(callId);
      db.delete(callId);
      return call;
    }
    return null;
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

export default CallService;
