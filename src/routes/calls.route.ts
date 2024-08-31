import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import CallsController from '@/controllers/calls.controller';
import { Server as SocketIOServer } from 'socket.io';
import WebSocketBase from './websocket.base';

class CallsRoute extends WebSocketBase implements Routes {
  public path = '/calls';
  public router = Router();
  public callsController = new CallsController();

  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.callsController.getAllCalls);
  }

  public initializeWebSocketEvents(io: SocketIOServer) {
    this.io = io;

    this.callsController.setSocketIOServer(this.io);

    this.io.on('connection', socket => {
      console.log('A user connected');

      socket.on('deleteCall', this.callsController.deleteCall);

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  }
}

export default CallsRoute;
