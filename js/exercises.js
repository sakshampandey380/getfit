/**
 * FITQUEST EXERCISE DATABASE
 * 50+ comprehensively documented exercises with anatomical targets, instructions,
 * rest intervals, safety guidelines, and inline SVG muscle visualizations.
 */

export const EXERCISES = [
  // ==========================================
  // CHEST (8)
  // ==========================================
  {
    id: 'chest_pushups',
    name: 'Push-ups',
    category: 'chest',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    targetMuscles: ['Pectoralis Major', 'Triceps', 'Anterior Deltoid', 'Core'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 60,
    icon: '💪',
    instructions: [
      'Start in a high plank position with hands positioned slightly wider than shoulder-width apart.',
      'Engage your glutes and brace your core so your body forms a straight line from heels to head.',
      'Lower your chest toward the floor by bending your elbows at a 45-degree angle from your torso.',
      'Push firmly through your palms to return to the starting position without locking elbows harshly.'
    ],
    tips: 'Keep your neck neutral by gazing about six inches in front of your fingertips.',
    safetyNotes: 'Avoid sagging your hips or flaring your elbows out at 90 degrees to protect the rotator cuff.'
  },
  {
    id: 'chest_incline_pushups',
    name: 'Incline Push-ups',
    category: 'chest',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    targetMuscles: ['Lower Pectorals', 'Triceps', 'Shoulders'],
    defaultSets: 3,
    defaultReps: 15,
    defaultDuration: null,
    restTime: 45,
    icon: '🪜',
    instructions: [
      'Place your hands shoulder-width apart on an elevated surface like a sturdy bench, box, or step.',
      'Step your feet back until your body forms a clean plank angle.',
      'Lower your sternum smoothly toward the edge of the elevated surface.',
      'Press back up with controlled exhalation until arms are straight.'
    ],
    tips: 'The higher the surface elevation, the easier the resistance will be.',
    safetyNotes: 'Ensure the elevated platform is securely anchored and cannot slip.'
  },
  {
    id: 'chest_decline_pushups',
    name: 'Decline Push-ups',
    category: 'chest',
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    targetMuscles: ['Upper Pectorals', 'Anterior Deltoid', 'Triceps'],
    defaultSets: 3,
    defaultReps: 10,
    defaultDuration: null,
    restTime: 60,
    icon: '📐',
    instructions: [
      'Place your toes on an elevated bench or sturdy chair and your hands flat on the floor.',
      'Align your hands directly under your shoulders with fingers pointing slightly outward.',
      'Slowly lower your chest toward the floor while bracing your abdominals tightly.',
      'Drive through your palms back to the top position.'
    ],
    tips: 'Maintain rigid core tension to prevent hyperextending your lumbar spine.',
    safetyNotes: 'If you feel excess pressure in the wrists, rotate hands outward slightly.'
  },
  {
    id: 'chest_diamond_pushups',
    name: 'Diamond Push-ups',
    category: 'chest',
    difficulty: 'advanced',
    equipment: 'bodyweight',
    targetMuscles: ['Inner Pectorals', 'Triceps Brachii', 'Core'],
    defaultSets: 3,
    defaultReps: 8,
    defaultDuration: null,
    restTime: 75,
    icon: '💎',
    instructions: [
      'Assume a push-up position and bring your index fingers and thumbs together to form a diamond shape under your chest.',
      'Keep your core tight and elbows tracking close along your ribcage as you descend.',
      'Touch your chest gently to your hands, then press back up strongly.'
    ],
    tips: 'Spread your feet slightly wider to maintain stability.',
    safetyNotes: 'If you feel elbow discomfort, open your hands 2 inches wider.'
  },
  {
    id: 'chest_wide_pushups',
    name: 'Wide-Grip Push-ups',
    category: 'chest',
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    targetMuscles: ['Pectoralis Major (Outer)', 'Anterior Deltoids'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 60,
    icon: '👐',
    instructions: [
      'Set your hands about 1.5 times shoulder-width apart on the ground.',
      'Lower your torso until your elbows reach a 90-degree angle.',
      'Squeeze your chest muscles at the apex of the push.'
    ],
    tips: 'Focus on actively squeezing your chest together at the top of every rep.',
    safetyNotes: 'Do not sink too deep past 90 degrees if you have shoulder impingement.'
  },
  {
    id: 'chest_db_bench_press',
    name: 'Dumbbell Bench Press',
    category: 'chest',
    difficulty: 'intermediate',
    equipment: 'dumbbells',
    targetMuscles: ['Pectoralis Major', 'Triceps', 'Front Deltoids'],
    defaultSets: 4,
    defaultReps: 10,
    defaultDuration: null,
    restTime: 75,
    icon: '🏋️',
    instructions: [
      'Lie back on a flat bench with a dumbbell in each hand resting at the sides of your chest.',
      'Plant your feet firmly on the floor and retract your shoulder blades into the bench.',
      'Press the dumbbells upward until arms are extended, without clanking weights together.',
      'Lower with control for 2 seconds until you feel a comfortable stretch across your chest.'
    ],
    tips: 'Keep your forearms vertical to the floor throughout the entire movement path.',
    safetyNotes: 'Do not let your elbows flare out 90 degrees; maintain a 45 to 60-degree tuck.'
  },
  {
    id: 'chest_barbell_bench_press',
    name: 'Barbell Bench Press',
    category: 'chest',
    difficulty: 'intermediate',
    equipment: 'barbell',
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoid', 'Triceps'],
    defaultSets: 4,
    defaultReps: 8,
    defaultDuration: null,
    restTime: 90,
    icon: '🏋️‍♂️',
    instructions: [
      'Lie under the racked bar with eyes aligned with the bar.',
      'Grip the bar slightly wider than shoulder width with thumbs wrapped securely.',
      'Unrack the bar and bring it above your mid-chest.',
      'Lower with control until the bar touches your lower sternum, then drive upward explosively.'
    ],
    tips: 'Drive your feet into the floor to utilize leg drive and body tension.',
    safetyNotes: 'Always use safety pins or a spotter when lifting heavy weights.'
  },
  {
    id: 'chest_incline_db_press',
    name: 'Incline Dumbbell Press',
    category: 'chest',
    difficulty: 'intermediate',
    equipment: 'dumbbells',
    targetMuscles: ['Clavicular Pectoralis (Upper Chest)', 'Front Deltoid', 'Triceps'],
    defaultSets: 3,
    defaultReps: 10,
    defaultDuration: null,
    restTime: 75,
    icon: '📐',
    instructions: [
      'Set an adjustable bench to an incline between 30 and 45 degrees.',
      'Sit back holding dumbbells at shoulder level with palms facing away.',
      'Press the dumbbells straight up over your upper chest.',
      'Lower smoothly until your elbows descend slightly below bench level.'
    ],
    tips: 'Avoid bench angles higher than 45 degrees as that shifts emphasis heavily to shoulders.',
    safetyNotes: 'Keep your lower back lightly arched without lifting your hips off the seat.'
  },

  // ==========================================
  // BACK (7)
  // ==========================================
  {
    id: 'back_pullups',
    name: 'Pull-ups',
    category: 'back',
    difficulty: 'advanced',
    equipment: 'pull-up bar',
    targetMuscles: ['Latissimus Dorsi', 'Biceps', 'Rhomboids', 'Rear Deltoids'],
    defaultSets: 3,
    defaultReps: 6,
    defaultDuration: null,
    restTime: 90,
    icon: '🧗',
    instructions: [
      'Grip a pull-up bar with an overhand grip slightly wider than shoulder-width.',
      'Hang with arms fully extended and retract your shoulder blades downward.',
      'Pull your chest up toward the bar by driving your elbows down toward your hips.',
      'Pause briefly with your chin clearing the bar, then lower with total control.'
    ],
    tips: 'Imagine pulling your elbows into your back pockets rather than yanking with arms.',
    safetyNotes: 'Avoid swinging your legs or using excessive kipping momentum.'
  },
  {
    id: 'back_chinups',
    name: 'Chin-ups',
    category: 'back',
    difficulty: 'intermediate',
    equipment: 'pull-up bar',
    targetMuscles: ['Latissimus Dorsi', 'Biceps Brachii', 'Brachialis'],
    defaultSets: 3,
    defaultReps: 8,
    defaultDuration: null,
    restTime: 90,
    icon: '🧗‍♂️',
    instructions: [
      'Grasp the bar with an underhand grip (palms facing you) shoulder-width apart.',
      'Pull your chest up until your chin comfortably crosses over the bar.',
      'Lower smoothly until arms reach full extension at the dead hang.'
    ],
    tips: 'Underhand grip provides greater mechanical advantage to your biceps.',
    safetyNotes: 'Do not drop suddenly out of the top position to protect shoulder joints.'
  },
  {
    id: 'back_lat_pulldown',
    name: 'Lat Pulldown',
    category: 'back',
    difficulty: 'beginner',
    equipment: 'cable machine',
    targetMuscles: ['Latissimus Dorsi', 'Teres Major', 'Biceps'],
    defaultSets: 4,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 60,
    icon: '⚙️',
    instructions: [
      'Sit comfortably at the lat pulldown machine and secure thighs under the roller pads.',
      'Grip the wide bar with hands slightly wider than shoulder width.',
      'Lean back approximately 10 degrees and pull the bar down smoothly to your upper chest.',
      'Control the ascent as the cable pulls the weight back to the top.'
    ],
    tips: 'Lead with your elbows and resist the weight on the way up.',
    safetyNotes: 'Never pull the bar behind your neck as this strains the cervical spine.'
  },
  {
    id: 'back_seated_cable_row',
    name: 'Seated Cable Row',
    category: 'back',
    difficulty: 'intermediate',
    equipment: 'cable machine',
    targetMuscles: ['Rhomboids', 'Middle Trapezius', 'Lats', 'Erector Spinae'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 60,
    icon: '🚣',
    instructions: [
      'Sit with knees slightly bent and feet secured on the footrests.',
      'Grasp the V-grip handle and sit upright with a neutral spine.',
      'Pull the handle into your abdomen while squeezing shoulder blades together.',
      'Extend arms slowly back to the starting point without rounding your back.'
    ],
    tips: 'Do not rock back and forth excessively; maintain an upright torso.',
    safetyNotes: 'Keep your lower back straight and avoid rounding forward.'
  },
  {
    id: 'back_onearm_db_row',
    name: 'One-Arm Dumbbell Row',
    category: 'back',
    difficulty: 'intermediate',
    equipment: 'dumbbells',
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Rear Deltoid'],
    defaultSets: 3,
    defaultReps: 10,
    defaultDuration: null,
    restTime: 60,
    icon: '🏋️',
    instructions: [
      'Place one knee and one hand on a flat bench with your torso parallel to the ground.',
      'Hold a dumbbell in the opposite hand with arm hanging straight down.',
      'Pull the dumbbell upward toward your hip crease, keeping your elbow tucked close.',
      'Lower the weight back down slowly for a full stretch in your lats.'
    ],
    tips: 'Avoid twisting your torso at the top; keep hips and shoulders square.',
    safetyNotes: 'Keep your spine flat and avoid letting your head drop down.'
  },
  {
    id: 'back_barbell_bent_row',
    name: 'Barbell Bent-Over Row',
    category: 'back',
    difficulty: 'advanced',
    equipment: 'barbell',
    targetMuscles: ['Lats', 'Rhomboids', 'Trapezius', 'Erector Spinae', 'Forearms'],
    defaultSets: 4,
    defaultReps: 8,
    defaultDuration: null,
    restTime: 90,
    icon: '🏋️‍♂️',
    instructions: [
      'Stand with feet shoulder-width apart, bend knees slightly, and hinge forward at hips until torso is roughly 45 degrees.',
      'Grip the barbell with an overhand grip slightly wider than knees.',
      'Pull the bar up toward your belly button by squeezing shoulder blades.',
      'Lower the bar under control without rounding your lumbar spine.'
    ],
    tips: 'Brace your core tightly as if preparing to take a punch.',
    safetyNotes: 'If you feel strain in your lower back, reduce weight and reset hip hinge.'
  },
  {
    id: 'back_band_row',
    name: 'Resistance Band Row',
    category: 'back',
    difficulty: 'beginner',
    equipment: 'resistance bands',
    targetMuscles: ['Upper Back', 'Rhomboids', 'Lats'],
    defaultSets: 3,
    defaultReps: 15,
    defaultDuration: null,
    restTime: 45,
    icon: '🎗️',
    instructions: [
      'Loop a resistance band around your feet while seated with legs extended.',
      'Hold the handles with both hands and maintain tall upright posture.',
      'Pull the bands back toward your ribcage, squeezing your back blades together.',
      'Return smoothly against the resistance of the elastic band.'
    ],
    tips: 'Hold the peak contraction for 1 full second on each repetition.',
    safetyNotes: 'Inspect bands for tears or frays before anchoring.'
  },

  // ==========================================
  // SHOULDERS (6)
  // ==========================================
  {
    id: 'sh_pike_pushups',
    name: 'Pike Push-ups',
    category: 'shoulders',
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    targetMuscles: ['Anterior Deltoids', 'Triceps', 'Upper Traps'],
    defaultSets: 3,
    defaultReps: 10,
    defaultDuration: null,
    restTime: 60,
    icon: '📐',
    instructions: [
      'Start in a standard push-up position and walk your feet forward so your hips rise into an inverted V shape.',
      'Keep your arms straight and hands placed slightly wider than shoulders.',
      'Lower the top of your head diagonally forward toward the floor between your hands.',
      'Press firmly through your palms to return back to the inverted V shape.'
    ],
    tips: 'Look toward your toes rather than looking at your hands to maintain cervical alignment.',
    safetyNotes: 'Do not allow your shoulders to collapse into your neck.'
  },
  {
    id: 'sh_db_press',
    name: 'Dumbbell Shoulder Press',
    category: 'shoulders',
    difficulty: 'intermediate',
    equipment: 'dumbbells',
    targetMuscles: ['Anterior & Lateral Deltoids', 'Triceps', 'Upper Trapezius'],
    defaultSets: 4,
    defaultReps: 10,
    defaultDuration: null,
    restTime: 75,
    icon: '🏋️',
    instructions: [
      'Sit on an upright bench or stand tall with dumbbells held at ear level, palms facing forward.',
      'Press dumbbells overhead until arms are extended, converging gently at the top.',
      'Lower the dumbbells back down under control to ear level over 2 seconds.'
    ],
    tips: 'Avoid hyperextending your lower back by engaging your core and glutes.',
    safetyNotes: 'Do not drop the weights abruptly; lower them back smoothly.'
  },
  {
    id: 'sh_lateral_raises',
    name: 'Dumbbell Lateral Raises',
    category: 'shoulders',
    difficulty: 'beginner',
    equipment: 'dumbbells',
    targetMuscles: ['Lateral Deltoids (Side Delts)'],
    defaultSets: 3,
    defaultReps: 15,
    defaultDuration: null,
    restTime: 45,
    icon: '🦅',
    instructions: [
      'Stand tall holding light dumbbells at your sides with palms facing inward.',
      'Keep a slight bend in your elbows and raise arms out to the sides until parallel with the floor.',
      'Pause briefly at shoulder height, then lower with control.'
    ],
    tips: 'Lead with your elbows and imagine pouring water from pitchers at the top.',
    safetyNotes: 'Use light weight; swinging your torso robs work from the lateral head.'
  },
  {
    id: 'sh_front_raises',
    name: 'Front Dumbbell Raises',
    category: 'shoulders',
    difficulty: 'beginner',
    equipment: 'dumbbells',
    targetMuscles: ['Anterior Deltoids'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 45,
    icon: '🏹',
    instructions: [
      'Stand holding dumbbells resting against the front of your thighs.',
      'Raise one or both arms straight forward until reaching eye level.',
      'Lower smoothly back to starting position.'
    ],
    tips: 'Do not lean back as the weights rise.',
    safetyNotes: 'Keep wrists firm and avoid bending elbows excessively.'
  },
  {
    id: 'sh_rear_delt_fly',
    name: 'Rear Delt Fly',
    category: 'shoulders',
    difficulty: 'intermediate',
    equipment: 'dumbbells',
    targetMuscles: ['Posterior Deltoids', 'Rhomboids'],
    defaultSets: 3,
    defaultReps: 15,
    defaultDuration: null,
    restTime: 45,
    icon: '🦋',
    instructions: [
      'Hinge forward at your hips until your torso is nearly parallel to the floor.',
      'Hold light dumbbells hanging down with palms facing each other.',
      'Raise your arms out to the sides like wings until level with your shoulders.',
      'Squeeze the back of your shoulders at the top, then lower with control.'
    ],
    tips: 'Focus on pulling with the back of your shoulders, not your biceps.',
    safetyNotes: 'Keep your spine flat and neutral throughout the set.'
  },
  {
    id: 'sh_arnold_press',
    name: 'Arnold Press',
    category: 'shoulders',
    difficulty: 'advanced',
    equipment: 'dumbbells',
    targetMuscles: ['All 3 Deltoid Heads', 'Triceps', 'Upper Trapezius'],
    defaultSets: 3,
    defaultReps: 10,
    defaultDuration: null,
    restTime: 75,
    icon: '⚡',
    instructions: [
      'Hold dumbbells in front of your chest at chin height with palms facing inward (supinated).',
      'As you press overhead, rotate your wrists outward so palms face forward at full lockout.',
      'Reverse the rotational movement as you lower dumbbells back to the chest.'
    ],
    tips: 'Perform the rotation fluidly throughout the pressing arc.',
    safetyNotes: 'Do not bang dumbbells together at the top.'
  },

  // ==========================================
  // ARMS (6)
  // ==========================================
  {
    id: 'arm_bicep_curl',
    name: 'Dumbbell Biceps Curl',
    category: 'arms',
    difficulty: 'beginner',
    equipment: 'dumbbells',
    targetMuscles: ['Biceps Brachii', 'Brachialis'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 60,
    icon: '💪',
    instructions: [
      'Stand tall holding dumbbells at sides with palms facing forward.',
      'Pin your elbows to your sides and curl the weights up toward your shoulders.',
      'Squeeze your biceps hard at the peak, then lower slowly over 2 seconds.'
    ],
    tips: 'Keep your upper arms stationary; do not swing your elbows forward.',
    safetyNotes: 'Avoid leaning back to cheat the weight upward.'
  },
  {
    id: 'arm_hammer_curl',
    name: 'Hammer Curl',
    category: 'arms',
    difficulty: 'beginner',
    equipment: 'dumbbells',
    targetMuscles: ['Brachioradialis', 'Brachialis', 'Biceps'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 60,
    icon: '🔨',
    instructions: [
      'Hold dumbbells with a neutral grip (palms facing each other).',
      'Curl the weights upward while keeping palms facing each other throughout the rep.',
      'Lower under control to full arm extension.'
    ],
    tips: 'Great for building forearm thickness and grip strength.',
    safetyNotes: 'Do not rock your hips.'
  },
  {
    id: 'arm_concentration_curl',
    name: 'Concentration Curl',
    category: 'arms',
    difficulty: 'intermediate',
    equipment: 'dumbbells',
    targetMuscles: ['Biceps Peak (Short Head)'],
    defaultSets: 3,
    defaultReps: 10,
    defaultDuration: null,
    restTime: 45,
    icon: '🎯',
    instructions: [
      'Sit on a bench with legs spread and rest the back of your tricep against your inner thigh.',
      'Curl the dumbbell toward your face without moving your elbow off your leg.',
      'Pause for a peak contraction at the top before lowering.'
    ],
    tips: 'This completely isolates the biceps by eliminating momentum.',
    safetyNotes: 'Do not slouch excessively; keep chest open.'
  },
  {
    id: 'arm_triceps_dips',
    name: 'Bench Triceps Dips',
    category: 'arms',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    targetMuscles: ['Triceps Brachii', 'Front Deltoids'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 60,
    icon: '🪑',
    instructions: [
      'Sit on the edge of a bench and place hands next to hips with fingers gripping the edge.',
      'Slide hips off the bench with knees bent at 90 degrees (or legs straight for harder variation).',
      'Bend elbows to 90 degrees to lower hips toward the floor.',
      'Press through your palms back up to full arm extension.'
    ],
    tips: 'Keep your back skimming close to the edge of the bench.',
    safetyNotes: 'Do not dip deeper than 90 degrees to protect the shoulder anterior capsule.'
  },
  {
    id: 'arm_triceps_extension',
    name: 'Overhead Dumbbell Triceps Extension',
    category: 'arms',
    difficulty: 'intermediate',
    equipment: 'dumbbells',
    targetMuscles: ['Triceps Long Head'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 60,
    icon: '💡',
    instructions: [
      'Sit or stand holding one dumbbell overhead with both hands cup-gripping the upper weight plate.',
      'Keep your upper arms pointing toward the ceiling near your ears.',
      'Bend elbows to lower the weight behind your head.',
      'Extend arms overhead to return to the top position.'
    ],
    tips: 'Keep your elbows from flaring out excessively.',
    safetyNotes: 'Ensure a secure grip before taking the weight over your head.'
  },
  {
    id: 'arm_triceps_pushdown',
    name: 'Cable Triceps Pushdown',
    category: 'arms',
    difficulty: 'beginner',
    equipment: 'cable machine',
    targetMuscles: ['Lateral & Medial Triceps Heads'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 60,
    icon: '⚙️',
    instructions: [
      'Attach a straight bar or rope to a high cable pulley.',
      'Tuck your elbows tightly against your ribs and grip the attachment.',
      'Push down until arms are completely extended and triceps are locked out.',
      'Return up to 90 degrees with control.'
    ],
    tips: 'Only your forearms should move; keep upper arms locked in place.',
    safetyNotes: 'Avoid using your body weight to press the cable down.'
  },

  // ==========================================
  // LEGS (12)
  // ==========================================
  {
    id: 'leg_bodyweight_squat',
    name: 'Bodyweight Squats',
    category: 'legs',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    defaultSets: 3,
    defaultReps: 15,
    defaultDuration: null,
    restTime: 45,
    icon: '🦵',
    instructions: [
      'Stand with feet shoulder-width apart, toes turned slightly out at 15 degrees.',
      'Extend arms forward for balance and send hips back as if sitting into a chair.',
      'Descend until thighs are at least parallel with the floor while keeping chest tall.',
      'Drive through your whole foot (heels and midfoot) to stand back up.'
    ],
    tips: 'Keep knees tracking directly in line with your second toe.',
    safetyNotes: 'Do not allow your knees to cave inward during the ascent.'
  },
  {
    id: 'leg_goblet_squat',
    name: 'Goblet Squats',
    category: 'legs',
    difficulty: 'intermediate',
    equipment: 'dumbbells',
    targetMuscles: ['Quadriceps', 'Glutes', 'Core', 'Upper Back'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 60,
    icon: '🏆',
    instructions: [
      'Hold a dumbbell or kettlebell vertically against your chest with both hands under the top horn.',
      'Squat down between your legs until elbows touch the inside of your knees.',
      'Keep your torso upright and drive back up to standing.'
    ],
    tips: 'The front-loaded weight automatically assists in keeping your torso upright.',
    safetyNotes: 'Do not let the weight pull your upper back into a round posture.'
  },
  {
    id: 'leg_barbell_squat',
    name: 'Barbell Back Squats',
    category: 'legs',
    difficulty: 'advanced',
    equipment: 'barbell',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Core'],
    defaultSets: 4,
    defaultReps: 8,
    defaultDuration: null,
    restTime: 90,
    icon: '🏋️‍♂️',
    instructions: [
      'Step under the racked barbell and rest it securely across your upper traps.',
      'Unrack the bar and take two clean steps back to set your stance.',
      'Take a deep belly breath, brace your core, and squat down to parallel depth.',
      'Drive powerfully up through the floor, exhaling past the sticking point.'
    ],
    tips: 'Screw your feet into the floor to activate your glutes and create hip stability.',
    safetyNotes: 'Always set safety catch bars to appropriate depth in the rack.'
  },
  {
    id: 'leg_lunges',
    name: 'Forward Lunges',
    category: 'legs',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Balance'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 45,
    icon: '🚶',
    instructions: [
      'Stand tall with feet hip-width apart and hands on hips.',
      'Take a large step forward and lower your hips until both knees are bent at 90 degrees.',
      'Your back knee should hover just an inch above the floor.',
      'Push through your front heel to return back to starting stance.'
    ],
    tips: 'Keep your torso vertical; avoid leaning forward onto your front thigh.',
    safetyNotes: 'Do not let the front knee collapse inward.'
  },
  {
    id: 'leg_reverse_lunges',
    name: 'Reverse Lunges',
    category: 'legs',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    targetMuscles: ['Glutes', 'Hamstrings', 'Quadriceps'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 45,
    icon: '🔙',
    instructions: [
      'From a standing position, step backward with one foot.',
      'Lower your hips straight down into a 90-degree bend in both legs.',
      'Drive through the front heel to return to standing.'
    ],
    tips: 'Reverse lunges place substantially less shear stress on the knee joint.',
    safetyNotes: 'Step straight back, not crossing behind your front foot.'
  },
  {
    id: 'leg_bulgarian_split_squat',
    name: 'Bulgarian Split Squats',
    category: 'legs',
    difficulty: 'advanced',
    equipment: 'dumbbells',
    targetMuscles: ['Quadriceps', 'Gluteus Medius & Maximus', 'Hamstrings'],
    defaultSets: 3,
    defaultReps: 10,
    defaultDuration: null,
    restTime: 75,
    icon: '⚡',
    instructions: [
      'Stand about two feet in front of a bench and place the top of one foot on the bench behind you.',
      'Lower your back knee toward the ground while keeping front shin relatively vertical.',
      'Drive through your front foot to ascend back to the top.'
    ],
    tips: 'Lean your torso forward 15 degrees to shift more activation directly into the glutes.',
    safetyNotes: 'Hold onto a wall for stability if balance is challenging at first.'
  },
  {
    id: 'leg_step_ups',
    name: 'Step-ups',
    category: 'legs',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    targetMuscles: ['Quadriceps', 'Glutes'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 45,
    icon: '🪜',
    instructions: [
      'Place your right foot fully onto a sturdy bench or plyo box.',
      'Drive through your right foot to lift your body up until right leg is straight.',
      'Step down with control and repeat for assigned repetitions before switching legs.'
    ],
    tips: 'Do not bounce off your back toe; let the working leg do 95% of the lift.',
    safetyNotes: 'Use a stable box that does not wobble.'
  },
  {
    id: 'leg_romanian_deadlift',
    name: 'Romanian Deadlift (RDL)',
    category: 'legs',
    difficulty: 'intermediate',
    equipment: 'dumbbells',
    targetMuscles: ['Hamstrings', 'Glutes', 'Erector Spinae'],
    defaultSets: 4,
    defaultReps: 10,
    defaultDuration: null,
    restTime: 75,
    icon: '🏋️',
    instructions: [
      'Stand holding dumbbells against the front of your thighs with a slight bend in knees.',
      'Push your hips backward as if touching a wall behind you while sliding dumbbells down shins.',
      'Stop when you feel a deep stretch in your hamstrings (usually mid-shin).',
      'Contract your glutes and drive hips forward to return to standing.'
    ],
    tips: 'This is a horizontal hip-hinge, NOT a vertical squat.',
    safetyNotes: 'Never round your back; keep chest proud and shoulders back.'
  },
  {
    id: 'leg_press',
    name: 'Leg Press',
    category: 'legs',
    difficulty: 'beginner',
    equipment: 'leg press',
    targetMuscles: ['Quadriceps', 'Glutes'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 60,
    icon: '⚙️',
    instructions: [
      'Sit in the leg press seat with your back and head resting flat against the pad.',
      'Place feet shoulder-width on the sled platform.',
      'Release safety handles and lower the platform until knees are at 90 degrees.',
      'Press through feet back to extended legs without locking knees out.'
    ],
    tips: 'Never lock your knees out completely at the top.',
    safetyNotes: 'Keep your lower back and tailbone pressed firmly into the back pad.'
  },
  {
    id: 'leg_extension',
    name: 'Leg Extension',
    category: 'legs',
    difficulty: 'beginner',
    equipment: 'leg extension machine',
    targetMuscles: ['Rectus Femoris (Quadriceps)'],
    defaultSets: 3,
    defaultReps: 15,
    defaultDuration: null,
    restTime: 45,
    icon: '⚙️',
    instructions: [
      'Sit on the machine with knees aligned with the pivot axis and shin pad just above ankles.',
      'Extend your legs until knees are straight, squeezing quadriceps hard at the peak.',
      'Lower smoothly back to starting position.'
    ],
    tips: 'Hold the top contraction for 1 second on each rep.',
    safetyNotes: 'If you have patellar knee issues, do not use excessive weight.'
  },
  {
    id: 'leg_curl',
    name: 'Hamstring Leg Curl',
    category: 'legs',
    difficulty: 'beginner',
    equipment: 'leg curl machine',
    targetMuscles: ['Hamstrings (Biceps Femoris)'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 45,
    icon: '⚙️',
    instructions: [
      'Lie face down on the leg curl machine with roller pad positioned right above your heels.',
      'Curl the pad up toward your buttocks as far as possible.',
      'Lower under strict control back down.'
    ],
    tips: 'Keep hips pinned to the bench; do not let your lower back arch.',
    safetyNotes: 'Control the descent; do not let the weight stack slam.'
  },
  {
    id: 'leg_calf_raises',
    name: 'Standing Calf Raises',
    category: 'legs',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    targetMuscles: ['Gastrocnemius', 'Soleus'],
    defaultSets: 4,
    defaultReps: 20,
    defaultDuration: null,
    restTime: 30,
    icon: '🩰',
    instructions: [
      'Stand tall on the balls of your feet on a step with heels hanging off.',
      'Lower heels down into a full calf stretch.',
      'Press through the big toes to raise heels as high as possible.',
      'Hold the contraction at the top for 1 full second.'
    ],
    tips: 'Do not bounce; control both the stretch and the squeeze.',
    safetyNotes: 'Hold a wall or railing for balance.'
  },

  // ==========================================
  // CORE (8)
  // ==========================================
  {
    id: 'core_plank',
    name: 'Forearm Plank',
    category: 'core',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Glutes', 'Shoulders'],
    defaultSets: 3,
    defaultReps: null,
    defaultDuration: 45,
    restTime: 45,
    icon: '🪵',
    instructions: [
      'Place forearms on the floor with elbows aligned directly under shoulders.',
      'Step feet back and lift hips so body forms a horizontal line.',
      'Squeeze glutes, brace abs, and maintain neutral neck gazing at the floor.'
    ],
    tips: 'Actively pull elbows toward toes to create high tension irradiation.',
    safetyNotes: 'Do not let your hips sag toward the floor.'
  },
  {
    id: 'core_side_plank',
    name: 'Side Plank',
    category: 'core',
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    targetMuscles: ['Obliques', 'Quadratus Lumborum', 'Gluteus Medius'],
    defaultSets: 3,
    defaultReps: null,
    defaultDuration: 30,
    restTime: 45,
    icon: '📐',
    instructions: [
      'Lie on your side with forearm flat on the ground and elbow under shoulder.',
      'Stack your feet and elevate your hips until your body forms a straight diagonal line.',
      'Hold this position while breathing smoothly.'
    ],
    tips: 'Keep top hip pressed slightly forward to avoid twisting.',
    safetyNotes: 'Drop the bottom knee to the floor if full stack causes hip fatigue.'
  },
  {
    id: 'core_crunches',
    name: 'Abdominal Crunches',
    category: 'core',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    targetMuscles: ['Upper Rectus Abdominis'],
    defaultSets: 3,
    defaultReps: 20,
    defaultDuration: null,
    restTime: 30,
    icon: '🧘',
    instructions: [
      'Lie on back with knees bent and feet flat on floor hip-width apart.',
      'Place fingertips lightly behind ears without yanking on the neck.',
      'Curl your ribcage down toward your pelvis to lift shoulder blades 3 inches off the ground.',
      'Exhale and squeeze, then lower with control.'
    ],
    tips: 'Imagine holding an apple between your chin and collarbone.',
    safetyNotes: 'Never pull on the back of your head.'
  },
  {
    id: 'core_bicycle_crunches',
    name: 'Bicycle Crunches',
    category: 'core',
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    targetMuscles: ['Obliques', 'Rectus Abdominis'],
    defaultSets: 3,
    defaultReps: 20,
    defaultDuration: null,
    restTime: 45,
    icon: '🚲',
    instructions: [
      'Lie on back with hands behind head and legs lifted into tabletop position.',
      'Bring right elbow toward left knee while extending left leg out straight.',
      'Switch sides fluidly in a bicycle pedaling motion.',
      'Keep movement deliberate rather than rushing for speed.'
    ],
    tips: 'Focus on rotating from the thoracic spine, not just elbow flapping.',
    safetyNotes: 'Keep lower back pressed flat into the floor.'
  },
  {
    id: 'core_leg_raises',
    name: 'Lying Leg Raises',
    category: 'core',
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    targetMuscles: ['Lower Rectus Abdominis', 'Hip Flexors'],
    defaultSets: 3,
    defaultReps: 15,
    defaultDuration: null,
    restTime: 45,
    icon: '⬆️',
    instructions: [
      'Lie flat on back with legs straight and hands under lower glutes for lumbar support.',
      'Keep legs straight and raise them together until vertical (90 degrees).',
      'Lower legs slowly until heels hover 2 inches above the ground.',
      'Repeat without letting heels rest on the floor.'
    ],
    tips: 'Press your lower back into the floor throughout the entire movement.',
    safetyNotes: 'If your lower back arches off the mat, bend knees slightly.'
  },
  {
    id: 'core_mountain_climbers',
    name: 'Mountain Climbers',
    category: 'core',
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    targetMuscles: ['Core', 'Shoulders', 'Cardiovascular System'],
    defaultSets: 3,
    defaultReps: 30,
    defaultDuration: null,
    restTime: 45,
    icon: '🧗',
    instructions: [
      'Start in a high plank position with shoulders directly above wrists.',
      'Drive your right knee up toward your chest, then quickly switch and drive left knee.',
      'Continue alternating knees in a rhythmic running cadence.'
    ],
    tips: 'Keep hips level with shoulders; avoid bouncing your rear end high in the air.',
    safetyNotes: 'Land lightly on the balls of your feet.'
  },
  {
    id: 'core_russian_twists',
    name: 'Russian Twists',
    category: 'core',
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    targetMuscles: ['Internal & External Obliques', 'Rectus Abdominis'],
    defaultSets: 3,
    defaultReps: 20,
    defaultDuration: null,
    restTime: 45,
    icon: '🔄',
    instructions: [
      'Sit with knees bent, lean torso back at 45 degrees, and lift feet slightly off the floor.',
      'Clasp hands in front of chest and rotate torso to tap the floor on the right side.',
      'Rotate across to tap the floor on the left side to complete one rep.'
    ],
    tips: 'Turn your whole shoulders and chest, not just your hands.',
    safetyNotes: 'Keep feet on the floor if you experience lower back instability.'
  },
  {
    id: 'core_dead_bug',
    name: 'Dead Bug',
    category: 'core',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    targetMuscles: ['Deep Core', 'Pelvic Stability', 'Coordination'],
    defaultSets: 3,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 30,
    icon: '🪲',
    instructions: [
      'Lie on back with arms extended toward ceiling and knees bent at 90 degrees above hips.',
      'Slowly lower right arm back overhead while simultaneously extending left leg straight down.',
      'Hover right before floor, then return and alternate with left arm and right leg.'
    ],
    tips: 'Maintain absolute lumbar contact with the ground at all times.',
    safetyNotes: 'Do not allow lower spine to lift off the floor.'
  },

  // ==========================================
  // CARDIO (7)
  // ==========================================
  {
    id: 'cardio_jumping_jacks',
    name: 'Jumping Jacks',
    category: 'cardio',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    targetMuscles: ['Full Body', 'Cardiovascular System', 'Calves'],
    defaultSets: 3,
    defaultReps: null,
    defaultDuration: 60,
    restTime: 30,
    icon: '⭐',
    instructions: [
      'Stand upright with feet together and arms resting at sides.',
      'Jump feet out to the sides while sweeping arms overhead to touch hands.',
      'Jump back to starting stance and repeat in continuous rhythmic fashion.'
    ],
    tips: 'Land softly on the balls of your feet with knees slightly bent.',
    safetyNotes: 'Wear supportive athletic footwear.'
  },
  {
    id: 'cardio_high_knees',
    name: 'High Knees',
    category: 'cardio',
    difficulty: 'intermediate',
    equipment: 'bodyweight',
    targetMuscles: ['Hip Flexors', 'Quadriceps', 'Cardiovascular System'],
    defaultSets: 3,
    defaultReps: null,
    defaultDuration: 45,
    restTime: 45,
    icon: '🏃',
    instructions: [
      'Run in place while driving knees up toward hip height with every stride.',
      'Pump arms rhythmically in coordination with leg movement.',
      'Maintain an upright posture without leaning back.'
    ],
    tips: 'Stay light on your toes and keep a rapid, energetic cadence.',
    safetyNotes: 'Land softly to reduce impact on ankle joints.'
  },
  {
    id: 'cardio_burpees',
    name: 'Burpees',
    category: 'cardio',
    difficulty: 'advanced',
    equipment: 'bodyweight',
    targetMuscles: ['Full Body', 'Chest', 'Quads', 'Core', 'Cardiovascular System'],
    defaultSets: 3,
    defaultReps: 10,
    defaultDuration: null,
    restTime: 60,
    icon: '💥',
    instructions: [
      'From standing, drop into a squat and place hands on the floor.',
      'Kick feet back into a high plank and lower chest to the floor.',
      'Push up, snap feet back toward hands, and leap vertically with hands overhead.'
    ],
    tips: 'Step feet back one at a time to reduce intensity if needed.',
    safetyNotes: 'Do not allow lower back to sag when kicking out into the plank.'
  },
  {
    id: 'cardio_jump_rope',
    name: 'Jump Rope',
    category: 'cardio',
    difficulty: 'intermediate',
    equipment: 'jump rope',
    targetMuscles: ['Calves', 'Forearms', 'Cardiovascular System', 'Coordination'],
    defaultSets: 4,
    defaultReps: null,
    defaultDuration: 60,
    restTime: 45,
    icon: '🪢',
    instructions: [
      'Hold jump rope handles at hip height with elbows close to ribs.',
      'Turn rope using small wrist circles rather than sweeping arm swings.',
      'Jump only 1 to 2 inches off the floor to clear the rope.'
    ],
    tips: 'Keep jumps small and relaxed.',
    safetyNotes: 'Ensure adequate ceiling clearance.'
  },
  {
    id: 'cardio_running',
    name: 'Running / Jogging',
    category: 'cardio',
    difficulty: 'beginner',
    equipment: 'treadmill',
    targetMuscles: ['Cardiovascular System', 'Legs', 'Stamina'],
    defaultSets: 1,
    defaultReps: null,
    defaultDuration: 900,
    restTime: 60,
    icon: '🏃‍♂️',
    instructions: [
      'Maintain an upright running posture with slight forward lean from the ankles.',
      'Land with midfoot underneath your center of gravity.',
      'Breathe rhythmically in sync with your footsteps.'
    ],
    tips: 'Start with a conversational pace where you can speak short sentences.',
    safetyNotes: 'Hydrate well before and after longer runs.'
  },
  {
    id: 'cardio_cycling',
    name: 'Stationary Cycling',
    category: 'cardio',
    difficulty: 'beginner',
    equipment: 'exercise bike',
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Cardiovascular System'],
    defaultSets: 1,
    defaultReps: null,
    defaultDuration: 900,
    restTime: 60,
    icon: '🚴',
    instructions: [
      'Adjust seat height so there is a slight 10-15 degree bend in knee at bottom of pedal stroke.',
      'Maintain steady cadence between 80 and 95 RPM.',
      'Keep shoulders relaxed away from ears.'
    ],
    tips: 'Low-impact option ideal for active recovery days.',
    safetyNotes: 'Ensure seat pin is fully locked before mounting.'
  },
  {
    id: 'cardio_rowing',
    name: 'Rowing Machine',
    category: 'cardio',
    difficulty: 'intermediate',
    equipment: 'rowing machine',
    targetMuscles: ['Back', 'Legs', 'Arms', 'Core', 'Cardiovascular System'],
    defaultSets: 3,
    defaultReps: null,
    defaultDuration: 300,
    restTime: 60,
    icon: '🚣‍♂️',
    instructions: [
      'Catch: Knees bent, arms extended forward, shins vertical.',
      'Drive: Push with legs first, swing torso back, then pull handle into lower ribs.',
      'Recovery: Extend arms, hinge torso forward, then slide knees back to catch.'
    ],
    tips: '60% of the rowing power comes from legs, 20% from core, 20% from arms.',
    safetyNotes: 'Never pull with arms before legs have completed their drive.'
  },

  // ==========================================
  // MOBILITY & STRETCHING (6)
  // ==========================================
  {
    id: 'mob_cat_cow',
    name: 'Cat-Cow Flow',
    category: 'mobility',
    difficulty: 'beginner',
    equipment: 'yoga mat',
    targetMuscles: ['Spine Mobility', 'Thoracic Extension', 'Core'],
    defaultSets: 2,
    defaultReps: 10,
    defaultDuration: null,
    restTime: 30,
    icon: '🐈',
    instructions: [
      'Start on hands and knees with wrists under shoulders and knees under hips.',
      'Cow: Inhale, drop belly toward floor, lift tailbone and gaze upward.',
      'Cat: Exhale, round spine up toward ceiling, tuck chin and tailbone.'
    ],
    tips: 'Move smoothly with your breath cycle without forcing the range.',
    safetyNotes: 'Gentle mobility; do not push into sharp pain.'
  },
  {
    id: 'mob_hip_flexor',
    name: 'Kneeling Hip Flexor Stretch',
    category: 'mobility',
    difficulty: 'beginner',
    equipment: 'yoga mat',
    targetMuscles: ['Iliopsoas (Hip Flexors)', 'Rectus Femoris'],
    defaultSets: 2,
    defaultReps: null,
    defaultDuration: 30,
    restTime: 30,
    icon: '🧘',
    instructions: [
      'Kneel on one knee with opposite foot flat in front at a 90-degree angle.',
      'Tuck pelvis under (posterior tilt) and squeeze back glute.',
      'Shift hips gently forward until you feel a deep stretch along the front of the back hip.'
    ],
    tips: 'Keep torso upright; do not hyperextend lower back.',
    safetyNotes: 'Place a folded towel under the knee if floor is hard.'
  },
  {
    id: 'mob_hamstring_stretch',
    name: 'Standing Hamstring Stretch',
    category: 'mobility',
    difficulty: 'beginner',
    equipment: 'bodyweight',
    targetMuscles: ['Hamstrings', 'Calves'],
    defaultSets: 2,
    defaultReps: null,
    defaultDuration: 30,
    restTime: 30,
    icon: '🦵',
    instructions: [
      'Place one heel on a low step or prop, leg straight with toes pointing up.',
      'Hinge at hips with a flat back and lean chest toward thigh.',
      'Hold position while taking slow deep breaths.'
    ],
    tips: 'Bend the supporting knee slightly for stability.',
    safetyNotes: 'Never bounce during static stretches.'
  },
  {
    id: 'mob_shoulder_dislocates',
    name: 'Shoulder Mobility Pass-Throughs',
    category: 'mobility',
    difficulty: 'beginner',
    equipment: 'resistance bands',
    targetMuscles: ['Shoulder Rotators', 'Chest', 'Upper Back'],
    defaultSets: 2,
    defaultReps: 12,
    defaultDuration: null,
    restTime: 30,
    icon: '🔄',
    instructions: [
      'Hold a band or broomstick with a wide overhand grip in front of your hips.',
      'Keeping arms straight, lift overhead and rotate smoothly behind your back.',
      'Reverse the circular movement to bring arms back to front.'
    ],
    tips: 'Widen your grip if your elbows have to bend to clear the shoulders.',
    safetyNotes: 'Never force through shoulder pinching.'
  },
  {
    id: 'mob_worlds_greatest',
    name: "World's Greatest Stretch",
    category: 'mobility',
    difficulty: 'intermediate',
    equipment: 'yoga mat',
    targetMuscles: ['Hips', 'Thoracic Spine', 'Hamstrings', 'Ankles'],
    defaultSets: 2,
    defaultReps: 6,
    defaultDuration: null,
    restTime: 30,
    icon: '🌍',
    instructions: [
      'Step forward into a deep lunge and place both hands flat inside your front foot.',
      'Drop your back knee slightly and reach your front-side elbow toward the floor.',
      'Rotate your torso and extend that arm straight up toward the ceiling, looking up.',
      'Return hand down, push hips up to stretch front hamstring, and switch sides.'
    ],
    tips: 'The ultimate all-in-one athletic mobility movement.',
    safetyNotes: 'Breathe deeply through the thoracic rotation.'
  },
  {
    id: 'mob_childs_pose',
    name: "Child's Pose",
    category: 'mobility',
    difficulty: 'beginner',
    equipment: 'yoga mat',
    targetMuscles: ['Lats', 'Lower Back', 'Hips', 'Shoulders'],
    defaultSets: 1,
    defaultReps: null,
    defaultDuration: 60,
    restTime: 30,
    icon: '🙏',
    instructions: [
      'Kneel on the floor with big toes touching and knees spread wide.',
      'Sit your hips back onto your heels and walk your hands forward on the floor.',
      'Rest your forehead on the ground and lengthen your spine.',
      'Breathe deeply into your lower back and ribs.'
    ],
    tips: 'A restorative relaxation pose ideal for ending any workout.',
    safetyNotes: 'If knees are sensitive, bring knees closer together.'
  }
];

/**
 * Filter exercises by category or equipment
 */
export const ExerciseHelper = {
  getByCategory(cat) {
    if (!cat || cat === 'all') return EXERCISES;
    return EXERCISES.filter(ex => ex.category === cat);
  },

  getById(id) {
    return EXERCISES.find(ex => ex.id === id) || null;
  },

  filter(query = '', category = 'all', equipment = 'all') {
    return EXERCISES.filter(ex => {
      const matchCat = category === 'all' || ex.category === category;
      const matchEquip = equipment === 'all' || ex.equipment === equipment;
      const q = query.trim().toLowerCase();
      const matchQuery = !q || ex.name.toLowerCase().includes(q) || ex.targetMuscles.some(m => m.toLowerCase().includes(q));
      return matchCat && matchEquip && matchQuery;
    });
  }
};
