# 3단계 · 시험 대비 탭

견본: `prep.html`(← codefind.html), 동작: `pages/codefind-demo.js`.
기준 사진: `shots/codefind-dark.jpg`(처음), `codefind-result-*`(결과, 오른쪽에 MASTER가 맨 위), `codefind-edit-*`(글 고치기).

## 화면이 하는 일

- **처음 화면:** 시험 문제를 붙여 넣는 칸 하나와, 결과가 놓일 빈 틀이 있다. 탭을 열면 칸에 커서가 있다.
- **붙여 넣으면 바로:**
  - 주제 글과 소문항으로 나눈다.
  - 소문항마다 유형을 찾아 코드를 놓는다.
  - 맨 위는 준비 코드(import + `pd.read_excel('주제 글의 파일.xlsx')`)다.
- **오른쪽 칸:** 고른 소문항의 코드가 모두 나온다.
  - 맨 위에 그 유형의 **MASTER 코드**, 그 아래에 기출 풀이 원본이 온다.
  - 누르거나 1·2·3·4 키로 바꾸고, 위·아래 키로 소문항을 옮긴다.
- **문제 탭과 새 문제, 전체 복사, 글 고치기:** 견본 그대로.

## 할 일

1. `pages/codefind-demo.js`를 `app/prep.js`로 복사한다. `prep.html` 끝의 `<script src="codefind-demo.js">`를 `<script src="app/prep.js">`로 바꾼다.
2. `app/prep.js`에서 이 부분들만 바꾼다.
   - **가짜 자료 지우기:** `var FAKE = …;`, `POOL`, `wordScore`, 그리고 `#result`·`#edit`로 가짜 문제를 넣는 부분.
   - **`topics.json` 읽기:** 시작할 때 `fetch('data/topics.json')`로 읽어 둔다. 파일로 열어서 fetch가 막히면, 1단계에서 `data/topics.js`(`window.TOPICS = […]`)도 같이 만들어 `<script>`로 읽는다.
   - **`findCodes(subText, themeText)`:**
     1. 유형마다 `words` 중 소문항 글에 들어 있는 낱말 수를 센다. 1개 이상인 유형을 많은 순으로 둔다.
     2. 1등 유형으로 후보를 만든다.
        - MASTER: `{ src: 'MASTER · ' + 유형 이름, kind: 'master', imp: 유형.imp, code: 유형.master }`
        - 원본: `uses`마다 `{ src: '기출 풀이 · ' + q, kind: 'past', imp: (코드의 import 줄들), code: (import 줄을 뺀 코드) }`
          - 만든 풀이면 `kind: 'made'`, src는 '만든 풀이 · 확인됨' 또는 '만든 풀이 · 확인 전'
     3. 2등 유형이 있으면 그 MASTER를 끝에 하나 더 붙인다.
     4. 낱말이 하나도 맞지 않으면 빈 목록. 화면이 '못 찾았어요'를 보여 준다.
   - **원본 개수:** 원본(`uses`)이 많으면 모두 넣는다. 오른쪽 칸이 굴러간다. 1·2·3·4 키는 앞의 넷만 고른다. 파일의 `out.length < 4` 제한은 지운다.
   - **번호 모양:** 시험지의 소문항 번호가 (1)이 아니면 `MARK` 한 줄을 1단계에서 찾은 모양으로 바꾼다.
   - **준비 코드:** 그대로 둔다. 주제 글에서 파일 이름(한글 이름도 됨, .xlsx · .xls · .csv)을 찾아 xlsx면 `pd.read_excel`, csv면 `pd.read_csv` 줄을 만든다. 시트가 여럿인 파일이면 1단계 자료에 시트 이름을 적어 두고 `sheet_name=`을 붙인다.
   - **비슷한 기출:** 주제 글이 `rounds.json`의 어느 주제 글과 낱말이 많이 겹치면 `similar: { label: '2023년 2차 문제 1' }`, 아니면 `null`.
3. 찾기가 잘 맞는지 기출로 시험한다. 회차마다 시험지의 큰 문제 하나를 복사해 붙여 넣고, 소문항마다 맞는 유형이 나오는지 표로 사람에게 보여 준다. 틀리면 `words`를 고친다(화면 코드는 고치지 않는다).

## 하지 않는 것

- 관련도 점수나 순위 숫자를 화면에 보이지 않는다.
- 붙여 넣은 문제를 저장하지 않는다.

## 확인

- [ ] 기출 큰 문제를 붙여 넣으면 소문항마다 코드가 놓이고, 오른쪽 맨 위가 MASTER다
- [ ] 7개 회차에서 하나씩 붙여 넣어 맞는 유형이 나오는 비율을 표로 보여 줬다
- [ ] '전체 복사'한 코드를 모의시험 편집기에 붙여 넣고 그 문제의 xlsx로 돌리면 import 오류 없이 돈다
- [ ] 화면이 `shots/codefind-*`와 같은 모양이다
- [ ] `python design-kit/check.py hyds3-site`에 문제가 없다
