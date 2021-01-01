import {statSync} from 'fs';

export const isDockerized: () => boolean = () => {
  try {
    statSync('/.dockerenv');
    return true;
  } catch {
    return false;
  }
};
