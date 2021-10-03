import {Request, Response} from 'express';
import {Counter, Histogram} from 'prom-client';

import {
  AuthenticationDataSource,
  AuthorizationDataSource,
  UserDataSource,
} from '../resolvers';

export type Context = {
  req: Request;
  res: Response;
  dataSources: {
    user: UserDataSource;
    authentication: AuthenticationDataSource;
    authorization: AuthorizationDataSource;
  };
  histogram: Histogram<string>;
  counter: Counter<string>;
};
