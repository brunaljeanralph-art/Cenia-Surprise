/* Cénia Surprise — Version corrigée et améliorée */
(() => {
  'use strict';

  const openButton = document.getElementById('openButton');
  const envelope = document.getElementById('envelope');
  const letter = document.getElementById('letter');

  const music = document.getElementById('backgroundMusic');
  const musicButton = document.getElementById('musicButton');
  const musicButtonText = document.getElementById('musicButtonText');
  const musicStatus = document.getElementById('musicStatus');

  let surpriseOpened = false;

  /*
   * 1. OUVERTURE DE L'ENVELOPPE
   */

  function openSurprise() {
    if (!letter || surpriseOpened) return;

    surpriseOpened = true;

    // Animation de l'enveloppe.
    if (envelope) {
      envelope.classList.add('is-open', 'open', 'active');
      envelope.setAttribute('aria-label', 'Enveloppe ouverte');
    }

    // Révéler la lettre.
    letter.hidden = false;
    letter.classList.remove('is-hidden');
    letter.classList.add('is-visible', 'show', 'active');

    // Mettre à jour le bouton.
    if (openButton) {
      openButton.setAttribute('aria-expanded', 'true');
      openButton.innerHTML =
        'Ta surprise est ouverte <span aria-hidden="true">♡</span>';

      openButton.disabled = true;
    }

    // Faire apparaître la lettre puis y amener doucement le lecteur.
    window.setTimeout(() => {
      letter.scrollIntoView({
        behavior: window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches ? 'auto' : 'smooth',

        block: 'start'
      });
    }, 250);

    // Essayer de lancer la musique uniquement si le fichier existe.
    playMusicIfAvailable();
  }

  if (openButton) {
    openButton.addEventListener('click', openSurprise);
  }

  /*
   * 2. MUSIQUE DE FOND
   */

  function hasMusicSource() {
    if (!music) return false;

    const source = music.querySelector('source');

    return Boolean(
      source &&
      source.getAttribute('src') &&
      source.getAttribute('src').trim()
    );
  }

  async function playMusicIfAvailable() {
    if (!music || !hasMusicSource()) {
      if (musicStatus) {
        musicStatus.textContent =
          'La musique pourra être ajoutée dans le dossier du site.';
      }

      return;
    }

    try {
      await music.play();

      if (musicButton) {
        musicButton.setAttribute('aria-pressed', 'true');
      }

      if (musicButtonText) {
        musicButtonText.textContent = 'Pause';
      }

      if (musicStatus) {
        musicStatus.textContent = 'Une petite mélodie accompagne ce moment. ♫';
      }
    } catch {
      // Certains navigateurs peuvent bloquer la lecture automatique.
      if (musicStatus) {
        musicStatus.textContent =
          'Tu peux activer la musique avec le bouton ♫.';
      }
    }
  }

  if (musicButton) {
    musicButton.addEventListener('click', async () => {
      if (!music || !hasMusicSource()) {
        if (musicStatus) {
          musicStatus.textContent =
            'La musique pourra être ajoutée dans le dossier du site.';
        }

        return;
      }

      try {
        if (music.paused) {
          await music.play();

          musicButton.setAttribute('aria-pressed', 'true');

          if (musicButtonText) {
            musicButtonText.textContent = 'Pause';
          }

          if (musicStatus) {
            musicStatus.textContent = 'La musique est en cours de lecture. ♫';
          }
        } else {
          music.pause();

          musicButton.setAttribute('aria-pressed', 'false');

          if (musicButtonText) {
            musicButtonText.textContent = 'Musique';
          }

          if (musicStatus) {
            musicStatus.textContent = 'Musique en pause.';
          }
        }
      } catch {
        if (musicStatus) {
          musicStatus.textContent =
            'La musique ne peut pas être lancée pour le moment.';
        }
      }
    });
  }

  /*
   * 3. PÉTALES ROSES
   */

  function createPetals() {
    const field = document.getElementById('petalField');

    if (!field || field.dataset.initialized === 'true') {
      return;
    }

    field.dataset.initialized = 'true';

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reducedMotion) return;

    const totalPetals = window.innerWidth < 600 ? 12 : 22;

    for (let i = 0; i < totalPetals; i += 1) {
      const petal = document.createElement('span');

      petal.className = 'petal';

      petal.style.left = `${Math.random() * 100}%`;

      petal.style.animationDuration =
        `${10 + Math.random() * 12}s`;

      petal.style.animationDelay =
        `${-Math.random() * 20}s`;

      petal.style.setProperty(
        '--drift',
        `${Math.random() * 150 - 75}px`
      );

      petal.style.opacity = `${0.25 + Math.random() * 0.35}`;

      field.appendChild(petal);
    }
  }

  /*
   * 4. PARTICULES LUMINEUSES
   */

  function createParticles() {
    if (
      document.querySelector(
        '[data-particles], #particles, .floating-particles'
      )
    ) {
      return;
    }

    const layer = document.createElement('div');

    layer.className = 'floating-particles';
    layer.setAttribute('aria-hidden', 'true');

    Object.assign(layer.style, {
      position: 'fixed',
      inset: '0',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: '0'
    });

    const style = document.createElement('style');

    style.textContent = `
      .floating-particles .glow-particle {
        position: absolute;
        bottom: -18px;
        border-radius: 50%;

        background: radial-gradient(
          circle,
          rgba(255,255,255,.98),
          rgba(221,183,255,.65) 45%,
          transparent 75%
        );

        box-shadow: 0 0 12px rgba(214,174,255,.45);

        opacity: 0;

        animation:
          ceniaFloat
          var(--duration)
          linear
          var(--delay)
          infinite;
      }

      @keyframes ceniaFloat {
        0% {
          transform: translate3d(0, 0, 0) scale(.7);
          opacity: 0;
        }

        12% {
          opacity: .65;
        }

        80% {
          opacity: .35;
        }

        100% {
          transform:
            translate3d(var(--drift), -110vh, 0)
            scale(1.15);

          opacity: 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .floating-particles .glow-particle {
          display: none;
          animation: none;
        }
      }
    `;

    document.head.appendChild(style);

    const totalParticles = window.innerWidth < 600 ? 12 : 20;

    for (let i = 0; i < totalParticles; i += 1) {
      const particle = document.createElement('span');

      particle.className = 'glow-particle';

      const size = 3 + Math.random() * 5;

      particle.style.left = `${Math.random() * 100}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      particle.style.setProperty(
        '--duration',
        `${12 + Math.random() * 14}s`
      );

      particle.style.setProperty(
        '--delay',
        `${-Math.random() * 20}s`
      );

      particle.style.setProperty(
        '--drift',
        `${Math.random() * 100 - 50}px`
      );

      layer.appendChild(particle);
    }

    document.body.prepend(layer);
  }

  /*
   * 5. INITIALISATION
   */

  function initializeSurprise() {
    createPetals();
    createParticles();

    if (openButton && letter) {
      openButton.setAttribute('aria-controls', 'letter');
      openButton.setAttribute('aria-expanded', 'false');
    }

    if (musicButton) {
      musicButton.setAttribute('aria-pressed', 'false');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      initializeSurprise,
      { once: true }
    );
  } else {
    initializeSurprise();
  }

})();