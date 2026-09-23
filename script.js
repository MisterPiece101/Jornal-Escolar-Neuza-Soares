// CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = 'https://whfyyenctppnociyfhfn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_OxuXce2Y68ZzFkO8G5Opwg_H-AmYXDw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let usuarioAtual = null;

// NAVEGAÇÃO ENTRE SEÇÕES
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  if (id === 'noticias') carregarNoticias();
  if (id === 'eventos') carregarEventos();
  if (id === 'comentarios') carregarComentarios();
  if (id === 'publicar') atualizarTelaPublicar();
  if (id === 'login') atualizarTelaLogin();
}

// LOGIN / LOGOUT
function atualizarTelaLogin() {
  const formContainer = document.getElementById('login-form-container');
  const infoContainer = document.getElementById('user-info-container');
  const userInfo = document.getElementById('user-info');

  if (usuarioAtual) {
    formContainer.style.display = 'none';
    infoContainer.style.display = 'block';
    userInfo.textContent = `Olá, ${usuarioAtual.nome}!`;
  } else {
    formContainer.style.display = 'block';
    infoContainer.style.display = 'none';
  }
}

async function fazerLogin() {
  const nome = document.getElementById('login-usuario').value.trim();
  const senha = document.getElementById('login-senha').value;
  const msg = document.getElementById('msg-login');

  msg.textContent = '';

  if (!nome || !senha) {
    msg.textContent = 'Digite nome e senha.';
    return;
  }

  const email = nome.toLowerCase() + '@escola.com.br';

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    if (error) throw error;

    usuarioAtual = {
      id: data.user.id,
      nome: nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase()
    };

    msg.className = 'success';
    msg.textContent = 'Login realizado!';
    atualizarTelaLogin();
  } catch (e) {
    msg.className = 'error';
    msg.textContent = 'Login falhou. Verifique nome e senha.';
    console.error(e);
  }
}

function fazerLogout() {
  supabase.auth.signOut();
  usuarioAtual = null;
  document.getElementById('login-usuario').value = '';
  document.getElementById('login-senha').value = '';
  document.getElementById('msg-login').textContent = '';
  atualizarTelaLogin();
}

// TELA DE PUBLICAR
function atualizarTelaPublicar() {
  const aviso = document.getElementById('aviso-publicar');
  const form = document.getElementById('form-publicar');

  if (usuarioAtual) {
    aviso.style.display = 'none';
    form.style.display = 'block';
  } else {
    aviso.style.display = 'block';
    form.style.display = 'none';
  }
}

// CARREGAR NOTÍCIAS
async function carregarNoticias() {
  const container = document.getElementById('lista-noticias');
  container.innerHTML = '<div class="empty">Carregando notícias...</div>';

  try {
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<div class="empty">Nenhuma notícia ainda.</div>';
      return;
    }

    container.innerHTML = '';
    data.forEach(n => {
      const div = document.createElement('div');
      div.className = 'news-item';
      const dataFormatada = n.criado_em ? new Date(n.criado_em).toLocaleDateString('pt-BR') : '';
      div.innerHTML = `
        <strong>${n.titulo || 'Sem título'}</strong>
        <p>${n.conteudo || ''}</p>
        <div class="meta">Por ${n.autor || 'Anônimo'} em ${dataFormatada}</div>
      `;
      container.appendChild(div);
    });
  } catch (e) {
    container.innerHTML = '<div class="empty">Erro ao carregar notícias.</div>';
    console.error(e);
  }
}

// CARREGAR EVENTOS
async function carregarEventos() {
  const container = document.getElementById('lista-eventos');
  container.innerHTML = '<div class="empty">Carregando eventos...</div>';

  try {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<div class="empty">Nenhum evento ainda.</div>';
      return;
    }

    container.innerHTML = '';
    data.forEach(e => {
      const div = document.createElement('div');
      div.className = 'event-item';
      const dataFormatada = e.criado_em ? new Date(e.criado_em).toLocaleDateString('pt-BR') : '';
      div.innerHTML = `
        <strong>${e.titulo || 'Sem título'}</strong>
        <p>Data: ${e.data_evento || 'Sem data'}</p>
        <p>${e.conteudo || ''}</p>
        <div class="meta">Por ${e.autor || 'Anônimo'} em ${dataFormatada}</div>
      `;
      container.appendChild(div);
    });
  } catch (e) {
    container.innerHTML = '<div class="empty">Erro ao carregar eventos.</div>';
    console.error(e);
  }
}

