# 2단계 · 모의시험 탭

견본: `index.html`(← practice-list), `exam.html`(← practice-solve), `result.html`(← practice-result).
기준 사진: `shots/practice-list-*`, `practice-solve-ok|diff|error|idle-*`, `practice-result-*`.

## 2-1. 첫 화면 `index.html`: 회차 고르기

- `k-tiles` 안의 `k-tile` 하나를 남기고, `rounds.json`의 회차 수만큼 기능 JS로 반복해 그린다.
  - 타일 큰 숫자: 회차 번호(예 `23-1`), 아래 글: 이름, 상태(안 풀었어요 / 푸는 중 / 11 / 15 맞힘)
  - 타일 속 코드 그림(`k-art`): 그 회차에 나온 유형의 대표 함수 두세 개
- 고른 회차는 `aria-pressed="true"`. 아래 `k-panel`에 그 회차의 큰 문제 목록(`k-items`)과 '이어서 풀기'를 보여 준다.
- '기억할 것' 칸에는 그 회차 풀이에서 자주 틀릴 점을 사람이 적어 두거나, 없으면 그 칸(`<div>` 하나)을 지운다. 지어서 채우지 않는다.

## 2-2. 문제 풀이 `exam.html`

- **번호 칸 `k-rail`:** 큰 문제마다 `k-rail-sect`(문제 1), 소문항마다 `k-rail-item`.
- **문제 칸 `k-pane-body`:**
  - 주제 글 → `k-theme-text`
  - 열 설명이 표로 있으면 → `k-theme`(dt 열 이름, dd 설명)
  - 소문항 → `k-q-h`(번호와 짧은 제목) + `k-q-text`
  - 데이터 파일 이름 → `k-chip k-chip-code`
- **위쪽 세그먼트:** 문제 · 힌트 · 풀이. 풀이 탭에는 `solution.code`를 `<pre class="k-code" data-k-hl data-k-lines>`로 보여 준다. `checked: false`면 제목 옆에 '확인 전'을 `k-q-state is-tried`로 붙인다.
- **편집기:** 회사 PC에 있는 브라우저 파이썬과 편집기를 `k-editor-body` 안에 넣는다.
  - CodeMirror 5·6이면 글꼴과 색이 저절로 맞는다. 편집기 설정에 `fontFamily`나 테마 글꼴을 따로 넣지 않는다.
  - 그냥 칸이면 `<textarea class="k-editor-plain">`.
  - **Monaco 편집기**는 CSS로 글꼴이 안 바뀐다. 만들 때 옵션에 키트 글꼴을 넣는다(이 한 줄은 check.py가 알리지 않게 `var(--k-f-` 대신 아래처럼 읽어 온다).

    ```js
    fontFamily: getComputedStyle(document.querySelector('.k-app')).getPropertyValue('--k-f-code'), fontSize: 13.5, lineHeight: 23
    ```
- **xlsx 읽기(브라우저 파이썬):** `openpyxl` 패키지를 같이 불러오고, xlsx 파일을 가져와 파이썬 파일 공간에 써 둔 뒤 `pd.read_excel('파일.xlsx')`로 읽게 한다. 파일 이름은 문제에 나온 이름 그대로.
- **실행 단추:** `k-run`. Ctrl+Enter도 실행.
- **결과 칸:** 실행 전 `idle` → 실행 중 `run`(판정 자리에 `<span class="k-spin"></span>실행 중`) → 끝나면:
  - `answer`가 있으면 출력과 비교해 같으면 `ok`, 다르면 `diff`(다른 곳은 `k-diff`)
  - 오류면 `error`(오류 줄 번호를 편집기 코드 칸 `data-k-err`에)
  - `answer`가 없으면 `idle`로 출력만 보여 주고, 아래 '직접 표시'(맞음 1 · 틀림 2)로 채점한다
- **남은 시간:** `k-top`의 `k-sub` 글자를 1초마다 바꾼다. 0이 되면 채점 화면으로.
- **기록:** 회차·소문항마다 내 코드와 표시를 브라우저 localStorage 하나(예: `hyds3-records`)에 저장한다. 새로 고침해도 남아야 한다.

## 2-3. 채점 결과 `result.html`

- `k-score`: 맞힌 소문항 수 / 전체, 큰 문제마다 `k-segbar`(`is-ok`, `is-bad`, 빈칸=안 함).
- `k-table`: 번호, 소문항 글, 내 답(출력 첫 줄), 결과(`k-res is-ok|is-bad|is-none`).
- 오른쪽: 틀린 소문항 다시 풀기, 지난 기록(회차별 점수).

## 확인

- [ ] 7개 회차 타일이 보이고, 고르면 아래 칸이 바뀐다
- [ ] 소문항 하나를 풀어 실행하면 xlsx를 읽고 결과가 나온다
- [ ] 맞는 답 · 틀린 답 · 오류 코드에서 결과 칸이 각각 `shots/practice-solve-ok`, `-diff`, `-error`와 같은 모양이다
- [ ] 정답이 없는 소문항은 직접 표시로 채점된다
- [ ] 새로 고침해도 내 코드와 표시가 남는다
- [ ] 채점 결과 화면이 `shots/practice-result-*`와 같은 모양이다
- [ ] `python design-kit/check.py hyds3-site`에 문제가 없다
