<script setup lang="ts">
import { ICONS, type IconName } from './icons';
defineProps<{ name: IconName; size?: number }>();
</script>
<template>
  <span class="ic" aria-hidden="true">
    <svg :width="size ?? 16" :height="size ?? 16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS[name]"></svg>
  </span>
</template>
