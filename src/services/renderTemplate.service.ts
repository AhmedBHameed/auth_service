import {readFileSync} from 'fs';
import hbs from 'handlebars';

const renderTemplate = (view: string, payload: any) => {
  const template = readFileSync(view, {
    encoding: 'utf-8',
  });
  const html = hbs.compile(template);
  return html(payload);
};

export default renderTemplate;
