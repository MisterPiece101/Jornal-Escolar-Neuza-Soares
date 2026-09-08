// Configurações e constantes
const CONFIG = {
  CHAVE_NOTICIAS: "jornal_neuza_noticias",
  CHAVE_COMENTARIOS: "jornal_neuza_comentarios",
  CHAVE_EVENTOS: "jornal_neuza_eventos",
  CHAVE_LOGIN: "jornal_neuza_login",
  CHAVE_USUARIO: "jornal_neuza_usuario",
  SENHA_GLOBAL: "#Jornal12Neuza2026@#",
  USUARIOS: {
    Gustavo: "#Jornal12Neuza2026@#",
    Lara: "#Jornal12Neuza2026@#",
    Sergio: "#Jornal12Neuza2026@#",
    Isabel: "#Jornal12Neuza2026@#"
  }
};

// Dados iniciais
let noticias = JSON.parse(localStorage.getItem(CONFIG.CHAVE_NOTICIAS)) || [
  {
    id: 1,
    titulo: "Alunos participam da Feira de Ciências",
    autor: "Equipe do Jornal Escolar",
    texto: "Estudantes apresentaram experiências e projetos desenvolvidos durante as aulas de ciências. O evento contou com a participação de todas as turmas do ensino fundamental.",
    imagem: "",
    data: "19/08/2026"
  },
  {
    id: 2,
    titulo: "Semana da Leitura terá atividades especiais",
    autor: "Coordenação escolar",
    texto: "A escola preparou rodas de conversa, apresentações teatrais e atividades interativas para incentivar o gosto pela leitura entre os estudantes.",
    imagem: "",
    data: "19/08/2026"
  }
];

let comentarios = JSON.parse(localStorage.getItem(CONFIG.CHAVE_COMENTARIOS)) || [];

let eventos = JSON.parse(localStorage.getItem(CONFIG.CHAVE_EVENTOS)) || [
  {
    id: 1,
    titulo: "Feira de Ciências",
    data: "30 de agosto de 2026",
    descricao: "Apresentação de experiências e projetos dos estudantes de ciências. Venha prestigiar o trabalho dos nossos alunos!"
  },
  {
    id: 2,
    titulo: "Gincana escolar",
    data: "12 de setembro de 2026",
    descricao: "Atividades esportivas, culturais e recreativas para toda a comunidade escolar. Participe!"
  },
  {
    id: 3,
    titulo: "Semana da Leitura",
    data: "20 de setembro de 2026",
    descricao: "Rodas de conversa, apresentações teatrais e diversas atividades para incentivar o hábito da leitura."
  }
];

// Elementos do DOM
const elementos = {
  forms: {
    noticia: document.getElementById("formNoticia"),
    comentario: document.getElementById("formComentario"),
    evento: document.getElementById("formEvento")
  },
  listas: {
    noticias: document.getElementById("listaNoticias"),
    comentarios: document.getElementById("listaComentarios"),
    eventos: document.getElementById("listaEventos")
  },
  vazios: {
    noticias: document.getElementById("semNoticias"),
    comentarios: document.getElementById("semComentarios"),
    eventos: document.getElementById("semEventos")
  },
  admin: {
    areaLogin: document.getElementById("areaLogin"),
    painelAdmin: document.getElementById("painelAdmin"),
    painelEventos: document.getElementById("painelEventos"),
    login: document.getElementById("loginAdmin"),
    senha: document.getElementById("senhaAdmin"),
    btnEntrar: document.getElementById("btnEntrar"),
    btnSair: document.getElementById("btnSair"),
    msgLogin: document.getElementById("msgLogin"),
    usuario: document.getElementById("usuarioConectado"),
    btnMostrarSenha: document.getElementById("btnMostrarSenha"),
    imagem: document.getElementById("imagem"),
    preview: document.getElementById("previewImagem"),
    btnLimparNoticia: document.getElementById("btnLimparNoticia"),
    btnLimparComentario: document.getElementById("btnLimparComentario"),
    btnCancelarEvento: document.getElementById("btnCancelarEvento")
  },
  stats: {
    noticias: document.getElementById("totalNoticias"),
    eventos: document.getElementById("totalEventos"),
    comentarios: document.getElementById("totalComentarios")
  },
  btnVoltarTopo: document.getElementById("btnVoltarTopo"),
  menuLinks: document.querySelectorAll(".menu-link")
};

