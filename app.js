/* Débora Aparecida Nail Design — versão conectada ao Supabase */
const SERVICES = [
  ['Alongamento Mold F1',135,'Alongamento construído com molde F1, com estrutura personalizada e acabamento elegante.'],
  ['Alongamento Fibra de Vidro',140,'Técnica de alongamento com fibra de vidro para um resultado delicado, estruturado e personalizado.'],
  ['Banho de Gel',80,'Aplicação de gel sobre a unha natural para reforçar a estrutura e deixar um acabamento bonito.'],
  ['Postiça Realista',35,'Unhas com visual natural e acabamento delicado, uma opção prática para o dia a dia.'],
  ['Soft Gel',40,'Alongamento com tips de gel, com resultado leve, uniforme e elegante.'],
  ['Manicure',24,'Cuidado das unhas das mãos, preparação, acabamento e esmaltação conforme escolha.'],
  ['Pedicure',24,'Cuidado das unhas dos pés, preparação, acabamento e esmaltação conforme escolha.'],
  ['Spa dos Pés',50,'Momento de cuidado e relaxamento para os pés, com pedicure incluso.'],
  ['Plástica dos Pés',65,'Cuidado especial para deixar os pés com aparência mais cuidada e sensação de maciez.']
];

const { createClient } = window.supabase;
const cfg = window.SUPABASE_CONFIG || {};
const supabaseReady = cfg.url && cfg.publishableKey && !cfg.publishableKey.includes('COLE_AQUI');
const supabase = supabaseReady ? createClient(cfg.url, cfg.publishableKey) : null;
let currentUser = null;
let currentClient = null;

const SERVICE_IMAGES = {
  0:['imagens/mold-f1-1.jpeg','imagens/mold-f1-2.jpeg'],
  1:['imagens/fibra-1.jpeg','imagens/fibra-2.jpeg'],
  2:['imagens/banho-gel-1.jpeg','imagens/banho-gel-2.jpeg'],
  3:['imagens/postica-1.jpeg','imagens/postica-2.jpeg','imagens/postica-3.jpeg'],
  4:['imagens/soft-gel-1.jpeg','imagens/soft-gel-2.jpeg'],
  6:['imagens/pedicure-1.jpeg'],
  8:['imagens/plastica-pes-1.jpeg','imagens/plastica-pes-2.jpeg']
};

const servicesGrid=document.getElementById('servicesGrid');

servicesGrid.innerHTML=SERVICES.map((s,i)=>{
  const imgs=SERVICE_IMAGES[i]||[];
  const preview=imgs.length
    ? `<div class="service-images">${imgs.slice(0,2).map(src=>`<img src="${src}" alt="Exemplo de ${s[0]}" loading="lazy">`).join('')}</div>`
    : '';

  return `
    <article class="service">
      ${preview}
      <h3>${s[0]}</h3>
      <p>${s[2]}</p>

      <div class="price">
        <span>R$ ${s[1].toFixed(2).replace('.',',')}</span>
        <small>esmaltação em gel e decoração sem custo adicional</small>
      </div>

      <button
        class="btn btn-ghost service-book"
        data-i="${i}"
        style="margin-top:15px"
      >
        Agendar
      </button>
    </article>
  `;
}).join('');

const serviceSelect=document.getElementById('bookingService');

serviceSelect.innerHTML=
  '<option value="">Selecione</option>'+
  SERVICES.map((s,i)=>
    `<option value="${i}">${s[0]} — R$ ${s[1].toFixed(2).replace('.',',')}</option>`
  ).join('');

function openModal(id){
  document.getElementById(id).classList.add('open');
}

function closeModal(id){
  document.getElementById(id).classList.remove('open');
}

document.querySelectorAll('[data-close]').forEach(
  b=>b.onclick=()=>closeModal(b.dataset.close)
);

document.getElementById('openLogin').onclick=
  ()=>openModal('loginModal');

document.getElementById('heroVip').onclick=
  ()=>openModal('loginModal');

