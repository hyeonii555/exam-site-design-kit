#!/usr/bin/env python3
"""디자인 키트 점검 도구 (파이썬 표준 라이브러리만 씀)

  python check.py --baseline <사이트 폴더>   처음 한 번: 지금 상태를 <사이트 폴더>/.k-check.json에 적어 둔다
  python check.py <사이트 폴더>              바꾼 뒤마다 점검한다
  python check.py --selftest                 이 도구가 잘 도는지 스스로 시험한다

점검하는 것
  1. 사이트에 넣은 design.css · design.js가 키트 원본과 같은지
  2. 새 인터넷 주소(http, https)가 생겼는지
  3. 키트에 없는 새 색 값이 생겼는지
  4. 기록 저장 이름(localStorage · sessionStorage 키)이 사라지거나 새로 생겼는지
  5. 키트에 없는 k- 이름(오타)을 썼는지
  6. 글꼴을 따로 정했는지(font-family · font: 를 키트 값 var(--k-f-…) 말고 쓴 곳, !important)
문제가 있으면 끝 상태 코드가 1이다.
"""
import argparse
import hashlib
import json
import os
import re
import shutil
import sys
import tempfile
import time

KIT = os.path.dirname(os.path.abspath(__file__))
KIT_FILES = {'design.css': os.path.join(KIT, 'css', 'design.css'), 'design.js': os.path.join(KIT, 'js', 'design.js')}
BASE_NAME = '.k-check.json'
TEXT_EXT = {'.html', '.htm', '.css', '.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.json', '.py'}
MARKUP_EXT = {'.html', '.htm', '.vue', '.svelte'}
SKIP_DIRS = {'.git', 'node_modules', '__pycache__', '.venv', 'venv', 'design-kit'}
MAX_BYTES = 5000000   # 이보다 큰 파일(브라우저 파이썬 묶음 등)은 읽지 않는다

URL_RE = re.compile(r"https?://[^\s'\"<>()\\`]+")
HEX_RE = re.compile(r"(?<![\w&#])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-zA-Z_-])")
QHEX_RE = re.compile(r"['\"`]\s*(#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4}))(?![0-9a-zA-Z_-])")
FUNC_RE = re.compile(r"\b(?:rgba?|hsla?)\(\s*[0-9.%,\s/+-]+\)", re.I)
STORE_RES = [re.compile(r"(?:localStorage|sessionStorage)\s*\.\s*(?:getItem|setItem|removeItem)\(\s*['\"`]([^'\"`]+)['\"`]"),
             re.compile(r"(?:localStorage|sessionStorage)\s*\[\s*['\"]([^'\"]+)['\"]\s*\]")]
CLASS_RES = [re.compile(r"\bclass(?:Name)?\s*=\s*\\?[\"']([^\"'\\]*)"), re.compile(r"\bclassName\s*=\s*['\"]([^'\"]+)['\"]"),
             re.compile(r"classList\.(?:add|remove|toggle|contains)\(\s*['\"]([^'\"]+)['\"]")]
K_NAME_RE = re.compile(r"(?<![\w-])(k-[a-z0-9][a-z0-9-]*)")
FONT_RE = re.compile(r"(?<![\w-])(?:font-family|font)\s*:\s*([^;}{\"'\n]+)", re.I)
IMPORTANT_RE = re.compile(r"!\s*important", re.I)
STYLE_BLOCK_RE = re.compile(r"<style[^>]*>(.*?)</style>", re.S | re.I)
STYLE_ATTR_RE = re.compile(r"\bstyle\s*=\s*(?:\"([^\"]*)\"|'([^']*)')", re.I)


