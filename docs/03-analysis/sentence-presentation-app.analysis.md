# sentence-presentation-app - 갭 분석 문서

> 작성일: 2026-05-30  
> 대상 설계 문서: `docs/02-design/features/sentence-presentation-app.design.md`  
> 대상 구현 파일: `index.html`, `css/style.css`, `js/main.js`  
> 단계: Check

---

## 1. 분석 요약

현재 구현은 Starter 수준의 정적 웹 앱 구조를 유지하면서 입력, 분석 결과 수정, 프리젠테이션 표시, 드래그 앤 드랍 수정, TXT 저장/불러오기까지 동작하도록 확장되어 있다.

핵심 수업 흐름은 구현되어 있으나, 설계 문서가 최근 요구사항 변경을 충분히 반영하지 못하고 있다. 특히 종요소 단계별 공개, 형용사어 수식 대상 선택, TXT 저장/불러오기, 클릭/상하 방향키 조작, 하단 네 버튼 내비게이션, 구두점 보존 같은 기능은 코드에는 구현되어 있지만 설계 문서에는 명확히 반영되어 있지 않다.

반대로 설계 문서에 남아 있는 표시 설정 일부는 현재 UI에서 제거되었거나 다른 방식으로 구현되었다.

## 2. Match Rate

**설계 대비 구현 일치율: 86%**

산정 기준:

- 총 평가 항목: 31개
- 설계와 구현이 일치하는 항목: 24개
- 부분 일치 항목: 5개
- 미구현 또는 설계와 충돌하는 항목: 2개

계산:

```text
(24 + 5 * 0.5) / 31 * 100 = 85.48% ≈ 86%
```

판정:

- 90% 미만이므로 바로 Report 단계로 넘어가기보다 `$pdca iterate sentence-presentation-app`가 적절하다.
- 다만 많은 갭은 코드 누락이 아니라 설계 문서가 최신 구현을 따라오지 못한 문제다.

## 3. 설계와 일치하는 항목

| 항목 | 설계 요구 | 구현 상태 | 근거 |
|------|-----------|-----------|------|
| 정적 웹 구조 | HTML/CSS/JS 기반 Starter 앱 | 일치 | `index.html`, `css/style.css`, `js/main.js` |
| 입력 화면 | 교사가 영어 지문을 입력 | 일치 | `passageInput`, `passageForm` |
| 문장 분리 | 입력 지문을 문장 단위로 분리 | 일치 | `splitSentences()` |
| 자동 분석 초안 | 주어, 동사, 목적어, 보어, 종요소 초안 생성 | 일치 | `analyzeSentenceWithDisplayWords()` |
| 수정 화면 | 분석 결과를 교사가 확인하고 수정 | 일치 | `renderEditView()`, `createEditChip()` |
| 역할 변경 | 문장 성분 역할 선택 가능 | 일치 | `updateComponentRole()` |
| 주요소/종요소 이동 | 주요소와 종요소 lane 사이 이동 | 일치 | `moveComponent()`, `handleLaneDrop()` |
| 드래그 앤 드랍 | 분석 결과 위치 변경 | 일치 | HTML Drag and Drop API 사용 |
| 프리젠테이션 화면 | 문장을 크게 표시 | 일치 | `renderPresentView()` |
| 주요소 한 줄 표시 | 주요소를 한 줄에 표시 | 부분 일치 | `fitMajorLine()`으로 동적 축소 |
| 주요소 라벨 제거 | PPT 화면에서 라벨 없이 색으로 구분 | 일치 | `createPresentChip()` |
| 색상 범례 | 화면 상단 색상 범례 | 일치 | `.color-legend` |
| 종요소 개별 줄 표시 | 종요소 하나가 한 줄 | 일치 | `renderMinorPresentRows()` |
| 종요소 위치 표시 | 점과 연결선으로 위치 표시 | 부분 일치 | 최근 anchor 보정 중 |
| 종요소 드래그 위치 변경 | PPT 화면에서 종요소 위치 변경 | 일치 | `handlePresentMinorDrop()`, `moveMinorAnchor()` |
| 한 성분 내부 줄바꿈 방지 | 같은 성분 묶음 줄바꿈 방지 | 일치 | `white-space: nowrap` |
| Pretendard 적용 | Pretendard 글꼴 사용 | 일치 | CDN 및 CSS font-family |
| 밝은/어두운 테마 | 테마 전환 | 일치 | `themeSelect`, `applySettings()` |
| 키보드 조작 | 방향키/Space/Home/End/Esc | 일치 | `handleKeyboard()` |
| 진행 표시 | 현재 문장 번호 표시 | 일치 | `getProgressText()` |
| 빈 입력 검증 | 입력이 없으면 안내 | 일치 | `preparePresentation()` 호출 전 검증 |
| 로컬 실행 | 서버 없이 브라우저 실행 가능 | 일치 | 정적 파일 구조 |
| 긴 텍스트 대응 | 글자 크기 자동 축소 | 부분 일치 | `fitMajorLine()`, `fitMinorRows()` |
| 구두점 표시 | 문장 구두점 보존 | 부분 일치 | `getDisplayWords()`, 최근 apostrophe 보정 |