document.getElementById('vipLogin2').onclick=
  ()=>openModal('loginModal');

document.getElementById('heroBook').onclick=
  ()=>openBooking();

document.querySelectorAll('.service-book').forEach(
  b=>b.onclick=()=>{
    serviceSelect.value=b.dataset.i;
    openBooking();
  }
);

document.getElementById('showRegister').onclick=()=>{
  closeModal('loginModal');
  openModal('registerModal');
};

function message(id,text){
  const el=document.getElementById(id);
  el.textContent=text;
  el.classList.add('show');

  setTimeout(
    ()=>el.classList.remove('show'),
    5000
  );
}

function localToday(){
  const d=new Date();

  d.setMinutes(
    d.getMinutes()-d.getTimezoneOffset()
  );

  return d.toISOString().slice(0,10);
}

document.getElementById('bookingDate').min=localToday();

async function requireLogin(){

  if(!supabase){
    message(
      'bookingMessage',
      'O site ainda precisa receber a chave publicável do Supabase.'
    );

    return false;
  }

  const {
    data:{session}
  }=await supabase.auth.getSession();

  if(!session){

    closeModal('bookingModal');

    openModal('loginModal');

    message(
      'loginMessage',
      'Entre na sua conta para agendar seu horário. 💗'
    );

    return false;
  }

  currentUser=session.user;

  await loadClient();

  if(currentClient){

    document.getElementById('bookingName').value=
      currentClient.nome||'';

    document.getElementById('bookingPhone').value=
      currentClient.whatsapp||'';
  }

  return true;
}

async function openBooking(){

  if(await requireLogin()){

    openModal('bookingModal');

    await refreshTimes();
  }
}

async function ensureClientFromAuth(fallback={}){

  if(!supabase||!currentUser)
    return null;

  const existing=await loadClient();

  if(existing)
    return existing;

  const nome=
    fallback.nome||
    currentUser.user_metadata?.nome||
    currentUser.user_metadata?.name||
    '';

  const whatsapp=
    fallback.whatsapp||
    currentUser.user_metadata?.whatsapp||
    '';

  const email=
    fallback.email||
    currentUser.email||
    '';

  if(!nome)
    return null;

  const {
    data,
    error
  }=await supabase
    .from('clientes')
    .insert({
      nome,
      whatsapp,
      email,
      user_id:currentUser.id
    })
    .select()
    .single();

  if(error){
    console.error(error);
    return null;
  }

  currentClient=data;

  return data;
}

async function loadClient(){

  if(!supabase||!currentUser)
    return null;

  const {
    data,
    error
  }=await supabase
    .from('clientes')
    .select('*')
    .eq('user_id',currentUser.id)
    .maybeSingle();

  if(error){
    console.error(error);
    return null;
  }

  currentClient=data;

  return data;
}

async function refreshTimes(){

  const date=
    document.getElementById('bookingDate').value;

  const sel=
    document.getElementById('bookingTime');

  if(!date){

    sel.innerHTML=
      '<option value="">Selecione uma data</option>';

    return;
  }

  if(!supabase){

    sel.innerHTML=
      '<option value="">Configure o Supabase</option>';

    return;
  }

  const [
    {data:slots,error:sErr},
    {data:bookings,error:bErr}
  ]=await Promise.all([

    supabase
      .from('horarios')
      .select('horario')
      .eq('data',date)
      .eq('disponivel',true)
      .order('horario'),

    supabase
      .from('agendamentos')
      .select('horario')
      .eq('data',date)
      .neq('status','cancelado')
  ]);

  if(sErr||bErr){

    console.error(sErr||bErr);

    sel.innerHTML=
      '<option value="">Não foi possível carregar os horários</option>';

    return;
  }

  const booked=
    new Set(
      (bookings||[]).map(x=>x.horario)
    );

  const times=
    (slots||[])
      .map(x=>String(x.horario).slice(0,5))
      .filter(
        t=>
          !booked.has(t+':00') &&
          !booked.has(t)
      );

  sel.innerHTML=
    times.length
      ?
      '<option value="">Selecione</option>'+
      times.map(
        t=>`<option value="${t}">${t}</option>`
      ).join('')
      :
      '<option value="">Nenhum horário disponível</option>';
}

