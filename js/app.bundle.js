/**
 * FITQUEST BUNDLED APPLICATION ENGINE (Self-Contained IIFE)
 * Works seamlessly on file:/// (direct double-click) and http:// / https:// / Vercel
 * Zero external dependencies. Procedural audio, CSS 3D physics, gamification engine.
 */
(function () {
  'use strict';


  /* ==========================================================================
     MODULE: storage.js
     ========================================================================== */
  /**
   * FITQUEST STORAGE SYSTEM
   * Multi-user localStorage isolation, safe parsing, schema migrations
   */
  
  const STORAGE_KEYS = {
    USERS: 'fitquest_users_v1',
    ACTIVE_USER: 'fitquest_active_user_v1',
    USER_DATA_PREFIX: 'fitquest_user_data_'
  };
  
  const Storage = {
    /**
     * Safe JSON parse with fallback
     */
    parse(jsonStr, fallback = null) {
      if (!jsonStr) return fallback;
      try {
        return JSON.parse(jsonStr);
      } catch (e) {
        console.warn('[FitQuest Storage] JSON parse failed, returning fallback:', e);
        return fallback;
      }
    },
  
    /**
     * Safe JSON stringify
     */
    stringify(data) {
      try {
        return JSON.stringify(data);
      } catch (e) {
        console.error('[FitQuest Storage] JSON stringify failed:', e);
        return null;
      }
    },
  
    /**
     * Get all registered users list
     */
    getUsers() {
      const raw = localStorage.getItem(STORAGE_KEYS.USERS);
      return this.parse(raw, []);
    },
  
    /**
     * Save user registration info
     */
    saveUser(user) {
      const users = this.getUsers();
      const existingIndex = users.findIndex(u => u.username.toLowerCase() === user.username.toLowerCase());
      if (existingIndex >= 0) {
        users[existingIndex] = { ...users[existingIndex], ...user };
      } else {
        users.push(user);
      }
      localStorage.setItem(STORAGE_KEYS.USERS, this.stringify(users));
    },
  
    /**
     * Find user by username
     */
    findUser(username) {
      if (!username) return null;
      const users = this.getUsers();
      return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
    },
  
    /**
     * Get currently active logged-in username
     */
    getActiveUsername() {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_USER) || null;
    },
  
    /**
     * Set currently active user
     */
    setActiveUsername(username) {
      if (username) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, username);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
      }
    },
  
    /**
     * Load complete state for a specific user
     */
    getUserData(username) {
      if (!username) return null;
      const key = STORAGE_KEYS.USER_DATA_PREFIX + username.toLowerCase();
      const raw = localStorage.getItem(key);
      const defaultData = {
        profile: null,
        xp: 0,
        level: 1,
        streak: {
          current: 0,
          longest: 0,
          lastActiveDate: null,
          history: []
        },
        completedWorkouts: [],
        dailyQuests: {
          date: null,
          quests: []
        },
        achievements: [],
        workoutPlan: null,
        activeWorkout: null,
        dietPreferences: {
          type: 'vegetarian', // 'vegetarian', 'non-vegetarian', 'vegan'
          mode: 'free',       // 'free', 'premium'
          mealsPerDay: 4
        },
        moodHistory: [],
        measurements: [],
        settings: {
          sound: true,
          animations: true,
          reducedMotion: false,
          units: 'metric'
        }
      };
  
      const saved = this.parse(raw, defaultData);
      return { ...defaultData, ...saved };
    },
  
    /**
     * Save full state for a specific user
     */
    saveUserData(username, data) {
      if (!username || !data) return;
      const key = STORAGE_KEYS.USER_DATA_PREFIX + username.toLowerCase();
      localStorage.setItem(key, this.stringify(data));
    },
  
    /**
     * Reset data for a user
     */
    clearUserData(username) {
      if (!username) return;
      const key = STORAGE_KEYS.USER_DATA_PREFIX + username.toLowerCase();
      localStorage.removeItem(key);
    }
  };
  

  /* ==========================================================================
     MODULE: audio.js
     ========================================================================== */
  /**
   * FITQUEST AUDIO SYNTHESIZER (Web Audio API)
   * Zero external audio assets; 100% synthesized procedural sound effects
   */
  
  class AudioSynthesizer {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }
  
    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }
  
    setEnabled(val) {
      this.enabled = !!val;
    }
  
    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
  
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
  
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);
  
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
  
      osc.connect(gain);
      gain.connect(this.ctx.destination);
  
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    }
  
    playSuccess() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
  
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + index * 0.06;
  
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
  
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
  
        osc.connect(gain);
        gain.connect(this.ctx.destination);
  
        osc.start(start);
        osc.stop(start + 0.18);
      });
    }
  
    playTimerTick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
  
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
  
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
  
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
  
      osc.connect(gain);
      gain.connect(this.ctx.destination);
  
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    }
  
    playTimerDone() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
  
      [880, 1174.66, 1760].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + idx * 0.12;
  
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
  
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
  
        osc.connect(gain);
        gain.connect(this.ctx.destination);
  
        osc.start(start);
        osc.stop(start + 0.4);
      });
    }
  
    playXp() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
  
      const freqs = [659.25, 830.61, 987.77, 1318.51];
      freqs.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + i * 0.05;
  
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, start);
  
        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
  
        osc.connect(gain);
        gain.connect(this.ctx.destination);
  
        osc.start(start);
        osc.stop(start + 0.15);
      });
    }
  
    playLevelUp() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
  
      const chord = [
        { f: 523.25, d: 0.1, t: 0 },
        { f: 659.25, d: 0.1, t: 0.08 },
        { f: 783.99, d: 0.1, t: 0.16 },
        { f: 1046.5, d: 0.4, t: 0.24 },
        { f: 1318.51, d: 0.6, t: 0.32 }
      ];
  
      chord.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + n.t;
  
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, start);
  
        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + n.d);
  
        osc.connect(gain);
        gain.connect(this.ctx.destination);
  
        osc.start(start);
        osc.stop(start + n.d);
      });
    }
  }
  
  const Sound = new AudioSynthesizer();
  

  /* ==========================================================================
     MODULE: 3d-effects.js
     ========================================================================== */
  /**
   * FITQUEST 3D INTERACTIVE VISUAL ENGINE
   * Canvas 3D floating ambient objects, pointer-tracking card tilt, and confetti celebrations
   */
  
  const Effects3D = {
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
          z: Math.random() * 400 + 80,
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
        'rgba(14, 165, 233, ',
        'rgba(16, 185, 129, ',
        'rgba(249, 115, 22, ',
        'rgba(168, 85, 247, '
      ];

      const screenW = window.innerWidth || 1200;
      const screenH = window.innerHeight || 800;

      for (let i = 0; i < count; i++) {
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

        const buffer = 70;
        if (s.x < -buffer) s.x = this.canvas.width + buffer;
        if (s.x > this.canvas.width + buffer) s.x = -buffer;
        if (s.y < -buffer) s.y = this.canvas.height + buffer;
        if (s.y > this.canvas.height + buffer) s.y = -buffer;

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

    draw3DDumbbell(s, size, alpha) {
      const ctx = this.ctx;
      ctx.rotate(s.rotZ);

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

      ctx.fillStyle = steelColor;
      ctx.fillRect(-length / 2, -barThick / 2, length, barThick);

      ctx.strokeStyle = knurlColor;
      ctx.lineWidth = 1;
      for (let x = -length * 0.25; x <= length * 0.25; x += 4) {
        ctx.beginPath();
        ctx.moveTo(x, -barThick / 2);
        ctx.lineTo(x + 2, barThick / 2);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(148, 163, 184, ' + alpha + ')';
      ctx.fillRect(-length * 0.32 - collarWidth, -barThick * 0.9, collarWidth, barThick * 1.8);
      ctx.fillRect(length * 0.32, -barThick * 0.9, collarWidth, barThick * 1.8);

      const drawPlateStack = (baseX, isRight) => {
        const dir = isRight ? 1 : -1;
        const p1X = baseX;
        if (s.plateShape === 'hex') {
          this.drawHexPlate(ctx, p1X, 0, plateRadius, plateWidth, plateFill, neonColor);
        } else {
          this.drawRoundPlate(ctx, p1X, 0, plateRadius, plateWidth, plateFill, neonColor);
        }

        const p2X = baseX + (dir * (plateWidth + 2));
        if (s.plateShape === 'hex') {
          this.drawHexPlate(ctx, p2X, 0, plateRadius * 0.85, plateWidth * 0.85, plateFill, neonColor);
        } else {
          this.drawRoundPlate(ctx, p2X, 0, plateRadius * 0.85, plateWidth * 0.85, plateFill, neonColor);
        }

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
      ctx.fillStyle = fill;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, width / 2, radius, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, (width / 2) * 0.7, radius * 0.7, 0, 0, Math.PI * 2);
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    },

    draw3DWeightPlate(s, size, alpha) {
      const ctx = this.ctx;
      ctx.rotate(s.rotZ);
      const tilt = Math.cos(s.rotY) * 0.7 + 0.3;
      ctx.scale(1, tilt);

      const radius = size * 1.3;
      const neon = s.colorObj.primary + alpha + ')';
      const darkDisc = 'rgba(15, 23, 42, ' + (alpha * 0.95) + ')';

      ctx.fillStyle = darkDisc;
      ctx.strokeStyle = neon;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.72, 0, Math.PI * 2);
      ctx.strokeStyle = neon;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = 'rgba(203, 213, 225, ' + alpha + ')';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.28, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.14, 0, Math.PI * 2);
      ctx.fill();

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

    draw3DKettlebell(s, size, alpha) {
      const ctx = this.ctx;
      ctx.rotate(s.rotZ);
      const tilt = Math.cos(s.rotX) * 0.7 + 0.3;
      ctx.scale(tilt, 1);

      const radius = size * 0.8;
      const neon = s.colorObj.primary + alpha + ')';
      const darkBody = 'rgba(30, 41, 59, ' + (alpha * 0.9) + ')';

      ctx.strokeStyle = 'rgba(203, 213, 225, ' + alpha + ')';
      ctx.lineWidth = Math.max(3, size * 0.18);
      ctx.beginPath();
      ctx.arc(0, -radius * 0.65, radius * 0.6, Math.PI * 0.9, Math.PI * 2.1);
      ctx.stroke();

      ctx.fillStyle = 'rgba(148, 163, 184, ' + alpha + ')';
      ctx.fillRect(-radius * 0.5, -radius * 0.7, size * 0.16, radius * 0.4);
      ctx.fillRect(radius * 0.35, -radius * 0.7, size * 0.16, radius * 0.4);

      ctx.fillStyle = darkBody;
      ctx.strokeStyle = neon;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, radius * 0.3, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = neon;
      ctx.fillRect(-radius * 0.45, radius * 1.15, radius * 0.9, 3);
    },

    drawAthlete(x, y, scale, a) {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      const progress = (Math.sin(a.phase) + 1) / 2;
      const color = a.colorPrefix + a.opacity + ')';
      const glowColor = a.colorPrefix + (a.opacity * 1.4) + ')';

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (a.exercise === 'press') {
        ctx.beginPath();
        ctx.arc(0, -75, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(0, -66);
        ctx.lineTo(0, -25);
        ctx.stroke();

        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, -25);
        ctx.lineTo(-14, 15);
        ctx.lineTo(-18, 55);
        ctx.moveTo(0, -25);
        ctx.lineTo(14, 15);
        ctx.lineTo(18, 55);
        ctx.stroke();

        const elbowY = -55 + (1 - progress) * 12;
        const handY = -55 - (progress * 42);

        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, -62);
        ctx.lineTo(-18, elbowY);
        ctx.lineTo(-20, handY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -62);
        ctx.lineTo(18, elbowY);
        ctx.lineTo(20, handY);
        ctx.stroke();

        ctx.fillStyle = glowColor;
        this.drawMiniDumbbell(ctx, -20, handY, 14);
        this.drawMiniDumbbell(ctx, 20, handY, 14);

        if (progress > 0.88) {
          ctx.strokeStyle = glowColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, handY, 28, 0, Math.PI * 2);
          ctx.stroke();
        }

      } else if (a.exercise === 'curl') {
        ctx.beginPath();
        ctx.arc(0, -75, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(0, -66);
        ctx.lineTo(0, -25);
        ctx.stroke();

        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, -25);
        ctx.lineTo(-12, 15);
        ctx.lineTo(-14, 55);
        ctx.moveTo(0, -25);
        ctx.lineTo(12, 15);
        ctx.lineTo(14, 55);
        ctx.stroke();

        const curlAngle = -Math.PI * 0.45 + (progress * Math.PI * 0.85);
        const handLeftX = -18 + Math.cos(curlAngle) * 22;
        const handLeftY = -42 - Math.sin(curlAngle) * 22;

        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, -62);
        ctx.lineTo(-18, -42);
        ctx.lineTo(handLeftX, handLeftY);
        ctx.stroke();

        const oppProgress = 1 - progress;
        const curlAngleR = -Math.PI * 0.45 + (oppProgress * Math.PI * 0.85);
        const handRightX = 18 - Math.cos(curlAngleR) * 22;
        const handRightY = -42 - Math.sin(curlAngleR) * 22;

        ctx.beginPath();
        ctx.moveTo(0, -62);
        ctx.lineTo(18, -42);
        ctx.lineTo(handRightX, handRightY);
        ctx.stroke();

        ctx.fillStyle = glowColor;
        this.drawMiniDumbbell(ctx, handLeftX, handLeftY, 13);
        this.drawMiniDumbbell(ctx, handRightX, handRightY, 13);

      } else if (a.exercise === 'squat') {
        const squatDrop = progress * 24;

        ctx.beginPath();
        ctx.arc(0, -75 + squatDrop, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 4;
        ctx.strokeStyle = glowColor;
        ctx.beginPath();
        ctx.moveTo(-32, -66 + squatDrop);
        ctx.lineTo(32, -66 + squatDrop);
        ctx.stroke();
        this.drawMiniDumbbell(ctx, -32, -66 + squatDrop, 14);
        this.drawMiniDumbbell(ctx, 32, -66 + squatDrop, 14);

        ctx.strokeStyle = color;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(0, -66 + squatDrop);
        ctx.lineTo(0, -25 + squatDrop);
        ctx.stroke();

        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-22, -66 + squatDrop);
        ctx.lineTo(-16, -52 + squatDrop);
        ctx.lineTo(0, -62 + squatDrop);
        ctx.lineTo(16, -52 + squatDrop);
        ctx.lineTo(22, -66 + squatDrop);
        ctx.stroke();

        const kneeXSpread = 16 + progress * 14;
        const kneeY = 15 + squatDrop * 0.4;
        const hipY = -25 + squatDrop;

        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, hipY);
        ctx.lineTo(-kneeXSpread, kneeY);
        ctx.lineTo(-16, 55);
        ctx.moveTo(0, hipY);
        ctx.lineTo(kneeXSpread, kneeY);
        ctx.lineTo(16, 55);
        ctx.stroke();

      } else {
        const hinge = (1 - progress);
        const hipY = -25 + hinge * 10;
        const headY = -75 + hinge * 22;
        const torsoAngle = hinge * 0.55;

        ctx.beginPath();
        ctx.arc(Math.sin(torsoAngle) * 20, headY, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(Math.sin(torsoAngle) * 15, headY + 8);
        ctx.lineTo(0, hipY);
        ctx.stroke();

        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, hipY);
        ctx.lineTo(-14, 15 + hinge * 5);
        ctx.lineTo(-16, 55);
        ctx.moveTo(0, hipY);
        ctx.lineTo(14, 15 + hinge * 5);
        ctx.lineTo(16, 55);
        ctx.stroke();

        const barY = -15 + hinge * 45;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(Math.sin(torsoAngle) * 10, headY + 12);
        ctx.lineTo(-16, barY);
        ctx.moveTo(Math.sin(torsoAngle) * 10, headY + 12);
        ctx.lineTo(16, barY);
        ctx.stroke();

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
  

  /* ==========================================================================
     MODULE: motivational.js
     ========================================================================== */
  /**
   * FITQUEST MOTIVATIONAL ENGINE
   * Curated pool of original fitness wisdom, psychological resilience quotes,
   * and empowering bilingual Shayari for streaks, workouts, and comebacks.
   */
  
  const Motivational = {
    quotes: {
      discipline: [
        { text: "Discipline is simply choosing between what you want now and what you want most.", author: "FitQuest Philosophy" },
        { text: "Motivation gets you through day one. Unwavering discipline builds the next ten years.", author: "Iron Mindset" },
        { text: "When you don't feel like showing up, that is the exact rep that transforms your character.", author: "Daily Grind" },
        { text: "The weight doesn't get lighter; your will just gets undeniably heavier.", author: "Warrior Code" }
      ],
      strength: [
        { text: "Strength is not built on easy days. It is forged in the silence of your hardest battles.", author: "Inner Forge" },
        { text: "Every heavy lift is proof that your body can handle more than your doubts believed.", author: "Physical Truth" },
        { text: "Your limits are not brick walls; they are milestones waiting to be conquered.", author: "Athletic Spirit" }
      ],
      consistency: [
        { text: "Small daily sessions, compounded over time, conquer mountain-sized goals.", author: "Compound Growth" },
        { text: "Consistency beats talent every single time talent takes a day off.", author: "FitQuest Axiom" },
        { text: "You don't need a heroic workout every day; you just need to show up every day.", author: "Habit Craft" }
      ],
      comeback: [
        { text: "One missed session never erased a journey. Dust off your shoes and conquer today.", author: "Compassionate Return" },
        { text: "A setback is merely the tension on the bow before you shoot forward.", author: "Resilience Protocol" },
        { text: "No guilt. No shame. Just your feet back on the path, one rep at a time.", author: "Grace & Power" }
      ],
      levelup: [
        { text: "A new level unlocked is tangible proof of sweat transformed into greatness.", author: "Ascension" },
        { text: "You just crossed into a higher tier of endurance, power, and mental clarity.", author: "Level Master" },
        { text: "Look how far you've traveled from day one. Celebrate the progress, then set your sight higher.", author: "Peak Performance" }
      ],
      streak: [
        { text: "Your streak is an unbroken chain of promises kept to yourself.", author: "Chain of Will" },
        { text: "Day after day, your dedication is rewriting your personal record book.", author: "Momentum" }
      ]
    },
  
    shayari: [
      {
        hindi: "रास्ते मुश्किल हों तो कदम रोकना नहीं, आज की मेहनत को कल की ताकत बनाना है।",
        meaning: "When paths get steep, do not halt your steps; turn today's sweat into tomorrow's unbreakable power."
      },
      {
        hindi: "मंज़िल मिले न मिले ये मुकद्दर की बात है, हम कोशिश भी न करें ये तो गलत बात है।",
        meaning: "Outcomes belong to tomorrow, but putting in every ounce of genuine effort belongs to our discipline today."
      },
      {
        hindi: "हवाओं से कह दो अपनी हद में रहें, हम परों से नहीं हौसलों से उड़ते हैं।",
        meaning: "Tell the headwinds to respect their boundary; we do not soar on wings, we soar on pure determination."
      },
      {
        hindi: "गिरते हैं शहसवार ही मैदाने जंग में, वो तिफ़्ल क्या गिरेगा जो घुटनों के बल चले।",
        meaning: "Only champions fall when striving on the field; those who fear exertion never experience the joy of victory."
      },
      {
        hindi: "खुद ही को कर बुलंद इतना कि हर तकदीर से पहले, खुदा बन्दे से खुद पूछे बता तेरी रज़ा क्या है।",
        meaning: "Elevate your discipline so high through daily work that your achievements speak before any doubt can rise."
      },
      {
        hindi: "सफर में धूप तो होगी जो चल सको तो चलो, सभी हैं भीड़ में तुम भी निकल सको तो चलो।",
        meaning: "The journey will test your endurance; step forward from the crowd and carve your own unstoppable trajectory."
      }
    ],
  
    /**
     * Get a random quote by category
     */
    getQuote(category = 'discipline') {
      const list = this.quotes[category] || this.quotes.discipline;
      const item = list[Math.floor(Math.random() * list.length)];
      return item;
    },
  
    /**
     * Get a random inspirational Shayari
     */
    getShayari() {
      return this.shayari[Math.floor(Math.random() * this.shayari.length)];
    },
  
    /**
     * Get combined motivational card content
     */
    getRandomInspiration(category = 'discipline') {
      const quote = this.getQuote(category);
      const sh = this.getShayari();
      return {
        quote: quote.text,
        author: quote.author,
        shayariHindi: sh.hindi,
        shayariEnglish: sh.meaning
      };
    }
  };
  

  /* ==========================================================================
     MODULE: exercises.js
     ========================================================================== */
  /**
   * FITQUEST EXERCISE DATABASE
   * 50+ comprehensively documented exercises with anatomical targets, instructions,
   * rest intervals, safety guidelines, and inline SVG muscle visualizations.
   */
  
  const EXERCISES = [
    // ==========================================
    // CHEST (8)
    // ==========================================
    {
      id: 'chest_pushups',
      name: 'Push-ups',
      category: 'chest',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      targetMuscles: ['Pectoralis Major', 'Triceps', 'Anterior Deltoid', 'Core'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 60,
      icon: '💪',
      instructions: [
        'Start in a high plank position with hands positioned slightly wider than shoulder-width apart.',
        'Engage your glutes and brace your core so your body forms a straight line from heels to head.',
        'Lower your chest toward the floor by bending your elbows at a 45-degree angle from your torso.',
        'Push firmly through your palms to return to the starting position without locking elbows harshly.'
      ],
      tips: 'Keep your neck neutral by gazing about six inches in front of your fingertips.',
      safetyNotes: 'Avoid sagging your hips or flaring your elbows out at 90 degrees to protect the rotator cuff.'
    },
    {
      id: 'chest_incline_pushups',
      name: 'Incline Push-ups',
      category: 'chest',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      targetMuscles: ['Lower Pectorals', 'Triceps', 'Shoulders'],
      defaultSets: 3,
      defaultReps: 15,
      defaultDuration: null,
      restTime: 45,
      icon: '🪜',
      instructions: [
        'Place your hands shoulder-width apart on an elevated surface like a sturdy bench, box, or step.',
        'Step your feet back until your body forms a clean plank angle.',
        'Lower your sternum smoothly toward the edge of the elevated surface.',
        'Press back up with controlled exhalation until arms are straight.'
      ],
      tips: 'The higher the surface elevation, the easier the resistance will be.',
      safetyNotes: 'Ensure the elevated platform is securely anchored and cannot slip.'
    },
    {
      id: 'chest_decline_pushups',
      name: 'Decline Push-ups',
      category: 'chest',
      difficulty: 'intermediate',
      equipment: 'bodyweight',
      targetMuscles: ['Upper Pectorals', 'Anterior Deltoid', 'Triceps'],
      defaultSets: 3,
      defaultReps: 10,
      defaultDuration: null,
      restTime: 60,
      icon: '📐',
      instructions: [
        'Place your toes on an elevated bench or sturdy chair and your hands flat on the floor.',
        'Align your hands directly under your shoulders with fingers pointing slightly outward.',
        'Slowly lower your chest toward the floor while bracing your abdominals tightly.',
        'Drive through your palms back to the top position.'
      ],
      tips: 'Maintain rigid core tension to prevent hyperextending your lumbar spine.',
      safetyNotes: 'If you feel excess pressure in the wrists, rotate hands outward slightly.'
    },
    {
      id: 'chest_diamond_pushups',
      name: 'Diamond Push-ups',
      category: 'chest',
      difficulty: 'advanced',
      equipment: 'bodyweight',
      targetMuscles: ['Inner Pectorals', 'Triceps Brachii', 'Core'],
      defaultSets: 3,
      defaultReps: 8,
      defaultDuration: null,
      restTime: 75,
      icon: '💎',
      instructions: [
        'Assume a push-up position and bring your index fingers and thumbs together to form a diamond shape under your chest.',
        'Keep your core tight and elbows tracking close along your ribcage as you descend.',
        'Touch your chest gently to your hands, then press back up strongly.'
      ],
      tips: 'Spread your feet slightly wider to maintain stability.',
      safetyNotes: 'If you feel elbow discomfort, open your hands 2 inches wider.'
    },
    {
      id: 'chest_wide_pushups',
      name: 'Wide-Grip Push-ups',
      category: 'chest',
      difficulty: 'intermediate',
      equipment: 'bodyweight',
      targetMuscles: ['Pectoralis Major (Outer)', 'Anterior Deltoids'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 60,
      icon: '👐',
      instructions: [
        'Set your hands about 1.5 times shoulder-width apart on the ground.',
        'Lower your torso until your elbows reach a 90-degree angle.',
        'Squeeze your chest muscles at the apex of the push.'
      ],
      tips: 'Focus on actively squeezing your chest together at the top of every rep.',
      safetyNotes: 'Do not sink too deep past 90 degrees if you have shoulder impingement.'
    },
    {
      id: 'chest_db_bench_press',
      name: 'Dumbbell Bench Press',
      category: 'chest',
      difficulty: 'intermediate',
      equipment: 'dumbbells',
      targetMuscles: ['Pectoralis Major', 'Triceps', 'Front Deltoids'],
      defaultSets: 4,
      defaultReps: 10,
      defaultDuration: null,
      restTime: 75,
      icon: '🏋️',
      instructions: [
        'Lie back on a flat bench with a dumbbell in each hand resting at the sides of your chest.',
        'Plant your feet firmly on the floor and retract your shoulder blades into the bench.',
        'Press the dumbbells upward until arms are extended, without clanking weights together.',
        'Lower with control for 2 seconds until you feel a comfortable stretch across your chest.'
      ],
      tips: 'Keep your forearms vertical to the floor throughout the entire movement path.',
      safetyNotes: 'Do not let your elbows flare out 90 degrees; maintain a 45 to 60-degree tuck.'
    },
    {
      id: 'chest_barbell_bench_press',
      name: 'Barbell Bench Press',
      category: 'chest',
      difficulty: 'intermediate',
      equipment: 'barbell',
      targetMuscles: ['Pectoralis Major', 'Anterior Deltoid', 'Triceps'],
      defaultSets: 4,
      defaultReps: 8,
      defaultDuration: null,
      restTime: 90,
      icon: '🏋️‍♂️',
      instructions: [
        'Lie under the racked bar with eyes aligned with the bar.',
        'Grip the bar slightly wider than shoulder width with thumbs wrapped securely.',
        'Unrack the bar and bring it above your mid-chest.',
        'Lower with control until the bar touches your lower sternum, then drive upward explosively.'
      ],
      tips: 'Drive your feet into the floor to utilize leg drive and body tension.',
      safetyNotes: 'Always use safety pins or a spotter when lifting heavy weights.'
    },
    {
      id: 'chest_incline_db_press',
      name: 'Incline Dumbbell Press',
      category: 'chest',
      difficulty: 'intermediate',
      equipment: 'dumbbells',
      targetMuscles: ['Clavicular Pectoralis (Upper Chest)', 'Front Deltoid', 'Triceps'],
      defaultSets: 3,
      defaultReps: 10,
      defaultDuration: null,
      restTime: 75,
      icon: '📐',
      instructions: [
        'Set an adjustable bench to an incline between 30 and 45 degrees.',
        'Sit back holding dumbbells at shoulder level with palms facing away.',
        'Press the dumbbells straight up over your upper chest.',
        'Lower smoothly until your elbows descend slightly below bench level.'
      ],
      tips: 'Avoid bench angles higher than 45 degrees as that shifts emphasis heavily to shoulders.',
      safetyNotes: 'Keep your lower back lightly arched without lifting your hips off the seat.'
    },
  
    // ==========================================
    // BACK (7)
    // ==========================================
    {
      id: 'back_pullups',
      name: 'Pull-ups',
      category: 'back',
      difficulty: 'advanced',
      equipment: 'pull-up bar',
      targetMuscles: ['Latissimus Dorsi', 'Biceps', 'Rhomboids', 'Rear Deltoids'],
      defaultSets: 3,
      defaultReps: 6,
      defaultDuration: null,
      restTime: 90,
      icon: '🧗',
      instructions: [
        'Grip a pull-up bar with an overhand grip slightly wider than shoulder-width.',
        'Hang with arms fully extended and retract your shoulder blades downward.',
        'Pull your chest up toward the bar by driving your elbows down toward your hips.',
        'Pause briefly with your chin clearing the bar, then lower with total control.'
      ],
      tips: 'Imagine pulling your elbows into your back pockets rather than yanking with arms.',
      safetyNotes: 'Avoid swinging your legs or using excessive kipping momentum.'
    },
    {
      id: 'back_chinups',
      name: 'Chin-ups',
      category: 'back',
      difficulty: 'intermediate',
      equipment: 'pull-up bar',
      targetMuscles: ['Latissimus Dorsi', 'Biceps Brachii', 'Brachialis'],
      defaultSets: 3,
      defaultReps: 8,
      defaultDuration: null,
      restTime: 90,
      icon: '🧗‍♂️',
      instructions: [
        'Grasp the bar with an underhand grip (palms facing you) shoulder-width apart.',
        'Pull your chest up until your chin comfortably crosses over the bar.',
        'Lower smoothly until arms reach full extension at the dead hang.'
      ],
      tips: 'Underhand grip provides greater mechanical advantage to your biceps.',
      safetyNotes: 'Do not drop suddenly out of the top position to protect shoulder joints.'
    },
    {
      id: 'back_lat_pulldown',
      name: 'Lat Pulldown',
      category: 'back',
      difficulty: 'beginner',
      equipment: 'cable machine',
      targetMuscles: ['Latissimus Dorsi', 'Teres Major', 'Biceps'],
      defaultSets: 4,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 60,
      icon: '⚙️',
      instructions: [
        'Sit comfortably at the lat pulldown machine and secure thighs under the roller pads.',
        'Grip the wide bar with hands slightly wider than shoulder width.',
        'Lean back approximately 10 degrees and pull the bar down smoothly to your upper chest.',
        'Control the ascent as the cable pulls the weight back to the top.'
      ],
      tips: 'Lead with your elbows and resist the weight on the way up.',
      safetyNotes: 'Never pull the bar behind your neck as this strains the cervical spine.'
    },
    {
      id: 'back_seated_cable_row',
      name: 'Seated Cable Row',
      category: 'back',
      difficulty: 'intermediate',
      equipment: 'cable machine',
      targetMuscles: ['Rhomboids', 'Middle Trapezius', 'Lats', 'Erector Spinae'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 60,
      icon: '🚣',
      instructions: [
        'Sit with knees slightly bent and feet secured on the footrests.',
        'Grasp the V-grip handle and sit upright with a neutral spine.',
        'Pull the handle into your abdomen while squeezing shoulder blades together.',
        'Extend arms slowly back to the starting point without rounding your back.'
      ],
      tips: 'Do not rock back and forth excessively; maintain an upright torso.',
      safetyNotes: 'Keep your lower back straight and avoid rounding forward.'
    },
    {
      id: 'back_onearm_db_row',
      name: 'One-Arm Dumbbell Row',
      category: 'back',
      difficulty: 'intermediate',
      equipment: 'dumbbells',
      targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Rear Deltoid'],
      defaultSets: 3,
      defaultReps: 10,
      defaultDuration: null,
      restTime: 60,
      icon: '🏋️',
      instructions: [
        'Place one knee and one hand on a flat bench with your torso parallel to the ground.',
        'Hold a dumbbell in the opposite hand with arm hanging straight down.',
        'Pull the dumbbell upward toward your hip crease, keeping your elbow tucked close.',
        'Lower the weight back down slowly for a full stretch in your lats.'
      ],
      tips: 'Avoid twisting your torso at the top; keep hips and shoulders square.',
      safetyNotes: 'Keep your spine flat and avoid letting your head drop down.'
    },
    {
      id: 'back_barbell_bent_row',
      name: 'Barbell Bent-Over Row',
      category: 'back',
      difficulty: 'advanced',
      equipment: 'barbell',
      targetMuscles: ['Lats', 'Rhomboids', 'Trapezius', 'Erector Spinae', 'Forearms'],
      defaultSets: 4,
      defaultReps: 8,
      defaultDuration: null,
      restTime: 90,
      icon: '🏋️‍♂️',
      instructions: [
        'Stand with feet shoulder-width apart, bend knees slightly, and hinge forward at hips until torso is roughly 45 degrees.',
        'Grip the barbell with an overhand grip slightly wider than knees.',
        'Pull the bar up toward your belly button by squeezing shoulder blades.',
        'Lower the bar under control without rounding your lumbar spine.'
      ],
      tips: 'Brace your core tightly as if preparing to take a punch.',
      safetyNotes: 'If you feel strain in your lower back, reduce weight and reset hip hinge.'
    },
    {
      id: 'back_band_row',
      name: 'Resistance Band Row',
      category: 'back',
      difficulty: 'beginner',
      equipment: 'resistance bands',
      targetMuscles: ['Upper Back', 'Rhomboids', 'Lats'],
      defaultSets: 3,
      defaultReps: 15,
      defaultDuration: null,
      restTime: 45,
      icon: '🎗️',
      instructions: [
        'Loop a resistance band around your feet while seated with legs extended.',
        'Hold the handles with both hands and maintain tall upright posture.',
        'Pull the bands back toward your ribcage, squeezing your back blades together.',
        'Return smoothly against the resistance of the elastic band.'
      ],
      tips: 'Hold the peak contraction for 1 full second on each repetition.',
      safetyNotes: 'Inspect bands for tears or frays before anchoring.'
    },
  
    // ==========================================
    // SHOULDERS (6)
    // ==========================================
    {
      id: 'sh_pike_pushups',
      name: 'Pike Push-ups',
      category: 'shoulders',
      difficulty: 'intermediate',
      equipment: 'bodyweight',
      targetMuscles: ['Anterior Deltoids', 'Triceps', 'Upper Traps'],
      defaultSets: 3,
      defaultReps: 10,
      defaultDuration: null,
      restTime: 60,
      icon: '📐',
      instructions: [
        'Start in a standard push-up position and walk your feet forward so your hips rise into an inverted V shape.',
        'Keep your arms straight and hands placed slightly wider than shoulders.',
        'Lower the top of your head diagonally forward toward the floor between your hands.',
        'Press firmly through your palms to return back to the inverted V shape.'
      ],
      tips: 'Look toward your toes rather than looking at your hands to maintain cervical alignment.',
      safetyNotes: 'Do not allow your shoulders to collapse into your neck.'
    },
    {
      id: 'sh_db_press',
      name: 'Dumbbell Shoulder Press',
      category: 'shoulders',
      difficulty: 'intermediate',
      equipment: 'dumbbells',
      targetMuscles: ['Anterior & Lateral Deltoids', 'Triceps', 'Upper Trapezius'],
      defaultSets: 4,
      defaultReps: 10,
      defaultDuration: null,
      restTime: 75,
      icon: '🏋️',
      instructions: [
        'Sit on an upright bench or stand tall with dumbbells held at ear level, palms facing forward.',
        'Press dumbbells overhead until arms are extended, converging gently at the top.',
        'Lower the dumbbells back down under control to ear level over 2 seconds.'
      ],
      tips: 'Avoid hyperextending your lower back by engaging your core and glutes.',
      safetyNotes: 'Do not drop the weights abruptly; lower them back smoothly.'
    },
    {
      id: 'sh_lateral_raises',
      name: 'Dumbbell Lateral Raises',
      category: 'shoulders',
      difficulty: 'beginner',
      equipment: 'dumbbells',
      targetMuscles: ['Lateral Deltoids (Side Delts)'],
      defaultSets: 3,
      defaultReps: 15,
      defaultDuration: null,
      restTime: 45,
      icon: '🦅',
      instructions: [
        'Stand tall holding light dumbbells at your sides with palms facing inward.',
        'Keep a slight bend in your elbows and raise arms out to the sides until parallel with the floor.',
        'Pause briefly at shoulder height, then lower with control.'
      ],
      tips: 'Lead with your elbows and imagine pouring water from pitchers at the top.',
      safetyNotes: 'Use light weight; swinging your torso robs work from the lateral head.'
    },
    {
      id: 'sh_front_raises',
      name: 'Front Dumbbell Raises',
      category: 'shoulders',
      difficulty: 'beginner',
      equipment: 'dumbbells',
      targetMuscles: ['Anterior Deltoids'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 45,
      icon: '🏹',
      instructions: [
        'Stand holding dumbbells resting against the front of your thighs.',
        'Raise one or both arms straight forward until reaching eye level.',
        'Lower smoothly back to starting position.'
      ],
      tips: 'Do not lean back as the weights rise.',
      safetyNotes: 'Keep wrists firm and avoid bending elbows excessively.'
    },
    {
      id: 'sh_rear_delt_fly',
      name: 'Rear Delt Fly',
      category: 'shoulders',
      difficulty: 'intermediate',
      equipment: 'dumbbells',
      targetMuscles: ['Posterior Deltoids', 'Rhomboids'],
      defaultSets: 3,
      defaultReps: 15,
      defaultDuration: null,
      restTime: 45,
      icon: '🦋',
      instructions: [
        'Hinge forward at your hips until your torso is nearly parallel to the floor.',
        'Hold light dumbbells hanging down with palms facing each other.',
        'Raise your arms out to the sides like wings until level with your shoulders.',
        'Squeeze the back of your shoulders at the top, then lower with control.'
      ],
      tips: 'Focus on pulling with the back of your shoulders, not your biceps.',
      safetyNotes: 'Keep your spine flat and neutral throughout the set.'
    },
    {
      id: 'sh_arnold_press',
      name: 'Arnold Press',
      category: 'shoulders',
      difficulty: 'advanced',
      equipment: 'dumbbells',
      targetMuscles: ['All 3 Deltoid Heads', 'Triceps', 'Upper Trapezius'],
      defaultSets: 3,
      defaultReps: 10,
      defaultDuration: null,
      restTime: 75,
      icon: '⚡',
      instructions: [
        'Hold dumbbells in front of your chest at chin height with palms facing inward (supinated).',
        'As you press overhead, rotate your wrists outward so palms face forward at full lockout.',
        'Reverse the rotational movement as you lower dumbbells back to the chest.'
      ],
      tips: 'Perform the rotation fluidly throughout the pressing arc.',
      safetyNotes: 'Do not bang dumbbells together at the top.'
    },
  
    // ==========================================
    // ARMS (6)
    // ==========================================
    {
      id: 'arm_bicep_curl',
      name: 'Dumbbell Biceps Curl',
      category: 'arms',
      difficulty: 'beginner',
      equipment: 'dumbbells',
      targetMuscles: ['Biceps Brachii', 'Brachialis'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 60,
      icon: '💪',
      instructions: [
        'Stand tall holding dumbbells at sides with palms facing forward.',
        'Pin your elbows to your sides and curl the weights up toward your shoulders.',
        'Squeeze your biceps hard at the peak, then lower slowly over 2 seconds.'
      ],
      tips: 'Keep your upper arms stationary; do not swing your elbows forward.',
      safetyNotes: 'Avoid leaning back to cheat the weight upward.'
    },
    {
      id: 'arm_hammer_curl',
      name: 'Hammer Curl',
      category: 'arms',
      difficulty: 'beginner',
      equipment: 'dumbbells',
      targetMuscles: ['Brachioradialis', 'Brachialis', 'Biceps'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 60,
      icon: '🔨',
      instructions: [
        'Hold dumbbells with a neutral grip (palms facing each other).',
        'Curl the weights upward while keeping palms facing each other throughout the rep.',
        'Lower under control to full arm extension.'
      ],
      tips: 'Great for building forearm thickness and grip strength.',
      safetyNotes: 'Do not rock your hips.'
    },
    {
      id: 'arm_concentration_curl',
      name: 'Concentration Curl',
      category: 'arms',
      difficulty: 'intermediate',
      equipment: 'dumbbells',
      targetMuscles: ['Biceps Peak (Short Head)'],
      defaultSets: 3,
      defaultReps: 10,
      defaultDuration: null,
      restTime: 45,
      icon: '🎯',
      instructions: [
        'Sit on a bench with legs spread and rest the back of your tricep against your inner thigh.',
        'Curl the dumbbell toward your face without moving your elbow off your leg.',
        'Pause for a peak contraction at the top before lowering.'
      ],
      tips: 'This completely isolates the biceps by eliminating momentum.',
      safetyNotes: 'Do not slouch excessively; keep chest open.'
    },
    {
      id: 'arm_triceps_dips',
      name: 'Bench Triceps Dips',
      category: 'arms',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      targetMuscles: ['Triceps Brachii', 'Front Deltoids'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 60,
      icon: '🪑',
      instructions: [
        'Sit on the edge of a bench and place hands next to hips with fingers gripping the edge.',
        'Slide hips off the bench with knees bent at 90 degrees (or legs straight for harder variation).',
        'Bend elbows to 90 degrees to lower hips toward the floor.',
        'Press through your palms back up to full arm extension.'
      ],
      tips: 'Keep your back skimming close to the edge of the bench.',
      safetyNotes: 'Do not dip deeper than 90 degrees to protect the shoulder anterior capsule.'
    },
    {
      id: 'arm_triceps_extension',
      name: 'Overhead Dumbbell Triceps Extension',
      category: 'arms',
      difficulty: 'intermediate',
      equipment: 'dumbbells',
      targetMuscles: ['Triceps Long Head'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 60,
      icon: '💡',
      instructions: [
        'Sit or stand holding one dumbbell overhead with both hands cup-gripping the upper weight plate.',
        'Keep your upper arms pointing toward the ceiling near your ears.',
        'Bend elbows to lower the weight behind your head.',
        'Extend arms overhead to return to the top position.'
      ],
      tips: 'Keep your elbows from flaring out excessively.',
      safetyNotes: 'Ensure a secure grip before taking the weight over your head.'
    },
    {
      id: 'arm_triceps_pushdown',
      name: 'Cable Triceps Pushdown',
      category: 'arms',
      difficulty: 'beginner',
      equipment: 'cable machine',
      targetMuscles: ['Lateral & Medial Triceps Heads'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 60,
      icon: '⚙️',
      instructions: [
        'Attach a straight bar or rope to a high cable pulley.',
        'Tuck your elbows tightly against your ribs and grip the attachment.',
        'Push down until arms are completely extended and triceps are locked out.',
        'Return up to 90 degrees with control.'
      ],
      tips: 'Only your forearms should move; keep upper arms locked in place.',
      safetyNotes: 'Avoid using your body weight to press the cable down.'
    },
  
    // ==========================================
    // LEGS (12)
    // ==========================================
    {
      id: 'leg_bodyweight_squat',
      name: 'Bodyweight Squats',
      category: 'legs',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
      defaultSets: 3,
      defaultReps: 15,
      defaultDuration: null,
      restTime: 45,
      icon: '🦵',
      instructions: [
        'Stand with feet shoulder-width apart, toes turned slightly out at 15 degrees.',
        'Extend arms forward for balance and send hips back as if sitting into a chair.',
        'Descend until thighs are at least parallel with the floor while keeping chest tall.',
        'Drive through your whole foot (heels and midfoot) to stand back up.'
      ],
      tips: 'Keep knees tracking directly in line with your second toe.',
      safetyNotes: 'Do not allow your knees to cave inward during the ascent.'
    },
    {
      id: 'leg_goblet_squat',
      name: 'Goblet Squats',
      category: 'legs',
      difficulty: 'intermediate',
      equipment: 'dumbbells',
      targetMuscles: ['Quadriceps', 'Glutes', 'Core', 'Upper Back'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 60,
      icon: '🏆',
      instructions: [
        'Hold a dumbbell or kettlebell vertically against your chest with both hands under the top horn.',
        'Squat down between your legs until elbows touch the inside of your knees.',
        'Keep your torso upright and drive back up to standing.'
      ],
      tips: 'The front-loaded weight automatically assists in keeping your torso upright.',
      safetyNotes: 'Do not let the weight pull your upper back into a round posture.'
    },
    {
      id: 'leg_barbell_squat',
      name: 'Barbell Back Squats',
      category: 'legs',
      difficulty: 'advanced',
      equipment: 'barbell',
      targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Core'],
      defaultSets: 4,
      defaultReps: 8,
      defaultDuration: null,
      restTime: 90,
      icon: '🏋️‍♂️',
      instructions: [
        'Step under the racked barbell and rest it securely across your upper traps.',
        'Unrack the bar and take two clean steps back to set your stance.',
        'Take a deep belly breath, brace your core, and squat down to parallel depth.',
        'Drive powerfully up through the floor, exhaling past the sticking point.'
      ],
      tips: 'Screw your feet into the floor to activate your glutes and create hip stability.',
      safetyNotes: 'Always set safety catch bars to appropriate depth in the rack.'
    },
    {
      id: 'leg_lunges',
      name: 'Forward Lunges',
      category: 'legs',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Balance'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 45,
      icon: '🚶',
      instructions: [
        'Stand tall with feet hip-width apart and hands on hips.',
        'Take a large step forward and lower your hips until both knees are bent at 90 degrees.',
        'Your back knee should hover just an inch above the floor.',
        'Push through your front heel to return back to starting stance.'
      ],
      tips: 'Keep your torso vertical; avoid leaning forward onto your front thigh.',
      safetyNotes: 'Do not let the front knee collapse inward.'
    },
    {
      id: 'leg_reverse_lunges',
      name: 'Reverse Lunges',
      category: 'legs',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      targetMuscles: ['Glutes', 'Hamstrings', 'Quadriceps'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 45,
      icon: '🔙',
      instructions: [
        'From a standing position, step backward with one foot.',
        'Lower your hips straight down into a 90-degree bend in both legs.',
        'Drive through the front heel to return to standing.'
      ],
      tips: 'Reverse lunges place substantially less shear stress on the knee joint.',
      safetyNotes: 'Step straight back, not crossing behind your front foot.'
    },
    {
      id: 'leg_bulgarian_split_squat',
      name: 'Bulgarian Split Squats',
      category: 'legs',
      difficulty: 'advanced',
      equipment: 'dumbbells',
      targetMuscles: ['Quadriceps', 'Gluteus Medius & Maximus', 'Hamstrings'],
      defaultSets: 3,
      defaultReps: 10,
      defaultDuration: null,
      restTime: 75,
      icon: '⚡',
      instructions: [
        'Stand about two feet in front of a bench and place the top of one foot on the bench behind you.',
        'Lower your back knee toward the ground while keeping front shin relatively vertical.',
        'Drive through your front foot to ascend back to the top.'
      ],
      tips: 'Lean your torso forward 15 degrees to shift more activation directly into the glutes.',
      safetyNotes: 'Hold onto a wall for stability if balance is challenging at first.'
    },
    {
      id: 'leg_step_ups',
      name: 'Step-ups',
      category: 'legs',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      targetMuscles: ['Quadriceps', 'Glutes'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 45,
      icon: '🪜',
      instructions: [
        'Place your right foot fully onto a sturdy bench or plyo box.',
        'Drive through your right foot to lift your body up until right leg is straight.',
        'Step down with control and repeat for assigned repetitions before switching legs.'
      ],
      tips: 'Do not bounce off your back toe; let the working leg do 95% of the lift.',
      safetyNotes: 'Use a stable box that does not wobble.'
    },
    {
      id: 'leg_romanian_deadlift',
      name: 'Romanian Deadlift (RDL)',
      category: 'legs',
      difficulty: 'intermediate',
      equipment: 'dumbbells',
      targetMuscles: ['Hamstrings', 'Glutes', 'Erector Spinae'],
      defaultSets: 4,
      defaultReps: 10,
      defaultDuration: null,
      restTime: 75,
      icon: '🏋️',
      instructions: [
        'Stand holding dumbbells against the front of your thighs with a slight bend in knees.',
        'Push your hips backward as if touching a wall behind you while sliding dumbbells down shins.',
        'Stop when you feel a deep stretch in your hamstrings (usually mid-shin).',
        'Contract your glutes and drive hips forward to return to standing.'
      ],
      tips: 'This is a horizontal hip-hinge, NOT a vertical squat.',
      safetyNotes: 'Never round your back; keep chest proud and shoulders back.'
    },
    {
      id: 'leg_press',
      name: 'Leg Press',
      category: 'legs',
      difficulty: 'beginner',
      equipment: 'leg press',
      targetMuscles: ['Quadriceps', 'Glutes'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 60,
      icon: '⚙️',
      instructions: [
        'Sit in the leg press seat with your back and head resting flat against the pad.',
        'Place feet shoulder-width on the sled platform.',
        'Release safety handles and lower the platform until knees are at 90 degrees.',
        'Press through feet back to extended legs without locking knees out.'
      ],
      tips: 'Never lock your knees out completely at the top.',
      safetyNotes: 'Keep your lower back and tailbone pressed firmly into the back pad.'
    },
    {
      id: 'leg_extension',
      name: 'Leg Extension',
      category: 'legs',
      difficulty: 'beginner',
      equipment: 'leg extension machine',
      targetMuscles: ['Rectus Femoris (Quadriceps)'],
      defaultSets: 3,
      defaultReps: 15,
      defaultDuration: null,
      restTime: 45,
      icon: '⚙️',
      instructions: [
        'Sit on the machine with knees aligned with the pivot axis and shin pad just above ankles.',
        'Extend your legs until knees are straight, squeezing quadriceps hard at the peak.',
        'Lower smoothly back to starting position.'
      ],
      tips: 'Hold the top contraction for 1 second on each rep.',
      safetyNotes: 'If you have patellar knee issues, do not use excessive weight.'
    },
    {
      id: 'leg_curl',
      name: 'Hamstring Leg Curl',
      category: 'legs',
      difficulty: 'beginner',
      equipment: 'leg curl machine',
      targetMuscles: ['Hamstrings (Biceps Femoris)'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 45,
      icon: '⚙️',
      instructions: [
        'Lie face down on the leg curl machine with roller pad positioned right above your heels.',
        'Curl the pad up toward your buttocks as far as possible.',
        'Lower under strict control back down.'
      ],
      tips: 'Keep hips pinned to the bench; do not let your lower back arch.',
      safetyNotes: 'Control the descent; do not let the weight stack slam.'
    },
    {
      id: 'leg_calf_raises',
      name: 'Standing Calf Raises',
      category: 'legs',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      targetMuscles: ['Gastrocnemius', 'Soleus'],
      defaultSets: 4,
      defaultReps: 20,
      defaultDuration: null,
      restTime: 30,
      icon: '🩰',
      instructions: [
        'Stand tall on the balls of your feet on a step with heels hanging off.',
        'Lower heels down into a full calf stretch.',
        'Press through the big toes to raise heels as high as possible.',
        'Hold the contraction at the top for 1 full second.'
      ],
      tips: 'Do not bounce; control both the stretch and the squeeze.',
      safetyNotes: 'Hold a wall or railing for balance.'
    },
  
    // ==========================================
    // CORE (8)
    // ==========================================
    {
      id: 'core_plank',
      name: 'Forearm Plank',
      category: 'core',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Glutes', 'Shoulders'],
      defaultSets: 3,
      defaultReps: null,
      defaultDuration: 45,
      restTime: 45,
      icon: '🪵',
      instructions: [
        'Place forearms on the floor with elbows aligned directly under shoulders.',
        'Step feet back and lift hips so body forms a horizontal line.',
        'Squeeze glutes, brace abs, and maintain neutral neck gazing at the floor.'
      ],
      tips: 'Actively pull elbows toward toes to create high tension irradiation.',
      safetyNotes: 'Do not let your hips sag toward the floor.'
    },
    {
      id: 'core_side_plank',
      name: 'Side Plank',
      category: 'core',
      difficulty: 'intermediate',
      equipment: 'bodyweight',
      targetMuscles: ['Obliques', 'Quadratus Lumborum', 'Gluteus Medius'],
      defaultSets: 3,
      defaultReps: null,
      defaultDuration: 30,
      restTime: 45,
      icon: '📐',
      instructions: [
        'Lie on your side with forearm flat on the ground and elbow under shoulder.',
        'Stack your feet and elevate your hips until your body forms a straight diagonal line.',
        'Hold this position while breathing smoothly.'
      ],
      tips: 'Keep top hip pressed slightly forward to avoid twisting.',
      safetyNotes: 'Drop the bottom knee to the floor if full stack causes hip fatigue.'
    },
    {
      id: 'core_crunches',
      name: 'Abdominal Crunches',
      category: 'core',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      targetMuscles: ['Upper Rectus Abdominis'],
      defaultSets: 3,
      defaultReps: 20,
      defaultDuration: null,
      restTime: 30,
      icon: '🧘',
      instructions: [
        'Lie on back with knees bent and feet flat on floor hip-width apart.',
        'Place fingertips lightly behind ears without yanking on the neck.',
        'Curl your ribcage down toward your pelvis to lift shoulder blades 3 inches off the ground.',
        'Exhale and squeeze, then lower with control.'
      ],
      tips: 'Imagine holding an apple between your chin and collarbone.',
      safetyNotes: 'Never pull on the back of your head.'
    },
    {
      id: 'core_bicycle_crunches',
      name: 'Bicycle Crunches',
      category: 'core',
      difficulty: 'intermediate',
      equipment: 'bodyweight',
      targetMuscles: ['Obliques', 'Rectus Abdominis'],
      defaultSets: 3,
      defaultReps: 20,
      defaultDuration: null,
      restTime: 45,
      icon: '🚲',
      instructions: [
        'Lie on back with hands behind head and legs lifted into tabletop position.',
        'Bring right elbow toward left knee while extending left leg out straight.',
        'Switch sides fluidly in a bicycle pedaling motion.',
        'Keep movement deliberate rather than rushing for speed.'
      ],
      tips: 'Focus on rotating from the thoracic spine, not just elbow flapping.',
      safetyNotes: 'Keep lower back pressed flat into the floor.'
    },
    {
      id: 'core_leg_raises',
      name: 'Lying Leg Raises',
      category: 'core',
      difficulty: 'intermediate',
      equipment: 'bodyweight',
      targetMuscles: ['Lower Rectus Abdominis', 'Hip Flexors'],
      defaultSets: 3,
      defaultReps: 15,
      defaultDuration: null,
      restTime: 45,
      icon: '⬆️',
      instructions: [
        'Lie flat on back with legs straight and hands under lower glutes for lumbar support.',
        'Keep legs straight and raise them together until vertical (90 degrees).',
        'Lower legs slowly until heels hover 2 inches above the ground.',
        'Repeat without letting heels rest on the floor.'
      ],
      tips: 'Press your lower back into the floor throughout the entire movement.',
      safetyNotes: 'If your lower back arches off the mat, bend knees slightly.'
    },
    {
      id: 'core_mountain_climbers',
      name: 'Mountain Climbers',
      category: 'core',
      difficulty: 'intermediate',
      equipment: 'bodyweight',
      targetMuscles: ['Core', 'Shoulders', 'Cardiovascular System'],
      defaultSets: 3,
      defaultReps: 30,
      defaultDuration: null,
      restTime: 45,
      icon: '🧗',
      instructions: [
        'Start in a high plank position with shoulders directly above wrists.',
        'Drive your right knee up toward your chest, then quickly switch and drive left knee.',
        'Continue alternating knees in a rhythmic running cadence.'
      ],
      tips: 'Keep hips level with shoulders; avoid bouncing your rear end high in the air.',
      safetyNotes: 'Land lightly on the balls of your feet.'
    },
    {
      id: 'core_russian_twists',
      name: 'Russian Twists',
      category: 'core',
      difficulty: 'intermediate',
      equipment: 'bodyweight',
      targetMuscles: ['Internal & External Obliques', 'Rectus Abdominis'],
      defaultSets: 3,
      defaultReps: 20,
      defaultDuration: null,
      restTime: 45,
      icon: '🔄',
      instructions: [
        'Sit with knees bent, lean torso back at 45 degrees, and lift feet slightly off the floor.',
        'Clasp hands in front of chest and rotate torso to tap the floor on the right side.',
        'Rotate across to tap the floor on the left side to complete one rep.'
      ],
      tips: 'Turn your whole shoulders and chest, not just your hands.',
      safetyNotes: 'Keep feet on the floor if you experience lower back instability.'
    },
    {
      id: 'core_dead_bug',
      name: 'Dead Bug',
      category: 'core',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      targetMuscles: ['Deep Core', 'Pelvic Stability', 'Coordination'],
      defaultSets: 3,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 30,
      icon: '🪲',
      instructions: [
        'Lie on back with arms extended toward ceiling and knees bent at 90 degrees above hips.',
        'Slowly lower right arm back overhead while simultaneously extending left leg straight down.',
        'Hover right before floor, then return and alternate with left arm and right leg.'
      ],
      tips: 'Maintain absolute lumbar contact with the ground at all times.',
      safetyNotes: 'Do not allow lower spine to lift off the floor.'
    },
  
    // ==========================================
    // CARDIO (7)
    // ==========================================
    {
      id: 'cardio_jumping_jacks',
      name: 'Jumping Jacks',
      category: 'cardio',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      targetMuscles: ['Full Body', 'Cardiovascular System', 'Calves'],
      defaultSets: 3,
      defaultReps: null,
      defaultDuration: 60,
      restTime: 30,
      icon: '⭐',
      instructions: [
        'Stand upright with feet together and arms resting at sides.',
        'Jump feet out to the sides while sweeping arms overhead to touch hands.',
        'Jump back to starting stance and repeat in continuous rhythmic fashion.'
      ],
      tips: 'Land softly on the balls of your feet with knees slightly bent.',
      safetyNotes: 'Wear supportive athletic footwear.'
    },
    {
      id: 'cardio_high_knees',
      name: 'High Knees',
      category: 'cardio',
      difficulty: 'intermediate',
      equipment: 'bodyweight',
      targetMuscles: ['Hip Flexors', 'Quadriceps', 'Cardiovascular System'],
      defaultSets: 3,
      defaultReps: null,
      defaultDuration: 45,
      restTime: 45,
      icon: '🏃',
      instructions: [
        'Run in place while driving knees up toward hip height with every stride.',
        'Pump arms rhythmically in coordination with leg movement.',
        'Maintain an upright posture without leaning back.'
      ],
      tips: 'Stay light on your toes and keep a rapid, energetic cadence.',
      safetyNotes: 'Land softly to reduce impact on ankle joints.'
    },
    {
      id: 'cardio_burpees',
      name: 'Burpees',
      category: 'cardio',
      difficulty: 'advanced',
      equipment: 'bodyweight',
      targetMuscles: ['Full Body', 'Chest', 'Quads', 'Core', 'Cardiovascular System'],
      defaultSets: 3,
      defaultReps: 10,
      defaultDuration: null,
      restTime: 60,
      icon: '💥',
      instructions: [
        'From standing, drop into a squat and place hands on the floor.',
        'Kick feet back into a high plank and lower chest to the floor.',
        'Push up, snap feet back toward hands, and leap vertically with hands overhead.'
      ],
      tips: 'Step feet back one at a time to reduce intensity if needed.',
      safetyNotes: 'Do not allow lower back to sag when kicking out into the plank.'
    },
    {
      id: 'cardio_jump_rope',
      name: 'Jump Rope',
      category: 'cardio',
      difficulty: 'intermediate',
      equipment: 'jump rope',
      targetMuscles: ['Calves', 'Forearms', 'Cardiovascular System', 'Coordination'],
      defaultSets: 4,
      defaultReps: null,
      defaultDuration: 60,
      restTime: 45,
      icon: '🪢',
      instructions: [
        'Hold jump rope handles at hip height with elbows close to ribs.',
        'Turn rope using small wrist circles rather than sweeping arm swings.',
        'Jump only 1 to 2 inches off the floor to clear the rope.'
      ],
      tips: 'Keep jumps small and relaxed.',
      safetyNotes: 'Ensure adequate ceiling clearance.'
    },
    {
      id: 'cardio_running',
      name: 'Running / Jogging',
      category: 'cardio',
      difficulty: 'beginner',
      equipment: 'treadmill',
      targetMuscles: ['Cardiovascular System', 'Legs', 'Stamina'],
      defaultSets: 1,
      defaultReps: null,
      defaultDuration: 900,
      restTime: 60,
      icon: '🏃‍♂️',
      instructions: [
        'Maintain an upright running posture with slight forward lean from the ankles.',
        'Land with midfoot underneath your center of gravity.',
        'Breathe rhythmically in sync with your footsteps.'
      ],
      tips: 'Start with a conversational pace where you can speak short sentences.',
      safetyNotes: 'Hydrate well before and after longer runs.'
    },
    {
      id: 'cardio_cycling',
      name: 'Stationary Cycling',
      category: 'cardio',
      difficulty: 'beginner',
      equipment: 'exercise bike',
      targetMuscles: ['Quadriceps', 'Hamstrings', 'Cardiovascular System'],
      defaultSets: 1,
      defaultReps: null,
      defaultDuration: 900,
      restTime: 60,
      icon: '🚴',
      instructions: [
        'Adjust seat height so there is a slight 10-15 degree bend in knee at bottom of pedal stroke.',
        'Maintain steady cadence between 80 and 95 RPM.',
        'Keep shoulders relaxed away from ears.'
      ],
      tips: 'Low-impact option ideal for active recovery days.',
      safetyNotes: 'Ensure seat pin is fully locked before mounting.'
    },
    {
      id: 'cardio_rowing',
      name: 'Rowing Machine',
      category: 'cardio',
      difficulty: 'intermediate',
      equipment: 'rowing machine',
      targetMuscles: ['Back', 'Legs', 'Arms', 'Core', 'Cardiovascular System'],
      defaultSets: 3,
      defaultReps: null,
      defaultDuration: 300,
      restTime: 60,
      icon: '🚣‍♂️',
      instructions: [
        'Catch: Knees bent, arms extended forward, shins vertical.',
        'Drive: Push with legs first, swing torso back, then pull handle into lower ribs.',
        'Recovery: Extend arms, hinge torso forward, then slide knees back to catch.'
      ],
      tips: '60% of the rowing power comes from legs, 20% from core, 20% from arms.',
      safetyNotes: 'Never pull with arms before legs have completed their drive.'
    },
  
    // ==========================================
    // MOBILITY & STRETCHING (6)
    // ==========================================
    {
      id: 'mob_cat_cow',
      name: 'Cat-Cow Flow',
      category: 'mobility',
      difficulty: 'beginner',
      equipment: 'yoga mat',
      targetMuscles: ['Spine Mobility', 'Thoracic Extension', 'Core'],
      defaultSets: 2,
      defaultReps: 10,
      defaultDuration: null,
      restTime: 30,
      icon: '🐈',
      instructions: [
        'Start on hands and knees with wrists under shoulders and knees under hips.',
        'Cow: Inhale, drop belly toward floor, lift tailbone and gaze upward.',
        'Cat: Exhale, round spine up toward ceiling, tuck chin and tailbone.'
      ],
      tips: 'Move smoothly with your breath cycle without forcing the range.',
      safetyNotes: 'Gentle mobility; do not push into sharp pain.'
    },
    {
      id: 'mob_hip_flexor',
      name: 'Kneeling Hip Flexor Stretch',
      category: 'mobility',
      difficulty: 'beginner',
      equipment: 'yoga mat',
      targetMuscles: ['Iliopsoas (Hip Flexors)', 'Rectus Femoris'],
      defaultSets: 2,
      defaultReps: null,
      defaultDuration: 30,
      restTime: 30,
      icon: '🧘',
      instructions: [
        'Kneel on one knee with opposite foot flat in front at a 90-degree angle.',
        'Tuck pelvis under (posterior tilt) and squeeze back glute.',
        'Shift hips gently forward until you feel a deep stretch along the front of the back hip.'
      ],
      tips: 'Keep torso upright; do not hyperextend lower back.',
      safetyNotes: 'Place a folded towel under the knee if floor is hard.'
    },
    {
      id: 'mob_hamstring_stretch',
      name: 'Standing Hamstring Stretch',
      category: 'mobility',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      targetMuscles: ['Hamstrings', 'Calves'],
      defaultSets: 2,
      defaultReps: null,
      defaultDuration: 30,
      restTime: 30,
      icon: '🦵',
      instructions: [
        'Place one heel on a low step or prop, leg straight with toes pointing up.',
        'Hinge at hips with a flat back and lean chest toward thigh.',
        'Hold position while taking slow deep breaths.'
      ],
      tips: 'Bend the supporting knee slightly for stability.',
      safetyNotes: 'Never bounce during static stretches.'
    },
    {
      id: 'mob_shoulder_dislocates',
      name: 'Shoulder Mobility Pass-Throughs',
      category: 'mobility',
      difficulty: 'beginner',
      equipment: 'resistance bands',
      targetMuscles: ['Shoulder Rotators', 'Chest', 'Upper Back'],
      defaultSets: 2,
      defaultReps: 12,
      defaultDuration: null,
      restTime: 30,
      icon: '🔄',
      instructions: [
        'Hold a band or broomstick with a wide overhand grip in front of your hips.',
        'Keeping arms straight, lift overhead and rotate smoothly behind your back.',
        'Reverse the circular movement to bring arms back to front.'
      ],
      tips: 'Widen your grip if your elbows have to bend to clear the shoulders.',
      safetyNotes: 'Never force through shoulder pinching.'
    },
    {
      id: 'mob_worlds_greatest',
      name: "World's Greatest Stretch",
      category: 'mobility',
      difficulty: 'intermediate',
      equipment: 'yoga mat',
      targetMuscles: ['Hips', 'Thoracic Spine', 'Hamstrings', 'Ankles'],
      defaultSets: 2,
      defaultReps: 6,
      defaultDuration: null,
      restTime: 30,
      icon: '🌍',
      instructions: [
        'Step forward into a deep lunge and place both hands flat inside your front foot.',
        'Drop your back knee slightly and reach your front-side elbow toward the floor.',
        'Rotate your torso and extend that arm straight up toward the ceiling, looking up.',
        'Return hand down, push hips up to stretch front hamstring, and switch sides.'
      ],
      tips: 'The ultimate all-in-one athletic mobility movement.',
      safetyNotes: 'Breathe deeply through the thoracic rotation.'
    },
    {
      id: 'mob_childs_pose',
      name: "Child's Pose",
      category: 'mobility',
      difficulty: 'beginner',
      equipment: 'yoga mat',
      targetMuscles: ['Lats', 'Lower Back', 'Hips', 'Shoulders'],
      defaultSets: 1,
      defaultReps: null,
      defaultDuration: 60,
      restTime: 30,
      icon: '🙏',
      instructions: [
        'Kneel on the floor with big toes touching and knees spread wide.',
        'Sit your hips back onto your heels and walk your hands forward on the floor.',
        'Rest your forehead on the ground and lengthen your spine.',
        'Breathe deeply into your lower back and ribs.'
      ],
      tips: 'A restorative relaxation pose ideal for ending any workout.',
      safetyNotes: 'If knees are sensitive, bring knees closer together.'
    }
  ];
  
  /**
   * Filter exercises by category or equipment
   */
  const ExerciseHelper = {
    getByCategory(cat) {
      if (!cat || cat === 'all') return EXERCISES;
      return EXERCISES.filter(ex => ex.category === cat);
    },
  
    getById(id) {
      return EXERCISES.find(ex => ex.id === id) || null;
    },
  
    filter(query = '', category = 'all', equipment = 'all') {
      return EXERCISES.filter(ex => {
        const matchCat = category === 'all' || ex.category === category;
        const matchEquip = equipment === 'all' || ex.equipment === equipment;
        const q = query.trim().toLowerCase();
        const matchQuery = !q || ex.name.toLowerCase().includes(q) || ex.targetMuscles.some(m => m.toLowerCase().includes(q));
        return matchCat && matchEquip && matchQuery;
      });
    }
  };
  

  /* ==========================================================================
     MODULE: levels.js
     ========================================================================== */
  /**
   * FITQUEST LEVEL & PROGRESSION ENGINE
   * 10 Progressive Fitness Tiers with unlocking thresholds, titles, and rewards
   */
  
  const LEVELS = [
    {
      level: 1,
      title: 'Beginning',
      rank: 'Initiate',
      badge: '🌱',
      xpRequired: 0,
      description: 'Every great journey starts with a single rep. Welcome to the path.',
      perk: 'Unlocked Basic Daily Quests & Calisthenics Library'
    },
    {
      level: 2,
      title: 'Consistency',
      rank: 'Seeker',
      badge: '⚡',
      xpRequired: 300,
      description: 'You are showing up when it counts. Habits are starting to form.',
      perk: 'Unlocked Rest Timer Custom Intervals'
    },
    {
      level: 3,
      title: 'Foundation',
      rank: 'Builder',
      badge: '🧱',
      xpRequired: 750,
      description: 'Your body is adapting. Core strength and baseline stamina are established.',
      perk: 'Unlocked Homemade Nutrition Macro Breakdown'
    },
    {
      level: 4,
      title: 'Builder',
      rank: 'Adept',
      badge: '🔨',
      xpRequired: 1400,
      description: 'Visible muscle tone and strength increases are now taking place.',
      perk: 'Unlocked Intermediate Dumbbell & Resistance Splits'
    },
    {
      level: 5,
      title: 'Stronger',
      rank: 'Warrior',
      badge: '🛡️',
      xpRequired: 2200,
      description: 'Halfway through the foundation tiers. Your discipline is unwavering.',
      perk: 'Unlocked Advanced 3D Gold Badge & Custom Avatar'
    },
    {
      level: 6,
      title: 'Discipline',
      rank: 'Champion',
      badge: '⚔️',
      xpRequired: 3200,
      description: 'Workouts are no longer a chore; they are an essential part of your identity.',
      perk: 'Unlocked High-Intensity Cardio Protocols'
    },
    {
      level: 7,
      title: 'Athlete',
      rank: 'Vanguard',
      badge: '🔥',
      xpRequired: 4500,
      description: 'High work capacity, rapid recovery, and balanced athletic capability.',
      perk: 'Unlocked Athletic Mobility Sequences'
    },
    {
      level: 8,
      title: 'Advanced',
      rank: 'Master',
      badge: '💎',
      xpRequired: 6000,
      description: 'Your physical benchmarks and dedication put you in the top tier.',
      perk: 'Unlocked Educational Supplement Optimization Guide'
    },
    {
      level: 9,
      title: 'Elite',
      rank: 'Grandmaster',
      badge: '👑',
      xpRequired: 8000,
      description: 'Mastery over mind and body. You inspire everyone around you.',
      perk: 'Unlocked Elite Challenge Quests'
    },
    {
      level: 10,
      title: 'Transformation',
      rank: 'Titan',
      badge: '🏆',
      xpRequired: 10500,
      description: 'Total physical and mental transformation achieved. A true titan of fitness.',
      perk: 'Titan Status & Lifetime Gamified Mastery Badge'
    }
  ];
  
  const LevelEngine = {
    /**
     * Determine current level from total XP
     */
    calculateLevel(xp = 0) {
      let current = LEVELS[0];
      for (const lvl of LEVELS) {
        if (xp >= lvl.xpRequired) {
          current = lvl;
        } else {
          break;
        }
      }
      return current;
    },
  
    /**
     * Get level metadata by level number
     */
    getLevel(levelNum) {
      return LEVELS.find(l => l.level === levelNum) || LEVELS[0];
    },
  
    /**
     * Calculate detailed progression to next level
     */
    getProgress(xp = 0) {
      const currentLevel = this.calculateLevel(xp);
      const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1) || null;
  
      if (!nextLevel) {
        // Max level reached
        return {
          currentLevel,
          nextLevel: null,
          percent: 100,
          currentLevelXp: xp - currentLevel.xpRequired,
          xpToNext: 0,
          totalRequired: 0
        };
      }
  
      const range = nextLevel.xpRequired - currentLevel.xpRequired;
      const progressInLevel = Math.max(0, xp - currentLevel.xpRequired);
      const percent = Math.min(100, Math.round((progressInLevel / range) * 100));
      const xpToNext = nextLevel.xpRequired - xp;
  
      return {
        currentLevel,
        nextLevel,
        percent,
        currentLevelXp: progressInLevel,
        xpToNext,
        totalRequired: range
      };
    }
  };
  

  /* ==========================================================================
     MODULE: streak.js
     ========================================================================== */
  /**
   * FITQUEST FITNESS STREAK SYSTEM
   * Tracks daily consistency, longest streaks, and delivers supportive, non-shaming comeback encouragement
   */
  
  const StreakEngine = {
    /**
     * Get formatted YYYY-MM-DD date string
     */
    getTodayString() {
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  
    /**
     * Get formatted YYYY-MM-DD string for yesterday
     */
    getYesterdayString() {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  
    /**
     * Inspect current streak status and return updated streak object
     */
    recordActivity(streakData = {}) {
      const today = this.getTodayString();
      const yesterday = this.getYesterdayString();
  
      let current = streakData.current || 0;
      let longest = streakData.longest || 0;
      const history = Array.isArray(streakData.history) ? [...streakData.history] : [];
      const lastActive = streakData.lastActiveDate;
  
      let comebackMessage = null;
      let increased = false;
  
      if (lastActive === today) {
        // Already active today; retain current streak
        return {
          current,
          longest,
          lastActiveDate: today,
          history,
          increased: false,
          comebackMessage: null
        };
      }
  
      if (lastActive === yesterday) {
        // Unbroken consecutive day!
        current += 1;
        increased = true;
      } else if (!lastActive) {
        // Day 1
        current = 1;
        increased = true;
      } else {
        // Missed one or more days - reset with compassionate encouragement
        comebackMessage = "One missed day doesn't erase your journey. What matters is that you're here today. Let's build!";
        current = 1;
        increased = true;
      }
  
      if (current > longest) {
        longest = current;
      }
  
      if (!history.includes(today)) {
        history.push(today);
      }
  
      return {
        current,
        longest,
        lastActiveDate: today,
        history,
        increased,
        comebackMessage
      };
    },
  
    /**
     * Format streak badge display text
     */
    getBadgeDisplay(streakCount = 0) {
      if (streakCount <= 0) return { icon: '🌱', text: 'Day 0', label: 'Start Today' };
      if (streakCount === 1) return { icon: '🔥', text: '1 Day', label: 'Day 1 Conquered' };
      if (streakCount < 7) return { icon: '🔥', text: `${streakCount} Days`, label: 'On Fire' };
      if (streakCount < 14) return { icon: '⚡', text: `${streakCount} Days`, label: 'Unstoppable' };
      if (streakCount < 30) return { icon: '💎', text: `${streakCount} Days`, label: 'Iron Will' };
      return { icon: '👑', text: `${streakCount} Days`, label: 'Titan Streak' };
    }
  };
  

  /* ==========================================================================
     MODULE: quests.js
     ========================================================================== */
  /**
   * FITQUEST DAILY QUEST SYSTEM
   * Generates fresh daily quests every morning, tracks completion, awards XP with 3D animations
   */
  
  
  
  const QUEST_POOL = [
    {
      id: 'warmup',
      title: 'Dynamic Warm-up',
      desc: 'Perform 5 minutes of dynamic stretches before training.',
      xp: 40,
      icon: '🤸'
    },
    {
      id: 'workout',
      title: "Conquer Today's Workout",
      desc: 'Finish all prescribed sets in your daily workout session.',
      xp: 75,
      icon: '🏋️'
    },
    {
      id: 'water',
      title: 'Hydration Target (2.5L)',
      desc: 'Keep muscles energized by drinking at least 2.5 liters of clean water.',
      xp: 35,
      icon: '💧'
    },
    {
      id: 'mobility',
      title: '10-Min Mobility Routine',
      desc: 'Unlock tight joints with dedicated mobility or yoga stretching.',
      xp: 50,
      icon: '🧘'
    },
    {
      id: 'walk',
      title: 'Daily Movement Walk',
      desc: 'Take a brisk 20-minute outdoor or treadmill walk for active recovery.',
      xp: 45,
      icon: '👟'
    },
    {
      id: 'log_progress',
      title: 'Log Training Progress',
      desc: 'Record how your body felt or update an optional fitness metric.',
      xp: 35,
      icon: '📝'
    },
    {
      id: 'bonus_pushups',
      title: 'Titan Challenge: 20 Bonus Push-ups',
      desc: 'Perform 20 extra push-ups anytime during the day to test endurance.',
      xp: 60,
      icon: '⚡'
    }
  ];
  
  const QuestEngine = {
    /**
     * Ensure user has quests for today's date; regenerates if new day
     */
    ensureQuestsForToday(currentDailyQuests = {}) {
      const today = StreakEngine.getTodayString();
  
      if (currentDailyQuests && currentDailyQuests.date === today && Array.isArray(currentDailyQuests.quests) && currentDailyQuests.quests.length > 0) {
        return currentDailyQuests;
      }
  
      // New day or first time: generate today's quest list
      const quests = QUEST_POOL.map(q => ({
        id: q.id,
        title: q.title,
        desc: q.desc,
        xp: q.xp,
        icon: q.icon,
        completed: false,
        completedAt: null
      }));
  
      return {
        date: today,
        quests
      };
    },
  
    /**
     * Toggle a quest completion state
     * Returns { updatedQuests, xpDelta, quest }
     */
    toggleQuest(currentDailyQuests, questId) {
      const today = StreakEngine.getTodayString();
      const questsObj = this.ensureQuestsForToday(currentDailyQuests);
      const target = questsObj.quests.find(q => q.id === questId);
  
      if (!target) return { updatedQuests: questsObj, xpDelta: 0, quest: null };
  
      target.completed = !target.completed;
      target.completedAt = target.completed ? new Date().toISOString() : null;
  
      const xpDelta = target.completed ? target.xp : -target.xp;
  
      return {
        updatedQuests: questsObj,
        xpDelta,
        quest: target
      };
    }
  };
  

  /* ==========================================================================
     MODULE: mood.js
     ========================================================================== */
  /**
   * FITQUEST MOOD & ENERGY SYSTEM
   * Pre-workout energy check-in that adapts session intensity and offers restorative alternatives
   */
  
  const MOODS = [
    { id: 'fire', label: 'Extremely Energetic', icon: '🔥', modifier: 'intense', desc: 'Ready to crush personal bests and maximum intensity.' },
    { id: 'motivated', label: 'Motivated', icon: '💪', modifier: 'full', desc: 'Ready to perform the complete planned routine.' },
    { id: 'good', label: 'Good', icon: '😊', modifier: 'standard', desc: 'Solid energy for a consistent, productive session.' },
    { id: 'normal', label: 'Normal', icon: '😐', modifier: 'standard', desc: 'Baseline energy; showing up and building the habit.' },
    { id: 'tired', label: 'Tired', icon: '😴', modifier: 'light', desc: 'Lower energy; consider reduced sets or active stretching.' },
    { id: 'low_energy', label: 'Low Energy', icon: '😔', modifier: 'recovery', desc: 'Honoring recovery; recommend light mobility and restorative movement.' }
  ];
  
  const MoodEngine = {
    getMoods() {
      return MOODS;
    },
  
    getById(id) {
      return MOODS.find(m => m.id === id) || MOODS[2];
    },
  
    /**
     * Determine workout modification advice based on selected mood
     */
    getRecommendation(moodId) {
      const m = this.getById(moodId);
      if (m.modifier === 'recovery' || m.modifier === 'light') {
        return {
          isLight: true,
          title: 'Restorative Session Recommended',
          message: 'Your body is signaling fatigue. We recommend focusing on gentle mobility and steady breathing today. Recovery is where muscle and stamina are built!',
          suggestedCategory: 'mobility'
        };
      }
      if (m.modifier === 'intense') {
        return {
          isLight: false,
          title: 'Peak Energy Detected',
          message: 'You have high fuel today! Aim for strong execution on every repetition.',
          suggestedCategory: null
        };
      }
      return {
        isLight: false,
        title: 'Standard Workout Mode',
        message: 'Maintain steady pace, focus on clean form, and hydrate between sets.',
        suggestedCategory: null
      };
    }
  };
  

  /* ==========================================================================
     MODULE: diet.js
     ========================================================================== */
  /**
   * FITQUEST NUTRITION & DIET ARCHITECTURE
   * Wholesome homemade nutrition protocols + educational supplement guide with medical disclaimers
   */
  
  const DIET_PLANS = {
    homemade: {
      title: 'Homemade Whole-Foods Nutrition',
      subtitle: 'Accessible, nutrient-dense everyday staples for sustained athletic energy and recovery.',
      disclaimer: 'Nutritional guidance provided for educational purposes. Consult a qualified clinical nutritionist or physician for personalized dietary needs.',
      meals: {
        vegetarian: [
          {
            name: 'Power Breakfast',
            time: '7:30 AM – 8:30 AM',
            items: ['Rolled Oats with Warm Milk or Soy Milk', '1 Handful Almonds & Walnuts', '1 Banana or Fresh Seasonal Fruit', '1 Tbsp Chia or Flax Seeds'],
            approxCalories: '420 kcal',
            protein: '16g',
            carbs: '58g',
            fats: '14g'
          },
          {
            name: 'Mid-Day Fuel (Lunch)',
            time: '12:30 PM – 1:30 PM',
            items: ['2 Whole-Wheat Rotis or Brown Rice', '1 Large Bowl of Mixed Yellow/Black Dal', '150g Fresh Low-Fat Paneer or Tofu Bhurji', 'Large Green Salad with Lemon Dressing'],
            approxCalories: '560 kcal',
            protein: '28g',
            carbs: '65g',
            fats: '16g'
          },
          {
            name: 'Pre-Workout & Evening Snack',
            time: '4:30 PM – 5:30 PM',
            items: ['Roasted Chickpeas (Chana) or Sprouted Moong Chaat', '1 Cup Green Tea or Warm Water', '1 Crisp Apple or 2 Dates'],
            approxCalories: '210 kcal',
            protein: '9g',
            carbs: '34g',
            fats: '3g'
          },
          {
            name: 'Restorative Dinner',
            time: '7:30 PM – 8:30 PM',
            items: ['Steamed Quinoa or 2 Multigrain Phulkas', 'Sautéed Mixed Vegetables (Spinach, Broccoli, Carrots)', '1 Bowl Thick Curd (Dahi) or Greek Yogurt', 'Moong Dal Khichdi option'],
            approxCalories: '480 kcal',
            protein: '22g',
            carbs: '60g',
            fats: '12g'
          }
        ],
        non_vegetarian: [
          {
            name: 'High-Protein Breakfast',
            time: '7:30 AM – 8:30 AM',
            items: ['3 Whole Scrambled or Boiled Eggs', '2 Slices 100% Whole-Grain Toast', '1 Glass Fresh Papaya or Orange Juice', 'Handful Soaked Almonds'],
            approxCalories: '460 kcal',
            protein: '26g',
            carbs: '42g',
            fats: '18g'
          },
          {
            name: 'Athletic Muscle Lunch',
            time: '12:30 PM – 1:30 PM',
            items: ['150g Grilled Chicken Breast or Fish Curry', '1 Cup Steamed Rice or 2 Rotis', '1 Bowl Tadka Dal or Rajma', 'Cucumber, Onion & Tomato Salad'],
            approxCalories: '580 kcal',
            protein: '42g',
            carbs: '55g',
            fats: '14g'
          },
          {
            name: 'Pre-Workout Fuel',
            time: '4:30 PM – 5:30 PM',
            items: ['2 Boiled Egg Whites on Toast or Banana with Peanut Butter', 'Black Coffee or Water'],
            approxCalories: '220 kcal',
            protein: '12g',
            carbs: '28g',
            fats: '6g'
          },
          {
            name: 'Clean Recovery Dinner',
            time: '7:30 PM – 8:30 PM',
            items: ['150g Baked Fish or Pan-Seared Chicken', 'Stir-Fried Vegetables in Olive Oil', '1 Sweet Potato or Light Lentil Soup'],
            approxCalories: '490 kcal',
            protein: '38g',
            carbs: '40g',
            fats: '13g'
          }
        ],
        vegan: [
          {
            name: 'Plant-Power Breakfast',
            time: '7:30 AM – 8:30 AM',
            items: ['Oatmeal cooked in Almond Milk with Peanut Butter', 'Hemp & Pumpkin Seeds', 'Berries and Sliced Banana'],
            approxCalories: '440 kcal',
            protein: '18g',
            carbs: '62g',
            fats: '16g'
          },
          {
            name: 'Macro Bowl (Lunch)',
            time: '12:30 PM – 1:30 PM',
            items: ['Spiced Tofu Stir Fry (200g)', 'Brown Rice or Quinoa', 'Steamed Edamame & Broccoli', 'Tahini Lemon Dressing'],
            approxCalories: '540 kcal',
            protein: '32g',
            carbs: '58g',
            fats: '18g'
          },
          {
            name: 'Afternoon Energy Snack',
            time: '4:30 PM – 5:30 PM',
            items: ['Mixed Sprout Salad (Moong & Chana) with Lime', '1 Handful Roasted Pumpkin Seeds'],
            approxCalories: '210 kcal',
            protein: '11g',
            carbs: '30g',
            fats: '5g'
          },
          {
            name: 'Sustained Recovery Dinner',
            time: '7:30 PM – 8:30 PM',
            items: ['Rich Black Bean or Lentil Stew', 'Sweet Potato Mash', 'Large Garden Salad with Avocado slices'],
            approxCalories: '470 kcal',
            protein: '22g',
            carbs: '66g',
            fats: '14g'
          }
        ]
      }
    },
  
    supplement_educational: {
      title: 'Educational Supplement Guide',
      subtitle: 'Evidence-based reference on sports nutrition aids. Supplements are strictly optional; whole foods remain the cornerstone of nutrition.',
      disclaimer: 'SAFETY NOTICE: This guide is educational only and does not constitute medical prescription. Always consult a licensed healthcare professional before beginning any new supplementation.',
      categories: [
        {
          name: 'Whey / Plant Protein',
          purpose: 'Convenient post-workout muscle protein synthesis support.',
          foodAlternative: 'Eggs, Greek Yogurt, Paneer, Chicken, Lentils, Tofu.',
          timing: 'Within 1-2 hours post-workout or between meals.',
          notes: 'Helpful if daily protein targets are difficult to hit via solid food alone.'
        },
        {
          name: 'Creatine Monohydrate',
          purpose: 'Supports cellular ATP replenishment for high-intensity muscular power.',
          foodAlternative: 'Red meat and salmon (naturally in trace quantities).',
          timing: '3-5 grams daily with water; timing is less critical than daily consistency.',
          notes: 'Most extensively researched sports supplement in human literature. Ensure adequate hydration.'
        },
        {
          name: 'Electrolytes & Hydration',
          purpose: 'Replenishes sodium, potassium, and magnesium lost through prolonged sweating.',
          foodAlternative: 'Coconut water, bananas, salted lemon water, spinach.',
          timing: 'During or after intense training sessions exceeding 60 minutes.',
          notes: 'Prevents cramping and muscular sluggishness during heavy summer training.'
        },
        {
          name: 'Omega-3 Fatty Acids',
          purpose: 'Supports joint lubrication, cardiovascular health, and reduces exercise inflammation.',
          foodAlternative: 'Walnuts, chia seeds, flaxseeds, wild salmon.',
          timing: 'Taken with a meal containing dietary fats.',
          notes: 'Look for molecularly distilled formulations.'
        }
      ]
    }
  };
  
  const DietEngine = {
    getPlans() {
      return DIET_PLANS;
    },
  
    getMeals(preference = 'vegetarian') {
      const p = DIET_PLANS.homemade.meals;
      if (preference === 'non_vegetarian' || preference === 'non-vegetarian') return p.non_vegetarian;
      if (preference === 'vegan') return p.vegan;
      return p.vegetarian;
    },
  
    getSupplementGuide() {
      return DIET_PLANS.supplement_educational;
    }
  };
  

  /* ==========================================================================
     MODULE: achievements.js
     ========================================================================== */
  /**
   * FITQUEST ACHIEVEMENT SYSTEM
   * 20+ unlockable 3D badges with automatic condition verification and XP rewards
   */
  
  const ACHIEVEMENTS = [
    {
      id: 'first_workout',
      name: 'First Workout',
      desc: 'Completed your very first workout session.',
      icon: '🔥',
      category: 'workout',
      xpReward: 100,
      check: (data) => (data.completedWorkouts?.length || 0) >= 1
    },
    {
      id: 'century_xp',
      name: 'Century Club',
      desc: 'Earned your first 100 total XP.',
      icon: '💯',
      category: 'xp',
      xpReward: 50,
      check: (data) => (data.xp || 0) >= 100
    },
    {
      id: 'triple_threat',
      name: 'Triple Threat',
      desc: 'Completed 3 total workouts.',
      icon: '⚡',
      category: 'workout',
      xpReward: 150,
      check: (data) => (data.completedWorkouts?.length || 0) >= 3
    },
    {
      id: 'workout_10',
      name: 'Decathlon',
      desc: 'Completed 10 total workout sessions.',
      icon: '🏋️',
      category: 'workout',
      xpReward: 300,
      check: (data) => (data.completedWorkouts?.length || 0) >= 10
    },
    {
      id: 'streak_3',
      name: '3-Day Fire',
      desc: 'Maintained a 3-day active streak.',
      icon: '🏆',
      category: 'streak',
      xpReward: 100,
      check: (data) => (data.streak?.longest || 0) >= 3 || (data.streak?.current || 0) >= 3
    },
    {
      id: 'streak_7',
      name: 'Weekly Legend',
      desc: 'Maintained an unbroken 7-day fitness streak.',
      icon: '🔥',
      category: 'streak',
      xpReward: 250,
      check: (data) => (data.streak?.longest || 0) >= 7 || (data.streak?.current || 0) >= 7
    },
    {
      id: 'streak_14',
      name: 'Fortnight of Iron',
      desc: 'Maintained a 14-day consecutive active streak.',
      icon: '💎',
      category: 'streak',
      xpReward: 500,
      check: (data) => (data.streak?.longest || 0) >= 14 || (data.streak?.current || 0) >= 14
    },
    {
      id: 'streak_30',
      name: 'Monthly Titan',
      desc: 'Achieved an extraordinary 30-day streak of relentless discipline.',
      icon: '👑',
      category: 'streak',
      xpReward: 1000,
      check: (data) => (data.streak?.longest || 0) >= 30 || (data.streak?.current || 0) >= 30
    },
    {
      id: 'cardio_fan',
      name: 'Cardio Crusher',
      desc: 'Completed a workout containing cardiovascular conditioning.',
      icon: '🏃',
      category: 'category',
      xpReward: 75,
      check: (data) => data.completedWorkouts?.some(w => w.exercises?.some(e => e.category === 'cardio'))
    },
    {
      id: 'strength_master',
      name: 'Iron Will',
      desc: 'Finished a workout featuring weighted or resistance exercises.',
      icon: '🦾',
      category: 'category',
      xpReward: 100,
      check: (data) => data.completedWorkouts?.some(w => w.exercises?.some(e => e.equipment !== 'bodyweight'))
    },
    {
      id: 'mobility_guru',
      name: 'Mobility Master',
      desc: 'Completed a mobility and stretching session for bodily longevity.',
      icon: '🧘',
      category: 'category',
      xpReward: 75,
      check: (data) => data.completedWorkouts?.some(w => w.exercises?.some(e => e.category === 'mobility'))
    },
    {
      id: 'quest_clean_sweep',
      name: 'Quest Slayer',
      desc: 'Checked off all daily quests in a single day.',
      icon: '🎯',
      category: 'quest',
      xpReward: 150,
      check: (data) => {
        const q = data.dailyQuests?.quests || [];
        return q.length > 0 && q.every(item => item.completed);
      }
    },
    {
      id: 'level_2',
      name: 'Rising Star',
      desc: 'Ascended to Level 2: Consistency.',
      icon: '🚀',
      category: 'level',
      xpReward: 100,
      check: (data) => (data.level || 1) >= 2
    },
    {
      id: 'level_5',
      name: 'Warrior Status',
      desc: 'Ascended to Level 5: Stronger.',
      icon: '🛡️',
      category: 'level',
      xpReward: 250,
      check: (data) => (data.level || 1) >= 5
    },
    {
      id: 'level_10',
      name: 'The Living Titan',
      desc: 'Ascended to the highest realm: Level 10 Transformation.',
      icon: '🏆',
      category: 'level',
      xpReward: 1000,
      check: (data) => (data.level || 1) >= 10
    },
    {
      id: 'diet_customized',
      name: 'Nutrition Architect',
      desc: 'Selected and personalized your nutrition roadmap.',
      icon: '🥗',
      category: 'diet',
      xpReward: 50,
      check: (data) => !!data.dietPreferences?.type
    },
    {
      id: 'mood_logger',
      name: 'Self-Aware Athlete',
      desc: 'Checked in your energy levels before entering a workout.',
      icon: '🧠',
      category: 'mood',
      xpReward: 50,
      check: (data) => (data.moodHistory?.length || 0) >= 1
    },
    {
      id: 'hydration_champion',
      name: 'Hydration Hero',
      desc: 'Consistently hydrated and energized your muscles.',
      icon: '💧',
      category: 'quest',
      xpReward: 50,
      check: (data) => (data.dailyQuests?.quests || []).some(q => q.id === 'water' && q.completed)
    },
    {
      id: 'rest_timer_user',
      name: 'Paced & Precision',
      desc: 'Used the Rest Timer to manage physiological recovery during training.',
      icon: '⏱️',
      category: 'workout',
      xpReward: 50,
      check: (data) => (data.completedWorkouts?.length || 0) >= 1
    },
    {
      id: 'measurement_tracked',
      name: 'Data Driven',
      desc: 'Logged a body measurement tracking entry.',
      icon: '📐',
      category: 'progress',
      xpReward: 75,
      check: (data) => (data.measurements?.length || 0) >= 1
    }
  ];
  
  const AchievementEngine = {
    /**
     * Evaluate all achievements against user state
     * Returns array of newly unlocked achievement objects
     */
    checkNew(userData) {
      if (!userData) return [];
      const unlockedIds = new Set(userData.achievements || []);
      const newlyUnlocked = [];
  
      for (const ach of ACHIEVEMENTS) {
        if (!unlockedIds.has(ach.id)) {
          try {
            if (ach.check(userData)) {
              newlyUnlocked.push(ach);
            }
          } catch (e) {
            console.warn(`[AchievementEngine] check failed for ${ach.id}:`, e);
          }
        }
      }
  
      return newlyUnlocked;
    },
  
    getAll() {
      return ACHIEVEMENTS;
    },
  
    getById(id) {
      return ACHIEVEMENTS.find(a => a.id === id) || null;
    }
  };
  

  /* ==========================================================================
     MODULE: workout-engine.js
     ========================================================================== */
  /**
   * FITQUEST WORKOUT GENERATION ENGINE
   * Intelligently generates personalized training splits based on goal, experience,
   * equipment constraints, available time, and weekly training days.
   */
  
  
  
  const WorkoutEngine = {
    /**
     * Main generator function
     */
    generatePlan(profile = {}) {
      const goal = profile.goal || 'general_fitness';
      const experience = profile.experience || 'beginner';
      const duration = parseInt(profile.duration, 10) || 30;
      const daysPerWeek = parseInt(profile.daysPerWeek, 10) || 3;
      const selectedEquipment = Array.isArray(profile.equipment) ? profile.equipment : ['bodyweight'];
      const hasOnlyBodyweight = selectedEquipment.length === 0 || (selectedEquipment.length === 1 && selectedEquipment[0] === 'bodyweight');
  
      // Filter exercises matching available equipment
      const availablePool = EXERCISES.filter(ex => {
        if (hasOnlyBodyweight) {
          return ex.equipment === 'bodyweight';
        }
        return ex.equipment === 'bodyweight' || selectedEquipment.includes(ex.equipment);
      });
  
      // Number of exercises per session based on duration
      let exerciseCount = 4;
      if (duration <= 15) exerciseCount = 3;
      else if (duration <= 30) exerciseCount = 4;
      else if (duration <= 45) exerciseCount = 5;
      else exerciseCount = 6;
  
      // Determine weekly split strategy
      let splitName = 'Full Body Conditioning';
      let routineDays = [];
  
      if (daysPerWeek <= 3) {
        splitName = 'Full Body Foundational Split';
        routineDays = [
          { day: 1, title: 'Full Body Power', focus: 'Chest, Legs & Core', categories: ['chest', 'legs', 'core', 'mobility'] },
          { day: 2, title: 'Full Body Sculpt', focus: 'Back, Shoulders & Arms', categories: ['back', 'shoulders', 'arms', 'core'] },
          { day: 3, title: 'Full Body Athletic Engine', focus: 'Legs, Chest & Cardio', categories: ['legs', 'chest', 'cardio', 'mobility'] }
        ];
      } else if (daysPerWeek === 4) {
        splitName = 'Upper / Lower Power Split';
        routineDays = [
          { day: 1, title: 'Upper Body Alpha', focus: 'Chest, Back & Arms', categories: ['chest', 'back', 'arms', 'core'] },
          { day: 2, title: 'Lower Body Drive', focus: 'Quads, Hamstrings & Calves', categories: ['legs', 'legs', 'core', 'mobility'] },
          { day: 3, title: 'Upper Body Hypertrophy', focus: 'Shoulders, Lats & Triceps', categories: ['shoulders', 'back', 'arms', 'core'] },
          { day: 4, title: 'Lower Body & Conditioning', focus: 'Glutes, Mobility & Cardio', categories: ['legs', 'cardio', 'core', 'mobility'] }
        ];
      } else {
        splitName = 'Push / Pull / Legs Athletic Split';
        routineDays = [
          { day: 1, title: 'Push Focus', focus: 'Chest, Shoulders & Triceps', categories: ['chest', 'shoulders', 'arms', 'core'] },
          { day: 2, title: 'Pull Focus', focus: 'Back, Rear Delts & Biceps', categories: ['back', 'back', 'arms', 'core'] },
          { day: 3, title: 'Legs & Core Drive', focus: 'Quads, Hamstrings & Calves', categories: ['legs', 'legs', 'core', 'mobility'] },
          { day: 4, title: 'Upper Body Synergy', focus: 'Chest, Back & Shoulders', categories: ['chest', 'back', 'shoulders', 'arms'] },
          { day: 5, title: 'Full Athletic Performance', focus: 'Legs, Cardio & Core', categories: ['legs', 'cardio', 'core', 'mobility'] }
        ];
      }
  
      // Populate each day with specific exercises matching categories
      const schedule = routineDays.slice(0, daysPerWeek).map((dayTemplate, dayIdx) => {
        const dayExercises = [];
        const usedIds = new Set();
  
        dayTemplate.categories.forEach(cat => {
          if (dayExercises.length >= exerciseCount) return;
          const matching = availablePool.filter(ex => ex.category === cat && !usedIds.has(ex.id));
          if (matching.length > 0) {
            // Select exercise matching difficulty if possible
            const diffMatch = matching.find(ex => ex.difficulty === experience) || matching[0];
            dayExercises.push(diffMatch);
            usedIds.add(diffMatch.id);
          }
        });
  
        // Fill remaining if needed
        while (dayExercises.length < exerciseCount && availablePool.length > usedIds.size) {
          const remaining = availablePool.filter(ex => !usedIds.has(ex.id));
          if (remaining.length === 0) break;
          const pick = remaining[Math.floor(Math.random() * remaining.length)];
          dayExercises.push(pick);
          usedIds.add(pick.id);
        }
  
        // Customize sets & reps based on goal
        const customizedExercises = dayExercises.map(ex => {
          let sets = ex.defaultSets || 3;
          let reps = ex.defaultReps || 12;
          let restTime = ex.restTime || 60;
  
          if (goal === 'strength' || goal === 'build_muscle') {
            if (reps && reps > 10) reps = 10;
            restTime = Math.min(90, restTime + 15);
          } else if (goal === 'endurance' || goal === 'lose_fat') {
            if (reps) reps = Math.min(20, reps + 2);
            restTime = Math.max(30, restTime - 15);
          }
  
          return {
            ...ex,
            targetSets: sets,
            targetReps: reps,
            targetRest: restTime
          };
        });
  
        return {
          dayNumber: dayIdx + 1,
          title: dayTemplate.title,
          focus: dayTemplate.focus,
          estimatedMinutes: duration,
          difficulty: experience,
          exercises: customizedExercises
        };
      });
  
      return {
        generatedAt: new Date().toISOString(),
        splitName,
        goal,
        experience,
        duration,
        daysPerWeek,
        schedule
      };
    }
  };
  

  /* ==========================================================================
     MODULE: notifications.js
     ========================================================================== */
  /**
   * FITQUEST 3D IN-APP NOTIFICATION SYSTEM
   * Stackable, dimensional toast notifications with automatic dismiss and sound alerts
   */
  
  
  
  const Toast = {
    container: null,
  
    init() {
      this.container = document.getElementById('toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        document.body.appendChild(this.container);
      }
    },
  
    show({ title, message, icon = '🔔', type = 'info', duration = 3500 }) {
      this.init();
      if (!this.container || typeof this.container.appendChild !== 'function') return;
  
      const toast = document.createElement('div');
      toast.className = `toast-item toast-${type}`;
  
      let iconColor = 'var(--accent-blue)';
      if (type === 'success') iconColor = 'var(--accent-emerald)';
      if (type === 'fire') iconColor = 'var(--accent-orange)';
      if (type === 'gold') iconColor = 'var(--accent-gold)';
  
      toast.innerHTML = `
        <div class="toast-icon" style="color: ${iconColor};">${icon}</div>
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          <div class="toast-message">${message}</div>
        </div>
      `;
  
      this.container.appendChild(toast);
      Sound.playClick();
  
      // Trigger 3D spatial entrance
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
  
      // Auto dismiss
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 350);
      }, duration);
    }
  };
  

  /* ==========================================================================
     MODULE: state.js
     ========================================================================== */
  /**
   * FITQUEST CENTRAL REACTIVE STATE MANAGER
   * Manages active user session, level progression triggers, achievement monitors, and storage sync
   */
  
  
  
  
  
  
  
  
  
  
  const AppState = {
    currentUser: null,
    userData: null,
    listeners: {},
  
    init() {
      const activeUsername = Storage.getActiveUsername();
      if (activeUsername) {
        const user = Storage.findUser(activeUsername);
        if (user) {
          this.currentUser = user;
          this.userData = Storage.getUserData(activeUsername);
          // Refresh daily quests for today
          this.userData.dailyQuests = QuestEngine.ensureQuestsForToday(this.userData.dailyQuests);
          Storage.saveUserData(activeUsername, this.userData);
        }
      }
      this.notify('init', { user: this.currentUser, data: this.userData });
    },
  
    isLoggedIn() {
      return !!this.currentUser && !!this.userData;
    },
  
    subscribe(event, callback) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(callback);
    },
  
    notify(event, payload) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(fn => {
          try { fn(payload); } catch (e) { console.error(`[AppState] listener error for ${event}:`, e); }
        });
      }
    },
  
    /**
     * Set active logged-in user
     */
    setUser(user, isNew = false) {
      this.currentUser = user;
      Storage.setActiveUsername(user.username);
      this.userData = Storage.getUserData(user.username);
  
      if (isNew || !this.userData.profile) {
        this.userData.profile = {
          name: user.name,
          username: user.username,
          email: user.email,
          dob: user.dob,
          avatar: '⚡'
        };
      }
  
      this.userData.dailyQuests = QuestEngine.ensureQuestsForToday(this.userData.dailyQuests);
      Storage.saveUserData(user.username, this.userData);
      this.notify('userChanged', { user: this.currentUser, data: this.userData });
    },
  
    /**
     * Add XP with automatic level-up detection and achievement check
     */
    addXp(amount = 0, reason = 'Activity') {
      if (!this.isLoggedIn() || amount <= 0) return;
  
      const oldXp = this.userData.xp || 0;
      const newXp = oldXp + amount;
      const oldLevel = LevelEngine.calculateLevel(oldXp);
      const newLevel = LevelEngine.calculateLevel(newXp);
  
      this.userData.xp = newXp;
      this.userData.level = newLevel.level;
  
      Sound.playXp();
  
      Toast.show({
        title: `+${amount} XP Earned!`,
        message: reason,
        icon: '⚡',
        type: 'success'
      });
  
      // Check for Level-Up!
      if (newLevel.level > oldLevel.level) {
        this.triggerLevelUp(newLevel);
      }
  
      // Check for Achievements
      this.checkAchievements();
  
      this.save();
      this.notify('xpUpdated', { xp: newXp, level: newLevel });
    },
  
    /**
     * Trigger 3D Level-Up cinematic modal
     */
    triggerLevelUp(levelObj) {
      Sound.playLevelUp();
      Effects3D.spawnCelebration(3500);
  
      const modal = document.getElementById('modal-level-up');
      if (modal) {
        const numEl = document.getElementById('level-up-num');
        const titleEl = document.getElementById('level-up-title');
        const descEl = document.getElementById('level-up-desc');
        const perkEl = document.getElementById('level-up-perk');
  
        if (numEl) numEl.textContent = `LEVEL ${levelObj.level}`;
        if (titleEl) titleEl.textContent = levelObj.title;
        if (descEl) descEl.textContent = levelObj.description;
        if (perkEl) perkEl.textContent = `Reward: ${levelObj.perk}`;
  
        modal.classList.add('active');
      }
  
      Toast.show({
        title: `LEVEL UP: ${levelObj.title}!`,
        message: `You unlocked: ${levelObj.perk}`,
        icon: levelObj.badge || '🏆',
        type: 'gold',
        duration: 5000
      });
    },
  
    /**
     * Check and award newly unlocked achievements
     */
    checkAchievements() {
      if (!this.isLoggedIn()) return;
      const newlyUnlocked = AchievementEngine.checkNew(this.userData);
  
      if (newlyUnlocked.length > 0) {
        if (!Array.isArray(this.userData.achievements)) {
          this.userData.achievements = [];
        }
  
        newlyUnlocked.forEach(ach => {
          this.userData.achievements.push(ach.id);
          Sound.playSuccess();
          Toast.show({
            title: `Achievement Unlocked!`,
            message: `${ach.name}: ${ach.desc}`,
            icon: ach.icon || '🎖️',
            type: 'gold',
            duration: 4500
          });
  
          if (ach.xpReward > 0) {
            this.userData.xp += ach.xpReward;
          }
        });
  
        this.save();
        this.notify('achievementsUpdated', { unlocked: newlyUnlocked });
      }
    },
  
    /**
     * Save completed workout session
     */
    recordCompletedWorkout(summary) {
      if (!this.isLoggedIn()) return;
  
      if (!Array.isArray(this.userData.completedWorkouts)) {
        this.userData.completedWorkouts = [];
      }
  
      this.userData.completedWorkouts.push(summary);
  
      // Update streak
      const streakResult = StreakEngine.recordActivity(this.userData.streak);
      this.userData.streak = streakResult;
  
      if (streakResult.comebackMessage) {
        Toast.show({
          title: 'Welcome Back!',
          message: streakResult.comebackMessage,
          icon: '🌱',
          type: 'info',
          duration: 5000
        });
      } else if (streakResult.increased) {
        Toast.show({
          title: `Streak: ${streakResult.current} Days!`,
          message: `Consistency is power. Keep the momentum going!`,
          icon: '🔥',
          type: 'fire'
        });
      }
  
      // Award XP
      this.addXp(summary.xpEarned || 150, `Completed ${summary.workoutTitle}`);
  
      // Mark daily workout quest as complete if present
      const quest = (this.userData.dailyQuests?.quests || []).find(q => q.id === 'workout');
      if (quest && !quest.completed) {
        quest.completed = true;
        quest.completedAt = new Date().toISOString();
        this.addXp(quest.xp, `Completed Daily Quest: ${quest.title}`);
      }
  
      this.save();
      this.notify('workoutRecorded', { summary, streak: this.userData.streak });
    },
  
    /**
     * Save active user data
     */
    save() {
      if (this.currentUser && this.userData) {
        Storage.saveUserData(this.currentUser.username, this.userData);
        this.notify('dataSaved', this.userData);
      }
    },
  
    /**
     * Logout current user
     */
    logout() {
      Storage.setActiveUsername(null);
      this.currentUser = null;
      this.userData = null;
      this.notify('userLoggedOut', null);
    },
  
    /**
     * Reset data for active user
     */
    resetData() {
      if (!this.currentUser) return;
      Storage.clearUserData(this.currentUser.username);
      this.userData = Storage.getUserData(this.currentUser.username);
      this.save();
      this.notify('dataReset', this.userData);
    }
  };
  

  /* ==========================================================================
     MODULE: workout-runner.js
     ========================================================================== */
  /**
   * FITQUEST WORKOUT RUNNER & REST TIMER
   * Active workout execution player, drift-free rest timer with SVG radial countdown,
   * set completions, and celebration modal ceremony.
   */
  
  
  
  
  
  const WorkoutRunner = {
    currentWorkout: null,
    exerciseIndex: 0,
    currentSet: 1,
    startTime: null,
    onCompleteCallback: null,
  
    // Rest Timer State
    restTimer: {
      duration: 60,
      remaining: 60,
      isRunning: false,
      timerId: null,
      targetEndTime: null
    },
  
    /**
     * Start a workout session
     */
    start(workoutData, onComplete) {
      if (!workoutData || !Array.isArray(workoutData.exercises) || workoutData.exercises.length === 0) {
        console.warn('[WorkoutRunner] Invalid workout data provided.');
        return;
      }
  
      this.currentWorkout = workoutData;
      this.exerciseIndex = 0;
      this.currentSet = 1;
      this.startTime = Date.now();
      this.onCompleteCallback = onComplete;
  
      this.renderActiveView();
    },
  
    getCurrentExercise() {
      if (!this.currentWorkout) return null;
      return this.currentWorkout.exercises[this.exerciseIndex] || null;
    },
  
    /**
     * Complete the current set
     */
    completeSet() {
      const ex = this.getCurrentExercise();
      if (!ex) return;
  
      Sound.playSuccess();
      const totalSets = ex.targetSets || ex.defaultSets || 3;
  
      if (this.currentSet < totalSets) {
        this.currentSet += 1;
        this.startRestTimer(ex.targetRest || ex.restTime || 60);
      } else {
        // Completed all sets for this exercise
        if (this.exerciseIndex < this.currentWorkout.exercises.length - 1) {
          this.exerciseIndex += 1;
          this.currentSet = 1;
          this.startRestTimer(ex.targetRest || ex.restTime || 60);
        } else {
          // Entire workout finished!
          this.finishWorkout();
          return;
        }
      }
  
      this.renderActiveView();
    },
  
    /**
     * Rest Timer Implementation
     */
    startRestTimer(seconds = 60) {
      this.stopRestTimer();
      this.restTimer.duration = seconds;
      this.restTimer.remaining = seconds;
      this.restTimer.isRunning = true;
      this.restTimer.targetEndTime = Date.now() + seconds * 1000;
  
      const timerBox = document.getElementById('runner-rest-box');
      if (timerBox) timerBox.classList.add('active');
  
      this.updateTimerDisplay();
  
      this.restTimer.timerId = setInterval(() => {
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((this.restTimer.targetEndTime - now) / 1000));
        this.restTimer.remaining = diff;
  
        this.updateTimerDisplay();
  
        if (diff <= 0) {
          this.stopRestTimer();
          Sound.playTimerDone();
          const box = document.getElementById('runner-rest-box');
          if (box) box.classList.remove('active');
        }
      }, 250);
    },
  
    pauseRestTimer() {
      if (!this.restTimer.isRunning) return;
      clearInterval(this.restTimer.timerId);
      this.restTimer.isRunning = false;
    },
  
    resumeRestTimer() {
      if (this.restTimer.isRunning || this.restTimer.remaining <= 0) return;
      this.restTimer.isRunning = true;
      this.restTimer.targetEndTime = Date.now() + this.restTimer.remaining * 1000;
      this.restTimer.timerId = setInterval(() => {
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((this.restTimer.targetEndTime - now) / 1000));
        this.restTimer.remaining = diff;
        this.updateTimerDisplay();
        if (diff <= 0) {
          this.stopRestTimer();
          Sound.playTimerDone();
          const box = document.getElementById('runner-rest-box');
          if (box) box.classList.remove('active');
        }
      }, 250);
    },
  
    addRestTime(secs = 15) {
      this.restTimer.remaining += secs;
      this.restTimer.duration += secs;
      if (this.restTimer.targetEndTime) {
        this.restTimer.targetEndTime += secs * 1000;
      }
      this.updateTimerDisplay();
    },
  
    skipRestTimer() {
      this.stopRestTimer();
      Sound.playClick();
      const box = document.getElementById('runner-rest-box');
      if (box) box.classList.remove('active');
    },
  
    stopRestTimer() {
      if (this.restTimer.timerId) {
        clearInterval(this.restTimer.timerId);
        this.restTimer.timerId = null;
      }
      this.restTimer.isRunning = false;
    },
  
    updateTimerDisplay() {
      const numEl = document.getElementById('runner-timer-num');
      const circleEl = document.getElementById('runner-timer-circle');
  
      if (numEl) {
        numEl.textContent = this.restTimer.remaining;
      }
  
      if (circleEl && this.restTimer.duration > 0) {
        const circumference = 377; // 2 * PI * 60 approx
        const offset = circumference - (this.restTimer.remaining / this.restTimer.duration) * circumference;
        circleEl.style.strokeDashoffset = Math.max(0, offset);
      }
    },
  
    /**
     * Render active runner UI into DOM
     */
    renderActiveView() {
      const ex = this.getCurrentExercise();
      if (!ex) return;
  
      const totalExercises = this.currentWorkout.exercises.length;
      const totalSets = ex.targetSets || ex.defaultSets || 3;
  
      // Header count
      const phaseTag = document.getElementById('runner-phase-tag');
      if (phaseTag) phaseTag.textContent = `EXERCISE ${this.exerciseIndex + 1} OF ${totalExercises}`;
  
      // Exercise title & target
      const nameEl = document.getElementById('runner-exercise-name');
      if (nameEl) nameEl.textContent = ex.name;
  
      const targetsEl = document.getElementById('runner-targets');
      if (targetsEl) targetsEl.textContent = `Targets: ${(ex.targetMuscles || []).join(', ')}`;
  
      // Icon
      const iconBox = document.getElementById('runner-icon-box');
      if (iconBox) iconBox.textContent = ex.icon || '🏋️';
  
      // Reps / Duration
      const repsVal = document.getElementById('runner-target-reps');
      if (repsVal) {
        repsVal.textContent = ex.defaultDuration ? `${ex.defaultDuration}s` : `${ex.targetReps || ex.defaultReps || 12} Reps`;
      }
  
      // Set dots
      const setsBox = document.getElementById('runner-sets-tracker');
      if (setsBox) {
        setsBox.innerHTML = '';
        for (let s = 1; s <= totalSets; s++) {
          const dot = document.createElement('div');
          dot.className = 'set-dot';
          if (s < this.currentSet) dot.classList.add('completed');
          else if (s === this.currentSet) dot.classList.add('current');
          dot.textContent = s;
          setsBox.appendChild(dot);
        }
      }
  
      // Next Exercise preview
      const nextPreview = document.getElementById('runner-next-preview');
      if (nextPreview) {
        const nextEx = this.currentWorkout.exercises[this.exerciseIndex + 1];
        if (nextEx) {
          nextPreview.textContent = `Next Up: ${nextEx.name} (${nextEx.targetSets || 3} sets)`;
          nextPreview.style.display = 'block';
        } else {
          nextPreview.textContent = 'Final Exercise of Today’s Session!';
          nextPreview.style.display = 'block';
        }
      }
    },
  
    /**
     * Complete entire workout session
     */
    finishWorkout() {
      this.stopRestTimer();
      const elapsedMinutes = Math.max(1, Math.round((Date.now() - (this.startTime || Date.now())) / 60000));
      const xpEarned = 150 + Math.min(100, elapsedMinutes * 5);
  
      const workoutSummary = {
        workoutTitle: this.currentWorkout.title || "Daily Training Session",
        exercisesCount: this.currentWorkout.exercises.length,
        elapsedMinutes,
        xpEarned,
        completedAt: new Date().toISOString(),
        exercises: this.currentWorkout.exercises.map(e => ({ id: e.id, name: e.name, category: e.category }))
      };
  
      Sound.playLevelUp();
      Effects3D.spawnCelebration(2500);
  
      this.showCompletionModal(workoutSummary);
  
      if (typeof this.onCompleteCallback === 'function') {
        this.onCompleteCallback(workoutSummary);
      }
    },
  
    /**
     * Display 3D celebration modal with motivational quote & Shayari
     */
    showCompletionModal(summary) {
      const modal = document.getElementById('modal-workout-complete');
      if (!modal) return;
  
      const xpEl = document.getElementById('complete-xp-val');
      if (xpEl) xpEl.textContent = `+${summary.xpEarned} XP`;
  
      const exCountEl = document.getElementById('complete-ex-count');
      if (exCountEl) exCountEl.textContent = summary.exercisesCount;
  
      const timeEl = document.getElementById('complete-time-val');
      if (timeEl) timeEl.textContent = `${summary.elapsedMinutes} mins`;
  
      // Dynamic motivational quote
      const inspiration = Motivational.getRandomInspiration('strength');
      const quoteEl = document.getElementById('complete-quote-text');
      if (quoteEl) quoteEl.textContent = `"${inspiration.quote}"`;
  
      const shHindiEl = document.getElementById('complete-shayari-hindi');
      if (shHindiEl) shHindiEl.textContent = inspiration.shayariHindi;
  
      const shEngEl = document.getElementById('complete-shayari-eng');
      if (shEngEl) shEngEl.textContent = `“${inspiration.shayariEnglish}”`;
  
      modal.classList.add('active');
    }
  };
  

  /* ==========================================================================
     MODULE: progress.js
     ========================================================================== */
  /**
   * FITQUEST PROGRESS VISUALIZATION & VANILLA SVG CHARTS
   * Zero external chart dependencies; 100% responsive procedural SVG rendering
   */
  
  const ProgressCharts = {
    /**
     * Render weekly workout activity column chart
     */
    renderWeeklyChart(containerId, workoutHistory = []) {
      const container = document.getElementById(containerId);
      if (!container) return;
  
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      // Count workouts in the last 7 days
      const now = new Date();
      const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  
      const todayDayIndex = (now.getDay() + 6) % 7; // Monday = 0
  
      // Check last 7 days history
      workoutHistory.forEach(w => {
        if (!w.completedAt) return;
        const wDate = new Date(w.completedAt);
        const diffDays = Math.floor((now - wDate) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 7) {
          const dIdx = (wDate.getDay() + 6) % 7;
          dayCounts[dIdx] += 1;
        }
      });
  
      const maxCount = Math.max(1, ...dayCounts);
      const svgWidth = 500;
      const svgHeight = 200;
      const barWidth = 36;
      const colSpacing = (svgWidth - 60) / 7;
  
      let barsHtml = '';
  
      days.forEach((dayLabel, i) => {
        const x = 30 + i * colSpacing + (colSpacing - barWidth) / 2;
        const count = dayCounts[i];
        const barHeight = Math.max(8, (count / maxCount) * 120);
        const y = 150 - barHeight;
        const isToday = i === todayDayIndex;
  
        const fill = count > 0 ? (isToday ? 'url(#grad-bar-active)' : 'url(#grad-bar-normal)') : '#E2E8F0';
  
        barsHtml += `
          <g class="chart-bar-group">
            <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="6" fill="${fill}" />
            <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="11" font-weight="700" fill="${count > 0 ? '#0F172A' : 'transparent'}">${count > 0 ? count : ''}</text>
            <text x="${x + barWidth / 2}" y="172" text-anchor="middle" font-size="12" font-weight="${isToday ? '800' : '600'}" fill="${isToday ? '#2563EB' : '#64748B'}">${dayLabel}</text>
          </g>
        `;
      });
  
      container.innerHTML = `
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="grad-bar-normal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0EA5E9" />
              <stop offset="100%" stop-color="#2563EB" />
            </linearGradient>
            <linearGradient id="grad-bar-active" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10B981" />
              <stop offset="100%" stop-color="#059669" />
            </linearGradient>
          </defs>
          <line x1="20" y1="150" x2="${svgWidth - 20}" y2="150" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4" />
          ${barsHtml}
        </svg>
      `;
    },
  
    /**
     * Render XP progression trendline chart
     */
    renderXpChart(containerId, currentXp = 0, history = []) {
      const container = document.getElementById(containerId);
      if (!container) return;
  
      // Synthesize points if history has few points
      const pointsCount = 6;
      const basePts = [];
      const stepXp = currentXp / (pointsCount - 1 || 1);
  
      for (let i = 0; i < pointsCount; i++) {
        basePts.push(Math.round(stepXp * i));
      }
      basePts[pointsCount - 1] = currentXp;
  
      const svgW = 500;
      const svgH = 180;
      const maxXp = Math.max(100, currentXp);
      const paddingX = 40;
      const paddingY = 30;
      const usableW = svgW - paddingX * 2;
      const usableH = svgH - paddingY * 2;
  
      const coords = basePts.map((val, idx) => {
        const cx = paddingX + (idx / (pointsCount - 1)) * usableW;
        const cy = svgH - paddingY - (val / maxXp) * usableH;
        return { x: cx, y: cy, val };
      });
  
      let pathD = `M ${coords[0].x} ${coords[0].y}`;
      for (let i = 1; i < coords.length; i++) {
        const prev = coords[i - 1];
        const cur = coords[i];
        const midX = (prev.x + cur.x) / 2;
        pathD += ` C ${midX} ${prev.y}, ${midX} ${cur.y}, ${cur.x} ${cur.y}`;
      }
  
      const areaD = `${pathD} L ${coords[coords.length - 1].x} ${svgH - paddingY} L ${coords[0].x} ${svgH - paddingY} Z`;
  
      const dotsHtml = coords.map(pt => `
        <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="#FFFFFF" stroke="#0EA5E9" stroke-width="3" />
      `).join('');
  
      container.innerHTML = `
        <svg viewBox="0 0 ${svgW} ${svgH}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="grad-xp-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0EA5E9" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#0EA5E9" stop-opacity="0.0" />
            </linearGradient>
          </defs>
          <path d="${areaD}" fill="url(#grad-xp-area)" />
          <path d="${pathD}" fill="none" stroke="#0EA5E9" stroke-width="3" stroke-linecap="round" />
          ${dotsHtml}
          <text x="${coords[coords.length - 1].x}" y="${coords[coords.length - 1].y - 10}" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">${currentXp} XP</text>
        </svg>
      `;
    }
  };
  

  /* ==========================================================================
     MODULE: profile.js
     ========================================================================== */
  /**
   * FITQUEST PROFILE & SETTINGS MODULE
   * User statistics, avatar selection, settings toggles (audio, animations), and safe reset confirmation
   */
  
  
  
  
  
  
  
  const Profile = {
    avatars: ['⚡', '🦁', '🦅', '🛡️', '👑', '🦾', '🚀', '🥋', '🔥', '💎'],
  
    render() {
      if (!AppState.isLoggedIn()) return;
      const user = AppState.currentUser;
      const data = AppState.userData;
      const profile = data.profile || {};
      const levelInfo = LevelEngine.calculateLevel(data.xp || 0);
  
      // Profile Details
      const nameEl = document.getElementById('profile-name');
      const userEl = document.getElementById('profile-username');
      const avatarEl = document.getElementById('profile-avatar-display');
      const levelBadgeEl = document.getElementById('profile-level-badge');
      const goalEl = document.getElementById('profile-goal-val');
      const expEl = document.getElementById('profile-exp-val');
  
      if (nameEl) nameEl.textContent = user.name || 'Athlete';
      if (userEl) userEl.textContent = `@${user.username}`;
      if (avatarEl) avatarEl.textContent = profile.avatar || '⚡';
      if (levelBadgeEl) levelBadgeEl.textContent = `Level ${levelInfo.level} · ${levelInfo.title}`;
  
      if (goalEl) {
        const goalStr = (profile.goal || 'general_fitness').replace(/_/g, ' ');
        goalEl.textContent = goalStr.charAt(0).toUpperCase() + goalStr.slice(1);
      }
      if (expEl) {
        const expStr = profile.experience || 'beginner';
        expEl.textContent = expStr.charAt(0).toUpperCase() + expStr.slice(1);
      }
  
      // Stats
      const xpEl = document.getElementById('profile-stat-xp');
      const streakEl = document.getElementById('profile-stat-streak');
      const workoutsEl = document.getElementById('profile-stat-workouts');
      const achCountEl = document.getElementById('profile-stat-achievements');
  
      if (xpEl) xpEl.textContent = `${data.xp || 0} XP`;
      if (streakEl) streakEl.textContent = `${data.streak?.current || 0} Days`;
      if (workoutsEl) workoutsEl.textContent = data.completedWorkouts?.length || 0;
      if (achCountEl) achCountEl.textContent = `${(data.achievements || []).length} / 20`;
  
      // Render Avatar Picker Grid
      this.renderAvatarPicker();
  
      // Settings Toggles
      const soundToggle = document.getElementById('setting-sound-toggle');
      const animToggle = document.getElementById('setting-anim-toggle');
      const motionToggle = document.getElementById('setting-motion-toggle');
  
      if (soundToggle) soundToggle.checked = data.settings?.sound !== false;
      if (animToggle) animToggle.checked = data.settings?.animations !== false;
      if (motionToggle) motionToggle.checked = !!data.settings?.reducedMotion;
    },
  
    renderAvatarPicker() {
      const grid = document.getElementById('avatar-picker-grid');
      if (!grid) return;
  
      grid.innerHTML = '';
      const currentAvatar = AppState.userData?.profile?.avatar || '⚡';
  
      this.avatars.forEach(av => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `icon-btn ${av === currentAvatar ? 'active' : ''}`;
        btn.textContent = av;
        btn.title = `Choose ${av}`;
  
        btn.addEventListener('click', () => {
          Sound.playClick();
          if (AppState.userData?.profile) {
            AppState.userData.profile.avatar = av;
            AppState.save();
            this.render();
            Toast.show({
              title: 'Avatar Updated',
              message: `Selected ${av} as your athletic emblem.`,
              icon: av,
              type: 'info'
            });
          }
        });
  
        grid.appendChild(btn);
      });
    },
  
    saveSettings(newSettings) {
      if (!AppState.userData) return;
      AppState.userData.settings = {
        ...AppState.userData.settings,
        ...newSettings
      };
  
      // Apply immediate system effects
      if (newSettings.sound !== undefined) {
        Sound.setEnabled(newSettings.sound);
      }
      if (newSettings.animations !== undefined) {
        Effects3D.enabled = newSettings.animations;
      }
  
      AppState.save();
      Toast.show({
        title: 'Settings Saved',
        message: 'Your preferences have been updated.',
        icon: '⚙️',
        type: 'info'
      });
    }
  };
  

  /* ==========================================================================
     MODULE: navigation.js
     ========================================================================== */
  /**
   * FITQUEST NAVIGATION & 3D SPATIAL SCREEN ROUTER
   * Seamless transitions between application views, hash route syncing, and mobile bottom bar management
   */

  const PageTransition = {
    overlay: null,
    labelEl: null,
    statusEl: null,
    isTransitioning: false,
    titles: {
      'dashboard': 'Home Dashboard',
      'height': 'Height & Posture Hub',
      'library': 'Exercise Library',
      'quests': 'Daily Quests',
      'diet': 'Nutrition & Diet',
      'achievements': 'Trophies & Badges',
      'progress': 'Progress Analytics',
      'profile': 'Athlete Profile',
      'auth': 'Athlete Portal',
      'landing': 'Welcome to FitQuest',
      'onboarding': 'Fitness Setup',
      'active-runner': 'Active Workout Session'
    },

    init() {
      this.overlay = document.getElementById('page-transition-overlay');
      this.labelEl = document.getElementById('transition-target-label');
      this.statusEl = document.getElementById('transition-status-text');
    },

    play(targetScreenKey, onSwitchCallback) {
      if (!this.overlay) this.init();
      if (!this.overlay) {
        if (onSwitchCallback) onSwitchCallback();
        return;
      }

      const shortKey = targetScreenKey.replace('screen-', '');
      const title = this.titles[shortKey] || 'FitQuest Arena';

      if (this.labelEl) this.labelEl.textContent = title.toUpperCase();
      if (this.statusEl) this.statusEl.textContent = `LIFTING TO ${title.toUpperCase()}...`;

      // Force restart animation keyframes
      this.overlay.classList.remove('active', 'animate-in', 'animate-out');
      void this.overlay.offsetWidth; // Trigger reflow
      this.overlay.classList.add('active', 'animate-in');
      this.isTransitioning = true;

      // Mid-lift switch: swap screen contents behind the overlay
      setTimeout(() => {
        if (onSwitchCallback) onSwitchCallback();
      }, 750);

      // Complete overhead lockout & smoothly open destination screen
      setTimeout(() => {
        this.overlay.classList.add('animate-out');
        setTimeout(() => {
          this.overlay.classList.remove('active', 'animate-in', 'animate-out');
          this.isTransitioning = false;
        }, 350);
      }, 1450);
    }
  };

  const Navigation = {
    currentScreenId: 'screen-landing',
    screens: [
      'screen-landing',
      'screen-auth',
      'screen-onboarding',
      'screen-dashboard',
      'screen-height',
      'screen-active-runner',
      'screen-library',
      'screen-quests',
      'screen-diet',
      'screen-achievements',
      'screen-progress',
      'screen-profile'
    ],

    init() {
      PageTransition.init();

      // Bind all data-nav-target elements
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-nav]');
        if (!trigger) return;

        e.preventDefault();
        const targetScreen = trigger.dataset.nav;
        this.navigateTo(targetScreen);
      });

      // Hash change routing
      window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '');
        if (hash && this.screens.includes(`screen-${hash}`)) {
          this.showScreen(`screen-${hash}`, false, true);
        }
      });
    },

    /**
     * Main transition function
     */
    navigateTo(screenKey) {
      if (screenKey === 'demo') {
        Sound.playClick();
        Auth.loginDemo();
        this.showScreen('screen-dashboard', true, true);
        return;
      }

      if (screenKey === 'signup') {
        Sound.playClick();
        this.showScreen('screen-auth', true, true);
        const loginWrap = document.getElementById('auth-login-wrap');
        const signupWrap = document.getElementById('auth-signup-wrap');
        if (loginWrap) loginWrap.style.display = 'none';
        if (signupWrap) signupWrap.style.display = 'block';
        return;
      }

      if (screenKey === 'login') {
        Sound.playClick();
        this.showScreen('screen-auth', true, true);
        const loginWrap = document.getElementById('auth-login-wrap');
        const signupWrap = document.getElementById('auth-signup-wrap');
        if (signupWrap) signupWrap.style.display = 'none';
        if (loginWrap) loginWrap.style.display = 'block';
        return;
      }

      const screenId = screenKey.startsWith('screen-') ? screenKey : `screen-${screenKey}`;
      if (!this.screens.includes(screenId)) return;

      // Route guards
      if (this.requiresAuth(screenId) && !AppState.isLoggedIn()) {
        this.showScreen('screen-auth', true, true);
        return;
      }

      Sound.playClick();
      this.showScreen(screenId, true, true);
    },

    requiresAuth(screenId) {
      const publicScreens = ['screen-landing', 'screen-auth', 'screen-onboarding', 'screen-library', 'screen-diet', 'screen-height'];
      return !publicScreens.includes(screenId);
    },

    showScreen(targetId, updateHash = true, animate = true) {
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const performScreenSwitch = () => {
        // Remove active from current screens
        document.querySelectorAll('.app-screen').forEach(scr => {
          scr.classList.remove('active');
        });

        // Activate target
        targetEl.classList.add('active');
        this.currentScreenId = targetId;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (updateHash) {
          const shortRoute = targetId.replace('screen-', '');
          history.pushState(null, '', `#${shortRoute}`);
        }

        // Sync Navigation Bars
        this.syncNavLinks(targetId);

        // Trigger custom route event
        window.dispatchEvent(new CustomEvent('fitquest:screenChanged', { detail: { screenId: targetId } }));
      };

      if (animate) {
        PageTransition.play(targetId, performScreenSwitch);
      } else {
        performScreenSwitch();
      }
    },

    syncNavLinks(screenId) {
      const route = screenId.replace('screen-', '');

      // Desktop header links
      document.querySelectorAll('.desktop-nav .nav-link').forEach(link => {
        const target = link.dataset.nav;
        link.classList.toggle('active', target === route || target === screenId);
      });

      // Mobile bottom nav links
      document.querySelectorAll('.bottom-nav .bottom-nav-item').forEach(item => {
        const target = item.dataset.nav;
        item.classList.toggle('active', target === route || target === screenId);
      });

      // Header visibility on landing or onboarding
      const header = document.querySelector('.app-header');
      const bottomNav = document.querySelector('.bottom-nav');

      if (header) {
        const hideHeader = screenId === 'screen-active-runner';
        header.style.display = hideHeader ? 'none' : 'flex';
      }

      if (bottomNav) {
        const hideBottom = screenId === 'screen-landing' || screenId === 'screen-auth' || screenId === 'screen-onboarding' || screenId === 'screen-active-runner';
        bottomNav.style.display = hideBottom ? 'none' : '';
      }
    }
  };
  

  /* ==========================================================================
     MODULE: onboarding.js
     ========================================================================== */
  /**
   * FITQUEST MULTI-STEP ONBOARDING WIZARD
   * Collects fitness profile, goal, time commitment, equipment, and synthesizes customized journey
   */
  
  
  
  
  
  
  
  
  const Onboarding = {
    currentStep: 1,
    totalSteps: 5,
    formData: {
      experience: 'beginner',
      activityLevel: 'moderate',
      goal: 'general_fitness',
      duration: 30,
      daysPerWeek: 3,
      equipment: ['bodyweight'],
      preferredTime: 'morning'
    },
  
    init() {
      this.currentStep = 1;
      this.bindChoiceCards();
    },
  
    bindChoiceCards() {
      // Single choice groups
      document.querySelectorAll('.choice-group-single').forEach(group => {
        const field = group.dataset.field;
        group.querySelectorAll('.choice-card').forEach(card => {
          card.addEventListener('click', () => {
            group.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            Sound.playClick();
            const val = card.dataset.value;
            this.formData[field] = val;
          });
        });
      });
  
      // Multi-select equipment cards
      document.querySelectorAll('.equipment-multi-group .choice-card').forEach(card => {
        card.addEventListener('click', () => {
          const val = card.dataset.value;
          Sound.playClick();
  
          if (val === 'bodyweight') {
            // If no equipment clicked, deselect everything else
            document.querySelectorAll('.equipment-multi-group .choice-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            this.formData.equipment = ['bodyweight'];
            return;
          }
  
          // Uncheck bodyweight if other equipment chosen
          const bodyweightCard = document.querySelector('.equipment-multi-group .choice-card[data-value="bodyweight"]');
          if (bodyweightCard) bodyweightCard.classList.remove('selected');
  
          card.classList.toggle('selected');
  
          const selected = Array.from(document.querySelectorAll('.equipment-multi-group .choice-card.selected'))
            .map(c => c.dataset.value);
  
          this.formData.equipment = selected.length > 0 ? selected : ['bodyweight'];
          if (selected.length === 0 && bodyweightCard) {
            bodyweightCard.classList.add('selected');
          }
        });
      });
    },
  
    goToStep(step) {
      if (step < 1 || step > this.totalSteps) return;
      this.currentStep = step;
      Sound.playClick();
  
      // Update Indicators
      for (let i = 1; i <= this.totalSteps; i++) {
        const ind = document.getElementById(`step-ind-${i}`);
        const pane = document.getElementById(`onboarding-step-${i}`);
  
        if (ind) {
          ind.classList.remove('active', 'completed');
          if (i < step) ind.classList.add('completed');
          else if (i === step) ind.classList.add('active');
        }
  
        if (pane) {
          pane.classList.remove('active');
          if (i === step) pane.classList.add('active');
        }
      }
  
      // Dynamic button label & styles for Step 5
      const nextBtn = document.getElementById('onboarding-next-btn');
      const prevBtn = document.getElementById('onboarding-prev-btn');
  
      if (nextBtn) {
        if (step === this.totalSteps) {
          nextBtn.innerHTML = '⚡ Generate My Workout Schedule →';
          nextBtn.classList.remove('btn-3d-emerald');
          nextBtn.classList.add('btn-3d-fire');
        } else {
          nextBtn.innerHTML = 'Continue →';
          nextBtn.classList.remove('btn-3d-fire');
          nextBtn.classList.add('btn-3d-emerald');
        }
      }
  
      if (prevBtn) {
        prevBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
      }
    },
  
    nextStep() {
      if (this.currentStep < this.totalSteps) {
        this.goToStep(this.currentStep + 1);
      } else {
        this.finishOnboarding();
      }
    },
  
    prevStep() {
      if (this.currentStep > 1) {
        this.goToStep(this.currentStep - 1);
      }
    },
  
    /**
     * Finalize and generate customized training plan in the shortest possible time
     */
    finishOnboarding(onSuccess) {
      const loadingPane = document.getElementById('onboarding-step-loading');
      const stepPanes = document.querySelectorAll('.onboarding-step-pane');
      const footerControls = document.getElementById('onboarding-footer-controls');
  
      stepPanes.forEach(p => p.classList.remove('active'));
      if (footerControls) footerControls.style.display = 'none';
      if (loadingPane) loadingPane.classList.add('active');
  
      // Ensure active user exists even if onboarding directly
      if (!AppState.isLoggedIn()) {
        const guestAthlete = {
          name: 'Champion Athlete',
          username: 'athlete_' + Math.floor(1000 + Math.random() * 9000),
          email: 'athlete@fitquest.app',
          dob: '2000-01-01'
        };
        AppState.setUser(guestAthlete, true);
      }
  
      // Generate customized workout plan immediately
      const plan = WorkoutEngine.generatePlan(this.formData);
  
      AppState.userData.profile = {
        ...AppState.userData.profile,
        ...this.formData
      };
      AppState.userData.workoutPlan = plan;
      AppState.addXp(100, 'Synthesized Custom Workout Schedule');
      AppState.save();
  
      // Fast, crisp 250ms feedback pulse, then immediate dashboard transition
      setTimeout(() => {
        if (loadingPane) loadingPane.classList.remove('active');
        if (footerControls) footerControls.style.display = 'flex';
        this.goToStep(1); // Reset wizard state
  
        Sound.playLevelUp();
        Effects3D.spawnCelebration(2000);
  
        // Force route directly to dashboard
        window.location.hash = '#dashboard';
        Navigation.showScreen('screen-dashboard', true);
  
        Toast.show({
          title: '🔥 Schedule Generated!',
          message: `${plan.splitName} with ${plan.daysPerWeek} training days is ready.`,
          icon: '⚡',
          type: 'success'
        });
  
        if (typeof onSuccess === 'function') {
          onSuccess(plan);
        }
      }, 250);
    }
  };
  

  /* ==========================================================================
     MODULE: height-growth.js
     ========================================================================== */
  /**
   * FITQUEST HEIGHT GROWTH & SPINAL ALIGNMENT ENGINE
   * Comprehensive science, endocrinology, epiphyseal plate facts, growth-stunting habits (demerits),
   * nutrition, specialized yoga asanas, decompression exercises, and interactive roadmap generator.
   */
  
  
  
  
  
  
  
  const HeightGrowth = {
    activeTab: 'science',
    selectedRoutineId: 'beginner_decompression',
  
    // ==========================================================================
    // 1. COMPREHENSIVE KNOWLEDGE BASE
    // ==========================================================================
    knowledgeBase: {
      science: [
        {
          title: 'Epiphyseal Growth Plates Biology',
          icon: '🦴',
          summary: 'Long bones (femurs, tibias, humeri) grow from specialized cartilaginous zones called epiphyseal plates.',
          detail: 'During childhood and puberty, chondrocytes continuously divide, hypertrophy, and undergo endochondral ossification (turn into solid bone). Under the influence of sex steroids (estrogen and testosterone), these plates gradually calcify and fuse (typically between ages 16–21 in males, 14–19 in females). Before fusion, longitudinal bone elongation is active; after fusion, height increases occur through intervertebral disc decompression, pelvic alignment, and posture restoration.'
        },
        {
          title: 'Human Growth Hormone (HGH) & IGF-1 Rhythms',
          icon: '⚡',
          summary: 'Pituitary HGH is released in pulsatile waves, with up to 75% secreted during Stage 3/4 Deep Slow-Wave Sleep.',
          detail: 'Once secreted, HGH travels to the liver where it stimulates the production of Insulin-like Growth Factor 1 (IGF-1). IGF-1 binds directly to receptors on epiphyseal chondrocytes, driving cellular proliferation. Peak pulses occur within 60–90 minutes after falling asleep, meaning fragmented or late-night sleep directly sabotages the biological growth window.'
        },
        {
          title: 'Intervertebral Disc Decompression Biomechanics',
          icon: '🧬',
          summary: 'The 23 intervertebral discs account for 25% of total spinal column length and can be decompressed.',
          detail: 'Each disc consists of a gelatinous nucleus pulposus enclosed by an annulus fibrosus. Under daily gravitational axial loading, fluid is squeezed out, causing adults to lose 1.5 to 2.5 cm by evening. Targeted traction, active hanging, and core elongation re-hydrate discs via fluid imbibition, restoring up to 1.5–3.5 cm (0.6–1.4 inches) of permanent standing height even after growth plates fuse.'
        },
        {
          title: 'Genetics vs Environmental Epigenetics (60–80% vs 20–40%)',
          icon: '🔬',
          summary: 'Genetics dictate your theoretical maximum ceiling, but environmental factors determine if you reach it.',
          detail: 'Twin studies show height has a heritability of ~70–80% in developed nations. However, chronic nutritional deficits, endocrine disruptors, poor posture, and sleep deprivation can rob an individual of 5 to 10 cm (2 to 4 inches) of their genetic potential. Optimizing biomechanics ensures 100% realization of your genetic ceiling.'
        }
      ],
  
      demerits: [
        {
          title: 'Chronic Sleep Deprivation & Late Nights',
          icon: '💤',
          severity: 'CRITICAL',
          effect: 'Suppresses 70–80% of daily HGH secretion.',
          detail: 'Sleeping less than 7 hours or sleeping past midnight disrupts the circadian slow-wave sleep cycles where peak growth hormone pulses occur. High nocturnal cortisol further blocks pituitary secretion.'
        },
        {
          title: 'Slouching, Text-Neck & Forward Pelvic Tilt',
          icon: '📱',
          severity: 'SEVERE',
          effect: 'Causes a virtual loss of 1 to 3 inches in standing height.',
          detail: 'Forward head carriage (text neck), thoracic hyperkyphosis (rounded shoulders), and anterior pelvic tilt buckle the spine into an exaggerated S-curve. This compresses discs prematurely and shortens functional standing posture.'
        },
        {
          title: 'Excessive Refined Sugars & Hyperinsulinemia',
          icon: '🍬',
          severity: 'HIGH',
          effect: 'High insulin spikes suppress growth hormone by up to 85%.',
          detail: 'Consuming high-glycemic snacks and sodas elevates circulating insulin. Insulin and HGH share inverse hormonal signaling pathways; high insulin shuts down pituitary somatotropin release.'
        },
        {
          title: 'Nicotine, Vaping & Early Alcohol/Caffeine',
          icon: '🚭',
          severity: 'HIGH',
          effect: 'Vasoconstriction reduces nutrient delivery to growth plate cartilage.',
          detail: 'Nicotine constricts peripheral capillaries feeding chondrocytes in long bones, and excessive caffeine accelerates urinary calcium excretion, compromising bone mineral density.'
        },
        {
          title: 'Severe Caloric Deficits & Low Protein Diets',
          icon: '⚠️',
          severity: 'CRITICAL',
          effect: 'Deprives chondrocytes of collagen-building amino acids.',
          detail: 'Starvation diets or eating inadequate protein deprives the body of L-Arginine and amino acid building blocks required for bone matrix synthesis and IGF-1 generation.'
        },
        {
          title: 'Heavy Spinal Compression Loading Without Decompression',
          icon: '🏋️‍♂️',
          severity: 'MODERATE',
          effect: 'Excessive vertical axial loading without hanging traction.',
          detail: 'Lifting heavy weights directly overhead or heavy axial squats without post-workout bar hangs accelerates disc fluid loss and increases spinal compression.'
        }
      ],
  
      nutrition: [
        {
          nutrient: 'Calcium (1000–1200 mg/day)',
          icon: '🥛',
          sources: 'Milk, Paneer, Curd, Sesame seeds, Ragi, Almonds, Tofu.',
          role: 'Forms the hydroxyapatite crystal lattice that gives bones rigidity and compressive strength.'
        },
        {
          nutrient: 'Vitamin D3 (2000–4000 IU/day)',
          icon: '☀️',
          sources: 'Early morning sunlight (20 mins), fortified foods, egg yolks, fish, D3 drops.',
          role: 'Upregulates calbindin proteins in intestinal enterocytes, enabling gut absorption of dietary calcium into blood.'
        },
        {
          nutrient: 'Vitamin K2 (MK-7 100 mcg/day)',
          icon: '🥬',
          sources: 'Fermented foods, natto, hard cheeses, egg yolk, greens.',
          role: 'Carboxylates osteocalcin, binding circulating calcium directly into the bone matrix while preventing arterial calcification.'
        },
        {
          nutrient: 'Zinc (15–25 mg/day)',
          icon: '🥜',
          sources: 'Pumpkin seeds, chickpeas, lentils, cashews, eggs.',
          role: 'Essential cofactor for DNA polymerase and osteoblast collagen synthesis; directly stimulates hepatic IGF-1 output.'
        },
        {
          nutrient: 'Growth-Promoting Amino Acids (L-Arginine & L-Glutamine)',
          icon: '🥩',
          sources: 'Soya chunks, lentils, peanuts, chicken, eggs, pumpkin seeds.',
          role: 'Natural secretagogues that cross the blood-brain barrier to stimulate pituitary release of growth hormone.'
        },
        {
          nutrient: 'Medical Review: The Truth About "Height Pills"',
          icon: '💊',
          sources: 'Clinical Endocrinology Evidence',
          role: '99% of online "grow 4 inches in 30 days" pills are multi-vitamin scams. Legitimate prescription HGH is only administered via daily subcutaneous injections under a licensed pediatric endocrinologist before growth plate fusion.'
        }
      ],
  
      yoga: [
        {
          name: 'Tadasana (Palm Tree / Mountain Pose)',
          sanskrit: 'ताड़ासन',
          icon: '🌴',
          focus: 'Full longitudinal axial traction of all 33 vertebrae.',
          instructions: [
            'Stand with feet together, weight balanced evenly across soles.',
            'Interlock fingers, turn palms upward toward ceiling.',
            'Inhale deeply and rise up onto the balls of your feet (toes).',
            'Stretch your entire body upward from heels through fingertips.',
            'Hold for 30–45 seconds breathing steadily. Repeat 3 times.'
          ],
          benefits: 'Straightens thoracic curvature, decompresses lumbar discs, and stimulates growth plate alignment.'
        },
        {
          name: 'Bhujangasana (Cobra Pose)',
          sanskrit: 'भुजंगासन',
          icon: '🐍',
          focus: 'Thoracic extension, chest opening, and spinal elasticity.',
          instructions: [
            'Lie prone on your stomach with forehead on the mat.',
            'Place palms flat under shoulders, elbows hugged close to torso.',
            'Inhale and gently lift head, chest, and upper abdomen off the ground.',
            'Keep pelvic bone grounded and shoulders drawn away from ears.',
            'Hold for 25–35 seconds. Exhale and slowly lower down.'
          ],
          benefits: 'Reverses forward slumping, improves spinal disc hydration, and stretches deep abdominal muscles.'
        },
        {
          name: 'Chakrasana (Wheel / Bridge Pose)',
          sanskrit: 'चक्रासन',
          icon: '🎡',
          focus: 'Maximum spinal extension, pituitary circulation, and hip flexor lengthening.',
          instructions: [
            'Lie on back with knees bent, feet hip-width flat on the mat.',
            'Place palms on the floor beside ears, fingers pointing toward shoulders.',
            'Press firmly through feet and hands, lifting hips and chest upward into an arch.',
            'Relax head and gaze gently at the floor between your hands.',
            'Hold for 15–20 seconds with controlled breathing.'
          ],
          benefits: 'Improves blood flow to the pituitary gland and lengthens the anterior spinal column.'
        },
        {
          name: 'Paschimottanasana (Seated Forward Bend)',
          sanskrit: 'पश्चिमोत्तानासन',
          icon: '🧘‍♂️',
          focus: 'Posterior chain decompression, hamstring and spine elongation.',
          instructions: [
            'Sit upright with legs fully extended together in front of you.',
            'Inhale, raise both arms overhead, lengthening the torso.',
            'Exhale, hinge forward from hips, reaching for shins, ankles, or toes.',
            'Keep spine long rather than aggressively hunching your back.',
            'Hold for 40–60 seconds while relaxing into each exhalation.'
          ],
          benefits: 'Decompresses the lumbar and sacral spine and increases intervertebral space.'
        },
        {
          name: 'Sarvangasana (Supported Shoulder Stand)',
          sanskrit: 'सर्वांगासन',
          icon: '🤸‍♀️',
          focus: 'Inversion decompression, endocrine & thyroid stimulation.',
          instructions: [
            'Lie on back, bend knees, and roll hips off the floor upward.',
            'Support your lower back with palms, elbows grounded on mat.',
            'Extend legs straight up toward ceiling, body aligned in vertical line.',
            'Breathe deeply into diaphragm for 45–60 seconds.',
            'Carefully roll down vertebra by vertebra.'
          ],
          benefits: 'Reverses gravity on spinal discs and promotes venous return to master endocrine glands.'
        },
        {
          name: 'Cat-Cow Flow (Marjaryasana-Bitilasana)',
          sanskrit: 'मार्जरी-बितिलासन',
          icon: '🐈',
          focus: 'Dynamic spinal articulation and disc fluid rehydration.',
          instructions: [
            'Start on all fours with wrists under shoulders, knees under hips.',
            'Inhale into Cow: drop belly, lift chest and tailbone, gaze up.',
            'Exhale into Cat: round spine toward ceiling, tuck chin and pelvis.',
            'Repeat smoothly for 10–12 cycles synchronized with breath.'
          ],
          benefits: 'Pumps fresh synovial fluid into intervertebral facets and releases back stiffness.'
        }
      ],
  
      exercises: [
        {
          name: 'Active & Passive Bar Hang',
          icon: '🧗',
          category: 'Spinal Traction',
          sets: '3 sets × 45–60 seconds',
          detail: 'Grip an overhead pull-up bar with overhand grip. Allow gravity to pull down your hips and lower body, fully unloading 100% of gravitational compression from vertebrae.'
        },
        {
          name: 'High-Intensity Interval Sprints',
          icon: '🏃‍♂️',
          category: 'HGH Surge Trigger',
          sets: '6 sets × 50m sprint (walk back rest)',
          detail: 'All-out anaerobic sprinting creates micro-cellular stimulation on long bones and triggers up to a 500–700% natural surge in acute serum HGH pulses.'
        },
        {
          name: 'High Jump Rope & Plyometric Leaps',
          icon: '⚡',
          category: 'Epiphyseal Stimulation',
          sets: '4 sets × 50 bounces + 10 max vertical leaps',
          detail: 'Rhythmic mechanical impact strains osteoblast remodeling in lower limbs, promoting calcium mineralization along primary stress lines.'
        },
        {
          name: 'Pelvic Shift & Bridge Hold',
          icon: '🌉',
          category: 'Pelvic Neutralization',
          sets: '3 sets × 15 reps + 20s hold',
          detail: 'Lying on back, drive through heels to lift hips in line with knees. Activates glutes and rectus abdominis to fix anterior pelvic tilt that robs up to 2 inches.'
        },
        {
          name: 'Dry-Land Breaststroke Elongation',
          icon: '🏊‍♂️',
          category: 'Core Traction',
          sets: '3 sets × 12 reps',
          detail: 'Lie on stomach, extend arms forward and kick legs back, lifting chest and thighs simultaneously while stretching in opposite directions.'
        }
      ]
    },
  
    // ==========================================================================
    // 2. ROUTINE PRESETS (LAUNCHABLE IN WORKOUT RUNNER)
    // ==========================================================================
    routines: [
      {
        id: 'beginner_decompression',
        name: 'Gentle Spinal Decompression & Morning Yoga',
        difficulty: 'Beginner',
        badge: 'GENTLE · 15 MINS',
        durationMinutes: 15,
        icon: '🌱',
        description: 'Zero-impact daily morning protocol focused on unlocking spinal compression, fixing pelvic tilt, and promoting posture elongation.',
        exercises: [
          {
            id: 'h-tadasana',
            name: 'Tadasana (Palm Tree Stretch)',
            category: 'yoga',
            equipment: 'bodyweight',
            targetSets: 3,
            targetReps: 45,
            targetRest: 30,
            targetMuscles: ['Spinal Extensors', 'Calves', 'Shoulders'],
            icon: '🌴',
            instructions: ['Stand tall, interlock fingers, rise onto toes and stretch entire body upward.'],
            tips: 'Gaze at a fixed point to maintain equilibrium.',
            caloriesBurnedPerSet: 8
          },
          {
            id: 'h-cat-cow',
            name: 'Cat-Cow Spinal Articulation',
            category: 'mobility',
            equipment: 'bodyweight',
            targetSets: 3,
            targetReps: 12,
            targetRest: 25,
            targetMuscles: ['Erector Spinae', 'Core', 'Thoracic Spine'],
            icon: '🐈',
            instructions: ['Inhale arching back into cow, exhale rounding spine into cat.'],
            tips: 'Move smoothly with each breath.',
            caloriesBurnedPerSet: 10
          },
          {
            id: 'h-bhujangasana',
            name: 'Bhujangasana (Cobra Extension)',
            category: 'yoga',
            equipment: 'bodyweight',
            targetSets: 3,
            targetReps: 30,
            targetRest: 30,
            targetMuscles: ['Thoracic Spine', 'Chest', 'Abdominals'],
            icon: '🐍',
            instructions: ['Press through palms, lift chest while keeping pelvic bone grounded.'],
            tips: 'Avoid straining neck; keep shoulders away from ears.',
            caloriesBurnedPerSet: 12
          },
          {
            id: 'h-passive-hang',
            name: 'Dead Bar Hang Decompression',
            category: 'decompression',
            equipment: 'pull-up bar',
            targetSets: 3,
            targetReps: 45,
            targetRest: 45,
            targetMuscles: ['Spine', 'Lats', 'Forearms'],
            icon: '🧗',
            instructions: ['Hang freely from pull-up bar, relaxing shoulders and breathing into lower back.'],
            tips: 'Do not swing; feel the gentle gravitational pull.',
            caloriesBurnedPerSet: 15
          }
        ]
      },
      {
        id: 'intermediate_hgh',
        name: 'HGH Surge & Intervertebral Elongation',
        difficulty: 'Intermediate',
        badge: 'RECOMMENDED · 25 MINS',
        durationMinutes: 25,
        icon: '⚡',
        description: 'Balanced protocol combining deep spinal traction, hamstring lengthening, pelvic leveling, and growth plate stimulation.',
        exercises: [
          {
            id: 'h-bar-hang-active',
            name: 'Passive to Active Bar Hang',
            category: 'decompression',
            equipment: 'pull-up bar',
            targetSets: 4,
            targetReps: 50,
            targetRest: 45,
            targetMuscles: ['Spine', 'Latissimus Dorsi', 'Shoulders'],
            icon: '🧗',
            instructions: ['Hang freely for 30s, then engage scapulae for 20s to align thoracic facets.'],
            tips: 'Exhale completely to maximize disc decompression.',
            caloriesBurnedPerSet: 18
          },
          {
            id: 'h-paschimottanasana',
            name: 'Paschimottanasana (Seated Elongation)',
            category: 'yoga',
            equipment: 'bodyweight',
            targetSets: 3,
            targetReps: 40,
            targetRest: 30,
            targetMuscles: ['Hamstrings', 'Lower Back', 'Spinal Decompressors'],
            icon: '🧘‍♂️',
            instructions: ['Hinge from hips, extend chest toward toes without rounding upper back.'],
            tips: 'Flex toes toward shins to deepen posterior chain elongation.',
            caloriesBurnedPerSet: 12
          },
          {
            id: 'h-bhujangasana-deep',
            name: 'Deep Cobra to Child Pose Transition',
            category: 'yoga',
            equipment: 'bodyweight',
            targetSets: 3,
            targetReps: 12,
            targetRest: 30,
            targetMuscles: ['Spine', 'Hip Flexors', 'Erectors'],
            icon: '🐍',
            instructions: ['Transition smoothly from full Cobra stretch into elongated Child pose.'],
            tips: 'Lengthen arms forward in Child pose for upper thoracic decompression.',
            caloriesBurnedPerSet: 15
          },
          {
            id: 'h-pelvic-shift',
            name: 'Pelvic Bridge Alignment Hold',
            category: 'posture',
            equipment: 'bodyweight',
            targetSets: 3,
            targetReps: 15,
            targetRest: 30,
            targetMuscles: ['Gluteus Maximus', 'Hamstrings', 'Transverse Abdominis'],
            icon: '🌉',
            instructions: ['Drive hips upward, squeeze glutes at top to neutralize pelvic tilt.'],
            tips: 'Keep feet flat and knees parallel.',
            caloriesBurnedPerSet: 16
          },
          {
            id: 'h-plyo-jump',
            name: 'High Vertical Tuck Leaps',
            category: 'dynamic',
            equipment: 'bodyweight',
            targetSets: 3,
            targetReps: 12,
            targetRest: 45,
            targetMuscles: ['Quads', 'Calves', 'Core'],
            icon: '🦘',
            instructions: ['Squat slightly and explosively leap toward ceiling, tucking knees.'],
            tips: 'Land softly on balls of feet with knees slightly bent.',
            caloriesBurnedPerSet: 25
          }
        ]
      },
      {
        id: 'advanced_athletic',
        name: 'Advanced Athletic Growth & Micro-Stimulation',
        difficulty: 'Advanced',
        badge: 'HIGH DENSITY · 35 MINS',
        durationMinutes: 35,
        icon: '🔥',
        description: 'Maximum biological stimulus protocol with all-out sprints for acute HGH pulses, full Chakrasana wheel extension, and inverted decompression.',
        exercises: [
          {
            id: 'h-sprints',
            name: 'Max Effort Explosive Sprints',
            category: 'hgh-trigger',
            equipment: 'bodyweight',
            targetSets: 5,
            targetReps: 50,
            targetRest: 60,
            targetMuscles: ['Full Body', 'HGH Pituitary Trigger'],
            icon: '🏃‍♂️',
            instructions: ['Sprint at 95–100% maximum intensity for 50 meters, walk back for rest.'],
            tips: 'Drive knees high and pump arms powerfully.',
            caloriesBurnedPerSet: 35
          },
          {
            id: 'h-chakrasana',
            name: 'Chakrasana (Wheel Pose Arch)',
            category: 'yoga',
            equipment: 'bodyweight',
            targetSets: 3,
            targetReps: 25,
            targetRest: 45,
            targetMuscles: ['Entire Anterior Chain', 'Spine', 'Shoulders'],
            icon: '🎡',
            instructions: ['Press hands and feet firmly to arch spine upward into a complete wheel.'],
            tips: 'Only attempt after warm-up; keep neck relaxed.',
            caloriesBurnedPerSet: 22
          },
          {
            id: 'h-sarvangasana',
            name: 'Sarvangasana (Shoulder Stand)',
            category: 'yoga',
            equipment: 'bodyweight',
            targetSets: 3,
            targetReps: 60,
            targetRest: 45,
            targetMuscles: ['Neck', 'Core', 'Endocrine Glands'],
            icon: '🤸‍♀️',
            instructions: ['Invert body vertically, supporting lower back with hands.'],
            tips: 'Do not turn head while inverted; breathe smoothly.',
            caloriesBurnedPerSet: 18
          },
          {
            id: 'h-bar-hang-weighted',
            name: 'Inversion / Heavy Decompression Hang',
            category: 'decompression',
            equipment: 'pull-up bar',
            targetSets: 4,
            targetReps: 60,
            targetRest: 60,
            targetMuscles: ['Entire Spinal Column', 'Intervertebral Discs'],
            icon: '🧗',
            instructions: ['Perform prolonged hanging with ankles relaxed or lightly weighted.'],
            tips: 'Focus on releasing tension in lower lumbar region.',
            caloriesBurnedPerSet: 20
          },
          {
            id: 'h-dry-breaststroke',
            name: 'Dry-Land Elongation Swim',
            category: 'mobility',
            equipment: 'bodyweight',
            targetSets: 3,
            targetReps: 15,
            targetRest: 30,
            targetMuscles: ['Latissimus', 'Rhomboids', 'Erectors'],
            icon: '🏊‍♂️',
            instructions: ['Prone on stomach, lift chest and flutter arms and legs simultaneously in extension.'],
            tips: 'Stretch extremities as far apart as possible.',
            caloriesBurnedPerSet: 18
          }
        ]
      }
    ],
  
    // ==========================================================================
    // 3. INITIALIZATION & EVENT BINDINGS
    // ==========================================================================
    init() {
      this.bindEvents();
    },
  
    bindEvents() {
      // Knowledge Base Tabs
      document.querySelectorAll('.knowledge-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          Sound.playClick();
          const tab = btn.dataset.tab;
          this.switchTab(tab);
        });
      });
  
      // Assessment Form Submission
      const assessmentForm = document.getElementById('form-height-assessment');
      if (assessmentForm) {
        assessmentForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.calculateRoadmap();
        });
      }
  
      // Routine Card Selectors
      document.querySelectorAll('.routine-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const routineId = btn.dataset.routineId;
          this.launchRoutine(routineId);
        });
      });
    },
  
    // ==========================================================================
    // 4. SCREEN ACTIVATION & RENDERING
    // ==========================================================================
    render() {
      const data = AppState.userData;
      const profile = data?.heightProfile || this.getDefaultProfile();
  
      // Render Hero Gauge & Progress
      this.renderHeroStats(profile);
  
      // Populate Form with existing profile data
      this.populateForm(profile);
  
      // Render Knowledge Content
      this.renderKnowledgeContent();
  
      // Render Routine Cards
      this.renderRoutineCards();
    },
  
    getDefaultProfile() {
      return {
        age: 19,
        gender: 'male',
        currentHeightCm: 172,
        targetHeightCm: 180,
        weightKg: 68,
        sleepHours: 7.5,
        postureStatus: 'slouched',
        growthPotentialScore: 78,
        biologicalPhase: 'Active Late Growth Plate & Spinal Decompression',
        predictedGainCm: '4.5 - 7.5 cm',
        roadmapGenerated: true
      };
    },
  
    renderHeroStats(profile) {
      const scoreVal = document.getElementById('height-potential-score-val');
      const scoreFill = document.getElementById('height-potential-score-fill');
      const currHVal = document.getElementById('height-current-disp');
      const targetHVal = document.getElementById('height-target-disp');
      const gainVal = document.getElementById('height-predicted-gain');
      const phaseTag = document.getElementById('height-biological-phase');
  
      const score = profile.growthPotentialScore || 75;
      if (scoreVal) scoreVal.textContent = `${score}%`;
      if (scoreFill) scoreFill.style.width = `${score}%`;
  
      const currCm = profile.currentHeightCm || 172;
      const targetCm = profile.targetHeightCm || 180;
  
      if (currHVal) currHVal.textContent = `${currCm} cm (${this.cmToFeetInches(currCm)})`;
      if (targetHVal) targetHVal.textContent = `${targetCm} cm (${this.cmToFeetInches(targetCm)})`;
      if (gainVal) gainVal.textContent = `+${(targetCm - currCm).toFixed(1)} cm Goal (${profile.predictedGainCm || '3 - 6 cm'})`;
      if (phaseTag) phaseTag.textContent = profile.biologicalPhase || 'Growth Phase';
    },
  
    populateForm(profile) {
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined) el.value = val;
      };
  
      setVal('input-height-age', profile.age || 19);
      setVal('input-height-gender', profile.gender || 'male');
      setVal('input-height-current', profile.currentHeightCm || 172);
      setVal('input-height-target', profile.targetHeightCm || 180);
      setVal('input-height-weight', profile.weightKg || 68);
      setVal('input-height-sleep', profile.sleepHours || 7.5);
      setVal('input-height-posture', profile.postureStatus || 'slouched');
    },
  
    // ==========================================================================
    // 5. ROADMAP ASSESSMENT CALCULATION
    // ==========================================================================
    calculateRoadmap() {
      Sound.playClick();
  
      const age = parseInt(document.getElementById('input-height-age')?.value, 10) || 19;
      const gender = document.getElementById('input-height-gender')?.value || 'male';
      const currentCm = parseFloat(document.getElementById('input-height-current')?.value) || 172;
      const targetCm = parseFloat(document.getElementById('input-height-target')?.value) || 180;
      const weightKg = parseFloat(document.getElementById('input-height-weight')?.value) || 68;
      const sleep = parseFloat(document.getElementById('input-height-sleep')?.value) || 7.5;
      const posture = document.getElementById('input-height-posture')?.value || 'slouched';
  
      // 1. Determine Biological Growth Phase & Growth Plate Status
      let plateStatus = 'open';
      let biologicalPhase = '';
      let basePotential = 85;
  
      if (gender === 'female') {
        if (age <= 16) {
          plateStatus = 'open';
          biologicalPhase = 'Active Primary Epiphyseal Lengthening Phase';
          basePotential = 92;
        } else if (age <= 19) {
          plateStatus = 'late';
          biologicalPhase = 'Late Consolidation & Spinal Disc Decompression Phase';
          basePotential = 78;
        } else {
          plateStatus = 'closed';
          biologicalPhase = 'Adult Spinal Decompression, Intervertebral & Posture Elongation';
          basePotential = 65;
        }
      } else {
        if (age <= 18) {
          plateStatus = 'open';
          biologicalPhase = 'Active Primary Epiphyseal Growth Phase';
          basePotential = 95;
        } else if (age <= 21) {
          plateStatus = 'late';
          biologicalPhase = 'Late Consolidation & Intervertebral Lengthening Phase';
          basePotential = 82;
        } else {
          plateStatus = 'closed';
          biologicalPhase = 'Adult Spinal Decompression, Disc Rehydration & Posture Restoration';
          basePotential = 68;
        }
      }
  
      // 2. Adjust Potential Score by Sleep & Posture
      let score = basePotential;
      if (sleep >= 8) score += 5;
      else if (sleep < 6) score -= 12;
  
      if (posture === 'slouched') {
        score += 6;
      } else if (posture === 'active') {
        score += 3;
      }
  
      score = Math.min(99, Math.max(45, score));
  
      // 3. Projected Realistic Height Gain
      let minGain = 2.0;
      let maxGain = 5.0;
  
      if (plateStatus === 'open') {
        minGain = 4.0;
        maxGain = 9.0;
      } else if (plateStatus === 'late') {
        minGain = 3.0;
        maxGain = 6.5;
      } else {
        minGain = 1.5;
        maxGain = 4.2;
      }
  
      const predictedGainCm = `${minGain.toFixed(1)} - ${maxGain.toFixed(1)} cm`;
  
      // 4. Save to User State
      const heightProfile = {
        age,
        gender,
        currentHeightCm: currentCm,
        targetHeightCm: targetCm,
        weightKg,
        sleepHours: sleep,
        postureStatus: posture,
        growthPotentialScore: score,
        biologicalPhase,
        plateStatus,
        predictedGainCm,
        calculatedAt: new Date().toISOString(),
        roadmapGenerated: true
      };
  
      if (AppState.isLoggedIn()) {
        AppState.userData.heightProfile = heightProfile;
        AppState.addXp(120, 'Completed Height Growth & Posture Roadmap');
        AppState.save();
      }
  
      Sound.playLevelUp();
      Toast.show({
        title: 'Roadmap Generated!',
        message: `Your customized 90-Day Height & Posture Protocol is calibrated.`,
        icon: '📏',
        type: 'success'
      });
  
      // Update Screen UI
      this.renderHeroStats(heightProfile);
      this.renderGeneratedRoadmapCard(heightProfile);
    },
  
    renderGeneratedRoadmapCard(profile) {
      const card = document.getElementById('height-generated-roadmap-result');
      if (!card) return;
  
      card.style.display = 'block';
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
          <div>
            <span class="badge badge-gold" style="font-size: 0.8rem; margin-bottom: 0.4rem;">PERSONALIZED PROTOCOL</span>
            <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">
              Your 90-Day Height Optimization Roadmap
            </h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">
              Status: <strong style="color: var(--accent-blue);">${profile.biologicalPhase}</strong>
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Achievable Projection</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--accent-emerald);">+${profile.predictedGainCm}</div>
          </div>
        </div>
  
        <div class="roadmap-phases-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; margin-bottom: 1.75rem;">
          
          <!-- Phase 1 -->
          <div class="feature-box tilt-card" style="border-left: 4px solid var(--accent-blue); padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span class="badge badge-cyan">DAYS 1 – 30</span>
              <span style="font-size: 1.3rem;">🧬</span>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 700;">Phase 1: Spinal Decompression & Imbibition</h4>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.4rem; line-height: 1.5;">
              Focus on passive bar hangs, pelvic bridge alignment, and Tadasana. Rehydrate compressed intervertebral discs to reclaim initial 1.5–2.5 cm lost to gravity.
            </p>
            <div style="margin-top: 0.75rem; font-size: 0.78rem; font-weight: 700; color: var(--accent-blue);">
              Target: Restore 1.5 cm & Fix Anterior Pelvic Tilt
            </div>
          </div>
  
          <!-- Phase 2 -->
          <div class="feature-box tilt-card" style="border-left: 4px solid var(--accent-purple); padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span class="badge badge-purple">DAYS 31 – 60</span>
              <span style="font-size: 1.3rem;">⚡</span>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 700;">Phase 2: HGH Circadian Pulse & Bone Matrix</h4>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.4rem; line-height: 1.5;">
              Synchronize sleep schedules to hit deep Stage 3 NREM sleep by 11:00 PM. Optimize Calcium, Vitamin D3, Vitamin K2 (MK-7), and Zinc. Incorporate sprinting for natural growth hormone spikes.
            </p>
            <div style="margin-top: 0.75rem; font-size: 0.78rem; font-weight: 700; color: var(--accent-purple);">
              Target: 8+ Hours Sleep & Pituitary HGH Optimization
            </div>
          </div>
  
          <!-- Phase 3 -->
          <div class="feature-box tilt-card" style="border-left: 4px solid var(--accent-emerald); padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span class="badge badge-emerald">DAYS 61 – 90</span>
              <span style="font-size: 1.3rem;">🏔️</span>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 700;">Phase 3: Dynamic Micro-Stimulation & Lock-In</h4>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.4rem; line-height: 1.5;">
              Combine full Chakrasana wheel extension, inversion hangs, and plyometric jump rope to reinforce bone remodeling along long axes and cement permanent upright posture.
            </p>
            <div style="margin-top: 0.75rem; font-size: 0.78rem; font-weight: 700; color: var(--accent-emerald);">
              Target: Structural Consolidation & Full Height Realization
            </div>
          </div>
  
        </div>
  
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h5 style="font-size: 0.95rem; font-weight: 700;">Next Step: Select Your Daily Height Routine Below</h5>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
              Choose a routine matching your confidence and physical capability, and launch it directly in the active 3D runner.
            </p>
          </div>
          <button type="button" class="btn-3d btn-3d-fire" style="font-size: 0.9rem; padding: 0.65rem 1.5rem;" onclick="const el = document.getElementById('height-routines-section'); if (el) el.scrollIntoView({ behavior: 'smooth' });">
            ⚡ Choose Routine Below ↓
          </button>
        </div>
      `;
    },
  
    // ==========================================================================
    // 6. KNOWLEDGE TABS SWITCHING
    // ==========================================================================
    switchTab(tabKey) {
      this.activeTab = tabKey;
  
      document.querySelectorAll('.knowledge-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabKey);
      });
  
      this.renderKnowledgeContent();
    },
  
    renderKnowledgeContent() {
      const container = document.getElementById('height-knowledge-content');
      if (!container) return;
  
      const tab = this.activeTab;
      const kb = this.knowledgeBase;
  
      if (tab === 'science') {
        container.innerHTML = `
          <div class="knowledge-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
            ${kb.science.map(item => `
              <div class="feature-box tilt-card" style="padding: 1.4rem;">
                <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">${item.icon}</div>
                <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">${item.title}</h4>
                <p style="font-size: 0.88rem; font-weight: 600; color: var(--accent-blue); margin: 0.4rem 0;">${item.summary}</p>
                <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">${item.detail}</p>
              </div>
            `).join('')}
          </div>
        `;
      } else if (tab === 'demerits') {
        container.innerHTML = `
          <div style="margin-bottom: 1rem;">
            <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--accent-red);">
              ⚠️ Critical Habits That Stunt & Suppress Human Height Growth
            </h4>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.25rem;">
              These physiological and biomechanical demerits actively suppress natural growth hormone secretion and compress the spinal column.
            </p>
          </div>
          <div class="knowledge-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
            ${kb.demerits.map(item => `
              <div class="feature-box tilt-card" style="padding: 1.4rem; border-left: 4px solid var(--accent-red);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span style="font-size: 2rem;">${item.icon}</span>
                  <span class="badge badge-purple" style="background: var(--accent-red-subtle); color: var(--accent-red);">${item.severity} DEMERIT</span>
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">${item.title}</h4>
                <div style="font-size: 0.84rem; font-weight: 700; color: var(--accent-red); margin: 0.4rem 0;">
                  Impact: ${item.effect}
                </div>
                <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">${item.detail}</p>
              </div>
            `).join('')}
          </div>
        `;
      } else if (tab === 'nutrition') {
        container.innerHTML = `
          <div style="margin-bottom: 1rem;">
            <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">
              🥗 Bone Matrix Micronutrients, Secretagogues & Medical Realities
            </h4>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.25rem;">
              Essential nutritional co-factors required to mineralize osteoid tissue and stimulate the anterior pituitary gland.
            </p>
          </div>
          <div class="knowledge-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
            ${kb.nutrition.map(item => `
              <div class="feature-box tilt-card" style="padding: 1.4rem;">
                <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.6rem;">
                  <span style="font-size: 2rem;">${item.icon}</span>
                  <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">${item.nutrient}</h4>
                </div>
                <div style="background: var(--bg-secondary); padding: 0.6rem 0.8rem; border-radius: var(--radius-md); margin-bottom: 0.6rem; font-size: 0.8rem; color: var(--text-primary);">
                  <strong>Optimal Sources:</strong> ${item.sources}
                </div>
                <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
                  <strong>Physiological Role:</strong> ${item.role}
                </p>
              </div>
            `).join('')}
          </div>
        `;
      } else if (tab === 'yoga') {
        container.innerHTML = `
          <div style="margin-bottom: 1rem;">
            <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">
              🧘 Ancient & Biomechanical Elongation Yoga Asanas
            </h4>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.25rem;">
              Specific yogic postures proven to decompress the 33 vertebrae, reverse hyperkyphosis, and stimulate pituitary circulation.
            </p>
          </div>
          <div class="knowledge-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem;">
            ${kb.yoga.map(item => `
              <div class="feature-box tilt-card" style="padding: 1.4rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 2.2rem;">${item.icon}</span>
                    <div>
                      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">${item.name}</h4>
                      <span style="font-size: 0.8rem; color: var(--accent-blue); font-weight: 700;">${item.sanskrit}</span>
                    </div>
                  </div>
                </div>
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--accent-purple); margin-bottom: 0.5rem;">
                  Target: ${item.focus}
                </div>
                <ol style="font-size: 0.8rem; color: var(--text-secondary); padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
                  ${item.instructions.map(inst => `<li>${inst}</li>`).join('')}
                </ol>
                <div style="background: var(--accent-emerald-subtle); padding: 0.6rem 0.8rem; border-radius: var(--radius-md); font-size: 0.78rem; color: var(--accent-emerald-hover); font-weight: 700;">
                  💡 Benefits: ${item.benefits}
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else if (tab === 'exercises') {
        container.innerHTML = `
          <div style="margin-bottom: 1rem;">
            <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">
              🤸 Specialized Height Exercises & Epiphyseal Micro-Stimulators
            </h4>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.25rem;">
              Dynamic biomechanical movements designed for gravity reversal, disc fluid imbibition, and acute HGH output.
            </p>
          </div>
          <div class="knowledge-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
            ${kb.exercises.map(item => `
              <div class="feature-box tilt-card" style="padding: 1.4rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span style="font-size: 2.2rem;">${item.icon}</span>
                  <span class="badge badge-cyan">${item.category}</span>
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">${item.name}</h4>
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--accent-emerald); margin: 0.35rem 0;">
                  Protocol: ${item.sets}
                </div>
                <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">${item.detail}</p>
              </div>
            `).join('')}
          </div>
        `;
      }
    },
  
    // ==========================================================================
    // 7. ROUTINE CARDS & RUNNER INTEGRATION
    // ==========================================================================
    renderRoutineCards() {
      const container = document.getElementById('height-routines-container');
      if (!container) return;
  
      container.innerHTML = `
        <div class="routines-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(310px, 1fr)); gap: 1.5rem;">
          ${this.routines.map(rt => `
            <div class="feature-box tilt-card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.75rem; border: 2px solid var(--border-subtle); position: relative;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                  <div style="font-size: 2.5rem;">${rt.icon}</div>
                  <span class="badge ${rt.difficulty === 'Beginner' ? 'badge-cyan' : rt.difficulty === 'Intermediate' ? 'badge-emerald' : 'badge-purple'}">
                    ${rt.badge}
                  </span>
                </div>
  
                <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.4rem;">
                  ${rt.name}
                </h4>
                <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem;">
                  ${rt.description}
                </p>
  
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.6rem;">
                  Included Exercises (${rt.exercises.length}):
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.5rem;">
                  ${rt.exercises.map((ex, idx) => `
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); background: var(--bg-secondary); padding: 0.45rem 0.75rem; border-radius: var(--radius-md);">
                      <span>${idx + 1}. ${ex.icon} ${ex.name}</span>
                      <span style="color: var(--accent-blue); font-weight: 700;">${ex.targetSets}×${ex.targetReps}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
  
              <button type="button" class="btn-3d ${rt.difficulty === 'Advanced' ? 'btn-3d-fire' : 'btn-3d-emerald'} routine-select-btn" data-routine-id="${rt.id}" style="width: 100%; padding: 0.85rem; font-size: 0.95rem;">
                ⚡ Start ${rt.difficulty} Routine in Active Runner
              </button>
            </div>
          `).join('')}
        </div>
      `;
  
      // Re-bind click handlers
      container.querySelectorAll('.routine-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const rId = btn.dataset.routineId;
          this.launchRoutine(rId);
        });
      });
    },
  
    launchRoutine(routineId) {
      Sound.playClick();
      const routine = this.routines.find(r => r.id === routineId);
      if (!routine) return;
  
      // Convert routine to WorkoutRunner format
      const workoutSession = {
        dayNumber: 1,
        title: routine.name,
        focus: 'Height Optimization & Spinal Decompression',
        estimatedMinutes: routine.durationMinutes,
        difficulty: routine.difficulty.toLowerCase(),
        exercises: routine.exercises
      };
  
      Toast.show({
        title: 'Launching Height Protocol!',
        message: `Loading ${routine.name} into Active Workout Runner.`,
        icon: '📏',
        type: 'success'
      });
  
      WorkoutRunner.start(workoutSession, (summary) => {
        if (AppState.isLoggedIn()) {
          AppState.recordCompletedWorkout({
            ...summary,
            workoutTitle: routine.name,
            category: 'height_protocol'
          });
        }
      });
  
      Navigation.showScreen('screen-active-runner', true);
    },
  
    // ==========================================================================
    // 8. HELPER UTILITIES
    // ==========================================================================
    cmToFeetInches(cm) {
      const totalInches = cm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}′${inches}″`;
    }
  };
  

  /* ==========================================================================
     MODULE: auth.js
     ========================================================================== */
  /**
   * FITQUEST AUTHENTICATION SYSTEM
   * Frontend multi-user signup, login, validation, and session management
   */
  
  
  
  
  
  
  
  
  const Auth = {
    /**
     * Register a new user
     */
    signup({ name, username, email, password, dob }) {
      const trimmedUsername = (username || '').trim();
      const trimmedEmail = (email || '').trim().toLowerCase();
      const trimmedName = (name || '').trim();
  
      // Validation
      if (!trimmedName || !trimmedUsername || !trimmedEmail || !password || !dob) {
        return { success: false, error: 'Please fill in all registration fields.' };
      }
  
      if (trimmedUsername.length < 3) {
        return { success: false, error: 'Username must be at least 3 characters long.' };
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return { success: false, error: 'Please provide a valid email address.' };
      }
  
      if (password.length < 4) {
        return { success: false, error: 'Password must be at least 4 characters long.' };
      }
  
      // Check duplicate username
      const existing = Storage.findUser(trimmedUsername);
      if (existing) {
        return { success: false, error: 'That username is already taken. Please choose another.' };
      }
  
      const newUser = {
        name: trimmedName,
        username: trimmedUsername,
        email: trimmedEmail,
        password: password, // Stored in localStorage for client-side demo
        dob: dob,
        createdAt: new Date().toISOString()
      };
  
      Storage.saveUser(newUser);
      AppState.setUser(newUser, true);
      Sound.playSuccess();
  
      Toast.show({
        title: 'Welcome to FitQuest!',
        message: `Account created for ${newUser.name}. Let's set up your fitness journey!`,
        icon: '🎉',
        type: 'success'
      });
  
      return { success: true, user: newUser };
    },
  
    /**
     * Log into an existing account
     */
    login(username, password) {
      const trimmedUsername = (username || '').trim();
  
      if (!trimmedUsername || !password) {
        return { success: false, error: 'Please enter both username and password.' };
      }
  
      const user = Storage.findUser(trimmedUsername);
      if (!user) {
        return { success: false, error: "We couldn't find an account with that username." };
      }
  
      if (user.password !== password) {
        return { success: false, error: "Those credentials didn't match. Let's try once more. 💪" };
      }
  
      AppState.setUser(user, false);
      Sound.playSuccess();
  
      Toast.show({
        title: 'Welcome Back!',
        message: `Great to see you, ${user.name}. Ready for today's workout?`,
        icon: '💪',
        type: 'success'
      });
  
      return { success: true, user };
    },
  
    /**
     * Instant 1-Click Demo Athlete Login for immediate testing
     */
    loginDemo() {
      let demoUser = Storage.findUser('alex_demo');
      if (!demoUser) {
        demoUser = {
          name: 'Alex "The Titan"',
          username: 'alex_demo',
          email: 'alex.demo@fitquest.app',
          password: 'password123',
          dob: '1998-06-15',
          createdAt: new Date().toISOString()
        };
        Storage.saveUser(demoUser);
      }
  
      AppState.setUser(demoUser, false);
  
      // Pre-populate with a customized plan and some initial streak/XP if brand new
      if (!AppState.userData.workoutPlan) {
        const plan = WorkoutEngine.generatePlan({
          goal: 'build_muscle',
          experience: 'intermediate',
          duration: 30,
          daysPerWeek: 4,
          equipment: ['bodyweight', 'dumbbells']
        });
        AppState.userData.profile = {
          name: demoUser.name,
          username: demoUser.username,
          email: demoUser.email,
          dob: demoUser.dob,
          avatar: '⚡',
          goal: 'build_muscle',
          experience: 'intermediate',
          duration: 30,
          daysPerWeek: 4,
          equipment: ['bodyweight', 'dumbbells']
        };
        AppState.userData.workoutPlan = plan;
        AppState.userData.xp = 420;
        AppState.userData.level = 2;
        AppState.userData.streak = {
          current: 3,
          longest: 5,
          lastActiveDate: StreakEngine.getTodayString(),
          history: [StreakEngine.getTodayString()]
        };
        AppState.save();
      }
  
      Sound.playSuccess();
      Toast.show({
        title: 'Demo Athlete Activated!',
        message: 'Logged in as Alex. Ready to explore all features!',
        icon: '⚡',
        type: 'gold'
      });
  
      return { success: true, user: demoUser };
    },
  
    /**
     * Log out active user
     */
    logout() {
      AppState.logout();
      Sound.playClick();
      Toast.show({
        title: 'Logged Out',
        message: 'Your progress is safely stored in this browser.',
        icon: '👋',
        type: 'info'
      });
    }
  };
  

  /* ==========================================================================
     MODULE: app.js
     ========================================================================== */
  /**
   * FITQUEST MASTER APPLICATION COORDINATOR
   * Connects reactive state, 3D visual engine, active workout runner, gamification, and UI rendering
   */
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  const App = {
    init() {
      // 1. Initialize Core Systems
      AppState.init();
      Effects3D.init();
      Navigation.init();
      Onboarding.init();
      HeightGrowth.init();
  
      // 2. Bind DOM Event Handlers
      this.bindAuthEvents();
      this.bindModalEvents();
      this.bindWorkoutRunnerEvents();
      this.bindLibraryEvents();
      this.bindDietEvents();
      this.bindProfileEvents();
  
      // 3. Subscribe to AppState Events
      AppState.subscribe('init', () => this.handleSessionState());
      AppState.subscribe('userChanged', () => this.handleSessionState());
      AppState.subscribe('userLoggedOut', () => this.handleSessionState());
      AppState.subscribe('xpUpdated', () => this.updateHeaderStats());
      AppState.subscribe('workoutRecorded', () => this.renderDashboard());
      AppState.subscribe('achievementsUpdated', () => this.updateHeaderStats());
  
      // 4. Handle Route Screen Changes
      window.addEventListener('fitquest:screenChanged', (e) => {
        this.onScreenActivated(e.detail.screenId);
      });
  
      // 5. Initial Screen Selection
      this.handleSessionState();
    },
  
    /**
     * Determine starting view based on authentication & onboarding state
     */
    handleSessionState() {
      this.updateHeaderStats();
  
      if (AppState.isLoggedIn()) {
        const data = AppState.userData;
        if (!data.workoutPlan) {
          // User created account but hasn't finished fitness onboarding
          Navigation.showScreen('screen-onboarding', true);
        } else {
          // Full user ready for dashboard
          this.renderDashboard();
          let target = 'screen-dashboard';
          const initialHash = window.location.hash.replace('#', '');
          // Guard against trapping in onboarding, auth, landing, etc.
          if (initialHash && !['onboarding', 'auth', 'landing', 'signup', 'login'].includes(initialHash) && Navigation.screens.includes(`screen-${initialHash}`)) {
            target = `screen-${initialHash}`;
          }
          Navigation.showScreen(target, target === 'screen-dashboard');
        }
      } else {
        // Guest or logged out -> Landing page
        Navigation.showScreen('screen-landing', true);
      }
    },
  
    /**
     * Update top header pills (Streak, XP, Level)
     */
    updateHeaderStats() {
      const isLogged = AppState.isLoggedIn();
      const statsContainer = document.querySelector('.header-stats');
      const headerActions = document.querySelector('.header-actions');
  
      if (!statsContainer) return;
  
      if (!isLogged) {
        statsContainer.style.display = 'none';
        if (headerActions) headerActions.style.display = 'flex';
        return;
      }
  
      statsContainer.style.display = 'flex';
      if (headerActions) headerActions.style.display = 'none';
  
      const data = AppState.userData;
      const levelInfo = LevelEngine.calculateLevel(data.xp || 0);
      const streakDisplay = StreakEngine.getBadgeDisplay(data.streak?.current || 0);
  
      // Streak Pill
      const streakVal = document.getElementById('header-streak-val');
      const streakIcon = document.getElementById('header-streak-icon');
      if (streakVal) streakVal.textContent = `${data.streak?.current || 0}d`;
      if (streakIcon) streakIcon.textContent = streakDisplay.icon;
  
      // XP Pill
      const xpVal = document.getElementById('header-xp-val');
      if (xpVal) xpVal.textContent = `${data.xp || 0} XP`;
  
      // Level Pill
      const levelVal = document.getElementById('header-level-val');
      if (levelVal) levelVal.textContent = `Lvl ${levelInfo.level}`;
    },
  
    /**
     * Refresh views when navigating between screens
     */
    onScreenActivated(screenId) {
      if (screenId === 'screen-dashboard') {
        this.renderDashboard();
      } else if (screenId === 'screen-library') {
        this.renderLibrary();
      } else if (screenId === 'screen-quests') {
        this.renderQuestsScreen();
      } else if (screenId === 'screen-diet') {
        this.renderDietScreen();
      } else if (screenId === 'screen-achievements') {
        this.renderAchievementsScreen();
      } else if (screenId === 'screen-progress') {
        this.renderProgressScreen();
      } else if (screenId === 'screen-profile') {
        Profile.render();
      } else if (screenId === 'screen-height') {
        HeightGrowth.render();
      }
    },
  
    // ==========================================
    // DASHBOARD RENDERING
    // ==========================================
    renderDashboard() {
      if (!AppState.isLoggedIn()) return;
      const user = AppState.currentUser;
      const data = AppState.userData;
  
      // Greeting according to time of day
      const hour = new Date().getHours();
      let timeGreeting = 'Good morning';
      if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
      else if (hour >= 17) timeGreeting = 'Good evening';
  
      const greetingEl = document.getElementById('dash-greeting');
      if (greetingEl) {
        greetingEl.textContent = `${timeGreeting}, ${user.name || 'Athlete'}! 💪`;
      }
  
      // Dynamic Motivational Quote & Hindi Shayari
      const inspiration = Motivational.getRandomInspiration('discipline');
      const quoteEl = document.getElementById('dash-quote-text');
      const shHindiEl = document.getElementById('dash-shayari-hindi');
      const shEngEl = document.getElementById('dash-shayari-eng');
  
      if (quoteEl) quoteEl.textContent = `"${inspiration.quote}"`;
      if (shHindiEl) shHindiEl.textContent = inspiration.shayariHindi;
      if (shEngEl) shEngEl.textContent = `“${inspiration.shayariEnglish}”`;
  
      // Level & XP Progress Card
      const levelInfo = LevelEngine.calculateLevel(data.xp || 0);
      const progress = LevelEngine.getProgress(data.xp || 0);
  
      const badgeIconEl = document.getElementById('dash-level-icon');
      const levelTitleEl = document.getElementById('dash-level-title');
      const levelSubEl = document.getElementById('dash-level-sub');
      const xpProgValEl = document.getElementById('dash-xp-progress-val');
      const xpFillEl = document.getElementById('dash-xp-fill');
  
      if (badgeIconEl) badgeIconEl.textContent = levelInfo.badge;
      if (levelTitleEl) levelTitleEl.textContent = `Level ${levelInfo.level} · ${levelInfo.title}`;
      if (levelSubEl) levelSubEl.textContent = levelInfo.description;
      if (xpProgValEl) {
        xpProgValEl.textContent = progress.nextLevel 
          ? `${progress.currentLevelXp} / ${progress.totalRequired} XP (${progress.percent}%)`
          : 'Maximum Tier Attained!';
      }
      if (xpFillEl) xpFillEl.style.width = `${progress.percent}%`;
  
      // Today's Scheduled Workout Hero Card
      this.renderTodayWorkoutCard();
  
      // Weekly Training Schedule & Exercise Breakdown
      this.renderWeeklySchedule();
  
      // Quests Checklist Widget
      this.renderQuestsWidget();
  
      // Mood / Energy Check-in Strip
      this.renderMoodStrip();
    },
  
    renderTodayWorkoutCard() {
      const data = AppState.userData;
      const plan = data.workoutPlan;
      const titleEl = document.getElementById('dash-workout-title');
      const descEl = document.getElementById('dash-workout-desc');
      const metaContainer = document.getElementById('dash-workout-meta');
      const startBtn = document.getElementById('btn-start-today-workout');
      const previewContainer = document.getElementById('dash-today-exercises-preview');
  
      if (!plan || !plan.schedule || plan.schedule.length === 0) {
        if (titleEl) titleEl.textContent = 'Foundational Training';
        if (descEl) descEl.textContent = 'Customized full body conditioning session.';
        if (previewContainer) previewContainer.innerHTML = '';
        return;
      }
  
      // Determine day in schedule
      const completedCount = data.completedWorkouts?.length || 0;
      const scheduleIndex = completedCount % plan.schedule.length;
      const todaysDay = plan.schedule[scheduleIndex];
  
      if (titleEl) titleEl.textContent = todaysDay.title;
      if (descEl) descEl.textContent = `Focus: ${todaysDay.focus} · ${todaysDay.exercises.length} Exercises`;
  
      if (metaContainer) {
        metaContainer.innerHTML = `
          <span class="badge badge-cyan">${todaysDay.estimatedMinutes} Mins</span>
          <span class="badge badge-purple">${todaysDay.difficulty.toUpperCase()}</span>
          <span class="badge badge-emerald">${plan.splitName}</span>
        `;
      }
  
      // Quick-preview of today's exercises
      if (previewContainer && todaysDay.exercises) {
        previewContainer.innerHTML = todaysDay.exercises.map(ex => `
          <span class="exercise-chip-pill" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; border-radius: var(--radius-full); background: var(--bg-secondary); border: 1px solid var(--border-subtle); font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all var(--transition-fast);" data-ex-id="${ex.id}" title="Click to view instructions & tips">
            <span>${ex.icon || '💪'}</span>
            <span>${ex.name}</span>
            <span style="color: var(--accent-blue); font-size: 0.72rem;">(${ex.targetSets}×${ex.targetReps})</span>
          </span>
        `).join('');
  
        previewContainer.querySelectorAll('.exercise-chip-pill').forEach(pill => {
          pill.addEventListener('click', (e) => {
            e.stopPropagation();
            const exId = pill.dataset.exId;
            const found = todaysDay.exercises.find(x => x.id === exId);
            if (found) this.openExerciseModal(found);
          });
        });
      }
  
      if (startBtn) {
        startBtn.onclick = () => {
          Sound.playClick();
          WorkoutRunner.start(todaysDay, (summary) => {
            AppState.recordCompletedWorkout(summary);
          });
          Navigation.showScreen('screen-active-runner', true);
        };
      }
    },
  
    selectedScheduleDayIndex: 0,
  
    renderWeeklySchedule() {
      const data = AppState.userData;
      const plan = data?.workoutPlan;
      const section = document.getElementById('dash-schedule-section');
      if (!section) return;
  
      if (!plan || !plan.schedule || plan.schedule.length === 0) {
        section.style.display = 'none';
        return;
      }
      section.style.display = 'block';
  
      const titleEl = document.getElementById('dash-schedule-title');
      const metaEl = document.getElementById('dash-schedule-meta');
      const splitBadgeEl = document.getElementById('dash-schedule-split-badge');
      const tabsContainer = document.getElementById('dash-schedule-day-tabs');
      const exercisesContainer = document.getElementById('dash-schedule-exercises-container');
  
      if (titleEl) titleEl.textContent = `Weekly Routine: ${plan.splitName}`;
      if (metaEl) {
        metaEl.textContent = `${plan.daysPerWeek} Training Days/Week · ${plan.duration || 30} Min Sessions · Focus: ${(plan.goal || 'Fitness').replace('_', ' ').toUpperCase()}`;
      }
      if (splitBadgeEl) splitBadgeEl.textContent = `${plan.daysPerWeek}-DAY SPLIT`;
  
      if (this.selectedScheduleDayIndex >= plan.schedule.length) {
        this.selectedScheduleDayIndex = 0;
      }
  
      // Render Day Selector Tabs
      if (tabsContainer) {
        tabsContainer.innerHTML = plan.schedule.map((day, idx) => {
          const isActive = idx === this.selectedScheduleDayIndex;
          return `
            <button type="button" class="schedule-day-tab ${isActive ? 'active' : ''}" data-day-index="${idx}">
              <span>Day ${day.dayNumber}</span>
              <span style="opacity: 0.75; font-size: 0.75rem;">(${day.title})</span>
            </button>
          `;
        }).join('');
  
        tabsContainer.querySelectorAll('.schedule-day-tab').forEach(tab => {
          tab.addEventListener('click', () => {
            Sound.playClick();
            this.selectedScheduleDayIndex = parseInt(tab.dataset.dayIndex, 10);
            this.renderWeeklySchedule();
          });
        });
      }
  
      // Render Exercises For Selected Routine Day
      if (exercisesContainer) {
        const currentDay = plan.schedule[this.selectedScheduleDayIndex];
        if (!currentDay) return;
  
        exercisesContainer.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.85rem;">
            <div>
              <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">
                Day ${currentDay.dayNumber}: ${currentDay.title}
              </h4>
              <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">
                Target Focus: <strong style="color: var(--accent-blue);">${currentDay.focus}</strong> · ${currentDay.exercises.length} Exercises · ~${currentDay.estimatedMinutes} Mins · ${currentDay.difficulty.toUpperCase()}
              </div>
            </div>
            <button type="button" id="btn-launch-schedule-day" class="btn-3d btn-3d-fire" style="padding: 0.65rem 1.4rem; font-size: 0.88rem;">
              ⚡ Start Day ${currentDay.dayNumber} Workout
            </button>
          </div>
  
          <div class="schedule-exercise-grid">
            ${currentDay.exercises.map((ex, exIdx) => `
              <div class="schedule-exercise-card tilt-card" data-ex-id="${ex.id}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <span style="font-size: 1.6rem;">${ex.icon || '🏋️'}</span>
                    <div>
                      <span style="font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">EXERCISE ${exIdx + 1}</span>
                      <h5 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-top: 0.1rem;">${ex.name}</h5>
                    </div>
                  </div>
                  <span class="badge badge-cyan" style="font-size: 0.7rem;">${(ex.category || 'General').toUpperCase()}</span>
                </div>
  
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.35rem;">
                  <span class="badge badge-purple" style="font-size: 0.72rem;">${ex.targetSets} Sets × ${ex.targetReps} Reps</span>
                  <span class="badge badge-emerald" style="font-size: 0.72rem;">Rest: ${ex.targetRest}s</span>
                  <span class="badge badge-gold" style="font-size: 0.72rem;">${ex.equipment}</span>
                </div>
  
                <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.35rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                  ${ex.description || 'Target functional strength and progressive muscle endurance.'}
                </p>
  
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border-subtle);">
                  <button type="button" class="btn-preview-exercise" data-ex-id="${ex.id}" style="background: none; border: none; font-size: 0.8rem; font-weight: 700; color: var(--accent-blue); cursor: pointer; padding: 0.2rem 0;">
                    📖 View Form Guide →
                  </button>
                  <span style="font-size: 0.72rem; color: var(--text-muted);">
                    ~${(ex.caloriesBurnedPerSet || 10) * ex.targetSets} kcal
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        `;
  
        // Bind Launch Day button
        const launchBtn = exercisesContainer.querySelector('#btn-launch-schedule-day');
        if (launchBtn) {
          launchBtn.addEventListener('click', () => {
            Sound.playClick();
            WorkoutRunner.start(currentDay, (summary) => {
              AppState.recordCompletedWorkout(summary);
            });
            Navigation.showScreen('screen-active-runner', true);
          });
        }
  
        // Bind Exercise Form Guide preview buttons
        exercisesContainer.querySelectorAll('.btn-preview-exercise').forEach(btn => {
          btn.addEventListener('click', () => {
            const exId = btn.dataset.exId;
            const found = currentDay.exercises.find(x => x.id === exId);
            if (found) this.openExerciseModal(found);
          });
        });
      }
    },
  
    renderQuestsWidget() {
      const container = document.getElementById('dash-quests-list');
      if (!container) return;
  
      const quests = AppState.userData?.dailyQuests?.quests || [];
      container.innerHTML = '';
  
      quests.slice(0, 4).forEach(q => {
        const item = document.createElement('div');
        item.className = `quest-item ${q.completed ? 'completed' : ''}`;
        item.innerHTML = `
          <div class="quest-left">
            <div class="quest-checkbox">${q.completed ? '✓' : ''}</div>
            <div class="quest-info">
              <span class="quest-title">${q.title}</span>
              <span class="quest-desc">${q.desc}</span>
            </div>
          </div>
          <div class="quest-xp-badge">+${q.xp} XP</div>
        `;
  
        item.addEventListener('click', (e) => {
          const res = QuestEngine.toggleQuest(AppState.userData.dailyQuests, q.id);
          AppState.userData.dailyQuests = res.updatedQuests;
          if (res.xpDelta > 0) {
            AppState.addXp(res.xpDelta, `Completed Quest: ${q.title}`);
            Effects3D.spawnXpFloater(res.xpDelta, e.clientX, e.clientY);
          } else if (res.xpDelta < 0) {
            AppState.userData.xp = Math.max(0, AppState.userData.xp + res.xpDelta);
            AppState.save();
          }
          this.renderQuestsWidget();
          this.updateHeaderStats();
        });
  
        container.appendChild(item);
      });
    },
  
    renderMoodStrip() {
      const container = document.getElementById('dash-mood-strip');
      if (!container) return;
  
      container.innerHTML = '';
      const moods = MoodEngine.getMoods();
      const currentMood = AppState.userData?.moodHistory?.slice(-1)[0]?.moodId || null;
  
      moods.forEach(m => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `mood-btn ${m.id === currentMood ? 'selected' : ''}`;
        btn.innerHTML = `<span>${m.icon}</span> <span>${m.label}</span>`;
  
        btn.addEventListener('click', () => {
          Sound.playClick();
          if (!Array.isArray(AppState.userData.moodHistory)) {
            AppState.userData.moodHistory = [];
          }
          AppState.userData.moodHistory.push({
            moodId: m.id,
            recordedAt: new Date().toISOString()
          });
          AppState.save();
  
          const rec = MoodEngine.getRecommendation(m.id);
          Toast.show({
            title: rec.title,
            message: rec.message,
            icon: m.icon,
            type: rec.isLight ? 'info' : 'fire'
          });
  
          this.renderMoodStrip();
        });
  
        container.appendChild(btn);
      });
    },
  
    // ==========================================
    // EXERCISE LIBRARY RENDERING
    // ==========================================
    renderLibrary(category = 'all', searchQuery = '') {
      const grid = document.getElementById('library-exercise-grid');
      if (!grid) return;
  
      const filtered = ExerciseHelper.filter(searchQuery, category);
      grid.innerHTML = '';
  
      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
            <h3>No matching exercises found</h3>
            <p>Try clearing your search query or selecting another category.</p>
          </div>
        `;
        return;
      }
  
      filtered.forEach(ex => {
        const card = document.createElement('div');
        card.className = 'exercise-card tilt-card';
        card.innerHTML = `
          <div>
            <div class="exercise-header">
              <div class="exercise-icon-wrap">${ex.icon || '🏋️'}</div>
              <span class="badge badge-cyan">${ex.difficulty}</span>
            </div>
            <h4 class="exercise-title">${ex.name}</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted);">${(ex.targetMuscles || []).slice(0, 3).join(', ')}</p>
          </div>
          <div class="exercise-meta">
            <span class="meta-pill">Equipment: ${ex.equipment}</span>
            <span class="meta-pill">${ex.defaultDuration ? `${ex.defaultDuration}s` : `${ex.defaultSets} × ${ex.defaultReps}`}</span>
            <span class="meta-pill">Rest: ${ex.restTime}s</span>
          </div>
        `;
  
        card.addEventListener('click', () => {
          this.openExerciseModal(ex);
        });
  
        grid.appendChild(card);
      });
    },
  
    bindLibraryEvents() {
      // Category pill filters
      document.querySelectorAll('#library-category-pills .filter-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
          document.querySelectorAll('#library-category-pills .filter-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          Sound.playClick();
          const cat = pill.dataset.category || 'all';
          const searchInput = document.getElementById('library-search-input');
          const q = searchInput ? searchInput.value : '';
          this.renderLibrary(cat, q);
        });
      });
  
      // Search bar
      const searchInput = document.getElementById('library-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const activePill = document.querySelector('#library-category-pills .filter-pill.active');
          const cat = activePill ? activePill.dataset.category : 'all';
          this.renderLibrary(cat, e.target.value);
        });
      }
    },
  
    openExerciseModal(ex) {
      const modal = document.getElementById('modal-exercise-detail');
      if (!modal) return;
  
      const titleEl = document.getElementById('detail-ex-name');
      const iconEl = document.getElementById('detail-ex-icon');
      const musclesEl = document.getElementById('detail-ex-muscles');
      const equipEl = document.getElementById('detail-ex-equip');
      const diffEl = document.getElementById('detail-ex-diff');
      const stepsList = document.getElementById('detail-ex-steps');
      const tipsEl = document.getElementById('detail-ex-tips');
      const safetyEl = document.getElementById('detail-ex-safety');
  
      if (titleEl) titleEl.textContent = ex.name;
      if (iconEl) iconEl.textContent = ex.icon || '🏋️';
      if (musclesEl) musclesEl.textContent = (ex.targetMuscles || []).join(', ');
      if (equipEl) equipEl.textContent = ex.equipment;
      if (diffEl) diffEl.textContent = ex.difficulty.toUpperCase();
  
      if (stepsList) {
        stepsList.innerHTML = (ex.instructions || []).map(step => `<li>${step}</li>`).join('');
      }
      if (tipsEl) tipsEl.textContent = ex.tips || 'Focus on controlled breathing and full range of motion.';
      if (safetyEl) safetyEl.textContent = ex.safetyNotes || 'Stop immediately if you experience sharp or unusual joint pain.';
  
      Sound.playClick();
      modal.classList.add('active');
    },
  
    // ==========================================
    // QUESTS SCREEN
    // ==========================================
    renderQuestsScreen() {
      const container = document.getElementById('quests-full-list');
      if (!container) return;
  
      const quests = AppState.userData?.dailyQuests?.quests || [];
      container.innerHTML = '';
  
      quests.forEach(q => {
        const item = document.createElement('div');
        item.className = `quest-item ${q.completed ? 'completed' : ''}`;
        item.innerHTML = `
          <div class="quest-left">
            <div class="quest-checkbox">${q.completed ? '✓' : ''}</div>
            <div class="quest-info">
              <span class="quest-title">${q.title}</span>
              <span class="quest-desc">${q.desc}</span>
            </div>
          </div>
          <div class="quest-xp-badge">+${q.xp} XP</div>
        `;
  
        item.addEventListener('click', (e) => {
          const res = QuestEngine.toggleQuest(AppState.userData.dailyQuests, q.id);
          AppState.userData.dailyQuests = res.updatedQuests;
          if (res.xpDelta > 0) {
            AppState.addXp(res.xpDelta, `Completed Quest: ${q.title}`);
            Effects3D.spawnXpFloater(res.xpDelta, e.clientX, e.clientY);
          } else if (res.xpDelta < 0) {
            AppState.userData.xp = Math.max(0, AppState.userData.xp + res.xpDelta);
            AppState.save();
          }
          this.renderQuestsScreen();
          this.updateHeaderStats();
        });
  
        container.appendChild(item);
      });
    },
  
    // ==========================================
    // DIET SCREEN
    // ==========================================
    renderDietScreen() {
      const mode = AppState.userData?.dietPreferences?.mode || 'free';
      const preference = AppState.userData?.dietPreferences?.type || 'vegetarian';
  
      const freeContainer = document.getElementById('diet-free-content');
      const premContainer = document.getElementById('diet-premium-content');
  
      if (mode === 'free') {
        if (freeContainer) freeContainer.style.display = 'block';
        if (premContainer) premContainer.style.display = 'none';
        this.renderMealsGrid(preference);
      } else {
        if (freeContainer) freeContainer.style.display = 'none';
        if (premContainer) premContainer.style.display = 'block';
        this.renderSupplementsGrid();
      }
    },
  
    renderMealsGrid(preference) {
      const grid = document.getElementById('diet-meals-grid');
      if (!grid) return;
  
      const meals = DietEngine.getMeals(preference);
      grid.innerHTML = '';
  
      meals.forEach(m => {
        const card = document.createElement('div');
        card.className = 'meal-card tilt-card';
        card.innerHTML = `
          <div class="meal-time">${m.time}</div>
          <h4 class="meal-title">${m.name}</h4>
          <ul class="food-items-list">
            ${m.items.map(item => `<li class="food-item"><span>🥗</span> ${item}</li>`).join('')}
          </ul>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.75rem;">
            <span class="badge badge-emerald">${m.protein} Protein</span>
            <span class="badge badge-cyan">${m.carbs} Carbs</span>
            <span class="badge badge-orange">${m.fats} Fats</span>
            <span class="badge badge-purple">${m.approxCalories}</span>
          </div>
        `;
        grid.appendChild(card);
      });
    },
  
    renderSupplementsGrid() {
      const grid = document.getElementById('diet-supplements-grid');
      if (!grid) return;
  
      const guide = DietEngine.getSupplementGuide();
      grid.innerHTML = '';
  
      guide.categories.forEach(s => {
        const card = document.createElement('div');
        card.className = 'meal-card tilt-card';
        card.innerHTML = `
          <div class="meal-time">Educational Guidance</div>
          <h4 class="meal-title">${s.name}</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">${s.purpose}</p>
          <div style="font-size: 0.8rem; margin-bottom: 0.5rem;"><strong>Whole Food Sources:</strong> ${s.foodAlternative}</div>
          <div style="font-size: 0.8rem; margin-bottom: 0.5rem;"><strong>Timing:</strong> ${s.timing}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">${s.notes}</div>
        `;
        grid.appendChild(card);
      });
    },
  
    bindDietEvents() {
      // Mode toggles (Free / Homemade vs Educational Supplement)
      document.querySelectorAll('.diet-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.diet-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          Sound.playClick();
          const mode = btn.dataset.dietMode;
          if (AppState.userData?.dietPreferences) {
            AppState.userData.dietPreferences.mode = mode;
            AppState.save();
          }
          this.renderDietScreen();
        });
      });
  
      // Food preference pills (Vegetarian, Non-veg, Vegan)
      document.querySelectorAll('.diet-pref-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.diet-pref-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          Sound.playClick();
          const pref = btn.dataset.dietType;
          if (AppState.userData?.dietPreferences) {
            AppState.userData.dietPreferences.type = pref;
            AppState.save();
          }
          this.renderDietScreen();
        });
      });
    },
  
    // ==========================================
    // ACHIEVEMENTS SCREEN
    // ==========================================
    renderAchievementsScreen() {
      const grid = document.getElementById('achievements-grid');
      if (!grid) return;
  
      const userUnlocked = new Set(AppState.userData?.achievements || []);
      grid.innerHTML = '';
  
      ACHIEVEMENTS.forEach(ach => {
        const isUnlocked = userUnlocked.has(ach.id);
        const card = document.createElement('div');
        card.className = `achievement-card tilt-card ${isUnlocked ? '' : 'locked'}`;
  
        card.innerHTML = `
          <div class="achievement-icon ${isUnlocked ? 'badge-3d-medal' : ''}">${ach.icon}</div>
          <h4 class="achievement-title">${ach.name}</h4>
          <p class="achievement-desc">${ach.desc}</p>
          <span class="badge ${isUnlocked ? 'badge-gold' : 'badge-cyan'}">
            ${isUnlocked ? '✓ UNLOCKED' : `+${ach.xpReward} XP`}
          </span>
        `;
  
        grid.appendChild(card);
      });
    },
  
    // ==========================================
    // PROGRESS & CHARTS SCREEN
    // ==========================================
    renderProgressScreen() {
      const data = AppState.userData || {};
      ProgressCharts.renderWeeklyChart('progress-weekly-chart', data.completedWorkouts || []);
      ProgressCharts.renderXpChart('progress-xp-chart', data.xp || 0);
  
      // Render Measurement log
      const list = document.getElementById('measurements-history-list');
      if (list) {
        list.innerHTML = '';
        const items = (data.measurements || []).slice(-5).reverse();
        if (items.length === 0) {
          list.innerHTML = '<li style="font-size: 0.85rem; color: var(--text-muted); list-style: none;">No body metrics logged yet. Use the form above to record.</li>';
        } else {
          items.forEach(m => {
            const li = document.createElement('li');
            li.style.cssText = 'display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-subtle); font-size: 0.85rem;';
            li.innerHTML = `<span>📅 ${m.date}</span> <strong>${m.weight} kg ${m.waist ? `· ${m.waist} cm waist` : ''}</strong>`;
            list.appendChild(li);
          });
        }
      }
    },
  
    // ==========================================
    // EVENT WIRING
    // ==========================================
    bindAuthEvents() {
      // Toggle Login / Signup forms
      const showSignupBtn = document.getElementById('link-show-signup');
      const showLoginBtn = document.getElementById('link-show-login');
      const loginFormWrap = document.getElementById('auth-login-wrap');
      const signupFormWrap = document.getElementById('auth-signup-wrap');
  
      if (showSignupBtn && showLoginBtn) {
        showSignupBtn.addEventListener('click', (e) => {
          e.preventDefault();
          Sound.playClick();
          if (loginFormWrap) loginFormWrap.style.display = 'none';
          if (signupFormWrap) signupFormWrap.style.display = 'block';
        });
  
        showLoginBtn.addEventListener('click', (e) => {
          e.preventDefault();
          Sound.playClick();
          if (signupFormWrap) signupFormWrap.style.display = 'none';
          if (loginFormWrap) loginFormWrap.style.display = 'block';
        });
      }
  
      // Login Form Submit
      const loginForm = document.getElementById('form-login');
      if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const u = document.getElementById('login-username').value;
          const p = document.getElementById('login-password').value;
          const errEl = document.getElementById('login-error');
  
          const res = Auth.login(u, p);
          if (!res.success) {
            if (errEl) {
              errEl.textContent = res.error;
              errEl.classList.add('active');
            }
          } else {
            if (errEl) errEl.classList.remove('active');
            this.handleSessionState();
          }
        });
      }
  
      // Signup Form Submit
      const signupForm = document.getElementById('form-signup');
      if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('signup-name').value;
          const username = document.getElementById('signup-username').value;
          const email = document.getElementById('signup-email').value;
          const password = document.getElementById('signup-password').value;
          const dob = document.getElementById('signup-dob').value;
          const errEl = document.getElementById('signup-error');
  
          const res = Auth.signup({ name, username, email, password, dob });
          if (!res.success) {
            if (errEl) {
              errEl.textContent = res.error;
              errEl.classList.add('active');
            }
          } else {
            if (errEl) errEl.classList.remove('active');
            // Move directly to Fitness Onboarding wizard!
            Navigation.showScreen('screen-onboarding', true);
          }
        });
      }
  
      // Onboarding Wizard Buttons
      const onbNextBtn = document.getElementById('onboarding-next-btn');
      const onbPrevBtn = document.getElementById('onboarding-prev-btn');
  
      if (onbNextBtn) {
        onbNextBtn.addEventListener('click', () => {
          if (Onboarding.currentStep === Onboarding.totalSteps) {
            Onboarding.finishOnboarding(() => {
              this.handleSessionState();
            });
          } else {
            Onboarding.nextStep();
          }
        });
      }
  
      if (onbPrevBtn) {
        onbPrevBtn.addEventListener('click', () => {
          Onboarding.prevStep();
        });
      }
    },
  
    bindWorkoutRunnerEvents() {
      // Complete Set Button
      const completeSetBtn = document.getElementById('btn-runner-complete-set');
      if (completeSetBtn) {
        completeSetBtn.addEventListener('click', () => {
          WorkoutRunner.completeSet();
        });
      }
  
      // Rest Timer Controls
      const pauseTimerBtn = document.getElementById('btn-timer-pause');
      const skipTimerBtn = document.getElementById('btn-timer-skip');
      const add15Btn = document.getElementById('btn-timer-add15');
  
      if (pauseTimerBtn) {
        pauseTimerBtn.addEventListener('click', () => {
          if (WorkoutRunner.restTimer.isRunning) {
            WorkoutRunner.pauseRestTimer();
            pauseTimerBtn.textContent = '▶ Resume';
          } else {
            WorkoutRunner.resumeRestTimer();
            pauseTimerBtn.textContent = '⏸ Pause';
          }
        });
      }
  
      if (skipTimerBtn) {
        skipTimerBtn.addEventListener('click', () => {
          WorkoutRunner.skipRestTimer();
        });
      }
  
      if (add15Btn) {
        add15Btn.addEventListener('click', () => {
          WorkoutRunner.addRestTime(15);
        });
      }
  
      // Finish Early
      const finishEarlyBtn = document.getElementById('btn-runner-finish-early');
      if (finishEarlyBtn) {
        finishEarlyBtn.addEventListener('click', () => {
          if (confirm('Finish this workout now and record your progress?')) {
            WorkoutRunner.finishWorkout();
          }
        });
      }
  
      // Workout Complete Modal Close -> Return to dashboard
      const completeModalClose = document.getElementById('btn-complete-modal-close');
      if (completeModalClose) {
        completeModalClose.addEventListener('click', () => {
          const modal = document.getElementById('modal-workout-complete');
          if (modal) modal.classList.remove('active');
          Navigation.showScreen('screen-dashboard', true);
        });
      }
    },
  
    bindModalEvents() {
      // Generic modal close buttons
      document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          Sound.playClick();
          const overlay = btn.closest('.modal-overlay');
          if (overlay) overlay.classList.remove('active');
        });
      });
  
      // Close when clicking overlay backdrop
      document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            overlay.classList.remove('active');
          }
        });
      });
  
      // Level up modal dismiss
      const levelUpDismiss = document.getElementById('btn-level-up-dismiss');
      if (levelUpDismiss) {
        levelUpDismiss.addEventListener('click', () => {
          const modal = document.getElementById('modal-level-up');
          if (modal) modal.classList.remove('active');
        });
      }
    },
  
    bindProfileEvents() {
      // Measurement logging form
      const formMetric = document.getElementById('form-log-metric');
      if (formMetric) {
        formMetric.addEventListener('submit', (e) => {
          e.preventDefault();
          const weight = parseFloat(document.getElementById('metric-weight').value);
          const waist = parseFloat(document.getElementById('metric-waist').value) || null;
  
          if (!weight || weight <= 0) return;
  
          if (!Array.isArray(AppState.userData.measurements)) {
            AppState.userData.measurements = [];
          }
  
          AppState.userData.measurements.push({
            date: StreakEngine.getTodayString(),
            weight,
            waist
          });
  
          AppState.addXp(35, 'Logged Body Measurement');
          AppState.save();
          formMetric.reset();
          this.renderProgressScreen();
        });
      }
  
      // Settings listeners
      const soundToggle = document.getElementById('setting-sound-toggle');
      const animToggle = document.getElementById('setting-anim-toggle');
      const motionToggle = document.getElementById('setting-motion-toggle');
  
      if (soundToggle) {
        soundToggle.addEventListener('change', (e) => {
          Profile.saveSettings({ sound: e.target.checked });
        });
      }
  
      if (animToggle) {
        animToggle.addEventListener('change', (e) => {
          Profile.saveSettings({ animations: e.target.checked });
        });
      }
  
      if (motionToggle) {
        motionToggle.addEventListener('change', (e) => {
          Profile.saveSettings({ reducedMotion: e.target.checked });
          document.body.classList.toggle('prefers-reduced-motion', e.target.checked);
        });
      }
  
      // Reset Data with double confirmation
      const resetBtn = document.getElementById('btn-reset-progress');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          const confirmed = confirm('Are you sure? Resetting your progress will remove your workout history, XP, streaks and achievements from this browser.');
          if (confirmed) {
            AppState.resetData();
            Sound.playClick();
            Toast.show({
              title: 'Progress Reset',
              message: 'Your fitness journey has been refreshed to Day 1.',
              icon: '🔄',
              type: 'info'
            });
            this.handleSessionState();
          }
        });
      }
  
      // Logout button
      const logoutBtn = document.getElementById('btn-profile-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          Auth.logout();
        });
      }
    }
  };
  
  // Bootstrap application on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
  

})();
