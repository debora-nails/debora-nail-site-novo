const SERVICES = [
  {
    name: "Alongamento Mold F1",
    price: 135,
    description: "Alongamento construído com molde F1, estrutura personalizada e acabamento elegante.",
    images: [
      "imagens/mold-f1-1.jpeg",
      "imagens/mold-f1-2.jpeg"
    ]
  },
  {
    name: "Alongamento Fibra de Vidro",
    price: 140,
    description: "Alongamento com fibra de vidro, resultado delicado, estruturado e personalizado.",
    images: [
      "imagens/fibra-1.jpeg",
      "imagens/fibra-2.jpeg"
    ]
  },
  {
    name: "Banho de Gel",
    price: 80,
    description: "Aplicação de gel sobre a unha natural para reforçar estrutura e acabamento.",
    images: [
      "imagens/banho-gel-1.jpeg",
      "imagens/banho-gel-2.jpeg"
    ]
  },
  {
    name: "Postiça Realista",
    price: 35,
    description: "Visual natural e acabamento delicado, uma opção prática para suas unhas.",
    images: [
      "imagens/postica-1.jpeg",
      "imagens/postica-2.jpeg",
      "imagens/postica-3.jpeg"
    ]
  },
  {
    name: "Soft Gel",
    price: 40,
    description: "Alongamento com tips de gel, leve, uniforme e elegante.",
    images: [
      "imagens/soft-gel-1.jpeg",
      "imagens/soft-gel-2.jpeg"
    ]
  },
  {
    name: "Manicure",
    price: 24,
    description: "Cuidado das unhas das mãos, preparação, acabamento e esmaltação conforme escolha.",
    images: []
  },
  {
    name: "Pedicure",
    price: 24,
    description: "Cuidado das unhas dos pés, preparação, acabamento e esmaltação conforme escolha.",
    images: [
      "imagens/pedicure-1.jpeg"
    ]
  },
  {
    name: "Spa dos Pés",
    price: 50,
    description: "Cuidado e relaxamento para os pés, com pedicure incluso.",
    images: []
  },
  {
    name: "Plástica dos Pés",
    price: 65,
    description: "Cuidado especial para melhorar a aparência e a sensação de maciez dos pés.",
    images: [
      "imagens/plastica-pes-1.jpeg",
      "imagens/plastica-pes-2.jpeg"
    ]
  }
];


const WHATSAPP = "5531972084333";


function money(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}


/* SERVIÇOS */

function renderServices() {

  const grid = document.getElementById("servicesGrid");

  if (!grid) return;

  grid.innerHTML = SERVICES.map((service, index) => {

    const photos = service.images.length
      ? `
        <div class="service-images">
          ${service.images.map(image => `
            <img src="${image}" alt="${service.name}">
          `).join("")}
        </div>
      `
      : "";

    return `
      <article class="service-card">

        ${photos}

        <div class="service-content">

          <h3>${service.name}</h3>

          <p>${service.description}</p>

          <div class="service-bottom">

            <strong>${money(service.price)}</strong>

            <button
              class="main-button small"
              onclick="openBooking(${index})">
              Agendar
            </button>

          </div>

        </div>

      </article>
    `;

  }).join("");
}


/* GALERIA */

function renderGallery() {

  const grid = document.getElementById("galleryGrid");

  if (!grid) return;

  const photos = [];

  SERVICES.forEach(service => {

    service.images.forEach(image => {

      photos.push({
        image,
        name: service.name
      });

    });

  });


  grid.innerHTML = photos.map(photo => `
    <figure>

      <img
        src="${photo.image}"
        alt="${photo.name}"
      >

      <figcaption>
        ${photo.name}
      </figcaption>

    </figure>
  `).join("");
}


/* MODAL */

function showModal(content) {

  const modal = document.getElementById("modal");
  const box = document.getElementById("modalContent");

  if (!modal || !box) return;

  box.innerHTML = `
    <button
      class="close-modal"
      onclick="closeModal()">
      ×
    </button>

    ${content}
  `;

  modal.classList.add("show");
}


function closeModal() {

  document
    .getElementById("modal")
    ?.classList.remove("show");

}


/* VIP */

function openVip() {

  showModal(`

    <h2>Área VIP ♡</h2>

    <p>
      Entre na sua área exclusiva para acompanhar
      seus pontos, benefícios e atendimentos.
    </p>

    <label>
      E-mail

      <input
        type="email"
        id="loginEmail"
        placeholder="Seu e-mail"
      >
    </label>

    <label>
      Senha

      <input
        type="password"
        id="loginPassword"
        placeholder="Sua senha"
      >
    </label>

    <button
      class="main-button full"
      onclick="loginClient()">
      ENTRAR
    </button>

    <button
      class="outline-button full"
      onclick="registerClient()">
      QUERO SER CLIENTE VIP
    </button>

  `);
}


