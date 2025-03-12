import * as net from 'node:net'
import Email from './emails';
import { simpleParser } from 'mailparser'

// Configuração do servidor SMTP
export default () => net.createServer((socket) => {
  socket.write('220 localhost SMTP server ready\r\n');

  let emailData = '';
  let isDataCommand = false;

  socket.on('data', async (data) => {
    const message = data.toString();
    if (isDataCommand) {
      emailData += message;
      if (emailData.endsWith('\r\n.\r\n')) {

        const parse = await simpleParser(emailData);
        const subject = parse.subject || 'No subject';
        const timestamp = Math.round(Date.now() / 1000)
        const rcpt: string = Array.isArray(parse.to)
          ? parse.to.map(to => to.text.replace(/\"/g, '')).join(', ')
          : parse.to?.text.replace(/\"/g, '') || 'No recipient';

          Email({
            rcpt,
            subject,
            timestamp,
            content: emailData
          }).save();
        socket.write('250 Message saved locally\r\n');

        isDataCommand = false;
        emailData = '';
      }
    } else {
      if (message.startsWith('EHLO') || message.startsWith('HELO')) {
        socket.write('250 Hello\r\n');
      } else if (message.startsWith('MAIL FROM:')) {
        socket.write('250 OK\r\n');
      } else if (message.startsWith('RCPT TO:')) {
        socket.write('250 OK\r\n');
      } else if (message.startsWith('DATA')) {
        socket.write('354 End data with <CR><LF>.<CR><LF>\r\n');
        isDataCommand = true;
      } else if (message.startsWith('NOOP')) {
        socket.write('250 OK\r\n');
      } else if (message.startsWith('RSET')) {
        emailData = '';
        isDataCommand = false;
        socket.write('250 OK\r\n');
      } else if (message.startsWith('QUIT')) {
        socket.write('221 Bye\r\n');
        socket.end();
      } else if (message.startsWith('VRFY')) {
        socket.write('252 Cannot VRFY user, but will accept message and attempt delivery\r\n');
      } else {
        socket.write('500 Command not recognized\r\n');
      }
    }
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});