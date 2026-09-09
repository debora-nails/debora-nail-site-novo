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

function precoAtualServico(nome) {
  const base = SERVICES.find(s => String(s[0]).trim().toLowerCase() === String(nome).trim().toLowerCase());
  const precoBase = Number(base?.[1] || 0);
  const promo = PROMOCOES_ATIVAS.find(p =>
    String(p.servico || "").trim().toLowerCase() === String(nome).trim().toLowerCase()
  );
  const precoPromo = Number(promo?.preco_promocional);
  return Number.isFinite(precoPromo) && precoPromo >= 0 && precoPromo < precoBase ? precoPromo : precoBase;
}

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
    .select("id, nome, whatsapp, email, is_admin, permite_pagamento_posterior")
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

    <label>
      Forma de pagamento
      <select id="bookingPayment" onchange="atualizarPagamentoAgendamento()">
        <option value="">Selecione</option>
        <option value="pix">Pix</option>
        <option value="dinheiro">Dinheiro</option>
        <option value="debito">Cartão de débito</option>
        <option value="credito">Cartão de crédito</option>
        <option value="pagar_depois" id="bookingPayLaterOption" style="display:none">Pagar depois</option>
      </select>
    </label>

    <div id="bookingCashBox" style="display:none;">
      <label>
        Troco para quanto?
        <input id="bookingTrocoPara" type="number" min="0" step="0.01" placeholder="Ex.: 200,00" oninput="calcularTrocoAgendamento()">
      </label>
      <p id="bookingTrocoResultado" class="muted"></p>
    </div>

    <p id="bookingPaymentStatus" class="muted"></p>

    <button class="primary full" onclick="confirmarAgendamento()">
      AGENDAR HORÁRIO
    </button>

    <button class="secondary full" onclick="abrirWhatsAppAgendamento()">
      CONTINUAR PELO WHATSAPP
    </button>
  `);

  await atualizarOpcaoPagarDepoisAgendamento();
  atualizarPagamentoAgendamento();
}

async function atualizarOpcaoPagarDepoisAgendamento() {
  const option = document.getElementById("bookingPayLaterOption");
  if (!option) return;
  const { cliente } = await getCurrentClient();
  const permitido = !!cliente?.permite_pagamento_posterior;
  option.style.display = permitido ? "block" : "none";
  option.disabled = !permitido;
  if (!permitido && document.getElementById("bookingPayment")?.value === "pagar_depois") {
    document.getElementById("bookingPayment").value = "";
  }
}

function atualizarPagamentoAgendamento() {
  const payment = document.getElementById("bookingPayment")?.value;
  const cashBox = document.getElementById("bookingCashBox");
  const status = document.getElementById("bookingPaymentStatus");
  if (cashBox) cashBox.style.display = payment === "dinheiro" ? "block" : "none";
  if (status) status.textContent = payment === "pagar_depois" ? "Este atendimento ficará registrado como valor a receber." : "";
  if (payment !== "dinheiro") {
    const input = document.getElementById("bookingTrocoPara");
    const result = document.getElementById("bookingTrocoResultado");
    if (input) input.value = "";
    if (result) result.textContent = "";
  }
}

function calcularTrocoAgendamento() {
  const service = document.getElementById("bookingService")?.value;
  const trocoPara = Number(document.getElementById("bookingTrocoPara")?.value || 0);
  const result = document.getElementById("bookingTrocoResultado");
  const servicoAtual = SERVICES.find(s => s[0] === service);
  if (!result || !servicoAtual || !trocoPara) { if (result) result.textContent = ""; return; }
  const valor = precoAtualServico(service);
  if (trocoPara < valor) {
    result.textContent = `O valor informado é menor que o serviço (${money(valor)}).`;
    return;
  }
  result.textContent = `Troco: ${money(trocoPara - valor)}`;
}

async function confirmarAgendamento() {
  const service = document.getElementById("bookingService")?.value;
  const date = document.getElementById("bookingDate")?.value;
  const time = document.getElementById("bookingTime")?.value;
  const payment = document.getElementById("bookingPayment")?.value;
  const trocoPara = Number(document.getElementById("bookingTrocoPara")?.value || 0);

  if (!service || !date || !time) {
    alert("Escolha o serviço, a data e um horário disponível.");
    return;
  }
  if (!payment) {
    alert("Escolha a forma de pagamento.");
    return;
  }

  const servicoAtual = SERVICES.find(s => s[0] === service);
  const valorServico = precoAtualServico(service);
  let troco = 0;

  if (payment === "dinheiro" && trocoPara > 0) {
    if (trocoPara < valorServico) {
      alert(`O valor do troco para deve ser igual ou maior que ${money(valorServico)}.`);
      return;
    }
    troco = trocoPara - valorServico;
  }

  const { client, cliente } = await getCurrentClient();

  if (!cliente) {
    alert("Entre na sua Área VIP para realizar o agendamento.");
    return;
  }

  if (payment === "pagar_depois" && !cliente.permite_pagamento_posterior) {
    alert("O pagamento posterior não está liberado para este cadastro.");
    return;
  }

  const { error } = await client
    .from("agendamentos")
    .insert({
      cliente_id: cliente.id,
      servico: service,
      data: date,
      horario: time,
      status: "confirmado",
      forma_pagamento: payment,
      troco_para: payment === "dinheiro" && trocoPara ? trocoPara : null,
      troco: payment === "dinheiro" && trocoPara ? troco : null,
      pagamento_status: payment === "pagar_depois" ? "pendente" : "pendente"
    });

  if (error) {
    console.error(error);
    if (error.code === "23505") {
      alert("Esse horário acabou de ser reservado por outra cliente. Escolha outro horário.");
      await carregarHorariosDisponiveis();
      return;
    }
    if (error.code === "42703" || String(error.message || "").toLowerCase().includes("forma_pagamento")) {
      alert("A parte de pagamento ainda não foi ativada no banco de dados. Rode o SQL de atualização que preparei junto com este código.");
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

let __adminClientInstance = null;
function adminClient() {
  if (!__adminClientInstance) {
    __adminClientInstance = window.supabase.createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.publishableKey
    );
  }
  return __adminClientInstance;
}

async function verificarAdmin() {
  const client = adminClient();

  const { data: sessionData } = await client.auth.getSession();
  const user = sessionData?.session?.user;

  if (!user) {
    return {
      ok: false,
      message: "Entre primeiro na sua conta VIP."
    };
  }

  const { data, error } = await client.rpc("usuario_atual_e_admin");

  if (error) {
    console.error("Erro ao verificar administrador:", error);
    return {
      ok: false,
      message: "Não foi possível verificar seu acesso."
    };
  }

  if (!data) {
    return {
      ok: false,
      message: "Esta área é exclusiva da Débora."
    };
  }

  return {
    ok: true
  };
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
      <button class="primary small" onclick="abrirAdminAba('clientes')">👥 Clientes</button>
      <button class="primary small" onclick="abrirAdminAba('agendamentos')">📋 Agendamentos</button>
      <button class="primary small" data-admin-aba="financeiro" onclick="abrirAdminAba('financeiro')">💰 Financeiro</button>
      <button class="primary small" data-admin-aba="avisos" onclick="abrirAdminAba('avisos')">📢 Avisos e Novidades</button>
      <button class="primary small" data-admin-aba="diagnostico" onclick="abrirAdminAba('diagnostico')">🔎 Diagnóstico</button>
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

async function renderAdminClientes() {
  const conteudo = document.getElementById("adminConteudo");
  if (!conteudo) return;
  conteudo.innerHTML = `
    <h3>👥 Clientes</h3>
    <p class="muted">Aqui aparecem as clientes que se cadastrarem no site. O pagamento depois fica desligado por padrão.</p>
    <div id="listaClientesAdmin">Carregando...</div>
  `;
  const lista = document.getElementById("listaClientesAdmin");
  try {
    const client = adminClient();
    const { data, error } = await client.rpc("admin_listar_clientes");
    if (error) throw error;
    const clientes = Array.isArray(data) ? data : [];
    if (!clientes.length) {
      lista.innerHTML = `<div style="padding:18px;border:1px solid #ead7df;border-radius:16px;background:#fff;">Ainda não há clientes cadastradas. 💗</div>`;
      return;
    }
    lista.innerHTML = clientes.map(c => `
      <div style="padding:16px;border:1px solid #ead7df;border-radius:16px;margin:10px 0;background:#fff;">
        <strong>👤 ${escapeHtml(c.nome || "Cliente")}</strong>
        <div style="margin-top:5px;">📱 ${escapeHtml(c.whatsapp || "Não informado")}</div>
        <div>✉️ ${escapeHtml(c.email || "Não informado")}</div>
        <div style="margin-top:10px;">
          <label style="display:inline-flex;align-items:center;gap:8px;">
            <input type="checkbox" ${c.permite_pagamento_posterior ? "checked" : ""}
              onchange="adminAlternarPagamentoPosterior(${Number(c.id)}, this.checked)">
            <strong>Permitir “Pagar depois”</strong>
          </label>
        </div>
        <small style="display:block;margin-top:6px;color:#777;">${c.permite_pagamento_posterior ? "Cliente autorizada a pagar depois." : "Pagamento depois desativado."}</small>
      </div>
    `).join("");
  } catch (error) {
    console.error("Erro ao carregar clientes:", error);
    if (lista) lista.innerHTML = `<div style="padding:16px;border:1px solid #ead7df;border-radius:16px;background:#fff;"><strong>Não foi possível carregar as clientes.</strong><br><small>${escapeHtml(error?.message || "Erro desconhecido")}</small></div>`;
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

window.adminAlternarPagamentoPosterior = async function (clienteId, permitido) {
  const client = adminClient();
  const { error } = await client.rpc("admin_definir_pagamento_posterior", { p_cliente_id: Number(clienteId), p_permitido: !!permitido });
  if (error) { console.error(error); alert("Não foi possível atualizar essa permissão."); return; }
  renderAdminClientes();
};

async function renderAdminVip() {
  const conteudo = document.getElementById("adminConteudo");
  if (!conteudo) return;
  conteudo.innerHTML = `<h3>⭐ VIP Fidelidade</h3><p>Atualize os pontos e defina quais clientes de confiança podem pagar depois.</p><div id="listaVipAdmin">Carregando...</div>`;
  const client = adminClient();
  const { data, error } = await client.from("Clientes").select("id,nome,whatsapp,email,permite_pagamento_posterior").order("nome");
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
    return `<div style="padding:12px;border-bottom:1px solid #eee;"><strong>${c.nome || "Cliente"}</strong><br><small>${c.whatsapp || ""} ${c.email ? "— "+c.email : ""}</small><br><label style="display:inline-flex;align-items:center;gap:8px;margin:8px 0;"><input type="checkbox" ${c.permite_pagamento_posterior ? "checked" : ""} onchange="adminAlternarPagamentoPosterior(${c.id}, this.checked)"> Permitir pagamento depois</label><br><input id="pontos-${c.id}" type="number" min="0" max="10" value="${v?.pontos ?? 0}" style="width:80px"><button class="primary small" onclick="adminSalvarPontos(${c.id}, ${v?.id ?? 'null'})">Salvar pontos</button></div>`;
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
      <label for="adminAvisoTitulo">Título</label>
      <input id="adminAvisoTitulo" type="text" placeholder="Digite o título">
      <label for="adminAvisoMensagem">Mensagem</label>
      <textarea id="adminAvisoMensagem" rows="5" placeholder="Digite a mensagem"></textarea>
      <button class="primary small" onclick="adminAdicionarAviso()">📢 Publicar</button>
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

async function renderAdminDiagnostico() {
  const conteudo = document.getElementById("adminConteudo");
  if (!conteudo) return;
  conteudo.innerHTML = `
    <h3>🔎 Diagnóstico do site</h3>
    <p class="muted">O próprio site vai verificar onde Clientes e Agendamentos estão travando. Não altera clientes, agendamentos ou financeiro.</p>
    <div id="diagnosticoAdmin" style="display:grid;gap:10px;margin-top:14px;"></div>
  `;
  const box = document.getElementById("diagnosticoAdmin");
  const inicio = Date.now();
  const resultados = [];
  const mostrar = () => {
    box.innerHTML = resultados.map(r => `<div style="padding:13px 15px;border:1px solid #ead7df;border-radius:14px;background:#fff;">
      <strong>${r.ok ? "✅" : "❌"} ${escapeHtml(r.titulo)}</strong>
      <div style="margin-top:5px;white-space:pre-wrap;">${escapeHtml(r.msg)}</div>
    </div>`).join("") + `<p class="muted">Diagnóstico concluído em ${Date.now()-inicio} ms.</p>`;
  };
  const add = (ok,titulo,msg) => { resultados.push({ok,titulo,msg}); mostrar(); };
  try {
    const client = adminClient();
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    const user = sessionData?.session?.user;
    if (sessionError) add(false,"Sessão",sessionError.message || "Erro ao verificar sessão.");
    else if (!user) add(false,"Sessão","Nenhuma sessão autenticada encontrada.");
    else add(true,"Sessão","Usuária autenticada: " + (user.email || user.id));

    const admin = await client.rpc("usuario_atual_e_admin");
    if (admin.error) add(false,"Acesso de administradora",admin.error.message || "Erro na função usuario_atual_e_admin.");
    else add(admin.data === true,"Acesso de administradora",admin.data === true ? "Administradora reconhecida." : "Usuária autenticada, mas não reconhecida como administradora.");

    const testarRPC = async (nome, limite=7000) => {
      const t0 = Date.now();
      let timer;
      try {
        const promessa = client.rpc(nome);
        const timeout = new Promise((_, reject) => { timer=setTimeout(() => reject(new Error("TIMEOUT: a função não respondeu em 7 segundos")), limite); });
        const r = await Promise.race([promessa, timeout]);
        clearTimeout(timer);
        return { ...r, ms: Date.now()-t0 };
      } catch(e) { clearTimeout(timer); return { data:null, error:e, ms:Date.now()-t0 }; }
    };

    const clientes = await testarRPC("admin_listar_clientes");
    if (clientes.error) add(false,"RPC Clientes",`${clientes.error.message || clientes.error}
