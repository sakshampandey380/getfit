/**
 * FITQUEST MULTI-STEP ONBOARDING WIZARD
 * Collects fitness profile, goal, time commitment, equipment, and synthesizes customized journey
 */

import { AppState } from './state.js';
import { WorkoutEngine } from './workout-engine.js';
import { Sound } from './audio.js';
import { Effects3D } from './3d-effects.js';
import { Navigation } from './navigation.js';
import { Toast } from './notifications.js';

export const Onboarding = {
  currentStep: 1,
  totalSteps: 5,
  formData: {
    experience: 'beginner',
    activityLevel: 'moderate',
    goal: 'general_fitness',
    duration: 30,
    daysPerWeek: 3,
    equipment: ['bodyweight'],
    preferredTime: 'morning'
  },

  init() {
    this.currentStep = 1;
    this.bindChoiceCards();
  },

  bindChoiceCards() {
    // Single choice groups
    document.querySelectorAll('.choice-group-single').forEach(group => {
      const field = group.dataset.field;
      group.querySelectorAll('.choice-card').forEach(card => {
        card.addEventListener('click', () => {
          group.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          Sound.playClick();
          const val = card.dataset.value;
          this.formData[field] = val;
        });
      });
    });

    // Multi-select equipment cards
    document.querySelectorAll('.equipment-multi-group .choice-card').forEach(card => {
      card.addEventListener('click', () => {
        const val = card.dataset.value;
        Sound.playClick();

        if (val === 'bodyweight') {
          // If no equipment clicked, deselect everything else
          document.querySelectorAll('.equipment-multi-group .choice-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.formData.equipment = ['bodyweight'];
          return;
        }

        // Uncheck bodyweight if other equipment chosen
        const bodyweightCard = document.querySelector('.equipment-multi-group .choice-card[data-value="bodyweight"]');
        if (bodyweightCard) bodyweightCard.classList.remove('selected');

        card.classList.toggle('selected');

        const selected = Array.from(document.querySelectorAll('.equipment-multi-group .choice-card.selected'))
          .map(c => c.dataset.value);

        this.formData.equipment = selected.length > 0 ? selected : ['bodyweight'];
        if (selected.length === 0 && bodyweightCard) {
          bodyweightCard.classList.add('selected');
        }
      });
    });
  },

  goToStep(step) {
    if (step < 1 || step > this.totalSteps) return;
    this.currentStep = step;
    Sound.playClick();

    // Update Indicators
    for (let i = 1; i <= this.totalSteps; i++) {
      const ind = document.getElementById(`step-ind-${i}`);
      const pane = document.getElementById(`onboarding-step-${i}`);

      if (ind) {
        ind.classList.remove('active', 'completed');
        if (i < step) ind.classList.add('completed');
        else if (i === step) ind.classList.add('active');
      }

      if (pane) {
        pane.classList.remove('active');
        if (i === step) pane.classList.add('active');
      }
    }

    // Dynamic button label & styles for Step 5
    const nextBtn = document.getElementById('onboarding-next-btn');
    const prevBtn = document.getElementById('onboarding-prev-btn');

    if (nextBtn) {
      if (step === this.totalSteps) {
        nextBtn.innerHTML = '⚡ Generate My Workout Schedule →';
        nextBtn.classList.remove('btn-3d-emerald');
        nextBtn.classList.add('btn-3d-fire');
      } else {
        nextBtn.innerHTML = 'Continue →';
        nextBtn.classList.remove('btn-3d-fire');
        nextBtn.classList.add('btn-3d-emerald');
      }
    }

    if (prevBtn) {
      prevBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
    }
  },

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.goToStep(this.currentStep + 1);
    } else {
      this.finishOnboarding();
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
  },

  /**
   * Finalize and generate customized training plan in the shortest possible time
   */
  finishOnboarding(onSuccess) {
    const loadingPane = document.getElementById('onboarding-step-loading');
    const stepPanes = document.querySelectorAll('.onboarding-step-pane');
    const footerControls = document.getElementById('onboarding-footer-controls');

    stepPanes.forEach(p => p.classList.remove('active'));
    if (footerControls) footerControls.style.display = 'none';
    if (loadingPane) loadingPane.classList.add('active');

    // Ensure active user exists even if onboarding directly
    if (!AppState.isLoggedIn()) {
      const guestAthlete = {
        name: 'Champion Athlete',
        username: 'athlete_' + Math.floor(1000 + Math.random() * 9000),
        email: 'athlete@fitquest.app',
        dob: '2000-01-01'
      };
      AppState.setUser(guestAthlete, true);
    }

    // Generate customized workout plan immediately
    const plan = WorkoutEngine.generatePlan(this.formData);

    AppState.userData.profile = {
      ...AppState.userData.profile,
      ...this.formData
    };
    AppState.userData.workoutPlan = plan;
    AppState.addXp(100, 'Synthesized Custom Workout Schedule');
    AppState.save();

    // Fast, crisp 250ms feedback pulse, then immediate dashboard transition
    setTimeout(() => {
      if (loadingPane) loadingPane.classList.remove('active');
      if (footerControls) footerControls.style.display = 'flex';
      this.goToStep(1); // Reset wizard state

      Sound.playLevelUp();
      Effects3D.spawnCelebration(2000);

      // Force route directly to dashboard
      window.location.hash = '#dashboard';
      Navigation.showScreen('screen-dashboard', true);

      Toast.show({
        title: '🔥 Schedule Generated!',
        message: `${plan.splitName} with ${plan.daysPerWeek} training days is ready.`,
        icon: '⚡',
        type: 'success'
      });

      if (typeof onSuccess === 'function') {
        onSuccess(plan);
      }
    }, 250);
  }
};
