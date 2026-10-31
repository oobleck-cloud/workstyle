<script setup lang="ts">
// 디자인 시스템 부품 BlockRow: 블록 한 줄(Workstyle · BlockRow). 가리키면 왼쪽에 ⊕(아래에 블록 더하기) · 끌기 손잡이(누르면 블록 메뉴)
import Icon from './Icon.vue';

defineProps<{ selected?: boolean; draggable?: boolean }>();
const emit = defineEmits<{ add: []; menu: [e: MouseEvent]; dragstart: [e: DragEvent] }>();
</script>

<template>
  <div class="block-row" :aria-selected="selected ? 'true' : undefined">
    <span class="handle">
      <button type="button" aria-label="아래에 블록 더하기" title="아래에 블록 더하기" @click="emit('add')"><Icon name="plus" :size="14" /></button>
      <button type="button" class="grip" aria-label="블록 메뉴 · 끌어 옮기기" title="끌어 옮기기 · 눌러 메뉴" :draggable="draggable" @click="emit('menu', $event)" @dragstart="emit('dragstart', $event)"><Icon name="grip" :size="14" /></button>
    </span>
    <div class="body"><slot /></div>
  </div>
</template>
