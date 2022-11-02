import cors from 'cors';
import express from 'express';
import log from 'loglevel';
import responseTime from 'response-time';
import capturesRouter from './routers/capturesRouter';
import countriesRouter from './routers/countriesRouter';
import growerAccountsRouter from './routers/growerAccountsRouter';
import organizationsRouter from './routers/organizationsRouter';
import plantersRouter from './routers/plantersRouter';
import rawCapturesRouter from './routers/rawCapturesRouter';
import speciesRouter from './routers/speciesRouter';
import tokensRouter from './routers/tokensRouter';
import transactionsRouter from './routers/transactionsRouter';
import treesRouter from './routers/treesRouter';
import treesRouterV2 from './routers/treesRouterV2';
import { errorHandler, handlerWrapper } from './routers/utils';
import walletsRouter from './routers/walletsRouter';
import HttpError from './utils/HttpError';

const version = process.env.npm_package_version;

const app = express();

// Sentry.init({ dsn: config.sentry_dsn });

app.use(
  responseTime((req, res, time) => {
    log.warn('API took:', req.originalUrl, time);
  }),
);

// app allow cors
app.use(cors());

/*
 * Check request
 */
app.use(
  handlerWrapper((req, _res, next) => {
    if (
      req.method === 'POST' ||
      req.method === 'PATCH' ||
      req.method === 'PUT'
    ) {
      if (req.headers['content-type'] !== 'application/json') {
        throw new HttpError(
          415,
          'Invalid content type. API only supports application/json',
        );
      }
    }
    next();
  }),
);

app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.json()); // parse application/json

// routers
app.use('/countries', countriesRouter);
app.use('/trees', treesRouter);
app.use('/planters', plantersRouter);
app.use('/organizations', organizationsRouter);
app.use('/species', speciesRouter);
app.use('/wallets', walletsRouter);
app.use('/transactions', transactionsRouter);
app.use('/tokens', tokensRouter);
app.use('/v2/captures', capturesRouter);
app.use('/raw-captures', rawCapturesRouter);
app.use('/grower-accounts', growerAccountsRouter);
app.use('/v2/trees', treesRouterV2);
// Global error handler
app.use(errorHandler);

app.get('*', (req, res) => {
  res.status(404).send(version);
});

export default app;
