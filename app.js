let SERVICES = [
  [
    "Alongamento Mold F1",
    135,
    "Alongamento construído com molde F1, estrutura personalizada e acabamento elegante.",
    [
      "imagens/mold-f1-1.jpeg",
      "imagens/mold-f1-2.jpeg"
    ],
    [
      "imagens/mold-f1-1.jpeg",
      "imagens/mold-f1-2.jpeg"
    ]
  ],

  [
    "Alongamento Fibra de Vidro",
    140,
    "Alongamento com fibra de vidro, resultado delicado, estruturado e personalizado.",
    [
      "imagens/fibra-1.jpeg",
      "imagens/fibra-2.jpeg",
      "imagens/fibra-nova.jpeg"
    ],
    [
      "imagens/fibra-1.jpeg",
      "imagens/fibra-2.jpeg",
      "imagens/fibra-nova.jpeg"
    ]
  ],

  [
    "Banho de Gel",
    80,
    "Aplicação de gel sobre a unha natural para reforçar estrutura e acabamento.",
    [
      "imagens/banho-gel-1.jpeg",
      "imagens/banho-gel-2.jpeg"
    ],
    [
      "imagens/banho-gel-1.jpeg",
      "imagens/banho-gel-2.jpeg"
    ]
  ],

  [
    "Postiça Realista",
    35,
    "Visual natural e acabamento delicado, uma opção prática para suas unhas.",
    [
      "imagens/postica-1.jpeg",
      "imagens/postica-2.jpeg",
      "imagens/postica-3.jpeg",
      "imagens/postica-nova.jpeg"
    ],
    [
      "imagens/postica-1.jpeg",
      "imagens/postica-2.jpeg",
      "imagens/postica-3.jpeg",
      "imagens/postica-nova.jpeg"
    ]
  ],

  [
    "Soft Gel",
    40,
    "Alongamento com tips de gel, leve, uniforme e elegante.",
    [
      "imagens/soft-gel-1.jpeg",
      "imagens/soft-gel-2.jpeg"
    ],
    [
      "imagens/soft-gel-1.jpeg",
      "imagens/soft-gel-2.jpeg"
    ]
  ],

  [
    "Manicure",
    24,
    "Cuidado das unhas das mãos, preparação, acabamento e esmaltação conforme escolha.",
    [
      "imagens/manicure-1.jpeg",
      "imagens/manicure-2.jpeg"
    ],
    []
  ],

  [
    "Pedicure",
    24,
    "Cuidado das unhas dos pés, preparação, acabamento e esmaltação conforme escolha.",
    [
      "imagens/pedicure-1.jpeg",
      "imagens/pedicure-nova.jpeg"
    ],
    [
      "imagens/pedicure-1.jpeg"
    ]
  ],

  [
    "Spa dos Pés",
    50,
    "Cuidado e relaxamento para os pés, com pedicure incluso.",
    [
      "imagens/spa-pes-novo.jpeg",
      "imagens/spa-pes-2.jpeg"
    ],
    []
  ],

  [
    "Plástica dos Pés",
    65,
    "Cuidado especial para melhorar a aparência e a sensação de maciez dos pés.",
    [
      "imagens/plastica-pes-1.jpeg",
      "imagens/plastica-pes-2.jpeg"
    ],
    [
      "imagens/plastica-pes-1.jpeg",
      "imagens/plastica-pes-2.jpeg"
    ]
  ]
];

const grid = document.getElementById("servicesGrid");
const galleryGrid = document.getElementById("galleryGrid");
let PROMOCOES_ATIVAS = [];

const money = value =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

