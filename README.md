## Server-Side Implementation

The server-side of this project is built on Node.js with Express, using TypeScript and MongoDB (via Mongoose) for data persistence. It's based on the [TypeScript-Express-Mongoose Starter](https://github.com/ahmadjoya/typescript-express-mongoose-starter) boilerplate.

### Key Features

1. Provides address information for the auto-complete input on the login page
2. Manages chat creation and deletion
3. Facilitates real-time message forwarding between customers and customer service
4. Implements Socket.IO for real-time bi-directional communication

### Technology Stack

- Node.js
- Express.js
- TypeScript
- Socket.IO

### Project Structure
src/
├── config/
├── controllers/
├── interfaces/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
├── app.ts
└── server.ts

### Key Components

1. **Address Service**: Provides data for the auto-complete dropdown on the login page
2. **Chat Management**: Handles creation and deletion of chat sessions
3. **Message Forwarding**: Implements real-time message routing between customers and customer service
4. **Socket.IO Integration**: Manages WebSocket connections for real-time updates

### Setup and Running

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Start the development server: `npm run dev`
5. For production or local testing: `npm start`

### API Endpoints

- `GET /api/addresses`: Fetch address data for auto-complete
- `POST /api/chats`: Create a new chat session
- `DELETE /api/chats/:id`: Close a chat session
- `POST /api/messages`: Send a message (routed via Socket.IO)

### Socket.IO Events

- `connection`: Handles new WebSocket connections
- `disconnect`: Manages disconnection of clients
- `chat message`: Routes messages between customers and customer service


### Database Schema

In memory

### Error Handling

The server implements centralized error handling as provided by the starter boilerplate, with additional custom error types for chat-specific scenarios.

### Logging

Winston is used for logging, as set up in the starter boilerplate. Additional logging has been implemented for chat-related events and Socket.IO communications.

### Testing

Jest is used for unit and integration testing. Run tests with: