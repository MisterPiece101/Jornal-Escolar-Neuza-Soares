// ============================================
// CONFIGURAÇÃO DO SUPABASE - ATUALIZE AQUI!
// ============================================
const SUPABASE_URL = 'https://whfyyenctppnociyfhfn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_OxuXce2Y68ZzFkO8G5Opwg_H-AmYXDw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// ELEMENTOS
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
const btnLimparNoticia = document.getElementById("btnLimparNoticia");
const btnLimparComentario = document.getElementById("btnLimparComentario");
const btnCancelarEvento = document.getElementById("btnCancelarEvento");

const msgLogin = document.getElementById("msgLogin");
const usuarioConectado = document.getElementById("usuarioConectado");

const totalNoticiasEl = document.getElementById("totalNoticias");
const totalEventosEl = document.getElementById("totalEventos");
const totalComentariosEl = document.getElementById("totalComentarios");

// ============================================
// FUNÇÕES
// ============================================
function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function atualizarEstatisticas(noticias, comentarios, eventos) {
  totalNoticiasEl.textContent = noticias ? noticias.length : 0;
  totalComentariosEl.textContent = comentarios ? comentarios.length : 0;
  totalEventosEl.textContent = eventos ? eventos.length : 0;
}

async function carregarDados() {
  const [noticias, comentarios, eventos] = await Promise.all([
    supabase.from('noticias').select('*').order('criado_em', { ascending: false }).then(r => r.data || []),
    supabase.from('comentarios').select('*').order('criado_em', { ascending: false }).then(r => r.data || []),
    supabase.from('eventos').select('*').order('criado_em', { ascending: false }).then(r => r.data || [])
  ]);

  renderizarTudo(noticias, comentarios, eventos);
  atualizarEstatisticas(noticias, comentarios, eventos);
}

function renderizarTudo(noticias, comentarios, eventos) {
  renderizarNoticias(noticias);
  renderizarComentarios(comentarios);
  renderizarEventos(eventos);
}

function renderizarNoticias(noticias) {
  listaNoticias.innerHTML = "";
  semNoticias.style.display = noticias.length === 0 ? "block" : "none";

  noticias.forEach(n => {
    const card = document.createElement("article");
    card.className = "card-noticia";
    
    const img = n.imagem_url ? `<img src="${n.imagem_url}" alt="${escaparHTML(n.titulo)}">` : "";
    const logado = usuarioConectado.textContent.trim() !== "";
    const excluir = logado ? `<button class="botao botao-perigo" style="position:absolute;top:15px;right:15px;padding:8px 12px;font-size:12px;" data-id="${n.id}" data-tipo="noticia">🗑️</button>` : "";
    const data = n.criado_em ? new Date(n.criado_em).toLocaleDateString('pt-BR') : '';

    card.innerHTML = `${excluir}<h3>${escaparHTML(n.titulo)}</h3>${img}<p>${escaparHTML(n.texto)}</p><div class="meta-noticia">📝 ${escaparHTML(n.autor || 'Admin')} • 📅 ${data}</div>`;
    listaNoticias.appendChild(card);
  });
}

function renderizarComentarios(comentarios) {
  listaComentarios.innerHTML = "";
  semComentarios.style.display = comentarios.length === 0 ? "block" : "none";

  comentarios.forEach(c => {
    const card = document.createElement("article");
    card.className = "card-comentario";
    
    const logado = usuarioConectado.textContent.trim() !== "";
    const excluir = logado ? `<button class="botao botao-perigo" style="position:absolute;top:15px;right:15px;padding:8px 12px;font-size:12px;" data-id="${c.id}" data-tipo="comentario">🗑️</button>` : "";
    const data = c.criado_em ? new Date(c.criado_em).toLocaleDateString('pt-BR') : '';

    card.innerHTML = `${excluir}<strong>👤 ${escaparHTML(c.nome)}</strong><p>${escaparHTML(c.texto)}</p><small>📅 ${data}</small>`;
    listaComentarios.appendChild(card);
  });
}

function renderizarEventos(eventos) {
  listaEventos.innerHTML = "";
  semEventos.style.display = eventos.length === 0 ? "block" : "none";

  eventos.forEach(e => {
    const card = document.createElement("article");
    card.className = "card-evento";
    
    const logado = usuarioConectado.textContent.trim() !== "";
    const excluir = logado ? `<button class="botao botao-perigo" style="position:absolute;top:15px;right:15px;padding:8px 12px;font-size:12px;" data-id="${e.id}" data-tipo="evento">🗑️</button>` : "";

    card.innerHTML = `${excluir}<h3>📅 ${escaparHTML(e.titulo)}</h3><p><strong>📆 Data:</strong> ${escaparHTML(e.data)}</p><p>${escaparHTML(e.descricao)}</p>`;
    listaEventos.appendChild(card);
  });
}

async function verificarLogin() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    areaLogin.classList.add("oculto");
    painelAdmin.classList.remove("oculto");
    painelEventos.classList.remove("oculto");
    const nome = (user.email || '').split('@')[0];
    usuarioConectado.textContent = nome.charAt(0).toUpperCase() + nome.slice(1);
  } else {
    areaLogin.classList.remove("oculto");
    painelAdmin.classList.add("oculto");
    painelEventos.classList.add("oculto");
    usuarioConectado.textContent = "";
  }
}

