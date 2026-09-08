/**
 * FITQUEST MOTIVATIONAL ENGINE
 * Curated pool of original fitness wisdom, psychological resilience quotes,
 * and empowering bilingual Shayari for streaks, workouts, and comebacks.
 */

export const Motivational = {
  quotes: {
    discipline: [
      { text: "Discipline is simply choosing between what you want now and what you want most.", author: "FitQuest Philosophy" },
      { text: "Motivation gets you through day one. Unwavering discipline builds the next ten years.", author: "Iron Mindset" },
      { text: "When you don't feel like showing up, that is the exact rep that transforms your character.", author: "Daily Grind" },
      { text: "The weight doesn't get lighter; your will just gets undeniably heavier.", author: "Warrior Code" }
    ],
    strength: [
      { text: "Strength is not built on easy days. It is forged in the silence of your hardest battles.", author: "Inner Forge" },
      { text: "Every heavy lift is proof that your body can handle more than your doubts believed.", author: "Physical Truth" },
      { text: "Your limits are not brick walls; they are milestones waiting to be conquered.", author: "Athletic Spirit" }
    ],
    consistency: [
      { text: "Small daily sessions, compounded over time, conquer mountain-sized goals.", author: "Compound Growth" },
      { text: "Consistency beats talent every single time talent takes a day off.", author: "FitQuest Axiom" },
      { text: "You don't need a heroic workout every day; you just need to show up every day.", author: "Habit Craft" }
    ],
    comeback: [
      { text: "One missed session never erased a journey. Dust off your shoes and conquer today.", author: "Compassionate Return" },
      { text: "A setback is merely the tension on the bow before you shoot forward.", author: "Resilience Protocol" },
      { text: "No guilt. No shame. Just your feet back on the path, one rep at a time.", author: "Grace & Power" }
    ],
    levelup: [
      { text: "A new level unlocked is tangible proof of sweat transformed into greatness.", author: "Ascension" },
      { text: "You just crossed into a higher tier of endurance, power, and mental clarity.", author: "Level Master" },
      { text: "Look how far you've traveled from day one. Celebrate the progress, then set your sight higher.", author: "Peak Performance" }
    ],
    streak: [
      { text: "Your streak is an unbroken chain of promises kept to yourself.", author: "Chain of Will" },
      { text: "Day after day, your dedication is rewriting your personal record book.", author: "Momentum" }
    ]
  },

  shayari: [
    {
      hindi: "रास्ते मुश्किल हों तो कदम रोकना नहीं, आज की मेहनत को कल की ताकत बनाना है।",
      meaning: "When paths get steep, do not halt your steps; turn today's sweat into tomorrow's unbreakable power."
    },
    {
      hindi: "मंज़िल मिले न मिले ये मुकद्दर की बात है, हम कोशिश भी न करें ये तो गलत बात है।",
      meaning: "Outcomes belong to tomorrow, but putting in every ounce of genuine effort belongs to our discipline today."
    },
    {
      hindi: "हवाओं से कह दो अपनी हद में रहें, हम परों से नहीं हौसलों से उड़ते हैं।",
      meaning: "Tell the headwinds to respect their boundary; we do not soar on wings, we soar on pure determination."
    },
    {
      hindi: "गिरते हैं शहसवार ही मैदाने जंग में, वो तिफ़्ल क्या गिरेगा जो घुटनों के बल चले।",
      meaning: "Only champions fall when striving on the field; those who fear exertion never experience the joy of victory."
    },
    {
      hindi: "खुद ही को कर बुलंद इतना कि हर तकदीर से पहले, खुदा बन्दे से खुद पूछे बता तेरी रज़ा क्या है।",
      meaning: "Elevate your discipline so high through daily work that your achievements speak before any doubt can rise."
    },
    {
      hindi: "सफर में धूप तो होगी जो चल सको तो चलो, सभी हैं भीड़ में तुम भी निकल सको तो चलो।",
      meaning: "The journey will test your endurance; step forward from the crowd and carve your own unstoppable trajectory."
    }
  ],

  /**
   * Get a random quote by category
   */
  getQuote(category = 'discipline') {
    const list = this.quotes[category] || this.quotes.discipline;
    const item = list[Math.floor(Math.random() * list.length)];
    return item;
  },

  /**
   * Get a random inspirational Shayari
   */
  getShayari() {
    return this.shayari[Math.floor(Math.random() * this.shayari.length)];
  },

  /**
   * Get combined motivational card content
   */
  getRandomInspiration(category = 'discipline') {
    const quote = this.getQuote(category);
    const sh = this.getShayari();
    return {
      quote: quote.text,
      author: quote.author,
      shayariHindi: sh.hindi,
      shayariEnglish: sh.meaning
    };
  }
};
