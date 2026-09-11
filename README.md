````markdown
# ⚡ FitQuest

> A gamified fitness and body-transformation web application that turns workouts, daily habits, progress tracking, and fitness education into an interactive progression journey.

**Application type:** Static client-side web application  
**Architecture:** HTML + modular CSS + JavaScript, with a self-contained bundled runtime  
**Deployment configuration:** Vercel  
**Data persistence:** Browser `localStorage`  
**Backend / server API:** None detected in the project

---

## 📌 Overview

FitQuest is a browser-based fitness experience designed around the idea of turning personal fitness into a game. Users can create or access an athlete profile, complete a multi-step fitness onboarding flow, receive a generated workout schedule, run individual workout sessions, complete daily quests, earn XP, unlock progression tiers and achievements, review nutrition guidance, explore a height and spinal-alignment knowledge hub, and track progress through visual analytics.

The application is implemented entirely on the client side. User accounts, workout state, progress, quests, achievements, measurements, mood history, preferences, and related application data are stored locally in the browser rather than being synchronized with a remote backend.

---

## ✨ Features

### 🎮 Gamified Fitness Progression

- XP-based fitness progression system
- 10 progressive fitness tiers
- Level-up rewards and cinematic level-up feedback
- Achievement and badge system
- Daily quests with individual XP rewards
- Daily activity streak tracking
- Longest-streak tracking
- Supportive comeback messaging after missed days

### 🏋️ Personalized Workout Planning

- Five-step fitness onboarding wizard
- Experience-level selection
- Activity-level selection
- Primary fitness goal selection
- Session-duration selection
- Training-days-per-week selection
- Equipment selection
- Preferred workout time
- Automatically generated workout schedules
- Goal-aware sets, repetitions, and rest-time adjustments
- Training split selection based on weekly frequency

The workout engine supports different planning patterns including:

- Full Body Foundational Split
- Upper / Lower Power Split
- Push / Pull / Legs Athletic Split

### ⚡ Active Workout Experience

- Dedicated active workout runner
- Exercise-by-exercise progression
- Set and repetition targets
- Rest timer functionality
- Workout completion summaries
- XP rewards after completing workouts
- Automatic completion of the daily workout quest
- Workout-completion celebration modal

### 📚 Exercise Library

- 60 exercise definitions are included in the exercise dataset
- Exercise categories and difficulty levels
- Equipment requirements
- Default sets, repetitions, and rest times
- Exercise descriptions
- Step-by-step form guidance
- Coach tips
- Safety guidance
- Exercise detail modal

### 🎯 Daily Quest System

FitQuest generates a daily quest board containing activities such as:

- Dynamic warm-up
- Daily workout completion
- Hydration target
- Mobility routine
- Daily movement walk
- Training-progress logging
- Bonus push-up challenge

Quest completion and reversal dynamically adjust XP.

### 🥗 Nutrition

The nutrition module includes:

- Homemade whole-food nutrition plans
- Vegetarian meal plan
- Non-vegetarian meal plan
- Vegan meal plan
- Meal timing information
- Approximate calories and macros for listed meals
- Educational supplement guide
- Nutrition safety / medical disclaimers

### 📏 Height & Spinal Alignment Hub

The application contains an educational height and spinal-alignment section covering topics such as:

- Growth-plate biology
- Human growth hormone and IGF-1
- Intervertebral-disc decompression
- Genetics and environmental factors
- Lifestyle-related considerations
- Nutrition information
- Yoga and mobility routines
- Decompression-oriented exercises
- Height-related educational content

> **Important:** The height section contains health and nutrition claims authored in the application itself. It should be treated as educational application content rather than medical advice. Some claims should be independently medically reviewed before being presented as clinical guidance.

### 📈 Progress Analytics

- Weekly workout-volume chart
- XP progression visualization
- Body-measurement logging support
- Workout-history-based analytics
- Responsive procedural SVG charts
- No external charting library detected

### 🧠 Wellness & Motivation

- Mood / energy check-in system
- Motivational quotes
- Hindi shayari and English translations
- Supportive streak messaging
- Audio feedback for important interactions
- Optional sound and animation preferences

### 🎨 Premium UI / 3D Experience

- Custom 3D visual system
- Animated SVG workout transition scene
- CSS 3D cards and interaction effects
- Ambient canvas-based visual effects
- Workout celebration effects
- Level-up cinematic modal
- Responsive layouts
- Light/dark UI styling system implemented through CSS variables
- Inter and Plus Jakarta Sans typography via Google Fonts

---

## 🛠️ Tech Stack

