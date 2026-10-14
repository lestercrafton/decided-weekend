# Decided.

**You talk. We decide.** Friends say out loud what they'd like to do — this week, this month, or the wild idea that feels unrealistic. Decided. listens for the overlap, searches the area, and hands back one plan: itinerary, map, why, and a book-it path. Nobody has to make the decision, and everybody can see their wish inside the result.

Toronto demo — a zero-dependency static site (no build step, no API keys, no accounts). Voice uses the browser's own speech recognition where available; everything runs locally.

## Run it

```bash
cd weekend-decided
npm start
# open http://localhost:4173
```

## Try the flow (60 seconds)

1. Add your name and one wish (mic or typing) → **Add my wish**.
2. Tap **Simulate a friend** twice more (Maya + Priya bring Korean BBQ and dumpling wishes).
3. Watch the counter hit **3 of 3** — planning unlocks (the host can also call it early).
4. **Plan it for us** → read *We heard you* and *Why this plan* (Chinese + Korean wishes bridge to a Japanese izakaya), check the map, then **Save this**, **Swap dinner**, **Save my day (.ics)**, or add all 5 friends and **Ask for a group deal**.

## Share it on your own GitHub

```bash
cd weekend-decided
git init && git add . && git commit -m "Decided. Toronto demo"
gh repo create decided-weekend --public --source=. --push   # or create the repo on github.com, then add the remote and push
```

For a free public link, enable **Settings → Pages → Deploy from branch (main)** in that repo — the site is static, so Pages serves it as-is.

## The rules baked in

- **Quorum = 3** friends checked in before planning (host can override and plan early).
- **Soft deadline:** wishes close Thursday 8 p.m. for a Saturday plan; late wishes fold into the next plan.
- **Bridges beat winners:** conflicting cravings resolve to a third option that honours both, with the reasoning quoted back to the crew.
- **Wild cards stay:** “unrealistic” wishes become stretch picks, not rejects.

## From demo to real app

Same screens, real plumbing: magic-link sign-in and crew invite links; on-device + server speech-to-text; a planner scoring live Toronto places (open hours, distance between stops, price, group size, weather) against the crew's combined wishes; reservation holds and, for crews of 6+, a venue-approved group-deal ask sent while booking. New cities are a places-data job, not a rewrite.

Demo note: no real bookings are made, no voice leaves the browser, and group-deal replies are simulated and labelled as such.
