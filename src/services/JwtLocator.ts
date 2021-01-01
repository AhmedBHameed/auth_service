import {compareSync, genSaltSync, hashSync} from 'bcryptjs';
import {readFileSync} from 'fs';
import {injectable} from 'inversify';
import {sign, verify} from 'jsonwebtoken';
import {ulid} from 'ulid';

import environment from '../config/environment';

const {secret} = environment;

export interface JWTPayload {
  id: string;
  role: string;
}

export interface ParseTokenData {
  iat: number;
  exp: number;
  iss: string;
  jti: string;
  data: JWTPayload;
}

type SSHKey = string;

/**
 * To Generate private and public keys @see https://rietta.com/blog/openssl-generating-rsa-key-from-command/
 */
@injectable()
class JwtLocator {
  private _secretKey: SSHKey = readFileSync('keys/private.pem', 'utf8');
  private _publicKey: SSHKey = readFileSync('keys/public.pem', 'utf8');

  public getSaltAndHashedPassword(plainPassword: string): {passwordSalt: string; password: string} {
    const passwordSalt = genSaltSync(12);
    const password = hashSync(plainPassword, passwordSalt);
    return {passwordSalt, password};
  }

  /**
   * @param myPlaintextPassword // Password need to be checked
   * @param hashedPassword // Stored hash when account created.
   */
  public verifiedPassword(myPlaintextPassword: string, hashedPassword: string): boolean {
    return compareSync(myPlaintextPassword, hashedPassword);
  }

  public verifyToken(token: string): ParseTokenData {
    return verify(token, this._publicKey, {algorithms: ['RS256']}) as ParseTokenData;
  }

  public createToken(
    payload: JWTPayload
  ): {accessToken: string; refreshToken: string; accessTokenExpire: number; refreshTokenExpire: number} {
    return {
      accessToken: sign(
        {data: payload},
        {key: this._secretKey, passphrase: secret},
        {
          algorithm: 'RS256',
          jwtid: ulid(),
          expiresIn: '20m',
          issuer: 'Iraqi express delivery', // (issuer) OPTIONAL You should but domain name here and not the backend system name
        }
      ),
      refreshToken: sign(
        {data: payload},
        {key: this._secretKey, passphrase: secret},
        {
          algorithm: 'RS256',
          jwtid: ulid(),
          expiresIn: '7d',
          issuer: 'Iraqi express delivery', // (issuer) OPTIONAL You should but domain name here and not the backend system name
        }
      ),
      accessTokenExpire: 1200000,
      refreshTokenExpire: 604800000,
    };
  }
}

export default JwtLocator;