document.getElementById('bookingDate').onchange=
  refreshTimes;

document.getElementById('bookingForm').onsubmit=
  async e=>{

    e.preventDefault();

    if(!supabase||!currentUser){

      message(
        'bookingMessage',
        'Entre na sua conta para continuar.'
      );

      return;
    }

    await loadClient();

    if(!currentClient){

      message(
        'bookingMessage',
        'Seu cadastro ainda não foi encontrado. Saia e entre novamente.'
      );

      return;
    }

    const date=
      document.getElementById('bookingDate').value;

    const time=
      document.getElementById('bookingTime').value;

    const s=
      SERVICES[+serviceSelect.value];

    if(!date||!time||!s)
      return;

    const {error}=
      await supabase
        .from('agendamentos')
        .insert({
          cliente_id:currentClient.id,
          servico:s[0],
          data:date,
          horario:time,
          status:'confirmado'
        });

    if(error){

      if(error.code==='23505'){

        message(
          'bookingMessage',
          'Esse horário acabou de ser ocupado. Escolha outro.'
        );

      }else{

        console.error(error);

        message(
          'bookingMessage',
          'Não foi possível confirmar o agendamento. Tente novamente.'
        );
      }

      await refreshTimes();

      return;
    }

    message(
      'bookingMessage',
      'Agendamento confirmado! 💗 O horário ficou reservado para você.'
    );

    e.target.reset();

    document.getElementById('bookingDate').min=
      localToday();

    await refreshTimes();
  };

document.getElementById('registerForm').onsubmit=
  async e=>{

    e.preventDefault();

    if(!supabase){

      message(
        'registerMessage',
        'Primeiro precisamos conectar o site ao Supabase.'
      );

      return;
    }

    const nome=
      document.getElementById('regName').value.trim();

    const whatsapp=
      document.getElementById('regPhone').value.trim();

    const email=
      document.getElementById('regEmail').value.trim().toLowerCase();

    const password=
      document.getElementById('regPassword').value;

    const {
      data,
      error
    }=await supabase.auth.signUp({
      email,
      password,
      options:{
        data:{
          nome,
          whatsapp
        }
      }
    });

    if(error){

      message(
        'registerMessage',
        error.message
      );

      return;
    }

    const uid=data.user?.id;

    if(uid){

      const {error:pe}=
        await supabase
          .from('clientes')
          .insert({
            nome,
            whatsapp,
            email,
            user_id:uid
          });

      if(pe){

        console.error(pe);

        message(
          'registerMessage',
          'A conta foi criada, mas o cadastro de cliente precisa ser finalizado.'
        );

        return;
      }
    }

    closeModal('registerModal');

    if(data.session){

      currentUser=data.session.user;

      await loadClient();

      showVip(currentClient);

    }else{

      message(
        'loginMessage',
        'Cadastro criado! Verifique seu e-mail para confirmar a conta e depois entre no site. 💗'
      );
    }

    e.target.reset();
  };

document.getElementById('loginForm').onsubmit=
  async e=>{

    e.preventDefault();

    if(!supabase){

      message(
        'loginMessage',
        'Primeiro precisamos conectar o site ao Supabase.'
      );

      return;
    }

    const email=
      document
        .getElementById('loginEmail')
        .value
        .trim()
        .toLowerCase();

    const pass=
      document.getElementById('loginPassword').value;

    const {
      data,
      error
    }=await supabase.auth.signInWithPassword({
      email,
      password:pass
    });

    if(error){

      message(
        'loginMessage',
        'E-mail ou senha incorretos, ou a conta ainda não foi confirmada.'
      );

      return;
    }

    currentUser=data.user;

    await ensureClientFromAuth();

    await loadClient();

    closeModal('loginModal');

    showVip(currentClient);

    e.target.reset();
  };

