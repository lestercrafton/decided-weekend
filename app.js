"use strict";
const $ = (id) => document.getElementById(id);
const QUORUM = 3;

const DEMO_FRIENDS = [
  { name: "Maya", window: "week", text: "I've been craving Korean BBQ for weeks — somewhere we can grill stuff and share everything. Also vintage shopping if we're near Queen West?", vibes: [] },
  { name: "Priya", window: "week", text: "Dumplings. That's the whole wish. Chinese food, ideally hand-pulled noodles or soup dumplings, and nowhere too expensive.", vibes: ["cheap"] },
  { name: "Jess", window: "week", text: "I'm low energy this week. Anything cozy if it rains, not a big club night — maybe a cute bar after dinner?", vibes: ["cozy", "chill"] },
  { name: "Sofia", window: "wild", text: "Okay unrealistic one: Toronto Islands at sunset with a picnic. Or if there's a last-minute concert, I'm always down.", vibes: ["outdoors"] },
  { name: "Taylor", window: "month", text: "Next month I want one fancy night. Rooftop, good cocktails, dress up a little — I'll save up for it.", vibes: ["fancy", "big-night"] },
];

const CUISINES = {
  chinese: ["chinese", "dumpling", "noodle", "dim sum", "hot pot", "hotpot"],
  korean: ["korean", "bbq", "bibimbap", "kimchi"],
  japanese: ["japanese", "sushi", "ramen", "izakaya"],
  italian: ["italian", "pasta", "pizza"],
  mexican: ["mexican", "taco"],
  thai: ["thai"], indian: ["indian", "curry"],
};
const BRIDGES = {
  "chinese+korean": { dinner: "japanese-izakaya", why: "Two of you said Chinese (dumplings, noodles) and one said Korean (BBQ, sharing plates). Rather than picking a winner, dinner leans Japanese izakaya: grilled skewers and shared small plates like the BBQ night you wanted, noodles and dumpling-adjacent bites for the dumpling crew — everyone finds their wish on the table and nobody had to lose." },
  "chinese+japanese": { dinner: "korean-bbq", why: "Chinese and Japanese wishes both point at shared, savoury, order-too-much energy — Korean BBQ is the bridge: you cook together, wrap things, pass plates, and it feels like an event without a fancy price tag." },
  "japanese+korean": { dinner: "korean-bbq", why: "Japanese and Korean wishes share the same heart — grilled, shared, hands-on. Korean BBQ gives you the izakaya-style grazing plus the cook-it-together part, so both cravings land." },
};

