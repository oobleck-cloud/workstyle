<script setup lang="ts">
// 디자인 시스템 부품 TodoItem: 할 일 한 줄(Workstyle · TodoItem). 글은 기본 칸에
import Checkbox from './Checkbox.vue';

const done = defineModel<boolean>({ default: false });
</script>

<template>
  <div class="todo-item" :class="{ done }">
    <Checkbox v-model="done" label="끝" />
    <span class="text grow"><slot /></span>
  </div>
</template>