async function showVip(c){

  if(!c){

    message(
      'loginMessage',
      'Seu cadastro ainda não foi encontrado.'
    );

    return;
  }

  const {data:vip}=
    await supabase
      .from('vip_fidelidade')
      .select('*')
      .eq('cliente_id',c.id)
      .maybeSingle();

  const points=
    Math.min(
      10,
      Math.max(
        0,
        vip?.pontos||0
      )
    );

  document.getElementById('vipWelcome').textContent=
    `Olá, ${c.nome.split(' ')[0]}! 💗`;

  document.getElementById('vipPoints').textContent=
    points;

  const dots=
    document.getElementById('vipDots');

  dots.innerHTML='';

  for(let i=0;i<10;i++){

    dots.innerHTML+=
      `<span class="dot ${i<points?'filled':''}">${i+1}</span>`;
  }

  const expired=
    vip?.data_expiracao &&
    new Date(
      vip.data_expiracao+'T23:59:59'
    )<new Date();

  document.getElementById('vipBenefit').textContent=
    points>=10&&!expired
      ?
      '🎉 Você tem 60% de desconto disponível! Use o benefício em até 45 dias após completar os 10 pontos.'
      :
      expired
        ?
        'O prazo do seu benefício terminou e os pontos precisam ser reiniciados.'
        :
        'Faltam '+(10-points)+' ponto(s) para liberar seu benefício de 60%.';

  document.getElementById('vipHistory').innerHTML=
    '<p class="tiny">Seu cartão mostra os pontos atuais. O histórico detalhado será ampliado no painel administrativo.</p>';

  openModal('vipModal');
}

document.getElementById('logoutBtn').onclick=
  async()=>{

    if(supabase)
      await supabase.auth.signOut();

    currentUser=null;
    currentClient=null;

    closeModal('vipModal');
  };

function renderDemoDots(){

  const d=
    document.getElementById('demoDots');

  d.innerHTML='';

  for(let i=0;i<10;i++){

    d.innerHTML+=
      `<span class="dot ${i<6?'filled':''}">${i+1}</span>`;
  }

  document.getElementById('demoPointText').textContent=
    '6 de 10 pontos';
}

renderDemoDots();

/* Admin: protegido pelo banco via is_admin(); não existe atalho público em produção. */

async function openAdmin(){

  if(!supabase)
    return;

  const {
    data:{session}
  }=await supabase.auth.getSession();

  if(!session){

    openModal('loginModal');

    return;
  }

  currentUser=session.user;

  await loadClient();

  if(!currentClient?.is_admin){

    message(
      'loginMessage',
      'Acesso administrativo não autorizado.'
    );

    return;
  }

  openModal('adminModal');

  await renderAdmin();

  await renderClients();
}

document.getElementById('adminDate').value=
  localToday();

document.getElementById('adminDate').onchange=
  renderAdmin;

document.getElementById('addTime').onclick=
  async()=>{

    const date=
      document.getElementById('adminDate').value;

    const time=
      document.getElementById('newTime').value;

    if(!date||!time)
      return;

    const {error}=
      await supabase
        .from('horarios')
        .upsert(
          {
            data:date,
            horario:time,
            disponivel:true
          },
          {
            onConflict:'data,horario'
          }
        );

    if(error){

      message(
        'bookingMessage',
        'Não foi possível adicionar o horário.'
      );

      console.error(error);

      return;
    }

    document.getElementById('newTime').value='';

    await renderAdmin();
  };