const STOPS = {
  brunch: [
    { id: "brunch-kensington", time: "11:00", name: "Brunch in Kensington Market", area: "Kensington Market", tags: ["cheap", "chill", "chinese"], why: "Slow start, cheap eats, and the whole neighbourhood is the plan B if anyone's late.", x: 30, y: 38, q: "Kensington Market Toronto" },
    { id: "brunch-mildred", time: "11:00", name: "Mildred's Temple Kitchen", area: "Liberty Village", tags: ["fancy", "cozy"], why: "The treat-y brunch — famous pancakes, worth dressing up a little for.", x: 18, y: 62, q: "Mildred's Temple Kitchen Toronto" },
  ],
  afternoon: [
    { id: "aft-vintage", time: "13:30", name: "Vintage crawl — Queen West & Ossington", area: "Queen West", tags: ["shopping", "outdoors", "chill"], why: "Vintage and thrift stops strung along one walkable strip, coffee in hand.", x: 24, y: 48, q: "Queen Street West vintage shops Toronto" },
    { id: "aft-ago", time: "13:30", name: "Art Gallery of Ontario", area: "Dundas & McCaul", tags: ["cozy", "indoors", "artsy"], why: "Rain-proof and genuinely good — wander, sit, talk, no agenda inside.", x: 36, y: 42, q: "Art Gallery of Ontario" },
    { id: "aft-islands", time: "15:00", name: "Toronto Islands ferry + sunset picnic (stretch pick)", area: "Harbourfront → Islands", tags: ["outdoors", "wild", "big-night"], why: "The 'unrealistic' wish, kept on purpose: ferries run all afternoon, so the dream is only weather away.", x: 52, y: 88, q: "Toronto Islands ferry" },
    { id: "aft-distillery", time: "13:30", name: "Distillery District wander", area: "Distillery District", tags: ["chill", "outdoors", "fancy"], why: "Cobblestones, galleries, and a slow coffee — easy energy, pretty photos.", x: 62, y: 55, q: "Distillery District Toronto" },
  ],
  dinner: [
    { id: "japanese-izakaya", time: "18:30", name: "Guu Izakaya", area: "Church & Gerrard", tags: ["japanese", "bridge", "big-night"], why: "Loud, joyful, shared plates — the bridge pick (see why below).", x: 48, y: 36, q: "Guu Izakaya Toronto" },
    { id: "korean-bbq", time: "18:30", name: "Korean Village Restaurant", area: "Koreatown, Bloor", tags: ["korean", "bridge"], why: "Grill-it-together BBQ in Koreatown — hands-on and built for a group.", x: 26, y: 24, q: "Korean Village Restaurant Toronto" },
    { id: "chinese-dumplings", time: "18:30", name: "Mother's Dumplings", area: "Spadina, Chinatown", tags: ["chinese", "cheap"], why: "Soup dumplings and hand-pulled noodles, Chinatown prices, zero fuss.", x: 33, y: 40, q: "Mother's Dumplings Toronto" },
    { id: "italian-trattoria", time: "18:30", name: "Terroni", area: "Queen West", tags: ["italian", "fancy", "cozy"], why: "The cozy trattoria option — pasta, low light, long dinner energy.", x: 22, y: 50, q: "Terroni Queen Street Toronto" },
  ],
  evening: [
    { id: "eve-barchef", time: "20:30", name: "BarChef (one fancy cocktail)", area: "Queen West", tags: ["fancy", "big-night"], why: "One theatrical cocktail to end the night — the dress-up moment, without a club.", x: 25, y: 52, q: "BarChef Toronto" },
    { id: "eve-cozybar", time: "20:30", name: "Cozy wine bar — Archive", area: "Dundas West", tags: ["cozy", "chill"], why: "Low, warm, conversational. The low-energy-friendly nightcap.", x: 20, y: 44, q: "Archive wine bar Toronto" },
    { id: "eve-harbour", time: "20:30", name: "Harbourfront evening walk", area: "Queens Quay", tags: ["outdoors", "cheap", "chill"], why: "Free, breezy, skyline views — the night ends outside if the weather holds.", x: 44, y: 74, q: "Harbourfront Centre Toronto" },
  ],
};

let wishes = [];
let demoIndex = 0;
let currentPlan = null;
let dinnerAltIndex = 0;

function detect(text) {
  const t = " " + text.toLowerCase() + " ";
  const cuisines = Object.keys(CUISINES).filter((c) => CUISINES[c].some((w) => t.includes(w)));
  const vibes = [];
  if (/(cheap|broke|budget|save)/.test(t)) vibes.push("cheap");
  if (/(fancy|dress up|rooftop|cocktail|treat)/.test(t)) vibes.push("fancy");
  if (/(cozy|cosy|rain|indoors|warm)/.test(t)) vibes.push("cozy");
  if (/(outside|outdoors|picnic|sunset|park|fresh air|ferry|island)/.test(t)) vibes.push("outdoors");
  if (/(tired|low energy|chill|relax|slow)/.test(t)) vibes.push("chill");
  if (/(club|party|big night|concert|live music)/.test(t)) vibes.push("big-night");
  if (/(vintage|thrift|shopping|market)/.test(t)) vibes.push("shopping");
  if (/(art|gallery|museum)/.test(t)) vibes.push("artsy");
  return { cuisines, vibes };
}