Tempo: ${clientes.ms} ms`);
    else add(true,"RPC Clientes",`Resposta recebida em ${clientes.ms} ms. Tipo: ${Array.isArray(clientes.data) ? "lista" : typeof clientes.data}. Registros: ${Array.isArray(clientes.data) ? clientes.data.length : "formato não-lista"}.`);

    const ag = await testarRPC("admin_listar_agendamentos");
    if (ag.error) add(false,"RPC Agendamentos",`${ag.error.message || ag.error}
Tempo: ${ag.ms} ms`);
    else {
      const tipo = Array.isArray(ag.data) ? "lista" : typeof ag.data;
      const qtd = Array.isArray(ag.data) ? ag.data.length : (Array.isArray(ag.data?.agendamentos) ? ag.data.agendamentos.length : "formato desconhecido");
      add(true,"RPC Agendamentos",`Resposta recebida em ${ag.ms} ms. Tipo: ${tipo}. Registros: ${qtd}.`);
    }

    const versao = await client.rpc("admin_listar_agendamentos");
    if (!versao.error) {
      const formatoNovo = Array.isArray(versao.data);
      const formatoAntigo = versao.data && Array.isArray(versao.data.agendamentos);
      add(formatoNovo || formatoAntigo,"Formato dos Agendamentos",formatoNovo ? "Formato atual: lista de agendamentos." : formatoAntigo ? "Formato antigo: objeto com agendamentos." : "Formato inesperado retornado pelo banco.");
    }
  } catch (e) {
    add(false,"Erro geral do diagnóstico",e?.message || String(e));
  }
}

async function renderAdminAgendamentos() {
  const conteudo = document.getElementById("adminConteudo");
  if (!conteudo) return;
  conteudo.innerHTML = `<h3>📋 Agendamentos</h3><p class="muted">Acompanhe os horários e registre o resultado de cada atendimento.</p><div id="listaAgendamentosAdmin">Carregando...</div>`;
  const lista = document.getElementById("listaAgendamentosAdmin");
  try {
    const client = adminClient();
    const { data, error } = await client.rpc("admin_listar_agendamentos");
    if (error) throw error;
    const agendamentos = Array.isArray(data) ? data : (Array.isArray(data?.agendamentos) ? data.agendamentos : []);
    const pagamentos = { pix:"Pix", dinheiro:"Dinheiro", debito:"Cartão de débito", credito:"Cartão de crédito", pagar_depois:"Pagar depois" };
    const statusLabel = s => ({ confirmado:"Confirmado", agendado:"Agendado", realizado:"Realizado", cancelado:"Cancelado", faltou:"Faltou" }[String(s || "").toLowerCase()] || s || "Agendado");
    if (!agendamentos.length) {
      lista.innerHTML = `<div style="padding:18px;border:1px solid #ead7df;border-radius:16px;background:#fff;">Nenhum agendamento cadastrado ainda. 💗</div>`;
      return;
    }
    lista.innerHTML = agendamentos.map(a => {
      const pagamento = pagamentos[a.forma_pagamento] || "Não informado";
      const nome = a.cliente_nome || "Cliente";
      const whatsapp = a.cliente_whatsapp || "";
      const trocoInfo = a.forma_pagamento === "dinheiro" && a.troco_para != null ? `<br>Troco para: ${money(Number(a.troco_para))}${a.troco != null ? ` — Troco: ${money(Number(a.troco))}` : ""}` : "";
      const podeFechar = !["cancelado","faltou","realizado"].includes(String(a.status || "").toLowerCase());
      return `<div style="padding:14px;border:1px solid #ead7df;border-radius:16px;margin:10px 0;background:#fff;">
        <strong>📅 ${escapeHtml(String(a.data || ""))} — ${escapeHtml(String(a.horario || "").slice(0,5))}</strong>
        <div style="margin-top:6px;">💅 ${escapeHtml(a.servico || "Serviço não informado")}</div>
        <div>👤 ${escapeHtml(nome)}${whatsapp ? ` — ${escapeHtml(whatsapp)}` : ""}</div>
        <div>Status: <strong>${escapeHtml(statusLabel(a.status))}</strong></div>
        <div>Pagamento: ${escapeHtml(pagamento)} — ${escapeHtml(a.pagamento_status || "pendente")}${trocoInfo}</div>
        ${podeFechar ? `<div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:10px;">
          <button class="primary small" onclick="adminMarcarAgendamento(${Number(a.id)},'realizado')">✅ Realizado</button>
          <button class="secondary small" onclick="adminMarcarAgendamento(${Number(a.id)},'faltou')">⚠️ Faltou</button>
          <button class="secondary small" onclick="adminMarcarAgendamento(${Number(a.id)},'cancelado')">❌ Cancelar</button>
        </div>` : ""}
      </div>`;
    }).join("");
  } catch (error) {
    console.error("Erro ao carregar agendamentos:", error);
    if (lista) lista.innerHTML = `<div style="padding:16px;border:1px solid #ead7df;border-radius:16px;background:#fff;"><strong>Não foi possível carregar os agendamentos.</strong><br><small>${escapeHtml(error?.message || "Erro desconhecido")}</small></div>`;
  }
}

window.adminMarcarAgendamento = async function(id, status) {
  const nomes = {realizado:"concluir este atendimento como realizado", faltou:"marcar este atendimento como falta", cancelado:"cancelar este agendamento"};
  if (!confirm(`Deseja ${nomes[status] || "alterar o status"}?`)) return;
  const client = adminClient();
  const { error } = await client.rpc("admin_marcar_agendamento", {
    p_agendamento_id: Number(id),
    p_status: status
  });
  if (error) { console.error(error); return alert("Não foi possível atualizar o agendamento."); }
  if (status === "realizado") {
    const { data: a } = await client.from("agendamentos").select("id,cliente_id,servico,data,forma_pagamento,pagamento_status").eq("id", id).single();
    if (a && a.forma_pagamento !== "pagar_depois") {
      await client.from("entradas_financeiro").upsert({
        agendamento_id:a.id, cliente_id:a.cliente_id, servico:a.servico, data:a.data, valor:precoAtualServico(a.servico), forma_pagamento:a.forma_pagamento, desconto:0, status:"pago"
      }, {onConflict:"agendamento_id"});
      await client.from("agendamentos").update({pagamento_status:"pago"}).eq("id", id);
    } else if (a) {
      const valor = precoAtualServico(a.servico);
      await client.from("contas_receber").upsert({agendamento_id:a.id, cliente_id:a.cliente_id, valor_original:valor, valor_pago:0, saldo:valor, data_vencimento:null, status:"pendente"}, {onConflict:"agendamento_id"});
    }
  }
  renderAdminAgendamentos();
};


// ===== FINANCEIRO =====
function finMoney(v){ return money(Number(v||0)); }
function finDate(v){ return v ? String(v).split("-").reverse().join("/") : ""; }
function finToday(){ return new Date().toISOString().slice(0,10); }

async function renderAdminFinanceiro() {
  const conteudo=document.getElementById("adminConteudo");
  if(!conteudo) return;
  conteudo.innerHTML=`
    <h3>💰 Financeiro</h3>
    <p class="muted">Controle suas entradas, despesas, valores a receber e lucro sem alterar os outros módulos.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin:12px 0;">
      <button class="primary small" onclick="finMostrarResumo()">📊 Resumo</button>
      <button class="primary small" onclick="finMostrarEntradas()">💗 Entradas</button>
      <button class="primary small" onclick="finMostrarDespesas()">💸 Despesas</button>
      <button class="primary small" onclick="finMostrarReceber()">📌 A receber</button>
      <button class="primary small" onclick="finMostrarRelatorios()">📈 Relatórios</button>
      <button class="primary small" onclick="finMostrarMeta()">🎯 Meta</button>
      <button class="primary small" onclick="finMostrarFechamento()">🔒 Fechamento</button>
      <button class="primary small" onclick="finMostrarHistorico()">📚 Histórico</button>
    </div>
    <div id="financeiroConteudo">Carregando...</div>`;
  await finMostrarResumo();
}

function finPeriodo(tipo){
  const hoje=new Date(); const y=hoje.getFullYear(); const m=hoje.getMonth();
  if(tipo==='hoje') return [finToday(),finToday()];
  if(tipo==='ontem'){ const d=new Date(hoje); d.setDate(d.getDate()-1); const x=d.toISOString().slice(0,10); return [x,x]; }
  if(tipo==='semana'){ const d=new Date(hoje); const day=d.getDay()||7; d.setDate(d.getDate()-day+1); const ini=d.toISOString().slice(0,10); const f=new Date(d); f.setDate(f.getDate()+6); return [ini,f.toISOString().slice(0,10)]; }
  if(tipo==='mespassado'){ const ini=new Date(y,m-1,1), fim=new Date(y,m,0); return [ini.toISOString().slice(0,10),fim.toISOString().slice(0,10)]; }
  if(tipo==='ano'){ return [`${y}-01-01`,`${y}-12-31`]; }
  return [new Date(y,m,1).toISOString().slice(0,10),new Date(y,m+1,0).toISOString().slice(0,10)];
}

async function finDados(tipo='mes'){
  const client=adminClient(), [ini,fim]=finPeriodo(tipo);
  const [e,d]=await Promise.all([
    client.from('entradas_financeiro').select('*').gte('data',ini).lte('data',fim).order('data',{ascending:false}),
    client.from('despesas_financeiro').select('*').gte('data',ini).lte('data',fim).order('data',{ascending:false})
  ]);
  return {entradas:e.data||[],despesas:d.data||[],ini,fim};
}

async function finMostrarResumo(tipo='mes'){
  const box=document.getElementById('financeiroConteudo'); if(!box) return;
  box.innerHTML='Carregando resumo...';
  const r=await finDados(tipo);
  const ent=r.entradas.reduce((s,x)=>s+Number(x.valor||0),0), desp=r.despesas.reduce((s,x)=>s+Number(x.valor||0),0);
  box.innerHTML=`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">${['hoje','ontem','semana','mes','mespassado','ano'].map(x=>`<button class="secondary small" onclick="finMostrarResumo('${x}')">${({hoje:'Hoje',ontem:'Ontem',semana:'Esta semana',mes:'Este mês',mespassado:'Mês passado',ano:'Este ano'})[x]}</button>`).join('')}</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">
    <div class="vip-card"><small>Entradas</small><h3>${finMoney(ent)}</h3></div>
    <div class="vip-card"><small>Despesas</small><h3>${finMoney(desp)}</h3></div>
    <div class="vip-card"><small>Lucro</small><h3>${finMoney(ent-desp)}</h3></div>
    <div class="vip-card"><small>Atendimentos pagos</small><h3>${r.entradas.length}</h3></div>
  </div>
  <div style="margin-top:16px;padding:14px;border:1px solid #ead7df;border-radius:16px;">
    <strong>Período</strong><br>${finDate(r.ini)} até ${finDate(r.fim)}<br><small>Ticket médio: ${finMoney(r.entradas.length?ent/r.entradas.length:0)}</small>
  </div>`;
}

async function finMostrarEntradas(){
  const box=document.getElementById('financeiroConteudo'); if(!box)return;
  const client=adminClient(); const {data}=await client.from('entradas_financeiro').select('*').order('data',{ascending:false}).order('id',{ascending:false});
  box.innerHTML=`<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;"><h4>💗 Entradas</h4><button class="primary small" onclick="finNovaEntrada()">+ Nova entrada</button></div><div>${(data||[]).map(x=>`<div style="padding:12px;border-bottom:1px solid #eee;"><strong>${finDate(x.data)} — ${finMoney(x.valor)}</strong><br>${escapeHtml(x.cliente_nome||x.servico||'Entrada')} · ${escapeHtml(x.forma_pagamento||'Não informado')}<br><small>${escapeHtml(x.observacoes||'')}</small><br><button class="secondary small" style="margin-top:6px;" onclick="finRegistrarEstorno(${x.id})">↩️ Estornar</button></div>`).join('')||'<p>Nenhuma entrada registrada.</p>'}</div>`;
}

