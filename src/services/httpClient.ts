import axios, {AxiosError, AxiosResponse, CancelTokenSource} from 'axios';

export type CancelTokenSourceType = CancelTokenSource;
export type AxiosHttpResponse<T = object> = AxiosResponse<T>;
export type AxiosHttpError<T = any> = AxiosError<T>;

const httpClient = axios.create({
  withCredentials: true,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export {axios, httpClient};