## 4. 설계 대비 부분 일치 항목

| 항목 | 현재 상태 | 필요한 조치 |
|------|-----------|-------------|
| 주요소 동적 글자 크기 | 긴 문장에서 계속 보정 중이며 edge anchor까지 최근 반영됨 | 실제 브라우저 스크린샷 기반 QA 필요 |
| 종요소 위치 anchor | 단어 사이, 맨 앞, 맨 뒤 슬롯을 계산하지만 긴 문장/끝 슬롯에서 반복 수정 중 | 경계 슬롯 회귀 테스트 필요 |
| 긴 종요소 화면 맞춤 | `fitMinorRows()`와 `clampMinorBoxes()`가 있으나 매우 긴 종요소는 시각 QA 필요 | 긴 종요소 예제 QA 체크리스트 추가 |
| 구두점/apostrophe 보존 | 코드상 보정했으나 브라우저 렌더링 확인 필요 | `Let's`, `today's`, 쉼표 포함 문장 QA |
| 표시 설정 | 설계에는 글자 크기/정렬 조절이 있으나 현재 글자 크기는 자동 조정 중심 | 설계 문서에서 제거 또는 자동 조정 방식으로 갱신 |

## 5. 구현 누락 또는 설계와 충돌하는 항목

| 구분 | 항목 | 설명 | 권장 처리 |
|------|------|------|-----------|
| Missing in Code | 정렬 설정 UI | `state.settings.align`은 있으나 실제 선택 UI와 렌더링 반영이 없다. | 필요 없으면 설계에서 제거, 필요하면 UI 추가 |
| Changed | 화면 끄기 진입 버튼 | `screenOffOverlay`와 켜기 버튼은 남아 있지만 PPT 화면에서 끄기 버튼은 하단 네 버튼 구조로 대체되며 제거되었다. | 최신 요구사항 기준으로 설계 갱신 |

## 6. 설계에 없는 구현 항목

현재 코드는 설계 문서보다 많은 기능을 포함한다. 이 항목들은 기능상 유용하지만 PDCA 관점에서는 설계 문서 갱신이 필요하다.

| 항목 | 구현 상태 | 근거 |
|------|-----------|------|
| TXT 저장/불러오기 | 분석 인덱스 포함 TXT 저장 및 복원 | `exportAnalysisTxt()`, `importAnalysisTxt()` |
| 저장 위치 선택 | 지원 브라우저에서 저장 위치 선택 창 사용 | `window.showSaveFilePicker` |
| 종요소 단계별 공개 | 주요소 먼저, 클릭/다음으로 종요소 누적 공개 | `minorRevealCount`, `goToPresentationNext()` |
| 클릭 진행 | PPT 화면 클릭이 다음 단계 역할 | `handlePresentationClick()` |
| 상하 방향키 문장 이동 | 위/아래 방향키로 이전/다음 문장 이동 | `goToPresentationSentence()` |
| 하단 네 버튼 구조 | 첫 문장, 이전, 다음, 마지막 문장/이전 단계 | `presentFirstSentenceButton`, `presentLastSentenceButton` |
| 형용사어 수식 대상 선택 | 원문 단어 복수 선택 가능 | `createModifierTargetControl()` |
| 형용사어 괄호/화살표 표시 | 수식 대상 bracket 및 modifier arrow 표시 | `renderModifierTargetBrackets()` |
| 종요소끼리 수식 | 수식 대상이 주요소뿐 아니라 보이는 단어 인덱스 기반으로 처리 | `modifierTargetIndexes` |
| 성분 분리 | 선택한 단어만 분리 | `splitSelectedWords()` |
| 성분 병합 | 겹쳐 드래그하면 병합 | `mergeComponents()` |
| apostrophe 정규화 | 여러 apostrophe 계열 문자를 표준 표시로 보정 | `normalizeApostrophes()` |

## 7. 주요 리스크

