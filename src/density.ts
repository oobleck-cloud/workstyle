// 머리 밀도(설정 「머리 모양」, 이 기기에만): normal 은 세 줄 PageHeader(경로 · 단추 / 아이콘 · 제목 · 설명 / 속성),
// compact 는 한 줄(아이콘 · 경로 첫 마디 › 제목 · 상태 · 정보 단추 · 단추 아이콘). 설명 · 속성은 정보 단추를 눌러 머리 아래로 편다.
// auto(기본)는 열린 칸 가운데 하나라도 높이가 AUTO_BELOW 아래로 내려가면 모든 칸을 함께 compact 로, AUTO_ABOVE 위로 다 올라오면 되돌린다
// (기준을 둘로 둬 경계에서 깜빡이지 않게). 머리를 바꿔도 칸(.island) 높이는 그대로라 되먹임이 없다
import { computed, reactive, ref, watch, watchEffect } from 'vue';

export type HeadPref = 'auto' | 'normal' | 'compact';
export const AUTO_BELOW = 640;
export const AUTO_ABOVE = 680;
const KEY = 'wb.headDensity';
function read(): HeadPref {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'compact' || v === 'normal' ? v : 'auto';
  } catch {
    return 'auto';
  }
}
export const headPref = ref<HeadPref>(read());
watch(headPref, (v) => {
  try {
    localStorage.setItem(KEY, v);
  } catch {}
});

// 머리가 든 칸마다 지금 높이(숨은 칸은 0 이라 뺀다)
const heights = reactive(new Map<number, number>());
const low = ref(false);
watchEffect(() => {
  const hs = [...heights.values()].filter((h) => h > 0);
  if (!hs.length) return void (low.value = false);
  const min = Math.min(...hs);
  if (low.value ? min > AUTO_ABOVE : min < AUTO_BELOW) low.value = !low.value;
});
export const headCompact = computed(() => headPref.value === 'compact' || (headPref.value === 'auto' && low.value));

let seq = 0;
// 머리를 둘러싼 칸(.island, 없으면 부모)의 높이를 지켜본다. 돌려준 함수로 그만
export function watchPanel(el: HTMLElement): () => void {
  const box = (el.closest('.island') as HTMLElement | null) ?? el.parentElement;
  if (!box || typeof ResizeObserver === 'undefined') return () => {};
  const id = ++seq;
  const ro = new ResizeObserver(([e]) => heights.set(id, e.contentRect.height));
  ro.observe(box);
  return () => {
    ro.disconnect();
    heights.delete(id);
  };
}
