/** @jsxRuntime automatic @jsxImportSource react */
// Workstyle Tooltip(React): 감싼 것에 마우스를 올리거나 초점이 가면 delay 뒤에 .tooltip 을 띄운다
import { cloneElement, isValidElement, useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { Float, type FloatPlace } from './Float';

export type TooltipProps = { content: ReactNode; children: ReactNode; side?: 'top' | 'bottom' | 'left' | 'right'; delay?: number; kbd?: string };

const PLACE: Record<NonNullable<TooltipProps['side']>, FloatPlace> = { top: 'top-center', bottom: 'bottom-center', left: 'right-start', right: 'right-start' };

export function Tooltip({ content, children, side = 'top', delay = 400, kbd }: TooltipProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const show = (e: React.SyntheticEvent<HTMLElement>) => {
    const el = e.currentTarget;
    clearTimeout(t.current);
    t.current = setTimeout(() => {
      setAnchor(el);
      setOpen(true);
    }, delay);
  };
  const hide = () => {
    clearTimeout(t.current);
    setOpen(false);
  };
  const handlers = { onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide };
  const trigger = isValidElement(children) ? cloneElement(children as ReactElement<Record<string, unknown>>, handlers) : <span {...handlers}>{children}</span>;
  return (
    <>
      {trigger}
      {open && content != null && (
        <Float anchor={anchor} place={PLACE[side]} manual gap={6} role="tooltip">
          <span className="ws-tooltip">
            {content}
            {kbd && <span className="ws-kbd-hint">{kbd}</span>}
          </span>
        </Float>
      )}
    </>
  );
}
