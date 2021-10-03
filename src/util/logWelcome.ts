import environment from 'src/config/environment';

import showIp from './showIp';

const {APP_VERSION, IS_PRODUCTION, SERVER_PORT} = environment;

const IP = showIp()[0];

const {log} = console;

const logWelcome = (): void => {
  log('\n\n🛡️ ############################################🛡️');
  log('\n\n ℹ️  Server is listening to:\n');

  if (!IS_PRODUCTION) log(`\t 🚀 ${IP}`);

  log(
    `\t 🔨 Build ver: ${APP_VERSION}`,
    `\n\t 📳 ${IS_PRODUCTION ? 'Production' : 'Development'} mode`
  );

  log('\n ℹ️  Server end-points:\n');
  log(`\t ⚙️  http://localhost:${SERVER_PORT}/changelog`);
  if (!IS_PRODUCTION) {
    log(`\t ⚙️  http://localhost:${SERVER_PORT}/graphql`);
  }

  log('\n\n🛡️ ############################################🛡️');
};

export default logWelcome;