function renderServices() {
  if (!grid) return;

  grid.innerHTML = SERVICES.map((service, index) => {
    const [name, price, description, images] = service;
    const promo = PROMOCOES_ATIVAS.find(p =>
      String(p.servico || "").trim().toLowerCase() === String(name).trim().toLowerCase()
    );
    const promoPrice = promo && promo.preco_promocional != null ? Number(promo.preco_promocional) : null;
    const temPromocao = Number.isFinite(promoPrice) && promoPrice >= 0 && promoPrice < Number(price);

    return `
      <article class="service-card">
        ${
          images.length
            ? `
              <div class="service-images">
                ${images.map(image => `
                  <img src="${image}" alt="${name}" loading="lazy">
                `).join("")}
              </div>
            `
            : ""
        }

        <div class="service-content">
          <h3>${name}</h3>
          <p>${description}</p>

          <div class="service-bottom">
            <div class="service-price-wrap">
              ${temPromocao
                ? `<del style="display:block;font-size:16px;line-height:1.1;opacity:.7;">${money(Number(price))}</del>
                   <strong style="display:block;margin-top:3px;">${money(promoPrice)}</strong>`
                : `<strong>${money(Number(price))}</strong>`}
            </div>

            <button class="primary small" onclick="openBooking(${index})">Agendar</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderGallery() {
  if (!galleryGrid) return;

  const all = SERVICES.flatMap(service => {
    const name = service[0];
    const galleryImages = service[4] || [];

    return galleryImages.map(image => ({
      image,
      name
    }));
  });

  galleryGrid.innerHTML = all
    .map(
      item => `
        <figure>
          <img
            src="${item.image}"
            alt="${item.name}"
            loading="lazy"
          >
          <figcaption>${item.name}</figcaption>
        </figure>
      `
    )
    .join("");
}

function showModal(html) {
  const content = document.getElementById("modalContent");
  const modal = document.getElementById("modal");

  if (!content || !modal) return;

  content.innerHTML = html;
  modal.classList.add("show");
}

function closeModal() {
  document
    .getElementById("modal")
    ?.classList.remove("show");
}

async function getCurrentClient() {
  const client = adminClient();
  const { data: sessionData } = await client.auth.getSession();
  const user = sessionData?.session?.user;
  if (!user) return { client, user: null, cliente: null };
  const { data: cliente, error } = await client
    .from("Clientes")
    .select("id, nome, whatsapp, email, is_admin")
    .eq("user_id", user.id)
    .maybeSingle();
  return { client, user, cliente, error };
}

async function carregarHorariosDisponiveis() {
  const date = document.getElementById("bookingDate")?.value;
  const select = document.getElementById("bookingTime");
  const status = document.getElementById("bookingTimeStatus");
  if (!select) return;

  select.innerHTML = `<option value="">Selecione uma data primeiro</option>`;
  select.disabled = true;
  if (status) status.textContent = "";

  if (!date) return;

  const client = adminClient();
  const { data: horarios, error } = await client
    .from("horarios")
    .select("horario")
    .eq("data", date)
    .eq("disponivel", true)
    .order("horario");

  if (error) {
    console.error(error);
    select.innerHTML = `<option value="">Não foi possível carregar os horários</option>`;
    return;
  }

  const { data: agendados, error: agError } = await client
    .from("agendamentos")
    .select("horario")
    .eq("data", date)
    .in("status", ["confirmado", "agendado", "pendente"]);

  if (agError) console.error(agError);

  const ocupados = new Set((agendados || []).map(item => item.horario));
  const disponiveis = (horarios || []).filter(item => !ocupados.has(item.horario));

  if (!disponiveis.length) {
    select.innerHTML = `<option value="">Nenhum horário disponível nesta data</option>`;
    if (status) status.textContent = "Escolha outra data ou aguarde novos horários.";
    return;
  }

  select.disabled = false;
  select.innerHTML =
    `<option value="">Escolha um horário</option>` +
    disponiveis.map(item => `<option value="${item.horario}">${item.horario}</option>`).join("");
}

async function openBooking(index = null) {
  const { user } = await getCurrentClient();

  if (!user) {
    showModal(`
      <h2>Área VIP 💗</h2>
      <p class="muted">Para agendar seu horário pelo site, primeiro entre ou crie sua conta VIP.</p>
      <button class="primary full" onclick="openVipModal()">ENTRAR NA ÁREA VIP</button>
      <button class="secondary full" onclick="closeModal()">Voltar</button>
    `);
    return;
  }

  const hoje = new Date().toISOString().split("T")[0];

  showModal(`
    <h2>Agendar horário</h2>
    <p class="muted">Escolha o serviço, a data e um dos horários liberados pela Débora.</p>

    <label>
      Serviço
      <select id="bookingService">
        ${SERVICES.map((service, number) => `
          <option value="${service[0]}" ${number === index ? "selected" : ""}>
            ${service[0]} — ${money(service[1])}
          </option>
        `).join("")}
      </select>
    </label>

    <label>
      Data
      <input id="bookingDate" type="date" min="${hoje}" onchange="carregarHorariosDisponiveis()">
    </label>

    <label>
      Horário
      <select id="bookingTime" disabled>
        <option value="">Selecione uma data primeiro</option>
      </select>
    </label>

    <p id="bookingTimeStatus" class="muted"></p>

    <button class="primary full" onclick="confirmarAgendamento()">
      AGENDAR HORÁRIO
    </button>

    <button class="secondary full" onclick="abrirWhatsAppAgendamento()">
      CONTINUAR PELO WHATSAPP
    </button>
  `);
}

async function confirmarAgendamento() {
  const service = document.getElementById("bookingService")?.value;
  const date = document.getElementById("bookingDate")?.value;
  const time = document.getElementById("bookingTime")?.value;

  if (!service || !date || !time) {
    alert("Escolha o serviço, a data e um horário disponível.");
    return;
  }

  const { client, cliente } = await getCurrentClient();

  if (!cliente) {
    alert("Entre na sua Área VIP para realizar o agendamento.");
    return;
  }

  const { error } = await client
    .from("agendamentos")
    .insert({
      cliente_id: cliente.id,
      servico: service,
      data: date,
      horario: time,
      status: "confirmado"
    });

  if (error) {
    console.error(error);
    if (error.code === "23505") {
      alert("Esse horário acabou de ser reservado por outra cliente. Escolha outro horário.");
      await carregarHorariosDisponiveis();
      return;
    }
    alert("Não foi possível realizar o agendamento. Tente novamente.");
    return;
  }

  closeModal();
  alert(`Agendamento realizado com sucesso! 💗\n\n${service}\n${date.split("-").reverse().join("/")}\n${time}`);
}

function abrirWhatsAppAgendamento() {
  const service = document.getElementById("bookingService")?.value;
  const date = document.getElementById("bookingDate")?.value;
  const time = document.getElementById("bookingTime")?.value;

  if (!service || !date || !time) {
    alert("Escolha o serviço, a data e um horário antes de continuar pelo WhatsApp.");
    return;
  }

  const message =
    `Olá, Débora! Gostaria de agendar:\n${service}\nData: ${date}\nHorário: ${time}`;

  window.open(
    `https://wa.me/5531972084333?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}

/* Mantém compatibilidade com qualquer chamada antiga. */
window.sendBooking = confirmarAgendamento;

function openVipModal() {
  showModal(`
    <h2>Área VIP</h2>
    <p class="muted">Entre na sua conta ou crie seu cadastro VIP.</p>

    <h3>Entrar</h3>
    <label>
      E-mail
      <input id="vipEmail" type="email" placeholder="Seu e-mail" autocomplete="email">
    </label>

    <label>
      Senha
      <input id="vipPassword" type="password" placeholder="Sua senha" autocomplete="current-password">
    </label>

    <button class="primary full" onclick="vipLogin()">ENTRAR NA ÁREA VIP</button>

    <hr>

    <h3>Criar minha conta VIP</h3>
    <label>
      Nome
      <input id="vipNome" type="text" placeholder="Seu nome" autocomplete="name">
    </label>

    <label>
      WhatsApp
      <input id="vipWhatsApp" type="tel" placeholder="Seu WhatsApp" autocomplete="tel">
    </label>

    <label>
      E-mail
      <input id="vipEmailCadastro" type="email" placeholder="Seu e-mail" autocomplete="email">
    </label>

    <label>
      Senha
      <input id="vipPasswordCadastro" type="password" placeholder="Crie uma senha" autocomplete="new-password">
    </label>

    <button class="primary full" onclick="vipCadastro()">CRIAR CONTA VIP</button>
  `);
}

window.openVipModal = openVipModal;


document
  .getElementById("modal")
  ?.addEventListener("click", event => {
    if (event.target.id === "modal") {
      closeModal();
    }
  });

document.getElementById("loginBtn")?.addEventListener("click", event => {
  event.preventDefault();
  event.stopPropagation();
  openVipModal();
}, true);

document.getElementById("loginBtn")?.addEventListener("click", event => {
  event.preventDefault();
  event.stopPropagation();
  openVipModal();
});

window.vipLogin = async function () {
  const email = document.getElementById("vipEmail")?.value.trim();
  const password = document.getElementById("vipPassword")?.value;

  if (!email || !password) {
    alert("Preencha seu e-mail e sua senha.");
    return;
  }

  const client = adminClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    alert("E-mail ou senha incorretos.");
    return;
  }

  const user = data.user;
  let { data: cliente, error: clienteError } = await client
    .from("Clientes")
    .select("id, nome, whatsapp, email, is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (clienteError) {
    console.error(clienteError);
    alert("Não foi possível carregar seus dados.");
    return;
  }

  if (!cliente) {
    const nome = email.split("@")[0];
    const { data: novoCliente, error: novoClienteError } = await client
      .from("Clientes")
      .insert({
        id: Date.now(),
        nome,
        whatsapp: "",
        email,
        user_id: user.id
      })
      .select("id, nome, whatsapp, email, is_admin")
      .single();

    if (novoClienteError) {
      console.error(novoClienteError);
      alert("Entrou na conta, mas não foi possível criar seu cadastro.");
      return;
    }
    cliente = novoCliente;
  }

  await carregarDadosVIP(cliente);

  closeModal();

  if (cliente.is_admin) {
    await window.abrirAreaDebora();
  } else {
    document.querySelector("#vip")?.scrollIntoView({ behavior: "smooth" });
  }

  alert(`Bem-vinda, ${cliente.nome || "Cliente VIP"}! 💗`);
};

async function carregarDadosVIP(cliente) {
  const client = adminClient();

  let { data: vip, error: vipError } = await client
    .from("vip_fidelidade")
    .select("pontos, beneficio_usado")
    .eq("cliente_id", cliente.id)
    .maybeSingle();

  if (vipError) console.error(vipError);

  if (!vip) {
    const { data: novoVip, error: novoVipError } = await client
      .from("vip_fidelidade")
      .insert({
        cliente_id: cliente.id,
        pontos: 0,
        beneficio_usado: false
      })
      .select("pontos, beneficio_usado")
      .single();

    if (!novoVipError) vip = novoVip;
  }

  const welcomeTitle = document.getElementById("vipWelcomeTitle");
  if (welcomeTitle) {
    welcomeTitle.textContent = `Olá, ${cliente.nome || "Cliente VIP"}! 💝`;
  }

  const pontos = Number(vip?.pontos || 0);
  const vipStats = document.querySelectorAll(".vip-stat");
  if (vipStats[1]) {
    const pointsText = vipStats[1].querySelector("strong");
    if (pointsText) pointsText.textContent = `${pontos} pts`;
  }

  atualizarCartaoVIP(pontos, vip);
}

window.vipCadastro = async function () {
  const nome = document.getElementById("vipNome")?.value.trim();
  const whatsapp = document.getElementById("vipWhatsApp")?.value.trim();
  const email = document.getElementById("vipEmailCadastro")?.value.trim();
  const password = document.getElementById("vipPasswordCadastro")?.value;

  if (!nome || !whatsapp || !email || !password) {
    alert("Preencha todos os campos.");
    return;
  }

  if (password.length < 6) {
    alert("A senha precisa ter pelo menos 6 caracteres.");
    return;
  }

  const client = adminClient();
  const { data, error } = await client.auth.signUp({ email, password });

  if (error) {
    alert(error.message);
    return;
  }

  if (data.user && data.session) {
    const { data: novoCliente, error: clienteError } = await client
      .from("Clientes")
      .insert({
        id: Date.now(),
        nome,
        whatsapp,
        email,
        user_id: data.user.id
      })
      .select("id, nome, whatsapp, email, is_admin")
      .single();

    if (clienteError) {
      console.error(clienteError);
      alert("A conta foi criada, mas não consegui finalizar seu cadastro. Tente entrar novamente.");
      return;
    }

    await client.from("vip_fidelidade").upsert({
      cliente_id: novoCliente.id,
      pontos: 0,
      beneficio_usado: false
    }, { onConflict: "cliente_id" });
  }

  alert("Cadastro realizado com sucesso! 💗");
  closeModal();

  if (data.session) {
    setTimeout(() => window.vipLogin?.(), 100);
  }
};

async function restaurarSessaoVIP() {
  const { user, cliente } = await getCurrentClient();
  if (!user || !cliente) return;

  await carregarDadosVIP(cliente);

  const welcomeTitle = document.getElementById("vipWelcomeTitle");
  if (welcomeTitle) {
    welcomeTitle.textContent = `Olá, ${cliente.nome || "Cliente VIP"}! 💝`;
  }
}


document
  .getElementById("menuBtn")
  ?.addEventListener("click", () => {
    document
      .getElementById("nav")
      ?.classList.toggle("open");
  });

renderServices();
renderGallery();
// ===== ÁREA DA DÉBORA =====

function adminClient() {
  return window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.publishableKey
  );
}

async function verificarAdmin() {
  const client = adminClient();
  const { data: sessionData } = await client.auth.getSession();
  const user = sessionData?.session?.user;
  if (!user) return { ok: false, message: "Entre primeiro na sua conta VIP." };

  const { data, error } = await client
    .from("Clientes")
    .select("id, nome, whatsapp, email, is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return { ok: false, message: "Não foi possível verificar seu acesso." };
  }
  if (!data?.is_admin) return { ok: false, message: "Esta área é exclusiva da Débora." };
  return { ok: true, cliente: data };
}

window.abrirAreaDebora = async function () {
  const resultado = await verificarAdmin();
  if (!resultado.ok) {
    alert(resultado.message);
    return;
  }

  const area = document.getElementById("areaDebora");
  if (area) {
    area.style.display = "block";
    area.scrollIntoView({ behavior: "smooth" });
  }
  window.abrirAdminAba("horarios");
};

function adminBotoes() {
  return `
    <div class="admin-tabs" style="display:flex;flex-wrap:wrap;gap:8px;margin:18px 0;">
      <button class="primary small" onclick="abrirAdminAba('horarios')">📅 Horários</button>
      <button class="primary small" onclick="abrirAdminAba('precos')">💰 Preços</button>
      <button class="primary small" onclick="abrirAdminAba('fotos')">📸 Fotos</button>
      <button class="primary small" onclick="abrirAdminAba('promocoes')">🎀 Promoções</button>
      <button class="primary small" onclick="abrirAdminAba('vip')">⭐ VIP Fidelidade</button>
      <button class="primary small" onclick="abrirAdminAba('agendamentos')">📋 Agendamentos</button>
      <button class="primary small" data-admin-aba="avisos" onclick="abrirAdminAba('avisos')">📢 Avisos e Novidades</button>
    </div>
  `;
}

async function carregarServicosAdmin() {
  const client = adminClient();
  const { data, error } = await client.from("servicos").select("id,nome,preco,descricao,ativo").order("nome");
  if (error) throw error;
  return data || [];
}

window.adminSalvarPreco = async function (id, nome) {
  const input = document.getElementById(`preco-${id}`);
  const preco = Number(String(input?.value || "").replace(",", "."));
  if (!Number.isFinite(preco) || preco < 0) return alert("Digite um preço válido.");
  const client = adminClient();
  const payload = { nome, preco, descricao: SERVICES.find(s => s[0] === nome)?.[2] || "", ativo: true };
  const { error } = id
    ? await client.from("servicos").update({ preco }).eq("id", id)
    : await client.from("servicos").upsert(payload, { onConflict: "nome" });
  if (error) return alert("Não foi possível salvar o preço.");
  const service = SERVICES.find(s => s[0] === nome);
  if (service) service[1] = preco;
  alert("Preço salvo com sucesso! 💗");
  renderServices();
};

async function renderAdminPrecos() {
  const conteudo = document.getElementById("adminConteudo");
  if (!conteudo) return;
  conteudo.innerHTML = `<p>Carregando preços...</p>`;
  try {
    const rows = await carregarServicosAdmin();
    const map = new Map(rows.map(r => [r.nome, r]));
    conteudo.innerHTML = `
      <h3>💰 Preços</h3>
      <p>Altere o valor e clique em salvar. O preço também fica atualizado nesta página.</p>
      <div style="display:grid;gap:12px;">
        ${SERVICES.map(s => {
          const row = map.get(s[0]);
          const id = row?.id || "novo";
          return `<div style="padding:14px;border:1px solid #ead7df;border-radius:14px;">
            <strong>${s[0]}</strong><br>
            <input id="preco-${id}" type="number" step="0.01" value="${row?.preco ?? s[1]}" style="max-width:160px;margin:8px 0;">
            <button class="primary small" onclick="adminSalvarPreco(${row?.id ?? 'null'}, '${s[0].replace(/'/g,"\\'")}')">Salvar</button>
          </div>`;
        }).join("")}
      </div>`;
  } catch (e) {
    console.error(e); conteudo.innerHTML = `<p>Não foi possível carregar os preços.</p>`;
  }
}

