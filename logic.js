// Pure learning logic: letters, what Lumi says, spaced repetition and session planning.
// No DOM here, so it can be tested with `npm test`.

export const TTS_SPEAKER = 'mari';

// Teaching order (synthetic phonics): frequent, easy-to-hear sounds first; letters that look
// alike (O/Õ/Ö, A/Ä, U/Ü) come far apart. `sound` is how the voice says the letter's sound,
// `word` is the picture word that starts with it.
export const LETTERS = [
  { ch: 'A', sound: 'aa', word: 'auto', pic: '🚗' },
  { ch: 'M', sound: 'mmm', word: 'mesilane', pic: '🐝' },
  { ch: 'E', sound: 'ee', word: 'elevant', pic: '🐘' },
  { ch: 'I', sound: 'ii', word: 'iglu', pic: '🛖' },
  { ch: 'S', sound: 'sss', word: 'siga', pic: '🐷' },
  { ch: 'O', sound: 'oo', word: 'orav', pic: '🐿️' },
  { ch: 'L', sound: 'lll', word: 'lill', pic: '🌸' },
  { ch: 'U', sound: 'uu', word: 'uss', pic: '🐛' },
  { ch: 'K', sound: 'kõ', word: 'kass', pic: '🐱' },
  { ch: 'N', sound: 'nnn', word: 'nina', pic: '👃' },
  { ch: 'T', sound: 'tõ', word: 'tigu', pic: '🐌' },
  { ch: 'P', sound: 'põ', word: 'pall', pic: '⚽' },
  { ch: 'R', sound: 'rrr', word: 'rong', pic: '🚂' },
  { ch: 'Ä', sound: 'ää', word: 'ämblik', pic: '🕷️' },
  { ch: 'V', sound: 'vvv', word: 'vaal', pic: '🐳' },
  { ch: 'J', sound: 'jjj', word: 'jänes', pic: '🐰' },
  { ch: 'H', sound: 'hhh', word: 'hiir', pic: '🐭' },
  { ch: 'Õ', sound: 'õõ', word: 'õun', pic: '🍎' },
  { ch: 'D', sound: 'dõ', word: 'dinosaurus', pic: '🦕' },
  { ch: 'Ü', sound: 'üü', word: 'ükssarvik', pic: '🦄' },
  { ch: 'G', sound: 'gõ', word: 'gorilla', pic: '🦍' },
  { ch: 'Ö', sound: 'öö', word: 'öökull', pic: '🦉' },
  { ch: 'B', sound: 'bõ', word: 'banaan', pic: '🍌' },
];
export const letter = (ch) => LETTERS.find((l) => l.ch === ch);
export const VOWELS = new Set(['A', 'E', 'I', 'O', 'U', 'Õ', 'Ä', 'Ö', 'Ü']);

// Look-alikes are not used as wrong answers until the target letter is fairly well known.
const LOOKALIKES = [['O', 'Õ', 'Ö'], ['A', 'Ä'], ['U', 'Ü']];
const lookalike = (a, b) => LOOKALIKES.some((g) => g.includes(a) && g.includes(b));

// Short words a beginner can sound out. Shown once every letter in them is learned.
export const WORDS = [
  { w: 'EMA', pic: '👩' }, { w: 'ISA', pic: '👨' }, { w: 'LUMI', pic: '❄️' }, { w: 'SAI', pic: '🍞' },
  { w: 'MESI', pic: '🍯' }, { w: 'AUTO', pic: '🚗' }, { w: 'KASS', pic: '🐱' }, { w: 'KALA', pic: '🐟' },
  { w: 'NINA', pic: '👃' }, { w: 'SUU', pic: '👄' }, { w: 'KUU', pic: '🌙' }, { w: 'PUU', pic: '🌳' },
  { w: 'PALL', pic: '⚽' }, { w: 'LILL', pic: '🌸' }, { w: 'MAJA', pic: '🏠' }, { w: 'MUNA', pic: '🥚' },
  { w: 'TIGU', pic: '🐌' }, { w: 'UKS', pic: '🚪' }, { w: 'ÕUN', pic: '🍎' }, { w: 'JÄÄ', pic: '🧊' },
  { w: 'VESI', pic: '💧' }, { w: 'HIIR', pic: '🐭' }, { w: 'PIIM', pic: '🥛' }, { w: 'RONG', pic: '🚂' },
  { w: 'KOER', pic: '🐶' }, { w: 'ÖÖ', pic: '🌙' }, { w: 'SOKK', pic: '🧦' }, { w: 'TORT', pic: '🎂' },
];