// CARREGAR COMENTÁRIOS
async function carregarComentarios() {
  const container = document.getElementById('lista-comentarios');
  container.innerHTML = '<div class="empty">Carregando comentários...</div>';

  try {
    const { data, error } = await supabase
      .from('comentarios')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<div class="empty">Nenhum comentário ainda.</div>';
      return;
    }

    container.innerHTML = '';
    data.forEach(c => {
      const div = document.createElement('div');
      div.className = 'comment-item';
      const dataFormatada = c.criado_em ? new Date(c.criado_em).toLocaleDateString('pt-BR') : '';
      div.innerHTML = `
        <strong>${c.autor || 'Anônimo'}</strong>
        <p>${c.conteudo || ''}</p>
        <div class="meta">Em ${dataFormatada}</div>
      `;
      container.appendChild(div);
    });
  } catch (e) {
    container.innerHTML = '<div class="empty">Erro ao carregar comentários.</div>';
    console.error(e);
  }
}

// PUBLICAR NOTÍCIA
async function publicarNoticia() {
  const titulo = document.getElementById('titulo-noticia').value.trim();
  const conteudo = document.getElementById('conteudo-noticia').value.trim();
  const msg = document.getElementById('msg-publicar');

  msg.textContent = '';

  if (!usuarioAtual) {
    msg.className = 'error';
    msg.textContent = 'Faça login para publicar.';
    return;
  }

  if (!titulo || !conteudo) {
    msg.className = 'error';
    msg.textContent = 'Preencha título e conteúdo.';
    return;
  }

  try {
    const { error } = await supabase.from('noticias').insert([{
      titulo,
      conteudo,
      autor: usuarioAtual.nome,
      criado_por: usuarioAtual.id,
      criado_em: new Date().toISOString()
    }]);

    if (error) throw error;

    msg.className = 'success';
    msg.textContent = 'Notícia publicada!';
    document.getElementById('titulo-noticia').value = '';
    document.getElementById('conteudo-noticia').value = '';
  } catch (e) {
    msg.className = 'error';
    msg.textContent = 'Erro ao publicar notícia.';
    console.error(e);
  }
}

// PUBLICAR EVENTO
async function publicarEvento() {
  const titulo = document.getElementById('titulo-evento').value.trim();
  const dataEvento = document.getElementById('data-evento').value.trim();
  const conteudo = document.getElementById('conteudo-evento').value.trim();
  const msg = document.getElementById('msg-publicar');

  msg.textContent = '';

  if (!usuarioAtual) {
    msg.className = 'error';
    msg.textContent = 'Faça login para publicar.';
    return;
  }

  if (!titulo || !conteudo) {
    msg.className = 'error';
    msg.textContent = 'Preencha título e descrição.';
    return;
  }

  try {
    const { error } = await supabase.from('eventos').insert([{
      titulo,
      data_evento: dataEvento,
      conteudo,
      autor: usuarioAtual.nome,
      criado_por: usuarioAtual.id,
      criado_em: new Date().toISOString()
    }]);

    if (error) throw error;

    msg.className = 'success';
    msg.textContent = 'Evento publicado!';
    document.getElementById('titulo-evento').value = '';
    document.getElementById('data-evento').value = '';
    document.getElementById('conteudo-evento').value = '';
  } catch (e) {
    msg.className = 'error';
    msg.textContent = 'Erro ao publicar evento.';
    console.error(e);
  }
}

// INICIALIZAÇÃO
window.addEventListener('DOMContentLoaded', () => {
  showSection('inicio');
});