window.adminAdicionarHorario = async function () {
  const data = document.getElementById("adminDataHorario")?.value;
  const horario = document.getElementById("adminHoraHorario")?.value;
  if (!data || !horario) return alert("Escolha a data e o horário.");
  const client = adminClient();
  const { error } = await client.from("horarios").upsert({ data, horario, disponivel: true }, { onConflict: "data,horario" });
  if (error) return alert("Não foi possível salvar esse horário.");
  alert("Horário adicionado! 💗");
  renderAdminHorarios();
};

window.adminAlterarHorario = async function (id, disponivel) {
  const client = adminClient();
  const { error } = await client.from("horarios").update({ disponivel: !disponivel }).eq("id", id);
  if (error) return alert("Não foi possível alterar o horário.");
  renderAdminHorarios();
};

async function renderAdminHorarios() {
  const conteudo = document.getElementById("adminConteudo");
  if (!conteudo) return;
  conteudo.innerHTML = `<h3>📅 Horários</h3>
    <p>Cadastre os horários que ficarão disponíveis para suas clientes.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:end;">
      <label>Data<input id="adminDataHorario" type="date"></label>
      <label>Horário<input id="adminHoraHorario" type="time" min="07:00" max="19:00"></label>
      <button class="primary small" onclick="adminAdicionarHorario()">Adicionar</button>
    </div>
    <div id="listaHorariosAdmin" style="margin-top:18px">Carregando...</div>`;
  const client = adminClient();
  const { data, error } = await client.from("horarios").select("id,data,horario,disponivel").order("data").order("horario");
  if (error) { document.getElementById("listaHorariosAdmin").textContent = "Não foi possível carregar os horários."; return; }
  document.getElementById("listaHorariosAdmin").innerHTML = (data || []).map(r => `
    <div style="display:flex;justify-content:space-between;gap:10px;padding:10px;border-bottom:1px solid #eee;">
      <span>${r.data} — ${String(r.horario).slice(0,5)} — ${r.disponivel ? "Disponível" : "Indisponível"}</span>
      <button class="primary small" onclick="adminAlterarHorario(${r.id}, ${r.disponivel})">${r.disponivel ? "Bloquear" : "Liberar"}</button>
    </div>`).join("") || "Nenhum horário cadastrado ainda.";
}

