import express from 'express';
import { pool } from '../db.js';
const router = express.Router();
// Cadastrar resposta
router.post('/', async (req, res) => {
    const { texto, correta, pergunta_id } = req.body;
    try {
        const result = await pool.query('INSERT INTO respostas (texto, correta, pergunta_id) VALUES ($1, $2, $3) RETURNING *', [texto, correta, pergunta_id]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        if (err instanceof Error)
            res.status(500).json({ error: err.message });
        else
            res.status(500).json({ error: 'Erro desconhecido' });
    }
});
// Listar respostas
router.get('/', async (_req, res) => {
    try {
        const result = await pool.query('SELECT * FROM respostas');
        res.json(result.rows);
    }
    catch (err) {
        if (err instanceof Error)
            res.status(500).json({ error: err.message });
        else
            res.status(500).json({ error: 'Erro desconhecido' });
    }
});
export default router;
