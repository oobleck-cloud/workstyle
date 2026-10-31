<script setup lang="ts">
// 디자인 시스템 부품 MenuItem: / 메뉴 · 고르기 목록의 한 줄(Workstyle · MenuItem). 키보드로 고른 줄은 selected
import Icon from './Icon.vue';
import type { IconName } from './icons';

defineProps<{ icon: IconName; label: string; desc?: string; selected?: boolean }>();
</script>

<template>
  <button class="menu-item" type="button" role="option" :aria-selected="selected ? 'true' : 'false'">
    <span class="mark"><Icon :name="icon" /></span>
    <span class="text"><span class="label">{{ label }}</span><span v-if="desc" class="desc">{{ desc }}</span></span>
    <slot />
  </button>
</template>
