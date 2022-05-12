import {Request, Response} from 'express';
import {readFileSync} from 'fs';
import hbs from 'handlebars';
import {LOGO_SRC, SERVER_BASE_PATH} from 'src/config/environment';

const activateUserAccountController = (_: Request, res: Response): void => {
  const template = readFileSync('views/activate-user-account.hbs', {
    encoding: 'utf-8',
  });
  const html = hbs.compile(template);
  res.send(
    html({
      logoSrc: LOGO_SRC,
      baseUrl: SERVER_BASE_PATH,
      verificationId: 'ABC123',
      email: 'ahmedbazy@gmail.com',
    })
  );
};

export default activateUserAccountController;
