/**
 * Please @see https://kentcdodds.com/blog/stop-mocking-fetch
 * Those modules required only in devDependencies.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import {rest} from 'msw';
// eslint-disable-next-line import/no-extraneous-dependencies
import {setupServer} from 'msw/node';

const server = setupServer(
  rest.get('*', (req, res, ctx) => {
    // eslint-disable-next-line no-console
    console.error(`Please add request handler for ${req.url.toString()}`);
    return res(
      ctx.status(500),
      ctx.json({error: 'Please add request handler'})
    );
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

export {rest,server};
