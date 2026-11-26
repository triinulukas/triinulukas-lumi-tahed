import { db, getSetting, setSetting } from './db.js';
import { lumiSvg } from './lumi.js';
import {
  LETTERS, WORDS, SAY, letter, introSay, firstSoundSay, wordSay, spokenSyl, textHash, dayKey,
  emptyProgress, planSession, introduce, applyAnswer, markKnown, isIntroduced, isLearned, LEARNED, KNOWN_START,
} from './logic.js';

const app = document.getElementById('app');
const $ = (sel, root = app) => root.querySelector(sel);
const $$ = (sel, root = app) => [...root.querySelectorAll(sel)];
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- snow ----------
document.getElementById('snow').innerHTML = Array.from({ length: 28 }, (_, i) =>
  `<i style="left:${(i * 37) % 100}%;font-size:${10 + (i % 4) * 6}px;animation-duration:${7 + (i % 5) * 2}s;animation-delay:-${(i * 1.3) % 10}s">❄</i>`).join('');

// ---------- audio ----------
// One shared <audio> element, unlocked by the first tap: iOS blocks sound that doesn't start from a tap.
const player = new Audio();
const SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
document.addEventListener('pointerdown', () => { player.src = SILENT; player.play().catch(() => {}); }, { once: true });
let playToken = 0;
let bundled = new Set();
const ready = fetch('./audio/index.json').then((r) => r.json()).then((l) => { bundled = new Set(l); }).catch(() => {});

function stopAudio() { playToken += 1; player.pause(); document.body.classList.remove('talking'); }

function playUrl(url, token) {
  return new Promise((resolve) => {
    if (token !== playToken) return resolve();
    const end = () => { document.body.classList.remove('talking'); resolve(); };
    player.onended = end;
    player.onerror = end;
    player.src = url;
    document.body.classList.add('talking');
    player.play().catch(end);
  });
}

// item: a sentence, {sound: 'M'} (a parent's recording wins over the bundled voice) or {syl: 'MA'}.
async function urlFor(item) {
  if (item.sound) {
    const own = await db.get('audio', `sound:${item.sound}`);
    if (own) return URL.createObjectURL(own);
    return bundledUrl(letter(item.sound).sound);
  }
  if (item.syl) return bundledUrl(spokenSyl(item.syl));
  return bundledUrl(item);
}
function bundledUrl(text) {
  const h = textHash(text);
  return bundled.has(h) ? `./audio/${h}.m4a` : null;
}

// Plays items one after another; stops as soon as something else is spoken. Resolves when done.
async function speak(items) {
  await ready;
  stopAudio();
  const token = playToken;
  for (const item of items.filter(Boolean)) {
    const url = await urlFor(item);
    if (token !== playToken) return false;
    if (url) await playUrl(url, token);
  }
  return token === playToken;
}

function burst(n = 14) {
  const layer = document.createElement('div');
  layer.className = 'burst';
  layer.innerHTML = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return `<span style="--x:${Math.cos(a) * 160}px;--y:${Math.sin(a) * 200}px">${['❄️', '✨', '⭐'][i % 3]}</span>`;
  }).join('');
  document.body.appendChild(layer);
  navigator.vibrate?.(40);
  setTimeout(() => layer.remove(), 1200);
}

const lumiBox = (cls = '') => `<div class="lumi-box ${cls}" data-lumi>${lumiSvg()}</div>`;
function hop() { const l = $('[data-lumi]'); if (!l) return; l.classList.remove('happy'); void l.offsetWidth; l.classList.add('happy'); }

// ---------- progress ----------
const loadProgress = () => getSetting('progress', emptyProgress());
const saveProgress = (p) => setSetting('progress', p);

// ---------- home ----------
let greeted = false;
function home() {
  stopAudio();
  app.innerHTML = `
    <section class="home">
      <h1 class="title">Lumi tähed</h1>
      ${lumiBox()}
      <div class="home-row">
        <span style="width:76px"></span>
        <button class="play" data-play aria-label="Mängi">❄️</button>
        <button class="round-btn" data-castle aria-label="Jääloss">🏰</button>
      </div>
    </section>
    <button class="parent-door" data-parent aria-label="Vanemale">⚙️</button>`;
  $('[data-lumi]').addEventListener('click', () => { hop(); speak([SAY.hello]); });
  $('[data-play]').addEventListener('click', startSession);
  $('[data-castle]').addEventListener('click', castle);
  parentDoor($('[data-parent]'));
  if (greeted) return;
  greeted = true;
  speak([SAY.hello]);
}

