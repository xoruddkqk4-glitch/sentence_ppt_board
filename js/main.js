const ROLE_OPTIONS = [
  { value: "subject", label: "주어", lane: "major" },
  { value: "verb", label: "동사", lane: "major" },
  { value: "complement", label: "보어", lane: "major" },
  { value: "object", label: "목적어", lane: "major" },
  { value: "adjective", label: "형용사어", lane: "minor" },
  { value: "adverb", label: "부사어", lane: "minor" }
];

const ROLE_BY_VALUE = Object.fromEntries(ROLE_OPTIONS.map((role) => [role.value, role]));
const ROLE_COLOR_CLASS = {
  subject: "role-subject",
  verb: "role-verb",
  object: "role-object",
  complement: "role-complement",
  adjective: "role-adjective",
  adverb: "role-adverb"
};
const COMPONENT_PALETTE = {
  subject: "#00B8A9",
  verb: "#F6416C",
  object: "#FFDE7D",
  complement: "#9BB8FF",
  adjective: "#008000",
  adverb: "#F8F3D4"
};
const MAJOR_ROLES = new Set(["subject", "verb", "complement", "object"]);
const BE_VERBS = new Set(["am", "are", "is", "was", "were", "be", "been", "being"]);
const COMMON_VERBS = new Set([
  "read", "reads", "reading", "wrote", "write", "writes", "study", "studies",
  "studied", "learn", "learns", "learned", "saw", "see", "sees", "make",
  "makes", "made", "take", "takes", "took", "give", "gives", "gave", "go",
  "goes", "went", "come", "comes", "came", "think", "thinks", "thought",
  "feel", "feels", "felt", "look", "looks", "looked", "become", "became",
  "seem", "seems", "seemed", "have", "has", "had", "do", "does", "did",
  "can", "could", "will", "would", "should", "may", "might", "must"
]);
const PREPOSITIONS = new Set([
  "in", "on", "at", "by", "for", "from", "to", "with", "without", "about", "of",
  "before", "after", "during", "through", "under", "over", "into", "near",
  "around", "because", "while"
]);
const APOSTROPHE_LIKE_PATTERN = /[\u0060\u00b4\u2018\u2019\u201b\u2032\u02bb\u02bc\uff07]/g;
const CONTRACTION_SUFFIXES = new Set(["s", "t", "re", "ve", "ll", "d", "m"]);
const MINOR_ANCHOR_SPREAD = 11.0;
const SAMPLE_TEXT = "The young students read the story carefully. Their teacher explained the difficult words on the board. They were extremely excited about the new lesson yesterday.";
const EXPORT_MARKER = "WHITEBOARD_PPT_ANALYSIS_TXT_V1";
const EXPORT_JSON_START = "-----BEGIN WHITEBOARD_PPT_ANALYSIS_JSON-----";
const EXPORT_JSON_END = "-----END WHITEBOARD_PPT_ANALYSIS_JSON-----";

const state = {
  passageText: "",
  sentences: [],
  currentSentenceIndex: 0,
  componentSerial: 1,
  mode: "input",
  settings: {
    theme: "light",
    align: "center"
  },
  draggedComponentId: null,
  minorRevealCount: 0,
  minorSlots: []
};

const elements = {
  app: document.getElementById("app"),
  inputView: document.getElementById("inputView"),
  editView: document.getElementById("editView"),
  presentView: document.getElementById("presentView"),
  passageForm: document.getElementById("passageForm"),
  passageInput: document.getElementById("passageInput"),
  inputMessage: document.getElementById("inputMessage"),
  sampleButton: document.getElementById("sampleButton"),
  clearButton: document.getElementById("clearButton"),
  inputExportTxtButton: document.getElementById("inputExportTxtButton"),
  inputImportButton: document.getElementById("inputImportButton"),
  exportTxtButton: document.getElementById("exportTxtButton"),
  editImportButton: document.getElementById("editImportButton"),
  analysisFileInput: document.getElementById("analysisFileInput"),
  themeSelect: document.getElementById("themeSelect"),
  editProgress: document.getElementById("editProgress"),
  presentProgress: document.getElementById("presentProgress"),
  sentenceTextEditor: document.getElementById("sentenceTextEditor"),
  applySentenceTextButton: document.getElementById("applySentenceTextButton"),
  addSentenceButton: document.getElementById("addSentenceButton"),
  deleteSentenceButton: document.getElementById("deleteSentenceButton"),
  majorEditLane: document.getElementById("majorEditLane"),
  minorEditLane: document.getElementById("minorEditLane"),
  majorPresentLane: document.getElementById("majorPresentLane"),
  minorAnchorLane: document.getElementById("minorAnchorLane"),
  minorPresentLane: document.getElementById("minorPresentLane"),
  emptyMinorNote: document.getElementById("emptyMinorNote"),
  presentFitButton: document.getElementById("presentFitButton"),
  backToInputButton: document.getElementById("backToInputButton"),
  startPresentButton: document.getElementById("startPresentButton"),
  returnEditButton: document.getElementById("returnEditButton"),
  returnInputButton: document.getElementById("returnInputButton"),
  presentFirstSentenceButton: document.getElementById("presentFirstSentenceButton"),
  presentLastSentenceButton: document.getElementById("presentLastSentenceButton"),
  screenOffOverlay: document.getElementById("screenOffOverlay"),
  screenOnButton: document.getElementById("screenOnButton"),
  editFirstButton: document.getElementById("editFirstButton"),
  editPrevButton: document.getElementById("editPrevButton"),
  editNextButton: document.getElementById("editNextButton"),
  editLastButton: document.getElementById("editLastButton"),
  presentPrevButton: document.getElementById("presentPrevButton"),
  presentNextButton: document.getElementById("presentNextButton")
};

