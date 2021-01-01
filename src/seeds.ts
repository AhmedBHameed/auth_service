import {Seeder} from 'mongo-seeding';
import path from 'path';

import environment from './config/environment';

const {dbName, password, port, server, user} = environment.database;

const seeder = new Seeder({
  database: {
    host: server,
    name: dbName,
    password,
    port,
    username: user,
  },
});

const collections = seeder.readCollectionsFromPath(path.resolve('./seeds'), {
  extensions: ['json'],
  transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
});

seeder
  .import(collections)
  .then(() => {
    console.log('✅ Seeds has been planted successfully.');
  })
  .catch(err => {
    console.log('🔥 Error:', err);
  });
