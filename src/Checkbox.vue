<script setup lang="ts">
// 디자인 시스템 부품 Checkbox(Workstyle · Checkbox)
import Icon from '../Icon.vue';

const checked = defineModel<boolean>({ default: false });
defineProps<{ label?: string }>();
</script>

<template>
  <button class="checkbox" type="button" role="checkbox" :aria-checked="checked ? 'true' : 'false'" :aria-label="label" @click="checked = !checked"><Icon v-if="checked" name="check" :size="11" /></button>
</template>