| Category | Technology / Implementation |
|---|---|
| Markup | HTML5 |
| Styling | CSS3, CSS Custom Properties, Responsive CSS |
| Programming | JavaScript (ES6+) |
| UI | Vanilla JavaScript + custom HTML/CSS components |
| 3D / Visuals | CSS 3D, SVG, HTML Canvas, procedural effects |
| Charts | Procedural SVG |
| Audio | Browser Web Audio APIs / procedural audio implementation |
| State Management | Custom reactive `AppState` module |
| Persistence | Browser `localStorage` |
| Authentication | Client-side demo authentication |
| Deployment | Vercel configuration included |
| Fonts | Google Fonts — Inter and Plus Jakarta Sans |
| Build Artifact | Self-contained `js/app.bundle.js` |

No framework such as React, Vue, Angular, or a backend framework was detected in the uploaded project.

No external database, REST API client, Firebase, Supabase, MongoDB, MySQL, PostgreSQL, IndexedDB, or service worker implementation was detected.

---

## 🏗️ Architecture

FitQuest follows a client-side modular architecture. The original application logic is divided into focused JavaScript modules, while `app.bundle.js` contains a self-contained bundled runtime used by the HTML entry point.

```text
                         ┌──────────────────────┐
                         │      index.html      │
                         │   Application Shell  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   app.bundle.js      │
                         │  Bundled Runtime     │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
       │  AppState    │      │ Navigation   │      │  Effects3D   │
       │ State / Flow │      │ Screen Router │      │ Visual FX    │
       └──────┬───────┘      └──────────────┘      └──────────────┘
              │
      ┌───────┼─────────┬──────────────┬──────────────┐
      ▼       ▼         ▼              ▼              ▼
   Storage  Auth     Workout        Quests        Achievements
             │       Engine         Engine           │
             │         │              │              │
             └─────────┴──────────────┴──────────────┘
                              │
                              ▼
                       Browser localStorage
````

### Core runtime flow

1. `App.init()` initializes application state, visual effects, navigation, onboarding, and the height module.
2. Authentication state determines whether the user sees the landing page, onboarding, or dashboard.
3. `Onboarding` collects the athlete profile and passes it to `WorkoutEngine`.
4. `WorkoutEngine` filters the exercise pool according to equipment and generates a schedule based on goal, experience, duration, and weekly frequency.
5. `AppState` stores the resulting plan and tracks XP, streaks, quests, achievements, workouts, mood, measurements, and settings.
6. `Storage` serializes user data into browser `localStorage`.
7. Individual modules render their respective screens through the central `App` coordinator.

---

## 📂 Project Structure

The following structure reflects the uploaded project while excluding the internal `.git` directory from the public documentation view.

```text
improve you way/
├── index.html
├── vercel.json
│
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── 3d-system.css
│   ├── components.css
│   ├── screens.css
│   └── responsive.css
│
└── js/
    ├── app.js
    ├── app.bundle.js
    ├── state.js
    ├── storage.js
    ├── auth.js
    ├── navigation.js
    ├── onboarding.js
    ├── workout-engine.js
    ├── workout-runner.js
    ├── exercises.js
    ├── quests.js
    ├── levels.js
    ├── achievements.js
    ├── streak.js
    ├── diet.js
    ├── height-growth.js
    ├── mood.js
    ├── motivational.js
    ├── progress.js
    ├── profile.js
    ├── notifications.js
    ├── audio.js
    └── 3d-effects.js
```

### Important files

| File                   | Purpose                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `index.html`           | Main application shell, screens, modals, forms, and UI markup |
| `js/app.js`            | Master application coordinator and screen rendering logic     |
| `js/app.bundle.js`     | Self-contained bundled runtime loaded by `index.html`         |
| `js/state.js`          | Central reactive user/application state manager               |
| `js/storage.js`        | Browser persistence and local user-data isolation             |
| `js/auth.js`           | Client-side registration, login, demo login, and logout       |
| `js/onboarding.js`     | Five-step athlete onboarding wizard                           |
| `js/workout-engine.js` | Personalized workout-plan generation                          |
| `js/workout-runner.js` | Active workout execution flow                                 |
| `js/exercises.js`      | Exercise dataset and helper functionality                     |
| `js/quests.js`         | Daily quest generation and XP calculation                     |
| `js/levels.js`         | 10-tier XP progression system                                 |
| `js/achievements.js`   | Achievement definitions and unlock evaluation                 |
| `js/streak.js`         | Daily and longest-streak tracking                             |
| `js/diet.js`           | Nutrition plans and educational supplement content            |
| `js/height-growth.js`  | Height and spinal-alignment knowledge/routine module          |
| `js/progress.js`       | Procedural SVG progress charts                                |
| `js/3d-effects.js`     | Canvas/SVG/CSS-based visual effects                           |
| `js/audio.js`          | Application sound and procedural audio feedback               |
| `js/navigation.js`     | Multi-screen application navigation                           |
| `vercel.json`          | Vercel routing configuration                                  |

---

## 🚀 Installation & Setup

### Prerequisites

The project is a static client-side application and does not require a backend server or database.

Recommended:

* A modern web browser
* Git, if cloning the repository
* A local static-server workflow if you want to test it through HTTP
* A Vercel account for Vercel deployment

### Clone the Repository

```bash
git clone <repository-url>
cd "improve you way"
```

> The uploaded project does not contain a verified public repository URL, so the repository URL is intentionally left as a placeholder.

### Run Locally

The bundled application is designed to work as a self-contained browser application. The bundle itself explicitly supports direct `file:///` usage as well as HTTP/HTTPS environments.