function splitSentences(text) {
  const normalized = normalizeApostrophes(text).trim().replace(/\s+/g, " ");
  if (!normalized) {
    return [];
  }

  const matches = normalized.match(/[^.!?]+[.!?]+["')\]]?|[^.!?]+$/g) || [];
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
}

function analyzeSentence(sentenceText, sentenceIndex) {
  const displayWords = getDisplayWords(sentenceText);
  const plainWords = displayWords.map(getWordCore).filter(Boolean);

  if (plainWords.length === 0) {
    return [];
  }

  const verbIndex = findVerbIndex(plainWords);
  const subjectStart = 0;
  const subjectEnd = Math.max(verbIndex, 1);
  const verbStart = verbIndex;
  const verbEnd = Math.min(verbIndex + getVerbSpan(plainWords, verbIndex), plainWords.length);
  const verbWords = plainWords.slice(verbStart, verbEnd);
  const afterVerbStart = verbEnd;
  const afterVerb = plainWords.slice(afterVerbStart);
  const splitAfterVerb = splitMinorPhrase(afterVerb);
  const components = [];

  addComponent(components, sentenceIndex, "subject", displayWords.slice(subjectStart, subjectEnd), subjectStart, subjectEnd);
  addComponent(components, sentenceIndex, "verb", displayWords.slice(verbStart, verbEnd), verbStart, verbEnd);

  if (splitAfterVerb.core.length > 0) {
    const role = BE_VERBS.has(verbWords[verbWords.length - 1]?.toLowerCase()) ? "complement" : "object";
    const coreStart = afterVerbStart + splitAfterVerb.coreStartOffset;
    addComponent(components, sentenceIndex, role, displayWords.slice(coreStart, coreStart + splitAfterVerb.core.length), coreStart, coreStart + splitAfterVerb.core.length);
  }

  splitAfterVerb.minors.forEach((minor, index) => {
    const role = minor.words.some((word) => word.toLowerCase().endsWith("ly")) ? "adverb" : "adverb";
    const minorStart = afterVerbStart + minor.startOffset;
    addComponent(components, sentenceIndex, role, displayWords.slice(minorStart, minorStart + minor.words.length), minorStart, minorStart + minor.words.length, index);
  });

  if (components.length === 0) {
    addComponent(components, sentenceIndex, "subject", displayWords, 0, displayWords.length);
  }

  return components.map((component, order) => ({ ...component, order: order + 1 }));
}

function findVerbIndex(words) {
  const lowerWords = words.map((word) => word.toLowerCase());
  const explicitIndex = lowerWords.findIndex((word) => BE_VERBS.has(word) || COMMON_VERBS.has(word));
  if (explicitIndex > 0) {
    return explicitIndex;
  }

  const suffixIndex = lowerWords.findIndex((word, index) => index > 0 && /(ed|ing|s)$/.test(word));
  if (suffixIndex > 0) {
    return suffixIndex;
  }

  return Math.min(1, Math.max(0, words.length - 1));
}

function getVerbSpan(words, verbIndex) {
  const nextWord = words[verbIndex + 1]?.toLowerCase();
  if (nextWord && (COMMON_VERBS.has(nextWord) || nextWord.endsWith("ed") || nextWord.endsWith("ing"))) {
    return 2;
  }
  return 1;
}

function splitMinorPhrase(words) {
  const core = [];
  const minors = [];
  let coreStartOffset = null;
  let coreClosed = false;

  for (let index = 0; index < words.length; index += 1) {
    const lowerWord = words[index].toLowerCase();
    if (lowerWord.endsWith("ly")) {
      minors.push({ words: [words[index]], startOffset: index });
      if (core.length > 0) {
        coreClosed = true;
      }
      continue;
    }

    if (PREPOSITIONS.has(lowerWord)) {
      const startOffset = index;
      const phrase = [words[index]];
      if (core.length > 0) {
        coreClosed = true;
      }
      index += 1;
      while (index < words.length) {
        const nextLowerWord = words[index].toLowerCase();
        if (PREPOSITIONS.has(nextLowerWord) || nextLowerWord.endsWith("ly")) {
          index -= 1;
          break;
        }
        phrase.push(words[index]);
        index += 1;
      }
      minors.push({ words: phrase, startOffset });
      continue;
    }

    if (coreClosed) {
      const startOffset = index;
      const phrase = [words[index]];
      index += 1;
      while (index < words.length) {
        const nextLowerWord = words[index].toLowerCase();
        if (PREPOSITIONS.has(nextLowerWord) || nextLowerWord.endsWith("ly")) {
          index -= 1;
          break;
        }
        phrase.push(words[index]);
        index += 1;
      }
      minors.push({ words: phrase, startOffset });
      continue;
    }

    if (coreStartOffset === null) {
      coreStartOffset = index;
    }
    core.push(words[index]);
  }

  return {
    core,
    coreStartOffset: coreStartOffset ?? 0,
    minors
  };
}

function addComponent(collection, sentenceIndex, role, words, startIndex, endIndex, variant = 0) {
  const text = words.join(" ").trim();
  if (!text) {
    return;
  }

  collection.push({
    id: `s${sentenceIndex + 1}-c${collection.length + 1}-${variant}`,
    text,
    role,
    lane: ROLE_BY_VALUE[role].lane,
    startIndex,
    endIndex,
    order: collection.length + 1
  });
}

function preparePresentation() {
  const text = elements.passageInput.value;
  const sentences = splitSentences(text);

  state.passageText = text;
  state.sentences = sentences.map((sentenceText, index) => ({
    id: `sentence-${index + 1}`,
    text: sentenceText,
    wordCount: getPlainWords(sentenceText).length,
    components: analyzeSentence(sentenceText, index)
  }));
  state.currentSentenceIndex = 0;
  state.minorRevealCount = 0;
  state.componentSerial = 1;

  return state.sentences.length;
}

function setMode(mode) {
  const previousMode = state.mode;
  state.mode = mode;
  if (mode === "present" && previousMode !== "present") {
    state.minorRevealCount = 0;
  }
  elements.app.dataset.mode = mode;
  document.documentElement.classList.toggle("present-lock", mode === "present");
  elements.inputView.classList.toggle("hidden", mode !== "input");
  elements.editView.classList.toggle("hidden", mode !== "edit");
  elements.presentView.classList.toggle("hidden", mode !== "present");
  render();
}

function render() {
  applySettings();
  if (state.mode === "edit") {
    renderEditView();
  }
  if (state.mode === "present") {
    renderPresentView();
  }
}

function renderEditView() {
  const sentence = getCurrentSentence();
  if (!sentence) {
    return;
  }

  elements.editProgress.textContent = getProgressText();
  elements.sentenceTextEditor.value = sentence.text;
  renderEditLane(elements.majorEditLane, getComponentsByLane(sentence, "major"));
  renderEditLane(elements.minorEditLane, getComponentsByLane(sentence, "minor"));
  updateNavButtons();
}

function renderEditLane(container, components) {
  container.innerHTML = "";
  components.forEach((component) => {
    container.appendChild(createEditChip(component));
  });
}

function createEditChip(component) {
  ensureModifierTarget(component);
  const chip = document.createElement("article");
  chip.className = "component-chip edit-chip";
  chip.draggable = true;
  chip.dataset.componentId = component.id;

  const handle = document.createElement("span");
  handle.className = "drag-handle";
  handle.textContent = "::";
  handle.setAttribute("aria-hidden", "true");

  const select = document.createElement("select");
  select.className = "role-select";
  select.setAttribute("aria-label", `${component.text} 성분 역할`);
  ROLE_OPTIONS.forEach((role) => {
    const option = document.createElement("option");
    option.value = role.value;
    option.textContent = role.label;
    option.selected = role.value === component.role;
    select.appendChild(option);
  });
  select.addEventListener("change", () => updateComponentRole(component.id, select.value));

  const text = document.createElement("span");
  text.className = "component-text";
  text.textContent = component.text;

  chip.append(handle, select, text);
  if (component.role === "adjective") {
    chip.appendChild(createModifierTargetControl(component));
  }
  if (getComponentWords(component).length > 1) {
    chip.appendChild(createSplitControls(component));
  }
  chip.addEventListener("dragstart", handleDragStart);
  chip.addEventListener("dragend", handleDragEnd);
  return chip;
}

function createSplitControls(component) {
  const wrapper = document.createElement("span");
  wrapper.className = "split-control";
  wrapper.addEventListener("mousedown", (event) => event.stopPropagation());
  wrapper.addEventListener("click", (event) => event.stopPropagation());

  const toggle = document.createElement("button");
  toggle.className = "chip-action";
  toggle.type = "button";
  toggle.textContent = "분리";
  toggle.setAttribute("aria-label", `${component.text}에서 분리할 단어 선택`);

  const panel = document.createElement("span");
  panel.className = "split-panel hidden";

  getComponentWords(component).forEach((word, index) => {
    const label = document.createElement("label");
    label.className = "split-word-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = String(index);

    const wordText = document.createElement("span");
    wordText.textContent = word;

    label.append(checkbox, wordText);
    panel.appendChild(label);
  });

  const applyButton = document.createElement("button");
  applyButton.className = "chip-action split-apply";
  applyButton.type = "button";
  applyButton.textContent = "적용";
  applyButton.addEventListener("click", () => {
    const selectedIndexes = [...panel.querySelectorAll("input:checked")].map((input) => Number(input.value));
    splitSelectedWords(component.id, selectedIndexes);
  });
  panel.appendChild(applyButton);

  toggle.addEventListener("click", () => panel.classList.toggle("hidden"));
  wrapper.append(toggle, panel);
  return wrapper;
}

function createModifierTargetControl(component) {
  const sentence = getCurrentSentence();
  const wrapper = document.createElement("span");
  wrapper.className = "modifier-control";
  wrapper.addEventListener("mousedown", (event) => event.stopPropagation());
  wrapper.addEventListener("click", (event) => event.stopPropagation());

  const title = document.createElement("span");
  title.className = "modifier-control-title";
  title.textContent = "수식 대상";
  wrapper.appendChild(title);

  const selectedIndexes = new Set(getModifierTargetIndexes(component));
  const ownIndexes = new Set(getIndexRange(component.startIndex, component.endIndex));
  getDisplayWords(sentence?.text || "").forEach((word, index) => {
    if (ownIndexes.has(index)) {
      return;
    }
    const label = document.createElement("label");
    label.className = "modifier-word-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = String(index);
    checkbox.checked = selectedIndexes.has(index);
    checkbox.addEventListener("change", () => {
      const indexes = [...wrapper.querySelectorAll("input:checked")].map((input) => Number(input.value));
      updateModifierTargetWords(component.id, indexes);
    });

    const wordText = document.createElement("span");
    wordText.textContent = word;

    label.append(checkbox, wordText);
    wrapper.appendChild(label);
  });

  return wrapper;
}

function renderPresentView() {
  const sentence = getCurrentSentence();
  if (!sentence) {
    return;
  }

  const majorComponents = getComponentsByLane(sentence, "major");
  const minorComponents = getComponentsByLane(sentence, "minor");
  state.minorRevealCount = clamp(0, state.minorRevealCount, minorComponents.length);
  const visibleMinorComponents = minorComponents.slice(0, state.minorRevealCount);

  elements.presentProgress.textContent = getProgressText();
  setWordGrid(sentence);
  applySettings();
  renderMajorPresentLane(elements.majorPresentLane, majorComponents, visibleMinorComponents);
  elements.minorAnchorLane.innerHTML = "";
  renderMinorPresentRows(elements.minorPresentLane, visibleMinorComponents);
  renderModifierTargetBrackets(visibleMinorComponents);
  elements.emptyMinorNote.classList.add("hidden");
  updateNavButtons();
  schedulePresentationFit();
}

function renderMajorPresentLane(container, components, visibleMinorComponents = []) {
  container.innerHTML = "";
  components.forEach((component) => {
    const chip = createPresentChip(component, getVisibleModifierTargetIndexes(visibleMinorComponents));
    placeComponentOnGrid(chip, component);
    container.appendChild(chip);
  });
}

function renderMinorPresentRows(container, components) {
  container.innerHTML = "";
  components.forEach((component, index) => {
    const row = document.createElement("div");
    row.className = "minor-row";
    placeMinorRow(row, index);
    const chip = createPresentChip(component);
    placeMinorComponentOnGrid(chip, component, index, getMinorAnchorPercent(component));
    chip.draggable = true;
    chip.dataset.componentId = component.id;
    chip.addEventListener("dragstart", handlePresentMinorDragStart);
    chip.addEventListener("dragend", handlePresentMinorDragEnd);
    row.appendChild(chip);
    container.appendChild(row);
  });
}

function placeMinorRow(row, rowIndex) {
  const top = getMinorBoxTop(rowIndex);
  const rowHeight = top + 96;
  row.style.setProperty("--minor-box-top", `${top}px`);
  row.style.setProperty("--minor-row-height", `${rowHeight}px`);
  row.style.zIndex = String(100 - rowIndex);
}

function getMinorLaneMetrics() {
  const rect = elements.minorPresentLane.getBoundingClientRect();
  const style = getComputedStyle(elements.minorPresentLane);
  const padLeft = Number.parseFloat(style.paddingLeft) || 0;
  const padRight = Number.parseFloat(style.paddingRight) || 0;
  const left = rect.left + padLeft;
  const width = Math.max(1, rect.width - padLeft - padRight);
  return { left, width, right: left + width };
}

// 같은 슬롯(동일 위치)에 모인 부사어 점만 그 슬롯을 중심으로 좌우 대칭 분산한다.
// 서로 다른 슬롯(예: 문장 맨앞 vs 맨뒤)에 있는 종요소는 절대 서로 영향받지 않는다(독립 이동).
function spreadAnchors(list, metrics, edgePercent) {
  const result = new Map();
  if (list.length === 0) {
    return result;
  }

  const minSep = metrics.width
    ? clamp(MINOR_ANCHOR_SPREAD, (26 / metrics.width) * 100, 24)
    : MINOR_ANCHOR_SPREAD;
  const minP = edgePercent;
  const maxP = 100 - edgePercent;

  const groups = new Map();
  list.forEach((item) => {
    const key = Math.round(item.percent * 10) / 10;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(item);
  });

  groups.forEach((items, slotPercent) => {
    const ordered = items.slice().sort((a, b) => a.order - b.order);
    const count = ordered.length;
    ordered.forEach((item, index) => {
      const offset = (index - (count - 1) / 2) * minSep;
      const percent = clamp(minP, slotPercent + offset, maxP);
      result.set(item.component.id, Math.round(percent * 10) / 10);
    });
  });

  return result;
}

function createPresentChip(component, modifierTargetIndexes = new Set()) {
  const chip = document.createElement("span");
  chip.className = `component-chip present-chip ${ROLE_COLOR_CLASS[component.role]}`;
  if (component.role === "adjective") {
    chip.classList.add("modifier-chip");
  }
  chip.style.setProperty("--component-color", COMPONENT_PALETTE[component.role]);
  chip.dataset.componentId = component.id;
  chip.dataset.role = component.role;

  const text = document.createElement("span");
  text.className = "text-part";
  getComponentWords(component).forEach((word, index) => {
    const wordElement = document.createElement("span");
    wordElement.className = "present-word";
    const wordIndex = Number.isFinite(component.startIndex) ? component.startIndex + index : null;
    if (wordIndex !== null) {
      wordElement.dataset.wordIndex = String(wordIndex);
    }
    wordElement.textContent = word;
    text.appendChild(wordElement);
  });

  chip.appendChild(text);
  return chip;
}

function setWordGrid(sentence) {
  elements.app.style.setProperty("--word-count", Math.max(sentence.wordCount || 1, 1));
}

function placeComponentOnGrid(element, component) {
  const start = Number.isFinite(component.startIndex) ? component.startIndex + 1 : component.order;
  const end = Number.isFinite(component.endIndex) ? component.endIndex + 1 : start + 1;
  element.style.gridColumn = `${start} / ${Math.max(end, start + 1)}`;
}

function placeMinorComponentOnGrid(element, component, rowIndex, anchorPercent = getMinorAnchorPercent(component)) {
  element.style.setProperty("--anchor-percent", `${anchorPercent}%`);
  element.style.setProperty("--box-percent", `${anchorPercent}%`);
  element.style.setProperty("--connector-x", "50%");
  const connectorLength = 54 + rowIndex * 64;
  element.style.setProperty("--connector-length", `${connectorLength}px`);
}

function getMinorBoxTop(rowIndex) {
  // 종요소 행 사이 세로 간격(rowIndex 증가분)을 기존 44px의 2/3로 줄인다.
  return 44 + rowIndex * 29;
}

function getMinorAnchorPercent(component) {
  const slots = getMinorSlots();
  if (slots.length === 0) {
    return 50;
  }

  if (component.role === "adjective") {
    return getModifierTargetCenterPercent(component);
  }

  const start = Number.isFinite(component.startIndex) ? component.startIndex : component.order - 1;
  const slot = getClosestSlot(start);
  return slot.percent;
}

function getComponentCenterPercent(component) {
  const slots = getMinorSlots();
  const startIndex = Number.isFinite(component.startIndex) ? component.startIndex : component.order - 1;
  const endIndex = Number.isFinite(component.endIndex) ? component.endIndex : startIndex + 1;
  const startSlot = getClosestSlot(startIndex);
  const endSlot = getClosestSlot(endIndex);
  return Math.round(((startSlot.percent + endSlot.percent) / 2) * 10) / 10;
}

function getModifierTargetCenterPercent(component) {
  const indexes = getModifierTargetIndexes(component);
  if (indexes.length === 0) {
    return getClosestSlot(Number.isFinite(component.startIndex) ? component.startIndex : component.order - 1).percent;
  }

  const metrics = getMinorLaneMetrics();
  const targetWords = getVisibleWordElementsByIndexes(indexes);

  if (metrics.width && targetWords.length > 0) {
    const left = Math.min(...targetWords.map((word) => word.getBoundingClientRect().left));
    const right = Math.max(...targetWords.map((word) => word.getBoundingClientRect().right));
    const center = (left + right) / 2;
    // 화살표는 수식 대상(주요소 포함)의 밑줄 정가운데를 정확히 가리켜야 한다.
    // 가장자리 보정(edge clamp)은 화살표를 안쪽으로 당겨 밑줄 중앙을 벗어나게 하므로 적용하지 않는다.
    // 박스가 화면 밖으로 나가는 문제는 clampMinorBoxes와 연결선 확장으로 따로 처리된다.
    const percent = ((center - metrics.left) / metrics.width) * 100;
    return Math.round(clamp(0, percent, 100) * 10) / 10;
  }

  const percents = indexes.map((index) => {
    const startSlot = getClosestSlot(index);
    const endSlot = getClosestSlot(index + 1);
    return (startSlot.percent + endSlot.percent) / 2;
  });
  return Math.round((percents.reduce((sum, percent) => sum + percent, 0) / percents.length) * 10) / 10;
}

function getPlainWords(sentenceText) {
  return getDisplayWords(sentenceText).map(getWordCore).filter(Boolean);
}

function getComponentWords(component) {
  return getDisplayWords(component.text);
}

function getDisplayWords(text) {
  const normalizedText = normalizeApostrophes(text);
  const words = normalizedText.match(/["'“‘(\[]*[A-Za-z0-9\-\u2013\u2014]+(?:'[A-Za-z0-9\-\u2013\u2014]+)?["'”’)\].,!?;:]*/g) || [];
  const mergedWords = mergeContractionFragments(words);
  return mergedWords.length > 0 ? mergedWords : [normalizedText].filter(Boolean);
}

function getWordCore(word) {
  return normalizeApostrophes(word).match(/[A-Za-z0-9\-\u2013\u2014]+(?:'[A-Za-z0-9\-\u2013\u2014]+)?/)?.[0] || "";
}

function normalizeApostrophes(text) {
  return String(text || "").replace(APOSTROPHE_LIKE_PATTERN, "'");
}

function mergeContractionFragments(words) {
  const mergedWords = [];
  words.forEach((word) => {
    const previous = mergedWords[mergedWords.length - 1];
    const suffixMatch = word.match(/^([A-Za-z]+)([.,!?;:]*)$/);
    const previousMatch = previous?.match(/^(.+?[A-Za-z])([.,!?;:]*)$/);
    const suffix = suffixMatch?.[1]?.toLowerCase();
    if (previousMatch && suffixMatch && CONTRACTION_SUFFIXES.has(suffix) && previousMatch[2] === "") {
      mergedWords[mergedWords.length - 1] = `${previousMatch[1]}'${suffixMatch[1]}${suffixMatch[2]}`;
      return;
    }
    mergedWords.push(word);
  });
  return mergedWords;
}

function getMinorSlots() {
  if (state.minorSlots.length > 0) {
    return state.minorSlots;
  }

  const sentence = getCurrentSentence();
  const wordCount = Math.max(sentence?.wordCount || 1, 1);
  return Array.from({ length: wordCount + 1 }, (_, index) => ({
    index,
    percent: Math.round((index / wordCount) * 1000) / 10
  }));
}

function getClosestSlot(index) {
  const slots = getMinorSlots();
  return slots.reduce((closest, slot) => {
    return Math.abs(slot.index - index) < Math.abs(closest.index - index) ? slot : closest;
  }, slots[0]);
}

function rebuildMinorSlotsFromWords() {
  const slotRect = getMinorLaneMetrics();
  const wordElements = [...elements.majorPresentLane.querySelectorAll(".present-word")];
  const sentence = getCurrentSentence();
  if (!slotRect.width || wordElements.length === 0 || !sentence) {
    state.minorSlots = [];
    return;
  }

  const wordRects = wordElements.map((element) => element.getBoundingClientRect());
  // 슬롯 인덱스는 원문 전체 단어 인덱스(data-word-index) 기준이어야 종요소의 startIndex와 맞아떨어진다.
  const wordIndexes = wordElements.map((element, index) => {
    const value = Number(element.dataset.wordIndex);
    return Number.isFinite(value) ? value : index;
  });
  const firstIndex = wordIndexes[0];
  const lastIndex = wordIndexes[wordIndexes.length - 1];
  const slots = [];
  const first = wordRects[0];
  const last = wordRects[wordRects.length - 1];
  const edgeGap = getMajorEdgeGap();
  const leftEdge = slotRect.left + getStageEdgeGuard(slotRect);
  const rightEdge = slotRect.right - getStageEdgeGuard(slotRect);

  // 문장 맨 앞/맨 뒤 슬롯에 몰리는 종요소 개수만큼 가장자리 점을 더 벌려 둔다.
  const visibleMinorComponents = getComponentsByLane(sentence, "minor").slice(0, state.minorRevealCount);
  const startAnchorCount = visibleMinorComponents.filter((component) => {
    const start = Number.isFinite(component.startIndex) ? component.startIndex : component.order - 1;
    return start <= firstIndex;
  }).length;
  const endAnchorCount = visibleMinorComponents.filter((component) => {
    const start = Number.isFinite(component.startIndex) ? component.startIndex : component.order - 1;
    return start > lastIndex;
  }).length;

  const startShiftPx = startAnchorCount > 1 ? ((startAnchorCount - 1) * MINOR_ANCHOR_SPREAD / 2 / 100) * slotRect.width : 0;
  const endShiftPx = endAnchorCount > 1 ? ((endAnchorCount - 1) * MINOR_ANCHOR_SPREAD / 2 / 100) * slotRect.width : 0;

  // 문장 맨 앞 슬롯 (첫 단어 앞)
  slots.push({
    index: firstIndex - 0.5,
    percent: rectXToPercent(Math.max(leftEdge, first.left - edgeGap - startShiftPx), slotRect)
  });

  // 단어와 단어 사이 슬롯: 양쪽 주요소 단어의 원문 인덱스 중간값으로 표시
  wordRects.forEach((rect, index) => {
    const nextRect = wordRects[index + 1];
    if (!nextRect) {
      return;
    }
    slots.push({
      index: (wordIndexes[index] + wordIndexes[index + 1]) / 2,
      percent: rectXToPercent((rect.right + nextRect.left) / 2, slotRect)
    });
  });

  // 문장 맨 뒤 슬롯 (마지막 단어 뒤)
  slots.push({
    index: lastIndex + 0.5,
    percent: rectXToPercent(Math.min(rightEdge, last.right + edgeGap + endShiftPx), slotRect)
  });

  state.minorSlots = slots;
}

function rectXToPercent(x, rect) {
  const edgeGuard = (getStageEdgeGuard(rect) / rect.width) * 100;
  return Math.round(clamp(edgeGuard, ((x - rect.left) / rect.width) * 100, 100 - edgeGuard) * 10) / 10;
}

function getMajorEdgeGap() {
  const currentSize = Number.parseFloat(getComputedStyle(elements.app).getPropertyValue("--font-major-current"));
  return clamp(80, currentSize * 1.0, 180);
}

function getStageEdgeGuard(rect) {
  return clamp(80, rect.width * 0.08, 180);
}

function getCurrentSentence() {
  return state.sentences[state.currentSentenceIndex] || null;
}

function getComponentsByLane(sentence, lane) {
  return sentence.components
    .filter((component) => component.lane === lane)
    .sort((a, b) => a.order - b.order);
}

function getProgressText() {
  if (state.sentences.length === 0) {
    return "0 / 0";
  }
  return `${state.currentSentenceIndex + 1} / ${state.sentences.length}`;
}

function goToSentence(index, revealCount = 0) {
  if (state.sentences.length === 0) {
    return;
  }
  state.currentSentenceIndex = Math.max(0, Math.min(index, state.sentences.length - 1));
  state.minorRevealCount = clamp(0, revealCount, getCurrentMinorCount());
  render();
}

function updateSentenceText() {
  const sentence = getCurrentSentence();
  if (!sentence) {
    return;
  }
  const newText = elements.sentenceTextEditor.value.trim();
  if (!newText) {
    alert("문장 텍스트를 입력해 주세요.");
    return;
  }
  sentence.text = newText;
  sentence.wordCount = getPlainWords(newText).length;
  sentence.components = analyzeSentence(newText, state.currentSentenceIndex);
  
  state.passageText = state.sentences.map((s) => s.text).join(" ");
  elements.passageInput.value = state.passageText;
  
  render();
}

function insertNewSentence() {
  if (state.sentences.length === 0) {
    return;
  }
  const insertIndex = state.currentSentenceIndex + 1;
  const defaultText = "Insert new English sentence here.";
  const newSentence = {
    id: `sentence-inserted-${Date.now()}`,
    text: defaultText,
    wordCount: getPlainWords(defaultText).length,
    components: analyzeSentence(defaultText, insertIndex)
  };
  
  state.sentences.splice(insertIndex, 0, newSentence);
  
  reindexSentences();
  
  state.currentSentenceIndex = insertIndex;
  state.minorRevealCount = 0;
  
  render();
}

function deleteCurrentSentence() {
  if (state.sentences.length === 0) {
    return;
  }
  if (state.sentences.length <= 1) {
    alert("더 이상 문장을 삭제할 수 없습니다. 최소 하나의 문장이 필요합니다.");
    return;
  }
  
  if (!confirm("현재 문장을 정말 삭제하시겠습니까?")) {
    return;
  }
  
  state.sentences.splice(state.currentSentenceIndex, 1);
  reindexSentences();
  
  state.currentSentenceIndex = Math.max(0, Math.min(state.currentSentenceIndex, state.sentences.length - 1));
  state.minorRevealCount = 0;
  
  render();
}

function reindexSentences() {
  state.sentences.forEach((sentence, index) => {
    sentence.id = `sentence-${index + 1}`;
    // 성분마다 고유한 id를 부여한다. (배열 순서 기반이라 중복이 생기지 않는다)
    sentence.components.forEach((component, componentIndex) => {
      component.id = `s${index + 1}-c${componentIndex + 1}`;
    });
  });
  state.passageText = state.sentences.map((s) => s.text).join(" ");
  elements.passageInput.value = state.passageText;
}

function getCurrentMinorCount() {
  const sentence = getCurrentSentence();
  return sentence ? getComponentsByLane(sentence, "minor").length : 0;
}

function getModifierTargetOptions(component) {
  const sentence = getCurrentSentence();
  if (!sentence) {
    return [];
  }

  const preferred = sentence.components
    .filter((target) => target.id !== component.id && target.role !== "verb" && target.lane === "major")
    .sort(compareComponentsBySentenceOrder);

  if (preferred.length > 0) {
    return preferred;
  }

  return sentence.components
    .filter((target) => target.id !== component.id)
    .sort(compareComponentsBySentenceOrder);
}

function compareComponentsBySentenceOrder(a, b) {
  const aIndex = Number.isFinite(a.startIndex) ? a.startIndex : a.order;
  const bIndex = Number.isFinite(b.startIndex) ? b.startIndex : b.order;
  return aIndex - bIndex;
}

function updateModifierTarget(componentId, targetId) {
  const sentence = getCurrentSentence();
  const component = sentence?.components.find((item) => item.id === componentId);
  const target = sentence?.components.find((item) => item.id === targetId);
  if (!sentence || !component || component.role !== "adjective") {
    return;
  }

  if (!target) {
    delete component.modifierTargetId;
    delete component.modifierTargetStart;
    delete component.modifierTargetEnd;
    renderEditView();
    return;
  }

  setModifierTarget(component, target);
  renderEditView();
}

function setModifierTarget(component, target) {
  component.modifierTargetId = target.id;
  component.modifierTargetStart = target.startIndex;
  component.modifierTargetEnd = target.endIndex;
  component.modifierTargetIndexes = getIndexRange(target.startIndex, target.endIndex);
}

function updateModifierTargetWords(componentId, indexes) {
  const sentence = getCurrentSentence();
  const component = sentence?.components.find((item) => item.id === componentId);
  if (!sentence || !component || component.role !== "adjective") {
    return;
  }

  setModifierTargetWords(component, indexes);
  renderEditView();
}

function setModifierTargetWords(component, indexes) {
  const wordCount = getPlainWords(getCurrentSentence()?.text || "").length;
  const normalizedIndexes = [...new Set(indexes)]
    .filter((index) => Number.isInteger(index) && index >= 0 && index < wordCount)
    .sort((a, b) => a - b);

  if (normalizedIndexes.length === 0) {
    delete component.modifierTargetId;
    delete component.modifierTargetStart;
    delete component.modifierTargetEnd;
    delete component.modifierTargetIndexes;
    return;
  }

  component.modifierTargetIndexes = normalizedIndexes;
  component.modifierTargetStart = normalizedIndexes[0];
  component.modifierTargetEnd = normalizedIndexes[normalizedIndexes.length - 1] + 1;
  delete component.modifierTargetId;
}

function ensureModifierTarget(component) {
  if (component.role !== "adjective" || getModifierTargetIndexes(component).length > 0) {
    return;
  }

  const target = findDefaultModifierTarget(component);
  if (target) {
    setModifierTarget(component, target);
  }
}

function findDefaultModifierTarget(component) {
  const options = getModifierTargetOptions(component);
  if (options.length === 0) {
    return null;
  }

  const componentStart = Number.isFinite(component.startIndex) ? component.startIndex : component.order;
  return options.find((target) => Number.isFinite(target.startIndex) && target.startIndex > componentStart) || options[options.length - 1];
}

function getModifierTargetIndexes(component) {
  // 형용사어는 자기 자신의 단어를 수식 대상으로 삼을 수 없다. 과거 경계가 다를 때 저장된
  // 자기 단어 인덱스가 남아 있으면 화살표/밑줄이 자기 박스 쪽으로 끌려가므로 항상 제외한다.
  const isOwnWord = (index) =>
    Number.isFinite(component.startIndex) &&
    Number.isFinite(component.endIndex) &&
    index >= component.startIndex &&
    index < component.endIndex;

  if (Array.isArray(component.modifierTargetIndexes)) {
    return component.modifierTargetIndexes
      .map((index) => Number(index))
      .filter((index) => Number.isInteger(index) && index >= 0 && !isOwnWord(index))
      .sort((a, b) => a - b);
  }

  if (Number.isFinite(component.modifierTargetStart) && Number.isFinite(component.modifierTargetEnd)) {
    return getIndexRange(component.modifierTargetStart, component.modifierTargetEnd).filter((index) => !isOwnWord(index));
  }

  return [];
}

function getIndexRange(startIndex, endIndex) {
  if (!Number.isFinite(startIndex) || !Number.isFinite(endIndex)) {
    return [];
  }

  const indexes = [];
  for (let index = startIndex; index < endIndex; index += 1) {
    indexes.push(index);
  }
  return indexes;
}

function getVisibleModifierTargetIndexes(visibleMinorComponents) {
  const indexes = new Set();
  visibleMinorComponents
    .filter((component) => component.role === "adjective")
    .forEach((component) => getModifierTargetIndexes(component).forEach((index) => indexes.add(index)));
  return indexes;
}

function renderModifierTargetBrackets(visibleMinorComponents) {
  const stage = document.querySelector(".presentation-stage");
  if (!stage) {
    return;
  }

  stage.querySelectorAll(".modifier-target-bracket").forEach((bracket) => bracket.remove());
  visibleMinorComponents
    .filter((component) => component.role === "adjective")
    .forEach((component) => {
      getContiguousGroups(getModifierTargetIndexes(component)).forEach((indexes) => {
        const bracket = document.createElement("span");
        bracket.className = "modifier-target-bracket";
        bracket.dataset.indexes = indexes.join(",");
        stage.appendChild(bracket);
      });
    });
  updateModifierTargetBrackets();
}

function updateModifierTargetBrackets() {
  if (state.mode !== "present") {
    return;
  }

  const stage = document.querySelector(".presentation-stage");
  const stageRect = stage?.getBoundingClientRect();
  if (!stageRect) {
    return;
  }

  stage.querySelectorAll(".modifier-target-bracket").forEach((bracket) => {
    const indexes = (bracket.dataset.indexes || "")
      .split(",")
      .map((index) => Number(index))
      .filter((index) => Number.isInteger(index));
    const targetWords = getVisibleWordElementsByIndexes(indexes);
    if (targetWords.length === 0) {
      bracket.classList.add("hidden");
      return;
    }

    const left = Math.min(...targetWords.map((word) => word.getBoundingClientRect().left)) - stageRect.left;
    const right = Math.max(...targetWords.map((word) => word.getBoundingClientRect().right)) - stageRect.left;
    const bottom = Math.max(...targetWords.map((word) => word.getBoundingClientRect().bottom)) - stageRect.top;
    bracket.classList.remove("hidden");
    bracket.style.left = `${Math.round(left)}px`;
    bracket.style.top = `${Math.round(bottom + 8)}px`;
    bracket.style.width = `${Math.round(right - left)}px`;
  });
}

function getVisibleWordElementsByIndexes(indexes) {
  const indexSet = new Set(indexes);
  return [...document.querySelectorAll(".presentation-stage .present-word[data-word-index]")]
    .filter((word) => indexSet.has(Number(word.dataset.wordIndex)));
}

function getContiguousGroups(indexes) {
  const sortedIndexes = [...new Set(indexes)].sort((a, b) => a - b);
  const groups = [];
  sortedIndexes.forEach((index) => {
    const lastGroup = groups[groups.length - 1];
    if (!lastGroup || lastGroup[lastGroup.length - 1] + 1 !== index) {
      groups.push([index]);
      return;
    }
    lastGroup.push(index);
  });
  return groups;
}

function getModifierTargetComponent(component) {
  const sentence = getCurrentSentence();
  if (!sentence || component.role !== "adjective") {
    return null;
  }

  const byId = sentence.components.find((target) => target.id === component.modifierTargetId);
  if (byId) {
    return byId;
  }

  return sentence.components.find((target) => {
    return target.id !== component.id
      && Number.isFinite(component.modifierTargetStart)
      && Number.isFinite(component.modifierTargetEnd)
      && target.startIndex === component.modifierTargetStart
      && target.endIndex === component.modifierTargetEnd;
  }) || null;
}

function isVisibleModifierTarget(component, visibleMinorComponents) {
  return visibleMinorComponents.some((minor) => getModifierTargetComponent(minor)?.id === component.id);
}

function goToPresentationNext() {
  const minorCount = getCurrentMinorCount();
  if (state.minorRevealCount < minorCount) {
    state.minorRevealCount += 1;
    renderPresentView();
    return;
  }

  if (state.currentSentenceIndex >= state.sentences.length - 1) {
    return;
  }
  goToSentence(state.currentSentenceIndex + 1, 0);
}

function goToPresentationPrev() {
  if (state.minorRevealCount > 0) {
    state.minorRevealCount -= 1;
    renderPresentView();
    return;
  }

  const previousIndex = state.currentSentenceIndex - 1;
  if (previousIndex < 0) {
    return;
  }
  const previousSentence = state.sentences[previousIndex];
  const previousMinorCount = getComponentsByLane(previousSentence, "minor").length;
  goToSentence(previousIndex, previousMinorCount);
}

function goToPresentationSentence(offset) {
  const nextIndex = state.currentSentenceIndex + offset;
  if (nextIndex < 0 || nextIndex >= state.sentences.length) {
    return;
  }
  goToSentence(nextIndex, 0);
}

function goToPresentationFirstSentence() {
  goToSentence(0, 0);
}

// "전체화면" 버튼: 발표 화면을 전체화면으로 들어가거나 빠져나온다.
function togglePresentFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen?.();
    return;
  }
  elements.presentView.requestFullscreen?.().catch(() => {});
}

function handleFullscreenChange() {
  const isFullscreen = Boolean(document.fullscreenElement);
  elements.presentFitButton.textContent = isFullscreen ? "전체화면 종료 (🔍)" : "전체화면 (🔍)";
  // 전체화면 진입/이탈로 화면 크기가 바뀌므로 글자 크기와 배치를 다시 맞춘다.
  applySettings();
  schedulePresentationFit();
}

function handlePresentationLastButton() {
  const lastIndex = state.sentences.length - 1;
  if (state.currentSentenceIndex >= lastIndex) {
    // 마지막 문장에서는 "이전 단계" 버튼으로 발표를 끝내고 2단계(수정) 화면으로 돌아간다.
    setMode("edit");
    return;
  }
  goToSentence(lastIndex, 0);
}

function handlePresentationClick(event) {
  if (state.mode !== "present") {
    return;
  }

  const interactiveTarget = event.target.closest("button, input, select, textarea, a, [draggable='true']");
  if (interactiveTarget) {
    return;
  }

  goToPresentationNext();
}

function moveComponent(componentId, targetLane, targetIndex = null) {
  const sentence = getCurrentSentence();
  const component = sentence?.components.find((item) => item.id === componentId);
  if (!sentence || !component) {
    return;
  }

  component.lane = targetLane;
  clearManualMinorPosition(component);
  if (targetLane === "major" && !MAJOR_ROLES.has(component.role)) {
    component.role = "subject";
  }
  if (targetLane === "minor" && MAJOR_ROLES.has(component.role)) {
    component.role = "adverb";
  }
  if (component.role !== "adjective") {
    delete component.modifierTargetId;
    delete component.modifierTargetStart;
    delete component.modifierTargetEnd;
    delete component.modifierTargetIndexes;
  }

  const laneComponents = getComponentsByLane(sentence, targetLane).filter((item) => item.id !== componentId);
  const nextIndex = targetIndex === null ? laneComponents.length : Math.max(0, Math.min(targetIndex, laneComponents.length));
  laneComponents.splice(nextIndex, 0, component);
  laneComponents.forEach((item, index) => {
    item.order = index + 1;
  });

  reorderLane(sentence, targetLane === "major" ? "minor" : "major");
  renderEditView();
}

function splitSelectedWords(componentId, selectedIndexes) {
  const sentence = getCurrentSentence();
  const component = sentence?.components.find((item) => item.id === componentId);
  if (!sentence || !component) {
    return;
  }

  const words = getComponentWords(component);
  const selectedSet = new Set(selectedIndexes.filter((index) => index >= 0 && index < words.length));
  if (words.length <= 1 || selectedSet.size === 0) {
    return;
  }

  const replacement = [];
  let currentGroup = null;
  words.forEach((word, index) => {
    const startIndex = Number.isFinite(component.startIndex) ? component.startIndex + index : undefined;
    const selected = selectedSet.has(index);

    if (!currentGroup || currentGroup.selected !== selected) {
      currentGroup = { words: [], startIndex, selected };
      replacement.push(currentGroup);
    }
    currentGroup.words.push(word);
    currentGroup.endIndex = Number.isFinite(startIndex) ? startIndex + 1 : undefined;
  });

  const nextComponents = replacement.map((item) => {
    if (item.id) {
      return item;
    }
    return createDerivedComponent(component, item.words, item.startIndex, item.endIndex);
  });

  const componentIndex = sentence.components.findIndex((item) => item.id === component.id);
  if (componentIndex === -1) {
    return;
  }
  sentence.components.splice(componentIndex, 1, ...nextComponents);
  reorderLane(sentence, component.lane);
  renderEditView();
}

function createDerivedComponent(baseComponent, words, startIndex, endIndex) {
  const derived = {
    ...baseComponent,
    id: getNextComponentId(baseComponent.id),
    text: words.join(" "),
    startIndex,
    endIndex
  };
  clearManualMinorPosition(derived);
  return derived;
}

// 발표 화면에서 드래그로 정해진 수동 위치(점 고정/박스)를 초기화한다.
function clearManualMinorPosition(component) {
  delete component.pinnedAnchor;
  delete component.boxPercent;
}

function getNextComponentId(baseId) {
  state.componentSerial += 1;
  return `${baseId}-u${state.componentSerial}`;
}

function updateComponentRole(componentId, role) {
  const sentence = getCurrentSentence();
  const component = sentence?.components.find((item) => item.id === componentId);
  if (!component) {
    return;
  }

  component.role = role;
  component.lane = ROLE_BY_VALUE[role].lane;
  clearManualMinorPosition(component);
  if (role === "adjective") {
    ensureModifierTarget(component);
  } else {
    delete component.modifierTargetId;
    delete component.modifierTargetStart;
    delete component.modifierTargetEnd;
    delete component.modifierTargetIndexes;
  }
  reorderLane(sentence, "major");
  reorderLane(sentence, "minor");
  renderEditView();
}

function reorderLane(sentence, lane) {
  getComponentsByLane(sentence, lane).forEach((component, index) => {
    component.order = index + 1;
  });
}

function handleDragStart(event) {
  const chip = event.currentTarget;
  state.draggedComponentId = chip.dataset.componentId;
  chip.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", state.draggedComponentId);
}

function handleDragEnd(event) {
  event.currentTarget.classList.remove("dragging");
  state.draggedComponentId = null;
  document.querySelectorAll(".edit-lane").forEach((lane) => lane.classList.remove("drag-over"));
}

function handleLaneDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add("drag-over");
}

function handleLaneDragLeave(event) {
  event.currentTarget.classList.remove("drag-over");
}

function handleLaneDrop(event) {
  event.preventDefault();
  const lane = event.currentTarget;
  lane.classList.remove("drag-over");
  const componentId = event.dataTransfer.getData("text/plain") || state.draggedComponentId;
  if (!componentId) {
    return;
  }

  const targetLane = lane.dataset.lane;
  // 다른 성분 위에 직접 겹쳐 놓으면 병합한다(README: "겹치게 드래그한 성분 병합").
  // 병합 결과 텍스트는 mergeComponents에서 startIndex 순(문장 순서)으로 합쳐진다.
  // 성분 사이 빈 공간에 놓으면 위치만 이동한다.
  const mergeTargetId = getMergeTargetId(lane, componentId, event.clientX, event.clientY);
  if (mergeTargetId) {
    mergeComponents(componentId, mergeTargetId, targetLane);
    return;
  }
  const targetIndex = getDropIndex(lane, event.clientX, event.clientY);
  moveComponent(componentId, targetLane, targetIndex);
}

function getMergeTargetId(lane, draggedComponentId, clientX, clientY) {
  const targetChip = [...lane.querySelectorAll(".edit-chip:not(.dragging)")].find((chip) => {
    if (chip.dataset.componentId === draggedComponentId) {
      return false;
    }
    const rect = chip.getBoundingClientRect();
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  });
  return targetChip?.dataset.componentId || null;
}

function mergeComponents(sourceId, targetId, targetLane) {
  const sentence = getCurrentSentence();
  const source = sentence?.components.find((item) => item.id === sourceId);
  const target = sentence?.components.find((item) => item.id === targetId);
  if (!sentence || !source || !target || source.id === target.id) {
    return;
  }

  const ordered = [source, target].sort((a, b) => {
    const aIndex = Number.isFinite(a.startIndex) ? a.startIndex : a.order;
    const bIndex = Number.isFinite(b.startIndex) ? b.startIndex : b.order;
    return aIndex - bIndex;
  });
  const role = targetLane === target.lane ? target.role : ROLE_OPTIONS.find((item) => item.lane === targetLane)?.value || target.role;
  const merged = {
    ...target,
    id: getNextComponentId(`${target.id}-${source.id}`),
    text: ordered.map((item) => item.text).join(" "),
    role,
    lane: targetLane,
    startIndex: Math.min(...ordered.map((item) => Number.isFinite(item.startIndex) ? item.startIndex : Infinity)),
    endIndex: Math.max(...ordered.map((item) => Number.isFinite(item.endIndex) ? item.endIndex : -Infinity))
  };
  if (!Number.isFinite(merged.startIndex)) {
    delete merged.startIndex;
  }
  if (!Number.isFinite(merged.endIndex)) {
    delete merged.endIndex;
  }
  if (merged.role !== "adjective") {
    delete merged.modifierTargetId;
    delete merged.modifierTargetStart;
    delete merged.modifierTargetEnd;
    delete merged.modifierTargetIndexes;
  }
  clearManualMinorPosition(merged);

  const insertIndex = sentence.components.findIndex((item) => item.id === target.id);
  sentence.components = sentence.components.filter((item) => item.id !== source.id && item.id !== target.id);
  sentence.components.splice(Math.max(0, insertIndex), 0, merged);
  reorderLane(sentence, "major");
  reorderLane(sentence, "minor");
  renderEditView();
}

function handlePresentMinorDragStart(event) {
  const chip = event.currentTarget;
  state.draggedComponentId = chip.dataset.componentId;
  chip.classList.add("dragging");
  elements.minorPresentLane.classList.add("present-drop-active");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", state.draggedComponentId);
}

function handlePresentMinorDragEnd(event) {
  event.currentTarget.classList.remove("dragging");
  elements.minorPresentLane.classList.remove("present-drop-active");
  state.draggedComponentId = null;
}

function handlePresentMinorDragOver(event) {
  event.preventDefault();
  elements.minorPresentLane.classList.add("present-drop-active");
}

function handlePresentMinorDrop(event) {
  event.preventDefault();
  elements.minorPresentLane.classList.remove("present-drop-active");
  const componentId = event.dataTransfer.getData("text/plain") || state.draggedComponentId;
  if (!componentId) {
    return;
  }
  moveMinorAnchor(componentId, event.clientX);
}

function moveMinorAnchor(componentId, clientX) {
  const sentence = getCurrentSentence();
  const component = sentence?.components.find((item) => item.id === componentId);
  if (!sentence || !component || component.lane !== "minor") {
    return;
  }

  const metrics = getMinorLaneMetrics();
  if (!metrics.width) {
    return;
  }
  const targetPercent = clamp(0, ((clientX - metrics.left) / metrics.width) * 100, 100);
  const edgePercent = (getStageEdgeGuard(metrics) / metrics.width) * 100;

  if (component.role === "adjective") {
    // 형용사어: 화살표는 수식 대상 가운데에 고정하고 박스 위치만 옮긴다.
    component.boxPercent = Math.round(clamp(edgePercent, targetPercent, 100 - edgePercent) * 10) / 10;
    renderPresentView();
    return;
  }

  // 부사어: 동그라미 점을 문장 맨앞/단어 사이/맨뒤 슬롯으로 스냅한다.
  const slots = getMinorSlots();
  if (slots.length === 0) {
    return;
  }
  const nearestSlot = slots.reduce((closest, slot) => {
    return Math.abs(slot.percent - targetPercent) < Math.abs(closest.percent - targetPercent) ? slot : closest;
  }, slots[0]);
  const span = Math.max(1, (component.endIndex || 0) - (component.startIndex || 0));
  const wordCount = Math.max(sentence.wordCount || 1, 1);
  const startIndex = clamp(0, Math.round(nearestSlot.index), wordCount);
  component.startIndex = startIndex;
  component.endIndex = Math.min(wordCount, startIndex + span);
  // 드래그한 부사어는 선택한 슬롯에 고정(pinned)되어 다른 종요소 자동 배치에 영향받지 않는다.
  component.pinnedAnchor = true;
  renderPresentView();
}

function getDropIndex(lane, clientX, clientY) {
  const chips = [...lane.querySelectorAll(".edit-chip:not(.dragging)")];
  const closest = chips.findIndex((chip) => {
    const rect = chip.getBoundingClientRect();
    const isAboveHalf = clientY < rect.top + rect.height / 2;
    const isBeforeHalf = clientX < rect.left + rect.width / 2;
    return isAboveHalf || (clientY <= rect.bottom && isBeforeHalf);
  });
  return closest === -1 ? chips.length : closest;
}

function applySettings() {
  elements.app.dataset.theme = state.settings.theme;
  elements.themeSelect.value = state.settings.theme;
  const width = window.innerWidth;
  const majorBase = clamp(56, width * 0.07, 124);
  const minorBase = clamp(20, width * 0.022, 42);
  elements.app.style.setProperty("--font-major-current", `${Math.round(majorBase)}px`);
  elements.app.style.setProperty("--font-minor-current", `${Math.round(minorBase)}px`);
}

function schedulePresentationFit() {
  let pass = 0;
  const runPass = () => {
    fitMajorLine();
    rebuildMinorSlotsFromWords();
    updateMinorPositions();
    fitMinorRows();
    clampMinorBoxes();
    updateModifierTargetBrackets();
    updateMinorConnectorLengths();
    pass += 1;
    if (pass < 5) {
      requestAnimationFrame(runPass);
    }
  };
  requestAnimationFrame(runPass);
}

function fitMajorLine() {
  if (state.mode !== "present") {
    return;
  }

  const lane = document.querySelector(".presentation-stage");
  const currentSize = Number.parseFloat(getComputedStyle(elements.app).getPropertyValue("--font-major-current"));
  const laneRect = lane.getBoundingClientRect();
  const edgeGuard = getStageEdgeGuard(laneRect);
  const anchorReserve = getMajorEdgeGap() * 2;
  const edgeGroupReserve = getMajorEdgeAnchorReserve(laneRect.width);
  const edgeReserve = edgeGuard * 2 + anchorReserve + edgeGroupReserve;
  const availableWidth = Math.max(220, lane.clientWidth - edgeReserve);
  const bounds = getRenderedBounds(elements.majorPresentLane.querySelectorAll(".present-word"));
  if (!bounds || !availableWidth) {
    return;
  }

  const ratio = availableWidth / bounds.width;
  if (ratio >= 1) {
    return;
  }

  const nextSize = Math.max(24, Math.floor(currentSize * Math.max(0.18, ratio) * 0.98));
  elements.app.style.setProperty("--font-major-current", `${nextSize}px`);
}

function getMajorEdgeAnchorReserve(laneWidth) {
  const wordCount = elements.majorPresentLane.querySelectorAll(".present-word").length;
  if (wordCount === 0) {
    return 0;
  }

  // 공개된 종요소 수에 따라 주요소 줄 크기가 달라지면, 종요소를 1~2개만 공개했을 때
  // 가장자리 점이 첫/마지막 단어와 겹친다. 공개 단계와 무관하게 항상 동일한 여백을 두도록
  // 현재 문장의 모든 종요소를 기준으로 가장자리 점 개수를 계산한다.
  const allMinorComponents = getComponentsByLane(getCurrentSentence(), "minor");
  const startAnchorCount = allMinorComponents.filter((component) => {
    return Number.isFinite(component.startIndex) && component.startIndex <= 0;
  }).length;
  const endAnchorCount = allMinorComponents.filter((component) => {
    return Number.isFinite(component.startIndex) && component.startIndex >= wordCount;
  }).length;
  const maxEdgeAnchorCount = Math.max(startAnchorCount, endAnchorCount);
  return Math.max(0, maxEdgeAnchorCount - 1) * laneWidth * (MINOR_ANCHOR_SPREAD / 100);
}

function getRenderedBounds(nodeList) {
  const rects = [...nodeList].map((element) => element.getBoundingClientRect());
  if (rects.length === 0) {
    return null;
  }

  const left = Math.min(...rects.map((rect) => rect.left));
  const right = Math.max(...rects.map((rect) => rect.right));
  return { left, right, width: right - left };
}

function fitMinorRows() {
  if (state.mode !== "present") {
    return;
  }

  const chips = [...elements.minorPresentLane.querySelectorAll(".present-chip")];
  if (chips.length === 0) {
    return;
  }

  const laneRect = getMinorLaneMetrics();
  const edgeGuard = getStageEdgeGuard(laneRect);
  const availableWidth = Math.max(220, laneRect.width - edgeGuard * 2);
  const widestWidth = Math.max(...chips.map((chip) => chip.getBoundingClientRect().width));
  if (widestWidth <= availableWidth) {
    return;
  }

  const currentSize = Number.parseFloat(getComputedStyle(elements.app).getPropertyValue("--font-minor-current"));
  const ratio = availableWidth / widestWidth;
  const nextSize = Math.max(8, Math.floor(currentSize * ratio * 0.9));
  elements.app.style.setProperty("--font-minor-current", `${nextSize}px`);
}

function clampMinorBoxes() {
  if (state.mode !== "present") {
    return;
  }

  const laneRect = getMinorLaneMetrics();
  if (!laneRect.width) {
    return;
  }

  elements.minorPresentLane.querySelectorAll(".present-chip").forEach((chip) => {
    const anchorPercent = Number.parseFloat(chip.style.getPropertyValue("--anchor-percent")) || 50;
    const desiredBox = Number.parseFloat(chip.style.getPropertyValue("--box-percent"));
    const targetBox = Number.isFinite(desiredBox) ? desiredBox : anchorPercent;
    const chipRect = chip.getBoundingClientRect();
    // 박스가 가장자리(문장 맨앞/맨뒤 슬롯)까지 충분히 붙을 수 있도록 여백을 작게 잡는다.
    const boxGuard = clamp(16, laneRect.width * 0.02, 56);
    const halfPercent = ((chipRect.width / 2 + boxGuard) / laneRect.width) * 100;
    const boxPercent = halfPercent >= 50 ? 50 : clamp(halfPercent, targetBox, 100 - halfPercent);
    chip.style.setProperty("--box-percent", `${Math.round(boxPercent * 10) / 10}%`);
    const anchorX = (anchorPercent / 100) * laneRect.width;
    const boxCenterX = (boxPercent / 100) * laneRect.width;
    // 점/화살표는 반드시 실제 슬롯(문장 맨앞·단어 사이·맨뒤, 단어와 겹치지 않는 위치)에
    // 정확히 닿아야 한다. 긴 종요소 박스가 화면 안에 들어오도록 가운데로 재배치되면
    // 슬롯이 박스 밖에 놓이는데, 이때 연결선을 박스 밖까지 뻗어 슬롯에 닿게 한다.
    // (앵커는 이미 lane 가장자리 안으로 보정되어 있어 화면 밖으로 나가지 않는다.)
    const rawConnector = 50 + ((anchorX - boxCenterX) / chipRect.width) * 100;
    const connectorPercent = clamp(-120, rawConnector, 220);
    chip.style.setProperty("--connector-x", `${Math.round(connectorPercent * 10) / 10}%`);
  });
}

function updateMinorConnectorLengths() {
  if (state.mode !== "present") {
    return;
  }

  const stageRect = document.querySelector(".presentation-stage")?.getBoundingClientRect();
  const majorRect = elements.majorPresentLane.getBoundingClientRect();
  if (!stageRect || !majorRect.height) {
    return;
  }

  const dotY = majorRect.top + majorRect.height * 0.85 - stageRect.top;
  elements.minorPresentLane.querySelectorAll(".present-chip").forEach((chip) => {
    const chipRect = chip.getBoundingClientRect();
    const chipTop = chipRect.top - stageRect.top;
    const component = getCurrentSentence()?.components.find((item) => item.id === chip.dataset.componentId);
    const targetBottomY = component?.role === "adjective"
      ? getModifierTargetBottomY(component, stageRect) ?? dotY
      : dotY;
    const connectorLength = Math.max(28, Math.round(chipTop - targetBottomY));
    chip.style.setProperty("--connector-length", `${connectorLength}px`);
  });
}

function getModifierTargetBottomY(component, stageRect) {
  const indexes = getModifierTargetIndexes(component);
  if (indexes.length === 0) {
    return null;
  }

  const targetWords = getVisibleWordElementsByIndexes(indexes);
  if (targetWords.length === 0) {
    return null;
  }

  const bottom = Math.max(...targetWords.map((word) => word.getBoundingClientRect().bottom));
  return bottom - stageRect.top + 10;
}

function updateMinorPositions() {
  const sentence = getCurrentSentence();
  if (!sentence) {
    return;
  }

  const components = getComponentsByLane(sentence, "minor").slice(0, state.minorRevealCount);
  const metrics = getMinorLaneMetrics();
  const edgePercent = metrics.width ? (getStageEdgeGuard(metrics) / metrics.width) * 100 : 6;
  const anchorById = new Map();
  const boxById = new Map();
  const autoAdverbs = [];

  components.forEach((component) => {
    if (component.role === "adjective") {
      // 형용사어: 화살표는 항상 수식 대상 정중앙. 박스만 드래그로 옮길 수 있다.
      anchorById.set(component.id, getModifierTargetCenterPercent(component));
      if (Number.isFinite(component.boxPercent)) {
        boxById.set(component.id, clamp(edgePercent, component.boxPercent, 100 - edgePercent));
      }
      return;
    }
    if (component.pinnedAnchor) {
      // 드래그로 직접 옮긴 부사어: 선택한 슬롯(단어 사이)에 고정하고 자동 배치(spread)에서 제외해 독립적으로 움직인다.
      anchorById.set(component.id, getClosestSlot(Number.isFinite(component.startIndex) ? component.startIndex : component.order - 1).percent);
      return;
    }
    autoAdverbs.push({
      component,
      order: component.order,
      percent: getClosestSlot(Number.isFinite(component.startIndex) ? component.startIndex : component.order - 1).percent
    });
  });

  spreadAnchors(autoAdverbs, metrics, edgePercent).forEach((percent, id) => anchorById.set(id, percent));

  elements.minorPresentLane.querySelectorAll(".present-chip").forEach((chip) => {
    const id = chip.dataset.componentId;
    const anchor = anchorById.get(id);
    if (Number.isFinite(anchor)) {
      chip.style.setProperty("--anchor-percent", `${anchor}%`);
      const box = boxById.has(id) ? boxById.get(id) : anchor;
      chip.style.setProperty("--box-percent", `${box}%`);
    }
  });
}

async function exportAnalysisTxt() {
  if (state.sentences.length === 0 && elements.passageInput.value.trim()) {
    preparePresentation();
  }

  if (state.sentences.length === 0) {
    alert("저장할 분석 결과가 없습니다.");
    return;
  }

  const content = buildAnalysisText();
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const fileName = getAnalysisFileName();

  if (window.showSaveFilePicker) {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: "Text file",
            accept: { "text/plain": [".txt"] }
          }
        ]
      });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }
      console.warn("Save picker failed. Falling back to download.", error);
    }
  }

  downloadAnalysisTxt(blob, fileName);
}

