import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { connect, set, disconnect } from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, WEB_SOCKET_PORT } from '@config';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import CallsController from './controllers/calls.controller';
import { Server as SocketIOServer } from 'socket.io';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public portWebSocket: number;
  public io: SocketIOServer;
  public callsController: CallsController;
  public server: http.Server;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.server = http.createServer(this.app);
    this.app.get('/customers-chat-server2/health', (req, res) => {
      res.status(200).send('OK');
    });
    // this.io = new SocketIOServer(this.server, {
    //   path: '/customers-chat-server2/socket.io',
    //   //todo: fix cors later
    //   cors: {
    //     origin: '*',
    //   },
    // });

    this.io = new SocketIOServer(this.server, {
      path: '/customers-chat-server2/socket.io',
      cors: {
        origin: ['https://customers-chat-website.vercel.app', 'http://localhost:5174'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    // this.io = new SocketIOServer(this.portWebSocket);

    this.io.on('connection', socket => {
      console.log('App this.io.on ~ connection: success');
      socket.on('disconnect', reason => {
        console.log('App ~ this.io.on disconnect ~ reason:', reason);
      });
    });

    this.io.on('disconnect', reason => {
      console.log('App ~ this.io.on disconnect ~ reason:', reason);
    });

    this.io.on('error', error => {
      console.log('App ~ this.io.on error ~ error:', error);
    });

    // this.connectToDatabase();

    this.initializeMiddlewares();
    this.initializeRoutes(routes);

    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    try {
      this.server.listen(this.port, () => {
        logger.info(`=================================`);
        logger.info(`======= ENV: ${this.env} =======`);
        logger.info(`🚀 App listening on the port ${this.port}`);
        logger.info(`=================================`);
      });
    } catch (error) {
      console.error('Error starting server:', error);
    }
  }
  public async closeDatabaseConnection(): Promise<void> {
    try {
      await disconnect();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }

  public getServer() {
    return this.app;
  }

  // private async connectToDatabase() {
  //   if (this.env !== 'production') {
  //     set('debug', true);
  //   }

  //   // await connect(dbConnection.url);
  // }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors()); //todo: fix cors later

    // this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
      if (route?.initializeSocketEvents) {
        route?.initializeSocketEvents(this.io);
      }
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
