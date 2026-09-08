/**
 * FITQUEST 3D IN-APP NOTIFICATION SYSTEM
 * Stackable, dimensional toast notifications with automatic dismiss and sound alerts
 */

import { Sound } from './audio.js';

export const Toast = {
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