function getAnalysisFileName() {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return `sentence-analysis-${stamp}.txt`;
}

function downloadAnalysisTxt(blob, fileName) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function buildAnalysisText() {
  const payload = buildAnalysisPayload();
  const lines = [
    EXPORT_MARKER,
    "영어 문장 분석 저장 파일",
    `저장 시각: ${payload.savedAt}`,
    `총 문장 수: ${payload.sentences.length}`,
    "",
    "[문장 및 성분 인덱스]"
  ];

  payload.sentences.forEach((sentence) => {
    lines.push("");
    lines.push(`[문장 ${sentence.sentenceIndex}] ${sentence.text}`);
    lines.push(`  단어 수: ${sentence.wordCount}`);
    sentence.components.forEach((component) => {
      lines.push(`  - 성분 ${component.componentIndex}: id=${component.id}, lane=${component.lane}, role=${component.role}, order=${component.order}, wordIndex0=${component.startIndex}-${component.endIndex}, wordIndex1=${formatOneBasedRange(component.startIndex, component.endIndex)}, text="${component.text}"`);
    });
  });

  lines.push("");
  lines.push(EXPORT_JSON_START);
  lines.push(JSON.stringify(payload, null, 2));
  lines.push(EXPORT_JSON_END);
  return lines.join("\n");
}

