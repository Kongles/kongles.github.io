(() => {
  const scene = document.querySelector('.scene');
  const canvas = scene.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const controls = document.querySelector('.viewport-actions');
  const layerPanel = scene.querySelector('.layers');
  const layers = { grid: true, cloud: true, axes: true };
  const spin = controls.querySelector('.spin-button');
  const replay = controls.querySelector('.replay-button');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const mobileLayout = matchMedia('(max-width: 760px)');
  const points = buildPointCloud();
  const introDuration = 1460;
  const introSpeed = .00069;
  let angle = KOREA_LONGITUDE;
  let introTime = introDuration;
  let paused = false;
  let inView = true;
  let frame = 0;
  let lastTime = 0;
  let width = 0;
  let height = 0;

  function render() {
    if (width < 1 || height < 1) return;
    const t = Math.max(0, Math.min(1, (introTime - 900) / 560));
    const shift = 1 - (1 - t) ** 3;
    drawGlobe(ctx, points, width, height, angle, shift, mobileLayout.matches, layers);
  }

  function reveal() {
    introTime = introDuration;
    if (!scene.classList.contains('is-intro')) return;
    scene.classList.remove('is-intro');
    scene.classList.add('is-ready');
  }

  function updateSpinButton() {
    const label = paused ? '지구본 회전 재생' : '지구본 회전 일시 정지';
    spin.dataset.paused = String(paused);
    spin.setAttribute('aria-label', label);
    spin.title = label;
  }

  function requestFrame() {
    if (!frame && inView && !document.hidden && !paused && !motion.matches) {
      frame = requestAnimationFrame(tick);
    }
  }

  function tick(time) {
    frame = 0;
    const elapsed = lastTime ? Math.min(time - lastTime, 40) : 0;
    lastTime = time;
    const opening = introTime < introDuration;
    if (opening) {
      introTime += elapsed;
      if (introTime >= introDuration) reveal();
    }
    angle = (angle + elapsed * (opening ? introSpeed : .000245)) % TAU;
    render();
    requestFrame();
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
  }

  function startIntro() {
    introTime = 0;
    angle = KOREA_LONGITUDE - introDuration * introSpeed;
    paused = false;
    lastTime = 0;
    updateSpinButton();
    scene.classList.remove('is-ready');
    scene.classList.add('is-intro');
    render();
    requestFrame();
  }

  function syncMotion(playIntro = false) {
    controls.hidden = motion.matches;
    if (motion.matches) {
      stop();
      angle = KOREA_LONGITUDE;
      reveal();
      scene.classList.add('is-ready');
      render();
    } else if (playIntro) {
      startIntro();
    } else {
      requestFrame();
    }
  }

  new ResizeObserver(() => {
    const bounds = canvas.getBoundingClientRect();
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    width = bounds.width;
    height = bounds.height;
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    render();
  }).observe(canvas);

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (!inView) {
      stop();
      reveal();
    } else {
      requestFrame();
    }
  }).observe(scene);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else requestFrame();
  });
  motion.addEventListener('change', () => syncMotion());
  layerPanel.hidden = false;
  layerPanel.addEventListener('change', event => {
    layers[event.target.name] = event.target.checked;
    render();
  });
  scene.querySelector('.cover-copy').addEventListener('focusin', () => {
    reveal();
    render();
  });
  spin.addEventListener('click', () => {
    paused = !paused;
    updateSpinButton();
    if (paused) {
      stop();
      reveal();
      render();
    } else {
      requestFrame();
    }
  });
  replay.addEventListener('click', startIntro);
  syncMotion(true);
})();
