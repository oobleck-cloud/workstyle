<script setup lang="ts">
// 디자인 시스템 부품 Alert(Workstyle · Alert, tone info · ok · warn · bad, 스타일 ds.css)
import Icon from '../Icon.vue';
import type { IconName } from '../../icons';

const props = withDefaults(defineProps<{ tone?: 'info' | 'ok' | 'warn' | 'bad'; title?: string }>(), { tone: 'info' });
const ICON: Record<string, IconName> = { info: 'info', ok: 'check', warn: 'flag', bad: 'close' };
</script>

<template>
  <div class="alert" :class="props.tone !== 'info' ? props.tone : undefined" :role="props.tone === 'bad' ? 'alert' : 'status'">
    <span class="ic"><Icon :name="ICON[props.tone]" /></span>
    <div class="grow"><span v-if="title" class="title">{{ title }}</span><slot /></div>
  </div>
</template>
