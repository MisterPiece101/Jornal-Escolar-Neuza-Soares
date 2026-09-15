// ============================================
// CONFIGURAÇÃO DO SUPABASE
// ============================================
const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_KEY = 'SUA_ANON_KEY_AQUI';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// ELEMENTOS DO DOM
// ============================================
const formNoticia = document.getElementById("formNoticia");
const formComentario = document.getElementById("formComentario");
const formEvento = document.getElementById("formEvento");

const listaNoticias = document.getElementById("listaNoticias");
const listaComentarios = document.getElementById("listaComentarios");
const listaEventos = document.getElementById("listaEventos");

const semNoticias = document.getElementById("semNoticias");
const semComentarios = document.getElementById("semComentarios");
const semEventos = document.getElementById("semEventos");

const campoImagem = document.getElementById("imagem");
const previewImagem = document.getElementById("previewImagem");

const areaLogin = document.getElementById("areaLogin");
const painelAdmin = document.getElementById("painelAdmin");
const painelEventos = document.getElementById("painelEventos");

const loginAdmin = document.getElementById("loginAdmin");
const senhaAdmin = document.getElementById("senhaAdmin");

const botaoEntrar = document.getElementById("btnEntrar");
const botaoSair = document.getElementById("btnSair");
const botaoVoltarTopo = document.getElementById("btnVoltarTopo");

const mostrarSenhaBtn = document.getElementById("btnMostrarSenha");
const botaoCancelarNoticia = document.getElementById("btnLimparNoticia");
const botaoCancelarComentario = document.getElementById("btnLimparComentario");
const botaoCancelarEvento = document.getElementById("btnCancelarEvento");

const mensagemLogin = document.getElementById("msgLogin");
const usuarioConectado = document.getElementById("usuarioConectado");

const totalNoticiasEl = document.getElementById("totalNoticias");
const totalEventosEl = document.getElementById("totalEventos");
const totalComentariosEl = document.getElementById("totalComentarios");

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================
function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function atualizarEstatisticas() {
  totalNoticiasEl.textContent = '...';
  totalEventosEl.textContent = '...';
  totalComentariosEl.textContent = '...';
}

// ============================================
// CARREGAR DADOS DO SUPABASE
// ============================================
async function carregarNoticias() {
  const { data, error } = await supabase
    .from('noticias')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) {
    console.error('Erro ao carregar notícias:', error);
    return [];
  }

  return data || [];
}

async function carregarComentarios() {
  const { data, error } = await supabase
    .from('comentarios')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) {
    console.error('Erro ao carregar comentários:', error);
    return [];
  }

  return data || [];
}

async function carregarEventos() {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) {
    console.error('Erro ao carregar eventos:', error);
    return [];
  }

  return data || [];
}

// ============================================
// RENDERIZAÇÃO
// ============================================
function renderizarNoticias(noticias) {
  listaNoticias.innerHTML = "";

  if (!noticias || noticias.length === 0) {
    semNoticias.style.display = "block";
    return;
  }

  semNoticias.style.display = "none";

  noticias.forEach(noticia => {
    const card = document.createElement("article");
    card.className = "card-noticia";

    const imagem = noticia.imagem_url 
      ? `<img src="${noticia.imagem_url}" alt="${escaparHTML(noticia.titulo)}" loading="lazy">` 
      : "";

    const estaLogado = usuarioConectado.textContent.trim() !== "";
    const btnExcluir = estaLogado
      ? `<button class="botao botao-perigo" style="position:absolute;top:15px;right:15px;padding:8px 12px;font-size:12px;" data-id="${noticia.id}" data-tipo="noticia">🗑️ Excluir</button>`
      : "";

    const autor = noticia.autor || 'Administrador';
    const data = noticia.criado_em ? new Date(noticia.criado_em).toLocaleDateString('pt-BR') : '';

    card.innerHTML = `
      ${btnExcluir}
      <h3>${escaparHTML(noticia.titulo)}</h3>
      ${imagem}
      <p>${escaparHTML(noticia.texto)}</p>
      <div class="meta-noticia">
        📝 <strong>${escaparHTML(autor)}</strong> • 📅 ${data}
      </div>
    `;

    listaNoticias.appendChild(card);
  });

  totalNoticiasEl.textContent = noticias.length;
}

