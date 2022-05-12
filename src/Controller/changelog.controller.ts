import {Request, Response} from 'express';
import {readFileSync} from 'fs';
import {marked} from 'marked';

const changelogController = (_: Request, res: Response): void => {
  const changelogFile = readFileSync('CHANGELOG.md', {encoding: 'utf-8'});
  res.send(marked(changelogFile));
};

export default changelogController;