window.finNovaEntrada=async function(){
  const nome=prompt('Nome da cliente (opcional):')||''; const serv=prompt('Descrição/serviço:'); if(!serv)return; const valor=Number((prompt('Valor:')||'').replace(',','.')); if(!Number.isFinite(valor)||valor<0)return alert('Valor inválido.'); const forma=prompt('Forma de pagamento: pix, dinheiro, debito ou credito')||'pix';
  const client=adminClient(); const {error}=await client.from('entradas_financeiro').insert({cliente_nome:nome,servico:serv,data:finToday(),valor,forma_pagamento:forma,status:'pago'}); if(error){console.error(error);return alert('Não foi possível registrar a entrada.');} finMostrarEntradas();
};

async function finMostrarDespesas(){
  const box=document.getElementById('financeiroConteudo'); if(!box)return; const client=adminClient(); const {data}=await client.from('despesas_financeiro').select('*').order('data',{ascending:false}).order('id',{ascending:false});
  box.innerHTML=`<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;"><h4>💸 Despesas</h4><button class="primary small" onclick="finNovaDespesa()">+ Nova despesa</button></div><div>${(data||[]).map(x=>`<div style="padding:12px;border-bottom:1px solid #eee;"><strong>${finDate(x.data)} — ${finMoney(x.valor)}</strong><br>${escapeHtml(x.categoria||'Outros')} · ${escapeHtml(x.descricao||'')}</div>`).join('')||'<p>Nenhuma despesa registrada.</p>'}</div>`;
}

