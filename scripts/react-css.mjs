// ds.css → src/react/ws.css: React 킷용으로 모든 클래스에 ws- 를 붙이고, 요소만 고른 규칙(button·svg·*)은 .ws-scope 안으로 가둔다.
// Tailwind 같은 다른 스타일을 쓰는 앱(MVOS)에서 .row·.grow·.btn 이 겹치지 않게 하려는 것. 손으로 고치지 말고 `node scripts/react-css.mjs` 로 다시 만든다(--check 는 어긋났는지만 본다).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const SRC = here('../src/ds.css');
const OUT = here('../src/react/ws.css');

export function prefixSelector(sel) {
  // html·body 를 함께 고른 규칙(height 100% 등)은 문서 바닥용이라 버린다
  if (/(^|,)\s*html\b/.test(sel)) return '';
  return sel
    .split(',')
    .map((part) => {
      const s = part.trim();
      if (!s) return s;
      if (s === 'body') return '.ws-scope';
      const p = s.replace(/\.(-?[a-zA-Z_][\w-]*)/g, '.ws-$1');
      // 클래스 없이 요소·* 만 고른 것(:focus-visible 포함)은 ws-scope 안으로
      return /\.ws-/.test(p) ? p : `:where(.ws-scope) ${p}`;
    })
    .filter((x) => x !== null)
    .join(', ');
}

// 요소 기본값(.ws-scope 안 button·svg·*)은 @layer base, 부품 클래스는 @layer components 에 넣는다.
// 층에 넣지 않으면 Tailwind 의 층 안 유틸리티(bg-primary·border)를 언제나 이겨서, 킷 아래 systheme 부품의 색·테두리가 지워진다.
const isBase = (sel) => sel.split(',').every((s) => s.trim().startsWith(':where(.ws-scope)') || s.trim() === '.ws-scope');

export function toReactCss(css) {
  let out = '';
  let base = '';
  let i = 0;
  const groups = []; // 열린 { 가 묶음(@media 등)인지 선언인지
  while (i < css.length) {
    if (css.startsWith('/*', i)) {
      const e = css.indexOf('*/', i + 2);
      i = e < 0 ? css.length : e + 2;
      continue;
    }
    const ch = css[i];
    if (ch === '}') { groups.pop(); out += '}\n'; i++; continue; }
    // 선택자(또는 @규칙 머리)를 { 나 ; 까지 읽는다
    let j = i, buf = '';
    while (j < css.length && css[j] !== '{' && css[j] !== ';' && css[j] !== '}') {
      if (css.startsWith('/*', j)) { const e = css.indexOf('*/', j + 2); j = e < 0 ? css.length : e + 2; continue; }
      buf += css[j++];
    }
    const head = buf.trim();
    if (css[j] !== '{') { if (head) out += head + (css[j] === ';' ? ';\n' : ''); i = css[j] === ';' ? j + 1 : j; continue; }
    if (head.startsWith('@keyframes')) {
      // keyframes 는 통째로 옮긴다
      let depth = 0, k = j;
      do { if (css[k] === '{') depth++; else if (css[k] === '}') depth--; k++; } while (depth && k < css.length);
      out += head + ' ' + css.slice(j, k).replace(/\s+/g, ' ') + '\n';
      i = k;
      continue;
    }
    if (head.startsWith('@')) { groups.push('group'); out += head + ' {\n'; i = j + 1; continue; }
    // 선언 블록: 짝 } 까지 그대로
    const e = css.indexOf('}', j);
    const body = css.slice(j + 1, e).trim();
    const sel = prefixSelector(head);
    if (sel) {
      if (!groups.length && isBase(sel)) base += `${sel} { ${body} }\n`;
      else out += `${sel} { ${body} }\n`;
    }
    i = e + 1;
  }
  return `@layer base {\n${base}}\n@layer components {\n${out}}\n`;
}

const HEADER = '/* 만든 파일: scripts/react-css.mjs 가 ../ds.css 에서 만든다. 손으로 고치지 않는다. 모든 클래스에 ws- 가 붙고, 요소 규칙은 .ws-scope 안에서만 걸린다. 요소 규칙은 @layer base, 부품은 @layer components(Tailwind 유틸리티가 이긴다). */\n';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const next = HEADER + toReactCss(readFileSync(SRC, 'utf8'));
  if (process.argv.includes('--check')) {
    const cur = readFileSync(OUT, 'utf8');
    if (cur !== next) { console.error('src/react/ws.css 가 ds.css 와 어긋남: node scripts/react-css.mjs'); process.exit(1); }
  } else writeFileSync(OUT, next);
}
