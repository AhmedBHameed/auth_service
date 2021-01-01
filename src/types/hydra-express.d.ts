declare module 'hydra-express' {
  import {Express, Handler} from 'express';
  import * as core from 'express-serve-static-core';

  export interface HydraData {
    [key: string]: string | number | undefined | null;
  }

  export interface HydraConfig {
    hydra: {
      serviceName: string;
      serviceIP: string;
      servicePort: number;
      serviceType: string;
      serviceDescription: string;
      redis: {
        url: string;
      };
    };
  }

  export interface Hydra {
    getServiceName: () => string;
    toConstantValue: () => string;
    getInstanceID: () => string;
    createUMFMessage: (data: {to: string; from: string; body: any}) => HydraData;
    sendMessage: (sendData: HydraData) => void;
    once: (event: 'message', listener: (message: HydraData) => void) => void;
    on: (event: 'message', listener: (message: any) => void | Promise<void>) => void;
    config: {
      servicePort: string;
      serviceIP: string;
    };
  }

  export function init(config: HydraConfig, version: () => void): void;
  export interface HydraExpress {
    init: (config: string, registerRoutesCallback: () => void) => Promise<void>;
    Router: () => core.Router;
    static: (root: string) => Handler;
  }
  export function registerRoutes(handler: {[path: string]: core.Router | core.Router[]}): void;
  export function getExpress(): HydraExpress & Express;

  export function getHydra(): Hydra;
}
