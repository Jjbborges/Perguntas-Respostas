import pkg from 'pg';
const { Pool } = pkg;
export const pool = new Pool({
    user: 'abc',
    host: 'localhost', // ou host.docker.internal se der erro
    database: 'perguntasrespostas',
    password: '506070',
    port: 5432,
});
pool.connect()
    .then(() => console.log('✅ Conectado ao PostgreSQL!'))
    .catch((err) => {
    if (err instanceof Error) {
        console.error('Erro de conexão:', err.message);
    }
    else {
        console.error('Erro de conexão desconhecido:', err);
    }
});
