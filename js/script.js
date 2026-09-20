const musica = document.getElementById("musica");
const progresso = document.querySelector(".progresso");

const fotos = document.querySelectorAll(".foto");
const storyBars = document.querySelectorAll(".story-progress");

const diasEl = document.getElementById("dias");
const horasEl = document.getElementById("horas");
const minutosEl = document.getElementById("minutos");
const segundosEl = document.getElementById("segundos");

const dias2El = document.getElementById("dias2");
const horas2El = document.getElementById("horas2");
const minutos2El = document.getElementById("minutos2");
const segundos2El = document.getElementById("segundos2");

let fotoAtual = 0;

/* AUTOPLAY MOBILE (começa mudo até o usuário tocar em "começar") */

musica.muted = true;
musica.play().catch(() => {});

/* TELA DE ABERTURA */

const telaAbertura = document.getElementById("telaAbertura");
const btnAbrirSite = document.getElementById("btnAbrirSite");

function criarPetalasCaindo(quantidade = 26) {

  for (let n = 0; n < quantidade; n++) {

    setTimeout(() => {

      const petala = document.createElement("div");

      petala.classList.add("petala-caindo");
      petala.innerHTML = "❤️";

      petala.style.left = Math.random() * 100 + "vw";
      petala.style.fontSize = (14 + Math.random() * 14) + "px";
      petala.style.animationDuration = (3 + Math.random() * 2) + "s";

      document.body.appendChild(petala);

      setTimeout(() => {

        petala.remove();

      }, 5500);

    }, n * 80);

  }

}

btnAbrirSite.addEventListener("click", () => {

  musica.muted = false;
  musica.play().catch(() => {});

  criarPetalasCaindo();

  telaAbertura.classList.add("escondida");

});

/* BOTAO MUTAR */

const btnMutar = document.getElementById("btnMutar");

btnMutar.addEventListener("click", () => {

  musica.muted = !musica.muted;
  btnMutar.textContent = musica.muted ? "🔇" : "🔊";

});

/* VINIL CLICAVEL (pausa/toca a música) */

const capaDisco = document.querySelector(".capa");

capaDisco.addEventListener("click", () => {

  if (musica.paused) {

    musica.play().catch(() => {});
    capaDisco.classList.remove("pausado");

  } else {

    musica.pause();
    capaDisco.classList.add("pausado");

  }

});

/* CRONOMETRO */

const dataInicio = new Date("2026-06-24T00:00:00");
const dataEuTeAmo = new Date("2026-09-14T23:14:00");

function calcularEExibir(dataAlvo, elDias, elHoras, elMinutos, elSegundos) {

  const agora = new Date();
  const diff = agora - dataAlvo;

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diff / (1000 * 60)) % 60);
  const segundos = Math.floor((diff / 1000) % 60);

  elDias.innerText = dias;
  elHoras.innerText = horas;
  elMinutos.innerText = minutos;
  elSegundos.innerText = segundos;

}

function atualizarContador() {

  calcularEExibir(dataInicio, diasEl, horasEl, minutosEl, segundosEl);
  calcularEExibir(dataEuTeAmo, dias2El, horas2El, minutos2El, segundos2El);

}

atualizarContador();
setInterval(atualizarContador, 1000);

/* TROCAR FOTO (com direção: 1 = avançar, -1 = voltar) e legenda sincronizada */

const legendaFoto = document.getElementById("legendaFoto");

function atualizarLegenda() {

  legendaFoto.style.opacity = 0;

  setTimeout(() => {

    legendaFoto.textContent = fotos[fotoAtual].dataset.legenda || "";
    legendaFoto.style.opacity = 1;

  }, 250);

}

// legenda inicial, sem efeito de fade
legendaFoto.textContent = fotos[fotoAtual].dataset.legenda || "";

function trocarFoto(direcao = 1) {

  fotos[fotoAtual].classList.remove("ativa");

  fotoAtual += direcao;

  if (fotoAtual >= fotos.length) {

    fotoAtual = 0;

  }

  if (fotoAtual < 0) {

    fotoAtual = fotos.length - 1;

  }

  fotos[fotoAtual].classList.add("ativa");

  atualizarLegenda();

}

