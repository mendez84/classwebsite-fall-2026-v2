(() => {
  "use strict";

  const STORAGE_KEY = "mendez-integer-flashcards-v1";
  const SETTINGS_KEY = "mendez-integer-flashcards-settings-v1";
  const SESSION_LENGTH = 10;
  const TIMED_SECONDS = 60;
  const operationLabels = { mixed: "Mixed", addition: "Addition", subtraction: "Subtraction", multiplication: "Multiplication", division: "Division" };
  const operatorSymbols = { addition: "+", subtraction: "−", multiplication: "×", division: "÷" };
  const allOperations = ["addition", "subtraction", "multiplication", "division"];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const views = { setup: $("[data-view=setup]"), practice: $("[data-view=practice]"), results: $("[data-view=results]") };
  const state = {
    view: "setup",
    settings: loadSettings(),
    rng: null,
    session: null,
    currentProblem: null,
    timerId: null,
    explanationOpen: false,
    visualOpen: false,
    theme: localStorage.getItem("mendez-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  };

  function loadSettings() {
    try { return { operation: "mixed", level: 1, mode: "practice", ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") }; }
    catch { return { operation: "mixed", level: 1, mode: "practice" }; }
  }

  function loadProgress() {
    try { return { answered: 0, correct: 0, bestStreak: 0, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; }
    catch { return { answered: 0, correct: 0, bestStreak: 0 }; }
  }

  function saveProgress() {
    const progress = loadProgress();
    const session = state.session;
    const merged = {
      answered: progress.answered + session.answered,
      correct: progress.correct + session.correct,
      bestStreak: Math.max(progress.bestStreak, session.bestStreak),
      missed: [...(progress.missed || []), ...session.missed].slice(-12),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    renderSnapshot();
  }

  function createRng(seed) {
    let value = seed >>> 0;
    return () => { value = (value * 1664525 + 1013904223) >>> 0; return value / 4294967296; };
  }

  function randomInt(rng, min, max) { return Math.floor(rng() * (max - min + 1)) + min; }
  function choose(rng, values) { return values[Math.floor(rng() * values.length)]; }
  function signedInt(rng, min = 1, max = 12, allowZero = true) {
    let value = randomInt(rng, min, max);
    if (allowZero && rng() < 0.12) value = 0;
    return rng() < 0.5 ? -value : value;
  }

  function getOperation(settings, rng) { return settings.operation === "mixed" ? choose(rng, allOperations) : settings.operation; }

  function evaluateProblem(problem) {
    const numbers = [...problem.numbers];
    const operators = [...problem.operators];
    const steps = [];
    for (let index = 0; index < operators.length;) {
      if (!["multiplication", "division"].includes(operators[index])) { index += 1; continue; }
      const left = numbers[index];
      const right = numbers[index + 1];
      if (operators[index] === "division" && (right === 0 || left % right !== 0)) return null;
      const value = operators[index] === "multiplication" ? left * right : left / right;
      steps.push({ expression: `${formatAccessibleNumber(left)} ${operatorSymbols[operators[index]]} ${formatAccessibleNumber(right)}`, value });
      numbers.splice(index, 2, value);
      operators.splice(index, 1);
    }
    while (operators.length) {
      const op = operators.shift();
      const left = numbers.shift();
      const right = numbers.shift();
      const value = op === "addition" ? left + right : left - right;
      steps.push({ expression: `${formatAccessibleNumber(left)} ${operatorSymbols[op]} ${formatAccessibleNumber(right)}`, value });
      numbers.unshift(value);
    }
    return { answer: numbers[0], steps };
  }

  function generateProblem(settings, seed) {
    const rng = state.rng || createRng(seed || 1);
    const operation = getOperation(settings, rng);
    const count = Number(settings.level) === 2 ? 3 : 2;
    let numbers;
    let operators;
    let evaluated = null;
    for (let attempt = 0; attempt < 100; attempt += 1) {
      numbers = Array.from({ length: count }, () => signedInt(rng));
      operators = Array.from({ length: count - 1 }, (_, index) => index === 0 ? operation : choose(rng, allOperations));
      if (operation === "division" && settings.level === 1) {
        const divisor = signedInt(rng, 1, 12, false);
        const quotient = signedInt(rng, 1, 12, false);
        numbers = [divisor * quotient, divisor];
      }
      if (operation === "multiplication" && settings.level === 1) numbers = [signedInt(rng, 1, 12, false), signedInt(rng, 1, 12, false)];
      evaluated = evaluateProblem({ numbers, operators });
      if (evaluated && Number.isInteger(evaluated.answer)) break;
    }
    if (!evaluated) { numbers = [6, -3]; operators = ["division"]; evaluated = evaluateProblem({ numbers, operators }); }
    const problem = { id: `${settings.level}-${operation}-${numbers.join(",")}-${operators.join(",")}`, level: Number(settings.level), operation, numbers, operators, answer: evaluated.answer, steps: evaluated.steps };
    problem.expression = formatExpression(problem);
    problem.visual = ["addition", "subtraction"].includes(operation) ? "number-line" : "sign-pairs";
    problem.misconception = getMisconception(problem);
    return problem;
  }

  function formatAccessibleNumber(value) { return value < 0 ? `negative ${Math.abs(value)}` : String(value); }
  function formatNumber(value, index) { return value < 0 && index > 0 ? `(${value.toString().replace("-", "−")})` : value.toString().replace("-", "−"); }
  function formatExpression(problem) { return problem.numbers.map((number, index) => `<span class="number">${formatNumber(number, index)}</span>${index < problem.operators.length ? `<span class="operator" aria-hidden="true">${operatorSymbols[problem.operators[index]]}</span>` : ""}`).join(""); }
  function spokenExpression(problem) { return problem.numbers.map((number, index) => `${formatAccessibleNumber(number)}${index < problem.operators.length ? ` ${operationLabels[problem.operators[index]]} ` : ""}`).join(""); }
  function getMisconception(problem) {
    if (problem.operation === "subtraction") return "subtraction-opposite";
    if (["multiplication", "division"].includes(problem.operation)) return "sign-pair";
    return problem.numbers[0] < 0 !== problem.numbers[1] < 0 ? "absolute-value" : "same-sign";
  }

  function gradeAnswer(problem, input) {
    const normalized = String(input).trim().replace(/[−–]/g, "-").replace(/^\+/, "");
    if (!normalized) return { status: "incomplete" };
    if (!/^-?\d+$/.test(normalized)) return { status: "invalid" };
    const value = Number(normalized);
    return { status: value === problem.answer ? "correct" : "incorrect", value, expected: problem.answer };
  }

  function getExplanation(problem) {
    const answer = formatAccessibleNumber(problem.answer);
    const first = problem.numbers[0];
    const second = problem.numbers[1];
    let title = "Here is one way to think about it.";
    let copy = "";
    if (problem.operation === "subtraction") copy = `Rewrite subtraction as adding the opposite: ${formatAccessibleNumber(first)} + ${formatAccessibleNumber(-second)}. Then combine the integers.`;
    else if (["multiplication", "division"].includes(problem.operation)) copy = `First work with the absolute values. ${first < 0 === second < 0 ? "The signs match, so the answer is positive." : "The signs are different, so the answer is negative."}`;
    else if (first < 0 === second < 0) copy = "The signs match, so add the absolute values and keep their common sign.";
    else copy = "The signs are different, so subtract the smaller absolute value from the larger and keep the sign of the larger absolute value.";
    const steps = problem.steps.map((step) => `<li>${step.expression} = <strong>${formatAccessibleNumber(step.value)}</strong></li>`).join("");
    return `<h3>${title}</h3><p>${copy}</p>${problem.level === 2 ? `<ol class="step-list">${steps}</ol>` : ""}<p class="answer-reveal">Answer: <strong>${answer}</strong></p>`;
  }

  // Interactive Manipulative State for Class Website
  let manipTab = "counters";
  let activeChips = [];
  let formedPairs = [];
  let selectedChipId = null;

  function initInteractiveCounters(problem) {
    let num1 = problem.numbers[0];
    let num2 = problem.numbers[1];
    if (problem.operation === "subtraction") num2 = -num2;
    activeChips = [];
    formedPairs = [];
    selectedChipId = null;
    let id = 1;
    function add(qty, isPos) {
      for (let i = 0; i < Math.abs(qty); i++) {
        activeChips.push({ id: `c-${id++}`, sign: isPos ? "pos" : "neg", cancelled: false });
      }
    }
    if (["addition", "subtraction"].includes(problem.operation)) {
      add(num1, num1 >= 0);
      add(num2, num2 >= 0);
    } else {
      add(problem.answer, problem.answer >= 0);
    }
  }

  function getVisualModel(problem) {
    const isMulDiv = ["multiplication", "division"].includes(problem.operation);
    if (isMulDiv && manipTab === "counters") manipTab = "signrules";

    return `
      <div class="manipulative-box" data-manip-box>
        <div class="manipulative-tabs">
          <button type="button" class="manip-tab ${manipTab === 'counters' ? 'active' : ''}" data-mtab="counters">🟡🔴 Zero Pairs</button>
          <button type="button" class="manip-tab ${manipTab === 'numberline' ? 'active' : ''}" data-mtab="numberline">📏 Number Line</button>
          ${isMulDiv ? `<button type="button" class="manip-tab ${manipTab === 'signrules' ? 'active' : ''}" data-mtab="signrules">⚡ Sign Rules</button>` : ''}
        </div>
        <div class="manip-content" data-mcontent></div>
      </div>
    `;
  }

  function renderManipContent(container, problem) {
    if (manipTab === "counters") renderCountersContent(container, problem);
    else if (manipTab === "numberline") renderNumberLineContent(container, problem);
    else if (manipTab === "signrules") renderSignRulesContent(container, problem);
  }

  function renderCountersContent(container, problem) {
    const isMulDiv = ["multiplication", "division"].includes(problem.operation);
    if (isMulDiv) {
      container.innerHTML = `
        <h4 class="manip-headline">Counter Representation</h4>
        <div class="counters-zone">
          ${activeChips.map(c => `<div class="chip ${c.sign}">${c.sign === 'pos' ? '+1' : '−1'}</div>`).join('')}
        </div>
      `;
      return;
    }
    const uncancelled = activeChips.filter(c => !c.cancelled);
    const posLeft = uncancelled.filter(c => c.sign === "pos").length;
    const negLeft = uncancelled.filter(c => c.sign === "neg").length;
    const pairsCount = formedPairs.length;

    container.innerHTML = `
      <h4 class="manip-headline">Interactive Zero-Pair Counters</h4>
      <p class="manip-instructions">Click a <strong>(+1) Yellow</strong> and <strong>(−1) Red</strong> chip to form a Zero Pair $(+1 + -1 = 0)$, or use Auto-Pair.</p>
      <div class="manip-toolbar">
        <button type="button" class="btn-chip-action" data-auto-pair>✨ Auto-Pair All</button>
        <button type="button" class="btn-chip-action" data-reset-chips>↺ Reset</button>
      </div>
      <div class="counters-arena">
        <div>
          <div class="counter-group-label">Active Chips</div>
          <div class="counters-zone">
            ${uncancelled.length === 0 ? '<span style="font-size:0.8rem;color:var(--muted)">All chips have cancelled into zero pairs! Total = 0</span>' : uncancelled.map(c => `
              <button type="button" class="chip ${c.sign} ${c.id === selectedChipId ? 'selected' : ''}" data-cid="${c.id}">
                ${c.sign === 'pos' ? '+1' : '−1'}
              </button>
            `).join('')}
          </div>
        </div>
        ${pairsCount > 0 ? `
          <div>
            <div class="counter-group-label">Formed Zero Pairs (${pairsCount} = 0)</div>
            <div class="zero-pair-container">
              ${formedPairs.map((p, i) => `
                <div class="zero-pair-slot cancelled">
                  <span class="chip pos" style="width:30px;height:30px;font-size:0.8rem">+1</span>
                  <span class="chip neg" style="width:30px;height:30px;font-size:0.8rem">−1</span>
                  <span class="zero-pair-badge">Pair ${i+1} = 0</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        <div class="remaining-zone">
          <div>Remainder: <strong>${posLeft > 0 ? `+${posLeft}` : (negLeft > 0 ? `−${negLeft}` : '0')}</strong></div>
          <div>Answer: <strong>${formatNumber(problem.answer, 0)}</strong></div>
        </div>
      </div>
    `;

    container.querySelectorAll("[data-cid]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.cid;
        if (!selectedChipId) {
          selectedChipId = id;
          renderCountersContent(container, problem);
        } else if (selectedChipId === id) {
          selectedChipId = null;
          renderCountersContent(container, problem);
        } else {
          const first = activeChips.find(c => c.id === selectedChipId);
          const second = activeChips.find(c => c.id === id);
          if (first && second && first.sign !== second.sign) {
            first.cancelled = true;
            second.cancelled = true;
            formedPairs.push({ pos: first.id, neg: second.id });
            selectedChipId = null;
            renderCountersContent(container, problem);
          } else {
            selectedChipId = id;
            renderCountersContent(container, problem);
          }
        }
      });
    });

    container.querySelector("[data-auto-pair]")?.addEventListener("click", () => {
      while (true) {
        const pos = activeChips.find(c => !c.cancelled && c.sign === "pos");
        const neg = activeChips.find(c => !c.cancelled && c.sign === "neg");
        if (pos && neg) {
          pos.cancelled = true;
          neg.cancelled = true;
          formedPairs.push({ pos: pos.id, neg: neg.id });
        } else break;
      }
      selectedChipId = null;
      renderCountersContent(container, problem);
    });

    container.querySelector("[data-reset-chips]")?.addEventListener("click", () => {
      initInteractiveCounters(problem);
      renderCountersContent(container, problem);
    });
  }

  function renderNumberLineContent(container, problem) {
    const startVal = problem.numbers[0];
    const endVal = problem.answer;
    let minVal = Math.min(startVal, endVal, 0) - 2;
    let maxVal = Math.max(startVal, endVal, 0) + 2;
    if (maxVal - minVal < 10) { minVal -= 2; maxVal += 2; }
    const span = maxVal - minVal;
    const svgW = 560;
    const pad = 35;
    const axisY = 75;
    const plotW = svgW - (pad * 2);
    const valX = (v) => pad + ((v - minVal) / span) * plotW;
    const startX = valX(startVal);
    const endX = valX(endVal);
    const midX = (startX + endX) / 2;
    const arcH = Math.min(50, Math.max(25, Math.abs(endX - startX) * 0.3));
    const arcY = axisY - arcH;
    const pathD = `M ${startX} ${axisY} Q ${midX} ${arcY - 10} ${endX} ${axisY}`;

    let ticks = "";
    for (let v = minVal; v <= maxVal; v++) {
      const x = valX(v);
      const isZ = v === 0;
      ticks += `
        <line x1="${x}" y1="${axisY - (isZ ? 12 : 6)}" x2="${x}" y2="${axisY + (isZ ? 12 : 6)}" class="nl-tick ${isZ ? 'zero' : ''}" />
        <text x="${x}" y="${axisY + 24}" class="nl-label ${isZ ? 'zero' : ''}">${v}</text>
      `;
    }

    container.innerHTML = `
      <h4 class="manip-headline">Animated Number Line Jumper</h4>
      <div class="manip-toolbar">
        <button type="button" class="btn-chip-action" data-replay-hop>🐸 Replay Hop</button>
      </div>
      <div class="number-line-stage">
        <div class="number-line-svg-wrap">
          <svg class="number-line-svg" viewBox="0 0 ${svgW} 115">
            <line x1="${pad - 10}" y1="${axisY}" x2="${svgW - pad + 10}" y2="${axisY}" class="nl-axis" />
            ${ticks}
            <path d="${pathD}" class="nl-jump-path" />
            <circle cx="${startX}" cy="${axisY}" r="5" class="nl-pin-start" />
            <circle cx="${endX}" cy="${axisY}" r="6" class="nl-pin-end" />
            <text id="cw-frog" class="nl-jumper" x="${startX - 10}" y="${axisY - 8}">🐸</text>
          </svg>
        </div>
        <div class="hop-readout">
          Start at <strong>${formatNumber(startVal, 0)}</strong>, hop <strong>${Math.abs(endVal - startVal)}</strong> spaces <strong>${endVal >= startVal ? 'right' : 'left'}</strong>, landing on <strong>${formatNumber(endVal, 0)}</strong>.
        </div>
      </div>
    `;

    function hop() {
      const frog = container.querySelector("#cw-frog");
      if (!frog) return;
      const t0 = performance.now();
      function step(now) {
        const t = Math.min(1, (now - t0) / 900);
        const curX = Math.pow(1-t,2)*startX + 2*(1-t)*t*midX + Math.pow(t,2)*endX;
        const curY = Math.pow(1-t,2)*axisY + 2*(1-t)*t*(arcY - 10) + Math.pow(t,2)*axisY;
        frog.setAttribute("x", curX - 10);
        frog.setAttribute("y", curY - 6);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    setTimeout(hop, 100);
    container.querySelector("[data-replay-hop]")?.addEventListener("click", hop);
  }

  function renderSignRulesContent(container, problem) {
    const first = problem.numbers[0];
    const second = problem.numbers[1];
    const opSym = problem.operation === "multiplication" ? "×" : "÷";
    const fPos = first >= 0;
    const sPos = second >= 0;
    const rules = [
      { math: `(+) ${opSym} (+) = (+)`, desc: "Same signs make a positive.", match: fPos && sPos },
      { math: `(+) ${opSym} (−) = (−)`, desc: "Different signs make a negative.", match: fPos && !sPos },
      { math: `(−) ${opSym} (+) = (−)`, desc: "Different signs make a negative.", match: !fPos && sPos },
      { math: `(−) ${opSym} (−) = (+)`, desc: "Same signs make a positive.", match: !fPos && !sPos }
    ];
    container.innerHTML = `
      <h4 class="manip-headline">Sign Rules</h4>
      <div class="sign-grid">
        ${rules.map(r => `
          <div class="sign-card ${r.match ? 'active' : ''}">
            <div class="sign-card-math">${r.math}</div>
            <div class="sign-card-rule">${r.desc}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function startSession(settings) {
    state.settings = { ...settings, level: Number(settings.level) };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
    state.rng = createRng((Date.now() ^ (state.settings.level * 997)) >>> 0);
    state.session = { total: state.settings.mode === "timed" ? Infinity : SESSION_LENGTH, index: 0, answered: 0, correct: 0, streak: 0, bestStreak: 0, missed: [], completed: 0, startedAt: Date.now() };
    setView("practice");
    if (state.settings.mode === "timed") startTimer();
    loadNextProblem();
  }

  function loadNextProblem() {
    if (state.settings.mode !== "timed" && state.session.index >= state.session.total) return finishSession();
    state.currentProblem = generateProblem(state.settings);
    initInteractiveCounters(state.currentProblem);
    state.session.index += 1;
    state.explanationOpen = false;
    state.visualOpen = false;
    $("[data-expression]").innerHTML = state.currentProblem.expression;
    $("[data-expression-spoken]").textContent = `Solve: ${spokenExpression(state.currentProblem)}`;
    $("[data-answer-form]").reset();
    $("[data-feedback]").hidden = true;
    $("[data-action-row]").hidden = true;
    $("[data-explanation]").hidden = true;
    $("[data-explanation]").innerHTML = "";
    $("[data-progress]").textContent = state.settings.mode === "timed" ? state.session.completed + 1 : state.session.index;
    $("[data-total]").textContent = state.settings.mode === "timed" ? "∞" : state.session.total;
    $("[data-progress-bar]").style.width = state.settings.mode === "timed" ? "100%" : `${((state.session.index - 1) / state.session.total) * 100}%`;
    $("[data-answer]")?.focus();
    $("#answer").focus();
  }

  function submitAnswer(input) {
    if (!state.currentProblem || state.session.locked) return;
    const result = gradeAnswer(state.currentProblem, input);
    const feedback = $("[data-feedback]");
    if (result.status === "incomplete") { feedback.hidden = false; feedback.className = "feedback incorrect"; feedback.textContent = "Type an integer before checking."; return; }
    if (result.status === "invalid") { feedback.hidden = false; feedback.className = "feedback incorrect"; feedback.textContent = "Use a whole number, like −7 or 12."; return; }
    state.session.locked = true;
    state.session.answered += 1;
    state.session.completed += 1;
    if (result.status === "correct") { state.session.correct += 1; state.session.streak += 1; state.session.bestStreak = Math.max(state.session.bestStreak, state.session.streak); feedback.className = "feedback correct"; feedback.textContent = "Correct. Keep that integer thinking going."; }
    else { state.session.streak = 0; state.session.missed.push({ expression: spokenExpression(state.currentProblem), answer: state.currentProblem.answer }); feedback.className = "feedback incorrect"; feedback.textContent = `Not quite. The answer is ${formatAccessibleNumber(state.currentProblem.answer)}. Open the explanation below.`; }
    feedback.hidden = false;
    $("[data-action-row]").hidden = false;
    $("[data-next-button]").textContent = state.settings.mode === "timed" || state.session.index < state.session.total ? "Next card →" : "See results →";
    if (result.status === "incorrect") showExplanation();
  }

  function showExplanation(withVisual = false) {
    if (!state.currentProblem) return;
    state.explanationOpen = true;
    state.visualOpen = withVisual || state.visualOpen;
    const explanation = $("[data-explanation]");
    explanation.innerHTML = getExplanation(state.currentProblem) + (state.visualOpen ? getVisualModel(state.currentProblem) : "");
    explanation.hidden = false;
    $("[data-visual-button]").textContent = state.visualOpen ? "Hide visual" : "Show a visual";

    if (state.visualOpen) {
      const box = explanation.querySelector("[data-manip-box]");
      if (box) {
        const content = box.querySelector("[data-mcontent]");
        renderManipContent(content, state.currentProblem);
        box.querySelectorAll("[data-mtab]").forEach(btn => {
          btn.addEventListener("click", () => {
            manipTab = btn.dataset.mtab;
            box.querySelectorAll("[data-mtab]").forEach(b => b.classList.toggle("active", b === btn));
            renderManipContent(content, state.currentProblem);
          });
        });
      }
    }
  }

  function nextCard() { if (state.session.index >= state.session.total && state.settings.mode !== "timed") finishSession(); else { state.session.locked = false; loadNextProblem(); } }

  function finishSession() {
    stopTimer();
    if (!state.session.saved) { saveProgress(); state.session.saved = true; }
    const session = state.session;
    const accuracy = session.answered ? Math.round(session.correct / session.answered * 100) : 0;
    $("[data-results-summary]").textContent = session.answered ? `You answered ${session.correct} of ${session.answered} cards correctly. ${accuracy >= 80 ? "That is a strong round." : "Review the explanations, then give it another round."}` : "You ended this session before answering a card.";
    $("[data-results-accuracy]").textContent = `${accuracy}%`;
    $("[data-results-attempts]").textContent = `${session.correct} correct of ${session.answered} answered`;
    $("[data-results-streak]").textContent = session.bestStreak;
    $("[data-results-cards]").textContent = session.completed;
    const missedSection = $("[data-missed-section]");
    missedSection.hidden = !session.missed.length;
    $("[data-missed-list]").innerHTML = session.missed.slice(-6).map((item) => `<li>${item.expression} = ${item.answer}</li>`).join("");
    setView("results");
  }

  function startTimer() {
    let remaining = TIMED_SECONDS;
    $("[data-timer]").textContent = remaining;
    $("[data-timer-wrap]").hidden = false;
    state.timerId = setInterval(() => { remaining -= 1; $("[data-timer]").textContent = remaining; if (remaining <= 0) finishSession(); }, 1000);
  }
  function stopTimer() { if (state.timerId) clearInterval(state.timerId); state.timerId = null; }

  function setView(view) { state.view = view; Object.entries(views).forEach(([name, element]) => { element.hidden = name !== view; }); if (view !== "practice") $("[data-timer-wrap]").hidden = true; window.scrollTo({ top: 0, behavior: "smooth" }); }

  function renderSnapshot() {
    const progress = loadProgress();
    $("[data-snapshot-answered]").textContent = progress.answered;
    $("[data-snapshot-accuracy]").textContent = progress.answered ? `${Math.round(progress.correct / progress.answered * 100)}%` : "—";
    $("[data-snapshot-streak]").textContent = progress.bestStreak;
    $("[data-snapshot-empty]").hidden = Boolean(progress.answered);
  }

  function applySettingsToForm() { $$(`[name="operation"][value="${state.settings.operation}"]`)[0]?.click(); $$(`[name="level"][value="${state.settings.level}"]`)[0]?.click(); $$(`[name="mode"][value="${state.settings.mode}"]`)[0]?.click(); }
  function applyTheme() { document.documentElement.dataset.theme = state.theme; $("[data-theme-toggle]").textContent = state.theme === "dark" ? "☼" : "◐"; }

  $("[data-setup-form]").addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); startSession({ operation: data.get("operation"), level: data.get("level"), mode: data.get("mode") }); });
  $("[data-answer-form]").addEventListener("submit", (event) => { event.preventDefault(); submitAnswer($("#answer").value); });
  $("[data-next-button]").addEventListener("click", nextCard);
  $("[data-visual-button]").addEventListener("click", () => showExplanation(!state.visualOpen));
  $("[data-end-session]").addEventListener("click", finishSession);
  $("[data-restart-button]").addEventListener("click", () => startSession(state.settings));
  $("[data-home-button]").addEventListener("click", () => setView("setup"));
  $$("[data-nav-home]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (state.view === "practice" && state.session && state.session.answered > 0 && !state.session.saved) {
        if (confirm("Return to deck selection? Current round will end.")) {
          stopTimer();
          setView("setup");
        }
      } else {
        stopTimer();
        setView("setup");
      }
    });
  });
  $("[data-reset-progress]").addEventListener("click", () => { localStorage.removeItem(STORAGE_KEY); renderSnapshot(); });
  $("[data-theme-toggle]").addEventListener("click", () => { state.theme = state.theme === "dark" ? "light" : "dark"; localStorage.setItem("mendez-theme", state.theme); applyTheme(); });
  document.addEventListener("keydown", (event) => { if (state.view !== "practice" || event.target.matches("input,button")) return; if (event.key.toLowerCase() === "n") nextCard(); if (event.key.toLowerCase() === "s") showExplanation(); });

  applySettingsToForm();
  applyTheme();
  renderSnapshot();
})();
