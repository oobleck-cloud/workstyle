/** @vitest-environment happy-dom */
// Workstyle 판 eb12e334 의 도구 줄 부품이 그 변형 이름으로 그려지는지.
import { createApp, h, type VNode } from 'vue';
import { describe, expect, it } from 'vitest';
import Button from './Button.vue';
import FilterChip from './FilterChip.vue';
import IconButton from './IconButton.vue';
import IconShortcut from './IconShortcut.vue';
import SelectionToolbar from './SelectionToolbar.vue';

function html(vnode: VNode) {
  const el = document.createElement('div');
  document.body.appendChild(el);
  createApp({ render: () => vnode }).mount(el);
  return el;
}

describe('workstyle toolbar parts', () => {
  it('FilterChip applied 와 add', () => {
    const applied = html(h(FilterChip, { label: '상태: 진행 중' }));
    expect(applied.querySelector('.filter-chip.applied')?.textContent).toContain('상태: 진행 중');
    const add = html(h(FilterChip, { state: 'add', label: '필터' }));
    expect(add.querySelector('.filter-chip.add')?.textContent).toContain('필터');
  });

  it('Button kind 와 size sm 이 기본', () => {
    const primary = html(h(Button, { kind: 'primary' }, () => '확인'));
    const btn = primary.querySelector('button')!;
    expect(btn.className).toContain('primary');
    expect(btn.className).toContain('sm');
    expect(btn.textContent).toContain('확인');
    const ghost = html(h(Button, { kind: 'ghost', state: 'disabled' }, () => '버튼'));
    const g = ghost.querySelector('button')!;
    expect(g.className).not.toContain('ghost');
    expect(g.disabled).toBe(true);
  });

  it('IconShortcut active 와 IconButton sm', () => {
    const sc = html(h(IconShortcut, { icon: 'filter', label: '필터', count: 2 }));
    const b = sc.querySelector('button')!;
    expect(b.className).toContain('icon-shortcut');
    expect(b.getAttribute('aria-pressed')).toBe('true');
    expect(b.querySelector('.count')?.textContent).toBe('2');
    const ib = html(h(IconButton, { size: 'sm', label: '보기 메뉴' }, () => '…'));
    expect(ib.querySelector('button')!.className).toContain('icon sm');
  });

  it('SelectionToolbar kind text 와 records', () => {
    const text = html(h(SelectionToolbar, { active: ['bold'] }));
    expect(text.querySelector('[aria-label="글 꾸미기"]')).toBeTruthy();
    expect(text.querySelector('[aria-pressed="true"]')?.textContent).toBe('B');
    const records = html(h(SelectionToolbar, { kind: 'records', count: '3개 고름' }));
    const bar = records.querySelector('[aria-label="고른 기록"]')!;
    expect(bar.querySelector('.count')?.textContent).toBe('3개 고름');
    expect(bar.textContent).toContain('적용');
    expect(bar.textContent).not.toContain('승인 요청');
    expect(bar.querySelector('.primary')).toBeTruthy();
  });
});
