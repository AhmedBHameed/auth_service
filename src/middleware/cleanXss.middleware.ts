import {NextFunction, Request, RequestHandler, Response} from 'express'; // as types for typescript only
import sanitizeHtml from 'sanitize-html';

function xssClean(data: any = '') {
  let isObject = false;
  if (typeof data === 'object') {
    data = JSON.stringify(data);
    isObject = true;
  }
  const sanitizedData = sanitizeHtml(data, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    allowedAttributes: {
      a: ['href'],
    },
    allowedIframeHostnames: ['www.youtube.com'],
  });
  if (isObject) data = JSON.parse(sanitizedData);
  return data;
}

const xss =
  (): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (req.body) req.body = xssClean(req.body);
    if (req.query) req.query = xssClean(req.query);
    if (req.params) req.params = xssClean(req.params);
    next();
  };

export default xss;