// Funções utilitárias
function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function salvarDados() {
  localStorage.setItem(CONFIG.CHAVE_NOTICIAS, JSON.stringify(noticias));
  localStorage.setItem(CONFIG.CHAVE_COMENTARIOS, JSON.stringify(comentarios));
  localStorage.setItem(CONFIG.CHAVE_EVENTOS, JSON.stringify(eventos));
  atualizarEstatisticas();
}

function estaLogado() {
  return sessionStorage.getItem(CONFIG.CHAVE_LOGIN) === "true";
}

function atualizarEstatisticas() {
  elementos.stats.noticias.textContent = noticias.length;
  elementos.stats.eventos.textContent = eventos.length;
  elementos.stats.comentarios.textContent = comentarios.length;
}

// Renderização
function renderizarNoticias() {
  elementos.listas.noticias.innerHTML = "";

  if (noticias.length === 0) {
    elementos.vazios.noticias.style.display = "block";
    return;
  }

  elementos.vazios.noticias.style.display = "none";

  noticias.forEach(noticia => {
    const card = document.createElement("article");
    card.className = "card-noticia";

    const imagem = noticia.imagem 
      ? `<img src="${noticia.imagem}" alt="${escaparHTML(noticia.titulo)}" loading="lazy">` 
      : "";

    const btnExcluir = estaLogado()
      ? `<button class="botao botao-perigo" style="position:absolute;top:15px;right:15px;padding:8px 12px;font-size:12px;" data-id="${noticia.id}" data-tipo="noticia">🗑️ Excluir</button>`
      : "";

    card.innerHTML = `
      ${btnExcluir}
      <h3>${escaparHTML(noticia.titulo)}</h3>
      ${imagem}
      <p>${escaparHTML(noticia.texto)}</p>
      <div class="meta-noticia">
        📝 <strong>${escaparHTML(noticia.autor)}</strong> • 📅 ${escaparHTML(noticia.data)}
      </div>
    `;

    elementos.listas.noticias.appendChild(card);
  });
}

function renderizarComentarios() {
  elementos.listas.comentarios.innerHTML = "";

  if (comentarios.length === 0) {
    elementos.vazios.comentarios.style.display = "block";
    return;
  }

  elementos.vazios.comentarios.style.display = "none";

  comentarios.forEach(comentario => {
    const card = document.createElement("article");
    card.className = "card-comentario";

    const btnExcluir = estaLogado()
      ? `<button class="botao botao-perigo" style="position:absolute;top:15px;right:15px;padding:8px 12px;font-size:12px;" data-id="${comentario.id}" data-tipo="comentario">🗑️ Excluir</button>`
      : "";

    card.innerHTML = `
      ${btnExcluir}
      <strong>👤 ${escaparHTML(comentario.nome)}</strong>
      <p>${escaparHTML(comentario.texto)}</p>
      <small>📅 ${escaparHTML(comentario.data)}</small>
    `;

    elementos.listas.comentarios.appendChild(card);
  });
}

function renderizarEventos() {
  elementos.listas.eventos.innerHTML = "";

  if (eventos.length === 0) {
    elementos.vazios.eventos.style.display = "block";
    return;
  }

  elementos.vazios.eventos.style.display = "none";

  eventos.forEach(evento => {
    const card = document.createElement("article");
    card.className = "card-evento";

    const btnExcluir = estaLogado()
      ? `<button class="botao botao-perigo" style="position:absolute;top:15px;right:15px;padding:8px 12px;font-size:12px;" data-id="${evento.id}" data-tipo="evento">🗑️ Excluir</button>`
      : "";

    card.innerHTML = `
      ${btnExcluir}
      <h3>📅 ${escaparHTML(evento.titulo)}</h3>
      <p><strong>📆 Data:</strong> ${escaparHTML(evento.data)}</p>
      <p>${escaparHTML(evento.descricao)}</p>
    `;

    elementos.listas.eventos.appendChild(card);
  });
}

