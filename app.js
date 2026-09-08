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

const money = value =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

function renderServices() {
  if (!grid) return;

  grid.innerHTML = SERVICES.map((service, index) => {
    const [name, price, description, images] = service;

    return `
      <article class="service-card">

        <div class="service-number">
          ${String(index + 1).padStart(2, "0")}
        </div>

        ${
          images.length
            ? `
              <div class="service-images">
                ${images
                  .map(
                    image => `
                      <img
                        src="${image}"
                        alt="${name}"
                        loading="lazy"
                      >
                    `
                  )
                  .join("")}
              </div>
            `
            : ""
        }

        <div class="service-content">

          <h3>${name}</h3>

          <p>${description}</p>

          <div class="service-bottom">

            <strong>${money(price)}</strong>

            <button
              class="primary small"
              onclick="openBooking(${index})"
            >
              Agendar
            </button>

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

function openBooking(index = null) {
  showModal(`
    <h2>Agendar horário</h2>

    <p class="muted">
      Escolha o serviço e continue pelo WhatsApp para confirmar.
    </p>

    <label>
      Serviço

      <select id="bookingService">
        ${SERVICES.map(
          (service, number) => `
            <option ${number === index ? "selected" : ""}>
              ${service[0]} — ${money(service[1])}
            </option>
          `
        ).join("")}
      </select>
    </label>

    <label>
      Data

      <input
        id="bookingDate"
        type="date"
      >
    </label>

    <label>
      Horário

      <input
        id="bookingTime"
        type="time"
        min="07:00"
        max="19:00"
      >
    </label>

    <button
      class="primary full"
      onclick="sendBooking()"
    >
      Continuar pelo WhatsApp
    </button>
  `);
}

function sendBooking() {
  const service =
    document.getElementById("bookingService")?.value;

  const date =
    document.getElementById("bookingDate")?.value;

  const time =
    document.getElementById("bookingTime")?.value;

  if (!service || !date || !time) {
    alert("Preencha serviço, data e horário.");
    return;
  }

  const message =
    `Olá, Débora! Gostaria de agendar:\n` +
    `${service}\n` +
    `Data: ${date}\n` +
    `Horário: ${time}`;

  window.open(
    `https://wa.me/5531972084333?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}

document
  .getElementById("modal")
  ?.addEventListener("click", event => {
    if (event.target.id === "modal") {
      closeModal();
    }
  });

document
.getElementById("loginBtn")
?.addEventListener("click", () => {

 window.vipLogin = async function () {
  const email = document.getElementById("vipEmail")?.value.trim();
  const password = document.getElementById("vipPassword")?.value;

  if (!email || !password) {
    alert("Preencha seu e-mail e sua senha.");
    return;
  }

  const client = window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.publishableKey
  );

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("E-mail ou senha incorretos.");
    return;
  }

  const user = data.user;

  // Procura o cadastro da cliente
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

  // Se a conta foi criada antes da confirmação de e-mail ser desligada,
  // cria o cadastro na tabela Clientes agora.
  if (!cliente) {
    const nome = email.split("@")[0];

    const { data: novoCliente, error: novoClienteError } = await client
      .from("Clientes")
      .insert({
        nome: nome,
        whatsapp: "",
        email: email,
        user_id: user.id
      })
      .select("id, nome, whatsapp, email")
      .single();

    if (novoClienteError) {
      console.error(novoClienteError);
      alert("Entrou na conta, mas não foi possível criar seu cadastro.");
      return;
    }

    cliente = novoCliente;
  }

  // Procura os pontos VIP
  let { data: vip, error: vipError } = await client
    .from("vip_fidelidade")
    .select("pontos, beneficio_usado, data_expiracao")
    .eq("cliente_id", cliente.id)
    .maybeSingle();

  if (vipError) {
    console.error(vipError);
  }

  // Se ainda não tiver cartão VIP, cria com 0 pontos
  if (!vip) {
    const { data: novoVip, error: novoVipError } = await client
      .from("vip_fidelidade")
      .insert({
        cliente_id: cliente.id,
        pontos: 0,
        beneficio_usado: false
      })
      .select("pontos, beneficio_usado, data_expiracao")
      .single();

    if (!novoVipError) {
      vip = novoVip;
    }
  }

  // Atualiza o nome mostrado na Área VIP
  const welcomeTitle = document.getElementById("vipWelcomeTitle");

  if (welcomeTitle) {
    welcomeTitle.innerHTML =
      `Olá, ${cliente.Nome || "Cliente VIP"}! 💝`;
  }

  // Atualiza os pontos mostrados no painel
  const vipStats = document.querySelectorAll(".vip-stat");

  if (vipStats[1]) {
    const points = vip?.pontos || 0;
    const pointsText = vipStats[1].querySelector("strong");

    if (pointsText) {
      pointsText.textContent = `${points} pts`;
    }
  }

  closeModal();

  if (cliente.is_admin) {
    await window.abrirAreaDebora();
  } else {
    document.querySelector("#vip")?.scrollIntoView({
      behavior: "smooth"
    });
  }

  alert("Bem-vinda à sua Área VIP! 💗");
}; 

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

    const client = window.supabase.createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.publishableKey
    );

    const { data, error } = await client.auth.signUp({
      email,
      password
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      const { data: existente } = await client
        .from("Clientes")
        .select("id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (!existente) {
        const novoId = Date.now();
        const { data: novoCliente, error: clienteError } = await client
          .from("Clientes")
          .insert({
            id: novoId,
            nome,
            whatsapp,
            email,
            user_id: data.user.id
          })
          .select("id")
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
    }

    alert("Cadastro realizado com sucesso! 💗");
    closeModal();
  };

  showModal(`
    <h2>Área VIP</h2>

    <p class="muted">
      Entre na sua conta ou crie seu cadastro VIP.
    </p>

    <h3>Entrar</h3>

    <label>
      E-mail
      <input id="vipEmail" type="email" placeholder="Seu e-mail">
    </label>

    <label>
      Senha
      <input id="vipPassword" type="password" placeholder="Sua senha">
    </label>

    <button class="primary full" onclick="vipLogin()">
      ENTRAR NA ÁREA VIP
    </button>

    <hr>

    <h3>Criar minha conta VIP</h3>

    <label>
      Nome
      <input id="vipNome" type="text" placeholder="Seu nome">
    </label>

    <label>
      WhatsApp
      <input id="vipWhatsApp" type="tel" placeholder="Seu WhatsApp">
    </label>

    <label>
      E-mail
      <input id="vipEmailCadastro" type="email" placeholder="Seu e-mail">
    </label>

    <label>
      Senha
      <input id="vipPasswordCadastro" type="password" placeholder="Crie uma senha">
    </label>

    <button class="primary full" onclick="vipCadastro()">
      CRIAR CONTA VIP
    </button>
  `);

}); 

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
  const titulo = document.getElementById("promoTitulo")?.value.trim();
  const descricao = document.getElementById("promoDescricao")?.value.trim();
  const preco = document.getElementById("promoPreco")?.value;
  const inicio = document.getElementById("promoInicio")?.value || null;
  const fim = document.getElementById("promoFim")?.value || null;
  if (!titulo) return alert("Informe o título da promoção.");
  const client = adminClient();
  const { error } = await client.from("promocoes").insert({ titulo, descricao, preco_promocional: preco === "" ? null : Number(preco), data_inicio: inicio, data_fim: fim, ativo: true });
  if (error) return alert("Não foi possível criar a promoção.");
  alert("Promoção criada! 💗");
  renderAdminPromocoes();
};

