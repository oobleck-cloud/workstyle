<script setup lang="ts">
// 디자인 시스템 부품 PageIcon: 페이지 아이콘 칸(Workstyle · PageIcon, lg 52 · md 36 · sm 22)
import Icon from './Icon.vue';
import type { IconName } from './icons';

withDefaults(defineProps<{ icon: IconName; size?: 'lg' | 'md' | 'sm' }>(), { size: 'lg' });
</script>

<template>
  <span class="page-icon" :class="size !== 'lg' ? size : undefined"><Icon :name="icon" :size="size === 'sm' ? 12 : 16" /></span>
</template>