function renderizarComentarios(comentarios) {
  listaComentarios.innerHTML = "";

  if (!comentarios || comentarios.length === 0) {
    semComentarios.style.display = "block";
    return;
  }

  semComentarios.style.display = "none";

  comentarios.forEach(comentario => {
    const card = document.createElement("article");
    card.className = "card-comentario";

    const estaLogado = usuarioConectado.textContent.trim() !== "";
    const btnExcluir = estaLogado
      ? `<button class="botao botao-perigo" style="position:absolute;top:15px;right:15px;padding:8px 12px;font-size:12px;" data-id="${comentario.id}" data-tipo="comentario">🗑️ Excluir</button>`
      : "";

    const data = comentario.criado_em ? new Date(comentario.criado_em).toLocaleDateString('pt-BR') : '';

    card.innerHTML = `
      ${btnExcluir}
      <strong>👤 ${escaparHTML(comentario.nome)}</strong>
      <p>${escaparHTML(comentario.texto)}</p>
      <small>📅 ${data}</small>
    `;

    listaComentarios.appendChild(card);
  });

  totalComentariosEl.textContent = comentarios.length;
}

function renderizarEventos(eventos) {
  listaEventos.innerHTML = "";

  if (!eventos || eventos.length === 0) {
    semEventos.style.display = "block";
    return;
  }

  semEventos.style.display = "none";

  eventos.forEach(evento => {
    const card = document.createElement("article");
    card.className = "card-evento";

    const estaLogado = usuarioConectado.textContent.trim() !== "";
    const btnExcluir = estaLogado
      ? `<button class="botao botao-perigo" style="position:absolute;top:15px;right:15px;padding:8px 12px;font-size:12px;" data-id="${evento.id}" data-tipo="evento">🗑️ Excluir</button>`
      : "";

    card.innerHTML = `
      ${btnExcluir}
      <h3>📅 ${escaparHTML(evento.titulo)}</h3>
      <p><strong>📆 Data:</strong> ${escaparHTML(evento.data)}</p>
      <p>${escaparHTML(evento.descricao)}</p>
    `;

    listaEventos.appendChild(card);
  });

  totalEventosEl.textContent = eventos.length;
}

// ============================================
// AUTENTICAÇÃO
// ============================================
async function verificarLogin() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    areaLogin.classList.add("oculto");
    painelAdmin.classList.remove("oculto");
    painelEventos.classList.remove("oculto");

    const email = user.email || '';
    const nome = email.split('@')[0];
    usuarioConectado.textContent = nome.charAt(0).toUpperCase() + nome.slice(1);
  } else {
    areaLogin.classList.remove("oculto");
    painelAdmin.classList.add("oculto");
    painelEventos.classList.add("oculto");
    usuarioConectado.textContent = "";
  }
}

mostrarSenhaBtn.addEventListener("click", () => {
  const tipo = senhaAdmin.type;
  senhaAdmin.type = tipo === "password" ? "text" : "password";
  mostrarSenhaBtn.textContent = tipo === "password" ? "🙈" : "👁️";
});

botaoEntrar.addEventListener("click", async () => {
  const email = loginAdmin.value.trim().toLowerCase();
  const senha = senhaAdmin.value.trim();
  const emailCompleto = `${email}@escola.com.br`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailCompleto,
    password: senha
  });

  if (error) {
    mensagemLogin.textContent = "❌ Login ou senha incorretos.";
    mensagemLogin.style.cssText = "color: var(--cor-perigo); background: #ffebee;";
  } else {
    mensagemLogin.textContent = "✅ Login realizado com sucesso!";
    mensagemLogin.style.cssText = "color: var(--cor-sucesso); background: #d4edda;";

    loginAdmin.value = "";
    senhaAdmin.value = "";
    mostrarSenhaBtn.textContent = "👁️";

    setTimeout(() => {
      mensagemLogin.textContent = "";
      verificarLogin();
      carregarETodosDados();
    }, 1500);
  }
});

