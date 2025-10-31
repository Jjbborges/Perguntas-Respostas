import express, { Request, Response } from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Cadastrar usuário
router.post('/', async (req: Request, res: Response) => {
  const { nome } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: unknown) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
    else res.status(500).json({ error: 'Erro desconhecido' });
  }
});

// Atualizar pontuação do usuário
router.patch('/:id/pontuacao', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { pontuacao } = req.body;
  try {
    const result = await pool.query(
      'UPDATE usuarios SET pontuacao = pontuacao + $1 WHERE id = $2 RETURNING *',
      [pontuacao, id]
    );
    res.json(result.rows[0]);
  } catch (err: unknown) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
    else res.status(500).json({ error: 'Erro desconhecido' });
  }
});

export default router;