window.finNovaDespesa=async function(){
  const categoria=prompt('Categoria: materiais, produtos, móveis/equipamentos, energia, água, internet/telefone, aluguel, marketing, compras ou outros')||'outros'; const descricao=prompt('Descrição:')||''; const valor=Number((prompt('Valor:')||'').replace(',','.')); if(!Number.isFinite(valor)||valor<0)return alert('Valor inválido.'); const data=prompt('Data (AAAA-MM-DD):',finToday())||finToday();
  const client=adminClient(); const {error}=await client.from('despesas_financeiro').insert({data,categoria,descricao,valor}); if(error){console.error(error);return alert('Não foi possível registrar a despesa.');} finMostrarDespesas();
};

async function finMostrarReceber(){
  const box=document.getElementById('financeiroConteudo'); if(!box)return; const client=adminClient(); const {data}=await client.from('contas_receber').select('*').order('status').order('data_vencimento'); const ids=[...new Set((data||[]).map(x=>x.cliente_id).filter(Boolean))]; let cs=[]; if(ids.length){const r=await client.from('Clientes').select('id,nome,whatsapp').in('id',ids);cs=r.data||[];} const cm=new Map(cs.map(c=>[c.id,c]));
  box.innerHTML=`<h4>📌 Contas a receber</h4>${(data||[]).map(x=>{const c=cm.get(x.cliente_id);return `<div style="padding:14px;border:1px solid #ead7df;border-radius:14px;margin:8px 0;"><strong>${escapeHtml(c?.nome||'Cliente')}</strong><br>Valor: ${finMoney(x.valor_original)} · Pago: ${finMoney(x.valor_pago)} · <strong>Falta: ${finMoney(x.saldo)}</strong><br>Vencimento: ${x.data_vencimento?finDate(x.data_vencimento):'A combinar'}<br>Status: ${escapeHtml(x.status)}<div style="margin-top:8px;display:flex;gap:7px;flex-wrap:wrap;"><button class="primary small" onclick="finRegistrarPagamento(${x.id})">+ Registrar pagamento</button><button class="secondary small" onclick="finDefinirVencimento(${x.id})">📅 Definir vencimento</button><button class="secondary small" onclick="finHistoricoConta(${x.id})">📜 Histórico</button></div></div>`}).join('')||'<p>Ninguém está devendo no momento. 💗</p>'}`;
}

