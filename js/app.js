/**
 * FITQUEST MASTER APPLICATION COORDINATOR
 * Connects reactive state, 3D visual engine, active workout runner, gamification, and UI rendering
 */

import { AppState } from './state.js';
import { Auth } from './auth.js';
import { Effects3D } from './3d-effects.js';
import { Sound } from './audio.js';
import { Navigation } from './navigation.js';
import { Onboarding } from './onboarding.js';
import { EXERCISES, ExerciseHelper } from './exercises.js';
import { WorkoutRunner } from './workout-runner.js';
import { QuestEngine } from './quests.js';
import { LevelEngine } from './levels.js';
import { ACHIEVEMENTS } from './achievements.js';
import { StreakEngine } from './streak.js';
import { MoodEngine } from './mood.js';
import { DietEngine } from './diet.js';
import { ProgressCharts } from './progress.js';
import { Profile } from './profile.js';
import { Motivational } from './motivational.js';
import { Toast } from './notifications.js';
import { HeightGrowth } from './height-growth.js';

export const App = {
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
