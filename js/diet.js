/**
 * FITQUEST NUTRITION & DIET ARCHITECTURE
 * Wholesome homemade nutrition protocols + educational supplement guide with medical disclaimers
 */

export const DIET_PLANS = {
  homemade: {
    title: 'Homemade Whole-Foods Nutrition',
    subtitle: 'Accessible, nutrient-dense everyday staples for sustained athletic energy and recovery.',
    disclaimer: 'Nutritional guidance provided for educational purposes. Consult a qualified clinical nutritionist or physician for personalized dietary needs.',
    meals: {
      vegetarian: [
        {
          name: 'Power Breakfast',
          time: '7:30 AM – 8:30 AM',
          items: ['Rolled Oats with Warm Milk or Soy Milk', '1 Handful Almonds & Walnuts', '1 Banana or Fresh Seasonal Fruit', '1 Tbsp Chia or Flax Seeds'],
          approxCalories: '420 kcal',
          protein: '16g',
          carbs: '58g',
          fats: '14g'
        },
        {
          name: 'Mid-Day Fuel (Lunch)',
          time: '12:30 PM – 1:30 PM',
          items: ['2 Whole-Wheat Rotis or Brown Rice', '1 Large Bowl of Mixed Yellow/Black Dal', '150g Fresh Low-Fat Paneer or Tofu Bhurji', 'Large Green Salad with Lemon Dressing'],
          approxCalories: '560 kcal',
          protein: '28g',
          carbs: '65g',
          fats: '16g'
        },
        {
          name: 'Pre-Workout & Evening Snack',
          time: '4:30 PM – 5:30 PM',
          items: ['Roasted Chickpeas (Chana) or Sprouted Moong Chaat', '1 Cup Green Tea or Warm Water', '1 Crisp Apple or 2 Dates'],
          approxCalories: '210 kcal',
          protein: '9g',
          carbs: '34g',
          fats: '3g'
        },
        {
          name: 'Restorative Dinner',
          time: '7:30 PM – 8:30 PM',
          items: ['Steamed Quinoa or 2 Multigrain Phulkas', 'Sautéed Mixed Vegetables (Spinach, Broccoli, Carrots)', '1 Bowl Thick Curd (Dahi) or Greek Yogurt', 'Moong Dal Khichdi option'],
          approxCalories: '480 kcal',
          protein: '22g',
          carbs: '60g',
          fats: '12g'
        }
      ],
      non_vegetarian: [
        {
          name: 'High-Protein Breakfast',
          time: '7:30 AM – 8:30 AM',
          items: ['3 Whole Scrambled or Boiled Eggs', '2 Slices 100% Whole-Grain Toast', '1 Glass Fresh Papaya or Orange Juice', 'Handful Soaked Almonds'],
          approxCalories: '460 kcal',
          protein: '26g',
          carbs: '42g',
          fats: '18g'
        },
        {
          name: 'Athletic Muscle Lunch',
          time: '12:30 PM – 1:30 PM',
          items: ['150g Grilled Chicken Breast or Fish Curry', '1 Cup Steamed Rice or 2 Rotis', '1 Bowl Tadka Dal or Rajma', 'Cucumber, Onion & Tomato Salad'],
          approxCalories: '580 kcal',
          protein: '42g',
          carbs: '55g',
          fats: '14g'
        },
        {
          name: 'Pre-Workout Fuel',
          time: '4:30 PM – 5:30 PM',
          items: ['2 Boiled Egg Whites on Toast or Banana with Peanut Butter', 'Black Coffee or Water'],
          approxCalories: '220 kcal',
          protein: '12g',
          carbs: '28g',
          fats: '6g'
        },
        {
          name: 'Clean Recovery Dinner',
          time: '7:30 PM – 8:30 PM',
          items: ['150g Baked Fish or Pan-Seared Chicken', 'Stir-Fried Vegetables in Olive Oil', '1 Sweet Potato or Light Lentil Soup'],
          approxCalories: '490 kcal',
          protein: '38g',
          carbs: '40g',
          fats: '13g'
        }
      ],
      vegan: [
        {
          name: 'Plant-Power Breakfast',
          time: '7:30 AM – 8:30 AM',
          items: ['Oatmeal cooked in Almond Milk with Peanut Butter', 'Hemp & Pumpkin Seeds', 'Berries and Sliced Banana'],
          approxCalories: '440 kcal',
          protein: '18g',
          carbs: '62g',
          fats: '16g'
        },
        {
          name: 'Macro Bowl (Lunch)',
          time: '12:30 PM – 1:30 PM',
          items: ['Spiced Tofu Stir Fry (200g)', 'Brown Rice or Quinoa', 'Steamed Edamame & Broccoli', 'Tahini Lemon Dressing'],
          approxCalories: '540 kcal',
          protein: '32g',
          carbs: '58g',
          fats: '18g'
        },
        {
          name: 'Afternoon Energy Snack',
          time: '4:30 PM – 5:30 PM',
          items: ['Mixed Sprout Salad (Moong & Chana) with Lime', '1 Handful Roasted Pumpkin Seeds'],
          approxCalories: '210 kcal',
          protein: '11g',
          carbs: '30g',
          fats: '5g'
        },
        {
          name: 'Sustained Recovery Dinner',
          time: '7:30 PM – 8:30 PM',
          items: ['Rich Black Bean or Lentil Stew', 'Sweet Potato Mash', 'Large Garden Salad with Avocado slices'],
          approxCalories: '470 kcal',
          protein: '22g',
          carbs: '66g',
          fats: '14g'
        }
      ]
    }
  },

  supplement_educational: {
    title: 'Educational Supplement Guide',
    subtitle: 'Evidence-based reference on sports nutrition aids. Supplements are strictly optional; whole foods remain the cornerstone of nutrition.',
    disclaimer: 'SAFETY NOTICE: This guide is educational only and does not constitute medical prescription. Always consult a licensed healthcare professional before beginning any new supplementation.',
    categories: [
      {
        name: 'Whey / Plant Protein',
        purpose: 'Convenient post-workout muscle protein synthesis support.',
        foodAlternative: 'Eggs, Greek Yogurt, Paneer, Chicken, Lentils, Tofu.',
        timing: 'Within 1-2 hours post-workout or between meals.',
        notes: 'Helpful if daily protein targets are difficult to hit via solid food alone.'
      },
      {
        name: 'Creatine Monohydrate',
        purpose: 'Supports cellular ATP replenishment for high-intensity muscular power.',
        foodAlternative: 'Red meat and salmon (naturally in trace quantities).',
        timing: '3-5 grams daily with water; timing is less critical than daily consistency.',
        notes: 'Most extensively researched sports supplement in human literature. Ensure adequate hydration.'
      },
      {
        name: 'Electrolytes & Hydration',
        purpose: 'Replenishes sodium, potassium, and magnesium lost through prolonged sweating.',
        foodAlternative: 'Coconut water, bananas, salted lemon water, spinach.',
        timing: 'During or after intense training sessions exceeding 60 minutes.',
        notes: 'Prevents cramping and muscular sluggishness during heavy summer training.'
      },
      {
        name: 'Omega-3 Fatty Acids',
        purpose: 'Supports joint lubrication, cardiovascular health, and reduces exercise inflammation.',
        foodAlternative: 'Walnuts, chia seeds, flaxseeds, wild salmon.',
        timing: 'Taken with a meal containing dietary fats.',
        notes: 'Look for molecularly distilled formulations.'
      }
    ]
  }
};

export const DietEngine = {
  getPlans() {
    return DIET_PLANS;
  },

  getMeals(preference = 'vegetarian') {
    const p = DIET_PLANS.homemade.meals;
    if (preference === 'non_vegetarian' || preference === 'non-vegetarian') return p.non_vegetarian;
    if (preference === 'vegan') return p.vegan;
    return p.vegetarian;
  },

  getSupplementGuide() {
    return DIET_PLANS.supplement_educational;
  }
};
