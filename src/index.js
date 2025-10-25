import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { router as authRouter } from './routes/auth.js';
import { router as usersRouter } from './routes/users.js';
import { router as ouvragesRouter } from './routes/ouvrages.js';
import { router as categoriesRouter } from './routes/categories.js';
import { router as panierRouter } from './routes/panier.js';
import { router as commandesRouter } from './routes/commandes.js';
import { router as listesRouter } from './routes/listes.js';
import { router as commentairesRouter } from './routes/commentaires.js';

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/ouvrages', ouvragesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/panier', panierRouter);
app.use('/api/commandes', commandesRouter);
app.use('/api/listes', listesRouter);
app.use('/api/commentaires', commentairesRouter);

app.get('/health', (req, res) => res.json({status: 'ok'}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
