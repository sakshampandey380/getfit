/**
 * FITQUEST WORKOUT GENERATION ENGINE
 * Intelligently generates personalized training splits based on goal, experience,
 * equipment constraints, available time, and weekly training days.
 */

import { EXERCISES } from './exercises.js';

export const WorkoutEngine = {
  /**
   * Main generator function
   */
  generatePlan(profile = {}) {
    const goal = profile.goal || 'general_fitness';
    const experience = profile.experience || 'beginner';
    const duration = parseInt(profile.duration, 10) || 30;
    const daysPerWeek = parseInt(profile.daysPerWeek, 10) || 3;
    const selectedEquipment = Array.isArray(profile.equipment) ? profile.equipment : ['bodyweight'];
    const hasOnlyBodyweight = selectedEquipment.length === 0 || (selectedEquipment.length === 1 && selectedEquipment[0] === 'bodyweight');

    // Filter exercises matching available equipment
    const availablePool = EXERCISES.filter(ex => {
      if (hasOnlyBodyweight) {
        return ex.equipment === 'bodyweight';
      }
      return ex.equipment === 'bodyweight' || selectedEquipment.includes(ex.equipment);
    });

    // Number of exercises per session based on duration
    let exerciseCount = 4;
    if (duration <= 15) exerciseCount = 3;
    else if (duration <= 30) exerciseCount = 4;
    else if (duration <= 45) exerciseCount = 5;
    else exerciseCount = 6;

    // Determine weekly split strategy
    let splitName = 'Full Body Conditioning';
    let routineDays = [];

    if (daysPerWeek <= 3) {
      splitName = 'Full Body Foundational Split';
      routineDays = [
        { day: 1, title: 'Full Body Power', focus: 'Chest, Legs & Core', categories: ['chest', 'legs', 'core', 'mobility'] },
        { day: 2, title: 'Full Body Sculpt', focus: 'Back, Shoulders & Arms', categories: ['back', 'shoulders', 'arms', 'core'] },
        { day: 3, title: 'Full Body Athletic Engine', focus: 'Legs, Chest & Cardio', categories: ['legs', 'chest', 'cardio', 'mobility'] }
      ];
    } else if (daysPerWeek === 4) {
      splitName = 'Upper / Lower Power Split';
      routineDays = [
        { day: 1, title: 'Upper Body Alpha', focus: 'Chest, Back & Arms', categories: ['chest', 'back', 'arms', 'core'] },
        { day: 2, title: 'Lower Body Drive', focus: 'Quads, Hamstrings & Calves', categories: ['legs', 'legs', 'core', 'mobility'] },
        { day: 3, title: 'Upper Body Hypertrophy', focus: 'Shoulders, Lats & Triceps', categories: ['shoulders', 'back', 'arms', 'core'] },
        { day: 4, title: 'Lower Body & Conditioning', focus: 'Glutes, Mobility & Cardio', categories: ['legs', 'cardio', 'core', 'mobility'] }
      ];
    } else {
      splitName = 'Push / Pull / Legs Athletic Split';
      routineDays = [
        { day: 1, title: 'Push Focus', focus: 'Chest, Shoulders & Triceps', categories: ['chest', 'shoulders', 'arms', 'core'] },
        { day: 2, title: 'Pull Focus', focus: 'Back, Rear Delts & Biceps', categories: ['back', 'back', 'arms', 'core'] },
        { day: 3, title: 'Legs & Core Drive', focus: 'Quads, Hamstrings & Calves', categories: ['legs', 'legs', 'core', 'mobility'] },
        { day: 4, title: 'Upper Body Synergy', focus: 'Chest, Back & Shoulders', categories: ['chest', 'back', 'shoulders', 'arms'] },
        { day: 5, title: 'Full Athletic Performance', focus: 'Legs, Cardio & Core', categories: ['legs', 'cardio', 'core', 'mobility'] }
      ];
    }

    // Populate each day with specific exercises matching categories
    const schedule = routineDays.slice(0, daysPerWeek).map((dayTemplate, dayIdx) => {
      const dayExercises = [];
      const usedIds = new Set();

      dayTemplate.categories.forEach(cat => {
        if (dayExercises.length >= exerciseCount) return;
        const matching = availablePool.filter(ex => ex.category === cat && !usedIds.has(ex.id));
        if (matching.length > 0) {
          // Select exercise matching difficulty if possible
          const diffMatch = matching.find(ex => ex.difficulty === experience) || matching[0];
          dayExercises.push(diffMatch);
          usedIds.add(diffMatch.id);
        }
      });

      // Fill remaining if needed
      while (dayExercises.length < exerciseCount && availablePool.length > usedIds.size) {
        const remaining = availablePool.filter(ex => !usedIds.has(ex.id));
        if (remaining.length === 0) break;
        const pick = remaining[Math.floor(Math.random() * remaining.length)];
        dayExercises.push(pick);
        usedIds.add(pick.id);
      }

      // Customize sets & reps based on goal
      const customizedExercises = dayExercises.map(ex => {
        let sets = ex.defaultSets || 3;
        let reps = ex.defaultReps || 12;
        let restTime = ex.restTime || 60;

        if (goal === 'strength' || goal === 'build_muscle') {
          if (reps && reps > 10) reps = 10;
          restTime = Math.min(90, restTime + 15);
        } else if (goal === 'endurance' || goal === 'lose_fat') {
          if (reps) reps = Math.min(20, reps + 2);
          restTime = Math.max(30, restTime - 15);
        }

        return {
          ...ex,
          targetSets: sets,
          targetReps: reps,
          targetRest: restTime
        };
      });

      return {
        dayNumber: dayIdx + 1,
        title: dayTemplate.title,
        focus: dayTemplate.focus,
        estimatedMinutes: duration,
        difficulty: experience,
        exercises: customizedExercises
      };
    });

    return {
      generatedAt: new Date().toISOString(),
      splitName,
      goal,
      experience,
      duration,
      daysPerWeek,
      schedule
    };
  }
};