async function renderAdmin(){

  if(!supabase)
    return;

  const date=
    document.getElementById('adminDate').value;

  const [
    {data:slots},
    {data:bookings}
  ]=await Promise.all([

    supabase
      .from('horarios')
      .select('*')
      .eq('data',date)
      .order('horario'),

    supabase
      .from('agendamentos')
      .select(
        'id,servico,data,horario,status,cliente_id'
      )
      .eq('data',date)
      .order('horario')
  ]);

  document.getElementById('adminTimes').innerHTML=
    (slots||[])
      .map(
        x=>
          `<div class="time-row">
            <span>
              ${String(x.horario).slice(0,5)}
              ${x.disponivel?'— disponível':'— bloqueado'}
            </span>

            <button
              class="danger"
              data-remove-time="${x.id}"
            >
              Remover
            </button>
          </div>`
      )
      .join('')
      ||
      '<p class="tiny">Nenhum horário cadastrado para este dia.</p>';

  document.querySelectorAll('[data-remove-time]')
    .forEach(
      b=>
        b.onclick=
          async()=>{
            await supabase
              .from('horarios')
              .delete()
              .eq('id',b.dataset.removeTime);

            await renderAdmin();
          }
    );

  const ids=[
    ...new Set(
      (bookings||[])
        .map(x=>x.cliente_id)
    )
  ];

  let clients=[];

  if(ids.length){

    const r=
      await supabase
        .from('clientes')
        .select('id,nome,whatsapp')
        .in('id',ids);

    clients=r.data||[];
  }

  const map=
    new Map(
      clients.map(
        c=>[c.id,c]
      )
    );

  document.getElementById('adminBookings').innerHTML=
    (bookings||[])
      .map(
        b=>{

          const c=
            map.get(b.cliente_id)||{};

          return `
            <div class="booking-row">

              <span>
                <b>${String(b.horario).slice(0,5)}</b>
                — ${b.servico}

                <br>

                <small>
                  ${c.nome||''} • ${c.whatsapp||''}
                </small>
              </span>

              <button
                class="danger"
                data-cancel-book="${b.id}"
              >
                Cancelar
              </button>

            </div>
          `;
        }
      )
      .join('')
      ||
      '<p class="tiny">Nenhum agendamento.</p>';

  document.querySelectorAll('[data-cancel-book]')
    .forEach(
      b=>
        b.onclick=
          async()=>{
            await supabase
              .from('agendamentos')
              .delete()
              .eq('id',b.dataset.cancelBook);

            await renderAdmin();

            await refreshTimes();
          }
    );
}

async function renderClients(){

  if(!supabase)
    return;

  const {data}=
    await supabase
      .from('clientes')
      .select(
        'id,nome,email,whatsapp,is_admin'
      )
      .order('nome');

  const rows=data||[];

  const vips=
    rows.length
      ?
      (
        await supabase
          .from('vip_fidelidade')
          .select('cliente_id,pontos')
      ).data||[]
      :
      [];

  const vm=
    new Map(
      vips.map(
        v=>[v.cliente_id,v.pontos]
      )
    );

  document.getElementById('adminClients').innerHTML=
    rows
      .map(
        c=>
          `
          <div class="client-row">

            <div class="client-info">

              <b>${c.nome}</b>

              <small>
                ${c.email} • ${c.whatsapp}
              </small>

            </div>

            <div class="points-control">

              <button
                data-point="${c.id}"
                data-delta="-1"
              >
                −
              </button>

              <b>${vm.get(c.id)||0}</b>

              <button
                data-point="${c.id}"
                data-delta="1"
              >
                +
              </button>

            </div>

          </div>
          `
      )
      .join('')
      ||
      '<p class="tiny">Ainda não há clientes cadastradas.</p>';

  document.querySelectorAll('[data-point]')
    .forEach(
      b=>
        b.onclick=
          async()=>{

            const id=
              +b.dataset.point;

            const delta=
              +b.dataset.delta;

            const existing=
              vm.get(id)||0;

            const next=
              Math.max(
                0,
                Math.min(
                  10,
                  existing+delta
                )
              );

            const {error}=
              await supabase
                .from('vip_fidelidade')
                .upsert(
                  {
                    cliente_id:id,
                    pontos:next,
                    beneficio_usado:
                      next<10
                        ?false
                        :(existing>=10?false:false),
                    data_expiracao:
                      next>=10
                        ?
                        new Date(
                          Date.now()+
                          45*86400000
                        )
                        .toISOString()
                        .slice(0,10)
                        :
                        null
                  },
                  {
                    onConflict:'cliente_id'
                  }
                );

            if(error){

              console.error(error);

              message(
                'loginMessage',
                'Para usar este botão, a tabela VIP precisa ter uma linha única por cliente.'
              );

              return;
            }

            await renderClients();
          }
    );
}

