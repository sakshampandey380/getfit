/**
 * FITQUEST FITNESS STREAK SYSTEM
 * Tracks daily consistency, longest streaks, and delivers supportive, non-shaming comeback encouragement
 */

export const StreakEngine = {
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
