import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import CallsController from '@/controllers/calls.controller';
import { Server as SocketIOServer } from 'socket.io';

class CallsRoute implements Routes {
  public path = '/calls';
  public router = Router();
  public callsController = new CallsController();
  public io: SocketIOServer;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/addresses`, this.callsController.getAddresses);
    this.router.get(`${this.path}`, this.callsController.getAllCalls);
  }

  public initializeSocketEvents(io: SocketIOServer) {
    this.io = io;
    this.callsController.setSocketIOServer(this.io);

    this.io.on('connection', socket => {
      console.log('A user connected');

      socket.on('createCall', this.callsController.createCall);
      socket.on('deleteCall', this.callsController.deleteCall);
      socket.on('forwardMessage', this.callsController.forwardMessage);

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  }
}

export default CallsRoute;