function buildAnalysisPayload() {
  return {
    version: 1,
    app: "sentence-presentation-board",
    savedAt: new Date().toISOString(),
    passageText: state.passageText || state.sentences.map((sentence) => sentence.text).join(" "),
    currentSentenceIndex: state.currentSentenceIndex,
    componentSerial: state.componentSerial,
    settings: { ...state.settings },
    sentences: state.sentences.map((sentence, sentenceIndex) => ({
      id: sentence.id || `sentence-${sentenceIndex + 1}`,
      sentenceIndex: sentenceIndex + 1,
      text: sentence.text,
      wordCount: Number.isFinite(sentence.wordCount) ? sentence.wordCount : getPlainWords(sentence.text).length,
      components: sentence.components.map((component, componentIndex) => ({
        id: component.id,
        sentenceIndex: sentenceIndex + 1,
        componentIndex: componentIndex + 1,
        text: component.text,
        role: component.role,
        lane: component.lane,
        order: component.order,
        startIndex: component.startIndex,
        endIndex: component.endIndex,
        modifierTargetId: component.modifierTargetId,
        modifierTargetStart: component.modifierTargetStart,
        modifierTargetEnd: component.modifierTargetEnd,
        modifierTargetIndexes: component.modifierTargetIndexes,
        pinnedAnchor: component.pinnedAnchor,
        boxPercent: component.boxPercent,
        words: getComponentWords(component)
      }))
    }))
  };
}

