// ============================================
// CONFIGURAÇÃO SUPABASE
// ============================================
const SUPABASE_URL = 'https://whfyyenctppnociyfhfn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_OxuXce2Y68ZzFkO8G5Opwg_H-AmYXDw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let usuarioAtual = null;

// ============================================
// NAVEGAÇÃO
// ============================================
function initNav() {
  const botoes = document.querySelectorAll('.nav-btn');
  botoes.forEach(btn => {
    btn.addEventListener('click', () => {
      const pagina = btn.getAttribute('data-page');
      navegar(pagina);

      botoes.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function navegar(pagina) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });

  const alvo = document.getElementById(pagina);
  if (alvo) {
    alvo.classList.add('active');
  }

  if (pagina === 'noticias') carregarNoticias();
  if (pagina === 'eventos') carregarEventos();
  if (pagina === 'comentarios') carregarComentarios();
  if (pagina === 'publicar') atualizarPublicar();
  if (pagina === 'login') atualizarLogin();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// LOGIN / LOGOUT
// ============================================
function atualizarLogin() {
  const form = document.getElementById('login-form');
  const user = document.getElementById('user-area');
  const nomeEl = document.getElementById('user-nome');

  if (usuarioAtual) {
    form.style.display = 'none';
    user.style.display = 'block';
    nomeEl.textContent = usuarioAtual.nome;
  } else {
    form.style.display = 'block';
    user.style.display = 'none';
  }
}

async function fazerLogin() {
  const nomeInput = document.getElementById('login-nome');
  const senhaInput = document.getElementById('login-senha');
  const msg = document.getElementById('msg-login');

  const nome = nomeInput.value.trim();
  const senha = senhaInput.value;

  msg.textContent = '';
  msg.className = 'form-msg';

  if (!nome || !senha) {
    msg.textContent = 'Digite nome e senha.';
    msg.classList.add('error');
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

    msg.textContent = 'Login realizado!';
    msg.classList.add('success');
    nomeInput.value = '';
    senhaInput.value = '';
    atualizarLogin();
  } catch (e) {
    msg.textContent = 'Login falhou. Verifique nome e senha.';
    msg.classList.add('error');
    console.error(e);
  }
}

function fazerLogout() {
  supabase.auth.signOut();
  usuarioAtual = null;
  atualizarLogin();
  navegar('inicio');
}

// ============================================
// PUBLICAR (TELA)
// ============================================
function atualizarPublicar() {
  const aviso = document.getElementById('aviso-login');
  const form = document.getElementById('form-publicar');

  if (usuarioAtual) {
    aviso.style.display = 'none';
    form.style.display = 'block';
  } else {
    aviso.style.display = 'block';
    form.style.display = 'none';
  }
}

// ============================================
// CARREGAR NOTÍCIAS
// ============================================
async function carregarNoticias() {
  const div = document.getElementById('lista-noticias');
  div.innerHTML = '<div class="loading">Carregando notícias...</div>';

  try {
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      div.innerHTML = '<div class="empty">Nenhuma notícia ainda.</div>';
      return;
    }

    div.innerHTML = '';
    data.forEach(n => {
      const card = document.createElement('div');
      card.className = 'card';

      const dataFormatada = n.criado_em
        ? new Date(n.criado_em).toLocaleDateString('pt-BR')
        : '';

      card.innerHTML = `
        <h4>${escapeHtml(n.titulo || 'Sem título')}</h4>
        <p>${escapeHtml(n.conteudo || '')}</p>
        <div class="meta">Por ${escapeHtml(n.autor || 'Anônimo')} em ${dataFormatada}</div>
      `;

      div.appendChild(card);
    });
  } catch (e) {
    div.innerHTML = '<div class="empty">Erro ao carregar notícias.</div>';
    console.error(e);
  }
}

// ============================================
// CARREGAR EVENTOS
// ============================================
async function carregarEventos() {
  const div = document.getElementById('lista-eventos');
  div.innerHTML = '<div class="loading">Carregando eventos...</div>';

  try {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      div.innerHTML = '<div class="empty">Nenhum evento ainda.</div>';
      return;
    }

    div.innerHTML = '';
    data.forEach(e => {
      const card = document.createElement('div');
      card.className = 'card';

      const dataFormatada = e.criado_em
        ? new Date(e.criado_em).toLocaleDateString('pt-BR')
        : '';

      card.innerHTML = `
        <h4>${escapeHtml(e.titulo || 'Sem título')}</h4>
        <p><strong>Data:</strong> ${escapeHtml(e.data_evento || 'Sem data')}</p>
        <p>${escapeHtml(e.conteudo || '')}</p>
        <div class="meta">Por ${escapeHtml(e.autor || 'Anônimo')} em ${dataFormatada}</div>
      `;

      div.appendChild(card);
    });
  } catch (e) {
    div.innerHTML = '<div class="empty">Erro ao carregar eventos.</div>';
    console.error(e);
  }
}

// ============================================
// CARREGAR COMENTÁRIOS
// ============================================
async function carregarComentarios() {
  const div = document.getElementById('lista-comentarios');
  div.innerHTML = '<div class="loading">Carregando comentários...</div>';

  try {
    const { data, error } = await supabase
      .from('comentarios')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      div.innerHTML = '<div class="empty">Nenhum comentário ainda.</div>';
      return;
    }

    div.innerHTML = '';
    data.forEach(c => {
      const card = document.createElement('div');
      card.className = 'card';

      const dataFormatada = c.criado_em
        ? new Date(c.criado_em).toLocaleDateString('pt-BR')
        : '';

      card.innerHTML = `
        <h4>${escapeHtml(c.autor || 'Anônimo')}</h4>
        <p>${escapeHtml(c.conteudo || '')}</p>
        <div class="meta">Em ${dataFormatada}</div>
      `;

      div.appendChild(card);
    });
  } catch (e) {
    div.innerHTML = '<div class="empty">Erro ao carregar comentários.</div>';
    console.error(e);
  }
}