async function loginClient() {

  const email =
    document.getElementById("loginEmail")?.value;

  const password =
    document.getElementById("loginPassword")?.value;


  if (!email || !password) {

    alert("Preencha seu e-mail e sua senha.");

    return;
  }


  if (!window.supabase || !SUPABASE_CONFIG) {

    alert("A conexão com a Área VIP ainda não foi configurada.");

    return;
  }


  const client = window.supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey
  );


  const { error } =
    await client.auth.signInWithPassword({
      email,
      password
    });


  if (error) {

    alert("E-mail ou senha incorretos.");

    return;
  }


  closeModal();

  await loadVip();

  alert("Bem-vinda à sua Área VIP! 💗");

}


/* CADASTRO */

function registerClient() {

  showModal(`

    <h2>Criar minha conta ♡</h2>

    <p>
      Preencha seus dados para acessar o Clube VIP.
    </p>

    <label>
      Nome

      <input
        id="registerName"
        type="text"
        placeholder="Seu nome"
      >
    </label>

    <label>
      WhatsApp

      <input
        id="registerWhatsapp"
        type="tel"
        placeholder="Seu WhatsApp"
      >
    </label>

    <label>
      E-mail

      <input
        id="registerEmail"
        type="email"
        placeholder="Seu e-mail"
      >
    </label>

    <label>
      Senha

      <input
        id="registerPassword"
        type="password"
        placeholder="Crie uma senha"
      >
    </label>

    <button
      class="main-button full"
      onclick="createAccount()">
      CRIAR MINHA CONTA
    </button>

  `);
}


async function createAccount() {

  const name =
    document.getElementById("registerName")?.value;

  const whatsapp =
    document.getElementById("registerWhatsapp")?.value;

  const email =
    document.getElementById("registerEmail")?.value;

  const password =
    document.getElementById("registerPassword")?.value;


  if (!name || !whatsapp || !email || !password) {

    alert("Preencha todos os campos.");

    return;
  }


  const client = getSupabase();

  if (!client) return;


  const { data, error } =
    await client.auth.signUp({
      email,
      password
    });


  if (error) {

    alert(error.message);

    return;
  }


  if (!data.user) {

    alert(
      "Verifique seu e-mail para confirmar o cadastro."
    );

    return;
  }


  const { error: clientError } =
    await client
      .from("Clientes")
      .insert({
        Nome: name,
        whatsapp: whatsapp,
        email: email,
        user_id: data.user.id
      });


  if (clientError) {

    console.error(clientError);

    alert(
      "A conta foi criada, mas houve um problema ao salvar seus dados."
    );

    return;
  }


  await client
    .from("vip_fidelidade")
    .insert({
      cliente_id: await getClientId(data.user.id),
      pontos: 0,
      beneficio_usado: false
    });


  closeModal();

  alert(
    "Cadastro realizado com sucesso! 💗"
  );

  await loadVip();
}


/* SUPABASE */

function getSupabase() {

  if (
    !window.supabase ||
    typeof SUPABASE_CONFIG === "undefined"
  ) {

    alert(
      "A conexão com o sistema ainda não foi configurada."
    );

    return null;
  }


  return window.supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey
  );
}


async function getClientId(userId) {

  const client = getSupabase();

  if (!client) return null;


  const { data } =
    await client
      .from("Clientes")
      .select("id")
      .eq("user_id", userId)
      .single();


  return data?.id || null;
}


/* VIP */

async function loadVip() {

  const client = getSupabase();

  if (!client) return;


  const {
    data: {
      user
    }
  } = await client.auth.getUser();


  if (!user) return;


  const { data: clientData } =
    await client
      .from("Clientes")
      .select("*")
      .eq("user_id", user.id)
      .single();


  if (!clientData) return;


  const { data: vip } =
    await client
      .from("vip_fidelidade")
      .select("*")
      .eq("cliente_id", clientData.id)
      .single();


  if (!vip) return;


  const points =
    Number(vip.pontos || 0);


  const pointsElement =
    document.getElementById("vipPoints");

  if (pointsElement) {

    pointsElement.textContent =
      `${points} pts`;

  }


  const benefitElement =
    document.getElementById("vipBenefit");

  if (benefitElement) {

    benefitElement.textContent =
      points >= 10 ? "60%" : "0";

  }


  const nameElement =
    document.querySelector(".vip-intro h2");

  if (nameElement) {

    nameElement.textContent =
      `Olá, ${clientData.Nome}! 💗`;

  }

}


/* AGENDAMENTO */

