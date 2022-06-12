import {Request, Response} from 'express';
import {Counter, Histogram} from 'prom-client';

import {AuthDataSource, UserDataSource} from '../resolvers';

export type Context = {
  req: Request;
  res: Response;
  dataSources: {
    user: UserDataSource;
    auth: AuthDataSource;
  };
  histogram: Histogram<string>;
  counter: Counter<string>;
};