function formatOneBasedRange(startIndex, endIndex) {
  if (!Number.isFinite(Number(startIndex)) || !Number.isFinite(Number(endIndex))) {
    return "unknown";
  }
  return `${Number(startIndex) + 1}-${Number(endIndex)}`;
}

function triggerAnalysisImport() {
  elements.analysisFileInput.value = "";
  elements.analysisFileInput.click();
}

function handleAnalysisFileSelected(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      importAnalysisTxt(String(reader.result || ""));
    } catch (error) {
      alert(error.message || "TXT 파일을 불러오지 못했습니다.");
    }
  };
  reader.onerror = () => alert("TXT 파일을 읽는 중 오류가 발생했습니다.");
  reader.readAsText(file, "utf-8");
}

function importAnalysisTxt(content) {
  const payload = parseAnalysisTxt(content);
  const loaded = normalizeImportedAnalysis(payload);
  state.passageText = loaded.passageText;
  state.sentences = loaded.sentences;
  state.currentSentenceIndex = loaded.currentSentenceIndex;
  state.minorRevealCount = 0;
  state.componentSerial = loaded.componentSerial;
  state.settings = { ...state.settings, ...loaded.settings };
  elements.passageInput.value = state.passageText;
  elements.inputMessage.textContent = "저장된 분석 결과를 불러왔습니다.";
  setMode("edit");
}