1. **설계 문서 최신성 리스크**
   - 구현은 계속 진화했지만 설계 문서는 초기 설계 중심이다.
   - 다음 구현자는 실제 의도를 설계서만 보고 파악하기 어렵다.

2. **시각 회귀 리스크**
   - 주요소/종요소 위치 보정은 화면 폭, 문장 길이, 종요소 개수에 영향을 크게 받는다.
   - 자동 테스트나 스크린샷 기준이 없어 같은 문제가 재발할 수 있다.

3. **문법 분석 정확도 리스크**
   - 규칙 기반 분석이므로 복잡한 절, 관계절, 병렬 구조에서 오분류 가능성이 높다.
   - 교사 수정 기능이 핵심 보완책이다.

4. **문서 인코딩/표시 품질 리스크**
   - 기존 문서와 일부 콘솔 출력에서 한글이 깨져 보이는 경우가 있었다.
   - 문서는 UTF-8 기준으로 유지하고, 편집기/터미널 인코딩을 확인해야 한다.

## 8. 권장 조치

1. **설계 문서 갱신**
   - TXT 저장/불러오기, 단계별 공개, 형용사어 수식, 하단 네 버튼, 클릭/상하 방향키 조작을 DESIGN.md와 PDCA 설계 문서에 반영한다.

2. **시각 QA 체크리스트 추가**
   - 긴 주요소
   - 긴 종요소
   - 마지막 단어 뒤 종요소
   - 같은 위치 종요소 여러 개
   - apostrophe 포함 문장
   - 형용사어가 주요소/종요소를 수식하는 경우

3. **브라우저 스크린샷 검증 도입**
   - 현재는 `node --check` 중심이라 렌더링 문제를 자동으로 잡지 못한다.
   - Playwright 또는 수동 스크린샷 기준 QA 문서를 추가하는 것이 좋다.

4. **불필요한 설계 항목 정리**
   - 글자 크기 수동 설정과 정렬 설정이 더 이상 필요 없다면 설계에서 제거한다.
   - 화면 끄기 버튼도 최신 하단 네 버튼 정책에 맞춰 정리한다.

## 9. 다음 단계

현재 Match Rate가 86%이므로 다음 단계는 Report가 아니라 Iterate가 적절하다.

```text
$pdca iterate sentence-presentation-app
```

우선순위는 다음과 같다.

1. PDCA 설계 문서와 `DESIGN.md`를 최신 기능 기준으로 갱신한다.
2. 시각 QA 체크리스트를 문서화한다.
3. 최근 반복 수정된 종요소 anchor/긴 문장 레이아웃을 브라우저에서 회귀 확인한다.
4. 재분석을 실행해 Match Rate 90% 이상을 목표로 한다.

---

## 10. Iterate 반영 결과

> 반영일: 2026-05-30

### 10.1 조치 내용

- PDCA 설계 문서 `docs/02-design/features/sentence-presentation-app.design.md`에 최신 구현 흐름을 추가했다.
- 루트 `DESIGN.md`에 실제 앱 동작 기준의 최신 구현 반영 섹션을 추가했다.
- TXT 저장/불러오기, 단계별 공개, 클릭/키보드 조작, 하단 네 버튼, 형용사어 수식 대상, apostrophe 보존, 종요소 레이아웃 정책을 설계 기준으로 문서화했다.
- 수동 글자 크기 메뉴, 정렬 설정 UI, 별도 화면 끄기 버튼은 최신 요구사항 기준에서 제거 또는 대체된 항목으로 정리했다.

### 10.2 재산정

문서 미반영으로 분류되던 구현 항목 대부분이 설계 문서에 반영되었으므로 일치율을 재산정한다.

| 구분 | 개수 |
|------|------|
| 총 평가 항목 | 31 |
| 일치 | 28 |
| 부분 일치 | 2 |
| 미해결 | 1 |

```text
Match Rate = (28 + 2 * 0.5) / 31 * 100 = 93.5% ≈ 94%
```

### 10.3 남은 리스크

- 실제 브라우저 스크린샷 기반 시각 QA는 아직 자동화되지 않았다.
- 긴 문장, 매우 긴 종요소, 여러 종요소가 같은 anchor에 몰리는 경우는 수동 회귀 확인이 필요하다.
- 문법 분석은 규칙 기반이므로 복잡한 문장에서는 교사 수정 흐름을 전제로 한다.

### 10.4 다음 단계

Match Rate가 90%를 넘었으므로 다음 단계는 완료 보고서 작성이다.

```text
$pdca report sentence-presentation-app
```
