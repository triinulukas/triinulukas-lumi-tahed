import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyProgress, planSession, applyAnswer, introduce, markKnown, nextNewLetter, choicesFor,
  isLearned, speakableTexts, textHash, LETTERS, WORDS, SESSION_ROUNDS, LEARNED,
} from '../logic.js';

const seq = (...xs) => { let i = 0; return () => xs[i++ % xs.length]; };

test('first session introduces A and then practises it', () => {
  const rounds = planSession(emptyProgress(), '2026-11-19', seq(0.5, 0.9, 0.1));
  assert.equal(rounds.length, SESSION_ROUNDS);
  assert.deepEqual(rounds[0], { type: 'intro', ch: 'A' });
  for (const r of rounds.slice(1)) {
    assert.equal(r.type, 'find');
    assert.equal(r.ch, 'A');
    assert.equal(r.choices.length, 2);
    assert.ok(r.choices.includes('A'));
    assert.ok(!r.choices.includes('Ä'), 'no look-alike for a brand-new letter');
  }
});

test('only one new letter per day', () => {
  const p = introduce(emptyProgress(), 'A', '2026-11-19');
  assert.equal(nextNewLetter(p, '2026-11-19'), null);
  assert.equal(nextNewLetter(p, '2026-11-20'), 'M');
});

test('no new letter while two letters are still shaky', () => {
  let p = introduce(emptyProgress(), 'A', '2026-11-19');
  p = introduce(p, 'M', '2026-11-20');
  assert.equal(nextNewLetter(p, '2026-11-21'), null);
});

test('a letter climbs at most one box per day and drops on a mistake', () => {
  let p = introduce(emptyProgress(), 'A', 'd1');
  p = applyAnswer(p, 'A', true, 'd1').progress;
  p = applyAnswer(p, 'A', true, 'd1').progress;
  assert.equal(p.letters.A.box, 1);
  p = applyAnswer(p, 'A', false, 'd1').progress;
  assert.equal(p.letters.A.box, 0);
  assert.equal(p.letters.A.right, 2);
  assert.equal(p.letters.A.wrong, 1);
});

test('learned needs practice on four different days', () => {
  let p = introduce(emptyProgress(), 'A', 'd0');
  let learnedNow = false;
  for (const d of ['d1', 'd2', 'd3', 'd4']) ({ progress: p, learnedNow } = applyAnswer(p, 'A', true, d));
  assert.ok(learnedNow);
  assert.ok(isLearned(p, 'A'));
});

test('a letter the parent marks as known is learned after one correct answer', () => {
  let p = markKnown(emptyProgress(), 'K', true, 'd1');
  assert.equal(p.letters.K.box, 3);
  const r = applyAnswer(p, 'K', true, 'd1');
  assert.ok(r.learnedNow);
  p = markKnown(r.progress, 'K', false, 'd1');
  assert.equal(p.letters.K, undefined);
});

test('known letters get three choices and may include look-alikes', () => {
  const c = choicesFor('O', 3, seq(0.01, 0.02, 0.03, 0.5));
  assert.equal(c.length, 3);
  assert.equal(new Set(c).size, 3);
});

test('syllables and words appear once enough letters are known', () => {
  let p = emptyProgress();
  for (const ch of ['E', 'M', 'A', 'S', 'I']) p = markKnown(p, ch, true, 'd0');
  for (const ch of ['E', 'M', 'A', 'S', 'I']) p = applyAnswer(p, ch, true, 'd1').progress;
  const rounds = planSession(p, 'd1', seq(0.05, 0.3, 0.6, 0.2, 0.8));
  const types = new Set(rounds.map((r) => r.type));
  assert.ok(types.has('word'));
  assert.ok(types.has('syllable'));
  for (const r of rounds.filter((x) => x.type === 'word')) assert.ok(['EMA', 'ISA', 'MESI'].includes(r.word));
});

test('every word uses only taught letters', () => {
  const taught = new Set(LETTERS.map((l) => l.ch));
  for (const w of WORDS) for (const c of w.w) assert.ok(taught.has(c), `${w.w} has ${c}`);
});

test('every spoken sentence has a unique audio file name', () => {
  const texts = speakableTexts();
  assert.equal(new Set(texts.map(textHash)).size, texts.length);
  assert.ok(LEARNED > 0);
});