// ============================================
// PUBLICAR NOTÍCIA
// ============================================
async function publicarNoticia() {
  const tituloInput = document.getElementById('titulo-noticia');
  const conteudoInput = document.getElementById('conteudo-noticia');
  const msg = document.getElementById('msg-publicar');

  const titulo = tituloInput.value.trim();
  const conteudo = conteudoInput.value.trim();

  msg.textContent = '';
  msg.className = 'form-msg';

  if (!usuarioAtual) {
    msg.textContent = 'Faça login para publicar.';
    msg.classList.add('error');
    return;
  }

  if (!titulo || !conteudo) {
    msg.textContent = 'Preencha título e conteúdo.';
    msg.classList.add('error');
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

    msg.textContent = 'Notícia publicada!';
    msg.classList.add('success');
    tituloInput.value = '';
    conteudoInput.value = '';
  } catch (e) {
    msg.textContent = 'Erro ao publicar notícia.';
    msg.classList.add('error');
    console.error(e);
  }
}

// ============================================
// PUBLICAR EVENTO
// ============================================
async function publicarEvento() {
  const tituloInput = document.getElementById('titulo-evento');
  const dataInput = document.getElementById('data-evento');
  const conteudoInput = document.getElementById('conteudo-evento');
  const msg = document.getElementById('msg-publicar');

  const titulo = tituloInput.value.trim();
  const dataEvento = dataInput.value.trim();
  const conteudo = conteudoInput.value.trim();

  msg.textContent = '';
  msg.className = 'form-msg';

  if (!usuarioAtual) {
    msg.textContent = 'Faça login para publicar.';
    msg.classList.add('error');
    return;
  }

  if (!titulo || !conteudo) {
    msg.textContent = 'Preencha título e descrição.';
    msg.classList.add('error');
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

    msg.textContent = 'Evento publicado!';
    msg.classList.add('success');
    tituloInput.value = '';
    dataInput.value = '';
    conteudoInput.value = '';
  } catch (e) {
    msg.textContent = 'Erro ao publicar evento.';
    msg.classList.add('error');
    console.error(e);
  }
}

// ============================================
// UTILITÁRIO
// ============================================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// INICIALIZAÇÃO
// ============================================
window.addEventListener('DOMContentLoaded', () => {
  initNav();
  navegar('inicio');
});
