/**
 * FITQUEST LEVEL & PROGRESSION ENGINE
 * 10 Progressive Fitness Tiers with unlocking thresholds, titles, and rewards
 */

export const LEVELS = [
  {
    level: 1,
    title: 'Beginning',
    rank: 'Initiate',
    badge: '🌱',
    xpRequired: 0,
    description: 'Every great journey starts with a single rep. Welcome to the path.',
    perk: 'Unlocked Basic Daily Quests & Calisthenics Library'
  },
  {
    level: 2,
    title: 'Consistency',
    rank: 'Seeker',
    badge: '⚡',
    xpRequired: 300,
    description: 'You are showing up when it counts. Habits are starting to form.',
    perk: 'Unlocked Rest Timer Custom Intervals'
  },
  {
    level: 3,
    title: 'Foundation',
    rank: 'Builder',
    badge: '🧱',
    xpRequired: 750,
    description: 'Your body is adapting. Core strength and baseline stamina are established.',
    perk: 'Unlocked Homemade Nutrition Macro Breakdown'
  },
  {
    level: 4,
    title: 'Builder',
    rank: 'Adept',
    badge: '🔨',
    xpRequired: 1400,
    description: 'Visible muscle tone and strength increases are now taking place.',
    perk: 'Unlocked Intermediate Dumbbell & Resistance Splits'
  },
  {
    level: 5,
    title: 'Stronger',
    rank: 'Warrior',
    badge: '🛡️',
    xpRequired: 2200,
    description: 'Halfway through the foundation tiers. Your discipline is unwavering.',
    perk: 'Unlocked Advanced 3D Gold Badge & Custom Avatar'
  },
  {
    level: 6,
    title: 'Discipline',
    rank: 'Champion',
    badge: '⚔️',
    xpRequired: 3200,
    description: 'Workouts are no longer a chore; they are an essential part of your identity.',
    perk: 'Unlocked High-Intensity Cardio Protocols'
  },
  {
    level: 7,
    title: 'Athlete',
    rank: 'Vanguard',
    badge: '🔥',
    xpRequired: 4500,
    description: 'High work capacity, rapid recovery, and balanced athletic capability.',
    perk: 'Unlocked Athletic Mobility Sequences'
  },
  {
    level: 8,
    title: 'Advanced',
    rank: 'Master',
    badge: '💎',
    xpRequired: 6000,
    description: 'Your physical benchmarks and dedication put you in the top tier.',
    perk: 'Unlocked Educational Supplement Optimization Guide'
  },
  {
    level: 9,
    title: 'Elite',
    rank: 'Grandmaster',
    badge: '👑',
    xpRequired: 8000,
    description: 'Mastery over mind and body. You inspire everyone around you.',
    perk: 'Unlocked Elite Challenge Quests'
  },
  {
    level: 10,
    title: 'Transformation',
    rank: 'Titan',
    badge: '🏆',
    xpRequired: 10500,
    description: 'Total physical and mental transformation achieved. A true titan of fitness.',
    perk: 'Titan Status & Lifetime Gamified Mastery Badge'
  }
];

export const LevelEngine = {
  /**
   * Determine current level from total XP
   */
  calculateLevel(xp = 0) {
    let current = LEVELS[0];
    for (const lvl of LEVELS) {
      if (xp >= lvl.xpRequired) {
        current = lvl;
      } else {
        break;
      }
    }
    return current;
  },

  /**
   * Get level metadata by level number
   */
  getLevel(levelNum) {
    return LEVELS.find(l => l.level === levelNum) || LEVELS[0];
  },

  /**
   * Calculate detailed progression to next level
   */
  getProgress(xp = 0) {
    const currentLevel = this.calculateLevel(xp);
    const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1) || null;

    if (!nextLevel) {
      // Max level reached
      return {
        currentLevel,
        nextLevel: null,
        percent: 100,
        currentLevelXp: xp - currentLevel.xpRequired,
        xpToNext: 0,
        totalRequired: 0
      };
    }

    const range = nextLevel.xpRequired - currentLevel.xpRequired;
    const progressInLevel = Math.max(0, xp - currentLevel.xpRequired);
    const percent = Math.min(100, Math.round((progressInLevel / range) * 100));
    const xpToNext = nextLevel.xpRequired - xp;

    return {
      currentLevel,
      nextLevel,
      percent,
      currentLevelXp: progressInLevel,
      xpToNext,
      totalRequired: range
    };
  }
};