function atualizarInterface() {
  const logado = estaLogado();

  elementos.admin.areaLogin.classList.toggle("oculto", logado);
  elementos.admin.painelAdmin.classList.toggle("oculto", !logado);
  elementos.admin.painelEventos.classList.toggle("oculto", !logado);

  if (logado) {
    const usuario = sessionStorage.getItem(CONFIG.CHAVE_USUARIO);
    const nomes = { gustavo: "Gustavo", lara: "Lara", sergio: "Sergio", isabel: "Isabel" };
    elementos.admin.usuario.textContent = nomes[usuario] || "";
  } else {
    elementos.admin.usuario.textContent = "";
  }

  renderizarNoticias();
  renderizarComentarios();
  renderizarEventos();
  atualizarEstatisticas();
}

// Event Listeners
elementos.admin.btnMostrarSenha.addEventListener("click", () => {
  const tipo = elementos.admin.senha.type;
  elementos.admin.senha.type = tipo === "password" ? "text" : "password";
  elementos.admin.btnMostrarSenha.textContent = tipo === "password" ? "🙈" : "👁️";
});

[elementos.admin.btnLimparNoticia, elementos.admin.btnLimparComentario, elementos.admin.btnCancelarEvento].forEach(btn => {
  btn?.addEventListener("click", function() {
    const form = this.closest("form");
    form?.reset();
    if (this.id === "btnLimparNoticia") {
      elementos.admin.preview.innerHTML = "";
    }
  });
});

elementos.admin.imagem.addEventListener("change", function() {
  const arquivo = this.files[0];

  if (!arquivo) {
    elementos.admin.preview.innerHTML = "";
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
    elementos.admin.preview.innerHTML = `
      <p><strong>📷 Pré-visualização:</strong></p>
      <img src="${e.target.result}" alt="Pré-visualização">
    `;
  };
  leitor.readAsDataURL(arquivo);
});

elementos.admin.btnEntrar.addEventListener("click", () => {
  const login = elementos.admin.login.value.trim().toLowerCase();
  const senha = elementos.admin.senha.value.trim();
  const usuarios = {
    gustavo: CONFIG.SENHA_GLOBAL,
    lara: CONFIG.SENHA_GLOBAL,
    sergio: CONFIG.SENHA_GLOBAL,
    isabel: CONFIG.SENHA_GLOBAL
  };

  if (usuarios[login] && senha === usuarios[login]) {
    sessionStorage.setItem(CONFIG.CHAVE_LOGIN, "true");
    sessionStorage.setItem(CONFIG.CHAVE_USUARIO, login);
    
    elementos.admin.login.value = "";
    elementos.admin.senha.value = "";
    elementos.admin.btnMostrarSenha.textContent = "👁️";
    elementos.admin.msgLogin.textContent = "✅ Login realizado com sucesso!";
    elementos.admin.msgLogin.style.cssText = "color: var(--cor-sucesso); background: #d4edda;";

    setTimeout(() => {
      elementos.admin.msgLogin.textContent = "";
      atualizarInterface();
    }, 1500);
  } else {
    elementos.admin.msgLogin.textContent = "❌ Login ou senha incorretos.";
    elementos.admin.msgLogin.style.cssText = "color: var(--cor-perigo); background: #ffebee;";
  }
});

elementos.admin.senha.addEventListener("keydown", e => {
  if (e.key === "Enter") elementos.admin.btnEntrar.click();
});