senhaAdmin.addEventListener("keydown", e => {
  if (e.key === "Enter") botaoEntrar.click();
});

botaoSair.addEventListener("click", async () => {
  if (confirm("🚪 Deseja realmente sair?")) {
    await supabase.auth.signOut();
    mensagemLogin.textContent = "👋 Você saiu da área administrativa.";
    mensagemLogin.style.cssText = "color: var(--cor-cinza); background: var(--cor-fundo);";
    verificarLogin();
  }
});

// ============================================
// UPLOAD DE IMAGENS
// ============================================
async function uploadImagem(arquivo) {
  const nomeArquivo = `noticia_${Date.now()}_${arquivo.name}`;

  const { data, error } = await supabase.storage
    .from('imagens-jornal')
    .upload(nomeArquivo, arquivo);

  if (error) {
    console.error('Erro no upload:', error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('imagens-jornal')
    .getPublicUrl(nomeArquivo);

  return urlData.publicUrl;
}

// ============================================
// SALVAR DADOS NO SUPABASE
// ============================================
async function salvarNoticia(titulo, autor, texto, imagemUrl) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    alert("⚠️ Você precisa estar logado para publicar.");
    return false;
  }

  const { error } = await supabase
    .from('noticias')
    .insert([
      {
        titulo: titulo,
        autor: autor,
        texto: texto,
        imagem_url: imagemUrl,
        criado_por: user.id
      }
    ]);

  if (error) {
    console.error('Erro ao salvar notícia:', error);
    return false;
  }

  return true;
}

async function salvarEvento(titulo, data, descricao) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    alert("⚠️ Você precisa estar logado para criar eventos.");
    return false;
  }

  const { error } = await supabase
    .from('eventos')
    .insert([
      {
        titulo: titulo,
        data: data,
        descricao: descricao,
        criado_por: user.id
      }
    ]);

  if (error) {
    console.error('Erro ao salvar evento:', error);
    return false;
  }

  return true;
}

async function salvarComentario(nome, texto) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    alert("⚠️ Você precisa estar logado para comentar.");
    return false;
  }

  const { error } = await supabase
    .from('comentarios')
    .insert([
      {
        nome: nome,
        texto: texto,
        criado_por: user.id
      }
    ]);

  if (error) {
    console.error('Erro ao salvar comentário:', error);
    return false;
  }

  return true;
}

async function excluirItem(tabela, id) {
  const { error } = await supabase
    .from(tabela)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir:', error);
    return false;
  }

  return true;
}

// ============================================
// EVENT LISTENERS DOS FORMULÁRIOS
// ============================================
campoImagem.addEventListener("change", function() {
  const arquivo = this.files[0];

  if (!arquivo) {
    previewImagem.innerHTML = "";
    return;
  }

  if (!arquivo.type.startsWith("image/")) {
    alert("⚠️ Escolha uma imagem válida (JPG, PNG ou WEBP).");
    this.value = "";
    return;
  }

  if (arquivo.size > 2 * 1024 * 1024) {
    alert("⚠️ A imagem deve ter no máximo 2 MB.");
    this.value = "";
    return;
  }

  const leitor = new FileReader();
  leitor.onload = e => {
    previewImagem.innerHTML = `
      <p><strong>📷 Pré-visualização:</strong></p>
      <img src="${e.target.result}" alt="Pré-visualização" class="preview-foto">
    `;
  };
  leitor.readAsDataURL(arquivo);
});

