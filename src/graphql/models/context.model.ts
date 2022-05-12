import {Request, Response} from 'express';
import {Counter, Histogram} from 'prom-client';

import {AuthenticationDataSource, UserDataSource} from '../resolvers';

export type Context = {
  req: Request;
  res: Response;
  dataSources: {
    user: UserDataSource;
    auth: AuthenticationDataSource;
  };
  histogram: Histogram<string>;
  counter: Counter<string>;
};
