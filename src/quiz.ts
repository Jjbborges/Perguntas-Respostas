import { pool } from './db.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function questionAsync(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log('🎉 Bem-vindo ao Quiz!\n');

  const nome = await questionAsync('Digite seu nome: ');

  // Cria o usuário no banco
  let usuarioId: number;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome) VALUES ($1) RETURNING id',
      [nome]
    );
    usuarioId = result.rows[0].id;
  } catch (err: unknown) {
    if (err instanceof Error) console.error('Erro ao criar usuário:', err.message);
    else console.error('Erro desconhecido ao criar usuário.');
    rl.close();
    return;
  }

  // Busca todas as perguntas
  let perguntas;
  try {
    const result = await pool.query('SELECT * FROM perguntas ORDER BY id');
    perguntas = result.rows;
  } catch (err: unknown) {
    if (err instanceof Error) console.error('Erro ao buscar perguntas:', err.message);
    else console.error('Erro desconhecido ao buscar perguntas.');
    rl.close();
    return;
  }

  let pontuacao = 0;

  for (const p of perguntas) {
    console.log(`\n${p.id}. ${p.enunciado}`);

    // Busca respostas da pergunta
    let respostas;
    try {
      const res = await pool.query('SELECT * FROM respostas WHERE pergunta_id = $1', [p.id]);
      respostas = res.rows;
    } catch (err: unknown) {
      if (err instanceof Error) console.error('Erro ao buscar respostas:', err.message);
      rl.close();
      return;
    }

    // Mostra opções
    respostas.forEach((r: any, idx: number) => {
      console.log(`${idx + 1}. ${r.texto}`);
    });

    // Pergunta do usuário
    const respostaUsuario = await questionAsync('Escolha o número da resposta: ');
    const escolha = parseInt(respostaUsuario);

    if (respostas[escolha - 1]?.correta) {
      console.log('✅ Correto!');
      pontuacao += 1;
    } else {
      console.log('❌ Errado!');
    }
  }

  console.log(`\n🏆 Quiz finalizado! Sua pontuação: ${pontuacao} / ${perguntas.length}`);

  // Atualiza pontuação do usuário no banco
  try {
    await pool.query('UPDATE usuarios SET pontuacao = $1 WHERE id = $2', [pontuacao, usuarioId]);
  } catch (err: unknown) {
    if (err instanceof Error) console.error('Erro ao salvar pontuação:', err.message);
    else console.error('Erro desconhecido ao salvar pontuação.');
  }

  rl.close();
  process.exit(0);
}

main();
