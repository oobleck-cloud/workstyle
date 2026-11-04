/** @jsxRuntime automatic @jsxImportSource react */
// 고르기·세기·상태·탭 부품(React). 스타일은 ds.css 의 .seg · .stepper · .status · .tabs 에서 만든 ws.css 를 쓴다.
// 속성 이름·선택지는 Seed Studio 라이브러리(seed-studio)의 Segment · Stepper · Status · Tab 과 같다.
import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from './cx';
import { Icon } from './Icon';
import type { IconName } from '../icons';

export type ChoiceOption<V extends string = string> = { value: V; label: ReactNode; icon?: IconName; disabled?: boolean };

export type SegmentProps<V extends string = string> = {
  options: readonly ChoiceOption<V>[];
  value?: V | null;
  onValueChange?: (value: V) => void;
  /** sm 은 24px, md 는 28px 높이 */
  size?: 'sm' | 'md';
  /** 줄 폭을 채우고 칸을 고르게 나눈다 */
  fill?: boolean;
  label?: string;
  className?: string;
};

/** 몇 안 되는 선택지 가운데 하나를 고른다(.seg). 칸마다 aria-pressed 로 고른 것을 알린다. */
export function Segment<V extends string = string>({ options, value, onValueChange, size = 'sm', fill, label, className }: SegmentProps<V>) {
  return (
    <div role="group" aria-label={label} className={cx('ws-seg', size === 'md' && 'ws-lg', fill && 'ws-fill', className)}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value ? 'true' : 'false'} disabled={o.disabled} onClick={() => onValueChange?.(o.value)}>
          {o.icon && <Icon name={o.icon} />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export type StepperProps = {
  value?: number | null;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** 값 뒤에 붙는 단위(예: 개, 명) */
  unit?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** 빼기·더하기 단추와 숫자 칸(.stepper). 값은 min·max 안으로 맞춰 알린다. */
export function Stepper({ value, onValueChange, min = -Infinity, max = Infinity, step = 1, unit, label, disabled, className }: StepperProps) {
  const n = value ?? (Number.isFinite(min) ? min : 0);
  const set = (next: number) => {
    const v = clamp(next, min, max);
    if (v !== value) onValueChange?.(v);
  };
  return (
    <div role="group" aria-label={label} className={cx('ws-stepper', className)}>
      <button type="button" aria-label="빼기" disabled={disabled || n <= min} onClick={() => set(n - step)}>
        <Icon name="minus" size={12} />
      </button>
      <span className="ws-value">
        <input
          type="number"
          inputMode="numeric"
          aria-label={label}
          value={value ?? ''}
          min={Number.isFinite(min) ? min : undefined}
          max={Number.isFinite(max) ? max : undefined}
          step={step}
          disabled={disabled}
          size={Math.max(1, String(value ?? '').length)}
          onChange={(e) => {
            const v = e.target.valueAsNumber;
            if (Number.isFinite(v)) set(v);
          }}
        />
        {unit && <span className="ws-unit">{unit}</span>}
      </span>
      <button type="button" aria-label="더하기" disabled={disabled || n >= max} onClick={() => set(n + step)}>
        <Icon name="plus" size={12} />
      </button>
    </div>
  );
}

export type StatusTone = 'ok' | 'warn' | 'bad' | 'default';

const STATUS_COLOR: Record<StatusTone, string> = { ok: 'var(--ok)', warn: 'var(--warn)', bad: 'var(--bad)', default: 'var(--ink3)' };

/** 점 하나와 글로 상태를 보인다(.status · .dot). 점 색만 tone 을 따른다. */
export function Status({ tone = 'ok', live, className, children }: { tone?: StatusTone; live?: boolean; className?: string; children?: ReactNode }) {
  return (
    <span className={cx('ws-status', className)}>
      <span className={cx('ws-dot', live && 'ws-live')} style={{ color: STATUS_COLOR[tone] }} aria-hidden="true" />
      {children}
    </span>
  );
}

export type TabProps = { selected?: boolean; icon?: IconName; label: ReactNode; disabled?: boolean; onSelect?: () => void; tabIndex?: number; className?: string };

/** 탭 하나(.tab). 보통은 Tabs 가 그리고, 직접 늘어놓을 때는 role="tablist" 안에 둔다. */
export function Tab({ selected, icon, label, disabled, onSelect, tabIndex, className }: TabProps) {
  return (
    <button type="button" role="tab" className={cx('ws-tab', className)} aria-selected={selected ? 'true' : 'false'} tabIndex={tabIndex ?? (selected ? 0 : -1)} disabled={disabled} onClick={onSelect}>
      {icon && <Icon name={icon} />}
      {label}
    </button>
  );
}

export type TabsProps<V extends string = string> = {
  items: readonly ChoiceOption<V>[];
  value?: V | null;
  onValueChange?: (value: V) => void;
  label?: string;
  className?: string;
};

/** 탭 줄(.tabs). 왼쪽·오른쪽·Home·End 로 옮겨 가며 고른다(포커스는 고른 탭 하나만 받는다). */
export function Tabs<V extends string = string>({ items, value, onValueChange, label, className }: TabsProps<V>) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = items.filter((i) => !i.disabled);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!enabled.length) return;
    const at = enabled.findIndex((i) => i.value === value);
    const to =
      e.key === 'ArrowRight' ? (at + 1) % enabled.length
      : e.key === 'ArrowLeft' ? (at - 1 + enabled.length) % enabled.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? enabled.length - 1
      : -1;
    if (to < 0) return;
    e.preventDefault();
    const next = enabled[to]!;
    onValueChange?.(next.value);
    ref.current?.querySelectorAll<HTMLElement>('[role="tab"]:not(:disabled)')[to]?.focus();
  };
  // 고른 탭이 없으면 첫 탭이 포커스를 받는다
  const focusable = items.some((i) => i.value === value && !i.disabled) ? value : enabled[0]?.value;
  return (
    <div ref={ref} role="tablist" aria-label={label} className={cx('ws-tabs', className)} onKeyDown={onKeyDown}>
      {items.map((i) => (
        <Tab
          key={i.value}
          label={i.label}
          icon={i.icon}
          disabled={i.disabled}
          selected={i.value === value}
          tabIndex={i.value === focusable ? 0 : -1}
          onSelect={() => onValueChange?.(i.value)}
        />
      ))}
    </div>
  );
}
