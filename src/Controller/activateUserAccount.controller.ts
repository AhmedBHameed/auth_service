import {Request, Response} from 'express';
import {readFileSync} from 'fs';
import hbs from 'handlebars';

const activateUserAccountController = (_: Request, res: Response): void => {
  const template = readFileSync('views/activate-user-account.hbs', {
    encoding: 'utf-8',
  });
  const html = hbs.compile(template);
  res.send(
    html({
      logoSrc: 'http://localhost:5500/blog/rocket_devs_logo.png',
      baseUrl: 'https://www.google.com',
      verificationId: 'ABC123',
      email: 'ahmedbazy@gmail.com',
    })
  );
};

export default activateUserAccountController;
