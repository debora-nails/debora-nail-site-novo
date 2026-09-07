const SERVICES = [
  ["Alongamento Mold F1",135,"Alongamento construído com molde F1, estrutura personalizada e acabamento elegante.",["imagens/mold-f1-1.jpeg","imagens/mold-f1-2.jpeg"]],

  ["Alongamento Fibra de Vidro",140,"Alongamento com fibra de vidro, resultado delicado, estruturado e personalizado.",["imagens/fibra-1.jpeg","imagens/fibra-2.jpeg"]],

  ["Banho de Gel",80,"Aplicação de gel sobre a unha natural para reforçar estrutura e acabamento.",["imagens/banho-gel-1.jpeg","imagens/banho-gel-2.jpeg"]],

  ["Postiça Realista",35,"Visual natural e acabamento delicado, uma opção prática para suas unhas.",["imagens/postica-1.jpeg","imagens/postica-2.jpeg","imagens/postica-3.jpeg"]],

  ["Soft Gel",40,"Alongamento com tips de gel, leve, uniforme e elegante.",["imagens/soft-gel-1.jpeg","imagens/soft-gel-2.jpeg"]],

  ["Manicure",24,"Cuidado das unhas das mãos, preparação, acabamento e esmaltação conforme escolha.",[]],

  ["Pedicure",24,"Cuidado das unhas dos pés, preparação, acabamento e esmaltação conforme escolha.",["imagens/pedicure-1.jpeg"]],

  ["Spa dos Pés",50,"Cuidado e relaxamento para os pés, com pedicure incluso.",[]],

  ["Plástica dos Pés",65,"Cuidado especial para melhorar a aparência e a sensação de maciez dos pés.",["imagens/plastica-pes-1.jpeg","imagens/plastica-pes-2.jpeg"]]
];

const grid = document.getElementById("servicesGrid");
const galleryGrid = document.getElementById("galleryGrid");

const money = v =>
  v.toLocaleString("pt-BR", {
    style:"currency",
    currency:"BRL"
  });

function renderServices(){

  if(!grid) return;

  grid.innerHTML = SERVICES.map((s,i) => `

    <article class="service-card">

      <div class="service-number">
        0${i+1}
      </div>

      ${
        s[3].length
        ?
        `
        <div class="service-images">
          ${s[3].map(x => `
            <img
              src="${x}"
              alt="${s[0]}"
            >
          `).join("")}
        </div>
        `
        :
        ""
      }

      <div class="service-content">

        <h3>${s[0]}</h3>

        <p>${s[2]}</p>

        <div class="service-bottom">

          <strong>${money(s[1])}</strong>

          <button
            class="primary small"
            onclick="openBooking(${i})"
          >
            Agendar
          </button>

        </div>

      </div>

    </article>

  `).join("");
}

function renderGallery(){

  if(!galleryGrid) return;

  const all = SERVICES.flatMap(
    s =>
      s[3].map(
        img => ({
          img,
          name:s[0]
        })
      )
  );

  galleryGrid.innerHTML = all.map(
    x => `

      <figure>

        <img
          src="${x.img}"
          alt="${x.name}"
        >

        <figcaption>
          ${x.name}
        </figcaption>

      </figure>

    `
  ).join("");
}

function showModal(html){

  document.getElementById("modalContent").innerHTML = html;

  document
    .getElementById("modal")
    .classList.add("show");
}

function closeModal(){

  document
    .getElementById("modal")
    .classList.remove("show");
}

function openBooking(i=null){

  showModal(`

    <h2>Agendar horário</h2>

    <p class="muted">
      Escolha o serviço e continue pelo WhatsApp para confirmar.
    </p>

    <label>
      Serviço

      <select id="bookingService">

        ${SERVICES.map(
          (s,n) => `
            <option ${n===i ? "selected" : ""}>
              ${s[0]} — ${money(s[1])}
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

function sendBooking(){

  const s =
    document.getElementById("bookingService")?.value;

  const d =
    document.getElementById("bookingDate")?.value;

  const t =
    document.getElementById("bookingTime")?.value;

  if(!s || !d || !t){

    alert(
      "Preencha serviço, data e horário."
    );

    return;
  }

  window.open(
    `https://wa.me/5531972084333?text=${
      encodeURIComponent(
        `Olá, Débora! Gostaria de agendar:\n${s}\nData: ${d}\nHorário: ${t}`
      )
    }`,
    "_blank"
  );
}

document
  .getElementById("modal")
  ?.addEventListener(
    "click",
    e => {

      if(e.target.id === "modal"){
        closeModal();
      }

    }
  );

document
  .getElementById("loginBtn")
  ?.addEventListener(
    "click",
    () => {

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

    }
  );

document
  .getElementById("menuBtn")
  ?.addEventListener(
    "click",
    () => {

      document
        .getElementById("nav")
        .classList.toggle("open");

    }
  );

renderServices();

renderGallery();