window.finRegistrarPagamento=async function(id){
  const valor=Number((prompt('Valor pago agora:')||'').replace(',','.')); if(!Number.isFinite(valor)||valor<=0)return alert('Valor inválido.'); const forma=prompt('Forma de pagamento: pix, dinheiro, debito ou credito')||'pix'; const data=prompt('Data (AAAA-MM-DD):',finToday())||finToday(); const obs=prompt('Observação (opcional):')||''; const client=adminClient();
  const {data:r,error:e}=await client.from('contas_receber').select('*').eq('id',id).single(); if(e||!r)return alert('Conta não encontrada.'); if(valor>Number(r.saldo))return alert('O pagamento não pode ser maior que o saldo.');
  const {error}=await client.from('pagamentos_receber').insert({conta_receber_id:id,data,valor,forma_pagamento:forma,observacoes:obs}); if(error){console.error(error);return alert('Não foi possível registrar o pagamento.');}
  const novoPago=Number(r.valor_pago||0)+valor, novoSaldo=Number(r.valor_original)-novoPago; await client.from('contas_receber').update({valor_pago:novoPago,saldo:novoSaldo,status:novoSaldo<=0?'pago':'parcial'}).eq('id',id);
  if(novoSaldo<=0 && r.agendamento_id) await client.from('agendamentos').update({pagamento_status:'pago'}).eq('id',r.agendamento_id);
  await client.from('entradas_financeiro').insert({agendamento_id:r.agendamento_id||null,cliente_id:r.cliente_id,servico:r.servico||'Pagamento de dívida',data,valor,forma_pagamento:forma,desconto:0,status:'pago',observacoes:obs});
  finMostrarReceber();
};

