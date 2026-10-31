<script setup lang="ts">
// 디자인 시스템 부품 Callout: 아이콘 + 글 상자(Workstyle · Callout, tone default · acc · prop)
import Icon from './Icon.vue';
import type { IconName } from './icons';

withDefaults(defineProps<{ icon?: IconName; tone?: 'default' | 'acc' | 'prop' }>(), { icon: 'info', tone: 'default' });
</script>

<template>
  <div class="callout" :class="tone !== 'default' ? tone : undefined">
    <span class="ic"><Icon :name="icon" /></span>
    <div class="grow"><slot /></div>
  </div>
</template>