You can therefore open:

```text
index.html
```

in a modern browser for a simple local test.

For development, using a local static server is generally preferable. For example, with a static-server tool already installed on your machine:

```bash
<your-static-server-command>
```

No project-specific package manager configuration such as `package.json` was included in the uploaded project, so an exact npm development command cannot be confirmed from the source.

---

## ⚙️ Environment Variables

No `.env` file or required environment-variable configuration was detected.

The application stores its runtime data in browser `localStorage` and does not contain a detected server-side API configuration.

---

## 🗄️ Database

No external database is used by the uploaded application.

FitQuest persists application data through browser storage using keys including:

```text
fitquest_users_v1
fitquest_active_user_v1
fitquest_user_data_<username>
```

Stored data includes user profile information, XP, level, streak state, completed workouts, daily quests, achievements, workout plans, diet preferences, mood history, measurements, and application settings.

This means data is tied to the browser/device where the application is used and is not automatically synchronized across devices.

---

## 🔐 Authentication & Security

FitQuest contains a client-side authentication flow with:

* User registration
* Username validation
* Email-format validation
* Password-length validation
* Duplicate-username detection
* Login/logout flow
* Persistent active-user state
* One-click demo athlete login

### Security limitation

This authentication implementation is intended for a client-side application/demo and **must not be treated as production-grade authentication**.

The source stores registration passwords directly in browser `localStorage` data. There is no server-side authentication, password hashing service, secure session management, authorization backend, or remote identity provider detected in the project.

For a production release, authentication should be moved to a secure backend or established identity provider with appropriate password hashing, session/token security, authorization, transport security, and data protection.

---

## 🎯 Usage

### First-time user flow

```text
Landing Page
     │
     ▼
Create Athlete Account
     │
     ▼
5-Step Fitness Onboarding
     │
     ▼
Personalized Workout Plan
     │
     ▼
Dashboard
     │
     ├── Start Workout
     ├── Daily Quests
     ├── Nutrition
     ├── Height Hub
     ├── Achievements
     ├── Progress
     └── Profile
```

### Typical workflow

1. Open FitQuest.
2. Create an athlete account or use the built-in Quick Demo.
3. Complete the fitness onboarding questionnaire.
4. Select your experience, activity level, fitness goal, session duration, weekly frequency, equipment, and preferred workout time.
5. Generate the personalized training schedule.
6. Start the scheduled workout from the dashboard.
7. Complete sets and rest intervals using the active workout runner.
8. Receive XP and streak updates after completion.
9. Complete additional daily quests for more XP.
10. Review achievements, nutrition guidance, progress charts, and profile information.

---

## 🏆 Progression System

FitQuest defines 10 XP-based progression tiers:

| Level | Title          | XP Required |
| ----: | -------------- | ----------: |
|     1 | Beginning      |           0 |
|     2 | Consistency    |         300 |
|     3 | Foundation     |         750 |
|     4 | Builder        |       1,400 |
|     5 | Stronger       |       2,200 |
|     6 | Discipline     |       3,200 |
|     7 | Athlete        |       4,500 |
|     8 | Advanced       |       6,000 |
|     9 | Elite          |       8,000 |
|    10 | Transformation |      10,500 |

Each tier includes a title, rank, badge, description, and an associated unlock/perk defined by the application.

---

## 📊 Progress Analytics

The progress module generates charts directly as SVG, avoiding a third-party charting dependency.

Implemented visualizations include:

* Weekly workout activity columns for Monday through Sunday
* XP progression trendline
* Current XP visualization
* Workout-history-based activity counts

The XP trend visualization can synthesize intermediate points when detailed historical XP points are not available.

---

## 🎨 UI & Design System

The styling is separated into multiple CSS layers:

