import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Button, Checkbox, Select, Switch, Tooltip } from '../src/react';

// @ts-expect-error mjs 모듈
import { prefixSelector, toReactCss } from '../scripts/react-css.mjs';

// 워크벤치(happy-dom·react 를 이미 씀)가 이 패키지를 링크로 받을 때 새 개발 의존이 늘지 않게 testing-library 없이 그린다
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let root: Root | null = null;
function render(node: ReactNode) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  act(() => root!.render(node));
}
afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.innerHTML = '';
});
const byRole = (role: string, name?: string) =>
  [...document.querySelectorAll<HTMLElement>(`[role="${role}"]${role === 'button' ? ', button' : ''}`)].find(
    (el) => (el.getAttribute('role') ?? (el.tagName === 'BUTTON' ? 'button' : '')) === role && (name == null || (el.getAttribute('aria-label') ?? el.textContent) === name),
  );
const fire = {
  click: (el: Element | undefined) => act(() => void el!.dispatchEvent(new MouseEvent('click', { bubbles: true }))),
  mouseDown: (el: Element) => act(() => void el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))),
  mouseEnter: (el: Element | undefined) => act(() => void el!.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))),
  keyDown: (el: Element | undefined, key: string) => act(() => void el!.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))),
};

describe('ws.css 만들기', () => {
  it('클래스에 ws- 를 붙이고 요소 규칙은 ws-scope 안에 가둔다', () => {
    expect(prefixSelector('.btn.primary:hover:not(:disabled)')).toBe('.ws-btn.ws-primary:hover:not(:disabled)');
    expect(prefixSelector('button, input')).toBe(':where(.ws-scope) button, :where(.ws-scope) input');
    expect(prefixSelector('body')).toBe('.ws-scope');
    expect(prefixSelector('html, body')).toBe('');
    expect(toReactCss('@media (x) { .a > .b { color: red; } }')).toContain('.ws-a > .ws-b { color: red; }');
    expect(toReactCss('.a { background: url("data:x.svg"); }')).toContain('url("data:x.svg")');
  });
  it('src/react/ws.css 가 ds.css 와 맞다', async () => {
    const ds = readFileSync(resolve(__dirname, '../src/ds.css'), 'utf8');
    const ws = readFileSync(resolve(__dirname, '../src/react/ws.css'), 'utf8');
    expect(ws.endsWith(toReactCss(ds))).toBe(true);
  });
});

describe('React 킷', () => {
  it('Button 변형이 ws- 클래스로', () => {
    render(<Button kind="primary" size="lg">적용</Button>);
    expect(byRole('button', '적용')!.className).toBe('ws-btn ws-primary ws-lg');
  });
  it('Checkbox·Switch 가 값을 알린다', () => {
    const c = vi.fn(), s = vi.fn();
    render(<><Checkbox label="고름" checked={false} onCheckedChange={c} /><Switch label="켜기" checked onCheckedChange={s} /></>);
    fire.click(byRole('checkbox', '고름'));
    fire.click(byRole('switch', '켜기'));
    expect(c).toHaveBeenCalledWith(true);
    expect(s).toHaveBeenCalledWith(false);
  });
  it('Select: 열고 화살표·Enter 로 고르고 바깥 누르면 닫힌다', () => {
    const on = vi.fn();
    render(<Select aria-label="정렬" options={[{ value: 'a', label: '가' }, { value: 'b', label: '나' }]} value="a" onChange={on} />);
    const btn = byRole('button', '정렬');
    fire.click(btn);
    expect(btn!.getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelectorAll('[role="option"]').length).toBe(2);
    fire.keyDown(btn, 'ArrowDown');
    fire.keyDown(btn, 'Enter');
    expect(on).toHaveBeenCalledWith('b');
    fire.click(btn);
    fire.mouseDown(document.body);
    expect(document.querySelector('[role="option"]')).toBeNull();
  });
  it('Tooltip 은 머문 뒤에 뜬다', () => {
    vi.useFakeTimers();
    render(<Tooltip content="설명" delay={100}><button>단추</button></Tooltip>);
    fire.mouseEnter(byRole('button', '단추'));
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    act(() => void vi.advanceTimersByTime(120));
    expect(document.querySelector('[role="tooltip"]')!.textContent).toBe('설명');
    vi.useRealTimers();
  });
});