window.adminAdicionarFoto = async function () {
  const titulo = document.getElementById("adminFotoTitulo")?.value.trim() || "";
  const url = document.getElementById("adminFotoUrl")?.value.trim();
  const servico = document.getElementById("adminFotoServico")?.value || "";
  if (!url) return alert("Cole o endereço da foto.");
  const client = adminClient();
  const { error } = await client.from("galeria").insert({ titulo, imagem_url: url, servico, na_galeria: true, ativo: true });
  if (error) return alert("Não foi possível adicionar a foto.");
  alert("Foto adicionada! 💗");
  renderAdminFotos();
};

window.adminRemoverFoto = async function (id) {
  if (!confirm("Remover esta foto da galeria?")) return;
  const client = adminClient();
  const { error } = await client.from("galeria").update({ ativo: false, na_galeria: false }).eq("id", id);
  if (error) return alert("Não foi possível remover a foto.");
  renderAdminFotos();
};

async function renderAdminFotos() {
  const conteudo = document.getElementById("adminConteudo");
  if (!conteudo) return;
  conteudo.innerHTML = `<h3>📸 Fotos</h3>
    <p>Para adicionar uma foto, cole o link direto da imagem.</p>
    <input id="adminFotoTitulo" placeholder="Título da foto">
    <input id="adminFotoUrl" placeholder="Link da imagem">
    <select id="adminFotoServico"><option value="">Serviço</option>${SERVICES.map(s => `<option>${s[0]}</option>`).join("")}</select>
    <button class="primary small" onclick="adminAdicionarFoto()">Adicionar foto</button>
    <div id="listaFotosAdmin" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-top:18px">Carregando...</div>`;
  const client = adminClient();
  const { data, error } = await client.from("galeria").select("id,titulo,imagem_url,servico").eq("ativo", true).order("created_at", { ascending:false });
  if (error) { document.getElementById("listaFotosAdmin").textContent = "Não foi possível carregar as fotos."; return; }
  document.getElementById("listaFotosAdmin").innerHTML = (data || []).map(r => `
    <div style="border:1px solid #ead7df;border-radius:14px;padding:8px;">
      <img src="${r.imagem_url}" alt="${r.titulo || r.servico}" style="width:100%;height:130px;object-fit:cover;border-radius:10px;">
      <small>${r.titulo || r.servico || "Foto"}</small><br>
      <button class="primary small" onclick="adminRemoverFoto(${r.id})">Remover</button>
    </div>`).join("") || "Nenhuma foto cadastrada ainda.";
}

