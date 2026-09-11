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
  athletes: [],
  mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
  enabled: true,
  lastTime: 0,

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
        this.lastTime = performance.now();
        this.loop(this.lastTime);
      }
    });

    this.initShapes();
    this.initAthletes();
    this.initTiltCards();
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  initShapes() {
    this.shapes = [];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 12 : 22;

    const gymColors = [
      { primary: 'rgba(14, 165, 233, ', glow: '#0EA5E9' },  // Neon Cyan
      { primary: 'rgba(16, 185, 129, ', glow: '#10B981' },  // Emerald
      { primary: 'rgba(249, 115, 22, ', glow: '#F97316' },  // Forge Orange
      { primary: 'rgba(168, 85, 247, ', glow: '#A855F7' },  // Mystic Purple
      { primary: 'rgba(244, 63, 94, ',  glow: '#F43F5E' },  // Crimson Fire
      { primary: 'rgba(234, 179, 8, ',  glow: '#EAB308' }   // Gold
    ];

    for (let i = 0; i < count; i++) {
      // 70% dumbbells, 15% Olympic plates, 15% kettlebells
      const randType = Math.random();
      let type = 'dumbbell';
      if (randType > 0.85) type = 'kettlebell';
      else if (randType > 0.70) type = 'plate';

      const colorObj = gymColors[i % gymColors.length];
      const baseOpacity = isMobile ? (Math.random() * 0.15 + 0.22) : (Math.random() * 0.18 + 0.25);

      this.shapes.push({
        type,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 400 + 80, // depth
        size: type === 'dumbbell' ? (Math.random() * 16 + 22) : (Math.random() * 14 + 20),
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 0.018,
        vRotY: (Math.random() - 0.5) * 0.018,
        vRotZ: (Math.random() - 0.5) * 0.015,
        colorObj,
        baseOpacity,
        plateShape: Math.random() > 0.4 ? 'hex' : 'round'
      });
    }
  },

  initAthletes() {
    this.athletes = [];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 2 : 4;
    const exercises = ['press', 'curl', 'squat', 'deadlift'];

    const colors = [
      'rgba(14, 165, 233, ', // cyan
      'rgba(16, 185, 129, ', // emerald
      'rgba(249, 115, 22, ', // orange
      'rgba(168, 85, 247, '  // purple
    ];

    const screenW = window.innerWidth || 1200;
    const screenH = window.innerHeight || 800;

    for (let i = 0; i < count; i++) {
      // Space athletes gracefully across the layout
      let posX = (screenW / (count + 1)) * (i + 1) + (Math.random() - 0.5) * 100;
      let posY = (screenH * 0.35) + (i % 2 === 0 ? -80 : 100) + (Math.random() - 0.5) * 80;

      this.athletes.push({
        x: posX,
        y: posY,
        z: Math.random() * 200 + 150,
        scale: isMobile ? (Math.random() * 0.15 + 0.65) : (Math.random() * 0.2 + 0.95),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1,
        exercise: exercises[i % exercises.length],
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.018 + 0.022,
        colorPrefix: colors[i % colors.length],
        opacity: isMobile ? 0.22 : 0.28
      });
    }
  },

  loop(currentTime = performance.now()) {
    if (!this.enabled || !this.ctx) return;

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    // Smooth mouse interpolation for 3D parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const fov = 550;
    const centerX = this.canvas.width / 2 + this.mouse.x * 40;
    const centerY = this.canvas.height / 2 + this.mouse.y * 40;

    // 1. Render Animated Athletes Training in Background
    for (const a of this.athletes) {
      a.x += a.vx;
      a.y += a.vy;
      a.phase += a.speed;

      // Wrap bounds
      const margin = 120;
      if (a.x < -margin) a.x = this.canvas.width + margin;
      if (a.x > this.canvas.width + margin) a.x = -margin;
      if (a.y < -margin) a.y = this.canvas.height + margin;
      if (a.y > this.canvas.height + margin) a.y = -margin;

      const scale = fov / (fov + a.z);
      const projX = (a.x - centerX) * scale + centerX;
      const projY = (a.y - centerY) * scale + centerY;
      const finalScale = a.scale * scale;

      this.drawAthlete(projX, projY, finalScale, a);
    }

    // 2. Render Floating 3D Dumbbells & Equipment
    for (const s of this.shapes) {
      s.x += s.vx;
      s.y += s.vy;
      s.rotX += s.vRotX;
      s.rotY += s.vRotY;
      s.rotZ += s.vRotZ;

      // Wrap around screen bounds
      const buffer = 70;
      if (s.x < -buffer) s.x = this.canvas.width + buffer;
      if (s.x > this.canvas.width + buffer) s.x = -buffer;
      if (s.y < -buffer) s.y = this.canvas.height + buffer;
      if (s.y > this.canvas.height + buffer) s.y = -buffer;

      // 3D projection
      const scale = fov / (fov + s.z);
      const projX = (s.x - centerX) * scale + centerX;
      const projY = (s.y - centerY) * scale + centerY;
      const projSize = s.size * scale;
      const alpha = s.baseOpacity * Math.min(1, scale * 1.2);

      this.ctx.save();
      this.ctx.translate(projX, projY);

      if (s.type === 'dumbbell') {
        this.draw3DDumbbell(s, projSize, alpha);
      } else if (s.type === 'plate') {
        this.draw3DWeightPlate(s, projSize, alpha);
      } else {
        this.draw3DKettlebell(s, projSize, alpha);
      }

      this.ctx.restore();
    }

    this.animId = requestAnimationFrame((t) => this.loop(t));
  },

  /**
   * Draw a realistic floating 3D dumbbell with knurled steel bar and neon plates
   */
  draw3DDumbbell(s, size, alpha) {
    const ctx = this.ctx;
    ctx.rotate(s.rotZ);

    // 3D tilt perspective scale
    const tiltX = Math.cos(s.rotX) * 0.65 + 0.35;
    const tiltY = Math.cos(s.rotY) * 0.65 + 0.35;
    ctx.scale(tiltY, tiltX);

    const length = size * 2.6;
    const barThick = Math.max(3, size * 0.18);
    const plateRadius = size * 0.85;
    const plateWidth = Math.max(5, size * 0.28);
    const collarWidth = Math.max(2, size * 0.1);

    const neonColor = s.colorObj.primary + (alpha * 1.1) + ')';
    const plateFill = 'rgba(30, 41, 59, ' + (alpha * 0.95) + ')';
    const steelColor = 'rgba(203, 213, 225, ' + (alpha * 0.9) + ')';
    const knurlColor = 'rgba(100, 116, 139, ' + (alpha * 0.8) + ')';

    // 1. Central Steel Handle
    ctx.fillStyle = steelColor;
    ctx.fillRect(-length / 2, -barThick / 2, length, barThick);

    // Handle knurling texture stripes
    ctx.strokeStyle = knurlColor;
    ctx.lineWidth = 1;
    for (let x = -length * 0.25; x <= length * 0.25; x += 4) {
      ctx.beginPath();
      ctx.moveTo(x, -barThick / 2);
      ctx.lineTo(x + 2, barThick / 2);
      ctx.stroke();
    }

    // 2. Collars (stoppers inside plates)
    ctx.fillStyle = 'rgba(148, 163, 184, ' + alpha + ')';
    ctx.fillRect(-length * 0.32 - collarWidth, -barThick * 0.9, collarWidth, barThick * 1.8);
    ctx.fillRect(length * 0.32, -barThick * 0.9, collarWidth, barThick * 1.8);

    // 3. Weight Plates Helper
    const drawPlateStack = (baseX, isRight) => {
      const dir = isRight ? 1 : -1;

      // Inner larger plate
      const p1X = baseX;
      if (s.plateShape === 'hex') {
        this.drawHexPlate(ctx, p1X, 0, plateRadius, plateWidth, plateFill, neonColor);
      } else {
        this.drawRoundPlate(ctx, p1X, 0, plateRadius, plateWidth, plateFill, neonColor);
      }

      // Outer slightly smaller plate
      const p2X = baseX + (dir * (plateWidth + 2));
      if (s.plateShape === 'hex') {
        this.drawHexPlate(ctx, p2X, 0, plateRadius * 0.85, plateWidth * 0.85, plateFill, neonColor);
      } else {
        this.drawRoundPlate(ctx, p2X, 0, plateRadius * 0.85, plateWidth * 0.85, plateFill, neonColor);
      }

      // Outer retaining bolt
      ctx.fillStyle = steelColor;
      ctx.beginPath();
      ctx.arc(p2X + (dir * plateWidth * 0.8), 0, barThick * 0.65, 0, Math.PI * 2);
      ctx.fill();
    };

    drawPlateStack(-length * 0.32 - plateWidth, false);
    drawPlateStack(length * 0.32, true);
  },

  drawHexPlate(ctx, x, y, radius, width, fill, stroke) {
    ctx.save();
    ctx.translate(x, y);

    // Plate body
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;

    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const px = Math.cos(angle) * (width / 2);
      const py = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Plate inner ridge
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const px = Math.cos(angle) * (width * 0.3);
      const py = Math.sin(angle) * (radius * 0.65);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  },

  drawRoundPlate(ctx, x, y, radius, width, fill, stroke) {
    ctx.save();
    ctx.translate(x, y);

    // Outer disc
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, width / 2, radius, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner rim
    ctx.beginPath();
    ctx.ellipse(0, 0, (width / 2) * 0.7, radius * 0.7, 0, 0, Math.PI * 2);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  },

  /**
   * Draw an Olympic 45lb/20kg style bumper plate floating and rotating
   */
  draw3DWeightPlate(s, size, alpha) {
    const ctx = this.ctx;
    ctx.rotate(s.rotZ);
    const tilt = Math.cos(s.rotY) * 0.7 + 0.3;
    ctx.scale(1, tilt);

    const radius = size * 1.3;
    const neon = s.colorObj.primary + alpha + ')';
    const darkDisc = 'rgba(15, 23, 42, ' + (alpha * 0.95) + ')';

    // Outer rim
    ctx.fillStyle = darkDisc;
    ctx.strokeStyle = neon;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner recessed ring
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.72, 0, Math.PI * 2);
    ctx.strokeStyle = neon;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Stainless steel center hub
    ctx.fillStyle = 'rgba(203, 213, 225, ' + alpha + ')';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.28, 0, Math.PI * 2);
    ctx.fill();

    // Center hole for barbell sleeve
    ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.14, 0, Math.PI * 2);
    ctx.fill();

    // Grip cutouts
    for (let i = 0; i < 3; i++) {
      const angle = (Math.PI * 2 / 3) * i + s.rotX;
      const gx = Math.cos(angle) * (radius * 0.5);
      const gy = Math.sin(angle) * (radius * 0.5);
      ctx.strokeStyle = neon;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(gx, gy, radius * 0.12, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  /**
   * Draw a stylized kettlebell with heavy iron base and arch handle
   */
  draw3DKettlebell(s, size, alpha) {
    const ctx = this.ctx;
    ctx.rotate(s.rotZ);
    const tilt = Math.cos(s.rotX) * 0.7 + 0.3;
    ctx.scale(tilt, 1);

    const radius = size * 0.8;
    const neon = s.colorObj.primary + alpha + ')';
    const darkBody = 'rgba(30, 41, 59, ' + (alpha * 0.9) + ')';

    // Kettlebell Handle
    ctx.strokeStyle = 'rgba(203, 213, 225, ' + alpha + ')';
    ctx.lineWidth = Math.max(3, size * 0.18);
    ctx.beginPath();
    ctx.arc(0, -radius * 0.65, radius * 0.6, Math.PI * 0.9, Math.PI * 2.1);
    ctx.stroke();

    // Handle horns
    ctx.fillStyle = 'rgba(148, 163, 184, ' + alpha + ')';
    ctx.fillRect(-radius * 0.5, -radius * 0.7, size * 0.16, radius * 0.4);
    ctx.fillRect(radius * 0.35, -radius * 0.7, size * 0.16, radius * 0.4);

    // Spherical body
    ctx.fillStyle = darkBody;
    ctx.strokeStyle = neon;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, radius * 0.3, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Flat base
    ctx.fillStyle = neon;
    ctx.fillRect(-radius * 0.45, radius * 1.15, radius * 0.9, 3);
  },

  /**
   * Draw an animated human figure training (bicep curl, overhead press, squat, deadlift)
   */
  drawAthlete(x, y, scale, a) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const progress = (Math.sin(a.phase) + 1) / 2; // 0 to 1 smooth cycle
    const color = a.colorPrefix + a.opacity + ')';
    const glowColor = a.colorPrefix + (a.opacity * 1.4) + ')';
    const skinTone = 'rgba(226, 232, 240, ' + a.opacity + ')';

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (a.exercise === 'press') {
      // OVERHEAD DUMBBELL PRESS
      // Head
      ctx.beginPath();
      ctx.arc(0, -75, 9, 0, Math.PI * 2);
      ctx.fill();

      // Torso
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(0, -66);
      ctx.lineTo(0, -25);
      ctx.stroke();

      // Legs (stable athletic stance)
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.lineTo(-14, 15);
      ctx.lineTo(-18, 55);
      ctx.moveTo(0, -25);
      ctx.lineTo(14, 15);
      ctx.lineTo(18, 55);
      ctx.stroke();

      // Arms pressing overhead (progress 0 = shoulder rack, progress 1 = full overhead extension)
      const elbowY = -55 + (1 - progress) * 12;
      const handY = -55 - (progress * 42);

      // Left arm
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, -62);
      ctx.lineTo(-18, elbowY);
      ctx.lineTo(-20, handY);
      ctx.stroke();

      // Right arm
      ctx.beginPath();
      ctx.moveTo(0, -62);
      ctx.lineTo(18, elbowY);
      ctx.lineTo(20, handY);
      ctx.stroke();

      // Dumbbells in hands
      ctx.fillStyle = glowColor;
      this.drawMiniDumbbell(ctx, -20, handY, 14);
      this.drawMiniDumbbell(ctx, 20, handY, 14);

      // Lockout power glow at top of press
      if (progress > 0.88) {
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, handY, 28, 0, Math.PI * 2);
        ctx.stroke();
      }

    } else if (a.exercise === 'curl') {
      // BICEP DUMBBELL CURL
      // Head
      ctx.beginPath();
      ctx.arc(0, -75, 9, 0, Math.PI * 2);
      ctx.fill();

      // Torso
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(0, -66);
      ctx.lineTo(0, -25);
      ctx.stroke();

      // Legs
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.lineTo(-12, 15);
      ctx.lineTo(-14, 55);
      ctx.moveTo(0, -25);
      ctx.lineTo(12, 15);
      ctx.lineTo(14, 55);
      ctx.stroke();

      // Left arm curling (elbow stationary, forearm swinging up)
      const curlAngle = -Math.PI * 0.45 + (progress * Math.PI * 0.85);
      const handLeftX = -18 + Math.cos(curlAngle) * 22;
      const handLeftY = -42 - Math.sin(curlAngle) * 22;

      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, -62);
      ctx.lineTo(-18, -42); // shoulder to elbow
      ctx.lineTo(handLeftX, handLeftY); // elbow to hand
      ctx.stroke();

      // Right arm opposite cycle
      const oppProgress = 1 - progress;
      const curlAngleR = -Math.PI * 0.45 + (oppProgress * Math.PI * 0.85);
      const handRightX = 18 - Math.cos(curlAngleR) * 22;
      const handRightY = -42 - Math.sin(curlAngleR) * 22;

      ctx.beginPath();
      ctx.moveTo(0, -62);
      ctx.lineTo(18, -42);
      ctx.lineTo(handRightX, handRightY);
      ctx.stroke();

      // Dumbbells in hands
      ctx.fillStyle = glowColor;
      this.drawMiniDumbbell(ctx, handLeftX, handLeftY, 13);
      this.drawMiniDumbbell(ctx, handRightX, handRightY, 13);

    } else if (a.exercise === 'squat') {
      // SQUAT (hips & knees bending down)
      const squatDrop = progress * 24;

      // Head
      ctx.beginPath();
      ctx.arc(0, -75 + squatDrop, 9, 0, Math.PI * 2);
      ctx.fill();

      // Barbell across upper back / shoulders
      ctx.lineWidth = 4;
      ctx.strokeStyle = glowColor;
      ctx.beginPath();
      ctx.moveTo(-32, -66 + squatDrop);
      ctx.lineTo(32, -66 + squatDrop);
      ctx.stroke();
      this.drawMiniDumbbell(ctx, -32, -66 + squatDrop, 14);
      this.drawMiniDumbbell(ctx, 32, -66 + squatDrop, 14);

      // Torso
      ctx.strokeStyle = color;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(0, -66 + squatDrop);
      ctx.lineTo(0, -25 + squatDrop);
      ctx.stroke();

      // Arms holding bar
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-22, -66 + squatDrop);
      ctx.lineTo(-16, -52 + squatDrop);
      ctx.lineTo(0, -62 + squatDrop);
      ctx.lineTo(16, -52 + squatDrop);
      ctx.lineTo(22, -66 + squatDrop);
      ctx.stroke();

      // Knees flare outwards during squat
      const kneeXSpread = 16 + progress * 14;
      const kneeY = 15 + squatDrop * 0.4;
      const hipY = -25 + squatDrop;

      ctx.lineWidth = 6;
      ctx.beginPath();
      // Left leg
      ctx.moveTo(0, hipY);
      ctx.lineTo(-kneeXSpread, kneeY);
      ctx.lineTo(-16, 55);
      // Right leg
      ctx.moveTo(0, hipY);
      ctx.lineTo(kneeXSpread, kneeY);
      ctx.lineTo(16, 55);
      ctx.stroke();

    } else {
      // DEADLIFT / PULL
      const hinge = (1 - progress); // 1 = bent over, 0 = locked out upright
      const hipY = -25 + hinge * 10;
      const headY = -75 + hinge * 22;
      const torsoAngle = hinge * 0.55;

      // Head
      ctx.beginPath();
      ctx.arc(Math.sin(torsoAngle) * 20, headY, 9, 0, Math.PI * 2);
      ctx.fill();

      // Torso
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(Math.sin(torsoAngle) * 15, headY + 8);
      ctx.lineTo(0, hipY);
      ctx.stroke();

      // Legs
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, hipY);
      ctx.lineTo(-14, 15 + hinge * 5);
      ctx.lineTo(-16, 55);
      ctx.moveTo(0, hipY);
      ctx.lineTo(14, 15 + hinge * 5);
      ctx.lineTo(16, 55);
      ctx.stroke();

      // Arms hanging down holding barbell
      const barY = -15 + hinge * 45;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(Math.sin(torsoAngle) * 10, headY + 12);
      ctx.lineTo(-16, barY);
      ctx.moveTo(Math.sin(torsoAngle) * 10, headY + 12);
      ctx.lineTo(16, barY);
      ctx.stroke();

      // Barbell
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-34, barY);
      ctx.lineTo(34, barY);
      ctx.stroke();
      this.drawMiniDumbbell(ctx, -34, barY, 15);
      this.drawMiniDumbbell(ctx, 34, barY, 15);
    }

    ctx.restore();
  },

  drawMiniDumbbell(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillRect(-size / 2, -2, size, 4);
    ctx.fillRect(-size / 2 - 2, -size * 0.45, 4, size * 0.9);
    ctx.fillRect(size / 2 - 2, -size * 0.45, 4, size * 0.9);
    ctx.restore();
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
