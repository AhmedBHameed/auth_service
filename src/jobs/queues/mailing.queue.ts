import Queue from 'bull';
import {logger} from 'src/services';

import {REDIS_HOST, REDIS_PASS, REDIS_PORT} from '../../config/environment';
import mailingProcess from '../processes/mailing.process';

// Number of workers.
export const concurrency = 2;
const mailingQueue = new Queue('mailing', {
  redis: {
    port: Number(REDIS_PORT) || 0,
    host: REDIS_HOST,
    password: REDIS_PASS,
  },
});

/**
 * JOB EVENT LISTENER TYPE
 * It is recommended to monitor stalled jobs to prevent any job loss.
 * @see https://github.com/OptimalBits/bull#important-notes
 */
mailingQueue.on('stalled', (job) => {
  logger.info('', job);
});

mailingQueue.on('completed', (job) => {
  job.remove();
});

/**
 * JOB CONSUMER TYPE
 */
mailingQueue.process(concurrency, mailingProcess);

export {mailingQueue};
