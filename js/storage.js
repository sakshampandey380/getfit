/**
 * FITQUEST STORAGE SYSTEM
 * Multi-user localStorage isolation, safe parsing, schema migrations
 */

const STORAGE_KEYS = {
  USERS: 'fitquest_users_v1',
  ACTIVE_USER: 'fitquest_active_user_v1',
  USER_DATA_PREFIX: 'fitquest_user_data_'
};

export const Storage = {
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
