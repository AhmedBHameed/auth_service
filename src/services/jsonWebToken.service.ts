import {compareSync, genSaltSync, hashSync} from 'bcryptjs';
import {readFileSync} from 'fs';
import {
  JsonWebTokenError,
  sign,
  SignOptions,
  TokenExpiredError,
  verify,
} from 'jsonwebtoken';
import {assignIn} from 'lodash';
import {resolve} from 'path';
import {ulid} from 'ulid';

import {PASS_PHRASE} from '../config/environment';
import {Maybe} from '../graphql/models';

/**
 * To Generate private and public keys @see https://rietta.com/blog/openssl-generating-rsa-key-from-command/
 */

export interface JWTPayload {
  id: string;
  verificationId: string;
  // UserAction[]
  isActive: boolean;
  isSuper: boolean;
  isRefreshToken: boolean;
}

export interface ParseTokenData<T> {
  iat: number;
  exp: number;
  iss: string;
  jti: string;
  data: T; // JWTPayload & {isRefreshToken: boolean};
}

type SSLKey = string;
type JWT = string;

const PRIVATE_KEY: SSLKey = readFileSync(resolve(`./keys/private.pem`), 'utf8');
const PUBLIC_KEY: SSLKey = readFileSync(resolve(`./keys/public.pem`), 'utf8');

const encodeJwT = <T extends object>(payload: T, options?: SignOptions) => {
  const opt = assignIn(
    {
      algorithm: 'RS256',
      jwtid: ulid(),
      expiresIn: '20m',
      issuer: 'rocketdev.dev', // (issuer) OPTIONAL You should but domain name here and not the backend system name
    },
    options
  );

  return sign(
    {
      data: payload,
    },
    {key: PRIVATE_KEY, passphrase: PASS_PHRASE},
    opt
  );
};

const decodeJwT = <T extends object>(hash: JWT): ParseTokenData<T> =>
  verify(hash, PUBLIC_KEY, {
    algorithms: ['RS256'],
  }) as ParseTokenData<T>;

const getSaltAndHashedPassword = (
  plainPassword: string
): {
  passwordSalt: string;
  password: string;
} => {
  const passwordSalt = genSaltSync(12);
  const password = hashSync(plainPassword, passwordSalt);
  return {passwordSalt, password};
};

/**
 * @param myPlaintextPassword // Password need to be checked
 * @param hashedPassword // Stored hash when account created.
 */
const verifyPassword = (
  myPlaintextPassword: string,
  hashedPassword: string
): boolean => compareSync(myPlaintextPassword, hashedPassword);

const createToken = (
  payload: Omit<JWTPayload, 'isRefreshToken'>,
  rememberMe: Maybe<boolean>
): {
  accessToken: string;
  refreshToken: string;
  accessTokenExpire: number;
  refreshTokenExpire: number;
} => ({
  accessToken: encodeJwT({
    ...payload,
    isRefreshToken: false,
  }),
  refreshToken: encodeJwT(
    {
      ...payload,
      isRefreshToken: true,
    },
    {
      expiresIn: '7d',
    }
  ),
  // accessTokenExpire 15 minutes
  accessTokenExpire: rememberMe ? 15 * 60 * 1000 : -1,
  // refreshTokenExpire 7 days
  refreshTokenExpire: rememberMe ? 24 * 60 * 60 * 1000 * 7 : -1,
});

export {
  createToken,
  decodeJwT,
  encodeJwT,
  getSaltAndHashedPassword,
  JsonWebTokenError,
  TokenExpiredError,
  verifyPassword,
};