// Fixed sentences. Lumi speaks a list of items one after another:
// a string is a sentence, {sound: 'M'} is the letter's sound, {syl: 'MA'} a syllable or word.
export const SAY = {
  hello: 'Tere! Mina olen Lumi, lumehaldjas. Tule, otsime koos tähti!',
  start: 'Hakkame mängima!',
  newLetter: 'Vaata, uus lumetäht!',
  thisSays: 'See täht ütleb',
  tapIt: 'Puuduta tähte!',
  findIt: 'Kus on',
  sayAgain: 'Ütle minuga koos:',
  tryAgain: 'See on',
  hereItIs: 'Siin on',
  touchHere: 'Puuduta seda!',
  together: 'Paneme kokku!',
  readWord: 'Loeme sõna! Puuduta tähti järjest.',
  wordWas: 'Sa lugesid',
  learned: 'Hurraa! Sa õppisid selgeks uue tähe. See läheb jäälossi!',
  bye: 'Aitäh! Sa olid täna nii tubli. Kohtume homme!',
  castle: 'Siin on jääloss. Siin on kõik tähed, mida sa juba tead!',
  castleEmpty: 'Jääloss ootab sinu esimest tähte!',
  praise: ['Tubli!', 'Jah, õige!', 'Vau, sa leidsid!', 'Imeline!', 'Super!', 'Väga hästi!'],
};
export const introSay = (l) => `Nagu ${l.word}!`;
export const firstSoundSay = (l) => `Millise tähega algab ${l.word}?`;
export const wordSay = (l) => `${cap(l.word)}.`;
const cap = (s) => s[0].toUpperCase() + s.slice(1);

// Syllables (consonant + vowel) the blending game can use, e.g. MA, SI, LU.
export function allSyllables() {
  const out = [];
  for (const c of LETTERS) if (!VOWELS.has(c.ch)) for (const v of LETTERS) if (VOWELS.has(v.ch)) out.push(c.ch + v.ch);
  return out;
}

// Every sentence the app can say. scripts/generate-audio.mjs turns these into bundled audio files.
export function speakableTexts() {
  return [...new Set([
    ...Object.values(SAY).flat(),
    ...LETTERS.flatMap((l) => [l.sound, introSay(l), firstSoundSay(l), wordSay(l)]),
    ...allSyllables().map(spokenSyl),
    ...WORDS.map((w) => spokenSyl(w.w)),
  ])];
}
// Syllables and words are sent lowercase so the voice doesn't spell them as abbreviations.
export const spokenSyl = (s) => s.toLowerCase();

