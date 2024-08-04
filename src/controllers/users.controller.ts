import { NextFunction, Request, Response } from 'express';
import { CreateCallDto, CreateMessageDto } from '@dtos/calls.dto';
import { Call, Message, Address } from '@interfaces/calls.interface';
import { Server as SocketIOServer } from 'socket.io';
import UsersService from '@/services/users.service';

class UsersController {
  private io: SocketIOServer;

  public setSocketIOServer(io: SocketIOServer) {
    this.io = io;
  }

  public usersService = new UsersService();

  public getAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addresses: Address[] = await this.usersService.getAllAddresses();
      res.status(200).json({ data: addresses });
    } catch (error) {
      next(error);
    }
  };

  public createCall = async (callData: CreateCallDto, callback: (call: Call) => void) => {
    try {
      const createCallData: Call = await this.usersService.createCall(callData);
      this.io.emit('callCreated', createCallData);
      callback(createCallData);
    } catch (error) {
      console.error('Error creating call:', error);
    }
  };

  public forwardMessage = async (messageData: CreateMessageDto, callback: (message: Message) => void) => {
    try {
      const forwardMessageData: Message = await this.usersService.forwardMessage(messageData);
      this.io.emit('messageSent', { callId: messageData.sender, message: forwardMessageData });
      callback(forwardMessageData);
    } catch (error) {
      console.error('Error forwarding message:', error);
    }
  };
}

export default UsersController;