window.adminAdicionarPromocao = async function () {
  const servico = document.getElementById("promoServico")?.value || "";
  const preco = document.getElementById("promoPreco")?.value;
  const inicio = document.getElementById("promoInicio")?.value || null;
  const fim = document.getElementById("promoFim")?.value || null;
  if (!servico) return alert("Escolha o serviço que ficará em promoção.");
  if (preco === "" || !Number.isFinite(Number(preco))) return alert("Informe o valor promocional.");

  const servicoBase = SERVICES.find(s => s[0] === servico);
  const precoOriginal = Number(servicoBase?.[1] || 0);
  const precoPromocional = Number(preco);
  if (precoPromocional >= precoOriginal) {
    return alert(`O valor promocional deve ser menor que o preço original de ${money(precoOriginal)}.`);
  }

  const titulo = `Promoção — ${servico}`;
  const descricao = `De ${money(precoOriginal)} por ${money(precoPromocional)}`;
  const client = adminClient();
  const { error } = await client.from("promocoes").insert({
    titulo,
    descricao,
    servico,
    preco_promocional: precoPromocional,
    data_inicio: inicio,
    data_fim: fim,
    ativo: true
  });
  if (error) return alert("Não foi possível criar a promoção. Verifique se a coluna do serviço foi criada no Supabase.");
  alert("Promoção criada! 💗");
  renderAdminPromocoes();
  await carregarPromocoesPublicas();
};

window.adminDesativarPromocao = async function (id) {
  const client = adminClient();
  const { error } = await client.from("promocoes").update({ ativo:false }).eq("id", id);
  if (error) return alert("Não foi possível desativar a promoção.");
  renderAdminPromocoes();
  await carregarPromocoesPublicas();
};

async function renderAdminPromocoes() {
  const conteudo = document.getElementById("adminConteudo");
  if (!conteudo) return;
  conteudo.innerHTML = `<h3>🎀 Promoções</h3>
    <p>Escolha o serviço, informe o valor promocional e mantenha as datas como preferir.</p>
    <select id="promoServico">
      <option value="">Escolha o serviço</option>
      ${SERVICES.map(s => `<option value="${s[0]}">${s[0]} — ${money(Number(s[1]))}</option>`).join("")}
    </select>
    <input id="promoPreco" type="number" step="0.01" min="0" placeholder="Valor da promoção">
    <label>Início<input id="promoInicio" type="date"></label>
    <label>Fim<input id="promoFim" type="date"></label>
    <button class="primary small" onclick="adminAdicionarPromocao()">Criar promoção</button>
    <div id="listaPromosAdmin" style="margin-top:18px">Carregando...</div>`;

  const client = adminClient();
  const { data, error } = await client.from("promocoes")
    .select("id,titulo,descricao,servico,preco_promocional,data_inicio,data_fim,ativo")
    .order("id", {ascending:false});
  if (error) {
    document.getElementById("listaPromosAdmin").textContent = "Não foi possível carregar as promoções.";
    return;
  }
  document.getElementById("listaPromosAdmin").innerHTML = (data || []).map(r => `
    <div style="padding:12px;border-bottom:1px solid #eee;">
      <strong>${r.servico || r.titulo}</strong><br>
      ${r.servico ? `Preço original: ${money(Number(SERVICES.find(s => s[0] === r.servico)?.[1] || 0))}<br>` : ""}
      ${r.preco_promocional != null ? `Promoção: ${money(Number(r.preco_promocional))}<br>` : ""}
      ${r.data_inicio ? `Início: ${r.data_inicio}<br>` : ""}
      ${r.data_fim ? `Fim: ${r.data_fim}<br>` : ""}
      Status: ${r.ativo ? "Ativa" : "Inativa"}
      ${r.ativo ? `<button class="primary small" onclick="adminDesativarPromocao(${r.id})">Desativar</button>` : ""}
    </div>`).join("") || "Nenhuma promoção cadastrada.";
}

async function carregarPromocoesPublicas() {
  try {
    const client = adminClient();
    const hoje = new Date().toISOString().slice(0, 10);
    const { data, error } = await client.from("promocoes")
      .select("id,servico,preco_promocional,data_inicio,data_fim,ativo")
      .eq("ativo", true);
    if (error) {
      console.warn("Não foi possível carregar as promoções públicas.", error);
      PROMOCOES_ATIVAS = [];
      renderServices();
      return;
    }
    PROMOCOES_ATIVAS = (data || []).filter(p => {
      const inicioOk = !p.data_inicio || p.data_inicio <= hoje;
      const fimOk = !p.data_fim || p.data_fim >= hoje;
      return inicioOk && fimOk && p.servico && p.preco_promocional != null;
    });
    renderServices();
  } catch (e) {
    console.warn("Erro ao carregar promoções públicas.", e);
  }
}

window.adminSalvarPontos = async function (clienteId, vipId) {
  const input = document.getElementById(`pontos-${clienteId}`);
  const pontos = Number(input?.value);
  if (!Number.isInteger(pontos) || pontos < 0 || pontos > 10) return alert("Os pontos devem ser de 0 a 10.");
  const client = adminClient();
  let error;
  if (vipId) {
    ({ error } = await client.from("vip_fidelidade").update({ pontos, beneficio_usado: pontos === 0 }).eq("id", vipId));
  } else {
    ({ error } = await client.from("vip_fidelidade").insert({ cliente_id: clienteId, pontos, beneficio_usado:false }));
  }
  if (error) return alert("Não foi possível salvar os pontos.");
  alert("Pontos atualizados! ⭐");
  renderAdminVip();
};

async function renderAdminVip() {
  const conteudo = document.getElementById("adminConteudo");
  if (!conteudo) return;
  conteudo.innerHTML = `<h3>⭐ VIP Fidelidade</h3><p>Atualize os pontos de cada cliente. Máximo: 10 pontos.</p><div id="listaVipAdmin">Carregando...</div>`;
  const client = adminClient();
  const { data, error } = await client.from("Clientes").select("id,nome,whatsapp,email").order("nome");
  if (error) { document.getElementById("listaVipAdmin").textContent = "Não foi possível carregar as clientes."; return; }
  const ids = (data || []).map(x => x.id);
  let vips = [];
  if (ids.length) {
    const r = await client.from("vip_fidelidade").select("id,cliente_id,pontos").in("cliente_id", ids);
    vips = r.data || [];
  }
  const vm = new Map(vips.map(v => [v.cliente_id, v]));
  document.getElementById("listaVipAdmin").innerHTML = (data || []).map(c => {
    const v = vm.get(c.id);
    return `<div style="padding:12px;border-bottom:1px solid #eee;"><strong>${c.nome || "Cliente"}</strong><br><small>${c.whatsapp || ""} ${c.email ? "— "+c.email : ""}</small><br><input id="pontos-${c.id}" type="number" min="0" max="10" value="${v?.pontos ?? 0}" style="width:80px"><button class="primary small" onclick="adminSalvarPontos(${c.id}, ${v?.id ?? 'null'})">Salvar</button></div>`;
  }).join("") || "Nenhuma cliente cadastrada.";
}


