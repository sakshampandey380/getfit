/**
 * FITQUEST DAILY QUEST SYSTEM
 * Generates fresh daily quests every morning, tracks completion, awards XP with 3D animations
 */

import { StreakEngine } from './streak.js';

export const QUEST_POOL = [
  {
    id: 'warmup',
    title: 'Dynamic Warm-up',
    desc: 'Perform 5 minutes of dynamic stretches before training.',
    xp: 40,
    icon: '🤸'
  },
  {
    id: 'workout',
    title: "Conquer Today's Workout",
    desc: 'Finish all prescribed sets in your daily workout session.',
    xp: 75,
    icon: '🏋️'
  },
  {
    id: 'water',
    title: 'Hydration Target (2.5L)',
    desc: 'Keep muscles energized by drinking at least 2.5 liters of clean water.',
    xp: 35,
    icon: '💧'
  },
  {
    id: 'mobility',
    title: '10-Min Mobility Routine',
    desc: 'Unlock tight joints with dedicated mobility or yoga stretching.',
    xp: 50,
    icon: '🧘'
  },
  {
    id: 'walk',
    title: 'Daily Movement Walk',
    desc: 'Take a brisk 20-minute outdoor or treadmill walk for active recovery.',
    xp: 45,
    icon: '👟'
  },
  {
    id: 'log_progress',
    title: 'Log Training Progress',
    desc: 'Record how your body felt or update an optional fitness metric.',
    xp: 35,
    icon: '📝'
  },
  {
    id: 'bonus_pushups',
    title: 'Titan Challenge: 20 Bonus Push-ups',
    desc: 'Perform 20 extra push-ups anytime during the day to test endurance.',
    xp: 60,
    icon: '⚡'
  }
];

export const QuestEngine = {
  /**
   * Ensure user has quests for today's date; regenerates if new day
   */
  ensureQuestsForToday(currentDailyQuests = {}) {
    const today = StreakEngine.getTodayString();

    if (currentDailyQuests && currentDailyQuests.date === today && Array.isArray(currentDailyQuests.quests) && currentDailyQuests.quests.length > 0) {
      return currentDailyQuests;
    }

    // New day or first time: generate today's quest list
    const quests = QUEST_POOL.map(q => ({
      id: q.id,
      title: q.title,
      desc: q.desc,
      xp: q.xp,
      icon: q.icon,
      completed: false,
      completedAt: null
    }));

    return {
      date: today,
      quests
    };
  },

  /**
   * Toggle a quest completion state
   * Returns { updatedQuests, xpDelta, quest }
   */
  toggleQuest(currentDailyQuests, questId) {
    const today = StreakEngine.getTodayString();
    const questsObj = this.ensureQuestsForToday(currentDailyQuests);
    const target = questsObj.quests.find(q => q.id === questId);

    if (!target) return { updatedQuests: questsObj, xpDelta: 0, quest: null };

    target.completed = !target.completed;
    target.completedAt = target.completed ? new Date().toISOString() : null;

    const xpDelta = target.completed ? target.xp : -target.xp;

    return {
      updatedQuests: questsObj,
      xpDelta,
      quest: target
    };
  }
};