// The parent area opens only after holding the small gear for 2 seconds.
function parentDoor(btn) {
  let t = null;
  const cancel = () => { clearTimeout(t); btn.classList.remove('holding'); };
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); btn.classList.add('holding'); t = setTimeout(() => { cancel(); parent(); }, 2000); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, cancel));
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
}

// ---------- session ----------
async function startSession() {
  const today = dayKey();
  let progress = await loadProgress();
  const rounds = planSession(progress, today);
  if (rounds[0]?.type === 'intro') { progress = introduce(progress, rounds[0].ch, today); await saveProgress(progress); }
  let i = 0; let flakes = 0;

  const ctx = {
    // Records the first answer of a round; returns true if the letter just became "learned".
    async answer(ch, correct) {
      const r = applyAnswer(await loadProgress(), ch, correct, today);
      await saveProgress(r.progress);
      return r.learnedNow;
    },
    async done({ flake = true, learned = false } = {}) {
      if (flake) flakes += 1;
      if (learned) { burst(24); await speak([SAY.learned]); }
      await wait(250);
      next();
    },
    flakes: () => flakes,
  };
  const next = () => (i < rounds.length ? ROUND[rounds[i++].type](rounds[i - 1], ctx) : sessionEnd(flakes));
  await speak([SAY.start]);
  next();
}

// Common layout: Lumi (tap = hear the question again), collected snowflakes, home button.
function gameScreen(stageHtml, ctx, prompt) {
  app.innerHTML = `
    <section class="game">
      <div class="topbar">
        ${lumiBox()}
        <div class="flakes">${'<span>❄️</span>'.repeat(ctx.flakes())}</div>
        <button class="round-btn home-btn" data-home aria-label="Koju">🏠</button>
      </div>
      <div class="stage">${stageHtml}</div>
    </section>`;
  $('[data-home]').addEventListener('click', home);
  $('[data-lumi]').addEventListener('click', () => speak(prompt));
  speak(prompt);
}

const card = (ch, extra = '') => `<button class="card ${extra}" data-ch="${ch}">${ch}</button>`;

function introRound({ ch }, ctx) {
  const l = letter(ch);
  const prompt = [SAY.newLetter, SAY.thisSays, { sound: ch }, introSay(l), SAY.tapIt];
  gameScreen(`<div class="pic">${l.pic}</div>${card(ch, 'big glow')}`, ctx, prompt);
  let taps = 0;
  $('[data-ch]').addEventListener('click', async (e) => {
    taps += 1; burst(8); hop();
    e.currentTarget.classList.remove('glow');
    if (taps < 3) return speak([{ sound: ch }]);
    if (taps === 3 && await speak([{ sound: ch }, pickRandom(SAY.praise)])) ctx.done();
  });
}

// "Kus on M?" or "Millise tähega algab mesilane?" — tap the right letter.
function choiceRound({ type, ch, choices }, ctx) {
  const l = letter(ch);
  const prompt = type === 'find' ? [SAY.findIt, { sound: ch }] : [wordSay(l), firstSoundSay(l)];
  const pic = type === 'firstSound' ? `<div class="pic">${l.pic}</div>` : '';
  gameScreen(`${pic}<div class="choices ${choices.length > 2 ? 'three' : ''}">${choices.map((c) => card(c)).join('')}</div>`, ctx, prompt);
  let firstTry = true; let busy = false; let learned = false;
  $$('[data-ch]').forEach((btn) => btn.addEventListener('click', async () => {
    if (busy) return;
    const picked = btn.dataset.ch;
    if (picked === ch) {
      busy = true;
      if (firstTry) learned = await ctx.answer(ch, true);
      btn.classList.remove('glow'); btn.classList.add('right'); burst(); hop();
      if (await speak([{ sound: ch }, firstTry ? pickRandom(SAY.praise) : null])) ctx.done({ flake: firstTry, learned });
      return;
    }
    if (btn.classList.contains('wrong')) return;
    busy = true;
    if (firstTry) { firstTry = false; await ctx.answer(ch, false); }
    btn.classList.add('wrong');
    $(`[data-ch="${ch}"]`).classList.add('glow');
    await speak([SAY.tryAgain, { sound: picked }, SAY.hereItIs, { sound: ch }, SAY.touchHere]);
    busy = false;
  }));
}

