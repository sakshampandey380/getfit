/**
 * FITQUEST WORKOUT RUNNER & REST TIMER
 * Active workout execution player, drift-free rest timer with SVG radial countdown,
 * set completions, and celebration modal ceremony.
 */

import { Sound } from './audio.js';
import { Effects3D } from './3d-effects.js';
import { Motivational } from './motivational.js';

export const WorkoutRunner = {
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
