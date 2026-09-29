// CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = 'https://whfyyenctppnociyfhfn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_OxuXce2Y68ZzFkO8G5Opwg_H-AmYXDw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let usuarioAtual = null;

// NAVEGAÇÃO
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item, .nav-btn, .action-card, button[onclick]');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-target') ||
                       item.getAttribute('data-section') ||
                       (item.onclick && item.onclick.toString().match(/'(\w+)'/)?.[1]);
      if (targetId) goToPage(targetId);
    });
  });
}

function goToPage(pageId) {
  document.querySelectorAll('.page-section, .content-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
  }

  if (pageId === 'noticias') carregarNoticias();
  if (pageId === 'eventos') carregarEventos();
  if (pageId === 'comentarios') carregarComentarios();
  if (pageId === 'publicar') atualizarTelaPublicar();
  if (pageId === 'login') atualizarTelaLogin();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// LOGIN / LOGOUT
function atualizarTelaLogin() {
  const formBox = document.getElementById('login-form-box') ||
                  document.getElementById('login-form-container');
  const userBox = document.getElementById('user-logged-box') ||
                  document.getElementById('user-info-container');

  if (!formBox || !userBox) return;

  if (usuarioAtual) {
    formBox.style.display = 'none';
    userBox.style.display = 'block';
    const nomeExibicao = document.getElementById('user-nome-exibicao') ||
                         document.getElementById('user-name-display');
    if (nomeExibicao) nomeExibicao.textContent = usuarioAtual.nome;
  } else {
    formBox.style.display = 'block';
    userBox.style.display = 'none';
  }
}

async function realizarLogin() {
  const nomeInput = document.getElementById('login-nome') ||
                    document.getElementById('login-usuario');
  const senhaInput = document.getElementById('login-senha');
  const msg = document.getElementById('msg-login');

  if (!nomeInput || !senhaInput || !msg) return;

  const nome = nomeInput.value.trim();
  const senha = senhaInput.value;

  msg.textContent = '';
  msg.className = 'form-feedback';

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

function realizarLogout() {
  supabase.auth.signOut();
  usuarioAtual = null;
  atualizarTelaLogin();
  goToPage('inicio');
}

// TELA DE PUBLICAR
function atualizarTelaPublicar() {
  const aviso = document.getElementById('aviso-login-publicar') ||
                document.getElementById('aviso-publicar');
  const formContainer = document.getElementById('form-publicar-container') ||
                        document.getElementById('form-publicar');

  if (!aviso || !formContainer) return;

  if (usuarioAtual) {
    aviso.style.display = 'none';
    formContainer.style.display = 'block';
  } else {
    aviso.style.display = 'block';
    formContainer.style.display = 'none';
  }
}

// CARREGAR NOTÍCIAS
async function carregarNoticias() {
  const container = document.getElementById('lista-noticias');
  if (!container) return;

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

// CARREGAR EVENTOS
async function carregarEventos() {
  const container = document.getElementById('lista-eventos');
  if (!container) return;

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

// CARREGAR COMENTÁRIOS
async function carregarComentarios() {
  const container = document.getElementById('lista-comentarios');
  if (!container) return;

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

// PUBLICAR NOTÍCIA
async function publicarNoticia() {
  const tituloInput = document.getElementById('titulo-noticia');
  const conteudoInput = document.getElementById('conteudo-noticia');
  const msg = document.getElementById('msg-publicar');

  if (!tituloInput || !conteudoInput || !msg) return;

  const titulo = tituloInput.value.trim();
  const conteudo = conteudoInput.value.trim();

  msg.textContent = '';
  msg.className = 'form-feedback';

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

// PUBLICAR EVENTO
async function publicarEvento() {
  const tituloInput = document.getElementById('titulo-evento');
  const dataInput = document.getElementById('data-evento');
  const conteudoInput = document.getElementById('conteudo-evento');
  const msg = document.getElementById('msg-publicar');

  if (!tituloInput || !dataInput || !conteudoInput || !msg) return;

  const titulo = tituloInput.value.trim();
  const dataEvento = dataInput.value.trim();
  const conteudo = conteudoInput.value.trim();

  msg.textContent = '';
  msg.className = 'form-feedback';

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

// UTILITÁRIO
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// INICIALIZAÇÃO
window.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  goToPage('inicio');
});