// Blending: hear M, hear A, they slide together: MA.
function syllableRound({ syl }, ctx) {
  const [c, v] = [...syl];
  gameScreen(`<div class="syl">${card(c, 'glow')}${card(v)}</div><div data-slot></div>`, ctx, [SAY.together]);
  const [b1, b2] = $$('[data-ch]');
  let step = 0;
  b1.addEventListener('click', () => {
    if (step === 2) return speak([{ syl }]);
    if (step !== 0) return speak([{ sound: c }]);
    step = 1; b1.classList.remove('glow'); b2.classList.add('glow'); speak([{ sound: c }]);
  });
  b2.addEventListener('click', async () => {
    if (step === 2) return speak([{ syl }]);
    if (step !== 1) return speak([{ sound: v }]);
    step = 2; b2.classList.remove('glow');
    await speak([{ sound: v }]);
    $('.syl').classList.add('merged'); hop(); burst(8);
    await speak([{ sound: c }, { sound: v }, { syl }]);
    nextButton(ctx);
  });
}

// Reading a whole word: tap the letters in order, then the picture appears.
function wordRound({ word }, ctx) {
  const w = WORDS.find((x) => x.w === word);
  const letters = [...word];
  gameScreen(`<div class="pic hidden-pic" data-pic>${w.pic}</div>
    <div class="word">${letters.map((c, i) => `<button class="card ${i === 0 ? 'next' : ''}" data-i="${i}">${c}</button>`).join('')}</div>
    <div data-slot></div>`, ctx, [SAY.readWord]);
  let at = 0;
  $$('[data-i]').forEach((btn) => btn.addEventListener('click', async () => {
    const i = Number(btn.dataset.i);
    if (i !== at) return speak([{ sound: letters[i] }]);
    at += 1;
    btn.classList.remove('next'); btn.classList.add('done');
    $(`[data-i="${at}"]`)?.classList.add('next');
    if (at < letters.length) return speak([{ sound: letters[i] }]);
    await speak([{ sound: letters[i] }]);
    $('[data-pic]').classList.remove('hidden-pic'); burst(); hop();
    await speak([{ syl: word }, SAY.wordWas, { syl: word }, pickRandom(SAY.praise)]);
    nextButton(ctx);
  }));
}

function nextButton(ctx) {
  $('[data-slot]').innerHTML = '<button class="next-btn" data-next aria-label="Edasi">➡️</button>';
  $('[data-next]').addEventListener('click', () => ctx.done());
}

const ROUND = { intro: introRound, find: choiceRound, firstSound: choiceRound, syllable: syllableRound, word: wordRound };

function sessionEnd(flakes) {
  app.innerHTML = `
    <section class="center">
      ${lumiBox()}
      <div class="big-flakes">${'❄️'.repeat(flakes)}</div>
      <div class="home-row" style="justify-content:center;gap:28px">
        <button class="round-btn" data-home aria-label="Koju">🏠</button>
        <button class="round-btn" data-castle aria-label="Jääloss">🏰</button>
      </div>
    </section>`;
  burst(24); hop();
  $('[data-home]').addEventListener('click', home);
  $('[data-castle]').addEventListener('click', castle);
  $('[data-lumi]').addEventListener('click', () => speak([SAY.bye]));
  speak([SAY.bye]);
}

// ---------- ice castle: the child's letter collection ----------
async function castle() {
  const p = await loadProgress();
  const any = LETTERS.some((l) => isLearned(p, l.ch));
  app.innerHTML = `
    <section class="game">
      <div class="topbar">${lumiBox()}<div class="flakes"></div><button class="round-btn home-btn" data-home aria-label="Koju">🏠</button></div>
      <div class="castle">${LETTERS.map((l) => {
        if (isLearned(p, l.ch)) return `<button class="crystal learned" data-ch="${l.ch}">${l.ch}</button>`;
        if (isIntroduced(p, l.ch)) return `<button class="crystal growing" data-ch="${l.ch}">${l.ch}<span class="dots">${'●'.repeat(p.letters[l.ch].box)}${'○'.repeat(LEARNED - p.letters[l.ch].box)}</span></button>`;
        return '<div class="crystal locked">❄</div>';
      }).join('')}</div>
    </section>`;
  $('[data-home]').addEventListener('click', home);
  const say = [any ? SAY.castle : SAY.castleEmpty];
  $('[data-lumi]').addEventListener('click', () => speak(say));
  $$('[data-ch]').forEach((b) => b.addEventListener('click', () => { hop(); speak([{ sound: b.dataset.ch }, introSay(letter(b.dataset.ch))]); }));
  speak(say);
}

