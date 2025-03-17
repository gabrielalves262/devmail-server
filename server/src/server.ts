import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Email } from './emails';
import path from 'node:path';

export default () => {
  const app = express();

  app.use(cors({
    methods: ['GET', 'DELETE'],
  }));
  app.use(express.json());

  app.use(express.static(path.resolve(__dirname, './../../client/public')));

  app.get('/api/emails', (req: Request, res: Response, next: NextFunction) => {
    res.json(Email.list());
  })

  app.get('/api/emails/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const email = Email.findById(id);

    if (!email) {
      res.status(404).json({ message: 'Email not found' });
    } else {
      email.readed = true;
      email.save();
      const parse = await email.parse();
      res.json(parse);
    }
  })

  app.delete('/api/emails', (req: Request, res: Response, next: NextFunction) => {
    Email.removeAll();
    res.json({ message: 'All emails removed' });
  })

  app.delete('/api/emails/:id', (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const email = Email.findById(id);

    if (!email) {
      res.status(404).json({ message: 'Email not found' });
    } else {
      email.remove();
      res.json({ message: 'Email removed' });
    }
  })

  return app;
}
