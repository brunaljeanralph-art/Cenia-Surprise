/* Cénia Surprise — script.js */
(() => {
  'use strict';

  const find = (selectors) => {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }
    return null;
  };

  const findAll = (selectors) => [
    ...new Set(
      selectors.flatMap((s) => [...document.querySelectorAll(s)])
    )
  ];

  const openButtons = findAll([
    '[data-open-surprise]',
    '#openSurprise',
    '#open-surprise',
    '#openButton',
    '#openBtn',
    '#openLetter',
    '#ouvrirSurprise',
    '#ouvrir-surprise',
    '.open-surprise',
    '.open-button',
    '.btn-open',
    '.surprise-button'
  ]);

  const envelope = find([
    '[data-envelope]',
    '#envelope',
    '.envelope',
    '.letter-envelope'
  ]);

  const letter = find([
    '[data-letter]',
    '#letter',
    '#lettre',
    '#letterContent',
    '#lettreContent',
    '#surpriseContent',
    '.letter',
    '.lettre',
    '.letter-content',
    '.lettre-content',
    '.surprise-content'
  ]);

  const modal = find([
    '[data-letter-modal]',
    '#letterModal',
    '#letter-modal',
    '#modalLettre',
    '.letter-modal'
  ]);

  const intro = find([
    '#intro',
    '.intro',
    '#welcomeScreen',
    '.welcome-screen',
    '#landing',
    '.landing'
  ]);

  const music = find([
    '[data-background-music]',
    '#backgroundMusic',
    '#bgMusic',
    '#music',
    'audio'
  ]);

  const closeButtons = findAll([
    '[data-close-letter]',
    '#closeLetter',
    '#close-letter',
    '#closeModal',
    '.close-letter',
    '.close-modal',
    '.letter-close'
  ]);

  function show(element) {
    if (!element) return;

    element.hidden = false;
    element.removeAttribute('aria-hidden');
    element.classList.remove('is-hidden');
    element.classList.add('is-visible', 'show', 'active');

    if (getComputedStyle(element).display === 'none') {
      element.style.display = element.matches(
        '.modal, .letter-modal, #letterModal'
      ) ? 'flex' : 'block';
    }
  }

  function hide(element) {
    if (!element) return;

    element.classList.remove(
      'is-visible',
      'show',
      'active',
      'is-open',
      'open'
    );

    element.classList.add('is-hidden');
    element.setAttribute('aria-hidden', 'true');
    element.style.display = 'none';
  }

  function openSurprise(event) {
    if (event?.currentTarget instanceof HTMLAnchorElement) {
      const href = event.currentTarget.getAttribute('href');

      if (href?.startsWith('#')) {
        event.preventDefault();
      }
    }

    if (envelope) {
      envelope.classList.add('is-open', 'open', 'active');
      envelope.setAttribute('aria-expanded', 'true');
    }

    if (intro) {
      intro.classList.add('is-hidden');
      intro.setAttribute('aria-hidden', 'true');
    }

    show(modal || letter);

    const target = modal || letter;

    if (target) {
      window.setTimeout(() => {
        target.scrollIntoView({
          behavior: window.matchMedia(
            '(prefers-reduced-motion: reduce)'
          ).matches ? 'auto' : 'smooth',
          block: 'center'
        });
      }, 150);
    }

    // Mizik la ka kòmanse apre moun nan peze bouton an.
    if (music?.play) {
      music.play().catch(() => {});
    }
  }

  function closeSurprise() {
    hide(modal || letter);

    if (envelope) {
      envelope.classList.remove('is-open', 'open', 'active');
      envelope.setAttribute('aria-expanded', 'false');
    }

    if (intro) {
      intro.classList.remove('is-hidden');
      intro.removeAttribute('aria-hidden');
    }
  }

  // Bouton pou ouvri sipriz la.
  openButtons.forEach((button) => {
    button.addEventListener('click', openSurprise);
  });

  // Bouton pou fèmen lèt la.
  closeButtons.forEach((button) => {
    button.addEventListener('click', closeSurprise);
  });

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeSurprise();
      }
    });
  }

  // Fèmen ak bouton Escape sou klavye.
  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      modal?.classList.contains('is-visible')
    ) {
      closeSurprise();
    }
  });

  // Ti patikil lumineux ki bay paj la yon efè dous.
  function addParticles() {
    if (
      document.querySelector(
        '[data-particles], #particles, .particles, .floating-particles'
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
          rgba(255,255,255,.95),
          rgba(221,183,255,.55) 45%,
          transparent 75%
        );
        box-shadow: 0 0 12px rgba(214,174,255,.4);
        opacity: 0;
        animation: ceniaFloat
          var(--duration) linear var(--delay) infinite;
      }

      @keyframes ceniaFloat {
        0% {
          transform: translate(0,0) scale(.7);
          opacity: 0;
        }

        12% {
          opacity: .58;
        }

        82% {
          opacity: .35;
        }

        100% {
          transform: translate(var(--drift),-110vh) scale(1.15);
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

    for (let i = 0; i < 20; i += 1) {
      const particle = document.createElement('span');

      particle.className = 'glow-particle';
      particle.style.left = `${Math.random() * 100}%`;

      particle.style.setProperty(
        '--size',
        `${3 + Math.random() * 5}px`
      );

      particle.style.width = 'var(--size)';
      particle.style.height = 'var(--size)';

      particle.style.setProperty(
        '--duration',
        `${12 + Math.random() * 14}s`
      );

      particle.style.setProperty(
        '--delay',
        `${-Math.random