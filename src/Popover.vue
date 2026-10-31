<script setup lang="ts">
// 디자인 시스템 부품 Popover: 떠 있는 고르기 판(Workstyle · Popover). 안은 MenuLabel · MenuItem 이나 자유 내용
defineProps<{ label?: string; width?: number }>();
</script>

<template>
  <div class="popover" role="listbox" :aria-label="label" :style="width ? { width: `${width}px` } : undefined" @click.stop>
    <div v-if="label" class="menu-label">{{ label }}</div>
    <slot />
  </div>
</template>
