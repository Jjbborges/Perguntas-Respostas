import express, { Request, Response } from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Cadastrar nova pergunta
router.post('/', async (req: Request, res: Response) => {
  const { question_text, correct_answer } = req.body;

  try {
    await pool.query(
      'INSERT INTO questions (question_text, correct_answer) VALUES ($1, $2)',
      [question_text, correct_answer]
    );
    res.status(201).json({ message: 'Pergunta cadastrada!' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Erro desconhecido.' });
    }
  }
});

// Listar perguntas
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM questions');
    res.json(result.rows);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Erro ao listar perguntas.' });
    }
  }
});

export default router;
