import App from '@/app';

import validateEnv from '@utils/validateEnv';
import CallsRoute from './routes/calls.route';

validateEnv();

const app = new App([new CallsRoute()]);

app.listen();
