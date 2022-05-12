import {addMinutes,format} from 'date-fns';

const getUTCTime = (date: Date) => format(
    addMinutes(date, date.getTimezoneOffset()),
    "yyyy-MM-dd'T'HH:mm:ss'Z'"
  );

export {getUTCTime};
