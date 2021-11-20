import {Seeder} from 'mongo-seeding';
import path from 'path';

import environment from './config/environment';

const {DB_NAME, DB_PASS, DB_PORT, DB_SERVER, DB_USER_NAME} = environment;

const seeder = new Seeder({
  database: {
    host: DB_SERVER,
    name: DB_NAME,
    password: DB_PASS,
    port: +DB_PORT,
    username: DB_USER_NAME,
  },
});

const collections = seeder.readCollectionsFromPath(path.resolve('./seeds'), {
  extensions: ['json'],
  transformers: [
    Seeder.Transformers.setCreatedAtTimestamp,
    Seeder.Transformers.setUpdatedAtTimestamp,
  ],
});

seeder
  .import(collections)
  .then(() => {
    console.log('✅ Seeds has been planted successfully.');
  })
  .catch((err) => {
    console.log('🔥 Error:', err);
  });
