<script setup lang="ts">
// Workstyle IconButton. size md(28) | sm(24). 아이콘은 기본 칸에.
withDefaults(defineProps<{ size?: 'md' | 'sm'; label: string; title?: string }>(), { size: 'md' });
</script>

<template>
  <button type="button" class="btn icon" :class="size === 'sm' ? 'sm' : ''" :aria-label="label" :title="title ?? label">
    <slot />
  </button>
</template>
