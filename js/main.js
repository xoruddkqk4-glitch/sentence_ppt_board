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
  adjective: "role-minor",
  adverb: "role-minor"
};
const COMPONENT_PALETTE = {
  subject: "#00B8A9",
  verb: "#F6416C",
  object: "#FFDE7D",
  complement: "#9BB8FF",
  adjective: "#F8F3D4",
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
  "in", "on", "at", "by", "for", "from", "to", "with", "without", "about",
  "before", "after", "during", "through", "under", "over", "into", "near",
  "around", "because", "while"
]);
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
  sourceSentence: document.getElementById("sourceSentence"),
  majorEditLane: document.getElementById("majorEditLane"),
  minorEditLane: document.getElementById("minorEditLane"),
  majorPresentLane: document.getElementById("majorPresentLane"),
  minorAnchorLane: document.getElementById("minorAnchorLane"),
  minorPresentLane: document.getElementById("minorPresentLane"),
  emptyMinorNote: document.getElementById("emptyMinorNote"),
  backToInputButton: document.getElementById("backToInputButton"),
  startPresentButton: document.getElementById("startPresentButton"),
  returnEditButton: document.getElementById("returnEditButton"),
  returnInputButton: document.getElementById("returnInputButton"),
  presentSaveTxtButton: document.getElementById("presentSaveTxtButton"),
  presentHomeButton: document.getElementById("presentHomeButton"),
  screenOffButton: document.getElementById("screenOffButton"),
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
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) {
    return [];
  }

  const matches = normalized.match(/[^.!?]+[.!?]+["')\]]?|[^.!?]+$/g) || [];
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
}

function analyzeSentence(sentenceText, sentenceIndex) {
  return analyzeSentenceWithDisplayWords(sentenceText, sentenceIndex);
  const cleanText = sentenceText.replace(/[“”]/g, "\"").replace(/[‘’]/g, "'");
  const words = cleanText.match(/[A-Za-z]+(?:'[A-Za-z]+)?|[.,!?;:]/g) || [];
  const plainWords = words.filter((word) => /[A-Za-z]/.test(word));

  if (plainWords.length === 0) {
    return [];
  }

  const verbIndex = findVerbIndex(plainWords);
  const subjectStart = 0;
  const subjectEnd = Math.max(verbIndex, 1);
  const verbStart = verbIndex;
  const verbEnd = Math.min(verbIndex + getVerbSpan(plainWords, verbIndex), plainWords.length);
  const subjectWords = plainWords.slice(subjectStart, subjectEnd);
  const verbWords = plainWords.slice(verbStart, verbEnd);
  const afterVerbStart = verbEnd;
  const afterVerb = plainWords.slice(afterVerbStart);
  const splitAfterVerb = splitMinorPhrase(afterVerb);
  const components = [];

  addComponent(components, sentenceIndex, "subject", subjectWords, subjectStart, subjectEnd);
  addComponent(components, sentenceIndex, "verb", verbWords, verbStart, verbEnd);

  if (splitAfterVerb.core.length > 0) {
    const role = BE_VERBS.has(verbWords[verbWords.length - 1]?.toLowerCase()) ? "complement" : "object";
    const coreStart = afterVerbStart + splitAfterVerb.coreStartOffset;
    addComponent(components, sentenceIndex, role, splitAfterVerb.core, coreStart, coreStart + splitAfterVerb.core.length);
  }

  splitAfterVerb.minors.forEach((minor, index) => {
    const role = minor.words.some((word) => word.toLowerCase().endsWith("ly")) ? "adverb" : "adverb";
    const minorStart = afterVerbStart + minor.startOffset;
    addComponent(components, sentenceIndex, role, minor.words, minorStart, minorStart + minor.words.length, index);
  });

  if (components.length === 0) {
    addComponent(components, sentenceIndex, "subject", plainWords, 0, plainWords.length);
  }

  return components.map((component, order) => ({ ...component, order: order + 1 }));
}

function analyzeSentenceWithDisplayWords(sentenceText, sentenceIndex) {
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

  for (let index = 0; index < words.length; index += 1) {
    const lowerWord = words[index].toLowerCase();
    if (lowerWord.endsWith("ly")) {
      minors.push({ words: [words[index]], startOffset: index });
      continue;
    }

    if (PREPOSITIONS.has(lowerWord)) {
      minors.push({ words: words.slice(index), startOffset: index });
      break;
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
  state.componentSerial = 1;

  return state.sentences.length;
}

function setMode(mode) {
  state.mode = mode;
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
  elements.sourceSentence.textContent = sentence.text;
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

function renderPresentView() {
  const sentence = getCurrentSentence();
  if (!sentence) {
    return;
  }

  const majorComponents = getComponentsByLane(sentence, "major");
  const minorComponents = getComponentsByLane(sentence, "minor");

  elements.presentProgress.textContent = getProgressText();
  setWordGrid(sentence);
  applySettings();
  renderMajorPresentLane(elements.majorPresentLane, majorComponents);
  elements.minorAnchorLane.innerHTML = "";
  renderMinorPresentRows(elements.minorPresentLane, minorComponents);
  elements.emptyMinorNote.classList.toggle("hidden", minorComponents.length > 0);
  updateNavButtons();
  schedulePresentationFit();
}

function renderMajorPresentLane(container, components) {
  container.innerHTML = "";
  components.forEach((component) => {
    const chip = createPresentChip(component);
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
    placeMinorComponentOnGrid(chip, component, index);
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

function createPresentChip(component) {
  const chip = document.createElement("span");
  chip.className = `component-chip present-chip ${ROLE_COLOR_CLASS[component.role]}`;
  chip.style.setProperty("--component-color", COMPONENT_PALETTE[component.role]);
  chip.dataset.componentId = component.id;
  chip.dataset.role = component.role;

  const text = document.createElement("span");
  text.className = "text-part";
  getComponentWords(component).forEach((word) => {
    const wordElement = document.createElement("span");
    wordElement.className = "present-word";
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

function placeMinorComponentOnGrid(element, component, rowIndex) {
  const anchorPercent = getMinorAnchorPercent(component);
  element.style.setProperty("--anchor-percent", `${anchorPercent}%`);
  element.style.setProperty("--box-percent", `${anchorPercent}%`);
  element.style.setProperty("--connector-x", "50%");
  const connectorLength = 54 + rowIndex * 64;
  element.style.setProperty("--connector-length", `${connectorLength}px`);
}

function getMinorBoxTop(rowIndex) {
  return 44 + rowIndex * 44;
}

function getMinorAnchorPercent(component) {
  const slots = getMinorSlots();
  if (slots.length === 0) {
    return 50;
  }

  const start = Number.isFinite(component.startIndex) ? component.startIndex : component.order - 1;
  const slot = getClosestSlot(start);
  return slot.percent;
}

function getPlainWords(sentenceText) {
  return getDisplayWords(sentenceText).map(getWordCore).filter(Boolean);
}

function getComponentWords(component) {
  return getDisplayWords(component.text);
}

function getDisplayWords(text) {
  const tokens = text.match(/[A-Za-z]+(?:'[A-Za-z]+)?|[.,!?;:]+/g) || [];
  const words = [];

  tokens.forEach((token) => {
    if (/^[.,!?;:]+$/.test(token)) {
      if (words.length > 0) {
        words[words.length - 1] += token;
      }
      return;
    }
    words.push(token);
  });

  return words.length > 0 ? words : [text].filter(Boolean);
}

function getWordCore(word) {
  return word.match(/[A-Za-z]+(?:'[A-Za-z]+)?/)?.[0] || "";
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
  const slotRect = elements.minorPresentLane.getBoundingClientRect();
  const wordElements = [...elements.majorPresentLane.querySelectorAll(".present-word")];
  const sentence = getCurrentSentence();
  if (!slotRect.width || wordElements.length === 0 || !sentence) {
    state.minorSlots = [];
    return;
  }

  const wordRects = wordElements.map((element) => element.getBoundingClientRect());
  const slots = [];
  const first = wordRects[0];
  const last = wordRects[wordRects.length - 1];
  const edgeGap = getMajorEdgeGap();
  const leftEdge = slotRect.left + getStageEdgeGuard(slotRect);
  const rightEdge = slotRect.right - getStageEdgeGuard(slotRect);
  slots.push({
    index: 0,
    percent: rectXToPercent(Math.max(leftEdge, first.left - edgeGap), slotRect)
  });

  wordRects.forEach((rect, index) => {
    const nextRect = wordRects[index + 1];
    if (!nextRect) {
      return;
    }
    slots.push({
      index: index + 1,
      percent: rectXToPercent((rect.right + nextRect.left) / 2, slotRect)
    });
  });

  slots.push({
    index: wordRects.length,
    percent: rectXToPercent(Math.min(rightEdge, last.right + edgeGap), slotRect)
  });

  state.minorSlots = slots;
}

function rectXToPercent(x, rect) {
  const edgeGuard = (getStageEdgeGuard(rect) / rect.width) * 100;
  return Math.round(clamp(edgeGuard, ((x - rect.left) / rect.width) * 100, 100 - edgeGuard) * 10) / 10;
}

function getMajorEdgeGap() {
  const currentSize = Number.parseFloat(getComputedStyle(elements.app).getPropertyValue("--font-major-current"));
  return clamp(38, currentSize * 0.48, 76);
}

function getStageEdgeGuard(rect) {
  return clamp(24, rect.width * 0.035, 54);
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

function goToSentence(index) {
  if (state.sentences.length === 0) {
    return;
  }
  state.currentSentenceIndex = Math.max(0, Math.min(index, state.sentences.length - 1));
  render();
}

function moveComponent(componentId, targetLane, targetIndex = null) {
  const sentence = getCurrentSentence();
  const component = sentence?.components.find((item) => item.id === componentId);
  if (!sentence || !component) {
    return;
  }

  component.lane = targetLane;
  if (targetLane === "major" && !MAJOR_ROLES.has(component.role)) {
    component.role = "subject";
  }
  if (targetLane === "minor" && MAJOR_ROLES.has(component.role)) {
    component.role = "adverb";
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
  return {
    ...baseComponent,
    id: getNextComponentId(baseComponent.id),
    text: words.join(" "),
    startIndex,
    endIndex
  };
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

  const rect = elements.minorPresentLane.getBoundingClientRect();
  const ratio = clamp(0, (clientX - rect.left) / rect.width, 1);
  const slots = getMinorSlots();
  if (slots.length === 0) {
    return;
  }
  const span = Math.max(1, (component.endIndex || 0) - (component.startIndex || 0));
  const targetPercent = ratio * 100;
  const nearestSlot = slots.reduce((closest, slot) => {
    return Math.abs(slot.percent - targetPercent) < Math.abs(closest.percent - targetPercent) ? slot : closest;
  }, slots[0]);
  const startIndex = nearestSlot.index;
  const wordCount = Math.max(sentence.wordCount || 1, 1);
  component.startIndex = startIndex;
  component.endIndex = Math.min(wordCount, startIndex + span);
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
  const minorBase = clamp(28, width * 0.032, 58);
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
  const edgeReserve = edgeGuard * 2;
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

  const laneRect = elements.minorPresentLane.getBoundingClientRect();
  const overflowingChip = chips.find((chip) => chip.getBoundingClientRect().width > laneRect.width - 24);
  if (!overflowingChip) {
    return;
  }

  const currentSize = Number.parseFloat(getComputedStyle(elements.app).getPropertyValue("--font-minor-current"));
  const ratio = (laneRect.width - 24) / overflowingChip.getBoundingClientRect().width;
  const nextSize = Math.max(10, Math.floor(currentSize * ratio * 0.96));
  elements.app.style.setProperty("--font-minor-current", `${nextSize}px`);
}

function clampMinorBoxes() {
  if (state.mode !== "present") {
    return;
  }

  const laneRect = elements.minorPresentLane.getBoundingClientRect();
  if (!laneRect.width) {
    return;
  }

  elements.minorPresentLane.querySelectorAll(".present-chip").forEach((chip) => {
    const anchorPercent = Number.parseFloat(chip.style.getPropertyValue("--anchor-percent")) || 50;
    const chipRect = chip.getBoundingClientRect();
    const halfPercent = ((chipRect.width / 2 + 12) / laneRect.width) * 100;
    const boxPercent = halfPercent >= 50 ? 50 : clamp(halfPercent, anchorPercent, 100 - halfPercent);
    chip.style.setProperty("--box-percent", `${Math.round(boxPercent * 10) / 10}%`);
    const anchorX = (anchorPercent / 100) * laneRect.width;
    const boxCenterX = (boxPercent / 100) * laneRect.width;
    const connectorPercent = clamp(8, 50 + ((anchorX - boxCenterX) / chipRect.width) * 100, 92);
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

  const dotY = majorRect.top + majorRect.height * 0.5 - stageRect.top;
  elements.minorPresentLane.querySelectorAll(".present-chip").forEach((chip) => {
    const chipRect = chip.getBoundingClientRect();
    const chipTop = chipRect.top - stageRect.top;
    const connectorLength = Math.max(28, Math.round(chipTop - dotY));
    chip.style.setProperty("--connector-length", `${connectorLength}px`);
  });
}

function updateMinorPositions() {
  const components = getComponentsByLane(getCurrentSentence(), "minor");
  elements.minorPresentLane.querySelectorAll(".present-chip").forEach((chip) => {
    const component = components.find((item) => item.id === chip.dataset.componentId);
    if (component) {
      const anchorPercent = getMinorAnchorPercent(component);
      chip.style.setProperty("--anchor-percent", `${anchorPercent}%`);
      chip.style.setProperty("--box-percent", `${anchorPercent}%`);
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
  return {
    id: String(component?.id || `s${sentenceIndex + 1}-import-${componentIndex + 1}`),
    text,
    role,
    lane,
    order: Number.isFinite(Number(component?.order)) ? Number(component.order) : componentIndex + 1,
    startIndex: Number.isFinite(startIndex) ? startIndex : undefined,
    endIndex: Number.isFinite(endIndex) ? endIndex : undefined
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
  [elements.editFirstButton, elements.editPrevButton, elements.presentPrevButton].forEach((button) => {
    button.disabled = isFirst;
  });
  [elements.editLastButton, elements.editNextButton, elements.presentNextButton].forEach((button) => {
    button.disabled = isLast;
  });
  [elements.presentHomeButton, elements.screenOffButton].forEach((button) => {
    button.classList.toggle("hidden", !isLast || state.mode !== "present");
  });
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
  });

  elements.inputExportTxtButton.addEventListener("click", exportAnalysisTxt);
  elements.inputImportButton.addEventListener("click", triggerAnalysisImport);
  elements.editImportButton.addEventListener("click", triggerAnalysisImport);
  elements.exportTxtButton.addEventListener("click", exportAnalysisTxt);
  elements.presentSaveTxtButton.addEventListener("click", exportAnalysisTxt);
  elements.analysisFileInput.addEventListener("change", handleAnalysisFileSelected);

  elements.themeSelect.addEventListener("change", () => {
    state.settings.theme = elements.themeSelect.value;
    applySettings();
    schedulePresentationFit();
  });

  elements.backToInputButton.addEventListener("click", () => setMode("input"));
  elements.returnInputButton.addEventListener("click", goToInputStart);
  elements.startPresentButton.addEventListener("click", () => setMode("present"));
  elements.returnEditButton.addEventListener("click", () => setMode("edit"));
  elements.presentHomeButton.addEventListener("click", goToInputStart);
  elements.screenOffButton.addEventListener("click", () => setScreenOff(true));
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
  elements.presentPrevButton.addEventListener("click", () => goToSentence(state.currentSentenceIndex - 1));
  elements.presentNextButton.addEventListener("click", () => goToSentence(state.currentSentenceIndex + 1));

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
    goToSentence(state.currentSentenceIndex + 1);
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goToSentence(state.currentSentenceIndex - 1);
  }
  if (event.key === "Home") {
    event.preventDefault();
    goToSentence(0);
  }
  if (event.key === "End") {
    event.preventDefault();
    goToSentence(state.sentences.length - 1);
  }
  if (event.key === "Escape") {
    event.preventDefault();
    setMode("edit");
  }
}

bindEvents();
applySettings();
