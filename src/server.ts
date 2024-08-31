import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import CallsRoute from './routes/calls.route';

// validateEnv();

// const app = new App([new IndexRoute(), new CallsRoute(), new UsersRoute(), new AuthRoute()]);

// app.listen();

import analysisService from './services/analysisService';

async function main() {
  console.log('Starting Psifas data analysis...');

  try {
    const results = await analysisService.analyze();
    console.log('Analysis completed. Results:', results);
  } catch (error) {
    console.error('An error occurred during analysis:', (error as Error).message);
  }
}

main();
