(() => {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------------
     Header, back-to-top and active navigation
  ------------------------------------------------------------------ */
  const header = $('#siteHeader');
  const toTop = $('#toTop');
  const navLinks = $$('.site-nav a');

  const updateChrome = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
    toTop?.classList.toggle('is-visible', window.scrollY > 680);
  };
  window.addEventListener('scroll', updateChrome, { passive: true });
  updateChrome();

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeLink = navLinks.find((link) => link.getAttribute('href') === `#${entry.target.id}`);
        navLinks.forEach((link) => link.removeAttribute('aria-current'));
        activeLink?.setAttribute('aria-current', 'page');
      });
    }, { rootMargin: '-42% 0px -48% 0px', threshold: 0 });
    ['letters', 'memories'].forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* ------------------------------------------------------------------
     Gentle scroll reveal
  ------------------------------------------------------------------ */
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------
     Floating petals
  ------------------------------------------------------------------ */
  const petalLayer = $('#petalLayer');
  if (petalLayer && !reduceMotion) {
    const petalCount = window.innerWidth < 700 ? 10 : 18;
    for (let i = 0; i < petalCount; i += 1) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.setProperty('--x', `${Math.random() * 100}%`);
      petal.style.setProperty('--size', `${6 + Math.random() * 10}px`);
      petal.style.setProperty('--duration', `${13 + Math.random() * 17}s`);
      petal.style.setProperty('--delay', `${-Math.random() * 27}s`);
      petal.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
      petal.style.setProperty('--rot', `${-220 + Math.random() * 440}deg`);
      petal.style.setProperty('--opacity', `${0.25 + Math.random() * 0.34}`);
      petalLayer.appendChild(petal);
    }
  }

  /* ------------------------------------------------------------------
     Little celebration particles
  ------------------------------------------------------------------ */
  const petalColors = ['#f6b7c6', '#f9d3dc', '#e98fa6', '#ffe4ea', '#efc3cf'];

  function burst(origin, kind = 'petal', count = 13) {
    if (reduceMotion || !origin) return;
    const rect = origin.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement('span');
      particle.className = `burst${kind === 'heart' ? ' burst--heart' : ''}`;
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 240}px`);
      particle.style.setProperty('--ty', `${-45 - Math.random() * 170}px`);
      particle.style.setProperty('--rot', `${-220 + Math.random() * 440}deg`);
      if (kind === 'heart') {
        particle.textContent = Math.random() > 0.45 ? '♥' : '♡';
        particle.style.color = petalColors[i % petalColors.length];
      } else {
        particle.style.background = petalColors[i % petalColors.length];
        particle.style.animationDelay = `${Math.random() * 0.09}s`;
      }
      document.body.appendChild(particle);
      window.setTimeout(() => particle.remove(), 1150);
    }
  }

  /* ------------------------------------------------------------------
     Love notes
  ------------------------------------------------------------------ */
  const messages = [
    'สุขสันต์วันครบรอบ <em>2 ปี</em> นะ เบบิ่ของเค้าา ♡',
    'ขอบคุณที่เบบิ๋ทำให้วันธรรมดาของเค้า กลายเป็นวันที่ดี ทุ้กๆวันนเยย',
    'เค้าขอให้บิบี๋มีความสุขเย้อะๆ กินข้าวอร่อยๆ การบ้านน้อยๆ ไม่มีอะไรไม่ดีมากวนใจที่รัก',
    'ขอบคุณที่เบบี๋เปนทั้งแฟนเค้า เปนเพื่อน เปนน้อง เปนคนที่คอยห่วงเค้า เปนทุ้กอย่างให้เค้าเยย ㅜㅜ',
    '2 ปีแล้ว เราอาจมีวันที่ไม่ดีบ้างง แต่ว่าเค้าอยากให้เรารักกันเย้อะๆ มีกันนานๆ <em></em>',
    'ถ้าวันไหนเบบี๋เหนื่อย... อยากให้เบบี๋รู้ว่าาา👀',
    '<em>เบบิ่มีเค้าพร้อมกอดเบบิ่แน่น ๆ อยู่ตรงนี้เองงง👉🏻👈🏻</em>',
    'ม่ายมีอารัยแร้ว นึกม่ายออก૮◞‸◟˶𑁬 เค้าแค่จะบอกว่าๆ',
    'รักเบบิ่มากๆๆ จริงๆ จนเค้าไม่มีคำไหนมาพูดแทนความรักของเค้าได้แย้ว ♡   งื้อออ เขิรร~<br><span class="message-ps">P.S. ขอบคุณที่ยังเป็นเบบิ่ของอิมชิเหมือนเดิมนะ</span>'
  ];

  const letterCard = $('#letterCard');
  const letterMessage = $('#letterMessage');
  const letterMessageInner = $('#letterMessageInner');
  const letterCounter = $('#letterCounter');
  const dotsContainer = $('#letterDots');
  const prevButton = $('#prevMessage');
  const nextButton = $('#nextMessage');
  const nextLabel = $('#nextLabel');
  const nextArrow = $('#nextArrow');
  const lettersSection = $('#letters');
  const dots = [];
  let currentMessage = 0;
  let isChanging = false;
  let pendingMessage = null;

  if (letterMessage && dotsContainer) {
    messages.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'letter-dot';
      dot.setAttribute('aria-label', `เปิดข้อความที่ ${index + 1}`);
      dot.addEventListener('click', () => goToMessage(index));
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
  }

  function paintMessage() {
    if (!letterMessageInner) return;
    letterMessageInner.innerHTML = messages[currentMessage];
    if (letterCounter) letterCounter.textContent = `${String(currentMessage + 1).padStart(2, '0')} / ${String(messages.length).padStart(2, '0')}`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === currentMessage);
      if (index === currentMessage) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (prevButton) prevButton.disabled = currentMessage === 0;
    if (nextLabel) nextLabel.textContent = currentMessage === messages.length - 1 ? 'อ่านอีกครั้ง' : 'กดตรงนี้เยยย';
    if (nextArrow) nextArrow.textContent = currentMessage === messages.length - 1 ? '↺' : '→';
    letterCard?.classList.toggle('is-final', currentMessage === messages.length - 1);
  }

  function goToMessage(index) {
    if (!messages[index]) return;
    if (isChanging) {
      pendingMessage = index;
      return;
    }
    if (index === currentMessage) return;

    isChanging = true;
    const finish = () => {
      currentMessage = index;
      paintMessage();
      letterMessage?.classList.remove('is-changing');
      window.setTimeout(() => {
        isChanging = false;
        if (pendingMessage !== null) {
          const queued = pendingMessage;
          pendingMessage = null;
          if (queued !== currentMessage) goToMessage(queued);
        }
      }, reduceMotion ? 0 : 110);
    };

    if (reduceMotion) {
      finish();
    } else {
      letterMessage?.classList.add('is-changing');
      window.setTimeout(finish, 145);
    }
  }

  function nextMessage() {
    const base = pendingMessage ?? currentMessage;
    const target = base >= messages.length - 1 ? 0 : base + 1;
    goToMessage(target);
    burst(nextButton, 'petal', 12);
  }

  function previousMessage() {
    const base = pendingMessage ?? currentMessage;
    if (base === 0) return;
    goToMessage(base - 1);
  }

  prevButton?.addEventListener('click', previousMessage);
  nextButton?.addEventListener('click', nextMessage);
  paintMessage();

  document.addEventListener('keydown', (event) => {
    if (!lettersSection) return;
    const rect = lettersSection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight * 0.72 && rect.bottom > window.innerHeight * 0.2;
    if (!isInView) return;
    const target = event.target;
    if (target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName)) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextMessage();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previousMessage();
    }
  });

  if (letterCard && !reduceMotion) {
    let startX = 0;
    let startY = 0;
    let tracking = false;
    letterCard.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse') return;
      startX = event.clientX;
      startY = event.clientY;
      tracking = true;
    });
    letterCard.addEventListener('pointerup', (event) => {
      if (!tracking) return;
      tracking = false;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.35) {
        if (dx < 0) nextMessage();
        else previousMessage();
      }
    });
    letterCard.addEventListener('pointercancel', () => { tracking = false; });
  }

  /* ------------------------------------------------------------------
     Photo loading — hero: roblox.png / memory: photo.jpg
  ------------------------------------------------------------------ */
  const memoryPhotoSources = ['assets/photo.jpg', 'assets/photo.jpeg', 'assets/photo.png', 'assets/photo.webp'];
  const heroPhotoSources = ['assets/roblox.png', ...memoryPhotoSources];
  const heroPhoto = $('#heroPhoto');
  const heroPhotoFallback = $('#heroPhotoFallback');
  const memoryPhoto = $('#memoryPhoto');
  const memoryPhotoFallback = $('#memoryPhotoFallback');

  function showPhoto(image, fallback, source) {
    if (!image) return;
    image.src = source;
    image.hidden = false;
    if (fallback) fallback.hidden = true;
  }

  function findPhoto(sources, image, fallback, index = 0) {
    if (!image || index >= sources.length) return;
    const probe = new Image();
    probe.onload = () => showPhoto(image, fallback, sources[index]);
    probe.onerror = () => findPhoto(sources, image, fallback, index + 1);
    probe.src = sources[index];
  }
  findPhoto(heroPhotoSources, heroPhoto, heroPhotoFallback);
  findPhoto(memoryPhotoSources, memoryPhoto, memoryPhotoFallback);

  /* ------------------------------------------------------------------
     Boomerang video — drop boomerang.mp4 / boomerang.webm into /assets
  ------------------------------------------------------------------ */
  const boomerangVideo = $('#boomerangVideo');
  const videoFallback = $('#videoFallback');
  const videoOpen = $('#videoOpen');
  const videoSources = ['assets/boomerang.mp4', 'assets/boomerang.webm', 'assets/boomerang.mov'];
  let videoSourceIndex = 0;
  let boomerangStarted = false;

  function startBoomerang(video) {
    if (boomerangStarted) return;
    boomerangStarted = true;
    video.muted = true;
    video.playsInline = true;

    if (reduceMotion) {
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    let reversing = false;
    let animationFrame = 0;

    const playForward = () => {
      if (reversing) return;
      video.play().catch(() => {});
    };

    const reverse = () => {
      if (reversing) return;
      reversing = true;
      video.pause();
      let lastTime = performance.now();

      const step = (now) => {
        if (!reversing) return;
        const delta = Math.min((now - lastTime) / 1000, 0.055);
        lastTime = now;
        if (!Number.isFinite(video.duration) || video.duration <= 0) {
          reversing = false;
          playForward();
          return;
        }
        const nextTime = video.currentTime - delta;
        if (nextTime <= 0.025) {
          video.currentTime = 0;
          reversing = false;
          playForward();
          return;
        }
        video.currentTime = nextTime;
        animationFrame = requestAnimationFrame(step);
      };
      animationFrame = requestAnimationFrame(step);
    };

    video.addEventListener('ended', reverse);
    video.addEventListener('timeupdate', () => {
      if (!reversing && video.duration && video.currentTime >= video.duration - 0.055) reverse();
    });
    video.addEventListener('play', () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    });
    video.addEventListener('pause', () => {
      if (!reversing) cancelAnimationFrame(animationFrame);
    });

    video.currentTime = 0;
    playForward();
  }

  function tryNextVideoSource() {
    if (!boomerangVideo) return;
    if (videoSourceIndex >= videoSources.length) return;
    boomerangVideo.src = videoSources[videoSourceIndex];
    videoSourceIndex += 1;
    boomerangVideo.load();
  }

  if (boomerangVideo) {
    boomerangVideo.addEventListener('loadeddata', () => {
      boomerangVideo.hidden = false;
      if (videoFallback) videoFallback.hidden = true;
      if (videoOpen) videoOpen.hidden = true;
      startBoomerang(boomerangVideo);
    });
    boomerangVideo.addEventListener('error', () => {
      if (videoSourceIndex < videoSources.length) tryNextVideoSource();
      else {
        boomerangVideo.hidden = true;
        if (videoFallback) videoFallback.hidden = false;
      }
    });
    tryNextVideoSource();
  }

  if (videoFallback && videoOpen) {
    videoFallback.tabIndex = 0;
    videoFallback.setAttribute('role', 'link');
    videoFallback.setAttribute('aria-label', 'เปิดวิดีโอ Boomerang ใน Google Drive');
    videoFallback.addEventListener('click', () => videoOpen.click());
    videoFallback.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        videoOpen.click();
      }
    });
  }

  /* ------------------------------------------------------------------
     Secret heart message
  ------------------------------------------------------------------ */
  const heartButton = $('#heartButton');
  const secretMessage = $('#secretMessage');
  if (heartButton && secretMessage) {
    heartButton.addEventListener('click', () => {
      const isOpen = secretMessage.classList.toggle('is-open');
      heartButton.setAttribute('aria-expanded', String(isOpen));
      burst(heartButton, 'heart', 16);
      if (isOpen) {
        const label = heartButton.querySelector('span');
        if (label) label.textContent = 'หุหุหุฮ่าๆๆฮือๆๆ ♡';
      }
    });
  }

  /* ------------------------------------------------------------------
     A tiny bit of hero parallax on desktop
  ------------------------------------------------------------------ */
  if (canHover && !reduceMotion) {
    const visual = $('.hero-visual');
    if (visual) {
      window.addEventListener('pointermove', (event) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 7;
        const y = (event.clientY / window.innerHeight - 0.5) * 7;
        visual.style.setProperty('--hero-x', `${x}px`);
        visual.style.setProperty('--hero-y', `${y}px`);
        visual.style.translate = `${x}px ${y}px`;
      }, { passive: true });
    }
  }
})();
