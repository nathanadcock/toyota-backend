const cron = require('node-cron');

exports.emailService = async () =>  {
  const job = cron.schedule('*/5 * * * * *', () => {
    console.log('execute task every 15 minutes between 5 a.m. and 7 a.m.');
  });
  job.start();
}