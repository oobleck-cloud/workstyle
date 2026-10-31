<script setup lang="ts">
// 디자인 시스템 부품 SpaceDot: 사이드바 아래 공간 점(Workstyle · SpaceDot). 지금 공간은 aria-current, 기다리는 일이 있으면 alert 점
defineProps<{ initial: string; current?: boolean; alert?: boolean; color?: string; label?: string }>();
</script>

<template>
  <button class="space-dot" type="button" :aria-current="current ? 'true' : undefined" :aria-label="label" :title="label" :style="current && color ? { background: color } : undefined">
    {{ initial }}<span v-if="alert" class="dot-alert"></span>
  </button>
</template>
