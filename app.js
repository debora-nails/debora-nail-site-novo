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
    showModal(`
      <h2>Área VIP</h2>

      <p class="muted">
        A área de cliente será conectada ao Supabase na próxima etapa.
      </p>

      <button
        class="primary full"
        onclick="closeModal()"
      >
        Entendi
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