function openBooking(index = null) {

  const selected =
    index !== null
      ? SERVICES[index].name
      : "";


  showModal(`

    <h2>Agendar atendimento</h2>

    <p>
      Escolha o serviço, a data e o horário.
    </p>

    <label>
      Serviço

      <select id="bookingService">

        <option value="">
          Selecione um serviço
        </option>

        ${SERVICES.map(service => `
          <option
            ${service.name === selected ? "selected" : ""}>
            ${service.name}
          </option>
        `).join("")}

      </select>

    </label>


    <label>
      Data

      <input
        type="date"
        id="bookingDate"
      >
    </label>


    <label>
      Horário

      <input
        type="time"
        id="bookingTime"
        min="07:00"
        max="19:00"
      >
    </label>


    <button
      class="main-button full"
      onclick="confirmBooking()">
      CONFIRMAR AGENDAMENTO
    </button>

  `);
}


async function confirmBooking() {

  const service =
    document.getElementById("bookingService")?.value;

  const date =
    document.getElementById("bookingDate")?.value;

  const time =
    document.getElementById("bookingTime")?.value;


  if (!service || !date || !time) {

    alert(
      "Escolha o serviço, a data e o horário."
    );

    return;
  }


  const client = getSupabase();

  if (!client) return;


  const {
    data: {
      user
    }
  } = await client.auth.getUser();


  if (!user) {

    alert(
      "Entre na Área VIP para realizar seu agendamento."
    );

    openVip();

    return;
  }


  const clienteId =
    await getClientId(user.id);


  if (!clienteId) {

    alert(
      "Não encontramos seu cadastro."
    );

    return;
  }


  const { error } =
    await client
      .from("agendamentos")
      .insert({
        cliente_id: clienteId,
        servico: service,
        data: date,
        horario: time,
        status: "confirmado"
      });


  if (error) {

    if (
      error.code === "23505"
    ) {

      alert(
        "Esse horário acabou de ser ocupado. Escolha outro horário."
      );

    } else {

      console.error(error);

      alert(
        "Não foi possível realizar o agendamento."
      );

    }

    return;
  }


  const message = `
Olá, Débora! 💗

Meu agendamento foi realizado pelo site.

Serviço: ${service}
Data: ${date}
Horário: ${time}
  `.trim();


  closeModal();


  window.open(
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,
    "_blank"
  );

}


/* HISTÓRICO */

async function showHistory() {

  const client = getSupabase();

  if (!client) return;


  const {
    data: {
      user
    }
  } = await client.auth.getUser();


  if (!user) {

    openVip();

    return;
  }


  const clienteId =
    await getClientId(user.id);


  const { data, error } =
    await client
      .from("agendamentos")
      .select("*")
      .eq("cliente_id", clienteId)
      .order("data", {
        ascending: false
      });


  if (error) {

    alert(
      "Não foi possível carregar seu histórico."
    );

    return;
  }


  let content = `
    <h2>Meus atendimentos ♡</h2>
  `;


  if (!data || !data.length) {

    content += `
      <p>
        Você ainda não possui atendimentos registrados.
      </p>
    `;

  } else {

    content += data.map(item => `

      <div style="
        border:1px solid #ead8d5;
        border-radius:12px;
        padding:14px;
        margin:10px 0;
      ">

        <strong>
          ${item.servico}
        </strong>

        <br>

        <small>
          ${item.data} às ${item.horario}
        </small>

        <br>

        <small>
          Status: ${item.status || "confirmado"}
        </small>

      </div>

    `).join("");

  }


  showModal(content);
}


/* BENEFÍCIOS */

function showBenefits() {

  showModal(`

    <h2>Vantagens do Clube VIP ♡</h2>

    <p>
      A cada procedimento realizado, você acumula
      pontos no seu Clube VIP.
    </p>

    <div style="
      background:#fff0ec;
      padding:18px;
      border-radius:15px;
      margin-top:15px;
    ">

      <strong>♡ 1 ponto</strong>

      <p>
        A cada procedimento/visita.
      </p>

      <strong>♢ 10 pontos</strong>

      <p>
        Ganhe 60% de desconto em qualquer procedimento.
      </p>

      <strong>⏰ Prazo</strong>

      <p>
        Após alcançar 10 pontos, você tem 45 dias
        para utilizar o benefício.
      </p>

    </div>

  `);
}


/* AVISOS */

function showNews() {

  showModal(`

    <h2>Avisos e novidades ♡</h2>

    <p>
      Fique de olho por aqui para acompanhar
      novidades, promoções e informações especiais
      da Débora Nail.
    </p>

    <p>
      Para novidades em primeira mão, acompanhe
      também o Instagram:
    </p>

    <a
      class="main-button"
      href="https://www.instagram.com/perfectlynails02"
      target="_blank">
      @perfectlynails02
    </a>

  `);
}


/* MENU */

document
  .getElementById("menuBtn")
  ?.addEventListener("click", () => {

    document
      .getElementById("nav")
      ?.classList.toggle("open");

  });


/* FECHAR MODAL */

document
  .getElementById("modal")
  ?.addEventListener("click", event => {

    if (event.target.id === "modal") {
      closeModal();
    }

  });


/* INICIALIZAÇÃO */

renderServices();
renderGallery();

loadVip();