/* STORIES (pausa ao segurar, navega ao tocar nas laterais, avança sozinho pelo tempo) */

let storyInterval;
let progressoStory = 0;

function resetarBarras() {

  storyBars.forEach(bar => bar.style.width = "0%");

}

function iniciarIntervalo() {

  clearInterval(storyInterval);

  storyInterval = setInterval(() => {

    progressoStory += 2;
    storyBars[fotoAtual].style.width = progressoStory + "%";

    if (progressoStory >= 100) {

      irParaProxima();

    }

  }, 100);

}

function irParaProxima() {

  trocarFoto(1);
  progressoStory = 0;
  resetarBarras();
  iniciarIntervalo();

}

function irParaAnterior() {

  trocarFoto(-1);
  progressoStory = 0;
  resetarBarras();
  iniciarIntervalo();

}

function pausarStories() {

  clearInterval(storyInterval);

}

function retomarStories() {

  iniciarIntervalo();

}

iniciarIntervalo();

/* NAVEGAÇÃO POR TOQUE: esquerda volta, direita avança, segurar pausa */

const fotoContainer = document.querySelector(".foto-container");

let pressaoInicioTempo = 0;
let segurando = false;

fotoContainer.addEventListener("pointerdown", (e) => {

  segurando = true;
  pressaoInicioTempo = Date.now();
  pausarStories();

});

fotoContainer.addEventListener("pointerup", (e) => {

  if (!segurando) return;

  segurando = false;

  const duracaoPressao = Date.now() - pressaoInicioTempo;
  const rect = fotoContainer.getBoundingClientRect();
  const cliqueX = e.clientX - rect.left;
  const meio = rect.width / 2;

  if (duracaoPressao < 250) {

    // toque rápido: navega conforme o lado tocado
    if (cliqueX < meio) {
      irParaAnterior();
    } else {
      irParaProxima();
    }

  } else {

    // segurou e soltou: só retoma de onde parou
    retomarStories();

  }

});

fotoContainer.addEventListener("pointerleave", () => {

  if (segurando) {

    segurando = false;
    retomarStories();

  }

});

/* BARRA MUSICA */

musica.addEventListener("timeupdate", () => {

  const porcentagem = (musica.currentTime / musica.duration) * 100;

  progresso.style.width = porcentagem + "%";

});

/* CORACOES (flutuantes aleatórios) */

setInterval(() => {

  const heart = document.createElement("div");

  heart.classList.add("heart");
  heart.innerHTML = "❤️";

  heart.style.left = Math.random() * 100 + "vw";
  heart.style.top = Math.random() * 100 + "vh";

  document.body.appendChild(heart);

  setTimeout(() => {

    heart.remove();

  }, 2000);

}, 700);

/* CORAÇÕES SUBINDO */

setInterval(() => {

  const heart = document.createElement("div");

  heart.classList.add("rising-heart");
  heart.innerHTML = "❤️";

  heart.style.left = Math.random() * 100 + "vw";

  document.body.appendChild(heart);

  setTimeout(() => {

    heart.remove();

  }, 6000);

}, 1200);

/* CANVAS ESTRELAS */

const canvas = document.getElementById("estrelas");
const ctx = canvas.getContext("2d");

let constelacaoBrilho = 0.15;

function obterPontosConstelacao() {

  const pontos = [];
  const numPontos = 22;
  const centroX = canvas.width / 2;
  const centroY = canvas.height * 0.25;
  const escala = Math.min(canvas.width, canvas.height) * 0.09;

  for (let n = 0; n < numPontos; n++) {

    const t = (n / numPontos) * Math.PI * 2;

    const xBase = 16 * Math.pow(Math.sin(t), 3);
    const yBase = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    pontos.push({
      x: centroX + (xBase * escala) / 16,
      y: centroY + (yBase * escala) / 16
    });

  }

  return pontos;

}

