/**
 * FITQUEST CENTRAL REACTIVE STATE MANAGER
 * Manages active user session, level progression triggers, achievement monitors, and storage sync
 */

import { Storage } from './storage.js';
import { LevelEngine } from './levels.js';
import { AchievementEngine } from './achievements.js';
import { StreakEngine } from './streak.js';
import { QuestEngine } from './quests.js';
import { Toast } from './notifications.js';
import { Sound } from './audio.js';
import { Effects3D } from './3d-effects.js';

export const AppState = {
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
