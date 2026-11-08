# 1단계 · 키트 파일 넣기

## 할 일

1. 키트의 세 폴더를 사이트 복사본 안의 `k` 폴더로 복사한다. 폴더 모양을 그대로 둔다(design.css가 `../fonts/`로 글꼴을 찾는다).

   ```
   site-design/
     k/
       css/design.css
       js/design.js
       fonts/PretendardVariable.woff2
   ```

2. 사이트의 모든 HTML 파일에서:
   - `<head>` 안, 사이트의 원래 CSS `<link>`들 **뒤에** 넣는다.

     ```html
     <link rel="stylesheet" href="k/css/design.css">
     ```

   - `</body>` 바로 앞, 사이트의 원래 `<script>`들 **뒤에** 넣는다.

     ```html
     <script src="k/js/design.js"></script>
     ```

   - HTML 파일이 하위 폴더에 있으면 `../k/css/design.css`처럼 경로를 맞춘다.
3. `<body>`에 `class="k-body"`를 더한다. 원래 class가 있으면 빈칸을 두고 덧붙인다.

   ```html
   <body class="원래class k-body">
   ```

4. 화면 전체를 감싸는 맨 바깥 요소(보통 `<div id="app">`)에 `k-app` class를 더한다. 맨 바깥 요소가 없으면 `<body>` 안의 내용 전체를 새 `<div>`로 감싼다.

   ```html
   <div id="app" class="k-app">
   ```

   - `data-k-fit`(한 화면에 맞추기)은 아직 붙이지 않는다. 2단계에서 붙인다.

   - 사이트가 화면을 그리는 자리를 id로 찾는다면 그 id는 그대로 둔다.

## 알아 둘 것

- 이 단계가 끝나면 바탕이 검게 바뀌고 글꼴이 Pretendard로 바뀐다. 나머지 모양은 아직 그대로다.
- 일부 칸의 크기가 조금 달라질 수 있다(키트는 상자 크기를 테두리까지 넣어 잰다). 화면마다 바꾸는 단계에서 맞춰진다.

## 확인

- [ ] `python design-kit/check.py site-design` → '키트 파일이 같아요'가 나온다
- [ ] 바탕이 검고 글꼴이 바뀌었다
- [ ] 문제 하나를 실행하면 원래처럼 결과가 나온다
- [ ] 브라우저 개발자 도구(F12) 콘솔에 빨간 오류가 새로 생기지 않았다
