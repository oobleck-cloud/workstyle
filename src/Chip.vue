<script setup lang="ts">
// 디자인 시스템 부품 Chip: 필터 · 꼬리표(Workstyle · Chip, 스타일 ds.css). removable 이면 끝에 빼기 단추
import Icon from './Icon.vue';

defineProps<{ selected?: boolean; removable?: boolean }>();
const emit = defineEmits<{ remove: [] }>();
</script>

<template>
  <button class="chip" type="button" :aria-pressed="selected ? 'true' : 'false'">
    <slot /><span v-if="removable" class="x" role="button" aria-label="빼기" @click.stop="emit('remove')"><Icon name="close" :size="10" /></span>
  </button>
</template>
