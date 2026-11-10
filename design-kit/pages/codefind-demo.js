/* codefind-demo.js — 코드 찾기 탭 동작 예시 (예시 페이지 전용, 내용은 지어낸 것)
   회사 사이트로 옮길 때:
   - splitProblem, buildSetup, buildBlock, buildDraft, copyText 는 그대로 옮겨 써도 된다.
   - findCodes 만 회사 사이트의 관련도 찾기로 바꾼다(아래 설명). FAKE 자료와 wordScore는 버린다.
   - 화면은 render()가 state를 보고 통째로 다시 그린다. class 이름은 design.css의 k- 부품이다. */
(function () {
  'use strict';
  var FAKE = {
 "probs": [
  {
   "name": "카페 판매",
   "theme": "동네 카페의 2025년 판매 기록이다(cafe_sales.csv). 열은 date(날짜), menu(메뉴), qty(판매량), weather(날씨: 맑음·흐림·비), temp(기온)이다.",
   "read": "df = pd.read_csv('cafe_sales.csv')",
   "similar": {
    "label": "3회 편의점 판매 데이터",
    "note": "주제와 소문항 순서가 비슷해요"
   },
   "qs": [
    {
     "n": "1",
     "text": "qty의 결측치를 menu별 중앙값으로 채우시오.",
     "cands": [
      {
       "src": "기출 풀이 · 2회 (1)",
       "kind": "past",
       "imp": [
        "import pandas as pd"
       ],
       "code": "df['qty'] = df['qty'].fillna(df.groupby('menu')['qty'].transform('median'))",
       "keys": [
        "결측",
        "중앙값"
       ]
      },
      {
       "src": "개념 자료 · 그룹별로 채우기",
       "kind": "note",
       "imp": [
        "import pandas as pd"
       ],
       "code": "df['qty'] = df.groupby('menu')['qty'].transform(lambda s: s.fillna(s.median()))",
       "keys": [
        "결측",
        "그룹"
       ]
      },
      {
       "src": "만든 풀이 · 확인 전",
       "kind": "made",
       "imp": [
        "import pandas as pd"
       ],
       "code": "med = df.groupby('menu')['qty'].median()\ndf['qty'] = df['qty'].fillna(df['menu'].map(med))",
       "keys": [
        "결측",
        "중앙값"
       ]
      }
     ]
    },
    {
     "n": "2",
     "text": "날짜·날씨별 판매량 합계를 구한 뒤, 하루 평균 판매량이 가장 큰 날씨를 쓰시오.",
     "cands": [
      {
       "src": "기출 풀이 · 3회 (2)",
       "kind": "past",
       "imp": [
        "import pandas as pd"
       ],
       "code": "daily = df.groupby(['date', 'weather'])['qty'].sum().reset_index()\navg = daily.groupby('weather')['qty'].mean()\nprint(avg.idxmax())",
       "keys": [
        "합계",
        "평균",
        "가장 큰"
       ]
      },
      {
       "src": "개념 자료 · 피벗 테이블",
       "kind": "note",
       "imp": [
        "import pandas as pd"
       ],
       "code": "pt = df.pivot_table(index='date', columns='weather', values='qty', aggfunc='sum')\nprint(pt.mean().idxmax())",
       "keys": [
        "평균",
        "피벗"
       ]
      }
     ]
    },
    {
     "n": "3",
     "text": "temp와 qty의 상관계수를 소수 셋째 자리까지 구하시오.",
     "cands": [
      {
       "src": "개념 자료 · 상관계수",
       "kind": "note",
       "imp": [],
       "code": "print(round(df['temp'].corr(df['qty']), 3))",
       "keys": [
        "상관"
       ]
      },
      {
       "src": "개념 자료 · 상관분석 검정",
       "kind": "note",
       "imp": [
        "from scipy import stats"
       ],
       "code": "r, p = stats.pearsonr(df['temp'], df['qty'])\nprint(round(r, 3))",
       "keys": [
        "상관",
        "검정"
       ]
      },
      {
       "src": "기출 풀이 · 1회 (3)",
       "kind": "past",
       "imp": [],
       "code": "print(df[['temp', 'qty']].corr().round(3))",
       "keys": [
        "상관"
       ]
      }
     ]
    },
    {
     "n": "4",
     "text": "비 오는 날과 맑은 날의 하루 판매량 평균이 다른지 t-검정하고 p값을 쓰시오.",
     "cands": [
      {
       "src": "MASTER · 두 집단 평균 비교",
       "kind": "master",
       "imp": [
        "from scipy import stats"
       ],
       "keys": [
        "t-검정",
        "t검정",
        "평균이 다른지"
       ],
       "code": "# 기출 3회 (4) · 2회 (5) · 개념 자료 2개를 합침\nrain = daily.loc[daily['weather'] == '비', 'qty']\nsun = daily.loc[daily['weather'] == '맑음', 'qty']\nt, p = stats.ttest_ind(rain, sun)                      # 기본\n# t, p = stats.ttest_ind(rain, sun, equal_var=False)  # 분산이 다를 때 (2회 (5))\n# u, p = stats.mannwhitneyu(rain, sun)                # 정규성이 없을 때\nprint(round(p, 4))"
      },
      {
       "src": "기출 풀이 · 3회 (4)",
       "kind": "past",
       "imp": [
        "from scipy import stats"
       ],
       "code": "rain = daily.loc[daily['weather'] == '비', 'qty']\nsun = daily.loc[daily['weather'] == '맑음', 'qty']\nt, p = stats.ttest_ind(rain, sun)\nprint(round(p, 4))",
       "keys": [
        "t-검정",
        "t검정",
        "평균이 다른지"
       ]
      },
      {
       "src": "개념 자료 · 분산이 다를 때",
       "kind": "note",
       "imp": [
        "from scipy import stats"
       ],
       "code": "rain = daily.loc[daily['weather'] == '비', 'qty']\nsun = daily.loc[daily['weather'] == '맑음', 'qty']\nt, p = stats.ttest_ind(rain, sun, equal_var=False)\nprint(round(p, 4))",
       "keys": [
        "t-검정",
        "분산"
       ]
      },
      {
       "src": "개념 자료 · 정규성이 없을 때",
       "kind": "note",
       "imp": [
        "from scipy import stats"
       ],
       "code": "rain = daily.loc[daily['weather'] == '비', 'qty']\nsun = daily.loc[daily['weather'] == '맑음', 'qty']\nu, p = stats.mannwhitneyu(rain, sun)\nprint(round(p, 4))",
       "keys": [
        "t-검정",
        "정규성"
       ]
      }
     ]
    },
    {
     "n": "5",
     "text": "temp와 weather로 qty를 예측하는 선형회귀 모델의 결정계수를 구하시오.",
     "cands": [
      {
       "src": "만든 풀이 · 확인 전",
       "kind": "made",
       "imp": [
        "import pandas as pd",
        "from sklearn.linear_model import LinearRegression"
       ],
       "code": "X = pd.get_dummies(df[['temp', 'weather']], drop_first=True)\nmodel = LinearRegression().fit(X, df['qty'])\nprint(round(model.score(X, df['qty']), 3))",
       "keys": [
        "선형회귀",
        "결정계수"
       ]
      },
      {
       "src": "개념 자료 · 회귀식으로 학습",
       "kind": "note",
       "imp": [
        "import statsmodels.formula.api as smf"
       ],
       "code": "res = smf.ols('qty ~ temp + C(weather)', data=df).fit()\nprint(round(res.rsquared, 3))",
       "keys": [
        "회귀",
        "결정계수"
       ]
      }
     ]
    },
    {
     "n": "6",
     "text": "날씨별 판매량을 지도 위에 표시하시오.",
     "cands": [],
     "miss": "개념 자료와 기출에 지도 그리기가 없어요. '그래프', 'plot'으로 바꿔 찾아 보세요."
    }
   ]
  },
  {
   "name": "자전거 대여",
   "read": "df = pd.read_csv('bike_rent.csv')",
   "similar": {
    "label": "4회 버스 승하차 데이터",
    "note": "날짜를 다루는 소문항이 같아요"
   },
   "theme": "공유 자전거 대여 기록이다(bike_rent.csv). 열은 date(날짜), station(대여소), hour(시각), rentals(대여 수), temp(기온), rain(강수량)이다.",
   "qs": [
    {
     "n": "1",
     "text": "date를 날짜형으로 바꾼 뒤 월별 대여 수 합계가 가장 큰 달을 쓰시오.",
     "cands": [
      {
       "src": "기출 풀이 · 4회 (1)",
       "kind": "past",
       "imp": [
        "import pandas as pd"
       ],
       "code": "df['date'] = pd.to_datetime(df['date'])\nmonthly = df.groupby(df['date'].dt.month)['rentals'].sum()\nprint(monthly.idxmax())",
       "keys": [
        "날짜형",
        "월별",
        "가장 큰"
       ]
      },
      {
       "src": "개념 자료 · 날짜 다루기",
       "kind": "note",
       "imp": [
        "import pandas as pd"
       ],
       "code": "df['month'] = pd.to_datetime(df['date']).dt.month\nprint(df.groupby('month')['rentals'].sum().idxmax())",
       "keys": [
        "날짜",
        "월별"
       ]
      }
     ]
    },
    {
     "n": "2",
     "text": "비가 온 날(rain > 0)과 오지 않은 날의 평균 대여 수 차이를 소수 둘째 자리까지 구하시오.",
     "cands": [
      {
       "src": "개념 자료 · 조건으로 나눠 평균",
       "kind": "note",
       "imp": [],
       "code": "wet = df.loc[df['rain'] > 0, 'rentals'].mean()\ndry = df.loc[df['rain'] == 0, 'rentals'].mean()\nprint(round(dry - wet, 2))",
       "keys": [
        "평균",
        "차이"
       ]
      }
     ]
    },
    {
     "n": "3",
     "text": "temp와 hour로 rentals를 예측하는 선형회귀 모델의 계수를 구하시오.",
     "cands": [
      {
       "src": "만든 풀이 · 확인 전",
       "kind": "made",
       "imp": [
        "from sklearn.linear_model import LinearRegression"
       ],
       "code": "model = LinearRegression().fit(df[['temp', 'hour']], df['rentals'])\nprint(model.coef_.round(3))",
       "keys": [
        "선형회귀",
        "계수"
       ]
      },
      {
       "src": "개념 자료 · 회귀식으로 학습",
       "kind": "note",
       "imp": [
        "import statsmodels.formula.api as smf"
       ],
       "code": "res = smf.ols('rentals ~ temp + hour', data=df).fit()\nprint(res.params.round(3))",
       "keys": [
        "회귀",
        "계수"
       ]
      }
     ]
    },
    {
     "n": "4",
     "text": "대여소별 대여 수 합계 상위 3곳을 쓰시오.",
     "cands": [
      {
       "src": "기출 풀이 · 2회 (2)",
       "kind": "past",
       "imp": [],
       "code": "print(df.groupby('station')['rentals'].sum().nlargest(3))",
       "keys": [
        "상위",
        "합계"
       ]
      },
      {
       "src": "개념 자료 · 정렬해서 자르기",
       "kind": "note",
       "imp": [],
       "code": "s = df.groupby('station')['rentals'].sum()\nprint(s.sort_values(ascending=False).head(3))",
       "keys": [
        "상위",
        "정렬"
       ]
      }
     ]
    }
   ]
  },
  {
   "name": "도서관 대출",
   "read": "df = pd.read_csv('library_loans.csv')",
   "similar": null,
   "theme": "구립 도서관의 대출 기록이다(library_loans.csv). 열은 member(회원), age_group(연령대), genre(장르), days(대출 일수), late(연체 여부: 0·1)이다.",
   "qs": [
    {
     "n": "1",
     "text": "연령대별 연체 비율을 소수 셋째 자리까지 구하시오.",
     "cands": [
      {
       "src": "기출 풀이 · 1회 (2)",
       "kind": "past",
       "imp": [],
       "code": "rate = df.groupby('age_group')['late'].mean()\nprint(rate.round(3))",
       "keys": [
        "비율"
       ]
      },
      {
       "src": "개념 자료 · 범주별 비율",
       "kind": "note",
       "imp": [
        "import pandas as pd"
       ],
       "code": "ct = pd.crosstab(df['age_group'], df['late'], normalize='index')\nprint(ct[1].round(3))",
       "keys": [
        "비율",
        "교차표"
       ]
      }
     ]
    },
    {
     "n": "2",
     "text": "연령대와 장르가 서로 독립인지 카이제곱 검정을 하고 p값을 쓰시오.",
     "cands": [
      {
       "src": "기출 풀이 · 3회 (5)",
       "kind": "past",
       "imp": [
        "import pandas as pd",
        "from scipy import stats"
       ],
       "code": "ct = pd.crosstab(df['age_group'], df['genre'])\nchi2, p, dof, exp = stats.chi2_contingency(ct)\nprint(round(p, 4))",
       "keys": [
        "카이제곱",
        "독립"
       ]
      }
     ]
    },
    {
     "n": "3",
     "text": "대출 일수의 이상치 개수를 IQR 기준으로 구하시오.",
     "cands": [
      {
       "src": "개념 자료 · IQR 이상치",
       "kind": "note",
       "imp": [],
       "code": "q1, q3 = df['days'].quantile([0.25, 0.75])\niqr = q3 - q1\nout = df[(df['days'] < q1 - 1.5 * iqr) | (df['days'] > q3 + 1.5 * iqr)]\nprint(len(out))",
       "keys": [
        "이상치",
        "IQR"
       ]
      },
      {
       "src": "만든 풀이 · 확인 전",
       "kind": "made",
       "imp": [],
       "code": "q1, q3 = df['days'].quantile([0.25, 0.75])\nlo, hi = q1 - 1.5 * (q3 - q1), q3 + 1.5 * (q3 - q1)\nprint(((df['days'] < lo) | (df['days'] > hi)).sum())",
       "keys": [
        "이상치"
       ]
      }
     ]
    }
   ]
  },
  {
   "name": "아파트 전기",
   "read": "df = pd.read_csv('apt_power.csv')",
   "similar": null,
   "theme": "아파트 세대별 월 전기 사용량이다(apt_power.csv). 열은 apt(세대), month(월), kwh(사용량), people(세대원 수), area(면적)이다.",
   "qs": [
    {
     "n": "1",
     "text": "세대원 수별 월평균 사용량을 소수 첫째 자리까지 구하시오.",
     "cands": [
      {
       "src": "개념 자료 · 그룹별 평균",
       "kind": "note",
       "imp": [],
       "code": "print(df.groupby('people')['kwh'].mean().round(1))",
       "keys": [
        "평균"
       ]
      }
     ]
    },
    {
     "n": "2",
     "text": "area와 kwh를 표준화한 뒤 KMeans로 세 군집으로 나누고 군집별 세대 수를 쓰시오.",
     "cands": [
      {
       "src": "만든 풀이 · 확인 전",
       "kind": "made",
       "imp": [
        "import pandas as pd",
        "from sklearn.preprocessing import StandardScaler",
        "from sklearn.cluster import KMeans"
       ],
       "code": "X = StandardScaler().fit_transform(df[['area', 'kwh']])\nkm = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)\nprint(pd.Series(km.labels_).value_counts())",
       "keys": [
        "군집",
        "KMeans",
        "표준화"
       ]
      }
     ]
    },
    {
     "n": "3",
     "text": "세대별 사용량 추이를 선 그래프로 그려 그림 파일로 저장하시오.",
     "cands": [],
     "miss": "개념 자료와 기출에 그림 저장이 없어요. '시각화', 'plot'으로 바꿔 찾아 보세요."
    }
   ]
  }
 ],
 "extra": [
  {
   "src": "개념 자료 · 학습·평가 나누기",
   "kind": "note",
   "imp": [
    "from sklearn.model_selection import train_test_split"
   ],
   "code": "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)",
   "keys": [
    "나누",
    "분할",
    "평가용"
   ]
  },
  {
   "src": "개념 자료 · 로지스틱 회귀",
   "kind": "note",
   "imp": [
    "from sklearn.linear_model import LogisticRegression"
   ],
   "code": "model = LogisticRegression(max_iter=1000).fit(X_train, y_train)\nprint(round(model.score(X_test, y_test), 3))",
   "keys": [
    "로지스틱",
    "분류"
   ]
  },
  {
   "src": "개념 자료 · 분류 정확도",
   "kind": "note",
   "imp": [
    "from sklearn.metrics import accuracy_score"
   ],
   "code": "pred = model.predict(X_test)\nprint(round(accuracy_score(y_test, pred), 3))",
   "keys": [
    "정확도"
   ]
  },
  {
   "src": "개념 자료 · 분산분석",
   "kind": "note",
   "imp": [
    "from scipy import stats"
   ],
   "code": "groups = [g['y'].values for _, g in df.groupby('group')]\nf, p = stats.f_oneway(*groups)\nprint(round(p, 4))",
   "keys": [
    "분산분석",
    "ANOVA",
    "세 집단"
   ]
  },
  {
   "src": "개념 자료 · 정규성 검정",
   "kind": "note",
   "imp": [
    "from scipy import stats"
   ],
   "code": "w, p = stats.shapiro(df['x'])\nprint(round(p, 4))",
   "keys": [
    "정규성",
    "샤피로"
   ]
  },
  {
   "src": "개념 자료 · 더미 변수",
   "kind": "note",
   "imp": [
    "import pandas as pd"
   ],
   "code": "df = pd.get_dummies(df, columns=['col'], drop_first=True)",
   "keys": [
    "더미",
    "원핫",
    "범주형"
   ]
  }
 ]
};

  // ---------- 1. 소문항 나누기: 첫 (1) 앞은 주제 글, (n)부터 다음 (n) 앞까지가 소문항 ----------
  // (1) 1) ① 1. 같은 번호를 쓰는 사이트면 MARK만 바꾼다. 번호가 없으면 null → 글 고치기 화면으로 연다
  var MARK = /\((\d{1,2})\)/g;
  function clean(t) { return t.replace(/\s+/g, ' ').trim(); }
  function splitProblem(text) {
    var s = text.replace(/\r/g, ''), marks = [], m; MARK.lastIndex = 0;
    while ((m = MARK.exec(s))) marks.push({ n: m[1], at: m.index, end: MARK.lastIndex });
    if (!marks.length) return null;
    var qs = marks.map(function (mk, i) { return { n: mk.n, text: clean(s.slice(mk.end, i + 1 < marks.length ? marks[i + 1].at : s.length)) }; })
      .filter(function (q) { return q.text; });
    return qs.length ? { theme: clean(s.slice(0, marks[0].at)), qs: qs } : null;
  }

  // ---------- 2. 소문항마다 찾기 ----------
  // 회사 사이트: 이미 있는 관련도 찾기에 (소문항 글 + 주제 글의 핵심 낱말)을 넣고, 돌려받은 코드 목록을
  // { src: '기출 풀이 · 3회 (4)', kind: 'past'|'note'|'made', imp: ['from scipy import stats'], code: '...' } 모양으로 바꿔 돌려준다.
  // 순서: 그 주제의 MASTER 코드(master)가 맨 위, 그 아래 기출 풀이 원본(past), 만든 풀이(made) 순. 최대 4개.
  var ORDER = { master: -1, past: 0, note: 1, made: 2 };
  var POOL = [];
  FAKE.probs.forEach(function (p) { p.qs.forEach(function (q) { q.cands.forEach(function (c) { POOL.push(c); }); }); });
  FAKE.extra.forEach(function (c) { POOL.push(c); });
  function wordScore(text, c) { var t = text.toLowerCase(); return (c.keys || []).filter(function (w) { return t.indexOf(w.toLowerCase()) >= 0; }).length; }
  function findCodes(subText, themeText) {
    var seen = {}, out = [];
    POOL.map(function (c, k) { return { c: c, k: k, s: wordScore(subText, c) }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s || ORDER[a.c.kind] - ORDER[b.c.kind] || a.k - b.k; })
      .forEach(function (r) { if (out.length < 4 && !seen[r.c.code]) { seen[r.c.code] = 1; out.push(r.c); } });
    return out;
  }
  var MISS = "개념 자료와 기출에서 맞는 코드를 못 찾았어요. 다른 낱말로 글을 고쳐 다시 찾아 보세요.";

  // 문제 하나 = { name, theme, read, similar, qs: [{ n, text, cands, miss }], choice: [고른 후보 번호], sel: 고른 소문항 }
  // old를 주면(글 고치기) 그대로인 소문항은 찾은 코드와 고른 번호를 그대로 둔다
  function makeProblem(theme, qs, old) {
    // 파일 이름: 한글·영문 모두, .csv · .xlsx · .xls. 엑셀이면 read_excel
    var file = (theme.match(/[^\s'"()\[\]<>,]+\.(?:csv|xlsx?)/i) || [''])[0], same = !!old && old.theme === theme, xl = /\.xlsx?$/i.test(file);
    var rows = qs.map(function (q) {
      var k = old ? old.qs.map(function (o) { return o.text; }).indexOf(q.text) : -1;
      if (k >= 0) return { q: Object.assign({}, old.qs[k], { n: q.n }), pick: old.choice[k] };
      var cands = findCodes(q.text, theme);
      return { q: { n: q.n, text: q.text, cands: cands, miss: cands.length ? '' : MISS }, pick: 0 };
    });
    return { name: same ? old.name : (file ? file.replace(/\.(?:csv|xlsx?)$/i, '') : theme.slice(0, 10) || '새 문제'), theme: theme,
      read: same ? old.read : 'df = pd.' + (xl ? 'read_excel' : 'read_csv') + "('" + (file || 'data.xlsx') + "')", similar: same ? old.similar : null,
      qs: rows.map(function (r) { return r.q; }), choice: rows.map(function (r) { return r.pick; }), sel: 0 };
  }

  // ---------- 3. 초안 모으기: 준비 코드(import + 데이터 읽기) → 소문항마다 # (n) 주석 + 고른 코드 ----------
  function buildSetup(p) {
    var out = ['import pandas as pd'];
    p.qs.forEach(function (q, i) { var c = q.cands[p.choice[i]]; if (c) c.imp.forEach(function (l) { if (out.indexOf(l) < 0) out.push(l); }); });
    var imp = out.filter(function (l) { return l.indexOf('import') === 0; }), frm = out.filter(function (l) { return l.indexOf('from') === 0; });
    return imp.concat(frm).join('\n') + '\n\n' + p.read;
  }
  function buildBlock(p, i) { var q = p.qs[i], c = q.cands[p.choice[i]]; return '# (' + q.n + ') ' + q.text + '\n' + (c ? c.code : '# 못 찾았어요'); }
  function buildDraft(p) { return [buildSetup(p)].concat(p.qs.map(function (q, i) { return buildBlock(p, i); })).join('\n\n') + '\n'; }

  // ---------- 4. 복사: 사내 주소(http)나 파일로 열어도 되게 예전 방식으로도 한 번 더 ----------
  function copyOld(text) {
    var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) { /* 복사를 막은 브라우저 */ } document.body.removeChild(ta);
  }
  function copyText(text) {
    // 새 방식이 안 되거나(권한·주소) 거절되면 예전 방식으로 한 번 더
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).catch(function () { copyOld(text); }); return; }
    copyOld(text);
  }

  // ---------- 화면 상태 ----------
  // cur: 보고 있는 문제(-1이면 붙여 넣는 화면), mode: 'result' | 'edit', draft: 글 고치기 중인 글
  var state = { probs: [], cur: -1, mode: 'result', draft: null, copied: '' };
  function prep(p) { return Object.assign({}, p, { choice: p.qs.map(function () { return 0; }), sel: 0 }); }
  if (location.hash === '#result' || location.hash === '#edit') {
    state.probs = FAKE.probs.map(prep); state.cur = 0; state.probs[0].sel = 3;
    if (location.hash === '#edit') { state.mode = 'edit'; state.draft = draftOf(state.probs[0], false); }
  }
  function draftOf(p, isNew) { return { theme: p ? p.theme : '', qs: p ? p.qs.map(function (q) { return q.text; }) : ['', '', ''], isNew: !!isNew }; }
  function cur() { return state.cur >= 0 ? state.probs[state.cur] : null; }

  function addProblem(text) {
    var r = splitProblem(text);
    if (!r) {   // 번호가 없으면 글 고치기로
      state.probs.push({ name: '새 문제', theme: '', read: '', similar: null, qs: [], choice: [], sel: 0 });
      state.cur = state.probs.length - 1; state.mode = 'edit'; state.draft = { theme: clean(text), qs: [''], isNew: true }; render(); return;
    }
    state.probs.push(makeProblem(r.theme, r.qs, null)); state.cur = state.probs.length - 1; state.mode = 'result'; state.draft = null; render();
  }
  function refind() {
    var d = state.draft; if (!d) return;
    var qs = d.qs.map(clean).filter(Boolean).map(function (t, i) { return { n: String(i + 1), text: t }; }); if (!qs.length) return;
    state.probs[state.cur] = makeProblem(clean(d.theme), qs, d.isNew ? null : cur()); state.mode = 'result'; state.draft = null; render();
  }
  function cancel() {
    if (state.draft && state.draft.isNew) { state.probs.splice(state.cur, 1); state.cur = -1; }
    state.mode = 'result'; state.draft = null; render();
  }
  function choose(i, k) { var p = cur(); if (!p || !p.qs[i] || !p.qs[i].cands[k]) return; p.choice[i] = k; p.sel = i; render(); }
  // 복사한 단추는 잠깐 '복사했어요'(초록) 모양이 된다. key: 'all' 또는 'q' + 소문항 번호
  function copied(key, msg, text) { copyText(text); state.copied = key; render(); if (window.kDesign) kDesign.toast(msg); clearTimeout(copied.t); copied.t = setTimeout(function () { state.copied = ''; render(); }, 1600); }

  // ---------- 그리기 ----------
  var ROOT = document.getElementById('cf');
  var COPY = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.8"/><path d="M10.5 3.5v-.3A1.7 1.7 0 0 0 8.8 1.5H3.2A1.7 1.7 0 0 0 1.5 3.2v5.6a1.7 1.7 0 0 0 1.7 1.7h.3"/></svg>';
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function pre(code, attrs) { return '<pre class="k-code" data-k-hl' + (attrs || '') + '>' + esc(code) + '</pre>'; }
  function src(c, onCode) { return '<small class="' + (onCode ? 'k-src-code' : 'k-src') + ' is-' + c.kind + '">' + esc(c.src) + '</small>'; }

  function topHTML() {
    var p = cur(), tabs = state.probs.map(function (x, i) {
      var miss = x.qs.filter(function (q) { return !q.cands.length; }).length;
      return '<button type="button" role="tab" class="k-ptab" data-act="tab" data-i="' + i + '" aria-selected="' + (i === state.cur) + '"><b>문제 ' + (i + 1) + '</b><span class="k-ptab-name">' + esc(x.name) + '</span>' +
        (miss ? '<small>못 찾음 ' + miss + '</small>' : '') + '</button>';
    }).join('');
    var btns = state.mode === 'edit'
      ? '<button type="button" class="k-btn" data-act="cancel">취소</button><button type="button" class="k-btn k-btn-primary" data-act="refind"' + (state.draft.qs.some(function (t) { return t.trim(); }) ? '' : ' disabled') + '>다시 찾기</button>'
      : p ? '<button type="button" class="k-btn" data-act="edit">글 고치기</button>' + (state.copied === 'all'
        ? '<button type="button" class="k-btn k-btn-done" data-act="copy-all">복사했어요</button>' : '<button type="button" class="k-btn k-btn-primary" data-act="copy-all">전체 복사</button>') : '';
    return '<div class="k-top"><h1 class="k-title">코드 찾기</h1>' +
      (state.probs.length ? '<div class="k-ptabs" role="tablist" aria-label="붙여 넣은 문제">' + tabs + '</div><button type="button" class="k-ptab k-ptab-new" data-act="new" aria-pressed="' + (state.cur < 0) + '">새 문제</button>' : '') +
      '<span class="k-grow"></span>' + btns + '</div>';
  }
  function resultHTML(p) {
    var rows = '<div class="k-qrow is-still"><div><p class="k-theme-t">' + esc(p.theme) + '</p>' +
      (p.similar ? '<p class="k-similar">비슷한 기출 <b>' + esc(p.similar.label) + '</b><button type="button" class="k-link" data-act="similar">이 풀이로 보기</button></p>' : '') +
      '</div><div class="k-qcard">' + pre(buildSetup(p)) + '</div></div>';
    p.qs.forEach(function (q, i) {
      var c = q.cands[p.choice[i]];
      rows += '<div class="k-qrow' + (p.sel === i ? ' is-sel' : '') + '" data-act="pick" data-i="' + i + '"><button type="button" class="k-qrow-q" aria-pressed="' + (p.sel === i) + '"><b>(' + esc(q.n) + ')</b><span>' + esc(q.text) +
        (c ? src(c) : '<small class="k-src is-miss">못 찾았어요</small>') + '</span></button>' +
        (c ? '<div class="k-qcard"><button type="button" class="k-icon k-icon-code' + (state.copied === 'q' + i ? ' is-ok' : '') + '" data-act="copy-one" data-i="' + i + '" aria-label="(' + esc(q.n) + ') 코드 복사" title="이 소문항 코드 복사">' + COPY + '</button>' + pre(c.code) + '</div>'
          : '<div class="k-qcard"><p class="k-qmiss">' + esc(q.miss || MISS) + '</p></div>') + '</div>';
    });
    var i = Math.min(p.sel, p.qs.length - 1), q = p.qs[i], side = '<p class="k-side-q"><b>(' + esc(q.n) + ')</b>' + esc(q.text) + '</p>';
    if (q.cands.length) {
      side += '<p class="k-side-cap">코드 ' + q.cands.length + '개, 누르면 이 소문항 코드가 바뀌어요</p><div class="k-cands" role="listbox" aria-label="(' + esc(q.n) + ') 코드">' +
        q.cands.map(function (c, k) {
          var on = k === p.choice[i];
          return '<button type="button" role="option" class="k-cand" data-act="choose" data-k="' + k + '" aria-selected="' + on + '"><span class="k-cand-top">' + src(c, true) +
            (on ? '<span class="k-cand-use">고른 코드</span>' : '') + '<span class="k-kbd">' + (k + 1) + '</span></span>' + pre(c.code, ' data-k-lines') + '</button>';
        }).join('') + '</div><div class="k-side-foot"><span class="k-sub">위·아래 키로 소문항, 숫자 키로 코드를 골라요</span><button type="button" class="k-btn" data-act="copy-one" data-i="' + i + '">이 코드 복사</button></div>';
    } else side += '<p class="k-side-p">' + esc(q.miss || MISS) + '</p><p class="k-side-p"><button type="button" class="k-link" data-act="edit">글 고치기</button></p>';
    return '<div class="k-find"><section class="k-qrows" aria-label="소문항별 코드">' + rows + '</section><aside class="k-side" aria-label="고른 소문항의 코드">' + side + '</aside></div>';
  }
  function blankHTML() {
    var ghost = [['1', '첫 소문항', '기출 풀이 · 몇 회 몇 번', 'past', '# 기출에서 가장 맞는 코드'], ['2', '둘째 소문항', '개념 자료 · 주제 이름', 'note', '# 개념 자료의 코드'],
      ['3', '셋째 소문항', '만든 풀이 · 확인 전', 'made', '# 기출을 풀어 만든 코드'], ['4', '넷째 소문항', '못 찾았어요', 'miss', '']];
    var rows = '<div class="k-qrow is-still is-ghost"><div class="k-qrow-q is-wide"><span>주제 글</span></div><div class="k-qcard">' + pre("import pandas as pd\n\ndf = pd.read_csv('주제 글의 파일.csv')") + '</div></div>' +
      ghost.map(function (g) {
        return '<div class="k-qrow is-still is-ghost"><div class="k-qrow-q"><b>(' + g[0] + ')</b><span>' + g[1] + '<small class="k-src is-' + g[3] + '">' + g[2] + '</small></span></div><div class="k-qcard">' +
          (g[4] ? pre(g[4]) : '<p class="k-qmiss">' + MISS.split('.')[0] + '.</p>') + '</div></div>';
      }).join('');
    var cand = function (kind, label, on, key, code) { return '<div class="k-cand' + (on ? ' is-on' : '') + '"><span class="k-cand-top"><small class="k-src-code is-' + kind + '">' + label + '</small>' + (on ? '<span class="k-cand-use">고른 코드</span>' : '') + '<span class="k-kbd">' + key + '</span></span>' + pre(code, ' data-k-lines') + '</div>'; };
    return '<div class="k-find"><section class="k-qrows" aria-label="시험 문제 붙여 넣기"><div class="k-box-wrap"><textarea class="k-box" aria-label="시험 문제" placeholder="시험 문제"></textarea></div><div aria-hidden="true">' + rows + '</div></section>' +
      '<aside class="k-side" aria-hidden="true"><p class="k-side-q"><b>(1)</b>첫 소문항</p><p class="k-side-cap">코드 3개</p><div class="k-cands">' +
      cand('past', '기출 풀이', true, 1, '# 가장 맞는 코드') + cand('note', '개념 자료', false, 2, '# 같은 일을 하는 다른 코드') + cand('made', '만든 풀이 · 확인 전', false, 3, '# 기출을 풀어 만든 코드') + '</div></aside></div>';
  }
  function editHTML() {
    var d = state.draft;
    return '<div class="k-find"><section class="k-edit" aria-label="글 고치기"><label class="k-field-l">주제 글<textarea class="k-field k-field-3" data-field="theme" placeholder="데이터 설명. 파일 이름(.csv)이 있으면 읽는 줄을 만들어요">' + esc(d.theme) + '</textarea></label>' +
      d.qs.map(function (t, i) { return '<div class="k-field-q"><b>(' + (i + 1) + ')</b><textarea class="k-field" data-q="' + i + '" aria-label="소문항 ' + (i + 1) + '" placeholder="소문항을 적어요">' + esc(t) + '</textarea></div>'; }).join('') +
      '<button type="button" class="k-btn k-add-q" data-act="add-q">소문항 추가</button></section>' +
      '<aside class="k-side" aria-label="글 고치기 안내"><p class="k-side-q">소문항이 잘못 나뉘었으면 여기서 고쳐요</p><p class="k-side-p">소문항마다 한 칸씩 적어요. 비운 칸은 빠져요.</p>' +
      '<p class="k-side-p">다시 찾기를 누르면 바뀐 소문항만 새로 찾고, 그대로인 소문항은 고른 코드를 그대로 둬요. <span class="k-kbd">Ctrl+Enter</span>로도 돼요.</p></aside></div>';
  }
  function render() {
    var keep = ROOT.querySelector('.k-qrows'), top = keep ? keep.scrollTop : 0, p = cur();
    ROOT.innerHTML = topHTML() + (state.mode === 'edit' ? editHTML() : p ? resultHTML(p) : blankHTML());
    if (window.kDesign) { kDesign.paint(ROOT); kDesign.thumbs(); }
    var rows = ROOT.querySelector('.k-qrows'); if (rows && p) rows.scrollTop = top;
    var tab = ROOT.querySelector('.k-ptab[aria-selected="true"]'); if (tab) tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });   // 탭이 많아도 고른 탭이 보이게
    if (!p && state.mode !== 'edit') { var b = ROOT.querySelector('.k-box'); if (b) b.focus({ preventScroll: true }); }
  }

  // ---------- 손과 키 ----------
  function typing(t) { return t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT' || t.isContentEditable); }
  ROOT.addEventListener('click', function (e) {
    var a = e.target.closest('[data-act]'); if (!a) return;
    var act = a.getAttribute('data-act'), i = parseInt(a.getAttribute('data-i'), 10), p = cur();
    if (act === 'tab') { if (state.mode !== 'edit') { state.cur = i; render(); } }
    else if (act === 'new') { if (state.mode !== 'edit') { state.cur = -1; render(); } }
    else if (act === 'pick') { if (p.sel !== i) { p.sel = i; render(); } }
    else if (act === 'choose') choose(p.sel, parseInt(a.getAttribute('data-k'), 10));
    else if (act === 'copy-one') { e.stopPropagation(); copied('q' + i, '(' + p.qs[i].n + ') 코드를 복사했어요', buildBlock(p, i)); }
    else if (act === 'copy-all') copied('all', '초안 전체를 복사했어요', buildDraft(p));
    else if (act === 'edit') { state.mode = 'edit'; state.draft = draftOf(p, false); render(); }
    else if (act === 'cancel') cancel();
    else if (act === 'refind') refind();
    else if (act === 'add-q') { state.draft.qs.push(''); render(); }
    else if (act === 'similar') { p.qs.forEach(function (q, k) { var j = q.cands.map(function (c) { return c.kind; }).indexOf('past'); if (j >= 0) p.choice[k] = j; }); render(); kDesign.toast('기출 풀이로 바꿨어요'); }
  });
  ROOT.addEventListener('input', function (e) {   // 글 고치기 칸은 다시 그리지 않고 글만 받아 둔다(커서가 안 튀게)
    var t = e.target; if (!state.draft) return;
    if (t.hasAttribute('data-field')) state.draft.theme = t.value;
    if (t.hasAttribute('data-q')) state.draft.qs[+t.getAttribute('data-q')] = t.value;
    var b = ROOT.querySelector('[data-act="refind"]'); if (b) b.disabled = !state.draft.qs.some(function (x) { return x.trim(); });
  });
  document.addEventListener('paste', function (e) {   // 붙여 넣는 칸에서, 또는 입력 칸 밖에서 Ctrl+V → 바로 찾기
    var t = e.target, box = t && t.classList && t.classList.contains('k-box');
    if (state.mode === 'edit' || (typing(t) && !box)) return;
    var text = e.clipboardData ? e.clipboardData.getData('text') : ''; if (!text.trim()) return;
    e.preventDefault(); addProblem(text);
  });
  document.addEventListener('keydown', function (e) {
    var t = e.target, p = cur();
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (state.mode === 'edit') { e.preventDefault(); refind(); return; }
      if (t && t.classList && t.classList.contains('k-box') && t.value.trim()) { e.preventDefault(); addProblem(t.value); }
      return;
    }
    if (state.mode === 'edit' || typing(t) || e.ctrlKey || e.metaKey || e.altKey || !p) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {   // 키로 고를 때는 움직임 없이 바로
      e.preventDefault(); p.sel = Math.max(0, Math.min(p.qs.length - 1, p.sel + (e.key === 'ArrowDown' ? 1 : -1))); render();
      var sel = ROOT.querySelector('.k-qrow.is-sel'); if (sel) sel.scrollIntoView({ block: 'nearest' }); return;
    }
    var k = { '1': 0, '2': 1, '3': 2, '4': 3 }[e.key]; if (k !== undefined) choose(p.sel, k);
  });
  render();
})();
