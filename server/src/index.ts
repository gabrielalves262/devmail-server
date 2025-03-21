#!/usr/bin/env node

import SmtpServer from './smtp-server';
import Server from './server';
import open from 'open';
import { yellow, green, bold, red } from 'picocolors'
import { argv } from './argv';

const localhostIps = ['0.0.0.0', 'localhost', '127.0.0.1']

const smtpServer = SmtpServer();
const server = Server();

smtpServer.listen(argv.smtpPort, argv.smtpHost, () =>
  console.log(`\n${yellow(`SMTP Server is running`)}\n  * HOST: ${bold(green(localhostIps.includes(argv.smtpHost) ? 'localhost' : argv.smtpHost))}\n  * PORT: ${bold(green(argv.smtpPort))}`));

server.listen(argv.port, argv.host, () => {
  console.log(`\n${yellow(`Server is running on http://${localhostIps.includes(argv.host) ? 'localhost' : argv.host}:${argv.port}`)}\n`);
  open(`http://${localhostIps.includes(argv.host) ? 'localhost' : argv.host}:${argv.port}`);
})