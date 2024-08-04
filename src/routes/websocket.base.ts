import { Server as SocketIOServer } from 'socket.io';

abstract class WebSocketBase {
  protected io: SocketIOServer;

  abstract initializeWebSocketEvents(io: SocketIOServer): void;
}

export default WebSocketBase;
