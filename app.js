const SERVICES = [
  [
    "Alongamento Mold F1",
    135,
    "Alongamento construído com molde F1, estrutura personalizada e acabamento elegante.",
    ["imagens/mold-f1-1.jpeg", "imagens/mold-f1-2.jpeg"]
  ],
  [
    "Alongamento Fibra de Vidro",
    140,
    "Alongamento com fibra de vidro, resultado delicado, estruturado e personalizado.",
    ["imagens/fibra-1.jpeg", "imagens/fibra-2.jpeg"]
  ],
  [
    "Banho de Gel",
    80,
    "Aplicação de gel sobre a unha natural para reforçar estrutura e acabamento.",
    ["imagens/banho-gel-1.jpeg", "imagens/banho-gel-2.jpeg"]
  ],
  [
    "Postiça Realista",
    35,
    "Visual natural e acabamento delicado, uma opção prática para suas unhas.",
    [
      "imagens/postica-1.jpeg",
      "imagens/postica-2.jpeg",
      "imagens/postica-3.jpeg"
    ]
  ],
  [
    "Soft Gel",
    40,
    "Alongamento com tips de gel, leve, uniforme e elegante.",
    ["imagens/soft-gel-1.jpeg", "imagens/soft-gel-2.jpeg"]
  ],
  [
    "Manicure",
    24,
    "Cuidado das unhas das mãos, preparação, acabamento e esmaltação conforme escolha.",
    []
  ],
  [
    "Pedicure",
    24,
    "Cuidado das unhas dos pés, preparação, acabamento e esmaltação conforme escolha.",
    ["imagens/pedicure-1.jpeg"]
  ],
  [
    "Spa dos Pés",
    50,
    "Cuidado e relaxamento para os pés, com pedicure incluso.",
    []
  ],
  [
    "Plástica dos Pés",
    65,
    "Cuidado especial para melhorar a aparência e a sensação de maciez dos pés.",
    ["imagens/plastica-pes-1.jpeg", "imagens/plastica-pes-2.jpeg"]
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

  grid.innerHTML = SERVICES.map((service, index) => `
    <article class="service-card">

      <div class="service-number">
        ${String(index + 1).padStart(2, "0")}
      </div>

      ${
        service[3].length
          ? `
            <div class="service-images">
              ${service[3]
                .map(
                  image => `
                    <img
                      src="${image}"
                      alt="${service[0]}"
                    >
                  `
                )
                .join("")}
            </div>
          `
          : ""
      }

      <div class="service-content">

        <h3>${service[0]}</h3>

        <p>${service[2]}</p>

        <div class="service-bottom">

          <strong>
            ${money(service[1])}
          </strong>

          <button
            class="primary small"
            onclick="openBooking(${index})">
            Agendar
          </button>

        </div>

      </div>

    </article>
  `).join("");
}


function renderGallery() {
  if (!galleryGrid) return;

  const photos = SERVICES.flatMap(service =>
    service[3].map(image => ({
      image,
      name: service[0]
    }))
  );

  galleryGrid.innerHTML = photos
    .map(photo => `
      <figure>

        <img
          src="${photo.image}"
          alt="${photo.name}"
        >

        <figcaption>
          ${photo.name}
        </figcaption>

      </figure>
    `)
    .join("");
}


function showModal(content) {
  const modalContent = document.getElementById("modalContent");
  const modal = document.getElementById("modal");

  if (!modalContent || !modal) return;

  modalContent.innerHTML = content;
  modal.classList.add("show");
}


function closeModal() {
  document.getElementById("modal")?.classList.remove("show");
}


function openBooking(index = null) {

  showModal(`

    <h2>Agendar horário</h2>

    <p>
      Escolha o serviço, a data e o horário desejado.
    </p>

    <label>
      Serviço

      <select id="bookingService">

        ${SERVICES
          .map(
            (service, number) => `
              <option
                ${number === index ? "selected" : ""}
              >
                ${service[0]} — ${money(service[1])}
              </option>
            `
          )
          .join("")}

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
      onclick="sendBooking()">

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

    alert(
      "Preencha o serviço, a data e o horário."
    );

    return;
  }


  const message = `
Olá, Débora! 💗

Gostaria de agendar:

Serviço: ${service}
Data: ${date}
Horário: ${time}
  `.trim();


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

      <h2>Área VIP ♡</h2>

      <p>
        Em breve você poderá acessar sua
        área exclusiva, acompanhar seus pontos
        e consultar seus benefícios.
      </p>

      <button
        class="primary full"
        onclick="closeModal()">

        Entendi

      </button>

    `);

  });


document
  .getElementById("loginBtn2")
  ?.addEventListener("click", () => {

    document
      .getElementById("loginBtn")
      ?.click();

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
