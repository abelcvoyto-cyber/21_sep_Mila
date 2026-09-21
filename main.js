/* =========================================================
   CONFIGURACIÓN: aquí personalizas todo
   ========================================================= */
const CONFIG = {
  para: 'Milagros',
  de: 'David',

  // Un mensaje por pétalo. La cantidad de frases = la cantidad de pétalos (entre 6 y 16).
  // Cambia al menos dos o tres por algo real que sepas de ella.
  frases: [
    'Hace poco que te conozco, pero ya me alegras los días.',
    'Tu nombre lo dice todo: eres un milagro que no esperaba.',
    'Me gusta cómo se siente conversar contigo.',
    'Hoy es 21 de septiembre y las flores amarillas se regalan a quienes uno aprecia.',
    'Elegí el amarillo porque es el color de la luz y de las buenas noticias.',
    'No quiero apurar nada. Me alcanza con seguir conociéndote.',
    'Esta flor no te pide nada, solo quiere decirte que pensé en ti.',
    'Si te sacó una sonrisa, ya cumplió su trabajo.',
    'Hay personas que llegan y el día cambia. Tú fuiste una.',
    'Me gustaría saber más de ti: qué te gusta, qué te da risa, qué sueñas.',
    'Y si un día estás cansada, acuérdate de que alguien te regaló una flor.',
    'Gracias por existir.'
  ],

  cierreTitulo: null,            // null = "Feliz 21 de septiembre, {para}."
  cierreTexto: '¿Me cuentas si te gustó?',

  // Número con código de país, sin + ni espacios. Ejemplo Perú: '51987654321'
  // Si lo dejas vacío, el botón de responder no aparece.
  whatsapp: '',
  mensajeWhatsapp: 'Hola David, me llegó tu flor amarilla 🌼'
};

