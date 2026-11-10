# 0단계 · 새 사이트 폴더 만들기

## 할 일

1. 새 폴더를 만든다(예: `hyds3-site`). 아래 모양으로 키트 파일을 복사한다.

   ```
   hyds3-site/
     index.html            ← pages/practice-list.html 을 복사 (모의시험 첫 화면)
     exam.html             ← pages/practice-solve.html 을 복사 (문제 풀이)
     result.html           ← pages/practice-result.html 을 복사 (채점 결과)
     prep.html             ← pages/codefind.html 을 복사 (시험 대비)
     k/css/design.css      ← 키트 그대로
     k/js/design.js        ← 키트 그대로
     k/fonts/PretendardVariable.woff2   ← 글 글꼴
     k/fonts/JetBrainsMono.woff2        ← 코드 글꼴(이 파일이 없으면 코드가 Consolas로 나온다)
     app/                  ← 기능 JS (2·3단계에서 만든다)
     data/                 ← 자료 (1단계에서 만든다)
   ```

2. 복사한 HTML 네 개에서 경로만 고친다: `../css/design.css` → `k/css/design.css`, `../js/design.js` → `k/js/design.js`.
3. 머리줄의 탭(`<nav class="k-nav">`)을 둘로 줄인다. 다른 줄은 지우지 않는다.

   ```html
   <a href="index.html" aria-current="page">모의시험</a>
   <a href="prep.html">시험 대비</a>
   ```

   - 페이지마다 자기 탭에 `aria-current="page"`. 사이트 이름(`k-brand`)은 'HyDS3 시험 준비'.
4. 이 상태에서 네 페이지를 브라우저로 열어 본다. 내용은 아직 지어낸 카페 데이터다.
5. 빈 상태를 적어 둔다: `python design-kit/check.py --baseline hyds3-site`

## 디자인 숫자 (참고용. 새로 쓰지 말고 이미 있는 class를 쓴다)

| 항목 | 값 |
|---|---|
| 글꼴 | Pretendard(본문), JetBrains Mono(코드, 코드 속 한글은 Pretendard). 둘 다 `k/fonts/`의 파일로 넣으므로 PC마다 같다. 본문 15px/1.47, 긴 글 15px/1.7, 코드 13.5px/1.7 |
| 제목 | 첫 화면 34px 700, 안쪽 화면 24px 700, 칸 제목 17px 700 |
| 모서리 | 큰 칸 18 · 칸 14 · 코드 상자 10 · 단추 8 · 작은 칩 7 · 둥근 단추 999 |
| 간격 | 4 · 8 · 12 · 16 · 20 · 24. 칸 사이 16(같은 칸 안의 두 쪽은 12), 화면 가장자리 24 |
| 줄 | 목록 줄 사이 0.5px 선, 줄 높이 44 이상 |
| 움직임 | 누르면 0.97배로 120ms, 탭 손잡이 260ms, 곡선 cubic-bezier(.23, 1, .32, 1). 키보드로 고를 때는 움직임 없음. 움직임 줄이기 설정을 따름 |
| 화면 | 1512×945에 맞춰 높이에 따라 통째로 커지고 작아짐(`data-k-fit`). 화면 전체는 굴러가지 않고, 긴 칸만 안에서 굴러감 |

## 확인

- [ ] 네 페이지가 열리고, 글꼴이 Pretendard다
- [ ] 머리줄에 탭이 둘이고, 손잡이가 지금 탭 아래 있다
- [ ] '보기'에서 밝게·글자 크기가 된다
- [ ] `shots/practice-list-dark.jpg`, `practice-solve-ok-dark.jpg`, `codefind-dark.jpg`와 나란히 놓으면 탭 이름 말고는 같다
