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