const promptEl = document.getElementById("prompt");
const inputEl = document.getElementById("typing-input");
const timeEl = document.getElementById("time");
const accuracyEl = document.getElementById("accuracy");
const wpmEl = document.getElementById("wpm");
const startBtn = document.getElementById("start-btn");
const punctuationToggle = document.getElementById("punctuation-toggle");
const numbersToggle = document.getElementById("numbers-toggle");

const DURATION = 30;
let timerId = null;
let startTime = null;
let currentPrompt = "";

const BASE_PHRASES = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing smooth is all about steady rhythm and focus!",
  "Numbers like 42 or 365 can sneak into any sentence.",
  "Stay calm, breathe evenly, and let your fingers dance.",
  "Keys click quietly while code compiles in the background.",
  "Practice every day to see noticeable speed gains.",
  "Shift, punctuation, and symbols slow down the best typists.",
  "Accuracy first, speed second, confidence always.",
  "Sunrise rides bring fresh ideas and clean syntax.",
  "Version 1.2.3 fixed bugs, polished UX, and improved docs."
];

startBtn.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
  }
  startGame();
});

inputEl.addEventListener("input", () => {
  renderPrompt();
  updateMetrics();
});

function startGame() {
  const includePunctuation = punctuationToggle.checked;
  const includeNumbers = numbersToggle.checked;

  currentPrompt = buildPrompt(includePunctuation, includeNumbers);
  inputEl.value = "";
  inputEl.disabled = false;
  inputEl.focus();
  startTime = performance.now();
  renderPrompt();
  resetMetrics();
  timeEl.textContent = formatTime(DURATION);

  timerId = setInterval(() => {
    const elapsed = (performance.now() - startTime) / 1000;
    const remaining = Math.max(0, DURATION - elapsed);
    timeEl.textContent = formatTime(Math.ceil(remaining));

    if (remaining <= 0) {
      finishGame();
    }
  }, 100);

  startBtn.textContent = "Restart";
}

function finishGame() {
  clearInterval(timerId);
  timerId = null;
  inputEl.disabled = true;
  inputEl.blur();
  timeEl.textContent = formatTime(0);
  renderPrompt();
  updateMetrics();
}

function buildPrompt(includePunctuation, includeNumbers) {
  const raw = BASE_PHRASES[Math.floor(Math.random() * BASE_PHRASES.length)];
  let text = raw;

  if (!includePunctuation) {
    text = text.replace(/[.,!?;:'"\\-]/g, "");
  }

  if (!includeNumbers) {
    text = text.replace(/\d+/g, "");
  }

  return text.trim();
}

function renderPrompt() {
  const typed = inputEl.value || "";
  const fragments = [];

  for (let i = 0; i < currentPrompt.length; i++) {
    const expected = currentPrompt[i];
    const userChar = typed[i];

    if (typeof userChar === "undefined") {
      fragments.push(expected);
      continue;
    }

    const isCorrect = userChar === expected;
    const className = isCorrect ? "prompt__char--correct" : "prompt__char--error";
    const safeChar = expected === " " ? "&nbsp;" : expected;
    fragments.push(`<span class="${className}">${safeChar}</span>`);
  }

  if (typed.length > currentPrompt.length) {
    const overflow = typed.slice(currentPrompt.length);
    fragments.push(`<span class="prompt__char--error">${escapeHtml(overflow)}</span>`);
  }

  promptEl.innerHTML = fragments.join("");
}

function updateMetrics() {
  const typed = inputEl.value || "";
  const correctChars = getCorrectCharCount(typed, currentPrompt);
  const accuracy = typed.length === 0 ? 100 : Math.max(0, Math.round((correctChars / typed.length) * 100));
  const elapsedSeconds = timerId ? (performance.now() - startTime) / 1000 : DURATION;
  const minutes = Math.max(elapsedSeconds / 60, 1 / 60);
  const words = typed.length / 5;
  const wpm = Math.max(0, Math.round(words / minutes));

  accuracyEl.textContent = `${accuracy}%`;
  wpmEl.textContent = wpm.toString();
}

function resetMetrics() {
  accuracyEl.textContent = "100%";
  wpmEl.textContent = "0";
}

function getCorrectCharCount(typed, prompt) {
  let correct = 0;
  const length = Math.min(typed.length, prompt.length);

  for (let i = 0; i < length; i++) {
    if (typed[i] === prompt[i]) {
      correct++;
    }
  }

  return correct;
}

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

renderPrompt();