window.adminAdicionarAviso = async function () {
  const titulo = document.getElementById("adminAvisoTitulo")?.value.trim();
  const mensagem = document.getElementById("adminAvisoMensagem")?.value.trim();
  if (!titulo || !mensagem) return alert("Preencha o título e a mensagem do aviso.");

  const client = adminClient();
  const { error } = await client.from("avisos_novidades").insert({
    titulo,
    mensagem,
    ativo: true
  });

  if (error) {
    console.error(error);
    return alert("Não foi possível publicar o aviso.");
  }

  alert("Aviso publicado com sucesso! 💗");
  renderAdminAvisos();
  carregarAvisosPublicos();
};

window.adminDesativarAviso = async function (id) {
  const client = adminClient();
  const { error } = await client.from("avisos_novidades").update({ ativo: false }).eq("id", id);
  if (error) return alert("Não foi possível desativar o aviso.");
  renderAdminAvisos();
  carregarAvisosPublicos();
};

window.adminExcluirAviso = async function (id) {
  if (!confirm("Excluir este aviso?")) return;
  const client = adminClient();
  const { error } = await client.from("avisos_novidades").delete().eq("id", id);
  if (error) return alert("Não foi possível excluir o aviso.");
  renderAdminAvisos();
  carregarAvisosPublicos();
};

async function renderAdminAvisos() {
  const conteudo = document.getElementById("adminConteudo");
  if (!conteudo) return;
  conteudo.innerHTML = `
    <h3>📢 Avisos e Novidades</h3>
    <p>Escreva aqui o que você quer mostrar para suas clientes na Área VIP.</p>
    <div style="display:grid;gap:10px;max-width:760px;">
      <input id="adminAvisoTitulo" type="text" placeholder="Título do aviso">
      <textarea id="adminAvisoMensagem" rows="5" placeholder="Escreva seu aviso ou novidade..."></textarea>
      <button class="primary small" onclick="adminAdicionarAviso()">📢 Publicar aviso</button>
    </div>
    <div id="listaAvisosAdmin" style="margin-top:18px">Carregando...</div>
  `;

  const client = adminClient();
  const { data, error } = await client
    .from("avisos_novidades")
    .select("id,titulo,mensagem,ativo,created_at")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    document.getElementById("listaAvisosAdmin").textContent = "Não foi possível carregar os avisos.";
    return;
  }

  document.getElementById("listaAvisosAdmin").innerHTML = (data || []).map(a => `
    <div style="padding:14px;border:1px solid #ead7df;border-radius:14px;margin-bottom:10px;">
      <strong>${escapeHtml(a.titulo)}</strong>
      <p style="white-space:pre-wrap;">${escapeHtml(a.mensagem)}</p>
      <small>Status: ${a.ativo ? "Ativo" : "Inativo"}</small>
      <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
        ${a.ativo ? `<button class="primary small" onclick="adminDesativarAviso(${a.id})">Desativar</button>` : ""}
        <button class="secondary small" onclick="adminExcluirAviso(${a.id})">Excluir</button>
      </div>
    </div>
  `).join("") || "<p>Nenhum aviso cadastrado ainda.</p>";
}

async function renderAdminAgendamentos() {
  const conteudo = document.getElementById("adminConteudo");
  if (!conteudo) return;
  conteudo.innerHTML = `<h3>📋 Agendamentos</h3><div id="listaAgendamentosAdmin">Carregando...</div>`;
  const client = adminClient();
  const { data, error } = await client.from("agendamentos").select("id,cliente_id,servico,data,horario,status").order("data", {ascending:false}).order("horario", {ascending:false});
  if (error) { document.getElementById("listaAgendamentosAdmin").textContent = "Não foi possível carregar os agendamentos."; return; }
  const ids = [...new Set((data || []).map(a => a.cliente_id).filter(Boolean))];
  let clientes = [];
  if (ids.length) {
    const r = await client.from("Clientes").select("id,nome,whatsapp").in("id", ids);
    clientes = r.data || [];
  }
  const cm = new Map(clientes.map(c => [c.id, c]));
  document.getElementById("listaAgendamentosAdmin").innerHTML = (data || []).map(a => {
    const c = cm.get(a.cliente_id);
    return `<div style="padding:12px;border-bottom:1px solid #eee;"><strong>${a.data} — ${String(a.horario).slice(0,5)}</strong><br>${a.servico}<br>${c?.nome || "Cliente"} ${c?.whatsapp ? "— "+c.whatsapp : ""}<br>Status: ${a.status || ""}</div>`;
  }).join("") || "Nenhum agendamento cadastrado.";
}

window.abrirAdminAba = async function (aba) {
  const resultado = await verificarAdmin();
  if (!resultado.ok) { alert(resultado.message); return; }
  const area = document.getElementById("areaDebora");
  if (area) area.style.display = "block";
  const conteudo = document.getElementById("adminConteudo");
  if (!conteudo) return;
  const titulos = { horarios:"📅 Horários", precos:"💰 Preços", fotos:"📸 Fotos", promocoes:"🎀 Promoções", vip:"⭐ VIP Fidelidade", agendamentos:"📋 Agendamentos", avisos:"📢 Avisos e Novidades" };
  const container = area.querySelector(".admin-container") || area;
  const atual = document.getElementById("adminConteudo");
  let tabs = container.querySelector(".admin-tabs");
  if (!tabs) {
    if (atual && atual.parentElement === container) {
      atual.insertAdjacentHTML("beforebegin", adminBotoes());
    } else {
      container.insertAdjacentHTML("beforeend", adminBotoes());
    }
    tabs = container.querySelector(".admin-tabs");
  }

  // O HTML antigo já possui uma barra de abas. Nesse caso, acrescenta
  // APENAS a aba de Avisos e Novidades, sem duplicar nem alterar as outras.
  if (tabs && !tabs.querySelector("[data-admin-aba='avisos']")) {
    const botaoAvisos = document.createElement("button");
    botaoAvisos.type = "button";
    botaoAvisos.className = "primary small";
    botaoAvisos.setAttribute("data-admin-aba", "avisos");
    botaoAvisos.textContent = "📢 Avisos e Novidades";
    botaoAvisos.addEventListener("click", () => window.abrirAdminAba("avisos"));
    tabs.appendChild(botaoAvisos);
  }

  if (!atual) {
    atual = document.createElement("div");
    atual.id = "adminConteudo";
    container.appendChild(atual);
  }
  const carregadores = { horarios:renderAdminHorarios, precos:renderAdminPrecos, fotos:renderAdminFotos, promocoes:renderAdminPromocoes, vip:renderAdminVip, agendamentos:renderAdminAgendamentos, avisos:renderAdminAvisos };
  await (carregadores[aba] || renderAdminHorarios)();
};

