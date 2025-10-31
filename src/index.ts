import express from 'express';
import questionsRouter from './routes/questions.js';
import usersRouter from './routes/users.js';
import './db.js';

const app = express();
app.use(express.json());

app.use('/questions', questionsRouter);
app.use('/users', usersRouter);