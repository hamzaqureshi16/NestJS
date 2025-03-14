import * as process from 'node:process';

export const JwtConstants = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
};
