# 5단계 · 개념 탭 (개념 설명)

베낄 곳: `pages/concepts.html`. 기준 사진: `shots/concepts-*.jpg`.

## 할 일

1. 화면을 두 칸으로 나눈다.

   ```html
   <div class="k-notes">
     <section class="k-concepts"><div class="k-concepts-b">(왼쪽: 개념 목록)</div></section>
     <section class="k-code-pane">(오른쪽: 코드)</section>
   </div>
   ```

2. **왼쪽 목록:**
   - 묶음 제목은 `<h2 class="k-group-h">이름<span>개수</span></h2>`.
   - 개념 하나는 아래 모양이다.

     ```html
     <div class="k-item"><button type="button" class="k-item-b" aria-expanded="false">
       (예시의 오른쪽 꺾쇠 svg)
       <span class="k-item-t"><b>(개념 이름)</b><small>(대표 함수)</small></span>
       <span class="k-item-ref">(줄 범위)</span>
     </button></div>
     ```

   - 고른 개념은 `k-item`에 `is-on`을 더하고 `aria-expanded="true"`. 설명 글은 버튼 아래 `<div class="k-item-d">` 안에 `<p>`로 둔다.
   - 원래 개념을 고르는 코드(클릭 함수)는 그대로 두고, 그 안에서 `is-on`을 옮기는 줄만 더한다.
3. **오른쪽 코드:**

   ```html
   <section class="k-code-pane">
     <div class="k-code-h"><span class="k-fname">(파일 이름)</span><span class="k-code-st"><b>(줄 범위)</b> (개념 이름)</span></div>
     <pre class="k-code k-code-dim" data-k-hl data-k-lines data-k-lit="12-15">(코드 글 그대로)</pre>
   </section>
   ```

   - 개념을 고를 때 `pre.setAttribute('data-k-lit', '12-15')`처럼 그 개념의 줄 범위만 바꾸면 design.js가 그 줄을 밝힌다.
   - 사이트에 '개념 ↔ 줄 범위' 정보가 없으면 밝은 줄은 쓰지 않는다. 그때는 `data-k-lit`과 `k-code-dim`을 빼고, 고른 개념의 코드만 보여 준다.
   - 코드 글을 바꾸거나 코드 칸을 새로 넣으면 design.js가 저절로 색과 줄 번호를 다시 넣는다.

## 확인

- [ ] 개념을 누르면 목록의 파란 칸이 옮겨 가고, 오른쪽 코드의 그 줄이 밝아진다
- [ ] 줄 번호와 코드 색이 기준 사진과 같다
- [ ] 왼쪽 목록과 오른쪽 코드가 각자 안에서만 굴러간다
- [ ] `python design-kit/check.py site-design`에 문제가 없다
