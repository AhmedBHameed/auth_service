import {DoneCallback, Job} from 'bull';
import transporter from 'src/services/emailTransporter.service';

const mailingProcess = async (job: Job, done: DoneCallback) => {
  try {
    const info = await transporter.sendMail(job.data);
    done(null, info);
  } catch (error: any) {
    done(error, null);
  }
};

export default mailingProcess;
