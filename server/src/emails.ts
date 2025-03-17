import fs from 'node:fs';
import path from 'node:path';
import mailparser from 'mailparser'

export interface IEmail {
  id: string;
  rcpt: string;
  subject: string;
  timestamp: number;
  readed: boolean;
}

export class Email implements IEmail {
  id: string;
  rcpt: string;
  subject: string;
  timestamp: number;
  content?: string;
  readed: boolean;

  private static readonly dir = path.resolve(__dirname, './../emails');
  private static readonly ext = '.eml';
  private static readonly dataFile = path.join(Email.dir, '__data.json');

  constructor(opt: Omit<IEmail, 'id' | 'timestamp' | 'readed'> & { id?: string, timestamp?: number, content?: string, readed?: boolean }) {
    this.id = opt.id || crypto.randomUUID();
    this.rcpt = opt.rcpt;
    this.subject = opt.subject;
    this.timestamp = opt.timestamp || Math.round(Date.now() / 1000);
    this.content = opt.content;
    this.readed = opt.readed || false;
  }

  /** List all emails */
  static list = (): Email[] => {
    if (!fs.existsSync(Email.dir))
      return [];

    if (!fs.existsSync(Email.dataFile))
      return [];

    const dataJson = fs.readFileSync(Email.dataFile, 'utf-8');
    const data = JSON.parse(dataJson) as IEmail[];
    return data
      .map(opt => new Email(opt))
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /** find an email by Id */
  static findById = (id: string): Email | null => {
    const emails = Email.list();
    const email = emails.find(email => email.id === id);
    if(!email) return null
    const emailFile = path.join(Email.dir, `${email.id}${Email.ext}`);
    if (!fs.existsSync(emailFile))
      return null;

    email.content = fs.readFileSync(emailFile, 'utf-8');
    return new Email(email);
  }

  /** Remove all */
  static removeAll = (): void => {
    if (!fs.existsSync(Email.dir))
      throw new Error('Email directory not found');

    fs.rmSync(Email.dir, { recursive: true });
  }

  /** Remove email */
  remove = (): void => {
    if (!fs.existsSync(Email.dir))
      throw new Error('Email directory not found');

    const emailFile = path.join(Email.dir, `${this.id}${Email.ext}`);
    if (fs.existsSync(emailFile))
      fs.unlinkSync(emailFile);

    const emails = Email.list().filter(email => email.id !== this.id);
    fs.writeFileSync(Email.dataFile, JSON.stringify(emails, null, 2));
  }

  /** Save email */
  save = (): void => {
    if (!this.content)
      throw new Error('Email content is required');

    if (!fs.existsSync(Email.dir))
      fs.mkdirSync(Email.dir, { mode: 0o755 });

    const emails = Email.list();
    const index = emails.findIndex(email => email.id === this.id);
    
    if (index >= 0)
      emails[index] = { ...this, content: undefined };
    else
      emails.push({ ...this, content: undefined });

    fs.writeFileSync(Email.dataFile, JSON.stringify(emails, null, 2));

    const emailFile = path.join(Email.dir, `${this.id}${Email.ext}`);
    fs.writeFileSync(emailFile, this.content || '');
  }

  parse = (): Promise<mailparser.ParsedMail> => {
    if (!this.content)
      throw new Error('Email content is required');

    return new Promise<mailparser.ParsedMail>((resolve, reject) => {
      mailparser.simpleParser(this.content || '', (err, mail) => {
        if (err) return reject(err);
        resolve(mail);
      })
    })
  }
}

export default (opt: Omit<IEmail, 'id' | 'timestamp' | 'readed'> & { id?: string, timestamp?: number, content?: string, readed?: boolean }) => new Email(opt)