function parseAnalysisTxt(content) {
  const start = content.indexOf(EXPORT_JSON_START);
  const end = content.indexOf(EXPORT_JSON_END);
  if (start !== -1 && end > start) {
    const jsonText = content.slice(start + EXPORT_JSON_START.length, end).trim();
    return JSON.parse(jsonText);
  }

  const trimmed = content.trim();
  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed);
  }

  throw new Error("이 앱에서 저장한 분석 TXT 파일이 아닙니다.");
}

function normalizeImportedAnalysis(payload) {
  if (!payload || !Array.isArray(payload.sentences)) {
    throw new Error("TXT 파일 안에 문장 분석 데이터가 없습니다.");
  }

  const sentences = payload.sentences
    .map((sentence, sentenceIndex) => normalizeImportedSentence(sentence, sentenceIndex))
    .filter(Boolean);

  if (sentences.length === 0) {
    throw new Error("불러올 문장이 없습니다.");
  }

  return {
    passageText: String(payload.passageText || sentences.map((sentence) => sentence.text).join(" ")),
    sentences,
    currentSentenceIndex: clamp(0, Number(payload.currentSentenceIndex) || 0, sentences.length - 1),
    componentSerial: Math.max(Number(payload.componentSerial) || 1, countImportedComponents(sentences) + 1),
    settings: typeof payload.settings === "object" && payload.settings ? payload.settings : {}
  };
}

