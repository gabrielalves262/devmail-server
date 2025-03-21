import yargs from 'yargs';

export const argv = yargs(process.argv.slice(2))
  .option('smtpHost', { type: 'string', description: 'SMTP server host', default: '0.0.0.0' })
  .option('smtpPort', { type: 'number', description: 'SMTP server port', default: 587 })
  .option('host', { alias: 'H', type: 'string', description: 'Server host', default: '0.0.0.0' })
  .option('port', { alias: 'p', type: 'number', description: 'Server port', default: 3000 })
  .help()
  .parseSync();