function esc(s) { return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function renderFriends() {
  const list = $("friends-list");
  if (!wishes.length) {
    list.innerHTML = '<li class="empty">Nobody yet — share the invite, or add your wish to start. Waiting for your other friends…</li>';
  } else {
    list.innerHTML = wishes.map((w) => {
      const win = w.window === "wild" ? "Wild card" : w.window === "month" ? "Next month" : "This week";
      return `<li><div class="who"><strong>${esc(w.name)}</strong><span class="badge">${win}</span></div><span class="said">“${esc(w.text)}”</span></li>`;
    }).join("");
  }
  const n = wishes.length;
  $("progress-text").textContent = `${n} of ${QUORUM} friends in`;
  $("progress-hint").textContent = n >= QUORUM ? "That's enough — plan it whenever you're ready." : "Planning unlocks at 3 — or when the host says go.";
  const bar = $("progress-bar");
  bar.setAttribute("aria-valuenow", String(Math.min(n, QUORUM)));
  bar.querySelector("i").style.width = Math.min(100, (n / QUORUM) * 100) + "%";
  $("plan-btn").disabled = n === 0;
  $("plan-btn").textContent = n >= QUORUM ? "Plan it for us" : n >= 1 ? "Plan it for us (host call: plan now)" : "Plan it for us";
  $("deal-text").textContent = n >= 5
    ? `You have ${n} friends in — that's group-deal territory. I'll ask the dinner spot for a group table or set menu while booking.`
    : `You have ${n} friend${n === 1 ? "" : "s"} in. At 5+ I'll try to negotiate a group table or set menu while booking — add more friends to unlock the ask.`;
}

function addWish(name, window, text, vibes) {
  wishes.push({ name: name || "A friend", window, text, vibes: vibes || [] });
  renderFriends();
}

function pick(stops, wanted, avoidIds) {
  let best = stops[0], bestScore = -1;
  for (const s of stops) {
    if (avoidIds && avoidIds.includes(s.id)) continue;
    const score = s.tags.filter((t) => wanted.includes(t)).length;
    if (score > bestScore) { bestScore = score; best = s; }
  }
  return best;
}

function buildPlan() {
  const allText = wishes.map((w) => w.text).join(" ");
  const signals = detect(allText);
  wishes.forEach((w) => (w.vibes || []).forEach((v) => { if (!signals.vibes.includes(v)) signals.vibes.push(v); }));
  const wanted = [...signals.cuisines, ...signals.vibes];
  const pair = [...new Set(signals.cuisines)].sort().join("+");
  const bridge = BRIDGES[pair];
  let dinner, whyBridge;
  if (bridge) { dinner = STOPS.dinner.find((s) => s.id === bridge.dinner); whyBridge = bridge.why; }
  else { dinner = pick(STOPS.dinner, wanted); whyBridge = ""; }
  const brunch = pick(STOPS.brunch, wanted);
  const wildWish = wishes.find((w) => w.window === "wild");
  let afternoon = pick(STOPS.afternoon, wanted);
  if (wildWish && detect(wildWish.text).vibes.includes("outdoors")) afternoon = STOPS.afternoon.find((s) => s.id === "aft-islands");
  const evening = pick(STOPS.evening, wanted);
  const stops = [brunch, afternoon, dinner, evening];
  const heard = wishes.map((w) => {
    const d = detect(w.text);
    const bits = [...d.cuisines, ...d.vibes].slice(0, 3).join(", ") || "good company";
    return `<li><strong>${esc(w.name)}</strong> — “${esc(w.text.length > 90 ? w.text.slice(0, 90) + "…" : w.text)}” <em>(${bits})</em></li>`;
  }).join("");
  const why = whyBridge ||
    `Reading all ${wishes.length} wishes together: the strongest shared signals are ${wanted.slice(0, 4).join(", ") || "good food and each other"}. So the day is built around those — a slow start, one shared-table dinner, and an ending that matches the crew's energy instead of fighting it. Nobody's wish won; the overlap did.`;
  return { stops, heard, why, dinnerId: dinner.id, wanted };
}

function renderPlan(plan) {
  currentPlan = plan;
  $("heard-list").innerHTML = plan.heard;
  $("why-text").textContent = plan.why;
  $("timeline").innerHTML = plan.stops.map((s) => `<li><time>${s.time}</time><span class="stop-name">${esc(s.name)}</span><span class="stop-why">${esc(s.area)} — ${esc(s.why)}</span></li>`).join("");
  $("map").innerHTML = plan.stops.map((s, i) => {
    const next = plan.stops[i + 1];
    const route = next ? `<span class="route" style="left:${s.x}%;top:${s.y}%;width:${Math.hypot(next.x - s.x, next.y - s.y)}%;transform:rotate(${Math.atan2(next.y - s.y, next.x - s.x)}rad)"></span>` : "";
    return `${route}<span class="pin" style="left:${s.x}%;top:${s.y}%">${i + 1}. ${esc(s.area.split(",")[0])}</span>`;
  }).join("");
  $("map-links").innerHTML = plan.stops.map((s) => `<li><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.q)}" target="_blank" rel="noopener">${esc(s.name)} — open in Maps</a></li>`).join("");
  $("book-actions").innerHTML = plan.stops.map((s) => `<a class="btn btn-ghost" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.q)}" target="_blank" rel="noopener">Book / check: ${esc(s.name.split("—")[0].trim())}</a>`).join("");
  $("plan-card").hidden = false;
  $("plan-card").scrollIntoView({ behavior: "smooth", block: "start" });
}

let selectedWindow = "week";
let selectedVibes = [];
$("window-chips").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-window]"); if (!btn) return;
  selectedWindow = btn.dataset.window;
  document.querySelectorAll("#window-chips .chip").forEach((c) => c.classList.toggle("is-on", c === btn));
  $("wish-label").textContent = selectedWindow === "wild" ? "My wild-card wish is…" : selectedWindow === "month" ? "Next month I'd love to…" : "This week I'd love to…";
});
$("vibe-chips").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-vibe]"); if (!btn) return;
  btn.classList.toggle("is-on");
  selectedVibes = [...document.querySelectorAll("#vibe-chips .chip.is-on")].map((c) => c.dataset.vibe);
});

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let recog = null;
if (SR) {
  recog = new SR(); recog.lang = "en-CA"; recog.interimResults = true;
  recog.onresult = (ev) => { $("wish-text").value = [...ev.results].map((r) => r[0].transcript).join(""); };
  recog.onend = () => { $("mic-btn").textContent = "🎙 Talk instead"; $("mic-btn").setAttribute("aria-pressed", "false"); $("voice-status").textContent = "Got it — edit anything, then add your wish."; };
  recog.onerror = () => { $("voice-status").textContent = "Mic didn't work here — typing works just as well."; };
} else { $("voice-status").textContent = "This browser has no speech recognition — typing works just as well."; }
$("mic-btn").addEventListener("click", () => {
  if (!recog) { $("voice-status").textContent = "No speech recognition in this browser — try Chrome, or just type it."; return; }
  try { recog.start(); $("mic-btn").textContent = "■ Stop"; $("mic-btn").setAttribute("aria-pressed", "true"); $("voice-status").textContent = "Listening… say it like you'd say it in the group chat."; }
  catch { recog.stop(); }
});

