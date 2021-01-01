import {NextFunction, Request, RequestHandler, Response} from 'express';

import environment from '../config/environment';

const isProd = environment.isProd;

export const allowOriginAccess = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): undefined | void => {
    res.setHeader('Access-Control-Allow-Origin', isProd ? 'IP' : '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      res.send();
      return;
    }
    next();
  };
};