function normalizeImportedSentence(sentence, sentenceIndex) {
  const text = String(sentence?.text || "").trim();
  if (!text) {
    return null;
  }

  const components = Array.isArray(sentence.components) && sentence.components.length > 0
    ? sentence.components.map((component, componentIndex) => normalizeImportedComponent(component, sentenceIndex, componentIndex)).filter(Boolean)
    : analyzeSentence(text, sentenceIndex);

  return {
    id: String(sentence.id || `sentence-${sentenceIndex + 1}`),
    text,
    wordCount: Number.isFinite(Number(sentence.wordCount)) ? Number(sentence.wordCount) : getPlainWords(text).length,
    components
  };
}

function normalizeImportedComponent(component, sentenceIndex, componentIndex) {
  const role = ROLE_BY_VALUE[component?.role] ? component.role : "adverb";
  const lane = component?.lane === "major" || component?.lane === "minor" ? component.lane : ROLE_BY_VALUE[role].lane;
  const text = String(component?.text || "").trim();
  if (!text) {
    return null;
  }

  const startIndex = Number(component?.startIndex);
  const endIndex = Number(component?.endIndex);
  const modifierTargetStart = Number(component?.modifierTargetStart);
  const modifierTargetEnd = Number(component?.modifierTargetEnd);
  const boxPercent = Number(component?.boxPercent);
  return {
    // 저장 파일에 중복 id가 있을 수 있으므로 불러올 때 항상 고유 id를 새로 부여한다.
    // (수식 대상은 modifierTargetIndexes(단어 인덱스)로 복원되므로 id 변경의 영향이 없다)
    id: `s${sentenceIndex + 1}-c${componentIndex + 1}`,
    text,
    role,
    lane,
    order: Number.isFinite(Number(component?.order)) ? Number(component.order) : componentIndex + 1,
    startIndex: Number.isFinite(startIndex) ? startIndex : undefined,
    endIndex: Number.isFinite(endIndex) ? endIndex : undefined,
    modifierTargetStart: Number.isFinite(modifierTargetStart) ? modifierTargetStart : undefined,
    modifierTargetEnd: Number.isFinite(modifierTargetEnd) ? modifierTargetEnd : undefined,
    modifierTargetIndexes: Array.isArray(component?.modifierTargetIndexes)
      ? component.modifierTargetIndexes.map((index) => Number(index)).filter((index) => Number.isInteger(index) && index >= 0)
      : undefined,
    pinnedAnchor: component?.pinnedAnchor === true ? true : undefined,
    boxPercent: Number.isFinite(boxPercent) ? boxPercent : undefined
  };
}

