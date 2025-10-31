import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

// Cadastrar usuário
router.post('/', async (req, res) => {
  const { name } = req.body;
  const result = await pool.query(
    'INSERT INTO users (name) VALUES ($1) RETURNING *',
    [name]
  );
  res.json(result.rows[0]);
});

// Enviar resposta e calcular pontuação
router.post('/:id/answer', async (req, res) => {
  const userId = req.params.id;
  const { question_id, user_answer } = req.body;

  const question = await pool.query(
    'SELECT correct_answer FROM questions WHERE id = $1',
    [question_id]
  );

  if (question.rows.length === 0)
    return res.status(404).json({ message: 'Pergunta não encontrada' });

  const isCorrect = question.rows[0].correct_answer === user_answer;

  await pool.query(
    'INSERT INTO answers (user_id, question_id, user_answer, is_correct) VALUES ($1, $2, $3, $4)',
    [userId, question_id, user_answer, isCorrect]
  );

  if (isCorrect) {
    await pool.query('UPDATE users SET score = score + 1 WHERE id = $1', [userId]);
  }

  res.json({ correct: isCorrect });
});

export default router;
