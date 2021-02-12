const fs = require('fs');

try {
  fs.writeFileSync(
    './.production.env',
    `
REDIS_HOST=${process.env.REDIS_HOST || 'redis'}
MONGODB_SERVER=${process.env.MONGODB_SERVER || 'mango'}
MONGODB_DB=${process.env.MONGODB_DB || 'admin'}
LOG_LEVEL=error

MONGODB_PASS=${process.env.MONGODB_PASS || ''}
MONGODB_USER=${process.env.MONGODB_USER || ''}
NODE_ENV=${process.env.NODE_ENV || ''}
VERSION=${process.env.VERSION || 'NaN'}
  `
  );
} catch (error) {
  console.error(error);
}
