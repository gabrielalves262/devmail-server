#!/usr/bin/env node

import SmtpServer from './smtp-server';
import Server from './server';
import yargs from 'yargs';
import open from 'open';
import { yellow, green, bold, red } from 'picocolors'

const localhostIps = ['0.0.0.0', 'localhost', '127.0.0.1']

const argv = yargs(process.argv.slice(2))
  .option('smtpHost', { type: 'string', description: 'SMTP server host', default: '0.0.0.0' })
  .option('smtpPort', { type: 'number', description: 'SMTP server port', default: 587 })
  .option('host', { alias: 'H', type: 'string', description: 'Server host', default: '0.0.0.0' })
  .option('port', { alias: 'p', type: 'number', description: 'Server port', default: 3000 })
  .help()
  .parseSync();

const smtpServer = SmtpServer();
const server = Server();

smtpServer.listen(argv.smtpPort, argv.smtpHost, () =>
  console.log(`\n${yellow(`SMTP Server is running`)}\n  * HOST: ${bold(green(localhostIps.includes(argv.smtpHost) ? 'localhost' : argv.smtpHost))}\n  * PORT: ${bold(green(argv.smtpPort))}`));

server.listen(argv.port, argv.host, () => {
  console.log(`\n${yellow(`Server is running on http://${localhostIps.includes(argv.host) ? 'localhost' : argv.host}:${argv.port}`)}\n`);
  open(`http://${localhostIps.includes(argv.host) ? 'localhost' : argv.host}:${argv.port}`);
})