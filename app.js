const SERVICES = [
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
    .select('id, "nome", whatsapp, email')
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
      .select('id, "nome", whatsapp, email')
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

  document.querySelector("#vip")?.scrollIntoView({
    behavior: "smooth"
  });

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

    if (data.user && data.session) {
      await client.from("Clientes").insert({
        Nome: nome,
        whatsapp: whatsapp,
        email: email,
        user_id: data.user.id
      });
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

window.abrirAreaDebora = function () {
  const area = document.getElementById("areaDebora");

  if (area) {
    area.style.display = "block";
    area.scrollIntoView({
      behavior: "smooth"
    });
  }
};

window.abrirAdminAba = function (aba) {
  const conteudo = document.getElementById("adminConteudo");

  if (!conteudo) return;

  const titulos = {
    horarios: "📅 Horários",
    precos: "💰 Preços",
    fotos: "📸 Fotos",
    promocoes: "🎀 Promoções",
    vip: "⭐ VIP Fidelidade",
    agendamentos: "📋 Agendamentos"
  };

  conteudo.innerHTML = `
    <div class="admin-boas-vindas">
      <span>♡</span>
      <h3>${titulos[aba] || "Área da Débora"}</h3>
      <p>Esta área será configurada no próximo passo.</p>
    </div>
  `;
};

window.sairAdmin = async function () {
  const client = window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.publishableKey
  );

  await client.auth.signOut();

  const area = document.getElementById("areaDebora");

  if (area) {
    area.style.display = "none";
  }

  alert("Você saiu da Área da Débora.");
};
