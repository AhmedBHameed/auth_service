// eslint-disable-next-line node/no-unpublished-import
import cases from 'jest-in-case';

import {PASSWORD_REGULAR_EXPRESSION} from '../helper/passwordRegularExpression';

function casify(object: {[key: string]: string}) {
  return Object.entries(object).map(([name, password]) => ({
    name: `${password} - ${name}`,
    password,
  }));
}

cases(
  'Password regular expression: Invalid password 💥',
  options => {
    const passwordPatterns = new RegExp(PASSWORD_REGULAR_EXPRESSION);
    const result = passwordPatterns.test(options.password);
    expect(result).toBe(false);
  },
  casify({
    'short password (less than 8 characters)!': 'Abc@123',
    'no uppercase character!': 'test@12345',
    'no non-alpha-numeric symbol!': 'Abcdef123',
    'no number!': 'testMyPassword@Jest',
    'found a space!': 'Test@ 12345',
  })
);

cases(
  'Password regular expression: Valid password ✅',
  options => {
    const passwordPatterns = new RegExp(PASSWORD_REGULAR_EXPRESSION);
    const result = passwordPatterns.test(options.password);
    expect(result).toBe(true);
  },
  casify({
    'valid password': 'Test@jest123',
  })
);
