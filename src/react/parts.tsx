/** @jsxRuntime automatic @jsxImportSource react */
// Workstyle 부품(React). 이름·변형은 Vue 킷(../*.vue)과 같고 스타일은 ws.css(ds.css 에 ws- 를 붙인 것).
import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from './cx';
import { Icon } from './Icon';
import type { IconName } from '../icons';

export type ButtonKind = 'ghost' | 'secondary' | 'primary' | 'danger';
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { kind?: ButtonKind; size?: 'sm' | 'md' | 'lg'; icon?: IconName };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ kind = 'ghost', size = 'sm', icon, className, children, type = 'button', ...rest }, ref) {
  return (
    <button ref={ref} type={type} className={cx('ws-btn', kind !== 'ghost' && `ws-${kind}`, size !== 'md' && `ws-${size}`, className)} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
});

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { size?: 'sm' | 'md'; label: string; icon?: IconName };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({ size = 'md', label, icon, title, className, children, type = 'button', ...rest }, ref) {
  return (
    <button ref={ref} type={type} className={cx('ws-btn ws-icon', size === 'sm' && 'ws-sm', className)} aria-label={label} title={title ?? label} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
});

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> & { size?: 'md' | 'lg'; invalid?: boolean };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ size = 'md', invalid, className, ...rest }, ref) {
  return <input ref={ref} className={cx('ws-input', size === 'lg' && 'ws-lg', className)} aria-invalid={invalid ? 'true' : undefined} {...rest} />;
});

/** 앞뒤에 아이콘·글자를 둔 입력 칸(.field) */
export const Field = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> & { prefix?: ReactNode; suffix?: ReactNode; fieldClassName?: string }>(
  function Field({ prefix, suffix, fieldClassName, className, ...rest }, ref) {
    return (
      <label className={cx('ws-field', fieldClassName)}>
        {prefix}
        <input ref={ref} className={className} {...rest} />
        {suffix}
      </label>
    );
  },
);

export type CheckboxProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & { checked?: boolean; indeterminate?: boolean; onCheckedChange?: (checked: boolean) => void; label?: string };

export function Checkbox({ checked = false, indeterminate, onCheckedChange, label, className, onClick, ...rest }: CheckboxProps) {
  const on = checked || indeterminate;
  return (
    <button
      type="button"
      role="checkbox"
      className={cx('ws-checkbox', className)}
      aria-checked={indeterminate ? 'mixed' : checked ? 'true' : 'false'}
      aria-label={label}
      data-on={on ? 'true' : undefined}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onCheckedChange?.(!checked);
      }}
      {...rest}
    >
      {indeterminate ? <Icon name="minus" size={11} /> : checked ? <Icon name="check" size={11} /> : null}
    </button>
  );
}

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> & { checked?: boolean; onCheckedChange?: (checked: boolean) => void; label?: string };

export function Switch({ checked, onCheckedChange, label, className, ...rest }: SwitchProps) {
  return <input type="checkbox" role="switch" className={cx('ws-switch', className)} checked={!!checked} aria-label={label} onChange={(e) => onCheckedChange?.(e.target.checked)} {...rest} />;
}

export type BadgeTone = 'default' | 'acc' | 'prop' | 'ok' | 'warn' | 'bad';

export function Badge({ tone = 'default', className, children }: { tone?: BadgeTone; className?: string; children?: ReactNode }) {
  return <span className={cx('ws-badge', tone !== 'default' && `ws-${tone}`, className)}>{children}</span>;
}

export function Chip({ selected, removable, onRemove, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean; removable?: boolean; onRemove?: () => void }) {
  return (
    <button type="button" className={cx('ws-chip', className)} aria-pressed={selected ? 'true' : 'false'} {...rest}>
      {children}
      {removable && (
        <span
          className="ws-x"
          role="button"
          aria-label="빼기"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >
          <Icon name="close" size={10} />
        </span>
      )}
    </button>
  );
}

export function Avatar({ name, src, className }: { name?: string; src?: string; className?: string }) {
  return (
    <span className={cx('ws-avatar', className)} title={name}>
      {src ? <img src={src} alt={name ?? ''} width={24} height={24} style={{ borderRadius: 'inherit' }} /> : (name ?? '?').trim().slice(0, 1)}
    </span>
  );
}

export function Loader({ className, label = '불러오는 중' }: { className?: string; label?: string }) {
  return (
    <span className={cx('ws-loader', className)} role="status" aria-label={label}>
      <i />
      <i />
      <i />
    </span>
  );
}

export function EmptyState({ title, description, action, className }: { title?: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('ws-list-empty ws-stack', className)} style={{ alignItems: 'center', gap: 6, textAlign: 'center' }}>
      {title && <div className="ws-t-strong" style={{ color: 'var(--ink2)' }}>{title}</div>}
      {description && <div className="ws-t-small">{description}</div>}
      {action}
    </div>
  );
}

export function Popover({ label, width, className, children }: { label?: string; width?: number; className?: string; children?: ReactNode }) {
  return (
    <div className={cx('ws-popover', className)} role="listbox" aria-label={label} style={width ? { width } : undefined}>
      {label && <div className="ws-menu-label">{label}</div>}
      {children}
    </div>
  );
}

export function MenuLabel({ children }: { children?: ReactNode }) {
  return <div className="ws-menu-label">{children}</div>;
}

export type MenuItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { icon?: IconName; label: ReactNode; desc?: ReactNode; selected?: boolean; children?: ReactNode };

export function MenuItem({ icon, label, desc, selected, className, children, ...rest }: MenuItemProps) {
  return (
    <button type="button" role="option" className={cx('ws-menu-item', className)} aria-selected={selected ? 'true' : 'false'} {...rest}>
      {icon && (
        <span className="ws-mark">
          <Icon name={icon} />
        </span>
      )}
      <span className="ws-text">
        <span className="ws-label">{label}</span>
        {desc && <span className="ws-desc">{desc}</span>}
      </span>
      {children}
    </button>
  );
}
