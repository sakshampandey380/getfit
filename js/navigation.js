/**
 * FITQUEST NAVIGATION & 3D SPATIAL SCREEN ROUTER
 * Seamless transitions between application views, hash route syncing, and mobile bottom bar management
 */

import { Sound } from './audio.js';
import { AppState } from './state.js';
import { Auth } from './auth.js';

export const Navigation = {
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
        this.showScreen(`screen-${hash}`, false);
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
      this.showScreen('screen-dashboard', true);
      return;
    }

    if (screenKey === 'signup') {
      Sound.playClick();
      this.showScreen('screen-auth', true);
      const loginWrap = document.getElementById('auth-login-wrap');
      const signupWrap = document.getElementById('auth-signup-wrap');
      if (loginWrap) loginWrap.style.display = 'none';
      if (signupWrap) signupWrap.style.display = 'block';
      return;
    }

    if (screenKey === 'login') {
      Sound.playClick();
      this.showScreen('screen-auth', true);
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
      this.showScreen('screen-auth', true);
      return;
    }

    Sound.playClick();
    this.showScreen(screenId, true);
  },

  requiresAuth(screenId) {
    const publicScreens = ['screen-landing', 'screen-auth', 'screen-onboarding', 'screen-library', 'screen-diet', 'screen-height'];
    return !publicScreens.includes(screenId);
  },

  showScreen(targetId, updateHash = true) {
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

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
