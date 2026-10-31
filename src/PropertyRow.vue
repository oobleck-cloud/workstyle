<script setup lang="ts">
// 디자인 시스템 부품 PropertyRow: 페이지 머리의 속성 한 줄(Workstyle · PropertyRow). 값은 기본 칸(slot)에, 없으면 value 글
defineProps<{ label: string; value?: string; kind?: 'text' | 'link' | 'empty' }>();
</script>

<template>
  <div class="prop-row" :class="kind && kind !== 'text' ? kind : undefined">
    <span class="label">{{ label }}</span>
    <span class="value"><slot>{{ value || '비어 있음' }}</slot></span>
  </div>
</template>