/* =========================================================
   Código
   ========================================================= */
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = CONFIG.frases.length;
  const INICIAL = 'Toca un pétalo para leer lo que dice.';

  // Textos personalizados
  $('#nombre').textContent = CONFIG.para;
  document.title = 'Para ' + CONFIG.para + ' · una flor amarilla';
  $('#cTitulo').textContent = CONFIG.cierreTitulo || 'Feliz 21 de septiembre, ' + CONFIG.para + '.';
  $('#cTexto').textContent = CONFIG.cierreTexto;
  $('#firma').textContent = 'Con cariño, ' + CONFIG.de;
  $('#flor').setAttribute('aria-label', 'Una flor amarilla con ' + N + ' pétalos que se pueden quitar');

  if (CONFIG.whatsapp) {
    const r = $('#responder');
    r.href = 'https://wa.me/' + CONFIG.whatsapp.replace(/\D/g, '') + '?text=' + encodeURIComponent(CONFIG.mensajeWhatsapp);
    r.textContent = 'Responderle a ' + CONFIG.de;
    r.hidden = false;
  }

  /* ---------- Flor ---------- */
  const petalos = $('#petalos');
  const w = Math.min(40, (2 * Math.PI * 92 / N) * 0.68);
  const d = 'M0 -36 C ' + w.toFixed(1) + ' -60, ' + w.toFixed(1) + ' -125, 0 -152 C ' + (-w).toFixed(1) + ' -125, ' + (-w).toFixed(1) + ' -60, 0 -36 Z';
  let html = '';
  for (let i = 0; i < N; i++) {
    const a = i * 360 / N, rad = a * Math.PI / 180;
    const cx = (92 * Math.sin(rad)).toFixed(1), cy = (-92 * Math.cos(rad)).toFixed(1);
    html += '<g transform="translate(200 185)"><g class="pet" data-i="' + i + '" tabindex="0" role="button" aria-label="Pétalo ' + (i + 1) + ' de ' + N +
            '" style="transform-origin:' + cx + 'px ' + cy + 'px"><g transform="rotate(' + a.toFixed(1) + ')">' +
            '<path class="forma' + (i % 2 ? ' alt' : '') + '" d="' + d + '"/><path class="vena" d="M0 -46 L0 -132"/></g></g></g>';
  }
  petalos.innerHTML = html;

  let semillas = '';
  for (let i = 0; i < 130; i++) {
    const r = Math.sqrt(i / 130) * 40, a = i * 2.39996;
    semillas += '<circle cx="' + (Math.cos(a) * r).toFixed(1) + '" cy="' + (Math.sin(a) * r).toFixed(1) +
                '" r="' + (1.3 + (i / 130) * 1.3).toFixed(2) + '" fill="#F5C15A" opacity=".9"/>';
  }
  $('#semillas').innerHTML = semillas;

  /* ---------- Estado ---------- */
  const flor = $('#flor'), slip = $('#slip'), frase = $('#frase');
  const controles = $('#controles'), cierre = $('#cierre'), cuenta = $('#cuenta');
  let quitados = 0;

  function actualizarCuenta() {
    cuenta.textContent = quitados === 0 ? N + ' pétalos por leer' : quitados + ' de ' + N;
  }
  function mostrar(txt) {
    frase.textContent = txt;
    slip.style.setProperty('--tilt', (Math.random() * 4 - 2).toFixed(1) + 'deg');
    slip.classList.remove('nueva');
    void slip.offsetWidth;
    slip.classList.add('nueva');
  }

  function quitar(el) {
    if (!el || el.classList.contains('suelta') || quitados >= N) return;
    document.querySelectorAll('.pet.invita').forEach((p) => p.classList.remove('invita'));
    const i = Number(el.dataset.i), ang = (i * 360 / N) * Math.PI / 180;
    el.style.setProperty('--dx', (Math.sin(ang) * 40 + (Math.random() * 60 - 30)).toFixed(0) + 'px');
    el.style.setProperty('--rot', ((Math.random() * 240 - 120)).toFixed(0) + 'deg');
    el.classList.add('suelta');
    el.removeAttribute('tabindex');
    el.setAttribute('aria-disabled', 'true');
    mostrar(CONFIG.frases[quitados]);
    quitados++;
    actualizarCuenta();
    if (quitados === N) terminar();
  }

  function terminar() {
    flor.classList.add('listo');
    controles.hidden = true;
    setTimeout(function () {
      cierre.hidden = false;
      $('#cTitulo').focus({ preventScroll: true });
      cierre.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' });
    }, RM ? 0 : 1800);
  }

  function reiniciar() {
    quitados = 0;
    document.querySelectorAll('.pet').forEach(function (p, i) {
      p.classList.remove('suelta', 'invita');
      p.style.display = '';
      p.setAttribute('tabindex', '0');
      p.removeAttribute('aria-disabled');
    });
    flor.classList.remove('listo');
    cierre.hidden = true; controles.hidden = false;
    slip.classList.remove('nueva');
    frase.textContent = INICIAL;
    actualizarCuenta();
    window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
    invitar();
  }

  function invitar() {
    const primero = petalos.querySelector('.pet[data-i="0"]');
    if (primero && !RM) primero.classList.add('invita');
  }

  petalos.addEventListener('click', function (e) {
    const p = e.target.closest('.pet'); if (p) quitar(p);
  });
  petalos.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const p = e.target.closest('.pet');
    if (p) { e.preventDefault(); quitar(p); }
  });
  petalos.addEventListener('animationend', function (e) {
    if (e.target.classList && e.target.classList.contains('suelta')) e.target.style.display = 'none';
  });

  $('#otro').addEventListener('click', function () {
    const restantes = Array.prototype.filter.call(document.querySelectorAll('.pet'), function (p) { return !p.classList.contains('suelta'); });
    if (restantes.length) quitar(restantes[Math.floor(Math.random() * restantes.length)]);
  });
  $('#reiniciar').addEventListener('click', reiniciar);

  /* ---------- Ramas de fondo (solo línea) ---------- */
  function rama() {
    const P0 = [0, 520], P1 = [40, 380], P2 = [30, 190], P3 = [150, 20];
    let s = '<svg viewBox="0 0 260 520" preserveAspectRatio="xMinYMax meet" xmlns="http://www.w3.org/2000/svg">';
    s += '<path d="M' + P0 + ' C ' + P1 + ' ' + P2 + ' ' + P3 + '"/>';
    for (let i = 1; i <= 16; i++) {
      const t = i / 17, u = 1 - t;
      const x = u*u*u*P0[0] + 3*u*u*t*P1[0] + 3*u*t*t*P2[0] + t*t*t*P3[0];
      const y = u*u*u*P0[1] + 3*u*u*t*P1[1] + 3*u*t*t*P2[1] + t*t*t*P3[1];
      const dx = 3*u*u*(P1[0]-P0[0]) + 6*u*t*(P2[0]-P1[0]) + 3*t*t*(P3[0]-P2[0]);
      const dy = 3*u*u*(P1[1]-P0[1]) + 6*u*t*(P2[1]-P1[1]) + 3*t*t*(P3[1]-P2[1]);
      const ang = Math.atan2(dy, dx) * 180 / Math.PI, side = i % 2 ? 1 : -1;
      const len = 34 * (1 - t * .6);
      s += '<ellipse cx="' + len.toFixed(1) + '" cy="0" rx="' + len.toFixed(1) + '" ry="' + (len * .36).toFixed(1) +
           '" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (ang + side * 48).toFixed(1) + ')"/>';
    }
    return s + '</svg>';
  }
  $('#floraIzq').innerHTML = rama();
  $('#floraDer').innerHTML = rama();

  actualizarCuenta();
  invitar();
})();