window.sairAdmin = async function () {
  const client = adminClient();
  await client.auth.signOut();
  const area = document.getElementById("areaDebora");
  if (area) area.style.display = "none";
  alert("Você saiu da Área da Débora.");
};

// Carrega preços salvos no Supabase sem alterar o visual.
async function carregarPrecosPublicos() {
  try {
    const client = adminClient();
    const { data, error } = await client.from("servicos").select("nome,preco,descricao").eq("ativo", true);
    if (error || !data?.length) return;
    data.forEach(row => {
      const service = SERVICES.find(s => s[0] === row.nome);
      if (service) {
        service[1] = Number(row.preco);
        if (row.descricao) service[2] = row.descricao;
      }
    });
    renderServices();
  } catch (e) { console.warn("Não foi possível carregar preços do Supabase.", e); }
}


/* ===== MELHORIAS GERAIS DO CLUBE VIP ===== */

function atualizarCartaoVIP(pontos, vip) {
  const total = 10;
  const quantidade = Math.max(0, Math.min(total, Number(pontos || 0)));

  const seletores = [
    ".vip-point",
    ".vip-points .point",
    ".fidelity-point",
    ".fidelidade-point",
    ".loyalty-point",
    ".loyalty-points .loyalty-point",
    "[data-vip-point]",
    "[data-point]"
  ];

  let elementos = [];
  seletores.forEach(seletor => {
    elementos.push(...document.querySelectorAll(seletor));
  });
  elementos = [...new Set(elementos)];

  elementos.slice(0, total).forEach((el, index) => {
    const ativo = index < quantidade;
    el.classList.toggle("is-completed", ativo);
    el.setAttribute("aria-label", ativo ? `Ponto ${index + 1} conquistado` : `Ponto ${index + 1} disponível`);
    el.innerHTML = ativo ? "💅" : "";
  });

  if (quantidade >= 10) {
    document.querySelectorAll(".vip-benefit-message, [data-vip-benefit]").forEach(el => {
      el.textContent = "🎉 Cartão completo! Você conquistou 60% de desconto em qualquer procedimento.";
    });
  }
}

function configurarDetalhesVIP() {
  document.addEventListener("click", event => {
    const alvo = event.target.closest("button, a, [role='button'], .vip-stat, .vip-card");
    if (!alvo) return;

    const texto = (alvo.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();

    if (texto.includes("pontos acumulados") || texto.includes("pontos")) {
      const { cliente } = getCurrentClient();
      if (cliente) {
        cliente.then?.();
      }
    }

    if (texto.includes("ver benefício") || texto.includes("benefício")) {
      event.preventDefault();
      const client = adminClient();
      client.auth.getSession().then(async ({ data }) => {
        if (!data?.session?.user) {
          openVipModal();
          return;
        }
        const { data: c } = await client.from("Clientes").select("id,nome").eq("user_id", data.session.user.id).maybeSingle();
        if (!c) return;
        const { data: vip } = await client.from("vip_fidelidade").select("pontos,beneficio_usado").eq("cliente_id", c.id).maybeSingle();
        const pontos = Number(vip?.pontos || 0);
        showModal(`
          <h2>Seu benefício 💗</h2>
          <p>Você tem <strong>${pontos} de 10 pontos</strong>.</p>
          <p>${pontos >= 10 ? "🎉 Seu benefício de 60% de desconto está disponível!" : `Faltam ${10 - pontos} ponto(s) para completar seu cartão.`}</p>
          <button class="primary full" onclick="closeModal()">Fechar</button>
        `);
      });
    }

    if (texto.includes("promoções")) {
      event.preventDefault();
      adminClient().from("promocoes").select("titulo,descricao,servico,preco_promocional,data_inicio,data_fim").eq("ativo",true).order("id",{ascending:false}).then(({data,error})=>{
        if(error){ console.error(error); return; }
        showModal(`
          <h2>Promoções 🎀</h2>
          ${data?.length ? data.map(p=>`
            <div class="promo-item">
              <h3>${p.titulo}</h3>
              <p>${p.descricao || ""}</p>
              ${p.servico && p.preco_promocional != null ? `<p><del>${money(Number(SERVICES.find(s => s[0] === p.servico)?.[1] || 0))}</del> <strong>${money(Number(p.preco_promocional))}</strong></p>` : (p.preco_promocional != null ? `<strong>${money(Number(p.preco_promocional))}</strong>` : "")}
            </div>
          `).join("") : `<p class="muted">No momento não há promoções cadastradas.</p>`}
          <button class="primary full" onclick="closeModal()">Fechar</button>
        `);
      });
    }
  });
}

function aplicarAjustesMobileServicos() {
  const style = document.createElement("style");
  style.id = "ajustes-mobile-debora";
  style.textContent = `
    .service-number { display:none !important; }
    @media (max-width: 700px) {
      #servicesGrid {
        grid-template-columns: 1fr !important;
        width: 100% !important;
      }
      #servicesGrid .service-card {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
      }
      #servicesGrid .service-images {
        width: 100% !important;
      }
      #servicesGrid .service-images img {
        max-width: 100% !important;
      }
      #servicesGrid .service-content {
        min-width: 0 !important;
      }
      #servicesGrid .service-content h3 {
        font-size: 18px !important;
        line-height: 1.2 !important;
      }
      #servicesGrid .service-content p {
        font-size: 13px !important;
        line-height: 1.5 !important;
      }
      #servicesGrid .service-bottom {
        display:flex !important;
        align-items:center !important;
        justify-content:space-between !important;
        gap:12px !important;
      }
    }
    .vip-point.is-completed {
      position: relative;
    }
  `;
  document.head.appendChild(style);
}

async function restaurarTudoAoAbrir() {
  try {
    await restaurarSessaoVIP();
  } catch (error) {
    console.error(error);
  }
}

aplicarAjustesMobileServicos();
configurarDetalhesVIP();
restaurarTudoAoAbrir();

carregarPrecosPublicos();
carregarPromocoesPublicas();


/* ===== MEUS AGENDAMENTOS + AVISOS E NOVIDADES ===== */

async function abrirMeusAgendamentos() {
  const { user, cliente } = await getCurrentClient();
  if (!user || !cliente) {
    openVipModal();
    return;
  }

  const client = adminClient();
  const { data, error } = await client
    .from("agendamentos")
    .select("id,servico,data,horario,status")
    .eq("cliente_id", cliente.id)
    .order("data", { ascending: false })
    .order("horario", { ascending: false });

  if (error) {
    console.error(error);
    return showModal(`
      <h2>Meus agendamentos 💗</h2>
      <p>Não foi possível carregar seus agendamentos agora. Tente novamente.</p>
      <button class="primary full" onclick="closeModal()">Fechar</button>
    `);
  }

  const formatDate = value => value ? value.split("-").reverse().join("/") : "";
  const statusLabel = value => {
    const s = String(value || "").toLowerCase();
    if (s === "confirmado" || s === "agendado") return "Agendado";
    if (s === "realizado") return "Realizado";
    if (s === "cancelado") return "Cancelado";
    return value || "Agendado";
  };

  const lista = data || [];
  showModal(`
    <h2>Meus agendamentos 💗</h2>
    <p class="muted">Aqui ficam seus horários atuais e seu histórico de agendamentos.</p>
    ${lista.length ? `
      <div style="display:grid;gap:10px;max-height:55vh;overflow:auto;">
        ${lista.map(a => `
          <div style="padding:14px;border:1px solid #ead7df;border-radius:14px;">
            <strong>💅 ${escapeHtml(a.servico)}</strong>
            <div>📅 ${formatDate(a.data)}</div>
            <div>🕐 ${escapeHtml(a.horario)}</div>
            <div style="margin-top:5px;"><strong>Status: ${escapeHtml(statusLabel(a.status))}</strong></div>
          </div>
        `).join("")}
      </div>
    ` : `<p>Você ainda não possui agendamentos.</p>`}
    <button class="primary full" style="margin-top:14px;" onclick="closeModal();openBooking()">Agendar novo horário</button>
  `);
}

async function carregarAvisosPublicos() {
  try {
    const client = adminClient();
    const { data, error } = await client
      .from("avisos_novidades")
      .select("id,titulo,mensagem,ativo")
      .eq("ativo", true)
      .order("id", { ascending: false });
    if (error) {
      console.warn("Não foi possível carregar avisos e novidades.", error);
      return;
    }
    window.AVISOS_NOVIDADES = data || [];
  } catch (e) {
    console.warn("Não foi possível carregar avisos e novidades.", e);
  }
}

function abrirAvisosNovidades() {
  const avisos = window.AVISOS_NOVIDADES || [];
  showModal(`
    <h2>Avisos e novidades 📢</h2>
    <p class="muted">Fique por dentro das novidades da Débora Nail.</p>
    ${avisos.length ? avisos.map(a => `
      <article style="padding:14px;border:1px solid #ead7df;border-radius:14px;margin-bottom:10px;">
        <h3>${escapeHtml(a.titulo)}</h3>
        <p style="white-space:pre-wrap;">${escapeHtml(a.mensagem)}</p>
      </article>
    `).join("") : `<p>No momento não há avisos ou novidades publicados.</p>`}
    <button class="primary full" onclick="closeModal()">Fechar</button>
  `);
}

function configurarMeusAgendamentosEAvisos() {
  const substituirTexto = () => {
    // Corrige somente os textos do cartão, sem alterar o restante do layout.
    document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span,strong,small,div,a,button").forEach(el => {
      const texto = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/^meus atendimentos$/i.test(texto)) {
        el.textContent = "MEUS AGENDAMENTOS";
      } else if (/^veja seu histórico de atendimentos\.?$/i.test(texto)) {
        el.textContent = "Veja seus horários agendados e seu histórico.";
      }
    });
  };

  substituirTexto();
  [300, 800, 1500, 3000].forEach(ms => setTimeout(substituirTexto, ms));

  document.addEventListener("click", event => {
    const alvo = event.target.closest("article,button,a,div,section");
    if (!alvo) return;
    const texto = (alvo.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();

    if (texto.includes("meus agendamentos") || texto.includes("meus atendimentos")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      abrirMeusAgendamentos();
      return;
    }

    if (texto.includes("avisos e novidades")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      abrirAvisosNovidades();
    }
  }, true);
}

