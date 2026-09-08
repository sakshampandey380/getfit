/**
 * FITQUEST AUTHENTICATION SYSTEM
 * Frontend multi-user signup, login, validation, and session management
 */

import { Storage } from './storage.js';
import { AppState } from './state.js';
import { Toast } from './notifications.js';
import { Sound } from './audio.js';
import { WorkoutEngine } from './workout-engine.js';
import { StreakEngine } from './streak.js';

export const Auth = {
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
