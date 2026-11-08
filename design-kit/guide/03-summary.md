# 3단계 · 요약 탭 (개념 자료 요약·정리)

베낄 곳: `pages/summary-home.html`(첫 화면), `pages/summary-topic.html`(주제 화면).
기준 사진: `shots/summary-home-*.jpg`, `shots/summary-topic-*.jpg`.

## 첫 화면: 주제 카드

1. 사이트의 요약 첫 화면에서 주제 목록을 찾는다.
2. 목록 전체를 `<div class="k-topics">`로 바꾸고, 주제 하나를 카드 하나로 만든다.

   ```html
   <a class="k-topic" href="(원래 주제 주소)">
     <pre class="k-art" data-k-hl>(그 주제 코드의 앞부분 8~10줄)</pre>
     <span class="k-topic-t"><b>(주제 이름)</b><small>(정리 개수 · 대표 함수)</small></span>
   </a>
   ```

   - 카드 속 코드는 그 주제의 자료에 이미 있는 코드를 앞에서부터 잘라 쓴다. 새로 지어 쓰지 않는다.
   - 카드는 한 줄에 넷, 두 줄까지(8개)가 한 화면이다.
     - 주제가 더 많으면 `k-topics`를 감싼 칸이 굴러가게 두거나, 세그먼트(`k-seg`)로 묶음을 나눈다.
3. 오른쪽 칸(`k-side-card`: 자주 찾는 것, 시험 볼 때 순서)은 사이트에 그런 목록이 있을 때만 쓴다. 없으면 두 칸을 빼고 `k-topics`에 `is-full`을 더한다(카드가 한 줄에 넷, 오른쪽 빈칸 없이).

   ```html
   <div class="k-topics is-full">
   ```
4. 아래 '이어서' 줄(`k-continue`)은 사이트가 이미 '마지막에 본 곳'을 기억할 때만 쓴다. 새로 기억하게 만들지 않는다(기록 저장 이름이 늘어난다).

## 주제 화면: 왼쪽에서 읽고, 오른쪽에서 상황별 정리

```html
<div class="k-top"><a class="k-back" href="(요약 첫 화면)">(뒤로 그림)요약</a><h1 class="k-title">(주제 이름)</h1></div>
<div class="k-split">
  <article class="k-read"><div class="k-prose">(원래 요약 글: h2, h3, p, ul, code, pre)</div></article>
  <section class="k-sits">(오른쪽 칸: 세그먼트 + 상황별 줄)</section>
</div>
```

- 글 속 코드 상자는 `<pre class="k-code" data-k-hl>`로 바꾼다. 글 속 짧은 코드는 `<code>` 그대로 둔다(k-prose가 모양을 준다).
- 오른쪽 칸에 넣을 것(상황별 정리, 함수 모음 등)이 사이트에 없으면 `k-split` 대신 `<article class="k-read">` 하나만 둔다.
- 뒤로 그림은 예시의 `<svg>`를 그대로 복사한다(글자 기호 ‹ 를 쓰지 않는다).

## 확인

- [ ] 첫 화면이 스크롤 없이 한 화면에 들어간다(맥북 14 크기 기준)
- [ ] 카드를 누르면 원래 주제 화면으로 간다
- [ ] 주제 화면의 왼쪽 글과 오른쪽 칸이 각자 안에서만 굴러간다(화면 전체는 굴러가지 않는다)
- [ ] 밝게에서도 글자가 잘 읽힌다
- [ ] 기준 사진과 간격·크기가 같다
- [ ] `python design-kit/check.py site-design`에 문제가 없다
