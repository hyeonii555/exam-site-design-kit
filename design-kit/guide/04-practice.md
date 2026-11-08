# 4단계 · 기출 실습 탭

이 탭에는 파이썬 실행과 채점이 있다. **모양만** 바꾸고 실행·채점·기록 코드는 한 줄도 바꾸지 않는다.

베낄 곳: `pages/practice-list.html`(회차 화면), `pages/practice-solve.html`(문제 풀이), `pages/practice-result.html`(채점 결과).
기준 사진: `shots/practice-*.jpg`. 결과 칸은 상태마다 사진이 있다(`-ok`, `-diff`, `-error`, `-idle`).

## 4-1. 회차 화면

- 회차 목록 → `<div class="k-tiles">` 안에 회차마다 `<button class="k-tile">`.
  - 고른 회차는 `aria-pressed="true"`.
- 고른 회차의 자세한 칸 → `<div class="k-two">` 왼쪽 `k-panel`, 오른쪽 `k-panel k-panel-s`.
- '이어서 풀기' 같은 주 단추는 `k-btn k-btn-primary k-btn-big`, 보조는 `k-btn k-btn-big`.

## 4-2. 문제 풀이 화면 (가장 중요)

전체 틀:

```html
<div class="k-solve">
  <nav class="k-rail">(소문항 번호 단추들)</nav>
  <section class="k-pane">(문제 칸)</section>
  <div class="k-work">(편집기 + 결과 칸)</div>
</div>
```

1. **번호 칸:**
   - 번호 단추마다 `class="k-rail-item"`을 쓴다.
   - 지금 문제는 `aria-current="step"`으로 표시한다.
   - 맞힌 문제는 `data-state="done"`, 틀린 문제는 `data-state="wrong"`, 풀어 본 문제는 `data-state="tried"`.
   - 원래 사이트가 상태를 class로 표시한다면, 그 class를 바꾸는 줄 옆에 `data-state`를 같이 바꾸는 한 줄만 더한다.
   - 주제 문제가 여럿이면 `<p class="k-rail-sect">문제 1</p>`로 묶는다.
2. **문제 칸:**
   - 위에 탭(문제·힌트·풀이)이 있으면 `k-pane-top` 안의 `k-seg`로 바꾼다. 고른 탭은 `aria-pressed="true"`.
   - 본문은 `k-pane-body` 안에 둔다.
     - 주제 글(데이터 설명)은 `<p class="k-theme-text">`, 열 설명이 있으면 `<dl class="k-theme">`
     - 소문항 제목은 `<h2 class="k-q-h">`, 소문항 글은 `<p class="k-q-text">`
3. **편집기:**
   - 원래 편집기 요소를 `k-editor` 안의 `k-editor-body`로 옮긴다(감싸기만 한다).

     ```html
     <section class="k-editor">
       <div class="k-editor-bar"><span class="k-fname">main.py</span><span class="k-grow"></span>(원래 실행 단추)</div>
       <div class="k-editor-body">(원래 편집기: CodeMirror 또는 textarea)</div>
     </section>
     ```

   - CodeMirror 5면 색이 저절로 맞는다.
   - 그냥 textarea면 `class="k-editor-plain"`을 더한다.
   - 다른 편집기면 그 편집기의 배경을 `var(--k-code)`, 글자를 `var(--k-code-ink)`로만 맞춘다.
   - 실행 단추는 원래 단추에 `k-run` class를 더하고, 글자는 예시처럼 `실행 <kbd>Ctrl+Enter</kbd>`로 둔다. onclick은 그대로 둔다.
4. **결과 칸:**
   - 예시의 `<section class="k-result">` 모양으로 바꾼다.
   - 원래 결과를 쓰는 코드(실행이 끝나면 결과를 넣는 함수)에서 결과 칸 요소에 상태를 적는 한 줄만 더한다.

     ```js
     결과칸.setAttribute('data-state', 'ok');   // 'idle' 실행 전 · 'ok' 정답과 같음 · 'diff' 다름 · 'error' 오류
     ```

   - 판정 글자(정답과 같아요 등)는 `<span class="k-verdict">`에 둔다. 색은 data-state를 보고 저절로 바뀐다.
   - 출력은 `<pre class="k-out">`, 오류는 `<pre class="k-err"><b>오류이름</b>: 내용</pre>`.
   - 다른 곳 표시는 `k-diff`.
   - 오류 줄을 편집기에 표시하는 기능이 원래 있으면 그대로 둔다(CodeMirror면 `k-err-line` class를 쓰면 색이 맞는다).

## 4-3. 채점 결과 화면

- 맞힌 수 → `k-score`, 소문항 표 → `<table class="k-table">`, 맞음·틀림 글자 → `<span class="k-res is-ok">`, `is-bad`, `is-none`.
- 오른쪽 칸은 `k-col` 안에 `k-card-l k-card-pad`, 목록이면 `k-card-l k-card-list`.

## 확인

- [ ] 문제 풀이 화면이 한 화면에 들어가고, 편집기·결과·문제 칸이 각자 안에서만 굴러간다
- [ ] 문제를 실행하면 결과가 원래처럼 나오고, 결과 칸 색이 상태에 맞게 바뀐다
- [ ] 정답·오답 표시, 번호 칸의 점 색이 맞다
- [ ] 새로 고침해도 푼 기록이 그대로 있다(가장 중요)
- [ ] 채점하기가 원래처럼 된다
- [ ] 기준 사진 `practice-solve-ok`, `-diff`, `-error`와 비교했다
- [ ] `python design-kit/check.py site-design`에 문제가 없다(특히 '기록 저장 이름이 사라졌어요'가 없어야 한다)