function desenharConstelacao() {

  const modoCinema = document.body.classList.contains("modo-cinematico");
  const alvoBrilho = modoCinema ? 1 : 0.15;

  constelacaoBrilho += (alvoBrilho - constelacaoBrilho) * 0.04;

  const pontos = obterPontosConstelacao();

  // linhas conectando os pontos, formando o contorno do coração
  ctx.beginPath();

  pontos.forEach((p, idx) => {

    if (idx === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }

  });

  ctx.closePath();
  ctx.strokeStyle = `rgba(232,196,160,${constelacaoBrilho * 0.5})`;
  ctx.lineWidth = 0.6 + constelacaoBrilho * 0.8;
  ctx.stroke();

  // pontinhos de estrela em cada vértice do coração
  pontos.forEach(p => {

    ctx.beginPath();
    ctx.arc(p.x, p.y, 1 + constelacaoBrilho * 1.6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232,196,160,${0.3 + constelacaoBrilho * 0.7})`;
    ctx.fill();

  });

}

function ajustarCanvas() {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

}

ajustarCanvas();
window.addEventListener("resize", ajustarCanvas);

/* ESTRELAS */

let estrelas = [];

for (let i = 0; i < 140; i++) {

  estrelas.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2,
    brilho: Math.random(),
    vel: Math.random() * 0.02
  });

}

/* ESTRELAS CADENTES */

let estrelasCadentes = [];

function criarEstrelaCadente() {

  estrelasCadentes.push({
    x: Math.random() * canvas.width,
    y: 0,
    len: Math.random() * 80 + 10,
    vel: Math.random() * 10 + 6
  });

}

setInterval(criarEstrelaCadente, 4000);

/* DESENHO */

function desenharEstrelas() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  estrelas.forEach(e => {

    e.brilho += e.vel;

    if (e.brilho > 1 || e.brilho < 0) {
      e.vel = -e.vel;
    }

    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r * (0.5 + e.brilho), 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

  });

  estrelasCadentes.forEach(s => {

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.len, s.y + s.len);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    s.x += s.vel;
    s.y += s.vel;

  });

  // Remove estrelas cadentes que já saíram da tela (sem bug de splice em forEach)
  estrelasCadentes = estrelasCadentes.filter(s => s.y <= canvas.height);

  desenharConstelacao();

  requestAnimationFrame(desenharEstrelas);

}

desenharEstrelas();

/* PARALLAX CELULAR (com permissão para iOS 13+) */

function handlerParallax(event) {

  const x = event.gamma / 30;
  const y = event.beta / 60;

  document.querySelector(".foto-container").style.transform =
    `translate(${x * 10}px, ${y * 10}px)`;

}

function pedirPermissaoParallax() {

  if (typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {

    DeviceOrientationEvent.requestPermission().then(state => {

      if (state === "granted") {
        window.addEventListener("deviceorientation", handlerParallax);
      }

    }).catch(() => {});

  } else {

    window.addEventListener("deviceorientation", handlerParallax);

  }

  document.removeEventListener("click", pedirPermissaoParallax);
  document.removeEventListener("touchstart", pedirPermissaoParallax);

}

document.addEventListener("click", pedirPermissaoParallax);
document.addEventListener("touchstart", pedirPermissaoParallax);

/* TEXTO LETRA POR LETRA (corrigido para não cortar emojis) */

const texto = 'Você é a peça que me faltava, o "au" do meu "tista", e eu amo como você é perfeita do seu jeito e como tudo fica mais leve e melhor com você por perto. 💖';
const elementoTexto = document.getElementById("texto-amor");
const caracteresTexto = Array.from(texto);

let i = 0;

function escreverTexto() {

  if (i < caracteresTexto.length) {

    elementoTexto.innerHTML += caracteresTexto[i];

    i++;

    setTimeout(escreverTexto, 50);

  }

}

window.addEventListener("load", () => {

  setTimeout(escreverTexto, 1500);

});

/* BRILHO AO MEXER O DEDO */

document.addEventListener("touchmove", (e) => {

  const sparkle = document.createElement("div");

  sparkle.classList.add("sparkle");

  sparkle.style.left = e.touches[0].clientX + "px";
  sparkle.style.top = e.touches[0].clientY + "px";

  document.body.appendChild(sparkle);

  setTimeout(() => {

    sparkle.remove();

  }, 800);

});

/* ===== MODO CARTA ===== */

function tocarSomAbrirEnvelope() {

  try {

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);

  } catch (e) {}

}

const envelope = document.getElementById("envelope");
const cartaCard = document.getElementById("cartaCard");
const cartaPapel = document.getElementById("cartaPapel");
const btnFechar = document.getElementById("btnFechar");
const paragrafosCarta = document.querySelectorAll(".carta-paragrafo");

envelope.addEventListener("click", () => {

  envelope.classList.add("aberto");

  tocarSomAbrirEnvelope();

  // reseta a rolagem e força o observer a recalcular (corrige a carta "em branco" ao reabrir)
  cartaPapel.scrollTop = 0;

  paragrafosCarta.forEach(p => {

    p.classList.remove("visivel");
    observerCarta.unobserve(p);
    observerCarta.observe(p);

  });

  setTimeout(() => {

    envelope.classList.add("escondido");
    cartaCard.classList.add("visivel");

  }, 700);

});

const observerCarta = new IntersectionObserver((entradas) => {

  entradas.forEach(entrada => {

    if (entrada.isIntersecting) {
      entrada.target.classList.add("visivel");
    }

  });

}, {
  root: cartaPapel,
  threshold: 0.3
});

paragrafosCarta.forEach(p => observerCarta.observe(p));

btnFechar.addEventListener("click", () => {

  cartaCard.classList.remove("visivel");

  setTimeout(() => {

    envelope.classList.remove("aberto", "escondido");
    paragrafosCarta.forEach(p => p.classList.remove("visivel"));

  }, 600);

});

/* ===== MODO CINEMATOGRAFICO (ao chegar na carta, escurece as estrelas e destaca o envelope) ===== */

const observerCinema = new IntersectionObserver((entradas) => {

  entradas.forEach(entrada => {

    if (entrada.isIntersecting) {

      document.body.classList.add("modo-cinematico");
      envelope.classList.add("destaque-cinema");

    } else {

      document.body.classList.remove("modo-cinematico");
      envelope.classList.remove("destaque-cinema");

    }

  });

}, {
  threshold: 0.45
});

observerCinema.observe(envelope);

/* ===== ABRA QUANDO... (mini envelopes) ===== */

const miniEnvelopes = document.querySelectorAll(".mini-envelope");
const miniCartaCard = document.getElementById("miniCartaCard");
const miniCartaTexto = document.getElementById("miniCartaTexto");
const btnFecharMini = document.getElementById("btnFecharMini");

miniEnvelopes.forEach(env => {

  env.addEventListener("click", () => {

    miniCartaTexto.textContent = env.dataset.mensagem || "";

    tocarSomAbrirEnvelope();

    miniCartaCard.classList.add("visivel");

  });

});

btnFecharMini.addEventListener("click", () => {

  miniCartaCard.classList.remove("visivel");

});

/* ===== REVEAL AO SCROLLAR (site inteiro) ===== */

const elementosReveal = document.querySelectorAll(".reveal");

const observerScroll = new IntersectionObserver((entradas) => {

  entradas.forEach(entrada => {

    if (entrada.isIntersecting) {

      entrada.target.classList.add("visivel");
      observerScroll.unobserve(entrada.target);

    }

  });

}, {
  threshold: 0.2
});

elementosReveal.forEach(el => observerScroll.observe(el));

/* ===== REPLAY (voltar ao começo e reiniciar as animações) ===== */

const btnReplay = document.getElementById("btnReplay");

btnReplay.addEventListener("click", () => {

  window.scrollTo({ top: 0, behavior: "smooth" });

  // reinicia o reveal de todos os elementos
  elementosReveal.forEach(el => {

    el.classList.remove("visivel");
    observerScroll.observe(el);

  });

  // reinicia o envelope principal e a carta
  envelope.classList.remove("aberto", "escondido");
  cartaCard.classList.remove("visivel");
  paragrafosCarta.forEach(p => p.classList.remove("visivel"));

  // reinicia os mini envelopes
  miniCartaCard.classList.remove("visivel");

  // volta pra primeira foto e reinicia as stories
  fotos[fotoAtual].classList.remove("ativa");
  fotoAtual = 0;
  fotos[fotoAtual].classList.add("ativa");
  atualizarLegenda();
  progressoStory = 0;
  resetarBarras();
  iniciarIntervalo();

  // dispara os corações de novo, de brinde
  criarPetalasCaindo(16);

  // reinicia a raspadinha
  inicializarRaspadinha();

});

/* ===== RASPADINHA DIGITAL ===== */

const raspadinhaCanvas = document.getElementById("raspadinhaCanvas");
const raspadinhaCtx = raspadinhaCanvas.getContext("2d");

let raspadinhaRevelada = false;
let raspando = false;
let contadorRaspadas = 0;

function inicializarRaspadinha() {

  const rect = raspadinhaCanvas.parentElement.getBoundingClientRect();

  raspadinhaCanvas.width = rect.width;
  raspadinhaCanvas.height = rect.height;

  raspadinhaCanvas.style.opacity = "1";
  raspadinhaCanvas.style.display = "block";
  raspadinhaRevelada = false;

  raspadinhaCtx.globalCompositeOperation = "source-over";
  raspadinhaCtx.fillStyle = "#9a9690";
  raspadinhaCtx.fillRect(0, 0, raspadinhaCanvas.width, raspadinhaCanvas.height);

  raspadinhaCtx.fillStyle = "#f2e9dc";
  raspadinhaCtx.font = "16px Georgia, serif";
  raspadinhaCtx.textAlign = "center";
  raspadinhaCtx.textBaseline = "middle";
  raspadinhaCtx.fillText("Raspe aqui ❤️", raspadinhaCanvas.width / 2, raspadinhaCanvas.height / 2);

}

inicializarRaspadinha();
window.addEventListener("resize", inicializarRaspadinha);

function posicaoRaspadinha(e) {

  const rect = raspadinhaCanvas.getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };

}

function raspar(x, y) {

  raspadinhaCtx.globalCompositeOperation = "destination-out";
  raspadinhaCtx.beginPath();
  raspadinhaCtx.arc(x, y, 22, 0, Math.PI * 2);
  raspadinhaCtx.fill();

}

function verificarProgressoRaspadinha() {

  if (raspadinhaRevelada) return;

  const dados = raspadinhaCtx.getImageData(0, 0, raspadinhaCanvas.width, raspadinhaCanvas.height).data;

  let apagados = 0;
  let amostras = 0;

  for (let p = 3; p < dados.length; p += 4 * 15) {

    amostras++;

    if (dados[p] < 40) {
      apagados++;
    }

  }

  if (amostras > 0 && (apagados / amostras) > 0.5) {

    raspadinhaRevelada = true;

    raspadinhaCanvas.style.transition = "opacity 0.6s ease";
    raspadinhaCanvas.style.opacity = "0";

    setTimeout(() => {

      raspadinhaCanvas.style.display = "none";

    }, 650);

  }

}

raspadinhaCanvas.addEventListener("pointerdown", (e) => {

  raspando = true;

  const pos = posicaoRaspadinha(e);
  raspar(pos.x, pos.y);

});

raspadinhaCanvas.addEventListener("pointermove", (e) => {

  if (!raspando) return;

  const pos = posicaoRaspadinha(e);
  raspar(pos.x, pos.y);

  contadorRaspadas++;

  if (contadorRaspadas % 8 === 0) {

    verificarProgressoRaspadinha();

  }

});

window.addEventListener("pointerup", () => {

  if (raspando) {

    raspando = false;
    verificarProgressoRaspadinha();

  }

});