// FNV-1a 32-bit over normalized text; names the audio file for a sentence.
export function textHash(text) {
  const s = String(text).trim().replace(/\s+/g, ' ');
  let h = 0x811c9dc5;
  for (const ch of s) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export function dayKey(date = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

// ---------- progress (spaced repetition, Leitner-style boxes 0–5) ----------
// A letter climbs at most one box per day, so "learned" (box 4) needs practice on several days.
// A wrong answer moves it one box down. Letters the parent marks as known start at box 3.
export const LEARNED = 4;
export const KNOWN_START = 3;
export const SESSION_ROUNDS = 8;

export const emptyProgress = () => ({ letters: {}, lastNewDay: null });
const stat = (p, ch) => p.letters[ch];
export const isIntroduced = (p, ch) => Boolean(stat(p, ch));
export const isLearned = (p, ch) => (stat(p, ch)?.box ?? 0) >= LEARNED;
export const learnedLetters = (p) => LETTERS.filter((l) => isLearned(p, l.ch)).map((l) => l.ch);

export function markKnown(p, ch, known, today) {
  const letters = { ...p.letters };
  if (known) letters[ch] = { box: Math.max(KNOWN_START, letters[ch]?.box ?? 0), right: 0, wrong: 0, upDay: null, since: today, ...pick(letters[ch]) };
  else delete letters[ch];
  return { ...p, letters };
}
const pick = (s) => (s ? { right: s.right, wrong: s.wrong, upDay: s.upDay, since: s.since } : {});

export function introduce(p, ch, today) {
  if (isIntroduced(p, ch)) return p;
  return { ...p, lastNewDay: today, letters: { ...p.letters, [ch]: { box: 0, right: 0, wrong: 0, upDay: null, since: today } } };
}

// Returns the new progress and whether this answer made the letter "learned".
export function applyAnswer(p, ch, correct, today) {
  const s = stat(p, ch) ?? { box: 0, right: 0, wrong: 0, upDay: null, since: today };
  let { box, upDay } = s;
  if (correct && upDay !== today) { box = Math.min(5, box + 1); upDay = today; }
  if (!correct) box = Math.max(0, box - 1);
  const next = { ...s, box, upDay, right: s.right + (correct ? 1 : 0), wrong: s.wrong + (correct ? 0 : 1) };
  return { progress: { ...p, letters: { ...p.letters, [ch]: next } }, learnedNow: s.box < LEARNED && box >= LEARNED };
}

// One new letter a day at most, and only while at most one introduced letter is still shaky.
export function nextNewLetter(p, today) {
  if (p.lastNewDay === today) return null;
  const shaky = LETTERS.filter((l) => isIntroduced(p, l.ch) && stat(p, l.ch).box < 2).length;
  if (shaky > 1) return null;
  return LETTERS.find((l) => !isIntroduced(p, l.ch))?.ch ?? null;
}

// ---------- session planning ----------
// rand: () => number in [0, 1), injectable for tests.
export function planSession(p, today, rand = Math.random) {
  const rounds = [];
  const newCh = nextNewLetter(p, today);
  const prog = newCh ? introduce(p, newCh, today) : p;
  if (newCh) rounds.push({ type: 'intro', ch: newCh });

  const pool = LETTERS.filter((l) => isIntroduced(prog, l.ch)).map((l) => l.ch);
  const solid = LETTERS.filter((l) => (stat(prog, l.ch)?.box ?? 0) >= 2).map((l) => l.ch);
  const syllables = allSyllables().filter((s) => solid.includes(s[0]) && solid.includes(s[1]));
  const words = WORDS.filter((w) => [...w.w].every((c) => isLearned(prog, c)));

  let last = newCh;
  while (rounds.length < SESSION_ROUNDS && pool.length) {
    const r = rand();
    if (words.length && r < 0.15) { rounds.push({ type: 'word', word: pickOne(words, rand).w }); continue; }
    if (syllables.length && r < 0.35) { rounds.push({ type: 'syllable', syl: pickOne(syllables, rand) }); continue; }
    const ch = weightedLetter(prog, pool, last, newCh, rand);
    last = ch;
    const box = stat(prog, ch).box;
    const type = box >= 1 && rand() < 0.4 ? 'firstSound' : 'find';
    rounds.push({ type, ch, choices: choicesFor(ch, box, rand) });
  }
  return rounds;
}

// Weak letters and today's new letter come up more often; never the same letter twice in a row.
function weightedLetter(p, pool, last, newCh, rand) {
  const options = pool.length > 1 ? pool.filter((c) => c !== last) : pool;
  const weights = options.map((c) => (6 - stat(p, c).box) + (c === newCh ? 4 : 0));
  let x = rand() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < options.length; i++) { x -= weights[i]; if (x < 0) return options[i]; }
  return options[options.length - 1];
}

// Two big choices while a letter is new, three once it is known. Look-alikes only from box 3.
export function choicesFor(ch, box, rand = Math.random) {
  const n = box < 2 ? 2 : 3;
  const others = LETTERS.map((l) => l.ch).filter((c) => c !== ch && (box >= 3 || !lookalike(c, ch)));
  const picked = shuffle(others, rand).slice(0, n - 1);
  return shuffle([ch, ...picked], rand);
}

function pickOne(arr, rand) { return arr[Math.floor(rand() * arr.length)]; }
export function shuffle(arr, rand = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
