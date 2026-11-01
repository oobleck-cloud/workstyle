import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Button, Checkbox, Select, Switch, Tooltip } from '../src/react';
// @ts-expect-error mjs 모듈
import { prefixSelector, toReactCss } from '../scripts/react-css.mjs';

afterEach(cleanup);

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
    expect(screen.getByRole('button', { name: '적용' }).className).toBe('ws-btn ws-primary ws-lg');
  });
  it('Checkbox·Switch 가 값을 알린다', () => {
    const c = vi.fn(), s = vi.fn();
    render(<><Checkbox label="고름" checked={false} onCheckedChange={c} /><Switch label="켜기" checked onCheckedChange={s} /></>);
    fireEvent.click(screen.getByRole('checkbox', { name: '고름' }));
    fireEvent.click(screen.getByRole('switch', { name: '켜기' }));
    expect(c).toHaveBeenCalledWith(true);
    expect(s).toHaveBeenCalledWith(false);
  });
  it('Select: 열고 화살표·Enter 로 고르고 바깥 누르면 닫힌다', () => {
    const on = vi.fn();
    render(<Select aria-label="정렬" options={[{ value: 'a', label: '가' }, { value: 'b', label: '나' }]} value="a" onChange={on} />);
    const btn = screen.getByRole('button', { name: '정렬' });
    fireEvent.click(btn);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(btn, { key: 'ArrowDown' });
    fireEvent.keyDown(btn, { key: 'Enter' });
    expect(on).toHaveBeenCalledWith('b');
    fireEvent.click(btn);
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('option')).toBeNull();
  });
  it('Tooltip 은 머문 뒤에 뜬다', () => {
    vi.useFakeTimers();
    render(<Tooltip content="설명" delay={100}><button>단추</button></Tooltip>);
    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).toBeNull();
    act(() => void vi.advanceTimersByTime(120));
    expect(screen.getByRole('tooltip').textContent).toBe('설명');
    vi.useRealTimers();
  });
});
