import express from 'express';
import usuariosRouter from './routes/usuarios';
import perguntasRouter from './routes/perguntas';
import respostasRouter from './routes/respostas';
const app = express();
app.use(express.json());
app.use('/usuarios', usuariosRouter);
app.use('/perguntas', perguntasRouter);
app.use('/respostas', respostasRouter);
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000 🚀');
});
