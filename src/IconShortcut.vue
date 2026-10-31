<script setup lang="ts">
// Workstyle IconShortcut. active=true(또는 수가 있으면) 강조하고 수를 붙인다
import Icon from '../Icon.vue';
import type { IconName } from '../../icons';

defineProps<{ icon: IconName; label: string; count?: number; active?: boolean; expanded?: boolean }>();
</script>

<template>
  <button class="icon-shortcut" type="button" :title="label" :aria-label="label" :aria-pressed="active || !!count ? 'true' : 'false'" :aria-expanded="expanded === undefined ? undefined : expanded ? 'true' : 'false'">
    <Icon :name="icon" :size="16" /><span v-if="count" class="count">{{ count }}</span>
  </button>
</template>