$("add-wish").addEventListener("click", () => {
  const text = $("wish-text").value.trim();
  if (!text) { $("wish-feedback").textContent = "Say or type one wish first — even 'I dunno, something fun' counts."; return; }
  addWish($("your-name").value.trim() || "You", selectedWindow, text, selectedVibes);
  $("wish-text").value = ""; $("wish-feedback").textContent = "Heard you. It's in the mix — waiting for your other friends.";
});
$("simulate-btn").addEventListener("click", () => {
  if (demoIndex >= DEMO_FRIENDS.length) { $("wish-feedback").textContent = "That's the whole demo crew — hit 'Plan it for us'."; return; }
  const f = DEMO_FRIENDS[demoIndex++]; addWish(f.name, f.window, f.text, f.vibes);
});
$("invite-btn").addEventListener("click", async () => {
  const msg = `Join my Decided. crew (${$("crew-code").textContent}) — just tap and say what you want to do this weekend, I'll let it decide for us: ${location.href.split("#")[0]}#demo`;
  try { await navigator.clipboard.writeText(msg); $("wish-feedback").textContent = "Invite copied — paste it in the group chat."; }
  catch { $("wish-feedback").textContent = msg; }
});
$("plan-btn").addEventListener("click", () => {
  if (!wishes.length) return;
  if (wishes.length < QUORUM) $("plan-btn").dataset.host = "1";
  renderPlan(buildPlan());
});
$("rsvp-yes").addEventListener("click", () => { $("rsvp-status").textContent = "You're in. (Demo: in the real app the crew sees this and the booking hold starts.)"; });
$("rsvp-no").addEventListener("click", () => { $("rsvp-status").textContent = "No hard feelings — that's literally what the button is for. Swap dinner or save the plan and we'll re-plan around you."; });
$("swap-btn").addEventListener("click", () => {
  if (!currentPlan) return;
  dinnerAltIndex++;
  const alts = STOPS.dinner.filter((s) => s.id !== currentPlan.dinnerId);
  const dinner = alts[dinnerAltIndex % alts.length];
  currentPlan.stops[2] = dinner; currentPlan.dinnerId = dinner.id;
  currentPlan.why = `Dinner swapped to ${dinner.name} (${dinner.area}). Same crew signals, different table — the rest of the day didn't have to change. That's the point: swap one stop, not the whole plan.`;
  renderPlan(currentPlan);
});
$("save-btn").addEventListener("click", () => {
  if (!currentPlan) return;
  const saved = JSON.parse(localStorage.getItem("decided-saved") || "[]");
  saved.push({ at: new Date().toLocaleString(), stops: currentPlan.stops.map((s) => `${s.time} ${s.name}`) });
  localStorage.setItem("decided-saved", JSON.stringify(saved)); renderSaved();
  $("save-status").textContent = "Saved on this device. Send it to the crew with 'Copy plan to send'.";
});
$("share-btn").addEventListener("click", async () => {
  if (!currentPlan) return;
  const txt = `Decided. made our Saturday plan:\n${currentPlan.stops.map((s) => `${s.time} — ${s.name} (${s.area})`).join("\n")}\nWhy: ${currentPlan.why}`;
  try { await navigator.clipboard.writeText(txt); $("save-status").textContent = "Plan copied — paste it anywhere."; } catch { $("save-status").textContent = txt; }
});
$("ics-btn").addEventListener("click", () => {
  if (!currentPlan) return;
  const dt = (t) => { const d = new Date(); d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7)); const [h, m] = t.split(":"); d.setHours(+h, +m, 0, 0); return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"; };
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Decided//EN", ...currentPlan.stops.map((s) => ["BEGIN:VEVENT", `UID:${s.id}@decided.demo`, `DTSTAMP:${dt("09:00")}`, `DTSTART:${dt(s.time)}`, `SUMMARY:${s.name}`, `LOCATION:${s.area}, Toronto`, "END:VEVENT"].join("\r\n")), "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "decided-saturday.ics"; a.click(); URL.revokeObjectURL(a.href);
  $("save-status").textContent = "Calendar file downloaded — that's your whole day, four taps total.";
});
$("deal-btn").addEventListener("click", () => {
  const n = wishes.length, dinner = currentPlan ? currentPlan.stops[2] : null;
  if (n < 5) { $("deal-status").textContent = `Crew is ${n} right now — group deals usually start at 5–6. Simulate or invite ${5 - n} more friend${5 - n === 1 ? "" : "s"} and I'll make the ask.`; return; }
  $("deal-status").textContent = `Draft sent (demo — nothing real was sent): "Hi ${dinner ? dinner.name : "there"}! We're a crew of ${n} booking Saturday ${dinner ? dinner.time : ""} — do you offer a group table or set menu, and can we split the bill? — Decided." Venue reply (simulated): "We can do the set menu at $45/person for 6+, bill split no problem."`;
});
function renderSaved() {
  const saved = JSON.parse(localStorage.getItem("decided-saved") || "[]");
  $("saved-card").hidden = !saved.length;
  $("saved-list").innerHTML = saved.map((s) => `<li><strong>${esc(s.at)}</strong> — ${s.stops.map(esc).join(" · ")}</li>`).join("");
}
function nextDeadline() {
  const d = new Date(); const add = ((4 - d.getDay() + 7) % 7 || 7); d.setDate(d.getDate() + add); d.setHours(20, 0, 0, 0);
  if (d < new Date()) d.setDate(d.getDate() + 7);
  return d;
}
const deadline = nextDeadline();
$("deadline").textContent = deadline.toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" }) + " (Thu 8pm rule)";
renderSaved(); renderFriends();

