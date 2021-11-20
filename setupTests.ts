const mockLoggerErrorFn = jest.fn();
jest.mock('winston', () => {
  const mConfig = {
    npm: {
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6,
      },
    },
  };
  const mFormat = {
    combine: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    errors: jest.fn(),
    splat: jest.fn(),
    json: jest.fn(),
    prettyPrint: jest.fn(),
  };
  const mTransports = {
    Console: jest.fn(),
    File: jest.fn(),
  };
  const mLogger = {
    error: mockLoggerErrorFn,
    info: jest.fn(),
  };
  return {
    config: mConfig,
    format: mFormat,
    transports: mTransports,
    createLogger: jest.fn(() => mLogger),
  };
});

// eslint-disable-next-line import/prefer-default-export
export {mockLoggerErrorFn};
