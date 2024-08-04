import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { Server as SocketIOServer } from 'socket.io';
import WebSocketBase from './websocket.base';
import UsersController from '@/controllers/users.controller';

class UsersRoute extends WebSocketBase implements Routes {
  public path = '/users';
  public router = Router();
  public callsController = new UsersController();

  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/addresses`, this.callsController.getAddresses);
  }

  public initializeWebSocketEvents(io: SocketIOServer) {
    this.io = io;

    this.callsController.setSocketIOServer(this.io);

    this.io.on('connection', socket => {
      console.log('A user connected');

      socket.on('createCall', this.callsController.createCall);
      socket.on('forwardMessage', this.callsController.forwardMessage);

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  }
}

export default UsersRoute;
