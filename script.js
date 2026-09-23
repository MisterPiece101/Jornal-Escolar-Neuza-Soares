// ============================================
// CONFIGURAÇÃO DO SUPABASE
// ============================================
const SUPABASE_URL = 'https://whfyyenctppnociyfhfn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_OxuXce2Y68ZzFkO8G5Opwg_H-AmYXDw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let usuarioAtual = null;

// ============================================
// NAVEGAÇÃO
// ============================================
function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionId = btn.getAttribute('data-section');
      goToSection(sectionId);

      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function goToSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
  }

  if (sectionId === 'noticias') carregarNoticias();
  if (sectionId === 'eventos') carregarEventos();
  if (sectionId === 'comentarios') carregarComentarios();
  if (sectionId === 'publicar') atualizarTelaPublicar();
  if (sectionId === 'login') atualizarTelaLogin();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// LOGIN / LOGOUT
// ============================================
function atualizarTelaLogin() {
  const formContainer = document.getElementById('login-form-container');
  const infoContainer = document.getElementById('user-info-container');
  const userNameDisplay = document.getElementById('user-name-display');

  if (usuarioAtual) {
    formContainer.style.display = 'none';
    infoContainer.style.display = 'block';
    userNameDisplay.textContent = usuarioAtual.nome;
  } else {
    formContainer.style.display = 'block';
    infoContainer.style.display = 'none';
  }
}

async function fazerLogin() {
  const nomeInput = document.getElementById('login-usuario');
  const senhaInput = document.getElementById('login-senha');
  const msg = document.getElementById('msg-login');

  const nome = nomeInput.value.trim();
  const senha = senhaInput.value;

  msg.textContent = '';
  msg.className = 'form-message';

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
    atualizarTelaLogin();
  } catch (e) {
    msg.textContent = 'Login falhou. Verifique nome e senha.';
    msg.classList.add('error');
    console.error(e);
  }
}

function fazerLogout() {
  supabase.auth.signOut();
  usuarioAtual = null;
  atualizarTelaLogin();
  goToSection('inicio');
}

// ============================================
// TELA DE PUBLICAR
// ============================================
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

// ============================================
// CARREGAR NOTÍCIAS
// ============================================
async function carregarNoticias() {
  const container = document.getElementById('lista-noticias');
  container.innerHTML = '<div class="empty-state">Carregando notícias...</div>';

  try {
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<div class="empty-state">Nenhuma notícia ainda.</div>';
      return;
    }

    container.innerHTML = '';
    data.forEach(n => {
      const card = document.createElement('div');
      card.className = 'news-card';

      const dataFormatada = n.criado_em
        ? new Date(n.criado_em).toLocaleDateString('pt-BR')
        : '';

      card.innerHTML = `
        <h4>${escapeHtml(n.titulo || 'Sem título')}</h4>
        <p>${escapeHtml(n.conteudo || '')}</p>
        <div class="meta-info">Por ${escapeHtml(n.autor || 'Anônimo')} em ${dataFormatada}</div>
      `;

      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = '<div class="empty-state">Erro ao carregar notícias.</div>';
    console.error(e);
  }
}

// ============================================
// CARREGAR EVENTOS
// ============================================
async function carregarEventos() {
  const container = document.getElementById('lista-eventos');
  container.innerHTML = '<div class="empty-state">Carregando eventos...</div>';

  try {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<div class="empty-state">Nenhum evento ainda.</div>';
      return;
    }

    container.innerHTML = '';
    data.forEach(e => {
      const card = document.createElement('div');
      card.className = 'event-card';

      const dataFormatada = e.criado_em
        ? new Date(e.criado_em).toLocaleDateString('pt-BR')
        : '';

      card.innerHTML = `
        <h4>${escapeHtml(e.titulo || 'Sem título')}</h4>
        <p><strong>Data:</strong> ${escapeHtml(e.data_evento || 'Sem data')}</p>
        <p>${escapeHtml(e.conteudo || '')}</p>
        <div class="meta-info">Por ${escapeHtml(e.autor || 'Anônimo')} em ${dataFormatada}</div>
      `;

      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = '<div class="empty-state">Erro ao carregar eventos.</div>';
    console.error(e);
  }
}

// ============================================
// CARREGAR COMENTÁRIOS
// ============================================
async function carregarComentarios() {
  const container = document.getElementById('lista-comentarios');
  container.innerHTML = '<div class="empty-state">Carregando comentários...</div>';

  try {
    const { data, error } = await supabase
      .from('comentarios')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = '<div class="empty-state">Nenhum comentário ainda.</div>';
      return;
    }

    container.innerHTML = '';
    data.forEach(c => {
      const card = document.createElement('div');
      card.className = 'comment-card';

      const dataFormatada = c.criado_em
        ? new Date(c.criado_em).toLocaleDateString('pt-BR')
        : '';

      card.innerHTML = `
        <h4>${escapeHtml(c.autor || 'Anônimo')}</h4>
        <p>${escapeHtml(c.conteudo || '')}</p>
        <div class="meta-info">Em ${dataFormatada}</div>
      `;

      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = '<div class="empty-state">Erro ao carregar comentários.</div>';
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
  msg.className = 'form-message';

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
  msg.className = 'form-message';

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
// UTILITÁRIOS
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
  initNavigation();
  goToSection('inicio');
});
