<script setup lang="ts">
// 디자인 시스템 부품 MenuLabel: 고르기 목록 안 묶음 이름(Workstyle · MenuLabel)
defineProps<{ label: string }>();
</script>

<template>
  <div class="menu-label">{{ label }}</div>
</template>