window.adminDesativarPromocao = async function (id) {
  const client = adminClient();
  const { error } = await client.from("promocoes").update({ ativo:false }).eq("id", id);
  if (error) return alert("Não foi possível desativar a promoção.");
  renderAdminPromocoes();
};

async function renderAdminPromocoes() {
  const conteudo = document.getElementById("adminConteudo");
  if (!conteudo) return;
  conteudo.innerHTML = `<h3>🎀 Promoções</h3>
    <input id="promoTitulo" placeholder="Título da promoção">
    <input id="promoDescricao" placeholder="Descrição">
    <input id="promoPreco" type="number" step="0.01" placeholder="Preço promocional">
    <label>Início<input id="promoInicio" type="date"></label>
    <label>Fim<input id="promoFim" type="date"></label>
    <button class="primary small" onclick="adminAdicionarPromocao()">Criar promoção</button>
    <div id="listaPromosAdmin" style="margin-top:18px">Carregando...</div>`;
  const client = adminClient();
  const { data, error } = await client.from("promocoes").select("id,titulo,descricao,preco_promocional,data_inicio,data_fim,ativo").order("created_at", {ascending:false});
  if (error) { document.getElementById("listaPromosAdmin").textContent = "Não foi possível carregar as promoções."; return; }
  document.getElementById("listaPromosAdmin").innerHTML = (data || []).map(r => `
    <div style="padding:12px;border-bottom:1px solid #eee;"><strong>${r.titulo}</strong><br>${r.descricao || ""}${r.preco_promocional != null ? `<br>${money(Number(r.preco_promocional))}` : ""}<br>Status: ${r.ativo ? "Ativa" : "Inativa"} ${r.ativo ? `<button class="primary small" onclick="adminDesativarPromocao(${r.id})">Desativar</button>` : ""}</div>`).join("") || "Nenhuma promoção cadastrada.";
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
  const titulos = { horarios:"📅 Horários", precos:"💰 Preços", fotos:"📸 Fotos", promocoes:"🎀 Promoções", vip:"⭐ VIP Fidelidade", agendamentos:"📋 Agendamentos" };
  const container = area.querySelector(".admin-container") || area;
  if (!container.querySelector(".admin-tabs")) {
    const atual = document.getElementById("adminConteudo");
    if (atual && atual.parentElement === container) {
      atual.insertAdjacentHTML("beforebegin", adminBotoes());
    } else {
      container.insertAdjacentHTML("beforeend", adminBotoes());
    }
  }

  let atual = document.getElementById("adminConteudo");
  if (!atual) {
    atual = document.createElement("div");
    atual.id = "adminConteudo";
    container.appendChild(atual);
  }
  const carregadores = { horarios:renderAdminHorarios, precos:renderAdminPrecos, fotos:renderAdminFotos, promocoes:renderAdminPromocoes, vip:renderAdminVip, agendamentos:renderAdminAgendamentos };
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

carregarPrecosPublicos();
