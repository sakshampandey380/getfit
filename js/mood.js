/**
 * FITQUEST MOOD & ENERGY SYSTEM
 * Pre-workout energy check-in that adapts session intensity and offers restorative alternatives
 */

export const MOODS = [
  { id: 'fire', label: 'Extremely Energetic', icon: '🔥', modifier: 'intense', desc: 'Ready to crush personal bests and maximum intensity.' },
  { id: 'motivated', label: 'Motivated', icon: '💪', modifier: 'full', desc: 'Ready to perform the complete planned routine.' },
  { id: 'good', label: 'Good', icon: '😊', modifier: 'standard', desc: 'Solid energy for a consistent, productive session.' },
  { id: 'normal', label: 'Normal', icon: '😐', modifier: 'standard', desc: 'Baseline energy; showing up and building the habit.' },
  { id: 'tired', label: 'Tired', icon: '😴', modifier: 'light', desc: 'Lower energy; consider reduced sets or active stretching.' },
  { id: 'low_energy', label: 'Low Energy', icon: '😔', modifier: 'recovery', desc: 'Honoring recovery; recommend light mobility and restorative movement.' }
];

export const MoodEngine = {
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
