import express, { Request, Response } from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Cadastrar pergunta
router.post('/', async (req: Request, res: Response) => {
  const { enunciado } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO perguntas (enunciado) VALUES ($1) RETURNING *',
      [enunciado]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: unknown) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
    else res.status(500).json({ error: 'Erro desconhecido' });
  }
});

// Listar perguntas
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM perguntas');
    res.json(result.rows);
  } catch (err: unknown) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
    else res.status(500).json({ error: 'Erro desconhecido' });
  }
});

export default router;
