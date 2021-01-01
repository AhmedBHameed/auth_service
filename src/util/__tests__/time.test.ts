import {getPassedTimeFrom} from '../time';

describe('time utility functions', () => {
  it('getPassedTimeFrom returns passed minutes depends on timestamp', () => {
    const TIME_DIFFERENCE_IN_MINUTES = 32;
    const timestamp = new Date(
      new Date().setMinutes(new Date().getMinutes() - TIME_DIFFERENCE_IN_MINUTES)
    ).toISOString();

    expect(getPassedTimeFrom(timestamp)).toBe(TIME_DIFFERENCE_IN_MINUTES);
  });
});