async function finDefinirVencimento(id){
  const data=prompt('Data combinada para pagamento (AAAA-MM-DD):'); if(!data)return;
  const client=adminClient(); const {error}=await client.from('contas_receber').update({data_vencimento:data}).eq('id',id); if(error){console.error(error);return alert('Não foi possível salvar a data.');} finMostrarReceber();
}

async function finHistoricoConta(id){
  const client=adminClient(); const {data,error}=await client.from('pagamentos_receber').select('*').eq('conta_receber_id',id).order('data',{ascending:true}).order('id',{ascending:true});
  if(error)return alert('Não foi possível carregar o histórico.');
  alert((data||[]).length ? (data||[]).map(x=>`${finDate(x.data)} — ${finMoney(x.valor)} — ${x.forma_pagamento||'Não informado'}${x.observacoes?' — '+x.observacoes:''}`).join('\n') : 'Nenhum pagamento registrado ainda.');
}

async function finMostrarMeta(){
  const box=document.getElementById('financeiroConteudo'); if(!box)return; const mes=new Date(); const chave=`${mes.getFullYear()}-${String(mes.getMonth()+1).padStart(2,'0')}-01`; const client=adminClient(); const {data}=await client.from('metas_financeiras').select('*').eq('mes',chave).maybeSingle(); const r=await finDados('mes'); const atual=r.entradas.reduce((s,x)=>s+Number(x.valor||0),0); const meta=Number(data?.valor_meta||0); const pct=meta>0?Math.min(100,(atual/meta)*100):0;
  box.innerHTML=`<h4>🎯 Meta mensal</h4><p>Faturamento deste mês: <strong>${finMoney(atual)}</strong></p><p>Meta: <strong>${finMoney(meta)}</strong></p><div style="height:12px;border-radius:99px;background:#f0e1e7;overflow:hidden;"><div style="width:${pct}%;height:100%;background:#d65f7b;"></div></div><p>${pct.toFixed(0)}% da meta</p><button class="primary small" onclick="finDefinirMeta()">Definir / alterar meta</button>`;
}

