import { createHash } from 'crypto';

export function maskToken(token: string) {
  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}

export const hashToken = (token: string) => {
  return createHash('sha256').update(token).digest('hex');
};