// ---------- parent area ----------
async function parent() {
  stopAudio();
  const p = await loadProgress();
  const own = new Set(await Promise.all(LETTERS.map(async (l) => ((await db.get('audio', `sound:${l.ch}`)) ? l.ch : null))));
  const status = (ch) => {
    if (isLearned(p, ch)) return 'selge ✓';
    if (isIntroduced(p, ch)) return `harjutab ${'●'.repeat(p.letters[ch].box)}${'○'.repeat(LEARNED - p.letters[ch].box)}`;
    return 'veel tulemas';
  };
  const known = (ch) => (p.letters[ch]?.box ?? 0) >= KNOWN_START;
  app.innerHTML = `
    <section class="parent">
      <div class="ptop"><h2>Vanemale</h2><button class="pbtn" data-back>← Tagasi lapse juurde</button></div>
      <p>Märgi tähed, mida laps juba tunneb: neid harjutatakse kohe ja need saavad kiiresti „selgeks“.
      Iga päev tuleb kõige rohkem üks uus täht. Täht on selge, kui laps on selle ära tundnud neljal eri päeval.</p>
      <p>🎙️ Kui arvutihääl ütleb mõne hääliku valesti, loe see ise sisse: vajuta, ütle häälik (nt „mmm“), vajuta uuesti.
      Sinu hääl asendab arvutihäält kõikjal.</p>
      <div class="rows">${LETTERS.map((l) => `
        <div class="prow">
          <b>${l.ch}</b>
          <span>${l.pic} ${l.word}<br><small>${status(l.ch)}</small></span>
          <button class="pbtn ${known(l.ch) ? 'on' : ''}" data-known="${l.ch}">${known(l.ch) ? '✓ Tunneb' : 'Tunneb'}</button>
          <span><button class="pbtn" data-hear="${l.ch}">▶</button>
            <button class="pbtn rec" data-rec="${l.ch}">🎙️</button>
            ${own.has(l.ch) ? `<button class="pbtn" data-unrec="${l.ch}" title="Tagasi arvutihäälele">↺</button>` : ''}</span>
        </div>`).join('')}</div>
      <p style="margin-top:18px"><button class="pbtn danger" data-reset>Alusta otsast (kustuta edenemine)</button></p>
    </section>`;
  $('[data-back]').addEventListener('click', home);
  $$('[data-known]').forEach((b) => b.addEventListener('click', async () => {
    const ch = b.dataset.known;
    await saveProgress(markKnown(p, ch, !known(ch), dayKey()));
    parent();
  }));
  $$('[data-hear]').forEach((b) => b.addEventListener('click', () => speak([{ sound: b.dataset.hear }])));
  $$('[data-unrec]').forEach((b) => b.addEventListener('click', async () => { await db.del('audio', `sound:${b.dataset.unrec}`); parent(); }));
  $$('[data-rec]').forEach((b) => b.addEventListener('click', () => record(b)));
  const reset = $('[data-reset]');
  reset.addEventListener('click', async () => {
    if (!reset.dataset.sure) { reset.dataset.sure = '1'; reset.textContent = 'Kindel? Vajuta uuesti'; return; }
    await saveProgress(emptyProgress());
    parent();
  });
}

let recording = null;
async function record(btn) {
  if (recording) { recording.stop(); return; }
  stopAudio();
  const mime = window.MediaRecorder && ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find((m) => MediaRecorder.isTypeSupported(m));
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { btn.textContent = '🚫 mikrofon'; return; }
  const chunks = [];
  const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  rec.onstop = async () => {
    stream.getTracks().forEach((t) => t.stop());
    recording = null;
    await db.put('audio', new Blob(chunks, { type: rec.mimeType || 'audio/mp4' }), `sound:${btn.dataset.rec}`);
    parent();
  };
  rec.start();
  recording = rec;
  btn.classList.add('on'); btn.textContent = '⏹️';
  setTimeout(() => rec.state === 'recording' && rec.stop(), 4000);
}

// ---------- start ----------
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
home();