formNoticia.addEventListener("submit", async e => {
  e.preventDefault();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("⚠️ Entre como administrador para publicar.");
    return;
  }

  const titulo = document.getElementById("titulo").value.trim();
  const autor = document.getElementById("autor").value.trim();
  const texto = document.getElementById("texto").value.trim();
  const arquivo = campoImagem.files[0];

  if (!titulo || !autor || !texto) {
    alert("⚠️ Preencha todos os campos obrigatórios.");
    return;
  }

  let imagemUrl = null;
  if (arquivo) {
    imagemUrl = await uploadImagem(arquivo);
    if (!imagemUrl) {
      alert("⚠️ Erro ao fazer upload da imagem.");
      return;
    }
  }

  const sucesso = await salvarNoticia(titulo, autor, texto, imagemUrl);

  if (sucesso) {
    alert("✅ Notícia publicada com sucesso!");
    formNoticia.reset();
    previewImagem.innerHTML = "";
    carregarETodosDados();
    window.location.hash = "noticias";
  } else {
    alert("❌ Erro ao publicar notícia.");
  }
});

formEvento.addEventListener("submit", async e => {
  e.preventDefault();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("⚠️ Entre como administrador para criar eventos.");
    return;
  }

  const titulo = document.getElementById("tituloEvento").value.trim();
  const data = document.getElementById("dataEvento").value.trim();
  const descricao = document.getElementById("descricaoEvento").value.trim();

  if (!titulo || !data || !descricao) {
    alert("⚠️ Preencha todos os campos.");
    return;
  }

  const sucesso = await salvarEvento(titulo, data, descricao);

  if (sucesso) {
    alert("✅ Evento cadastrado com sucesso!");
    formEvento.reset();
    carregarETodosDados();
  } else {
    alert("❌ Erro ao cadastrar evento.");
  }
});

formComentario.addEventListener("submit", async e => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const texto = document.getElementById("comentario").value.trim();

  if (!nome || !texto) {
    alert("⚠️ Preencha nome e comentário.");
    return;
  }

  const sucesso = await salvarComentario(nome, texto);

  if (sucesso) {
    alert("💬 Comentário enviado com sucesso!");
    formComentario.reset();
    carregarETodosDados();
  } else {
    alert("❌ Erro ao enviar comentário.");
  }
});

// ============================================
// EXCLUSÃO DE ITENS
// ============================================
document.addEventListener("click", async e => {
  if (!e.target.matches('[data-id]')) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("⚠️ Somente administradores podem excluir.");
    return;
  }

  const id = Number(e.target.dataset.id);
  const tipo = e.target.dataset.tipo;

  if (confirm("🗑️ Tem certeza que deseja excluir?")) {
    const tabelas = {
      noticia: 'noticias',
      comentario: 'comentarios',
      evento: 'eventos'
    };

    const tabela = tabelas[tipo];
    if (tabela) {
      await excluirItem(tabela, id);
      carregarETodosDados();
    }
  }
});

// ============================================
// BOTÕES DE CANCELAR
// ============================================
[botaoCancelarNoticia, botaoCancelarComentario, botaoCancelarEvento].forEach(btn => {
  btn?.addEventListener("click", function() {
    const form = this.closest("form");
    form?.reset();
    if (this.id === "btnLimparNoticia") {
      previewImagem.innerHTML = "";
    }
  });
});

// ============================================
// BOTÃO VOLTAR AO TOPO
// ============================================
window.addEventListener("scroll", () => {
  botaoVoltarTopo.classList.toggle("visivel", window.pageYOffset > 300);
});

botaoVoltarTopo.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ============================================
// MENU LINKS
// ============================================
document.querySelectorAll(".menu-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const alvo = document.querySelector(link.getAttribute("href"));
    alvo?.scrollIntoView({ behavior: "smooth" });
  });
});

// ============================================
// CARREGAR TODOS OS DADOS
// ============================================
async function carregarETodosDados() {
  atualizarEstatisticas();

  const [noticias, comentarios, eventos] = await Promise.all([
    carregarNoticias(),
    carregarComentarios(),
    carregarEventos()
  ]);

  renderizarNoticias(noticias);
  renderizarComentarios(comentarios);
  renderizarEventos(eventos);
}

// ============================================
// INICIALIZAÇÃO
// ============================================
async function inicializar() {
  await verificarLogin();
  await carregarETodosDados();
}

inicializar();
