/** @jsxRuntime automatic @jsxImportSource react */
// 떠 있는 층(Float.vue 와 같은 규칙): body 로 옮겨 앵커 자리를 보고 fixed 로 띄운다. 들어가는 쪽으로 위아래를 뒤집고,
// 화면 밖이면 밀어 넣는다. 바깥을 누르거나 Esc 면 onClose. 뒤에 열린 Float(하위 메뉴) 안을 누른 것은 바깥이 아니다.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type FloatPlace = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start' | 'bottom-center' | 'top-center';

export type FloatProps = {
  anchor: HTMLElement | null | undefined;
  place?: FloatPlace;
  gap?: number;
  /** 앵커 폭에 맞춤: min(최소 폭) · width(같은 폭) */
  match?: 'min' | 'width';
  /** 바깥 누름·Esc 를 받지 않는다(부모가 따로 닫음) */
  manual?: boolean;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
  role?: string;
  'aria-label'?: string;
  children: ReactNode;
};

const PAD = 8;
const stack: HTMLElement[] = ((globalThis as { __wbFloats?: HTMLElement[] }).__wbFloats ??= []);

export function Float({ anchor, place = 'bottom-start', gap = 6, match, manual, onClose, className, style, children, ...aria }: FloatProps) {
  const el = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<CSSProperties>({ top: 0, left: 0, visibility: 'hidden' });
  const close = useRef(onClose);
  close.current = onClose;

  const placeNow = useCallback(() => {
    const p = el.current;
    if (!p || !anchor) return;
    const a = anchor.getBoundingClientRect();
    if (!anchor.isConnected) return void close.current?.();
    const vw = innerWidth, vh = innerHeight;
    const sized: CSSProperties = match === 'width' ? { width: a.width } : match === 'min' ? { minWidth: a.width } : {};
    Object.assign(p.style, { width: sized.width ? `${a.width}px` : '', minWidth: sized.minWidth ? `${a.width}px` : '', maxHeight: `${vh - 2 * PAD}px` });
    const w = p.offsetWidth, h = p.offsetHeight;
    let top: number, left: number;
    if (place === 'right-start') {
      left = a.right + gap + w <= vw - PAD ? a.right + gap : a.left - gap - w;
      top = a.top;
    } else {
      const below = vh - a.bottom - gap - PAD, above = a.top - gap - PAD;
      const up = place.startsWith('top') ? above >= h || above >= below : below < h && above > below;
      top = up ? a.top - gap - h : a.bottom + gap;
      left = place.endsWith('end') ? a.right - w : place.endsWith('center') ? a.left + (a.width - w) / 2 : a.left;
    }
    left = Math.max(PAD, Math.min(left, vw - PAD - w));
    top = Math.max(PAD, Math.min(top, vh - PAD - h));
    setPos({ top, left, maxHeight: vh - 2 * PAD, ...sized });
  }, [anchor, place, gap, match]);

  useLayoutEffect(placeNow, [placeNow]);

  useEffect(() => {
    const node = el.current;
    if (node) stack.push(node);
    let raf = 0;
    const reflow = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(placeNow);
    };
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(reflow);
    if (node) ro?.observe(node);
    if (anchor) ro?.observe(anchor);
    const outside = (e: MouseEvent) => {
      if (manual || !node) return;
      const t = e.target as Node;
      if (node.contains(t) || anchor?.contains(t)) return;
      const i = stack.indexOf(node);
      if (stack.slice(i + 1).some((f) => f.contains(t))) return;
      close.current?.();
    };
    const onKey = (e: KeyboardEvent) => {
      if (manual || e.key !== 'Escape' || stack[stack.length - 1] !== node) return;
      e.stopPropagation();
      close.current?.();
    };
    addEventListener('scroll', reflow, true);
    addEventListener('resize', reflow);
    document.addEventListener('mousedown', outside, true);
    document.addEventListener('keydown', onKey, true);
    return () => {
      const i = node ? stack.indexOf(node) : -1;
      if (i >= 0) stack.splice(i, 1);
      ro?.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener('scroll', reflow, true);
      removeEventListener('resize', reflow);
      document.removeEventListener('mousedown', outside, true);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [anchor, manual, placeNow]);

  return createPortal(
    <div ref={el} className={className ? `ws-scope ws-float ${className}` : 'ws-scope ws-float'} style={{ ...style, ...pos }} {...aria}>
      {children}
    </div>,
    document.body,
  );
}
