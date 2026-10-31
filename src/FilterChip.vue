<script setup lang="ts">
// Workstyle FilterChip (판 eb12e334). state=applied 는 걸린 조건, state=add 는 점선 「필터」.
import Icon from './Icon.vue';

withDefaults(defineProps<{ state?: 'applied' | 'add'; label: string }>(), { state: 'applied' });
const emit = defineEmits<{ remove: [] }>();
</script>

<template>
  <button v-if="state === 'add'" type="button" class="filter-chip add">
    <Icon name="plus" :size="16" /><span>{{ label }}</span>
  </button>
  <button v-else type="button" class="filter-chip applied">
    <span>{{ label }}</span><span class="x" role="button" aria-label="필터 빼기" @click.stop="emit('remove')"><Icon name="close" :size="12" /></span>
  </button>
</template>
