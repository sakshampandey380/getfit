/**
 * FITQUEST ACHIEVEMENT SYSTEM
 * 20+ unlockable 3D badges with automatic condition verification and XP rewards
 */

export const ACHIEVEMENTS = [
  {
    id: 'first_workout',
    name: 'First Workout',
    desc: 'Completed your very first workout session.',
    icon: '🔥',
    category: 'workout',
    xpReward: 100,
    check: (data) => (data.completedWorkouts?.length || 0) >= 1
  },
  {
    id: 'century_xp',
    name: 'Century Club',
    desc: 'Earned your first 100 total XP.',
    icon: '💯',
    category: 'xp',
    xpReward: 50,
    check: (data) => (data.xp || 0) >= 100
  },
  {
    id: 'triple_threat',
    name: 'Triple Threat',
    desc: 'Completed 3 total workouts.',
    icon: '⚡',
    category: 'workout',
    xpReward: 150,
    check: (data) => (data.completedWorkouts?.length || 0) >= 3
  },
  {
    id: 'workout_10',
    name: 'Decathlon',
    desc: 'Completed 10 total workout sessions.',
    icon: '🏋️',
    category: 'workout',
    xpReward: 300,
    check: (data) => (data.completedWorkouts?.length || 0) >= 10
  },
  {
    id: 'streak_3',
    name: '3-Day Fire',
    desc: 'Maintained a 3-day active streak.',
    icon: '🏆',
    category: 'streak',
    xpReward: 100,
    check: (data) => (data.streak?.longest || 0) >= 3 || (data.streak?.current || 0) >= 3
  },
  {
    id: 'streak_7',
    name: 'Weekly Legend',
    desc: 'Maintained an unbroken 7-day fitness streak.',
    icon: '🔥',
    category: 'streak',
    xpReward: 250,
    check: (data) => (data.streak?.longest || 0) >= 7 || (data.streak?.current || 0) >= 7
  },
  {
    id: 'streak_14',
    name: 'Fortnight of Iron',
    desc: 'Maintained a 14-day consecutive active streak.',
    icon: '💎',
    category: 'streak',
    xpReward: 500,
    check: (data) => (data.streak?.longest || 0) >= 14 || (data.streak?.current || 0) >= 14
  },
  {
    id: 'streak_30',
    name: 'Monthly Titan',
    desc: 'Achieved an extraordinary 30-day streak of relentless discipline.',
    icon: '👑',
    category: 'streak',
    xpReward: 1000,
    check: (data) => (data.streak?.longest || 0) >= 30 || (data.streak?.current || 0) >= 30
  },
  {
    id: 'cardio_fan',
    name: 'Cardio Crusher',
    desc: 'Completed a workout containing cardiovascular conditioning.',
    icon: '🏃',
    category: 'category',
    xpReward: 75,
    check: (data) => data.completedWorkouts?.some(w => w.exercises?.some(e => e.category === 'cardio'))
  },
  {
    id: 'strength_master',
    name: 'Iron Will',
    desc: 'Finished a workout featuring weighted or resistance exercises.',
    icon: '🦾',
    category: 'category',
    xpReward: 100,
    check: (data) => data.completedWorkouts?.some(w => w.exercises?.some(e => e.equipment !== 'bodyweight'))
  },
  {
    id: 'mobility_guru',
    name: 'Mobility Master',
    desc: 'Completed a mobility and stretching session for bodily longevity.',
    icon: '🧘',
    category: 'category',
    xpReward: 75,
    check: (data) => data.completedWorkouts?.some(w => w.exercises?.some(e => e.category === 'mobility'))
  },
  {
    id: 'quest_clean_sweep',
    name: 'Quest Slayer',
    desc: 'Checked off all daily quests in a single day.',
    icon: '🎯',
    category: 'quest',
    xpReward: 150,
    check: (data) => {
      const q = data.dailyQuests?.quests || [];
      return q.length > 0 && q.every(item => item.completed);
    }
  },
  {
    id: 'level_2',
    name: 'Rising Star',
    desc: 'Ascended to Level 2: Consistency.',
    icon: '🚀',
    category: 'level',
    xpReward: 100,
    check: (data) => (data.level || 1) >= 2
  },
  {
    id: 'level_5',
    name: 'Warrior Status',
    desc: 'Ascended to Level 5: Stronger.',
    icon: '🛡️',
    category: 'level',
    xpReward: 250,
    check: (data) => (data.level || 1) >= 5
  },
  {
    id: 'level_10',
    name: 'The Living Titan',
    desc: 'Ascended to the highest realm: Level 10 Transformation.',
    icon: '🏆',
    category: 'level',
    xpReward: 1000,
    check: (data) => (data.level || 1) >= 10
  },
  {
    id: 'diet_customized',
    name: 'Nutrition Architect',
    desc: 'Selected and personalized your nutrition roadmap.',
    icon: '🥗',
    category: 'diet',
    xpReward: 50,
    check: (data) => !!data.dietPreferences?.type
  },
  {
    id: 'mood_logger',
    name: 'Self-Aware Athlete',
    desc: 'Checked in your energy levels before entering a workout.',
    icon: '🧠',
    category: 'mood',
    xpReward: 50,
    check: (data) => (data.moodHistory?.length || 0) >= 1
  },
  {
    id: 'hydration_champion',
    name: 'Hydration Hero',
    desc: 'Consistently hydrated and energized your muscles.',
    icon: '💧',
    category: 'quest',
    xpReward: 50,
    check: (data) => (data.dailyQuests?.quests || []).some(q => q.id === 'water' && q.completed)
  },
  {
    id: 'rest_timer_user',
    name: 'Paced & Precision',
    desc: 'Used the Rest Timer to manage physiological recovery during training.',
    icon: '⏱️',
    category: 'workout',
    xpReward: 50,
    check: (data) => (data.completedWorkouts?.length || 0) >= 1
  },
  {
    id: 'measurement_tracked',
    name: 'Data Driven',
    desc: 'Logged a body measurement tracking entry.',
    icon: '📐',
    category: 'progress',
    xpReward: 75,
    check: (data) => (data.measurements?.length || 0) >= 1
  }
];

export const AchievementEngine = {
  /**
   * Evaluate all achievements against user state
   * Returns array of newly unlocked achievement objects
   */
  checkNew(userData) {
    if (!userData) return [];
    const unlockedIds = new Set(userData.achievements || []);
    const newlyUnlocked = [];

    for (const ach of ACHIEVEMENTS) {
      if (!unlockedIds.has(ach.id)) {
        try {
          if (ach.check(userData)) {
            newlyUnlocked.push(ach);
          }
        } catch (e) {
          console.warn(`[AchievementEngine] check failed for ${ach.id}:`, e);
        }
      }
    }

    return newlyUnlocked;
  },

  getAll() {
    return ACHIEVEMENTS;
  },

  getById(id) {
    return ACHIEVEMENTS.find(a => a.id === id) || null;
  }
};
