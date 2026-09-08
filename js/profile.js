/**
 * FITQUEST PROFILE & SETTINGS MODULE
 * User statistics, avatar selection, settings toggles (audio, animations), and safe reset confirmation
 */

import { AppState } from './state.js';
import { LevelEngine } from './levels.js';
import { Sound } from './audio.js';
import { Effects3D } from './3d-effects.js';
import { Toast } from './notifications.js';

export const Profile = {
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