function countImportedComponents(sentences) {
  return sentences.reduce((count, sentence) => count + sentence.components.length, 0);
}

function clamp(min, value, max) {
  return Math.max(min, Math.min(value, max));
}

function updateNavButtons() {
  const isFirst = state.currentSentenceIndex === 0;
  const isLast = state.currentSentenceIndex >= state.sentences.length - 1;
  const minorCount = getCurrentMinorCount();
  const isFirstPresentationStep = isFirst && state.minorRevealCount === 0;
  const isLastPresentationStep = isLast && state.minorRevealCount >= minorCount;

  [elements.editFirstButton, elements.editPrevButton].forEach((button) => {
    button.disabled = isFirst;
  });
  elements.presentPrevButton.disabled = isFirstPresentationStep;

  [elements.editLastButton, elements.editNextButton].forEach((button) => {
    button.disabled = isLast;
  });
  elements.presentNextButton.disabled = isLastPresentationStep;
  elements.presentFirstSentenceButton.disabled = isFirst;
  elements.presentLastSentenceButton.textContent = isLast ? "이전 단계" : "마지막 문장";
  // "마지막 문장"(마지막 문장으로 이동) / "이전 단계"(2단계 수정 화면으로 이동) 모두 항상 유효한 동작이므로 비활성화하지 않는다.
  elements.presentLastSentenceButton.disabled = state.sentences.length === 0;
}

function goToInputStart() {
  state.currentSentenceIndex = 0;
  setScreenOff(false);
  setMode("input");
}

function setScreenOff(isOff) {
  elements.screenOffOverlay.classList.toggle("hidden", !isOff);
}

function bindEvents() {
  elements.passageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const count = preparePresentation();
    if (count === 0) {
      elements.inputMessage.textContent = "영어 지문을 먼저 입력해 주세요.";
      return;
    }
    elements.inputMessage.textContent = "";
    setMode("edit");
  });

  elements.sampleButton.addEventListener("click", () => {
    elements.passageInput.value = SAMPLE_TEXT;
    elements.inputMessage.textContent = "";
  });

  elements.clearButton.addEventListener("click", () => {
    elements.passageInput.value = "";
    elements.inputMessage.textContent = "";
    state.sentences = [];
    state.currentSentenceIndex = 0;
    state.minorRevealCount = 0;
  });

  elements.inputExportTxtButton.addEventListener("click", exportAnalysisTxt);
  elements.inputImportButton.addEventListener("click", triggerAnalysisImport);
  elements.editImportButton.addEventListener("click", triggerAnalysisImport);
  elements.applySentenceTextButton.addEventListener("click", updateSentenceText);
  elements.addSentenceButton.addEventListener("click", insertNewSentence);
  elements.deleteSentenceButton.addEventListener("click", deleteCurrentSentence);
  elements.exportTxtButton.addEventListener("click", exportAnalysisTxt);
  elements.analysisFileInput.addEventListener("change", handleAnalysisFileSelected);

  elements.themeSelect.addEventListener("change", () => {
    state.settings.theme = elements.themeSelect.value;
    applySettings();
    schedulePresentationFit();
  });

  elements.backToInputButton.addEventListener("click", () => setMode("input"));
  elements.returnInputButton.addEventListener("click", goToInputStart);
  elements.startPresentButton.addEventListener("click", () => setMode("present"));
  elements.presentFitButton.addEventListener("click", togglePresentFullscreen);
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  elements.returnEditButton.addEventListener("click", () => setMode("edit"));
  elements.presentFirstSentenceButton.addEventListener("click", goToPresentationFirstSentence);
  elements.presentLastSentenceButton.addEventListener("click", handlePresentationLastButton);
  elements.screenOnButton.addEventListener("click", () => setScreenOff(false));
  elements.screenOffOverlay.addEventListener("click", (event) => {
    if (event.target === elements.screenOffOverlay) {
      setScreenOff(false);
    }
  });

  elements.editFirstButton.addEventListener("click", () => goToSentence(0));
  elements.editPrevButton.addEventListener("click", () => goToSentence(state.currentSentenceIndex - 1));
  elements.editNextButton.addEventListener("click", () => goToSentence(state.currentSentenceIndex + 1));
  elements.editLastButton.addEventListener("click", () => goToSentence(state.sentences.length - 1));
  elements.presentPrevButton.addEventListener("click", goToPresentationPrev);
  elements.presentNextButton.addEventListener("click", goToPresentationNext);
  elements.presentView.addEventListener("click", handlePresentationClick);

  [elements.majorEditLane, elements.minorEditLane].forEach((lane) => {
    lane.addEventListener("dragover", handleLaneDragOver);
    lane.addEventListener("dragleave", handleLaneDragLeave);
    lane.addEventListener("drop", handleLaneDrop);
  });

  elements.minorPresentLane.addEventListener("dragover", handlePresentMinorDragOver);
  elements.minorPresentLane.addEventListener("drop", handlePresentMinorDrop);

  document.addEventListener("keydown", handleKeyboard);
  window.addEventListener("resize", () => {
    applySettings();
    schedulePresentationFit();
  });
}

function handleKeyboard(event) {
  const activeTag = document.activeElement?.tagName;
  if (activeTag === "TEXTAREA" || activeTag === "INPUT" || activeTag === "SELECT") {
    return;
  }

  if (!elements.screenOffOverlay.classList.contains("hidden")) {
    event.preventDefault();
    setScreenOff(false);
    return;
  }

  if (state.mode !== "present") {
    return;
  }

  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();
    goToPresentationNext();
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goToPresentationPrev();
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    goToPresentationSentence(1);
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    goToPresentationSentence(-1);
  }
  if (event.key === "Home") {
    event.preventDefault();
    goToSentence(0, 0);
  }
  if (event.key === "End") {
    event.preventDefault();
    const lastSentence = state.sentences[state.sentences.length - 1];
    goToSentence(state.sentences.length - 1, getComponentsByLane(lastSentence, "minor").length);
  }
  if (event.key === "Escape") {
    event.preventDefault();
    setMode("edit");
  }
}

bindEvents();
applySettings();
