<script setup lang="ts">
// 떠 있는 층(펼침 메뉴·고르개·팝오버). 칸(.island)의 overflow·쌓임 맥락에 갇히지 않게 body 로 옮겨(Teleport)
// 앵커 자리를 보고 fixed 로 띄운다: 들어가는 쪽으로 위아래를 뒤집고, 화면 밖으로 나가면 밀어 넣는다. 쌓임은 --z-float 하나(styles/layers.css).
// 바깥을 누르거나 Esc 면 close. 이 Float 뒤에 열린 Float(안에서 연 하위 메뉴·고르개) 안을 누른 것은 바깥이 아니다
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    anchor: HTMLElement | null | undefined;
    place?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start';
    gap?: number;
    /** 앵커 폭에 맞춤: min(최소 폭) · width(같은 폭) */
    match?: 'min' | 'width';
    /** 바깥 누름·Esc 를 이 Float 가 받지 않는다(부모가 따로 닫는 경우) */
    manual?: boolean;
  }>(),
  { place: 'bottom-start', gap: 6 },
);
defineOptions({ inheritAttrs: false });
const emit = defineEmits<{ close: [] }>();
const el = ref<HTMLElement | null>(null);
const style = ref<Record<string, string>>({ top: '0px', left: '0px', visibility: 'hidden' });
const PAD = 8;

// 열린 Float 차례. 뒤에 열린 것 안을 누르면 앞의 것은 닫지 않는다
const stack: HTMLElement[] = ((globalThis as any).__wbFloats ??= []);

function place() {
  const p = el.value;
  const a = props.anchor?.getBoundingClientRect();
  if (!p || !a) return;
  // 앵커가 사라졌으면(칸을 닫음·다시 그림) 함께 닫는다
  if (!props.anchor!.isConnected || (!a.width && !a.height)) return void emit('close');
  const vw = innerWidth, vh = innerHeight, g = props.gap;
  const sized: Record<string, string> = props.match === 'width' ? { width: `${a.width}px` } : props.match === 'min' ? { minWidth: `${a.width}px` } : {};
  Object.assign(p.style, sized, { maxHeight: `${vh - 2 * PAD}px` });
  const w = p.offsetWidth, h = p.offsetHeight;
  let top: number, left: number;
  if (props.place === 'right-start') {
    left = a.right + g + w <= vw - PAD ? a.right + g : a.left - g - w;
    top = a.top;
  } else {
    const below = vh - a.bottom - g - PAD, above = a.top - g - PAD;
    const up = props.place.startsWith('top') ? above >= h || above >= below : below < h && above > below;
    top = up ? a.top - g - h : a.bottom + g;
    left = props.place.endsWith('end') ? a.right - w : a.left;
  }
  left = Math.max(PAD, Math.min(left, vw - PAD - w));
  top = Math.max(PAD, Math.min(top, vh - PAD - h));
  style.value = { top: `${top}px`, left: `${left}px`, maxHeight: `${vh - 2 * PAD}px`, ...sized };
}

function outside(e: MouseEvent) {
  if (props.manual || !el.value) return;
  const t = e.target as Node;
  if (el.value.contains(t) || props.anchor?.contains(t)) return;
  const i = stack.indexOf(el.value);
  if (stack.slice(i + 1).some((f) => f.contains(t))) return;
  emit('close');
}
function onKey(e: KeyboardEvent) {
  // 맨 위 Float 만 Esc 를 받는다
  if (props.manual || e.key !== 'Escape' || stack[stack.length - 1] !== el.value) return;
  e.stopPropagation();
  emit('close');
}

let ro: ResizeObserver | null = null;
let raf = 0;
const reflow = () => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(place);
};
onMounted(() => {
  if (el.value) stack.push(el.value);
  place();
  ro = new ResizeObserver(reflow);
  if (el.value) ro.observe(el.value);
  if (props.anchor) ro.observe(props.anchor);
  addEventListener('scroll', reflow, true);
  addEventListener('resize', reflow);
  document.addEventListener('mousedown', outside, true);
  document.addEventListener('keydown', onKey, true);
});
watch(() => [props.anchor, props.place], reflow);
onBeforeUnmount(() => {
  const i = el.value ? stack.indexOf(el.value) : -1;
  if (i >= 0) stack.splice(i, 1);
  ro?.disconnect();
  cancelAnimationFrame(raf);
  removeEventListener('scroll', reflow, true);
  removeEventListener('resize', reflow);
  document.removeEventListener('mousedown', outside, true);
  document.removeEventListener('keydown', onKey, true);
});
defineExpose({ el, place });
</script>

<template>
  <Teleport to="body">
    <div ref="el" class="wb-float" :style="style" v-bind="$attrs"><slot /></div>
  </Teleport>
</template>

<style>
.wb-float { position: fixed; z-index: var(--z-float); overflow: auto; }
</style>
