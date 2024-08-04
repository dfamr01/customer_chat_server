import App from '@/app';

import validateEnv from '@utils/validateEnv';
import CallsRoute from './routes/calls.route';
import UsersRoute from './routes/users.route';

validateEnv();

const app = new App([new CallsRoute(), new UsersRoute()]);

app.listen();