/* Galeria estática nesta etapa; a próxima conexão será o Supabase Storage. */

function renderGallery(){

  const groups=[

    [
      'Fibra de vidro',
      [
        'imagens/fibra-1.jpeg',
        'imagens/fibra-2.jpeg'
      ]
    ],

    [
      'Mold F1',
      [
        'imagens/mold-f1-1.jpeg',
        'imagens/mold-f1-2.jpeg'
      ]
    ],

    [
      'Postiça Realista',
      [
        'imagens/postica-1.jpeg',
        'imagens/postica-2.jpeg',
        'imagens/postica-3.jpeg'
      ]
    ],

    [
      'Pedicure',
      [
        'imagens/pedicure-1.jpeg'
      ]
    ],

    [
      'Banho de Gel',
      [
        'imagens/banho-gel-1.jpeg',
        'imagens/banho-gel-2.jpeg'
      ]
    ],

    [
      'Soft Gel',
      [
        'imagens/soft-gel-1.jpeg',
        'imagens/soft-gel-2.jpeg'
      ]
    ],

    [
      'Plástica dos Pés',
      [
        'imagens/plastica-pes-1.jpeg',
        'imagens/plastica-pes-2.jpeg'
      ]
    ],

    [
      'Studio',
      [
        'imagens/debora-spa.jpeg',
        'imagens/debora-studio.jpeg',
        'imagens/debora-atendimento.jpeg'
      ]
    ]

  ];

  document.getElementById('galleryGrid').innerHTML=
    groups
      .map(
        ([name,imgs])=>
          `
          <div class="gallery-group">

            <h3>${name}</h3>

            <div class="gallery-row">

              ${imgs
                .map(
                  src=>
                    `
                    <figure>
                      <img
                        src="${src}"
                        alt="${name} — Débora Nail"
                        loading="lazy"
                      >
                    </figure>
                    `
                )
                .join('')}

            </div>

          </div>
          `
      )
      .join('');

  document.getElementById('adminGallery').innerHTML=
    '<p class="tiny">As fotos dos trabalhos já estão incluídas no site. O envio de novas fotos pelo painel online será ativado na próxima etapa.</p>';
}

document.querySelectorAll('.tab')
  .forEach(
    t=>
      t.onclick=
        async()=>{

          document
            .querySelectorAll('.tab')
            .forEach(
              x=>x.classList.remove('active')
            );

          document
            .querySelectorAll('.tab-content')
            .forEach(
              x=>x.classList.remove('active')
            );

          t.classList.add('active');

          document
            .getElementById(t.dataset.tab)
            .classList.add('active');

          await renderAdmin();

          await renderClients();

          renderGallery();
        }
  );

/* Mantém o protótipo compatível: Ctrl+Shift+A só tenta abrir o painel se a conta for admin. */

document.addEventListener(
  'keydown',
  e=>{
    if(
      e.ctrlKey &&
      e.shiftKey &&
      e.key.toLowerCase()==='a'
    ){
      openAdmin();
    }
  }
);

(async()=>{

  renderGallery();

  if(!supabase){

    console.warn(
      'Supabase ainda não configurado: preencha config.js com a chave publicável.'
    );

    return;
  }

  const {
    data:{session}
  }=await supabase.auth.getSession();

  if(session){

    currentUser=session.user;

    await ensureClientFromAuth();

    await loadClient();
  }

  supabase.auth.onAuthStateChange(
    async(_event,session)=>{

      currentUser=
        session?.user||null;

      if(currentUser){

        await ensureClientFromAuth();

        await loadClient();

      }else{

        currentClient=null;
      }
    }
  );

})();
