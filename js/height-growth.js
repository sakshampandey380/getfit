/**
 * FITQUEST HEIGHT GROWTH & SPINAL ALIGNMENT ENGINE
 * Comprehensive science, endocrinology, epiphyseal plate facts, growth-stunting habits (demerits),
 * nutrition, specialized yoga asanas, decompression exercises, and interactive roadmap generator.
 */

import { AppState } from './state.js';
import { Sound } from './audio.js';
import { Navigation } from './navigation.js';
import { WorkoutRunner } from './workout-runner.js';
import { Toast } from './notifications.js';

export const HeightGrowth = {
  activeTab: 'science',
  selectedRoutineId: 'beginner_decompression',

  // ==========================================================================
  // 1. COMPREHENSIVE KNOWLEDGE BASE
  // ==========================================================================
  knowledgeBase: {
    science: [
      {
        title: 'Epiphyseal Growth Plates Biology',
        icon: '🦴',
        summary: 'Long bones (femurs, tibias, humeri) grow from specialized cartilaginous zones called epiphyseal plates.',
        detail: 'During childhood and puberty, chondrocytes continuously divide, hypertrophy, and undergo endochondral ossification (turn into solid bone). Under the influence of sex steroids (estrogen and testosterone), these plates gradually calcify and fuse (typically between ages 16–21 in males, 14–19 in females). Before fusion, longitudinal bone elongation is active; after fusion, height increases occur through intervertebral disc decompression, pelvic alignment, and posture restoration.'
      },
      {
        title: 'Human Growth Hormone (HGH) & IGF-1 Rhythms',
        icon: '⚡',
        summary: 'Pituitary HGH is released in pulsatile waves, with up to 75% secreted during Stage 3/4 Deep Slow-Wave Sleep.',
        detail: 'Once secreted, HGH travels to the liver where it stimulates the production of Insulin-like Growth Factor 1 (IGF-1). IGF-1 binds directly to receptors on epiphyseal chondrocytes, driving cellular proliferation. Peak pulses occur within 60–90 minutes after falling asleep, meaning fragmented or late-night sleep directly sabotages the biological growth window.'
      },
      {
        title: 'Intervertebral Disc Decompression Biomechanics',
        icon: '🧬',
        summary: 'The 23 intervertebral discs account for 25% of total spinal column length and can be decompressed.',
        detail: 'Each disc consists of a gelatinous nucleus pulposus enclosed by an annulus fibrosus. Under daily gravitational axial loading, fluid is squeezed out, causing adults to lose 1.5 to 2.5 cm by evening. Targeted traction, active hanging, and core elongation re-hydrate discs via fluid imbibition, restoring up to 1.5–3.5 cm (0.6–1.4 inches) of permanent standing height even after growth plates fuse.'
      },
      {
        title: 'Genetics vs Environmental Epigenetics (60–80% vs 20–40%)',
        icon: '🔬',
        summary: 'Genetics dictate your theoretical maximum ceiling, but environmental factors determine if you reach it.',
        detail: 'Twin studies show height has a heritability of ~70–80% in developed nations. However, chronic nutritional deficits, endocrine disruptors, poor posture, and sleep deprivation can rob an individual of 5 to 10 cm (2 to 4 inches) of their genetic potential. Optimizing biomechanics ensures 100% realization of your genetic ceiling.'
      }
    ],

    demerits: [
      {
        title: 'Chronic Sleep Deprivation & Late Nights',
        icon: '💤',
        severity: 'CRITICAL',
        effect: 'Suppresses 70–80% of daily HGH secretion.',
        detail: 'Sleeping less than 7 hours or sleeping past midnight disrupts the circadian slow-wave sleep cycles where peak growth hormone pulses occur. High nocturnal cortisol further blocks pituitary secretion.'
      },
      {
        title: 'Slouching, Text-Neck & Forward Pelvic Tilt',
        icon: '📱',
        severity: 'SEVERE',
        effect: 'Causes a virtual loss of 1 to 3 inches in standing height.',
        detail: 'Forward head carriage (text neck), thoracic hyperkyphosis (rounded shoulders), and anterior pelvic tilt buckle the spine into an exaggerated S-curve. This compresses discs prematurely and shortens functional standing posture.'
      },
      {
        title: 'Excessive Refined Sugars & Hyperinsulinemia',
        icon: '🍬',
        severity: 'HIGH',
        effect: 'High insulin spikes suppress growth hormone by up to 85%.',
        detail: 'Consuming high-glycemic snacks and sodas elevates circulating insulin. Insulin and HGH share inverse hormonal signaling pathways; high insulin shuts down pituitary somatotropin release.'
      },
      {
        title: 'Nicotine, Vaping & Early Alcohol/Caffeine',
        icon: '🚭',
        severity: 'HIGH',
        effect: 'Vasoconstriction reduces nutrient delivery to growth plate cartilage.',
        detail: 'Nicotine constricts peripheral capillaries feeding chondrocytes in long bones, and excessive caffeine accelerates urinary calcium excretion, compromising bone mineral density.'
      },
      {
        title: 'Severe Caloric Deficits & Low Protein Diets',
        icon: '⚠️',
        severity: 'CRITICAL',
        effect: 'Deprives chondrocytes of collagen-building amino acids.',
        detail: 'Starvation diets or eating inadequate protein deprives the body of L-Arginine and amino acid building blocks required for bone matrix synthesis and IGF-1 generation.'
      },
      {
        title: 'Heavy Spinal Compression Loading Without Decompression',
        icon: '🏋️‍♂️',
        severity: 'MODERATE',
        effect: 'Excessive vertical axial loading without hanging traction.',
        detail: 'Lifting heavy weights directly overhead or heavy axial squats without post-workout bar hangs accelerates disc fluid loss and increases spinal compression.'
      }
    ],

    nutrition: [
      {
        nutrient: 'Calcium (1000–1200 mg/day)',
        icon: '🥛',
        sources: 'Milk, Paneer, Curd, Sesame seeds, Ragi, Almonds, Tofu.',
        role: 'Forms the hydroxyapatite crystal lattice that gives bones rigidity and compressive strength.'
      },
      {
        nutrient: 'Vitamin D3 (2000–4000 IU/day)',
        icon: '☀️',
        sources: 'Early morning sunlight (20 mins), fortified foods, egg yolks, fish, D3 drops.',
        role: 'Upregulates calbindin proteins in intestinal enterocytes, enabling gut absorption of dietary calcium into blood.'
      },
      {
        nutrient: 'Vitamin K2 (MK-7 100 mcg/day)',
        icon: '🥬',
        sources: 'Fermented foods, natto, hard cheeses, egg yolk, greens.',
        role: 'Carboxylates osteocalcin, binding circulating calcium directly into the bone matrix while preventing arterial calcification.'
      },
      {
        nutrient: 'Zinc (15–25 mg/day)',
        icon: '🥜',
        sources: 'Pumpkin seeds, chickpeas, lentils, cashews, eggs.',
        role: 'Essential cofactor for DNA polymerase and osteoblast collagen synthesis; directly stimulates hepatic IGF-1 output.'
      },
      {
        nutrient: 'Growth-Promoting Amino Acids (L-Arginine & L-Glutamine)',
        icon: '🥩',
        sources: 'Soya chunks, lentils, peanuts, chicken, eggs, pumpkin seeds.',
        role: 'Natural secretagogues that cross the blood-brain barrier to stimulate pituitary release of growth hormone.'
      },
      {
        nutrient: 'Medical Review: The Truth About "Height Pills"',
        icon: '💊',
        sources: 'Clinical Endocrinology Evidence',
        role: '99% of online "grow 4 inches in 30 days" pills are multi-vitamin scams. Legitimate prescription HGH is only administered via daily subcutaneous injections under a licensed pediatric endocrinologist before growth plate fusion.'
      }
    ],

    yoga: [
      {
        name: 'Tadasana (Palm Tree / Mountain Pose)',
        sanskrit: 'ताड़ासन',
        icon: '🌴',
        focus: 'Full longitudinal axial traction of all 33 vertebrae.',
        instructions: [
          'Stand with feet together, weight balanced evenly across soles.',
          'Interlock fingers, turn palms upward toward ceiling.',
          'Inhale deeply and rise up onto the balls of your feet (toes).',
          'Stretch your entire body upward from heels through fingertips.',
          'Hold for 30–45 seconds breathing steadily. Repeat 3 times.'
        ],
        benefits: 'Straightens thoracic curvature, decompresses lumbar discs, and stimulates growth plate alignment.'
      },
      {
        name: 'Bhujangasana (Cobra Pose)',
        sanskrit: 'भुजंगासन',
        icon: '🐍',
        focus: 'Thoracic extension, chest opening, and spinal elasticity.',
        instructions: [
          'Lie prone on your stomach with forehead on the mat.',
          'Place palms flat under shoulders, elbows hugged close to torso.',
          'Inhale and gently lift head, chest, and upper abdomen off the ground.',
          'Keep pelvic bone grounded and shoulders drawn away from ears.',
          'Hold for 25–35 seconds. Exhale and slowly lower down.'
        ],
        benefits: 'Reverses forward slumping, improves spinal disc hydration, and stretches deep abdominal muscles.'
      },
      {
        name: 'Chakrasana (Wheel / Bridge Pose)',
        sanskrit: 'चक्रासन',
        icon: '🎡',
        focus: 'Maximum spinal extension, pituitary circulation, and hip flexor lengthening.',
        instructions: [
          'Lie on back with knees bent, feet hip-width flat on the mat.',
          'Place palms on the floor beside ears, fingers pointing toward shoulders.',
          'Press firmly through feet and hands, lifting hips and chest upward into an arch.',
          'Relax head and gaze gently at the floor between your hands.',
          'Hold for 15–20 seconds with controlled breathing.'
        ],
        benefits: 'Improves blood flow to the pituitary gland and lengthens the anterior spinal column.'
      },
      {
        name: 'Paschimottanasana (Seated Forward Bend)',
        sanskrit: 'पश्चिमोत्तानासन',
        icon: '🧘‍♂️',
        focus: 'Posterior chain decompression, hamstring and spine elongation.',
        instructions: [
          'Sit upright with legs fully extended together in front of you.',
          'Inhale, raise both arms overhead, lengthening the torso.',
          'Exhale, hinge forward from hips, reaching for shins, ankles, or toes.',
          'Keep spine long rather than aggressively hunching your back.',
          'Hold for 40–60 seconds while relaxing into each exhalation.'
        ],
        benefits: 'Decompresses the lumbar and sacral spine and increases intervertebral space.'
      },
      {
        name: 'Sarvangasana (Supported Shoulder Stand)',
        sanskrit: 'सर्वांगासन',
        icon: '🤸‍♀️',
        focus: 'Inversion decompression, endocrine & thyroid stimulation.',
        instructions: [
          'Lie on back, bend knees, and roll hips off the floor upward.',
          'Support your lower back with palms, elbows grounded on mat.',
          'Extend legs straight up toward ceiling, body aligned in vertical line.',
          'Breathe deeply into diaphragm for 45–60 seconds.',
          'Carefully roll down vertebra by vertebra.'
        ],
        benefits: 'Reverses gravity on spinal discs and promotes venous return to master endocrine glands.'
      },
      {
        name: 'Cat-Cow Flow (Marjaryasana-Bitilasana)',
        sanskrit: 'मार्जरी-बितिलासन',
        icon: '🐈',
        focus: 'Dynamic spinal articulation and disc fluid rehydration.',
        instructions: [
          'Start on all fours with wrists under shoulders, knees under hips.',
          'Inhale into Cow: drop belly, lift chest and tailbone, gaze up.',
          'Exhale into Cat: round spine toward ceiling, tuck chin and pelvis.',
          'Repeat smoothly for 10–12 cycles synchronized with breath.'
        ],
        benefits: 'Pumps fresh synovial fluid into intervertebral facets and releases back stiffness.'
      }
    ],

    exercises: [
      {
        name: 'Active & Passive Bar Hang',
        icon: '🧗',
        category: 'Spinal Traction',
        sets: '3 sets × 45–60 seconds',
        detail: 'Grip an overhead pull-up bar with overhand grip. Allow gravity to pull down your hips and lower body, fully unloading 100% of gravitational compression from vertebrae.'
      },
      {
        name: 'High-Intensity Interval Sprints',
        icon: '🏃‍♂️',
        category: 'HGH Surge Trigger',
        sets: '6 sets × 50m sprint (walk back rest)',
        detail: 'All-out anaerobic sprinting creates micro-cellular stimulation on long bones and triggers up to a 500–700% natural surge in acute serum HGH pulses.'
      },
      {
        name: 'High Jump Rope & Plyometric Leaps',
        icon: '⚡',
        category: 'Epiphyseal Stimulation',
        sets: '4 sets × 50 bounces + 10 max vertical leaps',
        detail: 'Rhythmic mechanical impact strains osteoblast remodeling in lower limbs, promoting calcium mineralization along primary stress lines.'
      },
      {
        name: 'Pelvic Shift & Bridge Hold',
        icon: '🌉',
        category: 'Pelvic Neutralization',
        sets: '3 sets × 15 reps + 20s hold',
        detail: 'Lying on back, drive through heels to lift hips in line with knees. Activates glutes and rectus abdominis to fix anterior pelvic tilt that robs up to 2 inches.'
      },
      {
        name: 'Dry-Land Breaststroke Elongation',
        icon: '🏊‍♂️',
        category: 'Core Traction',
        sets: '3 sets × 12 reps',
        detail: 'Lie on stomach, extend arms forward and kick legs back, lifting chest and thighs simultaneously while stretching in opposite directions.'
      }
    ]
  },

  // ==========================================================================
  // 2. ROUTINE PRESETS (LAUNCHABLE IN WORKOUT RUNNER)
  // ==========================================================================
  routines: [
    {
      id: 'beginner_decompression',
      name: 'Gentle Spinal Decompression & Morning Yoga',
      difficulty: 'Beginner',
      badge: 'GENTLE · 15 MINS',
      durationMinutes: 15,
      icon: '🌱',
      description: 'Zero-impact daily morning protocol focused on unlocking spinal compression, fixing pelvic tilt, and promoting posture elongation.',
      exercises: [
        {
          id: 'h-tadasana',
          name: 'Tadasana (Palm Tree Stretch)',
          category: 'yoga',
          equipment: 'bodyweight',
          targetSets: 3,
          targetReps: 45,
          targetRest: 30,
          targetMuscles: ['Spinal Extensors', 'Calves', 'Shoulders'],
          icon: '🌴',
          instructions: ['Stand tall, interlock fingers, rise onto toes and stretch entire body upward.'],
          tips: 'Gaze at a fixed point to maintain equilibrium.',
          caloriesBurnedPerSet: 8
        },
        {
          id: 'h-cat-cow',
          name: 'Cat-Cow Spinal Articulation',
          category: 'mobility',
          equipment: 'bodyweight',
          targetSets: 3,
          targetReps: 12,
          targetRest: 25,
          targetMuscles: ['Erector Spinae', 'Core', 'Thoracic Spine'],
          icon: '🐈',
          instructions: ['Inhale arching back into cow, exhale rounding spine into cat.'],
          tips: 'Move smoothly with each breath.',
          caloriesBurnedPerSet: 10
        },
        {
          id: 'h-bhujangasana',
          name: 'Bhujangasana (Cobra Extension)',
          category: 'yoga',
          equipment: 'bodyweight',
          targetSets: 3,
          targetReps: 30,
          targetRest: 30,
          targetMuscles: ['Thoracic Spine', 'Chest', 'Abdominals'],
          icon: '🐍',
          instructions: ['Press through palms, lift chest while keeping pelvic bone grounded.'],
          tips: 'Avoid straining neck; keep shoulders away from ears.',
          caloriesBurnedPerSet: 12
        },
        {
          id: 'h-passive-hang',
          name: 'Dead Bar Hang Decompression',
          category: 'decompression',
          equipment: 'pull-up bar',
          targetSets: 3,
          targetReps: 45,
          targetRest: 45,
          targetMuscles: ['Spine', 'Lats', 'Forearms'],
          icon: '🧗',
          instructions: ['Hang freely from pull-up bar, relaxing shoulders and breathing into lower back.'],
          tips: 'Do not swing; feel the gentle gravitational pull.',
          caloriesBurnedPerSet: 15
        }
      ]
    },
    {
      id: 'intermediate_hgh',
      name: 'HGH Surge & Intervertebral Elongation',
      difficulty: 'Intermediate',
      badge: 'RECOMMENDED · 25 MINS',
      durationMinutes: 25,
      icon: '⚡',
      description: 'Balanced protocol combining deep spinal traction, hamstring lengthening, pelvic leveling, and growth plate stimulation.',
      exercises: [
        {
          id: 'h-bar-hang-active',
          name: 'Passive to Active Bar Hang',
          category: 'decompression',
          equipment: 'pull-up bar',
          targetSets: 4,
          targetReps: 50,
          targetRest: 45,
          targetMuscles: ['Spine', 'Latissimus Dorsi', 'Shoulders'],
          icon: '🧗',
          instructions: ['Hang freely for 30s, then engage scapulae for 20s to align thoracic facets.'],
          tips: 'Exhale completely to maximize disc decompression.',
          caloriesBurnedPerSet: 18
        },
        {
          id: 'h-paschimottanasana',
          name: 'Paschimottanasana (Seated Elongation)',
          category: 'yoga',
          equipment: 'bodyweight',
          targetSets: 3,
          targetReps: 40,
          targetRest: 30,
          targetMuscles: ['Hamstrings', 'Lower Back', 'Spinal Decompressors'],
          icon: '🧘‍♂️',
          instructions: ['Hinge from hips, extend chest toward toes without rounding upper back.'],
          tips: 'Flex toes toward shins to deepen posterior chain elongation.',
          caloriesBurnedPerSet: 12
        },
        {
          id: 'h-bhujangasana-deep',
          name: 'Deep Cobra to Child Pose Transition',
          category: 'yoga',
          equipment: 'bodyweight',
          targetSets: 3,
          targetReps: 12,
          targetRest: 30,
          targetMuscles: ['Spine', 'Hip Flexors', 'Erectors'],
          icon: '🐍',
          instructions: ['Transition smoothly from full Cobra stretch into elongated Child pose.'],
          tips: 'Lengthen arms forward in Child pose for upper thoracic decompression.',
          caloriesBurnedPerSet: 15
        },
        {
          id: 'h-pelvic-shift',
          name: 'Pelvic Bridge Alignment Hold',
          category: 'posture',
          equipment: 'bodyweight',
          targetSets: 3,
          targetReps: 15,
          targetRest: 30,
          targetMuscles: ['Gluteus Maximus', 'Hamstrings', 'Transverse Abdominis'],
          icon: '🌉',
          instructions: ['Drive hips upward, squeeze glutes at top to neutralize pelvic tilt.'],
          tips: 'Keep feet flat and knees parallel.',
          caloriesBurnedPerSet: 16
        },
        {
          id: 'h-plyo-jump',
          name: 'High Vertical Tuck Leaps',
          category: 'dynamic',
          equipment: 'bodyweight',
          targetSets: 3,
          targetReps: 12,
          targetRest: 45,
          targetMuscles: ['Quads', 'Calves', 'Core'],
          icon: '🦘',
          instructions: ['Squat slightly and explosively leap toward ceiling, tucking knees.'],
          tips: 'Land softly on balls of feet with knees slightly bent.',
          caloriesBurnedPerSet: 25
        }
      ]
    },
    {
      id: 'advanced_athletic',
      name: 'Advanced Athletic Growth & Micro-Stimulation',
      difficulty: 'Advanced',
      badge: 'HIGH DENSITY · 35 MINS',
      durationMinutes: 35,
      icon: '🔥',
      description: 'Maximum biological stimulus protocol with all-out sprints for acute HGH pulses, full Chakrasana wheel extension, and inverted decompression.',
      exercises: [
        {
          id: 'h-sprints',
          name: 'Max Effort Explosive Sprints',
          category: 'hgh-trigger',
          equipment: 'bodyweight',
          targetSets: 5,
          targetReps: 50,
          targetRest: 60,
          targetMuscles: ['Full Body', 'HGH Pituitary Trigger'],
          icon: '🏃‍♂️',
          instructions: ['Sprint at 95–100% maximum intensity for 50 meters, walk back for rest.'],
          tips: 'Drive knees high and pump arms powerfully.',
          caloriesBurnedPerSet: 35
        },
        {
          id: 'h-chakrasana',
          name: 'Chakrasana (Wheel Pose Arch)',
          category: 'yoga',
          equipment: 'bodyweight',
          targetSets: 3,
          targetReps: 25,
          targetRest: 45,
          targetMuscles: ['Entire Anterior Chain', 'Spine', 'Shoulders'],
          icon: '🎡',
          instructions: ['Press hands and feet firmly to arch spine upward into a complete wheel.'],
          tips: 'Only attempt after warm-up; keep neck relaxed.',
          caloriesBurnedPerSet: 22
        },
        {
          id: 'h-sarvangasana',
          name: 'Sarvangasana (Shoulder Stand)',
          category: 'yoga',
          equipment: 'bodyweight',
          targetSets: 3,
          targetReps: 60,
          targetRest: 45,
          targetMuscles: ['Neck', 'Core', 'Endocrine Glands'],
          icon: '🤸‍♀️',
          instructions: ['Invert body vertically, supporting lower back with hands.'],
          tips: 'Do not turn head while inverted; breathe smoothly.',
          caloriesBurnedPerSet: 18
        },
        {
          id: 'h-bar-hang-weighted',
          name: 'Inversion / Heavy Decompression Hang',
          category: 'decompression',
          equipment: 'pull-up bar',
          targetSets: 4,
          targetReps: 60,
          targetRest: 60,
          targetMuscles: ['Entire Spinal Column', 'Intervertebral Discs'],
          icon: '🧗',
          instructions: ['Perform prolonged hanging with ankles relaxed or lightly weighted.'],
          tips: 'Focus on releasing tension in lower lumbar region.',
          caloriesBurnedPerSet: 20
        },
        {
          id: 'h-dry-breaststroke',
          name: 'Dry-Land Elongation Swim',
          category: 'mobility',
          equipment: 'bodyweight',
          targetSets: 3,
          targetReps: 15,
          targetRest: 30,
          targetMuscles: ['Latissimus', 'Rhomboids', 'Erectors'],
          icon: '🏊‍♂️',
          instructions: ['Prone on stomach, lift chest and flutter arms and legs simultaneously in extension.'],
          tips: 'Stretch extremities as far apart as possible.',
          caloriesBurnedPerSet: 18
        }
      ]
    }
  ],

  // ==========================================================================
  // 3. INITIALIZATION & EVENT BINDINGS
  // ==========================================================================
  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Knowledge Base Tabs
    document.querySelectorAll('.knowledge-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Sound.playClick();
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Assessment Form Submission
    const assessmentForm = document.getElementById('form-height-assessment');
    if (assessmentForm) {
      assessmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.calculateRoadmap();
      });
    }

    // Routine Card Selectors
    document.querySelectorAll('.routine-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const routineId = btn.dataset.routineId;
        this.launchRoutine(routineId);
      });
    });
  },

  // ==========================================================================
  // 4. SCREEN ACTIVATION & RENDERING
  // ==========================================================================
  render() {
    const data = AppState.userData;
    const profile = data?.heightProfile || this.getDefaultProfile();

    // Render Hero Gauge & Progress
    this.renderHeroStats(profile);

    // Populate Form with existing profile data
    this.populateForm(profile);

    // Render Knowledge Content
    this.renderKnowledgeContent();

    // Render Routine Cards
    this.renderRoutineCards();
  },

  getDefaultProfile() {
    return {
      age: 19,
      gender: 'male',
      currentHeightCm: 172,
      targetHeightCm: 180,
      weightKg: 68,
      sleepHours: 7.5,
      postureStatus: 'slouched',
      growthPotentialScore: 78,
      biologicalPhase: 'Active Late Growth Plate & Spinal Decompression',
      predictedGainCm: '4.5 - 7.5 cm',
      roadmapGenerated: true
    };
  },

  renderHeroStats(profile) {
    const scoreVal = document.getElementById('height-potential-score-val');
    const scoreFill = document.getElementById('height-potential-score-fill');
    const currHVal = document.getElementById('height-current-disp');
    const targetHVal = document.getElementById('height-target-disp');
    const gainVal = document.getElementById('height-predicted-gain');
    const phaseTag = document.getElementById('height-biological-phase');

    const score = profile.growthPotentialScore || 75;
    if (scoreVal) scoreVal.textContent = `${score}%`;
    if (scoreFill) scoreFill.style.width = `${score}%`;

    const currCm = profile.currentHeightCm || 172;
    const targetCm = profile.targetHeightCm || 180;

    if (currHVal) currHVal.textContent = `${currCm} cm (${this.cmToFeetInches(currCm)})`;
    if (targetHVal) targetHVal.textContent = `${targetCm} cm (${this.cmToFeetInches(targetCm)})`;
    if (gainVal) gainVal.textContent = `+${(targetCm - currCm).toFixed(1)} cm Goal (${profile.predictedGainCm || '3 - 6 cm'})`;
    if (phaseTag) phaseTag.textContent = profile.biologicalPhase || 'Growth Phase';
  },

  populateForm(profile) {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined) el.value = val;
    };

    setVal('input-height-age', profile.age || 19);
    setVal('input-height-gender', profile.gender || 'male');
    setVal('input-height-current', profile.currentHeightCm || 172);
    setVal('input-height-target', profile.targetHeightCm || 180);
    setVal('input-height-weight', profile.weightKg || 68);
    setVal('input-height-sleep', profile.sleepHours || 7.5);
    setVal('input-height-posture', profile.postureStatus || 'slouched');
  },

  // ==========================================================================
  // 5. ROADMAP ASSESSMENT CALCULATION
  // ==========================================================================
  calculateRoadmap() {
    Sound.playClick();

    const age = parseInt(document.getElementById('input-height-age')?.value, 10) || 19;
    const gender = document.getElementById('input-height-gender')?.value || 'male';
    const currentCm = parseFloat(document.getElementById('input-height-current')?.value) || 172;
    const targetCm = parseFloat(document.getElementById('input-height-target')?.value) || 180;
    const weightKg = parseFloat(document.getElementById('input-height-weight')?.value) || 68;
    const sleep = parseFloat(document.getElementById('input-height-sleep')?.value) || 7.5;
    const posture = document.getElementById('input-height-posture')?.value || 'slouched';

    // 1. Determine Biological Growth Phase & Growth Plate Status
    let plateStatus = 'open';
    let biologicalPhase = '';
    let basePotential = 85;

    if (gender === 'female') {
      if (age <= 16) {
        plateStatus = 'open';
        biologicalPhase = 'Active Primary Epiphyseal Lengthening Phase';
        basePotential = 92;
      } else if (age <= 19) {
        plateStatus = 'late';
        biologicalPhase = 'Late Consolidation & Spinal Disc Decompression Phase';
        basePotential = 78;
      } else {
        plateStatus = 'closed';
        biologicalPhase = 'Adult Spinal Decompression, Intervertebral & Posture Elongation';
        basePotential = 65;
      }
    } else {
      if (age <= 18) {
        plateStatus = 'open';
        biologicalPhase = 'Active Primary Epiphyseal Growth Phase';
        basePotential = 95;
      } else if (age <= 21) {
        plateStatus = 'late';
        biologicalPhase = 'Late Consolidation & Intervertebral Lengthening Phase';
        basePotential = 82;
      } else {
        plateStatus = 'closed';
        biologicalPhase = 'Adult Spinal Decompression, Disc Rehydration & Posture Restoration';
        basePotential = 68;
      }
    }

    // 2. Adjust Potential Score by Sleep & Posture
    let score = basePotential;
    if (sleep >= 8) score += 5;
    else if (sleep < 6) score -= 12;

    if (posture === 'slouched') {
      score += 6;
    } else if (posture === 'active') {
      score += 3;
    }

    score = Math.min(99, Math.max(45, score));

    // 3. Projected Realistic Height Gain
    let minGain = 2.0;
    let maxGain = 5.0;

    if (plateStatus === 'open') {
      minGain = 4.0;
      maxGain = 9.0;
    } else if (plateStatus === 'late') {
      minGain = 3.0;
      maxGain = 6.5;
    } else {
      minGain = 1.5;
      maxGain = 4.2;
    }

    const predictedGainCm = `${minGain.toFixed(1)} - ${maxGain.toFixed(1)} cm`;

    // 4. Save to User State
    const heightProfile = {
      age,
      gender,
      currentHeightCm: currentCm,
      targetHeightCm: targetCm,
      weightKg,
      sleepHours: sleep,
      postureStatus: posture,
      growthPotentialScore: score,
      biologicalPhase,
      plateStatus,
      predictedGainCm,
      calculatedAt: new Date().toISOString(),
      roadmapGenerated: true
    };

    if (AppState.isLoggedIn()) {
      AppState.userData.heightProfile = heightProfile;
      AppState.addXp(120, 'Completed Height Growth & Posture Roadmap');
      AppState.save();
    }

    Sound.playLevelUp();
    Toast.show({
      title: 'Roadmap Generated!',
      message: `Your customized 90-Day Height & Posture Protocol is calibrated.`,
      icon: '📏',
      type: 'success'
    });

    // Update Screen UI
    this.renderHeroStats(heightProfile);
    this.renderGeneratedRoadmapCard(heightProfile);
  },

  renderGeneratedRoadmapCard(profile) {
    const card = document.getElementById('height-generated-roadmap-result');
    if (!card) return;

    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
        <div>
          <span class="badge badge-gold" style="font-size: 0.8rem; margin-bottom: 0.4rem;">PERSONALIZED PROTOCOL</span>
          <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">
            Your 90-Day Height Optimization Roadmap
          </h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">
            Status: <strong style="color: var(--accent-blue);">${profile.biologicalPhase}</strong>
          </p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Achievable Projection</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: var(--accent-emerald);">+${profile.predictedGainCm}</div>
        </div>
      </div>

      <div class="roadmap-phases-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; margin-bottom: 1.75rem;">
        
        <!-- Phase 1 -->
        <div class="feature-box tilt-card" style="border-left: 4px solid var(--accent-blue); padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span class="badge badge-cyan">DAYS 1 – 30</span>
            <span style="font-size: 1.3rem;">🧬</span>
          </div>
          <h4 style="font-size: 1.05rem; font-weight: 700;">Phase 1: Spinal Decompression & Imbibition</h4>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.4rem; line-height: 1.5;">
            Focus on passive bar hangs, pelvic bridge alignment, and Tadasana. Rehydrate compressed intervertebral discs to reclaim initial 1.5–2.5 cm lost to gravity.
          </p>
          <div style="margin-top: 0.75rem; font-size: 0.78rem; font-weight: 700; color: var(--accent-blue);">
            Target: Restore 1.5 cm & Fix Anterior Pelvic Tilt
          </div>
        </div>

        <!-- Phase 2 -->
        <div class="feature-box tilt-card" style="border-left: 4px solid var(--accent-purple); padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span class="badge badge-purple">DAYS 31 – 60</span>
            <span style="font-size: 1.3rem;">⚡</span>
          </div>
          <h4 style="font-size: 1.05rem; font-weight: 700;">Phase 2: HGH Circadian Pulse & Bone Matrix</h4>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.4rem; line-height: 1.5;">
            Synchronize sleep schedules to hit deep Stage 3 NREM sleep by 11:00 PM. Optimize Calcium, Vitamin D3, Vitamin K2 (MK-7), and Zinc. Incorporate sprinting for natural growth hormone spikes.
          </p>
          <div style="margin-top: 0.75rem; font-size: 0.78rem; font-weight: 700; color: var(--accent-purple);">
            Target: 8+ Hours Sleep & Pituitary HGH Optimization
          </div>
        </div>

        <!-- Phase 3 -->
        <div class="feature-box tilt-card" style="border-left: 4px solid var(--accent-emerald); padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span class="badge badge-emerald">DAYS 61 – 90</span>
            <span style="font-size: 1.3rem;">🏔️</span>
          </div>
          <h4 style="font-size: 1.05rem; font-weight: 700;">Phase 3: Dynamic Micro-Stimulation & Lock-In</h4>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.4rem; line-height: 1.5;">
            Combine full Chakrasana wheel extension, inversion hangs, and plyometric jump rope to reinforce bone remodeling along long axes and cement permanent upright posture.
          </p>
          <div style="margin-top: 0.75rem; font-size: 0.78rem; font-weight: 700; color: var(--accent-emerald);">
            Target: Structural Consolidation & Full Height Realization
          </div>
        </div>

      </div>

      <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h5 style="font-size: 0.95rem; font-weight: 700;">Next Step: Select Your Daily Height Routine Below</h5>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
            Choose a routine matching your confidence and physical capability, and launch it directly in the active 3D runner.
          </p>
        </div>
        <button type="button" class="btn-3d btn-3d-fire" style="font-size: 0.9rem; padding: 0.65rem 1.5rem;" onclick="const el = document.getElementById('height-routines-section'); if (el) el.scrollIntoView({ behavior: 'smooth' });">
          ⚡ Choose Routine Below ↓
        </button>
      </div>
    `;
  },

  // ==========================================================================
  // 6. KNOWLEDGE TABS SWITCHING
  // ==========================================================================
  switchTab(tabKey) {
    this.activeTab = tabKey;

    document.querySelectorAll('.knowledge-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabKey);
    });

    this.renderKnowledgeContent();
  },

  renderKnowledgeContent() {
    const container = document.getElementById('height-knowledge-content');
    if (!container) return;

    const tab = this.activeTab;
    const kb = this.knowledgeBase;

    if (tab === 'science') {
      container.innerHTML = `
        <div class="knowledge-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          ${kb.science.map(item => `
            <div class="feature-box tilt-card" style="padding: 1.4rem;">
              <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">${item.icon}</div>
              <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">${item.title}</h4>
              <p style="font-size: 0.88rem; font-weight: 600; color: var(--accent-blue); margin: 0.4rem 0;">${item.summary}</p>
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">${item.detail}</p>
            </div>
          `).join('')}
        </div>
      `;
    } else if (tab === 'demerits') {
      container.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--accent-red);">
            ⚠️ Critical Habits That Stunt & Suppress Human Height Growth
          </h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.25rem;">
            These physiological and biomechanical demerits actively suppress natural growth hormone secretion and compress the spinal column.
          </p>
        </div>
        <div class="knowledge-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          ${kb.demerits.map(item => `
            <div class="feature-box tilt-card" style="padding: 1.4rem; border-left: 4px solid var(--accent-red);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 2rem;">${item.icon}</span>
                <span class="badge badge-purple" style="background: var(--accent-red-subtle); color: var(--accent-red);">${item.severity} DEMERIT</span>
              </div>
              <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">${item.title}</h4>
              <div style="font-size: 0.84rem; font-weight: 700; color: var(--accent-red); margin: 0.4rem 0;">
                Impact: ${item.effect}
              </div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">${item.detail}</p>
            </div>
          `).join('')}
        </div>
      `;
    } else if (tab === 'nutrition') {
      container.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">
            🥗 Bone Matrix Micronutrients, Secretagogues & Medical Realities
          </h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.25rem;">
            Essential nutritional co-factors required to mineralize osteoid tissue and stimulate the anterior pituitary gland.
          </p>
        </div>
        <div class="knowledge-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          ${kb.nutrition.map(item => `
            <div class="feature-box tilt-card" style="padding: 1.4rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.6rem;">
                <span style="font-size: 2rem;">${item.icon}</span>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">${item.nutrient}</h4>
              </div>
              <div style="background: var(--bg-secondary); padding: 0.6rem 0.8rem; border-radius: var(--radius-md); margin-bottom: 0.6rem; font-size: 0.8rem; color: var(--text-primary);">
                <strong>Optimal Sources:</strong> ${item.sources}
              </div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
                <strong>Physiological Role:</strong> ${item.role}
              </p>
            </div>
          `).join('')}
        </div>
      `;
    } else if (tab === 'yoga') {
      container.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">
            🧘 Ancient & Biomechanical Elongation Yoga Asanas
          </h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.25rem;">
            Specific yogic postures proven to decompress the 33 vertebrae, reverse hyperkyphosis, and stimulate pituitary circulation.
          </p>
        </div>
        <div class="knowledge-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem;">
          ${kb.yoga.map(item => `
            <div class="feature-box tilt-card" style="padding: 1.4rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-size: 2.2rem;">${item.icon}</span>
                  <div>
                    <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">${item.name}</h4>
                    <span style="font-size: 0.8rem; color: var(--accent-blue); font-weight: 700;">${item.sanskrit}</span>
                  </div>
                </div>
              </div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--accent-purple); margin-bottom: 0.5rem;">
                Target: ${item.focus}
              </div>
              <ol style="font-size: 0.8rem; color: var(--text-secondary); padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem;">
                ${item.instructions.map(inst => `<li>${inst}</li>`).join('')}
              </ol>
              <div style="background: var(--accent-emerald-subtle); padding: 0.6rem 0.8rem; border-radius: var(--radius-md); font-size: 0.78rem; color: var(--accent-emerald-hover); font-weight: 700;">
                💡 Benefits: ${item.benefits}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (tab === 'exercises') {
      container.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">
            🤸 Specialized Height Exercises & Epiphyseal Micro-Stimulators
          </h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.25rem;">
            Dynamic biomechanical movements designed for gravity reversal, disc fluid imbibition, and acute HGH output.
          </p>
        </div>
        <div class="knowledge-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          ${kb.exercises.map(item => `
            <div class="feature-box tilt-card" style="padding: 1.4rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 2.2rem;">${item.icon}</span>
                <span class="badge badge-cyan">${item.category}</span>
              </div>
              <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">${item.name}</h4>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--accent-emerald); margin: 0.35rem 0;">
                Protocol: ${item.sets}
              </div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">${item.detail}</p>
            </div>
          `).join('')}
        </div>
      `;
    }
  },

  // ==========================================================================
  // 7. ROUTINE CARDS & RUNNER INTEGRATION
  // ==========================================================================
  renderRoutineCards() {
    const container = document.getElementById('height-routines-container');
    if (!container) return;

    container.innerHTML = `
      <div class="routines-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(310px, 1fr)); gap: 1.5rem;">
        ${this.routines.map(rt => `
          <div class="feature-box tilt-card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.75rem; border: 2px solid var(--border-subtle); position: relative;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <div style="font-size: 2.5rem;">${rt.icon}</div>
                <span class="badge ${rt.difficulty === 'Beginner' ? 'badge-cyan' : rt.difficulty === 'Intermediate' ? 'badge-emerald' : 'badge-purple'}">
                  ${rt.badge}
                </span>
              </div>

              <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.4rem;">
                ${rt.name}
              </h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem;">
                ${rt.description}
              </p>

              <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.6rem;">
                Included Exercises (${rt.exercises.length}):
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.5rem;">
                ${rt.exercises.map((ex, idx) => `
                  <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); background: var(--bg-secondary); padding: 0.45rem 0.75rem; border-radius: var(--radius-md);">
                    <span>${idx + 1}. ${ex.icon} ${ex.name}</span>
                    <span style="color: var(--accent-blue); font-weight: 700;">${ex.targetSets}×${ex.targetReps}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <button type="button" class="btn-3d ${rt.difficulty === 'Advanced' ? 'btn-3d-fire' : 'btn-3d-emerald'} routine-select-btn" data-routine-id="${rt.id}" style="width: 100%; padding: 0.85rem; font-size: 0.95rem;">
              ⚡ Start ${rt.difficulty} Routine in Active Runner
            </button>
          </div>
        `).join('')}
      </div>
    `;

    // Re-bind click handlers
    container.querySelectorAll('.routine-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rId = btn.dataset.routineId;
        this.launchRoutine(rId);
      });
    });
  },

  launchRoutine(routineId) {
    Sound.playClick();
    const routine = this.routines.find(r => r.id === routineId);
    if (!routine) return;

    // Convert routine to WorkoutRunner format
    const workoutSession = {
      dayNumber: 1,
      title: routine.name,
      focus: 'Height Optimization & Spinal Decompression',
      estimatedMinutes: routine.durationMinutes,
      difficulty: routine.difficulty.toLowerCase(),
      exercises: routine.exercises
    };

    Toast.show({
      title: 'Launching Height Protocol!',
      message: `Loading ${routine.name} into Active Workout Runner.`,
      icon: '📏',
      type: 'success'
    });

    WorkoutRunner.start(workoutSession, (summary) => {
      if (AppState.isLoggedIn()) {
        AppState.recordCompletedWorkout({
          ...summary,
          workoutTitle: routine.name,
          category: 'height_protocol'
        });
      }
    });

    Navigation.showScreen('screen-active-runner', true);
  },

  // ==========================================================================
  // 8. HELPER UTILITIES
  // ==========================================================================
  cmToFeetInches(cm) {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}′${inches}″`;
  }
};
