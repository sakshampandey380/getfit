/**
 * FITQUEST 3D INTERACTIVE VISUAL ENGINE
 * Canvas 3D floating ambient objects, pointer-tracking card tilt, and confetti celebrations
 */

export const Effects3D = {
  canvas: null,
  ctx: null,
  animId: null,
  particles: [],
  shapes: [],
  mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
  enabled: true,

  init(canvasId = 'ambient-canvas-3d') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Pointer move listener for parallax
    window.addEventListener('pointermove', (e) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      this.mouse.targetX = (e.clientX - halfW) / halfW;
      this.mouse.targetY = (e.clientY - halfH) / halfH;
    }, { passive: true });

    // Page visibility to pause when inactive
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.animId) cancelAnimationFrame(this.animId);
      } else {
        this.loop();
      }
    });

    this.initShapes();
    this.initTiltCards();
    this.loop();
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  initShapes() {
    this.shapes = [];
    const count = window.innerWidth < 768 ? 12 : 24;
    const colors = [
      'rgba(14, 165, 233, 0.25)',  // cyan
      'rgba(16, 185, 129, 0.22)',  // emerald
      'rgba(139, 92, 246, 0.20)',  // purple
      'rgba(249, 115, 22, 0.18)'   // orange
    ];

    for (let i = 0; i < count; i++) {
      this.shapes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 500 + 100, // depth
        size: Math.random() * 24 + 10,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        vRotX: (Math.random() - 0.5) * 0.015,
        vRotY: (Math.random() - 0.5) * 0.015,
        color: colors[i % colors.length],
        type: i % 3 // 0: cube/prism, 1: ring, 2: soft sphere
      });
    }
  },

  loop() {
    if (!this.enabled || !this.ctx) return;

    // Smooth mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const fov = 600;
    const centerX = this.canvas.width / 2 + this.mouse.x * 30;
    const centerY = this.canvas.height / 2 + this.mouse.y * 30;

    for (const s of this.shapes) {
      s.x += s.vx;
      s.y += s.vy;
      s.rotX += s.vRotX;
      s.rotY += s.vRotY;

      // Wrap around bounds
      if (s.x < -50) s.x = this.canvas.width + 50;
      if (s.x > this.canvas.width + 50) s.x = -50;
      if (s.y < -50) s.y = this.canvas.height + 50;
      if (s.y > this.canvas.height + 50) s.y = -50;

      // 3D projection
      const scale = fov / (fov + s.z);
      const projX = (s.x - centerX) * scale + centerX;
      const projY = (s.y - centerY) * scale + centerY;
      const projSize = s.size * scale;

      this.ctx.save();
      this.ctx.translate(projX, projY);
      this.ctx.fillStyle = s.color;
      this.ctx.strokeStyle = s.color;
      this.ctx.lineWidth = 1.5;

      if (s.type === 0) {
        // Rotating Diamond / Polyhedron
        this.ctx.rotate(s.rotX);
        this.ctx.beginPath();
        this.ctx.moveTo(0, -projSize);
        this.ctx.lineTo(projSize, 0);
        this.ctx.lineTo(0, projSize);
        this.ctx.lineTo(-projSize, 0);
        this.ctx.closePath();
        this.ctx.stroke();
      } else if (s.type === 1) {
        // Rotating Ring
        this.ctx.scale(1, Math.cos(s.rotY) * 0.8);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, projSize, 0, Math.PI * 2);
        this.ctx.stroke();
      } else {
        // Soft glowing particle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, projSize * 0.8, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    this.animId = requestAnimationFrame(() => this.loop());
  },

  /**
   * Bind 3D perspective mouse-tilt to cards
   */
  initTiltCards() {
    // Only bind for non-touch pointers to preserve silky performance
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest('.tilt-card');
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      // Max 8-degree rotation for subtle, elegant physical depth
      const rotY = deltaX * 7;
      const rotX = -deltaY * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(8px)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width * 100).toFixed(1)}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height * 100).toFixed(1)}%`);
    });

    document.addEventListener('pointerout', (e) => {
      const card = e.target.closest('.tilt-card');
      if (!card) return;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  },

  /**
   * Spawn 3D floating XP indicator
   */
  spawnXpFloater(amount, x, y) {
    const floater = document.createElement('div');
    floater.className = 'xp-floating-floater';
    floater.textContent = `+${amount} XP`;
    if (!document.body || typeof document.body.appendChild !== 'function') return;
    floater.style.left = `${x || window.innerWidth / 2}px`;
    floater.style.top = `${y || window.innerHeight / 2}px`;

    document.body.appendChild(floater);
    setTimeout(() => {
      if (floater.parentNode) floater.parentNode.removeChild(floater);
    }, 1200);
  },

  /**
   * Full-screen celebratory particle explosion
   */
  spawnCelebration(duration = 2000) {
    if (!document.body || typeof document.body.appendChild !== 'function') return;
    const count = 45;
    const colors = ['#10B981', '#06B6D4', '#F59E0B', '#8B5CF6', '#F97316'];
    const container = document.createElement('div');
    if (!container || typeof container.appendChild !== 'function') return;
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '99999';
    container.style.perspective = '1000px';
    document.body.appendChild(container);

    const particles = [];

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.style.position = 'absolute';
      p.style.left = '50%';
      p.style.top = '50%';
      p.style.width = `${Math.random() * 10 + 6}px`;
      p.style.height = `${Math.random() * 10 + 6}px`;
      p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.boxShadow = `0 0 10px ${p.style.background}`;

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 14 + 6;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 4;
      const rotSpeed = (Math.random() - 0.5) * 20;

      container.appendChild(p);
      particles.push({ el: p, x: 0, y: 0, vx, vy, rot: 0, rotSpeed, opacity: 1 });
    }

    let startTime = performance.now();

    function update() {
      const elapsed = performance.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        if (container.parentNode) container.parentNode.removeChild(container);
        return;
      }

      particles.forEach(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.35; // gravity
        pt.rot += pt.rotSpeed;
        pt.opacity = 1 - progress;

        pt.el.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) rotate(${pt.rot}deg)`;
        pt.el.style.opacity = pt.opacity;
      });

      requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }
};