* `variables.css` — design tokens and CSS custom properties
* `base.css` — foundational layout and global styling
* `3d-system.css` — 3D interaction and visual-effect primitives
* `components.css` — reusable interface components
* `screens.css` — application-screen-specific styling
* `responsive.css` — responsive behavior and mobile adjustments

The interface uses a premium fitness-dashboard visual language with:

* Layered cards
* Gradient accents
* 3D transforms
* Animated transitions
* Interactive tilt effects
* SVG illustrations
* Canvas effects
* Modal celebrations
* Responsive navigation

---

## 🌐 Deployment

A `vercel.json` file is included with the project.

Its routing configuration sends incoming paths to `index.html`, allowing the application to behave as a single client-side application when deployed through Vercel.

A verified production deployment URL was **not** included in the uploaded project, so no live URL is claimed here.

### Vercel deployment

After connecting the repository to Vercel, the project can be deployed as a static web application. No backend service or database provisioning is required by the current source code.

---

## 🖼️ Screens / Application Areas

The HTML application contains the following major screens:

* Landing
* Authentication
* Onboarding
* Dashboard
* Height Hub
* Active Workout Runner
* Exercise Library
* Daily Quests
* Nutrition
* Achievements
* Progress
* Profile

The project also includes workout-detail, workout-completion, and level-up modal experiences.

---

## 🧪 Testing Notes

No automated test suite or test configuration was detected in the uploaded project.

Recommended manual verification areas include:

* Account registration and duplicate usernames
* Login/logout behavior
* Quick Demo flow
* Five-step onboarding
* Workout-plan generation for different goals and equipment combinations
* Active workout progression and rest timers
* XP and level-up transitions
* Quest completion and XP reversal
* Streak behavior across dates
* Achievement unlocking
* Progress-chart rendering
* Profile and data-reset functionality
* Responsive behavior across desktop and mobile widths
* Browser storage persistence

---

## ⚠️ Important Implementation Notes

### Client-side data model

Because all user data is stored locally, clearing browser storage can remove application data. The current architecture also does not provide cloud backup or multi-device synchronization.

### Demo account

The application contains a built-in Quick Demo flow that creates/uses the `alex_demo` athlete and initializes a preconfigured workout plan, XP, level, and streak state when needed.

### Health-related content

The project includes fitness, nutrition, supplementation, and height-related educational material. Some statements are presented with strong numerical or physiological claims. These should be medically reviewed before the application is used as a source of health advice.

### Production readiness

The visual and interaction layer is substantial, but the current client-only authentication and storage architecture means the project should be considered a **portfolio/demo web application rather than a production SaaS fitness platform** unless a secure backend and data architecture are added.

---

## 🔮 Future Improvements

The following are logical next steps based on the current implementation; they are **not currently implemented features**:

* Add secure server-side authentication
* Hash passwords using a proven password-hashing algorithm
* Add a real database and user synchronization
* Add cloud backup and multi-device support
* Add automated unit and integration tests
* Add a production build/package configuration
* Add CI checks for linting and testing
* Add server-side authorization and API protection
* Add real account recovery and email verification
* Add configurable privacy/data-export controls
* Add verified deployment and project demo links
* Review health and nutrition content with qualified professionals

---

## 🤝 Contributing

Contributions are welcome if this repository is opened for collaboration.

```bash
git clone <repository-url>
cd "improve you way"

# Create a feature branch
git checkout -b feature/your-feature

# Make your changes, then commit
git add .
git commit -m "Add your feature"

git push origin feature/your-feature
```

Then open a pull request with a clear description of the change and any relevant testing notes.

---

## 📄 License

No license file or explicit license declaration was detected in the uploaded project.

> **License information has not been specified yet.**

Do not assume that the project is open-source merely because it is stored in Git or presented as a GitHub repository.

---

## 👨‍💻 Author

No verified author profile, GitHub URL, LinkedIn URL, or portfolio URL was included in the uploaded project itself.

> Author information can be added when verified profile links are provided.

---

## 📌 Project Status

**Current implementation:** Feature-rich client-side fitness application / portfolio project.

**Architecture status:** Fully client-side with modular source files and a self-contained JavaScript bundle.

**Backend status:** No backend detected.

**Database status:** Browser `localStorage` only.

**Deployment status:** Vercel configuration included; verified live deployment URL not provided.

---

## Information I may need to provide

The following information could not be verified from the uploaded project:

* GitHub repository URL
* Live deployment URL
* Verified author profile links
* Final license choice
* Official screenshots / showcase images
* Any external services or infrastructure that may exist outside the uploaded source

Everything else documented above is based on the contents and configuration of the uploaded project.

```
This README deliberately avoids claiming a backend, database, production authentication, live URL, license, screenshots, or performance metrics that aren't supported by the uploaded source.
```
