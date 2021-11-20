import {compareSync, genSaltSync, hashSync} from 'bcryptjs';
import {readFileSync} from 'fs';
import {
  JsonWebTokenError,
  sign,
  SignOptions,
  TokenExpiredError,
  verify,
} from 'jsonwebtoken';
import {} from 'src/graphql/models';
import {ulid} from 'ulid';

import environment from '../config/environment';

/**
 * To Generate private and public keys @see https://rietta.com/blog/openssl-generating-rsa-key-from-command/
 */

export interface JWTPayload {
  id: string;
  verificationId: string;
  // UserAction[]
  isActive: boolean;
  isSuper: boolean;
}

export interface ParseTokenData {
  iat: number;
  exp: number;
  iss: string;
  jti: string;
  data: JWTPayload & {isRefreshToken: boolean};
}

type SSLKey = string;

const {PASS_PHRASE} = environment;

const PRIVATE_KEY: SSLKey = readFileSync('keys/private.pem', 'utf8');
const PUBLIC_KEY: SSLKey = readFileSync('keys/public.pem', 'utf8');

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
const verifiedPassword = (
  myPlaintextPassword: string,
  hashedPassword: string
): boolean => compareSync(myPlaintextPassword, hashedPassword);

const verifyToken = (token: string): ParseTokenData =>
  verify(token, PUBLIC_KEY, {
    algorithms: ['RS256'],
  }) as ParseTokenData;

const createToken = (
  payload: JWTPayload
): {
  accessToken: string;
  refreshToken: string;
  accessTokenExpire: number;
  refreshTokenExpire: number;
} => {
  const issuer = 'ahmedhameed.dev'; // (issuer) OPTIONAL You should but domain name here and not the backend system name
  const secretKeys = {key: PRIVATE_KEY, passphrase: PASS_PHRASE};
  const tokenOptions: SignOptions = {
    algorithm: 'RS256',
    jwtid: ulid(),
    expiresIn: '20m',
    issuer,
  };

  return {
    accessToken: sign(
      {
        data: {
          ...payload,
          isRefreshToken: false,
        },
      },
      secretKeys,
      {
        ...tokenOptions,
      }
    ),
    refreshToken: sign(
      {
        data: {
          ...payload,
          isRefreshToken: true,
        },
      },
      secretKeys,
      {
        ...tokenOptions,
        expiresIn: '7d',
        jwtid: ulid(),
      }
    ),
    // accessTokenExpire 15 minutes
    accessTokenExpire: 15 * 60 * 1000,
    // refreshTokenExpire 7 days
    refreshTokenExpire: 24 * 60 * 60 * 1000 * 7,
  };
};

export {
  createToken,
  getSaltAndHashedPassword,
  JsonWebTokenError,
  TokenExpiredError,
  verifiedPassword,
  verifyToken,
};