elementos.admin.btnSair.addEventListener("click", () => {
  if (confirm("🚪 Deseja realmente sair?")) {
    sessionStorage.removeItem(CONFIG.CHAVE_LOGIN);
    sessionStorage.removeItem(CONFIG.CHAVE_USUARIO);
    elementos.admin.msgLogin.textContent = "👋 Você saiu da área administrativa.";
    elementos.admin.msgLogin.style.cssText = "color: var(--cor-cinza); background: var(--cor-fundo);";
    atualizarInterface();
  }
});

elementos.forms.noticia.addEventListener("submit", e => {
  e.preventDefault();

  if (!estaLogado()) {
    alert("⚠️ Entre como administrador para publicar.");
    return;
  }

  const titulo = document.getElementById("titulo").value.trim();
  const autor = document.getElementById("autor").value.trim();
  const texto = document.getElementById("texto").value.trim();
  const arquivo = elementos.admin.imagem.files[0];

  if (!titulo || !autor || !texto) {
    alert("⚠️ Preencha todos os campos obrigatórios.");
    return;
  }

  function publicar(imagemBase64) {
    noticias.unshift({
      id: Date.now(),
      titulo,
      autor,
      texto,
      imagem: imagemBase64,
      data: new Date().toLocaleDateString("pt-BR")
    });

    salvarDados();
    atualizarInterface();
    e.target.reset();
    elementos.admin.preview.innerHTML = "";
    alert("✅ Notícia publicada com sucesso!");
    window.location.hash = "noticias";
  }

  if (arquivo) {
    const leitor = new FileReader();
    leitor.onload = ev => publicar(ev.target.result);
    leitor.readAsDataURL(arquivo);
  } else {
    publicar("");
  }
});

elementos.forms.evento.addEventListener("submit", e => {
  e.preventDefault();

  if (!estaLogado()) {
    alert("⚠️ Somente administradores podem adicionar eventos.");
    return;
  }

  const titulo = document.getElementById("tituloEvento").value.trim();
  const data = document.getElementById("dataEvento").value.trim();
  const descricao = document.getElementById("descricaoEvento").value.trim();

  if (!titulo || !data || !descricao) {
    alert("⚠️ Preencha todos os campos.");
    return;
  }

  eventos.push({
    id: Date.now(),
    titulo,
    data,
    descricao
  });

  salvarDados();
  atualizarInterface();
  e.target.reset();
  alert("✅ Evento cadastrado com sucesso!");
});

elementos.forms.comentario.addEventListener("submit", e => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const texto = document.getElementById("comentario").value.trim();

  if (!nome || !texto) {
    alert("⚠️ Preencha nome e comentário.");
    return;
  }

  comentarios.unshift({
    id: Date.now(),
    nome,
    texto,
    data: new Date().toLocaleDateString("pt-BR")
  });

  salvarDados();
  atualizarInterface();
  e.target.reset();
  alert("💬 Comentário enviado com sucesso!");
});

document.addEventListener("click", e => {
  if (!e.target.matches('[data-id]')) return;
  if (!estaLogado()) {
    alert("⚠️ Somente administradores podem excluir.");
    return;
  }

  const id = Number(e.target.dataset.id);
  const tipo = e.target.dataset.tipo;

  if (confirm("🗑️ Tem certeza que deseja excluir?")) {
    if (tipo === "noticia") noticias = noticias.filter(n => n.id !== id);
    if (tipo === "comentario") comentarios = comentarios.filter(c => c.id !== id);
    if (tipo === "evento") eventos = eventos.filter(ev => ev.id !== id);
    
    salvarDados();
    atualizarInterface();
  }
});

window.addEventListener("scroll", () => {
  elementos.btnVoltarTopo.classList.toggle("visivel", window.pageYOffset > 300);
});

elementos.btnVoltarTopo.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

elementos.menuLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const alvo = document.querySelector(link.getAttribute("href"));
    alvo?.scrollIntoView({ behavior: "smooth" });
  });
});

// Inicialização
atualizarInterface();