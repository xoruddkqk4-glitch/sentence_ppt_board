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
      insights: String(item.insights || ""),
      imageData: typeof item.imageData === "string" ? item.imageData : "",
      imageName: String(item.imageName || "")
    };
  }

  function init(context) {
    const { state, elements } = context;
    state.vocabularyItems = Array.isArray(state.vocabularyItems) ? state.vocabularyItems.map(makeItem) : [];
    state.vocabularyShareFocusRow = Number.isInteger(state.vocabularyShareFocusRow) ? state.vocabularyShareFocusRow : null;
    state.vocabularyShareSelectedItemId = null;
    state.vocabularyShareStep = 0;
    state.draggedVocabularyIndex = null;

    function getCardMaxStep(item) {
      if (!item) return 0;
      let steps = 0;
      if (item.meaning && item.meaning.trim()) steps++;
      if (item.insights && item.insights.trim()) steps++;
      return steps;
    }

    function advanceStep(delta) {
      const items = state.vocabularyItems.filter((item) => item.term.trim() || item.meaning.trim() || item.insights.trim() || item.imageData);
      if (!items.length) return false;
      const selectedIndex = items.findIndex((item) => item.id === state.vocabularyShareSelectedItemId);
      if (selectedIndex < 0) return false;

      const item = items[selectedIndex];
      const maxStep = getCardMaxStep(item);
      const currentStep = state.vocabularyShareStep || 0;

      if (delta > 0) {
        if (currentStep < maxStep) {
          state.vocabularyShareStep = currentStep + 1;
        } else {
          const nextIndex = selectedIndex + 1;
          if (nextIndex < items.length) {
            state.vocabularyShareSelectedItemId = items[nextIndex].id;
            state.vocabularyShareStep = 0;
          } else {
            state.vocabularyShareSelectedItemId = items[0].id;
            state.vocabularyShareStep = 0;
          }
        }
      } else if (delta < 0) {
        if (currentStep > 0) {
          state.vocabularyShareStep = currentStep - 1;
        } else {
          const prevIndex = selectedIndex - 1;
          if (prevIndex >= 0) {
            const prevItem = items[prevIndex];
            state.vocabularyShareSelectedItemId = prevItem.id;
            state.vocabularyShareStep = getCardMaxStep(prevItem);
          } else {
            const lastItem = items[items.length - 1];
            state.vocabularyShareSelectedItemId = lastItem.id;
            state.vocabularyShareStep = getCardMaxStep(lastItem);
          }
        }
      }
      return true;
    }

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
            <label>단어·표현<textarea data-field="term" rows="1" placeholder="예: take part in (Alt+Enter로 줄바꿈)">${escapeHtml(item.term)}</textarea></label>
            <label>위치<input data-field="location" value="${escapeAttribute(item.location)}" placeholder="예: 2번 문장/3번째 줄"></label>
            <label>의미<textarea data-field="meaning" rows="2" placeholder="예: ~에 참여하다 (Alt+Enter로 줄바꿈)">${escapeHtml(item.meaning)}</textarea></label>
            <label class="vocabulary-insights">Word Insights<textarea data-field="insights" rows="2" placeholder="품사, 어원, 연어, 기억법, 수업 질문 (Alt+Enter로 줄바꿈)">${escapeHtml(item.insights)}</textarea></label>
          </div>
          <div class="vocabulary-image-field">
            <label class="vocabulary-image-upload">이미지 삽입<input class="vocabulary-image-input" type="file" accept="image/*"></label>
            <p class="vocabulary-image-help">단어 카드에 함께 표시할 이미지를 선택하세요. (최대 2MB)</p>
            ${item.imageData ? `<div class="vocabulary-image-preview"><img src="${escapeAttribute(item.imageData)}" alt="${escapeAttribute(item.term || "어휘 참고 이미지")}"><span>${escapeHtml(item.imageName || "첨부 이미지")}</span><button class="button secondary compact vocabulary-image-remove" type="button">이미지 삭제</button></div>` : ""}
          </div>`;
        card.querySelectorAll("[data-field]").forEach((field) => field.addEventListener("input", (event) => {
          item[event.target.dataset.field] = event.target.value;
          elements.vocabularyMessage.textContent = "어휘 내용이 현재 수업 세션에 저장되었습니다.";
        }));
        card.querySelectorAll("textarea[data-field]").forEach((textarea) => {
          textarea.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && event.altKey) {
              event.preventDefault();
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const value = textarea.value;
              textarea.value = value.substring(0, start) + "\n" + value.substring(end);
              textarea.selectionStart = textarea.selectionEnd = start + 1;
              item[textarea.dataset.field] = textarea.value;
              elements.vocabularyMessage.textContent = "어휘 내용이 현재 수업 세션에 저장되었습니다.";
            }
          });
        });
        const imageInput = card.querySelector(".vocabulary-image-input");
        imageInput.addEventListener("change", () => {
          const [file] = imageInput.files;
          if (!file) return;
          if (!file.type.startsWith("image/")) {
            elements.vocabularyMessage.textContent = "이미지 파일만 삽입할 수 있습니다.";
            imageInput.value = "";
            return;
          }
          if (file.size > 2 * 1024 * 1024) {
            elements.vocabularyMessage.textContent = "이미지는 2MB 이하의 파일만 삽입할 수 있습니다.";
            imageInput.value = "";
            return;
          }
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            item.imageData = String(reader.result || "");
            item.imageName = file.name;
            elements.vocabularyMessage.textContent = "이미지를 어휘 카드에 추가했습니다. TXT 저장 시 함께 저장됩니다.";
            renderAnalysis();
          });
          reader.addEventListener("error", () => {
            elements.vocabularyMessage.textContent = "이미지를 읽지 못했습니다. 다른 파일을 선택해 주세요.";
          });
          reader.readAsDataURL(file);
        });
        card.querySelector(".vocabulary-image-remove")?.addEventListener("click", () => {
          if (context.pushHistoryState) context.pushHistoryState();
          item.imageData = "";
          item.imageName = "";
          elements.vocabularyMessage.textContent = "어휘 카드에서 이미지를 삭제했습니다.";
          renderAnalysis();
        });
        card.querySelector(".vocabulary-delete").addEventListener("click", () => {
          if (context.pushHistoryState) context.pushHistoryState();
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
          if (context.pushHistoryState) context.pushHistoryState();
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

    function openImageModal(item) {
      if (!item || !item.imageData) return;
      document.querySelector(".vocab-image-overlay")?.remove();

      const overlay = document.createElement("div");
      overlay.className = "vocab-image-overlay";
      overlay.tabIndex = -1;
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", `${item.term || "어휘"} 참고 이미지 강조 보기`);

      overlay.innerHTML = `
        <div class="vocab-image-overlay-content" onclick="event.stopPropagation()">
          <div class="vocab-image-overlay-header">
            <div class="vocab-image-overlay-title">
              <span>🖼️ ${escapeHtml(item.term || "(어휘 미입력)")}</span>
              ${item.location ? `<span class="vocab-image-overlay-location">📍 ${escapeHtml(item.location)}</span>` : ""}
            </div>
            <button type="button" class="button secondary compact vocab-image-overlay-close">✕ 닫기 (ESC)</button>
          </div>
          <div class="vocab-image-overlay-img-wrapper">
            <img class="vocab-image-overlay-img" src="${escapeAttribute(item.imageData)}" alt="${escapeAttribute(item.term || "어휘 참고 이미지")}">
          </div>
        </div>
      `;

      const close = () => {
        overlay.remove();
        document.removeEventListener("keydown", onKeyDown);
      };

      const onKeyDown = (event) => {
        if (event.key === "Escape" || event.key === "0") {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
      };

      overlay.querySelector(".vocab-image-overlay-close")?.addEventListener("click", (e) => {
        e.stopPropagation();
        close();
      });
      overlay.addEventListener("click", close);
      document.addEventListener("keydown", onKeyDown);

      document.body.appendChild(overlay);
      overlay.focus();
    }

    function renderShare() {
      const items = state.vocabularyItems.filter((item) => item.term.trim() || item.meaning.trim() || item.insights.trim() || item.imageData);
      elements.vocabularyShareContent.innerHTML = "";
      if (!items.length) {
        elements.vocabularyShareProgress.hidden = true;
        elements.vocabularyShareProgress.textContent = "";
        elements.vocabularyShareContent.innerHTML = '<p class="empty-note vocabulary-empty">공유할 어휘가 없습니다. 2단계에서 어휘를 추가해 주세요.</p>';
        return;
      }
      const selectedItem = state.vocabularyShareSelectedItemId ? items.find((item) => item.id === state.vocabularyShareSelectedItemId) : null;
      if (state.vocabularyShareSelectedItemId && !selectedItem) {
        state.vocabularyShareSelectedItemId = null;
        state.vocabularyShareStep = 0;
      }
      const selectedIndex = selectedItem ? items.indexOf(selectedItem) : -1;
      const focusItem = state.vocabularyShareFocusRow === null ? null : items[state.vocabularyShareFocusRow * 2];
      if (state.vocabularyShareFocusRow !== null && !focusItem) state.vocabularyShareFocusRow = null;
      const focusItems = focusItem
        ? [items[state.vocabularyShareFocusRow * 2], items[(state.vocabularyShareFocusRow * 2) + 1]].filter(Boolean)
        : null;

      elements.vocabularyShareProgress.hidden = selectedIndex < 0;
      if (selectedIndex >= 0) {
        const maxStep = getCardMaxStep(selectedItem);
        const step = Math.min(state.vocabularyShareStep || 0, maxStep);
        const stepLabel = maxStep > 0 ? ` (정보 공개 ${step}/${maxStep})` : "";
        elements.vocabularyShareProgress.textContent = `${selectedIndex + 1}/${items.length}${stepLabel}`;
      } else {
        elements.vocabularyShareProgress.textContent = "";
      }

      const visibleItems = selectedItem ? [selectedItem] : focusItems || items;
      const rowCount = selectedItem ? 1 : focusItems ? Math.min(2, focusItems.length) : Math.ceil(items.length / 2);
      const longest = Math.max(...visibleItems.map((item) => `${item.term} ${item.meaning} ${item.insights}`.length), 1);
      const termSize = selectedItem
        ? Math.max(48, Math.min(120, Math.floor(1800 / Math.max(longest / 14, 1))))
        : focusItems
          ? Math.max(42, Math.min(110, Math.floor(1350 / Math.max(longest / 14, 1))))
          : Math.max(18, Math.min(52, Math.floor(800 / Math.max(Math.ceil(items.length / 2), 1) / Math.max(longest / 16, 1))));

      elements.vocabularyShareContent.style.setProperty("--vocabulary-term-size", `${termSize}px`);
      elements.vocabularyShareContent.style.setProperty("--vocabulary-columns", selectedItem || focusItems ? "1" : "2");
      elements.vocabularyShareContent.style.setProperty("--vocabulary-rows", String(rowCount));
      elements.vocabularyShareContent.style.setProperty("--vocabulary-card-padding", `${selectedItem ? 32 : focusItems ? 28 : Math.max(4, Math.min(28, Math.floor(86 / rowCount)))}px`);
      elements.vocabularyShareContent.classList.toggle("is-focused", Boolean(selectedItem || focusItems));

      visibleItems.forEach((item) => {
        const card = document.createElement("article");
        card.className = "vocabulary-share-card";
        if (item.imageData) card.classList.add("has-image");

        if (!selectedItem && !focusItems) {
          // 전체 보기 모드
          card.classList.add("is-clickable");
          card.tabIndex = 0;
          card.setAttribute("role", "button");
          card.setAttribute("aria-label", `${item.term || "어휘"} 크게 보기`);
          card.innerHTML = `<div class="vocabulary-share-heading"><p class="vocabulary-location">${escapeHtml(item.location || "위치 미입력")}</p><span aria-hidden="true">|</span><h3>${escapeHtml(item.term || "(어휘 미입력)")}</h3></div>
            ${item.imageData ? `<img class="vocabulary-share-image" src="${escapeAttribute(item.imageData)}" alt="${escapeAttribute(item.term || "어휘 참고 이미지")}">` : ""}
            ${item.meaning ? `<p class="vocabulary-meaning">${escapeHtml(item.meaning)}</p>` : ""}
            ${item.insights ? `<p class="vocabulary-insight-text">${escapeHtml(item.insights)}</p>` : ""}`;
          card.addEventListener("click", (event) => {
            if (event.target.closest(".vocabulary-share-image")) return;
            state.vocabularyShareSelectedItemId = item.id;
            state.vocabularyShareStep = 0;
            renderShare();
          });
          card.addEventListener("keydown", (event) => {
            if (event.target.closest(".vocabulary-share-image")) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              state.vocabularyShareSelectedItemId = item.id;
              state.vocabularyShareStep = 0;
              renderShare();
            }
          });
        } else if (focusItems && !selectedItem) {
          // 행 포커스 모드 (2장 보기)
          card.classList.add("is-clickable", "is-focused-card");
          card.tabIndex = 0;
          card.setAttribute("role", "button");
          card.setAttribute("aria-label", "전체 어휘 보기로 돌아가기");
          card.innerHTML = `<div class="vocabulary-share-heading"><p class="vocabulary-location">${escapeHtml(item.location || "위치 미입력")}</p><span aria-hidden="true">|</span><h3>${escapeHtml(item.term || "(어휘 미입력)")}</h3></div>
            ${item.imageData ? `<img class="vocabulary-share-image" src="${escapeAttribute(item.imageData)}" alt="${escapeAttribute(item.term || "어휘 참고 이미지")}">` : ""}
            ${item.meaning ? `<p class="vocabulary-meaning">${escapeHtml(item.meaning)}</p>` : ""}
            ${item.insights ? `<p class="vocabulary-insight-text">${escapeHtml(item.insights)}</p>` : ""}`;
          const returnToAllItems = () => {
            state.vocabularyShareFocusRow = null;
            state.vocabularyShareSelectedItemId = null;
            state.vocabularyShareStep = 0;
            renderShare();
          };
          card.addEventListener("click", (event) => {
            if (event.target.closest(".vocabulary-share-image")) return;
            returnToAllItems();
          });
          card.addEventListener("keydown", (event) => {
            if (event.target.closest(".vocabulary-share-image")) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              returnToAllItems();
            }
          });
        } else {
          // 단일 카드 포커스 모드 (단계별 정보 공개 및 전환)
          card.classList.add("is-clickable", "is-focused-card");
          card.tabIndex = 0;
          card.setAttribute("role", "button");
          card.setAttribute("aria-label", `${item.term || "어휘"} 상세 보기 (클릭 또는 화살표 키로 단계별 공개)`);

          const hasMeaning = Boolean(item.meaning && item.meaning.trim());
          const hasInsights = Boolean(item.insights && item.insights.trim());
          const maxStep = getCardMaxStep(item);
          const step = Math.min(state.vocabularyShareStep || 0, maxStep);

          let meaningVisible = false;
          let insightsVisible = false;

          if (hasMeaning && hasInsights) {
            meaningVisible = step >= 1;
            insightsVisible = step >= 2;
          } else if (hasMeaning) {
            meaningVisible = step >= 1;
          } else if (hasInsights) {
            insightsVisible = step >= 1;
          }

          let stepPillsHtml = `<span class="vocab-step-pill is-active">1. 단어·위치</span>`;
          if (hasMeaning) {
            const pillClass = meaningVisible ? (step === (hasInsights ? 1 : 1) ? 'is-active' : 'is-done') : '';
            stepPillsHtml += `<span class="vocab-step-pill ${pillClass}">2. 의미 ${meaningVisible ? '✓' : '🔒'}</span>`;
          }
          if (hasInsights) {
            const insightsStepNum = hasMeaning ? 3 : 2;
            const pillClass = insightsVisible ? 'is-active' : '';
            stepPillsHtml += `<span class="vocab-step-pill ${pillClass}">${insightsStepNum}. Word Insights ${insightsVisible ? '✓' : '🔒'}</span>`;
          }

          const isFirst = selectedIndex === 0 && step === 0;
          const nextBtnText = step < maxStep ? '정보 공개 ▶' : (selectedIndex < items.length - 1 ? '다음 단어 ▶' : '첫 단어로 ↺');

          card.innerHTML = `
            <div class="vocab-card-header-bar">
              <div class="vocab-step-pills">${stepPillsHtml}</div>
              <button type="button" class="button secondary compact vocab-back-btn">전체 목록 (ESC/0)</button>
            </div>
            <div class="vocab-card-body">
              <div class="vocabulary-share-heading">
                <p class="vocabulary-location">${escapeHtml(item.location || "위치 미입력")}</p>
                <span aria-hidden="true">|</span>
                <h3>${escapeHtml(item.term || "(어휘 미입력)")}</h3>
              </div>
              ${item.imageData ? `<img class="vocabulary-share-image" src="${escapeAttribute(item.imageData)}" alt="${escapeAttribute(item.term || "어휘 참고 이미지")}">` : ""}
              ${hasMeaning ? `<p class="vocabulary-meaning ${meaningVisible ? 'is-revealed' : 'is-hidden'}">${escapeHtml(item.meaning)}</p>` : ""}
              ${hasInsights ? `<p class="vocabulary-insight-text ${insightsVisible ? 'is-revealed' : 'is-hidden'}">${escapeHtml(item.insights)}</p>` : ""}
            </div>
            <div class="vocab-card-footer-bar">
              <button type="button" class="button secondary compact vocab-nav-btn vocab-prev-btn" ${isFirst ? 'disabled' : ''}>◀ 이전 (←)</button>
              <span class="vocab-step-guide">💡 클릭 또는 화살표 키(→)로 다음 정보를 순차 공개합니다</span>
              <button type="button" class="button primary compact vocab-nav-btn vocab-next-btn">${nextBtnText}</button>
            </div>
          `;

          card.querySelector(".vocab-back-btn")?.addEventListener("click", (event) => {
            event.stopPropagation();
            state.vocabularyShareSelectedItemId = null;
            state.vocabularyShareStep = 0;
            renderShare();
          });

          card.querySelector(".vocab-prev-btn")?.addEventListener("click", (event) => {
            event.stopPropagation();
            advanceStep(-1);
            renderShare();
          });

          card.querySelector(".vocab-next-btn")?.addEventListener("click", (event) => {
            event.stopPropagation();
            advanceStep(1);
            renderShare();
          });

          card.addEventListener("click", (event) => {
            if (event.target.closest("button") || event.target.closest(".vocabulary-share-image")) return;
            advanceStep(1);
            renderShare();
          });

          card.addEventListener("keydown", (event) => {
            if (event.target.closest("button") || event.target.closest(".vocabulary-share-image")) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              advanceStep(1);
              renderShare();
            }
          });
        }

        const shareImgEl = card.querySelector(".vocabulary-share-image");
        if (shareImgEl) {
          shareImgEl.tabIndex = 0;
          shareImgEl.setAttribute("role", "button");
          shareImgEl.setAttribute("aria-label", `${item.term || "어휘"} 참고 이미지 크게 강조 보기`);
          shareImgEl.title = "클릭하여 이미지 크게 보기";
          const handleImgActivate = (event) => {
            event.stopPropagation();
            event.preventDefault();
            openImageModal(item);
          };
          shareImgEl.addEventListener("click", handleImgActivate);
          shareImgEl.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              handleImgActivate(event);
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
      if (context.pushHistoryState) context.pushHistoryState();
      state.vocabularyItems.push(makeItem());
      elements.vocabularyMessage.textContent = "새 어휘 카드를 추가했습니다.";
      renderAnalysis();
      elements.vocabularyList.lastElementChild?.querySelector('[data-field="term"]')?.focus();
    });
    window.addEventListener("resize", () => {
      if (state.mode === "vocabulary-share") renderShare();
    });
    function handleShareKey(key) {
      if (document.querySelector(".vocab-image-overlay")) {
        if (key === "0" || key === "Escape") {
          document.querySelector(".vocab-image-overlay")?.remove();
          return true;
        }
      }
      const items = state.vocabularyItems.filter((item) => item.term.trim() || item.meaning.trim() || item.insights.trim() || item.imageData);
      const rowCount = Math.ceil(items.length / 2);
      if (key === "0" || key === "Escape") {
        state.vocabularyShareFocusRow = null;
        state.vocabularyShareSelectedItemId = null;
        state.vocabularyShareStep = 0;
      } else if (key === "ArrowRight" || key === "ArrowDown" || key === " " || key === "Enter") {
        if (state.vocabularyShareSelectedItemId !== null) {
          advanceStep(1);
        } else if (state.vocabularyShareFocusRow !== null) {
          const targetRow = state.vocabularyShareFocusRow + 1;
          if (targetRow < 0 || targetRow >= rowCount || !items[targetRow * 2]) return false;
          state.vocabularyShareFocusRow = targetRow;
        } else {
          return false;
        }
      } else if (key === "ArrowLeft" || key === "ArrowUp") {
        if (state.vocabularyShareSelectedItemId !== null) {
          advanceStep(-1);
        } else if (state.vocabularyShareFocusRow !== null) {
          const targetRow = state.vocabularyShareFocusRow - 1;
          if (targetRow < 0 || targetRow >= rowCount || !items[targetRow * 2]) return false;
          state.vocabularyShareFocusRow = targetRow;
        } else {
          return false;
        }
      } else if (/^[1-9]$/.test(key)) {
        const row = Number(key) - 1;
        if (row >= rowCount || !items[row * 2]) return false;
        state.vocabularyShareSelectedItemId = null;
        state.vocabularyShareFocusRow = row;
        state.vocabularyShareStep = 0;
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