/* ===== CORREÇÕES FINAIS DA ÁREA VIP ===== */

// O botão "ENTRAR NA ÁREA VIP" da abertura deve abrir login/cadastro,
// nunca o formulário de agendamento.
function corrigirEntradaAreaVIP() {
  // Botão da navegação: abre login/cadastro.
  const botaoEntrada = document.getElementById("loginBtn");
  if (botaoEntrada) {
    botaoEntrada.onclick = function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openVipModal();
      return false;
    };
  }

  // Botão VIP real da abertura do site.
  // No index.html atual ele se chama #heroVip.
  // O botão de agendamento é #heroBook e continua abrindo o agendamento.
  const botaoHero = document.getElementById("heroVip");
  if (botaoHero) {
    botaoHero.onclick = function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openVipModal();
      return false;
    };
    botaoHero.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openVipModal();
    }, true);
  }
}

// Mostra os dados reais da cliente logada no botão MEUS DADOS.
async function abrirMeusDados() {
  const { user, cliente } = await getCurrentClient();
  if (!user || !cliente) {
    openVipModal();
    return;
  }

  showModal(`
    <h2>Meus dados 💗</h2>
    <p><strong>Nome</strong><br>${cliente.nome || "Não informado"}</p>
    <p><strong>WhatsApp</strong><br>${cliente.whatsapp || "Não informado"}</p>
    <p><strong>E-mail</strong><br>${cliente.email || user.email || "Não informado"}</p>
    <button class="primary full" onclick="closeModal()">Fechar</button>
  `);
}

function configurarMeusDados() {
  document.addEventListener("click", event => {
    const alvo = event.target.closest("button, a, [role='button']");
    if (!alvo) return;
    const texto = (alvo.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (texto.includes("meus dados")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      abrirMeusDados();
    }
  }, true);
}

// Atualiza o cartão e os pontos quando a cliente volta para a página.
async function atualizarVIPDaClienteAtual() {
  try {
    const { user, cliente } = await getCurrentClient();
    if (!user || !cliente) return;
    await carregarDadosVIP(cliente);
  } catch (error) {
    console.warn("Não foi possível atualizar os pontos VIP.", error);
  }
}

function manterPontosVIPAtualizados() {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") atualizarVIPDaClienteAtual();
  });
  window.addEventListener("focus", atualizarVIPDaClienteAtual);
  // Atualiza periodicamente enquanto a cliente deixa o site aberto.
  setInterval(() => {
    if (document.visibilityState === "visible") atualizarVIPDaClienteAtual();
  }, 15000);
}

// Reforça a atualização do cartão depois de qualquer alteração feita no painel.
const _adminSalvarPontosOriginal = window.adminSalvarPontos;
if (_adminSalvarPontosOriginal) {
  window.adminSalvarPontos = async function (...args) {
    const resultado = await _adminSalvarPontosOriginal(...args);
    return resultado;
  };
}

corrigirEntradaAreaVIP();
configurarMeusDados();
configurarMeusAgendamentosEAvisos();
manterPontosVIPAtualizados();
carregarAvisosPublicos();

