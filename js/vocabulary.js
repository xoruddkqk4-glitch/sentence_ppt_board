/* 어휘 분석·공유 화면 전용 모듈 */
(function () {
  function createId() {
    return `vocab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function makeItem(item = {}) {
    return {
      id: item.id || createId(),
      term: String(item.term || ""),
      location: String(item.location || ""),
      meaning: String(item.meaning || ""),
      insights: String(item.insights || "")
    };
  }

  function init(context) {
    const { state, elements } = context;
    state.vocabularyItems = Array.isArray(state.vocabularyItems) ? state.vocabularyItems.map(makeItem) : [];
    state.vocabularyShareFocusRow = Number.isInteger(state.vocabularyShareFocusRow) ? state.vocabularyShareFocusRow : null;
    state.vocabularyShareSelectedItemId = null;
    state.draggedVocabularyIndex = null;

    function renderAnalysis() {
      elements.vocabularyList.innerHTML = "";
      if (!state.vocabularyItems.length) {
        elements.vocabularyList.innerHTML = '<p class="empty-note vocabulary-empty">아직 등록한 어휘가 없습니다. <strong>어휘 추가</strong>를 눌러 수업 핵심어를 기록하세요.</p>';
        return;
      }
      state.vocabularyItems.forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "vocabulary-card";
        card.innerHTML = `
          <div class="vocabulary-card-header"><span class="vocabulary-drag-handle" draggable="true" title="드래그하여 순서 변경" aria-label="어휘 ${index + 1} 순서 변경">⠿</span><strong>어휘 ${index + 1}</strong><button class="button secondary compact vocabulary-delete" type="button">삭제</button></div>
          <div class="vocabulary-fields">
            <label>단어·표현<input data-field="term" value="${escapeAttribute(item.term)}" placeholder="예: take part in"></label>
            <label>위치<input data-field="location" value="${escapeAttribute(item.location)}" placeholder="예: 2번 문장/3번째 줄"></label>
            <label>의미<input data-field="meaning" value="${escapeAttribute(item.meaning)}" placeholder="예: ~에 참여하다"></label>
            <label class="vocabulary-insights">Word Insights<input data-field="insights" value="${escapeAttribute(item.insights)}" placeholder="품사, 어원, 연어, 기억법, 수업 질문"></label>
          </div>`;
        card.querySelectorAll("[data-field]").forEach((field) => field.addEventListener("input", (event) => {
          item[event.target.dataset.field] = event.target.value;
          elements.vocabularyMessage.textContent = "어휘 내용이 현재 수업 세션에 저장되었습니다.";
        }));
        card.querySelector(".vocabulary-delete").addEventListener("click", () => {
          state.vocabularyItems.splice(index, 1);
          renderAnalysis();
        });
        const dragHandle = card.querySelector(".vocabulary-drag-handle");
        dragHandle.addEventListener("dragstart", (event) => {
          state.draggedVocabularyIndex = index;
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", String(index));
          card.classList.add("is-dragging");
        });
        dragHandle.addEventListener("dragend", () => {
          state.draggedVocabularyIndex = null;
          document.querySelectorAll(".vocabulary-card.is-drop-before, .vocabulary-card.is-drop-after, .vocabulary-card.is-dragging")
            .forEach((element) => element.classList.remove("is-drop-before", "is-drop-after", "is-dragging"));
        });
        card.addEventListener("dragover", (event) => {
          if (!Number.isInteger(state.draggedVocabularyIndex) || state.draggedVocabularyIndex === index) return;
          event.preventDefault();
          const isAfter = event.clientY > card.getBoundingClientRect().top + (card.offsetHeight / 2);
          card.classList.toggle("is-drop-after", isAfter);
          card.classList.toggle("is-drop-before", !isAfter);
          event.dataTransfer.dropEffect = "move";
        });
        card.addEventListener("dragleave", () => card.classList.remove("is-drop-before", "is-drop-after"));
        card.addEventListener("drop", (event) => {
          event.preventDefault();
          const sourceIndex = state.draggedVocabularyIndex;
          if (!Number.isInteger(sourceIndex) || sourceIndex === index) return;
          const placeAfter = card.classList.contains("is-drop-after");
          let targetIndex = index + (placeAfter ? 1 : 0);
          const [movedItem] = state.vocabularyItems.splice(sourceIndex, 1);
          if (sourceIndex < targetIndex) targetIndex -= 1;
          state.vocabularyItems.splice(targetIndex, 0, movedItem);
          state.draggedVocabularyIndex = null;
          renderAnalysis();
        });
        elements.vocabularyList.appendChild(card);
      });
    }

    function renderShare() {
      const items = state.vocabularyItems.filter((item) => item.term.trim() || item.meaning.trim() || item.insights.trim());
      elements.vocabularyShareContent.innerHTML = "";
      if (!items.length) {
        elements.vocabularyShareContent.innerHTML = '<p class="empty-note vocabulary-empty">공유할 어휘가 없습니다. 2단계에서 어휘를 추가해 주세요.</p>';
        return;
      }
      const selectedItem = state.vocabularyShareSelectedItemId ? items.find((item) => item.id === state.vocabularyShareSelectedItemId) : null;
      if (state.vocabularyShareSelectedItemId && !selectedItem) state.vocabularyShareSelectedItemId = null;
      const focusItem = state.vocabularyShareFocusRow === null ? null : items[state.vocabularyShareFocusRow * 2];
      if (state.vocabularyShareFocusRow !== null && !focusItem) state.vocabularyShareFocusRow = null;
      const focusItems = focusItem
        ? [items[state.vocabularyShareFocusRow * 2], items[(state.vocabularyShareFocusRow * 2) + 1]].filter(Boolean)
        : null;
      // 포커스에서는 선택한 행의 왼쪽·오른쪽 카드 두 장을 세로로 보여준다.
      const visibleItems = selectedItem ? [selectedItem] : focusItems || items;
      const rowCount = selectedItem ? 1 : focusItems ? Math.min(2, focusItems.length) : Math.ceil(items.length / 2);
      const longest = Math.max(...visibleItems.map((item) => `${item.term} ${item.meaning} ${item.insights}`.length), 1);
      const termSize = selectedItem
        ? Math.max(52, Math.min(132, Math.floor(1900 / Math.max(longest / 14, 1))))
        : focusItems
          ? Math.max(42, Math.min(110, Math.floor(1350 / Math.max(longest / 14, 1))))
          : Math.max(18, Math.min(52, Math.floor(800 / Math.max(Math.ceil(items.length / 2), 1) / Math.max(longest / 16, 1))));
      elements.vocabularyShareContent.style.setProperty("--vocabulary-term-size", `${termSize}px`);
      elements.vocabularyShareContent.style.setProperty("--vocabulary-columns", selectedItem || focusItems ? "1" : "2");
      elements.vocabularyShareContent.style.setProperty("--vocabulary-rows", String(rowCount));
      elements.vocabularyShareContent.style.setProperty("--vocabulary-card-padding", `${selectedItem ? 44 : focusItems ? 28 : Math.max(4, Math.min(28, Math.floor(86 / rowCount)))}px`);
      elements.vocabularyShareContent.classList.toggle("is-focused", Boolean(selectedItem || focusItems));
      visibleItems.forEach((item) => {
        const card = document.createElement("article");
        card.className = "vocabulary-share-card";
        card.innerHTML = `<div class="vocabulary-share-heading"><p class="vocabulary-location">${escapeHtml(item.location || "위치 미입력")}</p><span aria-hidden="true">|</span><h3>${escapeHtml(item.term || "(어휘 미입력)")}</h3></div>
          ${item.meaning ? `<p class="vocabulary-meaning">${escapeHtml(item.meaning)}</p>` : ""}
          ${item.insights ? `<p class="vocabulary-insight-text">${escapeHtml(item.insights)}</p>` : ""}`;
        if (!selectedItem && !focusItems) {
          card.classList.add("is-clickable");
          card.tabIndex = 0;
          card.setAttribute("role", "button");
          card.setAttribute("aria-label", `${item.term || "어휘"} 크게 보기`);
          card.addEventListener("click", () => {
            state.vocabularyShareSelectedItemId = item.id;
            renderShare();
          });
          card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              state.vocabularyShareSelectedItemId = item.id;
              renderShare();
            }
          });
        } else {
          card.classList.add("is-clickable", "is-focused-card");
          card.tabIndex = 0;
          card.setAttribute("role", "button");
          card.setAttribute("aria-label", "전체 어휘 보기로 돌아가기");
          const returnToAllItems = () => {
            state.vocabularyShareFocusRow = null;
            state.vocabularyShareSelectedItemId = null;
            renderShare();
          };
          card.addEventListener("click", returnToAllItems);
          card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              returnToAllItems();
            }
          });
        }
        elements.vocabularyShareContent.appendChild(card);
      });
      requestAnimationFrame(fitShareToViewport);
    }

    function fitShareToViewport() {
      const content = elements.vocabularyShareContent;
      let fontSize = Number.parseFloat(getComputedStyle(content).getPropertyValue("--vocabulary-term-size")) || 42;
      const cardsOverflow = () => [...content.querySelectorAll(".vocabulary-share-card")]
        .some((card) => card.scrollHeight > card.clientHeight + 1);
      // 행마다 카드의 실제 높이를 재서 텍스트·여백을 함께 축소한다.
      while (cardsOverflow() && fontSize > 8) {
        fontSize -= 1;
        content.style.setProperty("--vocabulary-term-size", `${fontSize}px`);
      }
    }

    elements.addVocabularyButton.addEventListener("click", () => {
      if (state.vocabularyItems.length >= 18) {
        elements.vocabularyMessage.textContent = "어휘는 최대 18개까지 입력할 수 있습니다.";
        return;
      }
      state.vocabularyItems.push(makeItem());
      elements.vocabularyMessage.textContent = "새 어휘 카드를 추가했습니다.";
      renderAnalysis();
      elements.vocabularyList.lastElementChild?.querySelector('[data-field="term"]')?.focus();
    });
    window.addEventListener("resize", () => {
      if (state.mode === "vocabulary-share") renderShare();
    });
    function handleShareKey(key) {
      const items = state.vocabularyItems.filter((item) => item.term.trim() || item.meaning.trim() || item.insights.trim());
      const rowCount = Math.ceil(items.length / 2);
      if (key === "0") {
        state.vocabularyShareFocusRow = null;
        state.vocabularyShareSelectedItemId = null;
      } else if (key === "ArrowRight" || key === "ArrowLeft") {
        const direction = key === "ArrowRight" ? 1 : -1;
        const selectedIndex = items.findIndex((item) => item.id === state.vocabularyShareSelectedItemId);
        if (selectedIndex >= 0) {
          const targetItem = items[selectedIndex + direction];
          if (!targetItem) return false;
          // 카드 하나를 클릭해 연 포커스에서는 한 장씩 이동한다.
          state.vocabularyShareSelectedItemId = targetItem.id;
        } else if (state.vocabularyShareFocusRow !== null) {
          const targetRow = state.vocabularyShareFocusRow + direction;
          if (targetRow < 0 || targetRow >= rowCount || !items[targetRow * 2]) return false;
          // 숫자 키로 연 행 포커스에서는 두 카드 묶음으로 이동한다.
          state.vocabularyShareFocusRow = targetRow;
        } else {
          return false;
        }
      } else if (/^[1-9]$/.test(key)) {
        const row = Number(key) - 1;
        // 홀수 개일 때 마지막 행에 카드가 한 장만 있어도 숫자 키로 연다.
        if (row >= rowCount || !items[row * 2]) return false;
        state.vocabularyShareSelectedItemId = null;
        state.vocabularyShareFocusRow = row;
      } else {
        return false;
      }
      renderShare();
      return true;
    }
    return { renderAnalysis, renderShare, handleShareKey, normalize: (items) => Array.isArray(items) ? items.slice(0, 18).map(makeItem) : [] };
  }

  function escapeHtml(value) { return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]); }
  function escapeAttribute(value) { return escapeHtml(value).replace(/'/g, "&#39;"); }
  window.VocabularyFeature = { init };
}());