// ============================================
// EVENTOS
// ============================================
mostrarSenhaBtn.addEventListener("click", () => {
  senhaAdmin.type = senhaAdmin.type === "password" ? "text" : "password";
  mostrarSenhaBtn.textContent = senhaAdmin.type === "password" ? "👁️" : "🙈";
});

botaoEntrar.addEventListener("click", async () => {
  const email = `${loginAdmin.value.trim().toLowerCase()}@escola.com.br`;
  const senha = senhaAdmin.value.trim();

  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) {
    msgLogin.textContent = "❌ Login ou senha incorretos.";
    msgLogin.style.cssText = "color: var(--cor-perigo); background: #ffebee;";
  } else {
    msgLogin.textContent = "✅ Sucesso!";
    msgLogin.style.cssText = "color: var(--cor-sucesso); background: #d4edda;";
    loginAdmin.value = "";
    senhaAdmin.value = "";
    setTimeout(() => { msgLogin.textContent = ""; verificarLogin(); carregarDados(); }, 1500);
  }
});

senhaAdmin.addEventListener("keydown", e => { if (e.key === "Enter") botaoEntrar.click(); });

botaoSair.addEventListener("click", async () => {
  if (confirm("🚪 Sair?")) {
    await supabase.auth.signOut();
    verificarLogin();
  }
});

campoImagem.addEventListener("change", function() {
  const arquivo = this.files[0];
  if (!arquivo) { previewImagem.innerHTML = ""; return; }
  if (!arquivo.type.startsWith("image/")) { alert("⚠️ Imagem inválida."); this.value = ""; return; }
  if (arquivo.size > 2 * 1024 * 1024) { alert("⚠️ Máx 2 MB."); this.value = ""; return; }
  const leitor = new FileReader();
  leitor.onload = e => { previewImagem.innerHTML = `<p>📷 Pré-visualização:</p><img src="${e.target.result}" class="preview-foto">`; };
  leitor.readAsDataURL(arquivo);
});

async function uploadImagem(arquivo) {
  const nome = `noticia_${Date.now()}_${arquivo.name}`;
  const { error } = await supabase.storage.from('imagens-jornal').upload(nome, arquivo);
  if (error) return null;
  const { data } = supabase.storage.from('imagens-jornal').getPublicUrl(nome);
  return data.publicUrl;
}

formNoticia.addEventListener("submit", async e => {
  e.preventDefault();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { alert("⚠️ Faça login."); return; }

  const titulo = document.getElementById("titulo").value.trim();
  const autor = document.getElementById("autor").value.trim();
  const texto = document.getElementById("texto").value.trim();
  const arquivo = campoImagem.files[0];

  if (!titulo || !autor || !texto) { alert("⚠️ Preencha tudo."); return; }

  let imgUrl = null;
  if (arquivo) imgUrl = await uploadImagem(arquivo);

  const { error } = await supabase.from('noticias').insert([{ titulo, autor, texto, imagem_url: imgUrl, criado_por: user.id }]);

  if (error) { alert("❌ Erro: " + error.message); } else { alert("✅ Publicado!"); formNoticia.reset(); previewImagem.innerHTML = ""; carregarDados(); }
});

formEvento.addEventListener("submit", async e => {
  e.preventDefault();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { alert("⚠️ Faça login."); return; }

  const titulo = document.getElementById("tituloEvento").value.trim();
  const data = document.getElementById("dataEvento").value.trim();
  const descricao = document.getElementById("descricaoEvento").value.trim();

  if (!titulo || !data || !descricao) { alert("⚠️ Preencha tudo."); return; }

  const { error } = await supabase.from('eventos').insert([{ titulo, data, descricao, criado_por: user.id }]);

  if (error) { alert("❌ Erro: " + error.message); } else { alert("✅ Evento criado!"); formEvento.reset(); carregarDados(); }
});

formComentario.addEventListener("submit", async e => {
  e.preventDefault();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { alert("⚠️ Faça login."); return; }

  const nome = document.getElementById("nome").value.trim();
  const texto = document.getElementById("comentario").value.trim();

  if (!nome || !texto) { alert("⚠️ Preencha tudo."); return; }

  const { error } = await supabase.from('comentarios').insert([{ nome, texto, criado_por: user.id }]);

  if (error) { alert("❌ Erro: " + error.message); } else { alert("✅ Comentário enviado!"); formComentario.reset(); carregarDados(); }
});

document.addEventListener("click", async e => {
  if (!e.target.matches('[data-id]')) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { alert("⚠️ Apenas admin."); return; }

  const id = Number(e.target.dataset.id);
  const tipo = e.target.dataset.tipo;

  if (confirm("🗑️ Excluir?")) {
    const tabela = { noticia: 'noticias', comentario: 'comentarios', evento: 'eventos' }[tipo];
    if (tabela) { await supabase.from(tabela).delete().eq('id', id); carregarDados(); }
  }
});

[btnLimparNoticia, btnLimparComentario, btnCancelarEvento].forEach(btn => {
  btn?.addEventListener("click", function() {
    const form = this.closest("form");
    form?.reset();
    if (this.id === "btnLimparNoticia") previewImagem.innerHTML = "";
  });
});

window.addEventListener("scroll", () => {
  botaoVoltarTopo.classList.toggle("visivel", window.pageYOffset > 300);
});

botaoVoltarTopo.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: "smooth" }); });

document.querySelectorAll(".menu-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector(link.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" });
  });
});

// ============================================
// INICIAR
// ============================================
async function iniciar() {
  await verificarLogin();
  await carregarDados();
}

iniciar();
