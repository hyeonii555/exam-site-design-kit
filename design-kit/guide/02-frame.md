# 2단계 · 공통 틀: 머리줄, 네 탭, 보기 메뉴, 본문 틀

베낄 곳: 아무 예시 페이지의 `<header class="k-head">…</header>` 부분과 `<main class="k-main">` 줄(예: `pages/summary-home.html`).

## 할 일

1. 사이트의 위쪽 막대(사이트 이름과 탭이 있는 곳)를 찾는다.
   - HTML에서 탭 이름 글자(예: 개념 자료 요약)를 검색하면 나온다.
2. 그 막대를 예시의 `k-head` 모양으로 바꾼다.

   ```html
   <header class="k-head">
     <a class="k-brand" href="(원래 첫 화면 주소)">(원래 사이트 이름)</a>
     <nav class="k-nav" aria-label="사이트 메뉴">
       <span class="k-thumb" aria-hidden="true"></span>
       <a href="(원래 주소)" aria-current="page">(원래 탭 이름)</a>
       <a href="(원래 주소)">(원래 탭 이름)</a>
       …
     </nav>
     <div class="k-head-tools">
       (보기 단추와 보기 메뉴: 예시 페이지에서 그대로 복사)
     </div>
   </header>
   ```

   - 탭 이름, 주소, 원래 붙어 있던 onclick·id·data- 값은 그대로 옮긴다.
   - 탭이 다섯 개 이상이면 그대로 두면 된다(칸 폭 96px씩).
   - `k-thumb` 줄은 탭 묶음 안 맨 앞에 한 번만 둔다.
3. 지금 보고 있는 탭에 `aria-current="page"`를 붙인다.
   - 사이트가 페이지를 바꾸지 않고 JS로 탭을 바꾸는 방식이면, 원래 탭을 바꾸는 함수 안에 아래 두 줄을 더한다. 다른 코드는 건드리지 않는다.

     ```js
     document.querySelectorAll('.k-nav > a, .k-nav > button').forEach(function (t) { t.removeAttribute('aria-current'); });
     눌린탭.setAttribute('aria-current', 'page');
     ```

4. 보기 메뉴(`k-tool` 단추와 `k-pop` 메뉴)는 예시 페이지의 것을 글자 하나 바꾸지 않고 복사한다. 동작은 design.js가 한다.
5. 탭 아래 본문을 감싸는 요소에 `k-main` class를 더한다.
   - 아직 바꾸지 않은 다른 탭의 화면이 길어도 `k-main` 안에서 굴러간다.
   - 화면 제목 줄은 `<div class="k-top">`으로 감싼다.
   - 제목은 첫 화면이면 `<h1 class="k-title-l">`, 안쪽 화면이면 `<h1 class="k-title">`로 쓴다.
6. 이제 `k-app` 요소에 `data-k-fit`을 더한다. 화면이 1512×945 기준으로 높이에 맞춰 통째로 커지거나 작아지고, 페이지 전체는 굴러가지 않는다.

   ```html
   <div id="app" class="k-app" data-k-fit>
   ```

   - 이것 때문에 사이트의 위치 계산(마우스 좌표 등)이 어긋나면 `data-k-fit`만 빼고 사람에게 알린다.

## 확인

- [ ] 탭을 누르면 회색 손잡이가 그 탭 아래로 미끄러진다
- [ ] '보기' → 밝게를 누르면 밝아지고, 새로 고침해도 유지된다
- [ ] '보기' → 글자 크기 크게·작게가 된다
- [ ] 바깥을 누르거나 Esc를 누르면 메뉴가 닫힌다
- [ ] `shots/summary-home-dark.jpg`와 머리줄 모양이 같다(높이, 가운데 탭, 오른쪽 '보기')
- [ ] 각 탭의 원래 기능이 그대로 돌고, 아직 안 바꾼 긴 화면도 본문 칸 안에서 굴러간다
- [ ] `python design-kit/check.py site-design`에 문제가 없다
