import {createTransport} from 'nodemailer';
import {
  MAIL_HOST,
  MAIL_PASS,
  MAIL_PORT,
  MAIL_USER,
} from 'src/config/environment';

const transporter = createTransport({
  host: MAIL_HOST,
  port: Number(MAIL_PORT) || 0,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

export default transporter;
