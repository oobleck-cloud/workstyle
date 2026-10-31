<script setup lang="ts">
// 디자인 시스템 부품 SpacePill: 사이드바 머리의 작업공간 알약(Workstyle · SpacePill, 스타일 ds.css)
import Icon from './Icon.vue';

defineProps<{ name: string; initial: string; color?: string; open?: boolean }>();
</script>

<template>
  <button class="space-pill" type="button" :aria-expanded="open ? 'true' : 'false'" aria-haspopup="menu">
    <span class="space-mark" :style="color ? { background: color } : undefined">{{ initial }}</span>
    <span class="name">{{ name }}</span>
    <Icon name="chevron-down" :size="14" />
  </button>
</template>
