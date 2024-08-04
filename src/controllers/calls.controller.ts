import { NextFunction, Request, Response } from 'express';
import { CreateMessageDto } from '@dtos/calls.dto';
import { Call, Message } from '@interfaces/calls.interface';
import CallService from '@services/calls.service';
import { Server as SocketIOServer } from 'socket.io';

class CallsController {
  private io: SocketIOServer;

  public setSocketIOServer(io: SocketIOServer) {
    this.io = io;
  }

  public callService = new CallService();

  public getAllCalls = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const calls: Record<string, Call> = await this.callService.getAllCalls();
      res.status(200).json({ data: calls });
    } catch (error) {
      next(error);
    }
  };

  public deleteCall = async (callId: string, callback: (deleteCallData: Call | null) => void) => {
    try {
      const deleteCallData: Call = await this.callService.deleteCall(callId);
      this.io.emit('callDeleted', deleteCallData);
      callback(deleteCallData);
    } catch (error) {
      console.error('Error deleting call:', error);
      callback(null);
    }
  };

  public forwardMessage = async (messageData: CreateMessageDto, callback: (message: Message) => void) => {
    try {
      const forwardMessageData: Message = await this.callService.forwardMessage(messageData);
      this.io.emit('messageSent', { callId: messageData.sender, message: forwardMessageData });
      callback(forwardMessageData);
    } catch (error) {
      console.error('Error forwarding message:', error);
    }
  };
}

export default CallsController;
