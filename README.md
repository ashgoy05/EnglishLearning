# 🇺🇸 AmeriSpeak — American English Coach

A beautiful 4-page static website to help you sound like a natural American. Built for GitHub Pages.

## Pages

| Page | File | Description |
|------|------|-------------|
| 🏠 Home | `index.html` | Dashboard with today's words, stats, progress, categories |
| 📚 Learn | `learn.html` | Browse all 180 words across 13 categories with 🔊 audio |
| 📖 Reading | `reading.html` | 8 reading passages — click any highlighted word to hear it |
| 🧠 Quiz | `quiz.html` | 4 quiz modes, category filter, score history, XP system |

## Features

- **180 vocabulary words** across 13 real American life categories
- **Text-to-speech audio** on every word and sentence (uses browser's built-in TTS)
- **Reading passages** with 8 real-context stories — click highlighted words
- **4 quiz modes**: Meaning, Word, Sentence fill-in-blank, Category
- **Progress tracking** with XP, streaks, and quiz history (stored locally)
- **Voice & speed controls** — pick your preferred English voice
- **Fully responsive** — works on mobile and desktop
- **No server needed** — runs entirely in the browser

## How to Deploy on GitHub Pages

### Step 1: Create a new repo on GitHub
Go to github.com → New repository → Name it `amerispeak` (or anything you like)

### Step 2: Upload all files
Upload the entire folder contents maintaining this structure:
```
index.html
learn.html
reading.html
quiz.html
css/
  style.css
js/
  shared.js
README.md
```

### Step 3: Enable GitHub Pages
- Go to your repo → Settings → Pages
- Under "Source" select: Deploy from a branch
- Branch: `main`, Folder: `/ (root)`
- Click Save

### Step 4: Access your site
Your site will be live at:
`https://YOUR-USERNAME.github.io/amerispeak/`

For example if your GitHub username is `ashgoy05`:
`https://ashgoy05.github.io/amerispeak/`

## Categories Covered

1. 🏠 Everyday Life — errands, potluck, small talk
2. 💻 Tech & Work — bandwidth, ping, agile, sprint
3. 🛒 Grocery & Food — produce, aisle, deli, coupon
4. 🏥 Medical — copay, deductible, urgent care, PCP
5. 🔑 Home & Housing — HOA, escrow, equity, lease
6. 🚗 Driving — merge, yield, fender bender, DMV
7. 💰 Finance — credit score, 401k, HSA, W-2
8. 🏈 Sports — tailgate, fantasy league, slam dunk
9. 🎓 School — GPA, syllabus, tuition, internship
10. 🌦️ Weather — wind chill, tornado warning, black ice
11. 🎉 Social & Culture — Dutch treat, ghosting, tipping
12. 👨‍👩‍👧 Parenting — playdate, PTA, sleepover, carpool
13. 💬 Idioms — bite the bullet, elephant in the room, etc.

## Vocabulary notes for Indian users
Many terms were chosen specifically because they don't translate directly from Indian culture:
- Insurance: copay, deductible, in-network, prior authorization
- Finance: credit score, 401k, FICO, direct deposit, W-2
- Housing: HOA, escrow, curb appeal, closing costs
- Driving: yield, right of way, DMV, four-way stop
- Social: Dutch treat, RSVP, potluck, ghosting
