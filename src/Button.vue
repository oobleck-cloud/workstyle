<script setup lang="ts">
// Workstyle Button. kind ghost|secondary|primary|danger, size sm|md|lg, state default|disabled.
withDefaults(defineProps<{ kind?: 'ghost' | 'secondary' | 'primary' | 'danger'; size?: 'sm' | 'md' | 'lg'; state?: 'default' | 'disabled' }>(), {
  kind: 'ghost',
  size: 'sm',
  state: 'default',
});
</script>

<template>
  <button type="button" class="btn" :class="[kind === 'ghost' ? '' : kind, size === 'md' ? '' : size]" :disabled="state === 'disabled'">
    <slot />
  </button>
</template>
