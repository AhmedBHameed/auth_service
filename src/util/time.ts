import {Moment} from 'moment';

// eslint-disable-next-line
const moment = require('moment');

function utcTime(): Moment {
  return (moment(new Date()) as Moment).utc();
}

function getPassedTimeFrom(timestamp: string): number {
  return moment().diff(timestamp, 'minutes');
}

export {utcTime, getPassedTimeFrom};
