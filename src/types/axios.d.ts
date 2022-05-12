// eslint-disable-next-line no-unused-vars
import axios from 'axios';

declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}
