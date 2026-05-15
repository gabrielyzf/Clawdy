# ✦ Manifest — Intentional Living App

> Turn vague wishes into clear vision, embodied identity, and trackable action.

Manifest is a personal growth web app built on the principles of intentional manifestation — not magical thinking, but deliberate identity work backed by daily practice. It helps you clarify what you want, identify who you need to become, track evidence of progress, and stay consistent through structured rituals.

---

## ✨ Features

### 🏠 Dashboard
- Greeting + time-of-day awareness
- Manifestation score (0–100 based on vision clarity, beliefs, rituals, evidence)
- Evidence streak counter
- Today's ritual status
- Daily rotating prompt
- Top active visions
- Quick-add buttons

### 🌅 Daily Ritual
5-step guided morning practice:
1. **Energy check-in** — How are you arriving today?
2. **Vision anchor** — Hold your top vision in mind
3. **Prompt reflection** — Write freely to a daily rotating question
4. **Committed action** — Name the one thing you'll do today
5. **Gratitude** — Three things you're grateful for

### 👁️ Visions
Full vision management with rich detail:
- Desired future state
- Identity statement ("I am someone who...")
- Emotional signature
- 90-day milestone
- First visible proof
- Aligned actions
- Resistance → Reframe

### 🧠 Belief Audits
6-step guided belief transformation:
1. What do you want?
2. What do you secretly believe?
3. Where did the belief come from?
4. What does it protect you from?
5. What's a more powerful belief?
6. What action proves the new belief?

### 👁️ Evidence Loop
Track real-world evidence that your vision is working:
- Evidence types: Synchronicity, Opportunity, Compliment, Progress, Inner Shift, External Result
- Evidence streak counter
- List + timeline views
- Filter by type

### 📡 Opportunity Radar
Capture signals and ideas with a 48-hour test framework:
- Why now / who needs this / signal noticed
- Tiny test (48-hour experiment)
- Potential upside
- Energy level (1–5)
- Filter by energy level

### 🔮 Future Self Dialogue
Chat-like interface to consult your future self:
- Contextual responses based on career / financial / relationship / stuck patterns
- 4 response dimensions:
  - What you're overcomplicating
  - What would be obvious if you trusted yourself
  - What to do this week
  - Who you're being invited to become
- Full dialogue history

### ⚙️ Settings
- Profile overview
- Data statistics
- Full data reset
- Privacy disclaimer

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/gabrielyzf/manifest-app.git
cd manifest-app

# Install dependencies
npm install

# Run in development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | LocalStorage (no backend) |
| Routing | Next.js App Router |

**Zero dependencies beyond the core stack.** No external icon libraries, no database, no auth, no external APIs.

---

## 📁 Project Structure

```
app/
├── page.tsx                  # Dashboard
├── layout.tsx                # Root layout
├── globals.css               # Global styles + CSS variables
├── types.ts                  # Full TypeScript type system
├── storage.ts                # LocalStorage helpers + score calculations
├── components/
│   └── Navigation.tsx        # Bottom nav (mobile) + sidebar (desktop)
├── data/
│   ├── prompts.ts            # 20 rotating daily prompts
│   └── futureSelf.ts         # Future self response generator
├── onboarding/page.tsx       # 5-step onboarding
├── ritual/page.tsx           # Daily ritual (5 steps)
├── visions/
│   ├── page.tsx              # Vision list
│   ├── new/page.tsx          # Create vision
│   └── [id]/page.tsx         # Vision detail
├── beliefs/page.tsx          # Belief audit list + guided form
├── evidence/page.tsx         # Evidence loop + timeline
├── opportunities/page.tsx    # Opportunity radar
├── future-self/page.tsx      # Future self dialogue
├── more/page.tsx             # More menu (mobile)
└── settings/page.tsx         # Settings + reset
```

---

## 🗺 Roadmap

- [ ] Export / import data (JSON backup)
- [ ] Vision board with images
- [ ] Weekly review template
- [ ] Push notification reminders (PWA)
- [ ] Multiple active vision support with priority ranking
- [ ] Journal / free writing section
- [ ] Affirmation audio playback
- [ ] Dark mode

---

## 🔒 Privacy

All data is stored exclusively in your browser's LocalStorage. Nothing is ever sent to a server. Clearing browser data will erase the app's data.

---

## ⚠️ Disclaimer

This app is designed for reflection, clarity, and intentional action. It does not guarantee outcomes and is not a substitute for professional medical, psychological, financial, or legal advice.