window.finDefinirMeta=async function(){ const valor=Number((prompt('Qual a meta de faturamento deste mês?')||'').replace(',','.')); if(!Number.isFinite(valor)||valor<0)return alert('Valor inválido.'); const d=new Date(); const mes=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`; const client=adminClient(); const {error}=await client.from('metas_financeiras').upsert({mes,valor_meta:valor},{onConflict:'mes'}); if(error){console.error(error);return alert('Não foi possível salvar a meta.');} finMostrarMeta(); };

async function finMostrarFechamento(){
  const box=document.getElementById('financeiroConteudo'); if(!box)return; const d=new Date(); const mes=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`; const client=adminClient(); const {data}=await client.from('fechamentos_financeiros').select('*').eq('mes',mes).maybeSingle(); box.innerHTML=`<h4>🔒 Fechamento mensal</h4><p>Mês atual: ${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}</p><p>Status: <strong>${data?.fechado?'Fechado':'Aberto'}</strong></p><button class="primary small" onclick="finAlternarFechamento()">${data?.fechado?'Reabrir mês':'Fechar mês'}</button><p class="muted">O fechamento é um registro de conferência; os dados financeiros não são apagados.</p>`;
}

window.finAlternarFechamento=async function(){ const d=new Date(); const mes=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`; const client=adminClient(); const {data}=await client.from('fechamentos_financeiros').select('*').eq('mes',mes).maybeSingle(); const fechado=!data?.fechado; const {error}=await client.from('fechamentos_financeiros').upsert({mes,fechado,fechado_em:fechado?new Date().toISOString():null},{onConflict:'mes'}); if(error){console.error(error);return alert('Não foi possível atualizar o fechamento.');} finMostrarFechamento(); };

async function finMostrarHistorico(){ const box=document.getElementById('financeiroConteudo'); if(!box)return; const client=adminClient(); const [e,d,est]=await Promise.all([client.from('entradas_financeiro').select('*').order('data',{ascending:false}).order('id',{ascending:false}),client.from('despesas_financeiro').select('*').order('data',{ascending:false}).order('id',{ascending:false}),client.from('estornos_financeiros').select('*').order('data',{ascending:false}).order('id',{ascending:false})]); const rows=[...(e.data||[]).map(x=>({data:x.data,tipo:'Entrada',desc:x.servico||x.cliente_nome||'Entrada',valor:Number(x.valor)})),...(d.data||[]).map(x=>({data:x.data,tipo:'Despesa',desc:x.descricao||x.categoria,valor:-Number(x.valor)})),...(est.data||[]).map(x=>({data:x.data,tipo:'Estorno',desc:x.motivo||'Estorno',valor:-Number(x.valor)}))].sort((a,b)=>String(b.data).localeCompare(String(a.data))); box.innerHTML=`<h4>📚 Histórico financeiro</h4><button class="secondary small" onclick="finExportarCSV()">⬇️ Exportar CSV</button><div style="margin-top:10px;">${rows.map(x=>`<div style="padding:10px;border-bottom:1px solid #eee;"><strong>${finDate(x.data)}</strong> · ${escapeHtml(x.tipo)} · ${escapeHtml(x.desc)} · <strong>${finMoney(x.valor)}</strong></div>`).join('')||'<p>Nenhum lançamento.</p>'}</div>`; }

window.finExportarCSV=async function(){ const client=adminClient(); const [e,d]=await Promise.all([client.from('entradas_financeiro').select('*').order('data'),client.from('despesas_financeiro').select('*').order('data')]); const rows=[['Data','Tipo','Descrição','Valor','Forma de pagamento'],...(e.data||[]).map(x=>[x.data,'Entrada',x.servico||x.cliente_nome||'',x.valor,x.forma_pagamento||'']),...(d.data||[]).map(x=>[x.data,'Despesa',x.descricao||x.categoria||'',-Number(x.valor), ''])]; const csv=rows.map(r=>r.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(';')).join('\n'); const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`financeiro-debora-nail-${finToday()}.csv`; a.click(); URL.revokeObjectURL(a.href); };

window.finRegistrarEstorno=async function(entradaId){ const valor=Number((prompt('Valor do estorno:')||'').replace(',','.')); if(!Number.isFinite(valor)||valor<=0)return alert('Valor inválido.'); const motivo=prompt('Motivo do estorno:')||''; const client=adminClient(); const {data:e}=await client.from('entradas_financeiro').select('*').eq('id',entradaId).single(); if(!e)return alert('Entrada não encontrada.'); const {error}=await client.from('estornos_financeiros').insert({entrada_id:entradaId,cliente_id:e.cliente_id,data:finToday(),valor,motivo}); if(error){console.error(error);return alert('Não foi possível registrar o estorno.');} alert('Estorno registrado no histórico.'); };

async function finMostrarRelatorios(){
  const box=document.getElementById('financeiroConteudo'); if(!box)return; const r=await finDados('ano'); const porForma={}; const porServico={}; const porCat={}; r.entradas.forEach(x=>{porForma[x.forma_pagamento]=(porForma[x.forma_pagamento]||0)+Number(x.valor||0); porServico[x.servico||'Outros']=(porServico[x.servico||'Outros']||0)+Number(x.valor||0);}); r.despesas.forEach(x=>porCat[x.categoria||'Outros']=(porCat[x.categoria||'Outros']||0)+Number(x.valor||0));
  const lista=o=>Object.entries(o).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<li>${escapeHtml(k)} — <strong>${finMoney(v)}</strong></li>`).join('')||'<li>Nenhum dado.</li>';
  box.innerHTML=`<h4>📈 Relatórios do ano</h4><p><strong>Faturamento:</strong> ${finMoney(r.entradas.reduce((s,x)=>s+Number(x.valor||0),0))}</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;"><div><strong>Por forma de pagamento</strong><ul>${lista(porForma)}</ul></div><div><strong>Por serviço</strong><ul>${lista(porServico)}</ul></div><div><strong>Despesas por categoria</strong><ul>${lista(porCat)}</ul></div></div>`;
}
window.abrirAdminAba = async function (aba) {
  const resultado = await verificarAdmin();
  if (!resultado.ok) { alert(resultado.message); return; }
  const area = document.getElementById("areaDebora");
  if (!area) return;
  area.style.display = "block";
  const conteudo = document.getElementById("adminConteudo");
  if (!conteudo) return;
  const container = area.querySelector(".admin-container") || area;

  // Há uma barra antiga gravada no HTML. Removemos TODAS as barras antigas
  // da Área da Débora e reconstruímos apenas a barra oficial do app.js.
  container.querySelectorAll(".admin-tabs").forEach(el => el.remove());
  container.insertAdjacentHTML("afterbegin", adminBotoes());
  const tabs = container.querySelector(".admin-tabs");
  tabs?.querySelectorAll("[data-admin-aba]").forEach(botao => {
    botao.classList.toggle("active", botao.getAttribute("data-admin-aba") === aba);
  });

  const carregadores = {
    horarios:renderAdminHorarios,
    precos:renderAdminPrecos,
    fotos:renderAdminFotos,
    promocoes:renderAdminPromocoes,
    vip:renderAdminVip,
    clientes:renderAdminClientes,
    agendamentos:renderAdminAgendamentos,
    financeiro:renderAdminFinanceiro,
    avisos:renderAdminAvisos,
    diagnostico:renderAdminDiagnostico
  };
  try {
    await (carregadores[aba] || renderAdminHorarios)();
  } catch (error) {
    console.error(`Erro ao abrir a aba ${aba}:`, error);
    conteudo.innerHTML = `<div style="padding:18px;border:1px solid #ead7df;border-radius:16px;background:#fff;"><strong>Não foi possível carregar esta área.</strong><p class="muted">${escapeHtml(error?.message || "Erro desconhecido")}</p></div>`;
  }
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

    // O botão dentro da Área da Débora deve abrir o EDITOR administrativo.
    // Somente os cartões/links públicos de "Avisos e Novidades" abrem a visualização.
    if (texto.includes("avisos e novidades")) {
      const botaoAdminAvisos = event.target.closest("[data-admin-aba='avisos']");
      if (botaoAdminAvisos) return;

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