def sha(path):
    with open(path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()


def norm_color(c):
    c = c.strip().lower().replace(' ', '')
    if c.startswith('#') and len(c) in (4, 5):
        c = '#' + ''.join(ch * 2 for ch in c[1:])
    return re.sub(r'(?<![\d.])0\.(\d)', r'.\1', c)


def line_of(text, pos):
    return text.count('\n', 0, pos) + 1


def colors_in(text, ext):
    """(색, 위치) 목록. CSS는 전부, HTML은 <style>과 style=""만, JS는 따옴표 안의 #색과 rgb()·hsl()만 본다."""
    out = []
    if ext == '.css':
        parts = [(0, text)]
    elif ext in MARKUP_EXT:
        parts = [(m.start(1), m.group(1)) for m in STYLE_BLOCK_RE.finditer(text)]
        parts += [(m.start(1) if m.group(1) is not None else m.start(2), m.group(1) or m.group(2) or '') for m in STYLE_ATTR_RE.finditer(text)]
    else:
        out += [(m.group(1), m.start(1)) for m in QHEX_RE.finditer(text)]
        out += [(m.group(0), m.start()) for m in FUNC_RE.finditer(text)]
        return out
    for off, part in parts:
        out += [(m.group(0), off + m.start()) for m in HEX_RE.finditer(part)]
        out += [(m.group(0), off + m.start()) for m in FUNC_RE.finditer(part)]
    return out


def kit_palette():
    with open(KIT_FILES['design.css'], encoding='utf-8') as f:
        css = f.read()
    return {norm_color(c) for c, _ in colors_in(css, '.css')}


def kit_names():
    with open(KIT_FILES['design.css'], encoding='utf-8') as f:
        css = f.read()
    return set(re.findall(r"\.(k-[a-z0-9][a-z0-9-]*)", css))


def scan(site):
    """사이트를 훑어 주소·색·기록 저장 이름·k- 이름과 그 위치, 사이트 안의 키트 파일을 모은다."""
    kit_hash = {name: sha(p) for name, p in KIT_FILES.items()}
    found = {'urls': {}, 'colors': {}, 'keys': {}, 'knames': {}, 'kitcopies': [], 'fonts': {}}
    for root, dirs, files in os.walk(site):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for fn in files:
            path = os.path.join(root, fn)
            rel = os.path.relpath(path, site).replace(os.sep, '/')
            ext = os.path.splitext(fn)[1].lower()
            if fn == BASE_NAME or ext not in TEXT_EXT:
                continue
            if fn in KIT_FILES:
                found['kitcopies'].append((rel, sha(path) == kit_hash[fn]))
            if os.path.getsize(path) > MAX_BYTES:
                continue
            if fn in KIT_FILES and sha(path) == kit_hash[fn]:
                continue   # 키트 원본 그대로인 파일은 안을 보지 않는다
            with open(path, encoding='utf-8', errors='replace') as f:
                text = f.read()
            for m in URL_RE.finditer(text):
                found['urls'].setdefault(m.group(0).rstrip('.,;'), '%s:%d' % (rel, line_of(text, m.start())))
            for c, pos in colors_in(text, ext):
                found['colors'].setdefault(norm_color(c), '%s:%d' % (rel, line_of(text, pos)))
            if ext == '.css':
                font_parts = [(0, text)]
            elif ext in MARKUP_EXT:
                font_parts = [(m.start(1), m.group(1)) for m in STYLE_BLOCK_RE.finditer(text)] + [(m.start(0), m.group(0)) for m in STYLE_ATTR_RE.finditer(text)]
            else:
                font_parts = [(0, text)]   # JS에서 style.font… 나 편집기 설정(fontFamily)도 본다
            for off, part in font_parts:
                for m in FONT_RE.finditer(part):
                    v = m.group(1).strip()
                    if 'var(--k-f-' not in v and v not in ('inherit', 'unset', 'initial'):
                        v0 = m.group(0).strip()[:80]; found['fonts'].setdefault(('%s:%d' % (rel, line_of(text, off + m.start())), v0), v0)
                for m in IMPORTANT_RE.finditer(part):
                    found['fonts'].setdefault(('%s:%d' % (rel, line_of(text, off + m.start())), '!important'), '!important')
            if ext != '.css':
                for m in re.finditer(r"fontFamily\s*[:=]\s*['\"]([^'\"]+)", text):
                    v0 = m.group(0)[:80]; found['fonts'].setdefault(('%s:%d' % (rel, line_of(text, m.start())), v0), v0)
            for rx in STORE_RES:
                for m in rx.finditer(text):
                    found['keys'].setdefault(m.group(1), '%s:%d' % (rel, line_of(text, m.start())))
            if ext != '.css':
                for rx in CLASS_RES:
                    for m in rx.finditer(text):
                        for k in K_NAME_RE.findall(m.group(1)):
                            if not k.endswith('-'):
                                found['knames'].setdefault(k, '%s:%d' % (rel, line_of(text, m.start())))
    return found


def make_baseline(site):
    f = scan(site)
    base = {'made': time.strftime('%Y-%m-%d %H:%M'), 'urls': sorted(f['urls']), 'colors': sorted(f['colors']), 'keys': sorted(f['keys']), 'fonts': sorted(set(f['fonts'].values()))}
    with open(os.path.join(site, BASE_NAME), 'w', encoding='utf-8') as out:
        json.dump(base, out, ensure_ascii=False, indent=1)
    return base


def check(site):
    """(글 줄 목록, 문제 dict)를 돌려준다. 문제 dict가 비어 있으면 통과."""
    with open(os.path.join(site, BASE_NAME), encoding='utf-8') as fh:
        base = json.load(fh)
    f, lines, probs = scan(site), [], {}
    lines.append('점검: %s (기준: %s에 적어 둔 상태)' % (site, base.get('made', '?')))
    # 1. 키트 파일
    copies = f['kitcopies']
    if not copies:
        lines.append('[알림] 사이트 안에서 design.css · design.js를 아직 못 찾았어요(1단계 전이면 괜찮아요)')
    else:
        bad = [r for r, same in copies if not same]
        if bad:
            probs['kit'] = bad
            lines.append('[문제] 키트 파일이 바뀌었어요. 키트의 원본으로 다시 복사하세요: ' + ', '.join(bad))
        else:
            lines.append('[괜찮음] 키트 파일이 같아요: ' + ', '.join(r for r, _ in copies))
    # 2. 새 인터넷 주소
    new_urls = sorted(set(f['urls']) - set(base['urls']))
    if new_urls:
        probs['urls'] = new_urls
        lines.append('[문제] 새 인터넷 주소 %d개. 지우거나, 꼭 필요하면 사람에게 물어보세요:' % len(new_urls))
        lines += ['    %s  %s' % (f['urls'][u], u) for u in new_urls]
    else:
        lines.append('[괜찮음] 새 인터넷 주소가 없어요')
    # 3. 키트에 없는 새 색
    new_colors = sorted(set(f['colors']) - set(base['colors']) - kit_palette())
    if new_colors:
        probs['colors'] = new_colors
        lines.append('[문제] 키트에 없는 새 색 %d개. var(--k-…)나 키트 class로 바꾸세요:' % len(new_colors))
        lines += ['    %s  %s' % (f['colors'][c], c) for c in new_colors]
    else:
        lines.append('[괜찮음] 새 색 값이 없어요')
    # 4. 기록 저장 이름
    gone = sorted(set(base['keys']) - set(f['keys']))
    added = sorted(k for k in set(f['keys']) - set(base['keys']) if not k.startswith('k-'))
    if gone:
        probs['keys_gone'] = gone
        lines.append('[문제] 기록 저장 이름이 사라졌어요. 기록이 안 읽힐 수 있어요. 원래대로 되돌리세요: ' + ', '.join(gone))
    if added:
        probs['keys_new'] = added
        lines.append('[문제] 새 기록 저장 이름이 생겼어요. 키트 적용에는 필요 없어요: ' + ', '.join('%s (%s)' % (k, f['keys'][k]) for k in added))
    if not gone and not added:
        lines.append('[괜찮음] 기록 저장 이름이 그대로예요(%d개)' % len(base['keys']))
    # 5. 키트에 없는 k- 이름
    unknown = sorted(set(f['knames']) - kit_names())
    if unknown:
        probs['knames'] = unknown
        lines.append('[문제] 키트에 없는 k- 이름 %d개. 글자가 맞는지 pages/의 예시와 비교하세요:' % len(unknown))
        lines += ['    %s  %s' % (f['knames'][k], k) for k in unknown]
    else:
        lines.append('[괜찮음] k- 이름이 모두 키트에 있어요')
    # 6. 따로 정한 글꼴
    new_fonts = sorted((loc, v) for (loc, _), v in f['fonts'].items() if v not in set(base.get('fonts', [])))
    if new_fonts:
        probs['fonts'] = [v for _, v in new_fonts]
        lines.append('[문제] 글꼴을 따로 정한 곳 %d개. 지우고 키트 class를 쓰세요(코드는 var(--k-f-code), 글은 var(--k-f-body)):' % len(new_fonts))
        lines += ['    %s  %s' % (loc, v) for loc, v in new_fonts]
    else:
        lines.append('[괜찮음] 글꼴을 따로 정한 곳이 없어요')
    lines.append('결과: ' + ('문제 %d가지. 위 [문제] 줄을 고친 뒤 다시 돌리세요.' % len(probs) if probs else '문제가 없어요.'))
    return lines, probs


def selftest():
    tmp = tempfile.mkdtemp(prefix='k-check-')
    try:
        site = os.path.join(tmp, 'site')
        os.makedirs(site)
        page = os.path.join(site, 'index.html')

        def write(html):
            with open(page, 'w', encoding='utf-8') as fh:
                fh.write(html)
        write('<html><head><style>.a{color:#123456}</style><link href="https://intranet.example/doc.css"></head>'
              '<body><div class="app"></div><script>localStorage.setItem("progress", "1")</script></body></html>')
        make_baseline(site)
        _, probs = check(site)
        assert probs == {}, probs
        os.makedirs(os.path.join(site, 'k', 'css'))
        os.makedirs(os.path.join(site, 'k', 'js'))
        shutil.copy(KIT_FILES['design.css'], os.path.join(site, 'k', 'css', 'design.css'))
        shutil.copy(KIT_FILES['design.js'], os.path.join(site, 'k', 'js', 'design.js'))
        write('<html><head><style>.a{color:#123456}.b{color:#ABCDEF}</style><link href="https://intranet.example/doc.css">'
              '<script src="https://cdn.example.com/lib.js"></script></head>'
              '<body><div class="app k-app"><button class="k-btn k-buton" style="background: var(--k-card)">x</button></div>'
              '<script>var x = 1;</script></body></html>')
        _, probs = check(site)
        assert set(probs) == {'urls', 'colors', 'keys_gone', 'knames'}, probs
        assert probs['urls'] == ['https://cdn.example.com/lib.js'] and probs['colors'] == ['#abcdef'], probs
        assert probs['keys_gone'] == ['progress'] and probs['knames'] == ['k-buton'], probs
        with open(os.path.join(site, 'k', 'css', 'design.css'), 'a', encoding='utf-8') as fh:
            fh.write('\n.k-app .k-btn { background: #3478F6 }\n')
        _, probs = check(site)
        assert probs.get('kit') == ['k/css/design.css'] and '#3478f6' in probs['colors'], probs
        shutil.copy(KIT_FILES['design.css'], os.path.join(site, 'k', 'css', 'design.css'))
        write('<html><head><style>pre{font-family: Consolas}.c{font: 13px/1.6 var(--k-f-code)}</style></head><body class="k-app"><script>localStorage.setItem("progress", "1"); ed = {fontFamily: "Courier New"}</script></body></html>')
        _, probs = check(site)
        assert set(probs) == {'fonts'} and len(probs['fonts']) == 2, probs
        print('selftest ok')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    ap = argparse.ArgumentParser(description='디자인 키트 점검 도구')
    ap.add_argument('site', nargs='?', help='사이트(복사본) 폴더')
    ap.add_argument('--baseline', action='store_true', help='지금 상태를 적어 둔다(처음 한 번)')
    ap.add_argument('--selftest', action='store_true', help='이 도구가 잘 도는지 시험한다')
    a = ap.parse_args()
    if a.selftest:
        selftest()
        return 0
    if not a.site or not os.path.isdir(a.site):
        ap.print_help()
        return 2
    if a.baseline:
        base = make_baseline(a.site)
        print('지금 상태를 적어 뒀어요: %s' % os.path.join(a.site, BASE_NAME))
        print('  인터넷 주소 %d개, 색 %d개, 기록 저장 이름 %d개' % (len(base['urls']), len(base['colors']), len(base['keys'])))
        print('  기록 저장 이름(끝까지 바꾸면 안 돼요): ' + (', '.join(base['keys']) or '(못 찾음: 사람에게 기록을 어디에 저장하는지 물어보세요)'))
        return 0
    if not os.path.exists(os.path.join(a.site, BASE_NAME)):
        print('먼저 지금 상태를 적어 두세요: python check.py --baseline %s' % a.site)
        return 2
    lines, probs = check(a.site)
    print('\n'.join(lines))
    return 1 if probs else 0


if __name__ == '__main__':
    sys.exit(main())
