import { NextFunction, Request, Response } from 'express';
import { CreateCallDto, CreateMessageDto } from '@dtos/calls.dto';
import { Call, Message, Address } from '@interfaces/calls.interface';
import CallService from '@services/calls.service';
import { Server as SocketIOServer } from 'socket.io';

class CallsController {
  private io: SocketIOServer;

  public setSocketIOServer(io: SocketIOServer) {
    this.io = io;
  }

  public callService = new CallService();

  public getAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: string = req.query.q as string;
      const addresses: Address[] = await this.callService.getAllAddresses(query);
      console.log('🚀 ~ CallsController ~ getAddresses=s ~ addresses:', addresses);
      res.status(200).json({ data: addresses });
    } catch (error) {
      next(error);
    }
  };

  public createCall = async (callData: CreateCallDto, callback: (call: Call) => void) => {
    try {
      const createCallData: Call = await this.callService.createCall(callData);
      this.io.emit('callCreated', createCallData);
      callback(createCallData);
    } catch (error) {
      console.error('Error creating call:', error);
    }
  };

  public deleteCall = async (callId: string, callback: (success: boolean) => void) => {
    try {
      const deleteCallData: Call = await this.callService.deleteCall(callId);
      this.io.emit('callDeleted', deleteCallData);
      callback(true);
    } catch (error) {
      console.error('Error deleting call:', error);
      callback(false);
    }
  };

  public forwardMessage = async (messageData: CreateMessageDto, callback: (message: Message) => void) => {
    try {
      const forwardMessageData: Message = await this.callService.forwardMessage(messageData);
      this.io.emit('messageSent', { callId: messageData.callId, message: forwardMessageData });
      callback(forwardMessageData);
    } catch (error) {
      console.error('Error forwarding message:', error);
    }
  };
}

export default CallsController;
