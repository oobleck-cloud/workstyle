/** @jsxRuntime automatic @jsxImportSource react */
// Workstyle Icon(React). Vue Icon.vue 와 같은 16 칸 선 아이콘 한 벌(../icons.ts)
import { ICONS, type IconName } from '../icons';

export type IconProps = { name: IconName; size?: number; className?: string };

export function Icon({ name, size = 16, className }: IconProps) {
  return (
    <span className={className ? `ws-ic ${className}` : 'ws-ic'} aria-hidden="true">
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: ICONS[name] }}
      />
    </span>
  );
}
