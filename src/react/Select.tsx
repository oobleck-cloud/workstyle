/** @jsxRuntime automatic @jsxImportSource react */
// Workstyle Select(React): .select 단추를 누르면 Float 위 Popover 에 MenuItem 목록. 위아래 화살표·Enter·Esc, 글자로 찾기(searchable)
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { cx } from './cx';
import { Float } from './Float';
import { Icon } from './Icon';
import { MenuItem } from './parts';
import type { IconName } from '../icons';

export type SelectOption = { value: string; label: string; disabled?: boolean; desc?: string; icon?: IconName; keywords?: string[] };

export type SelectProps = {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** 앞에 붙는 이름(단추 안 흐린 글자) */
  label?: ReactNode;
  className?: string;
  'aria-label'?: string;
};

export function Select({ options, value, onChange, onOpenChange, placeholder = '고르기', disabled, searchable, size = 'md', label, className, ...aria }: SelectProps) {
  const [open, setOpenState] = useState(false);
  const [q, setQ] = useState('');
  const [hi, setHi] = useState(0);
  const btn = useRef<HTMLButtonElement | null>(null);
  const listId = useId();
  const current = options.find((o) => o.value === value);
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return options;
    return options.filter((o) => [o.label, o.value, ...(o.keywords ?? [])].some((s) => s.toLowerCase().includes(t)));
  }, [options, q]);

  const setOpen = (v: boolean) => {
    setOpenState(v);
    onOpenChange?.(v);
    if (v) {
      setQ('');
      setHi(Math.max(0, options.findIndex((o) => o.value === value)));
    } else btn.current?.focus();
  };
  useEffect(() => setHi((h) => Math.min(h, Math.max(0, shown.length - 1))), [shown.length]);

  const pick = (o: SelectOption | undefined) => {
    if (!o || o.disabled) return;
    onChange?.(o.value);
    setOpen(false);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) return setOpen(true);
      const d = e.key === 'ArrowDown' ? 1 : -1;
      setHi((h) => (h + d + shown.length) % Math.max(1, shown.length));
    } else if (e.key === 'Enter' && open) {
      e.preventDefault();
      pick(shown[hi]);
    }
  };

  return (
    <>
      <button
        {...aria}
        ref={btn}
        type="button"
        className={cx('ws-select', size === 'sm' && 'ws-sm', size === 'lg' && 'ws-lg', className)}
        aria-haspopup="listbox"
        aria-expanded={open ? 'true' : 'false'}
        aria-controls={open ? listId : undefined}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        onKeyDown={onKey}
      >
        {label && <span className="ws-ink3">{label}</span>}
        <span className={cx('ws-grow', !current && 'ws-ink3')} style={{ textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {current?.label ?? placeholder}
        </span>
        <Icon name="chevron-down" size={14} />
      </button>
      {open && (
        <Float anchor={btn.current} match="min" onClose={() => setOpen(false)}>
          <div className="ws-popover" role="listbox" id={listId} onKeyDown={onKey}>
            {searchable && (
              <input className="ws-input" autoFocus value={q} placeholder="찾기" aria-label="찾기" onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 4 }} />
            )}
            {shown.map((o, i) => (
              <MenuItem
                key={o.value}
                label={o.label}
                desc={o.desc}
                icon={o.icon}
                selected={i === hi}
                aria-current={o.value === value ? 'true' : undefined}
                disabled={o.disabled}
                onMouseEnter={() => setHi(i)}
                onClick={() => pick(o)}
              >
                {o.value === value && <Icon name="check" size={14} className="ws-acc" />}
              </MenuItem>
            ))}
            {!shown.length && <div className="ws-list-empty">없음</div>}
          </div>
        </Float>
      )}
    </>
  );
}
